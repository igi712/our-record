// Scenario playback for quotes.html.  It deliberately uses the viewer's
// Magia Record-style controller so scenario actions follow the same motion
// policy as viewer.html (rather than directly stopping Live2D motions).

const HCA_JS_URL = new URL('./lib/hca.js', document.baseURI);
const KEY1 = 0x01395C51;
const KEY2 = 0x00000000;

export const DEFAULT_SCENARIO_URL =
    'https://raw.githubusercontent.com/Puella-Care/en-download/refs/heads/main/magica/resource/download/asset/master/resource/scenario/json/general/100100.json';

function toMilliseconds(value) {
    const seconds = Number(value);
    return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : 0;
}

function normaliseVoiceFile(voice) {
    const name = String(voice || '').trim();
    if (!name) return null;
    if (/\.hca$/i.test(name)) return name;
    return `${name}_hca.hca`;
}

async function stopPlayer(player) {
    if (!player || player.closed) return;
    try {
        // The bundled player refuses to close a suspended context.  Resume it
        // first so a rapid sequence restart cannot leave an old voice audible.
        if (player.audioCtx?.state === 'suspended') await player.audioCtx.resume();
        await player.stop();
    } catch (error) {
        try { await player.audioCtx?.close(); } catch {}
    }
}

class HcaVoicePlayer {
    constructor() {
        this.player = null;
        this.analyser = null;
        this.worker = null;
        this.hcaModule = null;
        this.hcaBlobUrl = null;
        this.base = null;
        this.playToken = 0;
    }

    async resolveBase() {
        if (this.base) return this.base;

        try {
            if (window.MR_VOICE_BASE) return (this.base = String(window.MR_VOICE_BASE).replace(/\/$/, ''));
            const saved = localStorage.getItem('mrVoiceBase');
            if (saved) return (this.base = String(saved).replace(/\/$/, ''));
            const queryBase = new URLSearchParams(window.location.search).get('voiceBase');
            if (queryBase) return (this.base = queryBase.replace(/\/$/, ''));
        } catch {}

        const localBase = './assets/ma-re-data/resource/sound_native/voice';
        try {
            const probe = await fetch(`${localBase}/vo_char_1001_00_01_hca.hca`, {
                method: 'HEAD', cache: 'no-store'
            });
            if (probe.ok) return (this.base = localBase);
        } catch {}

        return (this.base = 'https://raw.githubusercontent.com/igi712/ma-re-data/main/resource/sound_native/voice');
    }

    async initDecoder() {
        if (this.worker) return;
        const response = await fetch(HCA_JS_URL.href);
        this.hcaBlobUrl = URL.createObjectURL(new Blob([await response.arrayBuffer()], {
            type: 'text/javascript'
        }));
        this.hcaModule = await import(this.hcaBlobUrl);
        this.worker = await this.hcaModule.HCAWorker.create(this.hcaBlobUrl);
    }

    async play(fileName, { onAnalyserReady, onEnded } = {}) {
        await this.stop();
        const token = ++this.playToken;
        await this.initDecoder();

        const base = await this.resolveBase();
        const response = await fetch(`${base}/${fileName}`);
        if (!response.ok) throw new Error(`Failed to load voice ${fileName}: ${response.status}`);

        const encrypted = new Uint8Array(await response.arrayBuffer());
        const decrypted = await this.worker.decrypt(encrypted, KEY1, KEY2);
        const player = await this.hcaModule.HCAWebAudioLoopPlayer.create(decrypted, this.worker);
        if (token !== this.playToken) {
            await stopPlayer(player);
            return;
        }

        // HCAWebAudioLoopPlayer connects straight to its gain node.  Insert an
        // analyser in that path to drive ParamMouthOpenY from the actual voice.
        const analyser = player.audioCtx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.65;
        player.bufSrc.disconnect();
        player.bufSrc.connect(analyser);
        analyser.connect(player.gainNode);
        player.bufSrc.loop = false;
        player.playInBackground = true;
        player.bufSrc.onended = () => {
            if (token !== this.playToken) return;
            if (this.player === player) {
                this.player = null;
                this.analyser = null;
            }
            onEnded?.();
        };

        this.player = player;
        this.analyser = analyser;
        onAnalyserReady?.(analyser, new Uint8Array(analyser.frequencyBinCount));
        player.play();
    }

    async stop() {
        ++this.playToken;
        const player = this.player;
        this.player = null;
        this.analyser = null;
        await stopPlayer(player);
    }

    resume() {
        if (this.player?.audioCtx?.state === 'suspended') this.player.audioCtx.resume();
    }
}

export class ScenarioSequencePlayer {
    constructor({ controller, subtitleElement }) {
        this.controller = controller;
        this.subtitleElement = subtitleElement;
        this.voice = new HcaVoicePlayer();
        this.timer = null;
        this.runToken = 0;
    }

    async loadAndPlay(url, groupName) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load scenario: ${response.status}`);
        const scenario = await response.json();
        return this.playGroup(scenario?.story?.[groupName], groupName);
    }

    playGroup(group, groupName = 'group') {
        if (!Array.isArray(group)) throw new Error(`Scenario ${groupName} is not an action list`);
        this.stop();
        const token = this.runToken;
        const steps = group.slice();

        const runNext = () => {
            if (token !== this.runToken) return;
            const step = steps.shift();
            if (!step) return;
            this.applyStep(step, token);
            this.timer = setTimeout(runNext, toMilliseconds(step.autoTurnFirst));
        };
        runNext();
    }

    stop() {
        ++this.runToken;
        if (this.timer) clearTimeout(this.timer);
        this.timer = null;
        this.voice.stop();
        this.controller?.setMic?.(false);
        this.controller?.setMouth?.(0, false);
        this.clearSubtitle();
    }

    resumeAudio() {
        this.voice.resume();
    }

    applyStep(step, token) {
        const action = Array.isArray(step?.chara) ? step.chara[0] : null;
        if (!action) return;

        if (action.textHomeStatus === 'Clear') {
            this.clearSubtitle();
            return;
        }

        if (typeof action.cheek === 'number') this.controller?.setCheek?.(action.cheek, false);
        if (action.face) this.controller?.setExpressionByName?.(action.face);

        if (typeof action.motion === 'number') {
            const motionIndex = this.controller?.motionIndexByNumber?.get(action.motion);
            if (typeof motionIndex === 'number') {
                this.controller.startMotion(this.controller.defaultMotionGroup, motionIndex);
            } else {
                console.warn('[quotes] Scenario motion is not available on this model:', action.motion);
            }
        }

        if (typeof action.textHome === 'string') this.showSubtitle(action.textHome);

        const voiceFile = normaliseVoiceFile(action.voice);
        if (!voiceFile) return;
        this.voice.play(voiceFile, {
            onAnalyserReady: (analyser, buffer) => {
                if (token === this.runToken) this.controller?.setMic?.(true, analyser, buffer, 1);
            },
            onEnded: () => {
                if (token !== this.runToken) return;
                this.controller?.setMic?.(false);
                this.controller?.setMouth?.(0, false);
            }
        }).catch((error) => console.warn('[quotes] voice playback error:', error));
    }

    showSubtitle(text) {
        if (!this.subtitleElement) return;
        this.subtitleElement.textContent = String(text).replace(/@/g, '\n');
        this.subtitleElement.hidden = false;
    }

    clearSubtitle() {
        if (!this.subtitleElement) return;
        this.subtitleElement.textContent = '';
        this.subtitleElement.hidden = true;
    }
}
