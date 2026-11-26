// js/config-top.js — Settings (#/ConfigTop) controller

import { getCommittedHomeBg, setCommittedHomeBg } from './background-set.js';
import { resolveSavedHomeBackground, DEFAULT_HOME_BGM_FILE } from './home-bg.js';
import { changeBg, preloadBg, setBgPortrait, setBgWebcamVideo } from './engine/bg.js';
import {
    startBgm,
    startSe,
    getVolumeSteps,
    setBgmVolumeStep,
    setSeVolumeStep,
    setVoiceVolumeStep
} from './engine/audio.js';
import {
    clearStageModels
} from './engine/l2d-stage.js';
import {
    getPlayerName,
    getPlayerId,
    openNameChangePopup,
    openConfigNoticePopup,
    copyTextToClipboard
} from './popups.js';

const CONFIG_COMMON_BG = { dir: 'web', file: 'web_common.ExportJson', id: 'web_common' };

let activeController = null;
let configTopActive = false;
let configRequestToken = 0;

function syncConfigControls() {
    const nameEl = document.getElementById('configUserName');
    const idEl = document.getElementById('configPlayerId');
    const bgmSlider = document.getElementById('bgmSlider');
    const soundSlider = document.getElementById('soundSlider');
    const voiceSlider = document.getElementById('voiceSlider');

    if (nameEl) nameEl.textContent = getPlayerName();
    if (idEl) idEl.textContent = getPlayerId();

    const steps = getVolumeSteps();
    if (bgmSlider) bgmSlider.value = String(steps.bgm);
    if (soundSlider) soundSlider.value = String(steps.se);
    if (voiceSlider) voiceSlider.value = String(steps.voice);
}

function setupConfigTopView() {
    resetConfigTop();
    activeController = new AbortController();
    const { signal } = activeController;

    const root = document.getElementById('ConfigTop');
    if (!root) return;

    syncConfigControls();

    const bgmSlider = document.getElementById('bgmSlider');
    const soundSlider = document.getElementById('soundSlider');
    const voiceSlider = document.getElementById('voiceSlider');

    bgmSlider?.addEventListener('input', (e) => {
        setBgmVolumeStep(Number(e.target.value));
    }, { signal });

    soundSlider?.addEventListener('input', (e) => {
        setSeVolumeStep(Number(e.target.value));
    }, { signal });

    soundSlider?.addEventListener('change', (e) => {
        const val = Number(e.target.value);
        if (val > 0) startSe(1008);
    }, { signal });

    voiceSlider?.addEventListener('input', (e) => {
        setVoiceVolumeStep(Number(e.target.value));
    }, { signal });

    document.getElementById('nameChange')?.addEventListener('click', (e) => {
        e.preventDefault();
        openNameChangePopup({
            currentName: getPlayerName(),
            onSave: (newName) => {
                const nameEl = document.getElementById('configUserName');
                if (nameEl) nameEl.textContent = newName;
            }
        });
    }, { signal });

    document.getElementById('idCopy')?.addEventListener('click', (e) => {
        e.preventDefault();
        copyTextToClipboard(getPlayerId()).then(() => {
            openConfigNoticePopup('Player ID', 'Copied to your clipboard.', 'OK');
        });
    }, { signal });

    root.addEventListener('pointerdown', (e) => {
        const btn = e.target.closest('#ConfigTop .sb_gold_01');
        if (btn) btn.classList.add('touch');
    }, { signal });

    const clearTouch = () => {
        root.querySelectorAll('.touch').forEach((el) => el.classList.remove('touch'));
    };
    window.addEventListener('pointerup', clearTouch, { signal });
    window.addEventListener('pointercancel', clearTouch, { signal });
}

export function resetConfigTop() {
    if (activeController) {
        activeController.abort();
        activeController = null;
    }
}

export async function enterConfigTop({ onBeforeReveal, hadLive2d = false } = {}) {
    configTopActive = true;
    const token = ++configRequestToken;

    const step1Start = performance.now();
    let bgTarget = CONFIG_COMMON_BG;
    const bgPreloadTask = preloadBg(CONFIG_COMMON_BG).catch((err) => {
        console.warn('[config-top] web_common BG preload failed, falling back:', err);
        bgTarget = 'bg/web/web_0015.ExportJson';
        return preloadBg(bgTarget).catch(() => {});
    });

    const bgmTask = (async () => {
        const savedBg = getCommittedHomeBg() || await resolveSavedHomeBackground();
        if (token !== configRequestToken || !configTopActive) return;
        setCommittedHomeBg(savedBg);
        await startBgm(savedBg.bgmFile, { autoplay: true }).catch((err) => {
            console.warn('[config-top] BGM load failed, falling back to default:', err);
            return startBgm(DEFAULT_HOME_BGM_FILE, { autoplay: true }).catch(() => {});
        });
    })();

    await Promise.all([bgPreloadTask, bgmTask]);
    if (token !== configRequestToken || !configTopActive) return;

    if (hadLive2d) {
        const elapsed = performance.now() - step1Start;
        if (elapsed < 200) {
            await new Promise((r) => setTimeout(r, 200 - elapsed));
        }
        if (token !== configRequestToken || !configTopActive) return;
    }

    document.getElementById('ui-layer')?.classList.remove('home-mode', 'menu-closed');
    setBgWebcamVideo(null);
    setBgPortrait(false);

    clearStageModels();
    await changeBg(bgTarget, { visible: true, autoplay: true, crossfadeMs: 250, waitForCrossfade: true }).catch((err) => {
        console.warn('[config-top] web_common BG failed, falling back:', err);
        return changeBg('bg/web/web_0015.ExportJson', { visible: true, autoplay: true, crossfadeMs: 250, waitForCrossfade: true });
    });
    if (token !== configRequestToken || !configTopActive) return;

    document.body.classList.remove('connecting');
    setupConfigTopView();
    if (typeof onBeforeReveal === 'function') {
        onBeforeReveal();
    }
}

export function leaveConfigTop() {
    configTopActive = false;
    configRequestToken++;
    resetConfigTop();
}
