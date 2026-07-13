// quotes-main.js — quotes.html module entry point
// Wires up: cocos-to-pixi background, HCA BGM loop, and the default Live2D model.
// Differences from viewer.html: no controls, no follow-on-click.
import { loadCocosStudioAssets, CocosStudioArmature } from './lib/cocos-to-pixi.js';
import { loadModel, state } from './model.js';
import { DEFAULT_SCENARIO_URL, ScenarioSequencePlayer } from './quotes-sequence.js';

// ---- World constants (must match viewer.js) ----
const WORLD_W = 1024;
const WORLD_H = 768;
const HOME16_H = 576;

// ---- Cocos-to-pixi background ----
let bgArmature = null;

async function initBackground() {
    const assets = await loadCocosStudioAssets('bg/web/web_0015.ExportJson');
    bgArmature = new CocosStudioArmature(assets.json, assets.textures);

    // Position so the 1024x768 bg content is vertically centered in the 1024x576 home16 view.
    // cameraMask clips to (0,0,1024,576); shifting the armature up by (768-576)/2 = 96px
    // means 96px is clipped from both top and bottom, centering the bg in the view.
    bgArmature.x = WORLD_W / 2;
    bgArmature.y = WORLD_H / 2 - (WORLD_H - HOME16_H) / 2;

    // Add behind the model (worldContainer is index 1; insert at 0).
    window.cameraContainer.addChildAt(bgArmature, 0);

    bgArmature.play('action', true);

    window.app.ticker.add((delta) => {
        if (bgArmature) bgArmature.update(delta / 60);
    });
}

// ---- HCA BGM playback ----
const HCA_JS_URL = new URL("./lib/hca.js", document.baseURI);
const KEY1 = 0x01395C51;
const KEY2 = 0x00000000;

let hcaModule = null;
let hcaBlobUrl = null;
let worker = null;
let player = null;
let scenarioPlayer = null;
let _bgmBase = null;
let _bgmBaseSource = null;

async function resolveBgmBase() {
    if (_bgmBase) return _bgmBase;

    // 1) Override: window.MR_BGM_BASE, localStorage mrBgmBase, ?bgmBase= query param
    try {
        if (window.MR_BGM_BASE) {
            _bgmBase = String(window.MR_BGM_BASE).replace(/\/$/, '');
            _bgmBaseSource = 'window.MR_BGM_BASE';
            return _bgmBase;
        }
    } catch (e) { }
    try {
        const v = localStorage.getItem('mrBgmBase');
        if (v) {
            _bgmBase = String(v).replace(/\/$/, '');
            _bgmBaseSource = 'localStorage mrBgmBase';
            return _bgmBase;
        }
    } catch (e) { }
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.has('bgmBase')) {
            _bgmBase = params.get('bgmBase').replace(/\/$/, '');
            _bgmBaseSource = 'query param bgmBase';
            return _bgmBase;
        }
    } catch (e) { }

    // 2) Local probe
    const localBase = './assets/ma-re-data/resource/sound_native/bgm';
    try {
        const probeUrl = `${localBase}/bgm02_anime11_hca.hca`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 2000);
        const resp = await fetch(probeUrl, { method: 'HEAD', cache: 'no-store', signal: controller.signal });
        clearTimeout(timer);
        if (resp && resp.ok) {
            _bgmBase = localBase;
            _bgmBaseSource = 'local (probe)';
            return _bgmBase;
        }
    } catch (e) { }

    // 3) Remote fallback
    _bgmBase = 'https://raw.githubusercontent.com/igi712/ma-re-data/main/resource/sound_native/bgm';
    _bgmBaseSource = 'default remote';
    return _bgmBase;
}

async function initWorker() {
    if (worker) return worker;

    if (!hcaBlobUrl) {
        const response = await fetch(HCA_JS_URL.href);
        const blob = new Blob([await response.arrayBuffer()], { type: "text/javascript" });
        hcaBlobUrl = URL.createObjectURL(blob);
    }

    if (!hcaModule) {
        hcaModule = await import(hcaBlobUrl);
    }

    worker = await hcaModule.HCAWorker.create(hcaBlobUrl);
    return worker;
}

async function playTrack(fileName) {
    const activeWorker = await initWorker();
    await resolveBgmBase();

    const fileResponse = await fetch(`${_bgmBase}/${fileName}`);
    if (!fileResponse.ok) {
        throw new Error(`Failed to load ${fileName}: ${fileResponse.status} ${fileResponse.statusText}`);
    }

    const hcaData = new Uint8Array(await fileResponse.arrayBuffer());
    const decrypted = await activeWorker.decrypt(hcaData, KEY1, KEY2);
    const newPlayer = await hcaModule.HCAWebAudioLoopPlayer.create(decrypted, activeWorker);

    if (player) {
        await player.stop();
    }
    player = newPlayer;
    player.playInBackground = true;
    player.play();

    console.info(`[quotes] Now playing: ${fileName} (${_bgmBaseSource})`);
}

// Chrome autoplay policy: AudioContext created before a user gesture stays suspended.
// Try to autoplay; if suspended, resume on the first pointer interaction anywhere.
function setupAudioAutoResume() {
    const resume = () => {
        if (player?.audioCtx && player.audioCtx.state === 'suspended') {
            player.audioCtx.resume();
        }
        scenarioPlayer?.resumeAudio();
    };
    window.addEventListener('pointerdown', resume);
    window.addEventListener('touchstart', resume);
    window.addEventListener('keydown', resume);
}

// ---- Init sequence ----
async function init() {
    document.body.classList.add('connecting');

    // Load background + BGM in parallel; don't reveal until both are ready.
    await Promise.all([
        initBackground().catch((e) => console.warn('[quotes] background error:', e)),
        playTrack('bgm02_anime11_hca.hca').catch((e) => console.warn('[quotes] bgm error:', e)),
    ]);

    document.body.classList.remove('connecting');

    // Resume audio on first user interaction if Chrome suspended the context.
    setupAudioAutoResume();

    // Load the default Iroha model, then run the first home dialogue group.
    // The scenario runner starts motions through the viewer controller, while
    // its HCA analyser drives the same ParamMouthOpenY hook used for mic lipsync.
    try {
        await loadModel('100100', { interactive: false });
        scenarioPlayer = new ScenarioSequencePlayer({
            controller: state.currentController,
            subtitleElement: document.getElementById('subtitle')
        });
        await scenarioPlayer.loadAndPlay(DEFAULT_SCENARIO_URL, 'group_1');
    } catch (e) {
        console.error('[quotes] model or scenario load failed:', e);
    }

    // Tap effect interaction
    window.addEventListener('pointerdown', showTapEffect, true);
}

let activeTapEffect = null;
let activeTapTimeout = null;

function showTapEffect(e) {
    const camera = window.cameraContainer;
    const viewport = window.VIEWPORT;
    if (!camera || !viewport) return;

    const vx = camera.x;
    const vy = camera.y;
    const scale = camera.scale.x;
    const activeW = viewport.viewW * scale;
    const activeH = viewport.viewH * scale;

    // Check if the click is within the active game viewport boundaries
    if (e.clientX < vx || e.clientX > vx + activeW || e.clientY < vy || e.clientY > vy + activeH) {
        return; // Ignore clicks outside the active game viewport
    }

    // Immediately remove previous active tap effect if any
    if (activeTapEffect) {
        activeTapEffect.remove();
        activeTapEffect = null;
    }
    if (activeTapTimeout) {
        clearTimeout(activeTapTimeout);
        activeTapTimeout = null;
    }

    // Coordinates relative to the active game viewport
    const clickX = e.clientX - vx;
    const clickY = e.clientY - vy;

    // Create container if not exists
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

    // Keep the container aligned with the active game viewport
    container.style.left = `${vx}px`;
    container.style.top = `${vy}px`;
    container.style.width = `${activeW}px`;
    container.style.height = `${activeH}px`;

    const size = 256;
    const effect = document.createElement('div');
    effect.className = 'commonEffect';
    // Position absolute inside the overflow: hidden container
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
        if (activeTapEffect === effect) {
            activeTapEffect = null;
        }
        activeTapTimeout = null;
    }, 1000);
}

init();
