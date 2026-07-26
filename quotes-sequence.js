// Scenario playback for quotes.html.  It deliberately uses the viewer's
// Magia Record-style controller so scenario actions follow the same motion
// policy as viewer.html (rather than directly stopping Live2D motions).

const HCA_JS_URL = new URL('./lib/hca.js', document.baseURI);
const KEY1 = 0x01395C51;
const KEY2 = 0x00000000;

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

export const scenarioCache = new Map();
export const voiceCache = new Map();

export async function preloadScenarioVoices(voices, voicePlayer) {
    if (!voices || voices.length === 0) return;
    try {
        await voicePlayer.initDecoder();
        const base = await voicePlayer.resolveBase();
        const promises = voices.map(async (voice) => {
            const fileName = normaliseVoiceFile(voice);
            if (!fileName || voiceCache.has(fileName)) return;
            try {
                const response = await fetch(`${base}/${fileName}`);
                if (!response.ok) return;
                const encrypted = new Uint8Array(await response.arrayBuffer());
                const decrypted = await voicePlayer.worker.decrypt(encrypted, KEY1, KEY2);
                voiceCache.set(fileName, decrypted);
                console.info(`[quotes] Preloaded voice: ${fileName}`);
            } catch (e) {
                console.warn(`[quotes] Failed to preload voice ${fileName}:`, e);
            }
        });
        await Promise.all(promises);
    } catch (e) {
        console.warn(`[quotes] preloadScenarioVoices failed:`, e);
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

        let decrypted = voiceCache.get(fileName);
        if (!decrypted) {
            const base = await this.resolveBase();
            const response = await fetch(`${base}/${fileName}`);
            if (!response.ok) throw new Error(`Failed to load voice ${fileName}: ${response.status}`);

            const encrypted = new Uint8Array(await response.arrayBuffer());
            decrypted = await this.worker.decrypt(encrypted, KEY1, KEY2);
            voiceCache.set(fileName, decrypted);
        }

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

const OUTFIT_GROUP_STEP_DELAYS_MS = {
    // Karin & Alina Halloween Self Introduction 1 (group_1) only
    '111200_group_1': 100,
    '111201_group_1': 100,
    '111202_group_1': 100,
};

export class ScenarioSequencePlayer {
    constructor({ controller, controllers, subtitleElement, stepDelayMs = 0 } = {}) {
        this.controller = controller || null;
        this.controllers = controllers || new Map();
        this.subtitleElement = subtitleElement;
        this.stepDelayMs = stepDelayMs;
        this.voice = new HcaVoicePlayer();
        this.timer = null;
        this.buttonResetTimeout = null;
        this.runToken = 0;
        this.activeAnalyser = null;
        this.activeBuffer = null;
    }

    setControllers(controllersMap, primaryController = null) {
        this.controllers = controllersMap || new Map();
        if (primaryController) {
            this.controller = primaryController;
        } else if (this.controllers.size > 0) {
            this.controller = this.controllers.values().next().value;
        } else {
            this.controller = null;
        }
    }

    getControllerForAction(action) {
        if (!action) return this.controller;
        if (this.controllers.size > 0) {
            if (action.id != null && this.controllers.has(String(action.id))) {
                return this.controllers.get(String(action.id));
            }
            if (action.id != null && this.controllers.has(Number(action.id))) {
                return this.controllers.get(Number(action.id));
            }
            if (action.pos != null && this.controllers.has(`pos_${action.pos}`)) {
                return this.controllers.get(`pos_${action.pos}`);
            }
            if (action.pos != null && this.controllers.has(action.pos)) {
                return this.controllers.get(action.pos);
            }
        }
        return this.controller;
    }

    async loadAndPlay(url, groupName) {
        let scenario = scenarioCache.get(url);
        if (!scenario) {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load scenario: ${response.status}`);
            scenario = await response.json();
            scenarioCache.set(url, scenario);
        }
        return this.playGroup(scenario?.story?.[groupName], groupName);
    }

    async loadAndPlayVoice(url, voiceKey, charaId) {
        let scenario = scenarioCache.get(url);
        if (!scenario) {
            const response = await fetch(url).catch(() => null);
            if (response && response.ok) {
                scenario = await response.json();
                scenarioCache.set(url, scenario);
            }
        }

        let foundGroup = null;
        let groupName = null;
        if (scenario?.story) {
            for (const [gName, steps] of Object.entries(scenario.story)) {
                const hasVoice = steps.some(step =>
                    step.chara?.some(c => c.voice === voiceKey || c.voice === voiceKey + "_hca")
                );
                if (hasVoice) {
                    foundGroup = steps;
                    groupName = gName;
                    break;
                }
            }
        }

        if (foundGroup) {
            return this.playGroup(foundGroup, groupName);
        } else {
            console.warn(`[quotes] Voice key ${voiceKey} not found in scenario. Playing audio fallback.`);
            const fallbackGroup = [{
                autoTurnFirst: 4.0,
                chara: [{
                    id: Number(charaId + "00"),
                    voice: voiceKey,
                    motion: 300,
                    face: "mtn_ex_010.exp.json"
                }]
            }];
            return this.playGroup(fallbackGroup, 'fallback_voice');
        }
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
            this.applyStep(step, token, steps, runNext, groupName);
        };
        runNext();
    }

    stop() {
        ++this.runToken;
        if (this.timer) clearTimeout(this.timer);
        this.timer = null;
        if (this.buttonResetTimeout) {
            clearTimeout(this.buttonResetTimeout);
            this.buttonResetTimeout = null;
        }
        this.activeAnalyser = null;
        this.activeBuffer = null;
        this.voice.stop();
        if (this.controllers.size > 0) {
            this.controllers.forEach(ctrl => {
                ctrl?.setMic?.(false);
                ctrl?.setMouth?.(0, false);
            });
        } else {
            this.controller?.setMic?.(false);
            this.controller?.setMouth?.(0, false);
        }
        this.clearSubtitle();
        try {
            document.querySelectorAll('.voiceBtn.current').forEach(b => b.classList.remove('current'));
        } catch (e) {}
    }

    resumeAudio() {
        this.voice.resume();
    }

    updateLipSyncForStep(actions) {
        if (!this.activeAnalyser) return;

        if (this.controllers.size > 1) {
            // Dual-unit mode: check if step explicitly specifies speaker changes (lipSynch === 1 or 0)
            const hasExplicitSpeakerSetting = actions.some(a => a.lipSynch === 1 || a.lipSynch === 0 || a.voice);
            if (hasExplicitSpeakerSetting) {
                actions.forEach(action => {
                    const ctrl = this.getControllerForAction(action);
                    if (!ctrl) return;
                    const isSpeaking = action.lipSynch === 1 || (action.lipSynch !== 0 && action.voice);
                    if (isSpeaking) {
                        ctrl.setMic?.(true, this.activeAnalyser, this.activeBuffer, 1);
                    } else if (action.lipSynch === 0) {
                        ctrl.setMic?.(false);
                        ctrl.setMouth?.(0, false);
                    }
                });
            }
        } else {
            // Single-unit mode: as long as voice audio is playing (activeAnalyser is present), keep mic active on the model!
            const singleCtrl = this.controller;
            if (singleCtrl) {
                singleCtrl.setMic?.(true, this.activeAnalyser, this.activeBuffer, 1);
            }
        }
    }

    applyStep(step, token, remainingSteps, runNext, groupName = 'group') {
        const actions = Array.isArray(step?.chara) ? step.chara : [];
        if (actions.length === 0) return;

        const firstAction = actions[0];
        if (firstAction.textHomeStatus === 'Clear') {
            this.clearSubtitle();
            if (remainingSteps && remainingSteps.length > 0 && typeof runNext === 'function') {
                runNext();
            }
            return;
        }

        const applyVisuals = () => {
            actions.forEach(action => {
                const ctrl = this.getControllerForAction(action);
                if (!ctrl) return;

                if (typeof action.zOrder === 'number' && ctrl.model) {
                    ctrl.model.zIndex = action.zOrder;
                    if (window.worldContainer) {
                        window.worldContainer.sortableChildren = true;
                        try { window.worldContainer.sortChildren(); } catch (e) {}
                    }
                }

                if (typeof action.cheek === 'number') ctrl.setCheek?.(action.cheek, false);
                if (action.face) ctrl.setExpressionByName?.(action.face);
                if (typeof action.eyeClose === 'number') {
                    if (typeof ctrl.setEyeClosed === 'function') {
                        ctrl.setEyeClosed(action.eyeClose === 1, false);
                    } else if (typeof ctrl.setEyeClose === 'function') {
                        ctrl.setEyeClose(action.eyeClose === 1, false);
                    }
                }

                if (typeof action.motion === 'number') {
                    const motionIndex = ctrl.motionIndexByNumber?.get(action.motion);
                    if (typeof motionIndex === 'number') {
                        ctrl.startMotion(ctrl.defaultMotionGroup, motionIndex);
                    } else {
                        console.warn('[quotes] Scenario motion is not available on model:', action.motion);
                    }
                }

                if (typeof action.textHome === 'string') this.showSubtitle(action.textHome);

                if (action.voice) {
                    const parts = String(action.voice).replace(/\.hca$/i, '').split('_');
                    const voiceId = parts[parts.length - 1];
                    if (voiceId) {
                        if (this.buttonResetTimeout) {
                            clearTimeout(this.buttonResetTimeout);
                            this.buttonResetTimeout = null;
                        }
                        document.querySelectorAll('.voiceBtn.current').forEach(b => b.classList.remove('current'));
                        const activeBtn = document.querySelector(`.voiceBtn[data-voice="${voiceId}"]`);
                        if (activeBtn) activeBtn.classList.add('current');
                    }
                }
            });

            this.updateLipSyncForStep(actions);
        };

        const voiceAction = actions.find(a => a.voice);
        const voiceFile = normaliseVoiceFile(voiceAction?.voice);

        const autoTurnFirst = step.autoTurnFirst;
        const autoTurnLast = step.autoTurnLast;

        const scheduleNext = () => {
            if (remainingSteps && remainingSteps.length > 0 && typeof runNext === 'function') {
                let extraDelay = this.stepDelayMs || 0;
                if (firstAction?.id != null) {
                    const outfitIdStr = String(firstAction.id);
                    const key = groupName ? `${outfitIdStr}_${groupName}` : outfitIdStr;
                    if (OUTFIT_GROUP_STEP_DELAYS_MS[key] != null) {
                        extraDelay = OUTFIT_GROUP_STEP_DELAYS_MS[key];
                    } else if (OUTFIT_GROUP_STEP_DELAYS_MS[outfitIdStr] != null) {
                        extraDelay = OUTFIT_GROUP_STEP_DELAYS_MS[outfitIdStr];
                    }
                }

                const rawTurn = autoTurnFirst || (!voiceFile ? autoTurnLast : null);
                if (rawTurn) {
                    const delay = toMilliseconds(rawTurn) + extraDelay;
                    if (delay > 0) {
                        this.timer = setTimeout(() => {
                            if (token === this.runToken) runNext();
                        }, delay);
                    }
                }
            }
        };

        if (voiceFile) {
            this.voice.play(voiceFile, {
                onAnalyserReady: (analyser, buffer) => {
                    if (token !== this.runToken) return;
                    this.activeAnalyser = analyser;
                    this.activeBuffer = buffer;
                    applyVisuals();
                    scheduleNext();
                },
                onEnded: () => {
                    if (token !== this.runToken) return;
                    this.activeAnalyser = null;
                    this.activeBuffer = null;
                    actions.forEach(action => {
                        const ctrl = this.getControllerForAction(action);
                        ctrl?.setMic?.(false);
                        ctrl?.setMouth?.(0, false);
                    });

                    // Keep active button highlighted for 2 seconds after voice finishes playing
                    if (this.buttonResetTimeout) clearTimeout(this.buttonResetTimeout);
                    this.buttonResetTimeout = setTimeout(() => {
                        if (token === this.runToken) {
                            try {
                                document.querySelectorAll('.voiceBtn.current').forEach(b => b.classList.remove('current'));
                            } catch (e) {}
                        }
                    }, 2000);

                    if (remainingSteps && remainingSteps.length > 0 && typeof runNext === 'function') {
                        if (autoTurnLast) {
                            const delay = toMilliseconds(autoTurnLast);
                            this.timer = setTimeout(() => {
                                if (token === this.runToken) runNext();
                            }, delay);
                        } else if (!autoTurnFirst) {
                            runNext();
                        }
                    }
                }
            }).catch((error) => {
                console.warn('[quotes] voice playback error:', error);
                this.activeAnalyser = null;
                this.activeBuffer = null;
                applyVisuals();
                scheduleNext();
            });
        } else {
            applyVisuals();
            scheduleNext();
        }
    }

    showSubtitle(text) {
        if (!this.subtitleElement) {
            this.subtitleElement = document.getElementById('subtitle');
        }
        if (!this.subtitleElement) return;
        this.subtitleElement.textContent = String(text).replace(/@/g, '\n');
        this.subtitleElement.hidden = false;
    }

    clearSubtitle() {
        if (!this.subtitleElement) {
            this.subtitleElement = document.getElementById('subtitle');
        }
        if (!this.subtitleElement) return;
        this.subtitleElement.textContent = '';
        this.subtitleElement.hidden = true;
    }
}
