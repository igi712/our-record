// magica/js/engine/common-events.js — Global UI scaling, tap ripple, audio auto-resume, and .se_* SE delegation.

import { WORLD_W, HOME16_H, resumeVoiceAudio } from './l2d-stage.js';
import { getBgWebcamVideo } from './bg.js';
import { startSe, resumeAudioContext } from './audio.js';

const SE_SELECTOR = '.se_kettei02, .se_decide, .se_cancel, .se_tabs';

let initialized = false;
let lastUILayerX = null;
let lastUILayerY = null;
let lastUILayerScale = null;
let lastWebcamEl = null;

let activeTapEffect = null;
let activeTapTimeout = null;
let tapEffectSuppressed = false;
let dragScrollActiveUntil = 0;

export function setTapEffectSuppressed(suppressed) {
    tapEffectSuppressed = Boolean(suppressed);
}

export function markDragScroll(cooldownMs = 120) {
    dragScrollActiveUntil = performance.now() + cooldownMs;
}

export function isDragScrollActive() {
    return performance.now() < dragScrollActiveUntil;
}

export function updateUILayer() {
    const uiLayer = document.getElementById('ui-layer');
    if (!uiLayer) return;
    const camera = window.cameraContainer;
    if (!camera) return;

    const x = camera.x;
    const y = camera.y;
    const scale = camera.scale.x;
    const webcamEl = getBgWebcamVideo();

    if (
        x === lastUILayerX &&
        y === lastUILayerY &&
        scale === lastUILayerScale &&
        webcamEl === lastWebcamEl
    ) {
        return;
    }

    lastUILayerX = x;
    lastUILayerY = y;
    lastUILayerScale = scale;
    lastWebcamEl = webcamEl;

    uiLayer.style.left = `${x}px`;
    uiLayer.style.top = `${y}px`;
    uiLayer.style.transform = `scale(${scale})`;

    if (webcamEl) {
        const vw = (window.VIEWPORT?.viewW || WORLD_W) * scale;
        const vh = (window.VIEWPORT?.viewH || HOME16_H) * scale;
        webcamEl.style.left = `${x}px`;
        webcamEl.style.top = `${y}px`;
        webcamEl.style.width = `${vw}px`;
        webcamEl.style.height = `${vh}px`;
    }
}

function showTapEffect(e) {
    if (tapEffectSuppressed) return;
    const camRoot = document.getElementById('CameraTop');
    if (camRoot && (camRoot.classList.contains('cameraActive') || camRoot.classList.contains('shuttering'))) {
        return;
    }

    const camera = window.cameraContainer;
    const viewport = window.VIEWPORT;
    if (!camera || !viewport) return;

    const vx = camera.x;
    const vy = camera.y;
    const scale = camera.scale.x;
    const activeW = viewport.viewW * scale;
    const activeH = viewport.viewH * scale;

    if (e.clientX < vx || e.clientX > vx + activeW || e.clientY < vy || e.clientY > vy + activeH) {
        return;
    }

    if (activeTapEffect) {
        activeTapEffect.remove();
        activeTapEffect = null;
    }
    if (activeTapTimeout) {
        clearTimeout(activeTapTimeout);
        activeTapTimeout = null;
    }

    const clickX = e.clientX - vx;
    const clickY = e.clientY - vy;

    let container = document.getElementById('tapEffectContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'tapEffectContainer';
        container.style.position = 'fixed';
        container.style.overflow = 'hidden';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '1000100';
        document.body.appendChild(container);
    }

    container.style.left = `${vx}px`;
    container.style.top = `${vy}px`;
    container.style.width = `${activeW}px`;
    container.style.height = `${activeH}px`;

    const size = 256;
    const effect = document.createElement('div');
    effect.className = 'commonEffect';
    effect.style.position = 'absolute';
    effect.style.left = `${clickX - size / 2}px`;
    effect.style.top = `${clickY - size / 2}px`;

    const e1 = document.createElement('div');
    e1.className = 'effect01';
    const e2 = document.createElement('div');
    e2.className = 'effect02';
    const e3 = document.createElement('div');
    e3.className = 'effect03';

    effect.appendChild(e1);
    effect.appendChild(e2);
    effect.appendChild(e3);

    activeTapEffect = effect;
    container.appendChild(effect);

    activeTapTimeout = setTimeout(() => {
        effect.remove();
        if (activeTapEffect === effect) activeTapEffect = null;
        activeTapTimeout = null;
    }, 1000);
}

function onGlobalSeClick(e) {
    if (isDragScrollActive()) return;
    const el = e.target?.closest?.(SE_SELECTOR);
    if (!el) return;
    if (el.classList.contains('off') || el.classList.contains('block') || el.closest('.block')) {
        return;
    }

    let seId = null;
    if (el.classList.contains('se_kettei02')) seId = 1001;
    else if (el.classList.contains('se_decide')) seId = 1002;
    else if (el.classList.contains('se_cancel')) seId = 1003;
    else if (el.classList.contains('se_tabs')) seId = 1008;

    if (seId) startSe(seId);
}

function onUserGestureResumeAudio() {
    resumeAudioContext();
    resumeVoiceAudio();
}

export function initCommonEvents() {
    if (initialized) return;
    initialized = true;

    updateUILayer();
    window.addEventListener('resize', updateUILayer);
    window.addEventListener('mrv2:viewportChange', updateUILayer);

    window.addEventListener('pointerdown', onUserGestureResumeAudio, true);
    window.addEventListener('touchstart', onUserGestureResumeAudio, true);
    window.addEventListener('keydown', onUserGestureResumeAudio, true);

    window.addEventListener('pointerdown', showTapEffect, true);
    // Capture-phase delegation so e.stopPropagation() in screen/popup handlers never drops UI SEs.
    document.addEventListener('click', onGlobalSeClick, true);
}
