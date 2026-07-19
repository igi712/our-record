// quotes-main.js — quotes.html module entry point
// Wires up: cocos-to-pixi background, HCA BGM loop, and the default Live2D model.
// Differences from viewer.html: no controls, no follow-on-click.
import { loadCocosStudioAssets, CocosStudioArmature } from './lib/cocos-to-pixi.js';
import { loadModel, state } from './model.js';
import { preloadModelToRam } from './model-assets.js';
import { DEFAULT_SCENARIO_URL, ScenarioSequencePlayer, preloadScenarioVoices, scenarioCache } from './quotes-sequence.js';

// ---- World constants (must match viewer.js) ----
const WORLD_W = 1024;
const WORLD_H = 768;
const HOME16_H = 576;

// ---- Cocos-to-pixi background ----
let bgArmature = null;

async function initBackground() {
    const assets = await loadCocosStudioAssets('bg/web/web_0015.ExportJson');
    bgArmature = new CocosStudioArmature(assets.json, assets.textures, assets.particles);

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

const CHARA_ATTRIBUTES = {
    1001: 'light',  // Iroha
    1002: 'light',  // Madoka
    1003: 'dark',   // Homura
    1004: 'water',  // Sayaka
    1005: 'timber', // Mami
    1006: 'fire',   // Kyoko
    1007: 'water',  // Yachiyo
    1008: 'fire',   // Tsuruno
    1009: 'dark',   // Felicia
    1010: 'timber', // Sana
    1011: 'fire',   // Momoko
    1012: 'timber', // Kaede
    1013: 'water',  // Rena
    1014: 'void',   // Mitama
    1015: 'fire',   // Karin
    1016: 'timber', // Alina
    1017: 'dark',   // Mifuyu
    1018: 'fire',   // Touka
    1019: 'light',  // Nemu
    1020: 'dark',   // Ui
    1021: 'dark',   // Sakurako
    1022: 'light',  // Iroha (Anime Ver.)
    1023: 'water',  // Yachiyo (Anime Ver.)
    1024: 'dark',   // Kuroe
};

function updateUILayer() {
    const uiLayer = document.getElementById('ui-layer');
    if (!uiLayer) return;
    const camera = window.cameraContainer;
    if (!camera) return;
    uiLayer.style.left = `${camera.x}px`;
    uiLayer.style.top = `${camera.y}px`;
    uiLayer.style.transform = `scale(${camera.scale.x})`;
}

async function loadCharaMetadata(charaId) {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Puella-Care/en-data/refs/heads/main/charaList.json');
        if (!response.ok) return;
        const charas = await response.json();
        const chara = charas.find(c => Number(c.id) === Number(charaId));
        if (chara) {
            const nameEl = document.getElementById('charaNameText');
            const kanaEl = document.getElementById('charaKanaText');
            if (nameEl) nameEl.textContent = chara.name;
            if (kanaEl) {
                kanaEl.textContent = chara.kana || chara.name;
            }
        }
    } catch (e) {
        console.warn('[quotes] Failed to load character metadata:', e);
    }
}

async function resolveScenarioBase() {
    return 'https://raw.githubusercontent.com/Puella-Care/en-download/refs/heads/main/magica/resource/download/asset/master/resource/scenario/json/general';
}

function setupVoiceButtons() {
    const voiceBtns = document.querySelectorAll('.voiceBtn');
    voiceBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            document.querySelectorAll('.voiceBtn.current').forEach(b => b.classList.remove('current'));
            btn.classList.add('current');
            
            const voiceId = btn.getAttribute('data-voice');
            const charaId = state.currentCharacterId || 1001;
            const voicePrefix = '00';
            
            const voiceKey = `vo_char_${charaId}_${voicePrefix}_${voiceId}`;
            const scenarioBase = await resolveScenarioBase();
            const scenarioUrl = `${scenarioBase}/${charaId}00.json`;
            
            console.log(`[quotes] Play voice button clicked. key: ${voiceKey}, url: ${scenarioUrl}`);
            
            try {
                if (scenarioPlayer) {
                    await scenarioPlayer.loadAndPlayVoice(scenarioUrl, voiceKey, charaId);
                }
            } catch (err) {
                console.error('[quotes] Error playing voice button:', err);
            }
        });
    });
}

function setupBackBtn() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
}

function setupVoiceSettings() {
    const voiceCheck = document.querySelector('.voiceCheck');
    if (voiceCheck) {
        voiceCheck.addEventListener('click', () => {
            voiceCheck.classList.toggle('on');
        });
    }
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

    // Initialize UI scaling immediately so it is positioned correctly from the start.
    updateUILayer();
    window.addEventListener('resize', updateUILayer);
    window.app.ticker.add(updateUILayer);

    // Make UI layer visible now that it is correctly positioned and scaled
    const uiLayer = document.getElementById('ui-layer');
    if (uiLayer) {
        uiLayer.style.display = 'block';
    }

    // Parse the character ID dynamically from URL parameters
    const params = new URLSearchParams(window.location.search);
    const charaIdParam = params.get('charaId') || params.get('id');
    if (charaIdParam) {
        state.currentCharacterId = Number(charaIdParam);
    }
    const charaId = state.currentCharacterId || 1001;
    const defaultModelId = String(charaId) + '00';

    // Instantiate scenario player early
    scenarioPlayer = new ScenarioSequencePlayer({
        controller: null,
        subtitleElement: document.getElementById('subtitle')
    });

    // Load the scenario JSON first and cache it
    const scenarioBase = await resolveScenarioBase();
    const scenarioUrl = `${scenarioBase}/${charaId}00.json`;
    let scenarioJson = null;
    try {
        const resp = await fetch(scenarioUrl);
        if (resp.ok) {
            scenarioJson = await resp.json();
            scenarioCache.set(scenarioUrl, scenarioJson);
            console.info(`[quotes] Scenario JSON loaded and cached: ${scenarioUrl}`);
        } else {
            console.warn(`[quotes] Failed to load scenario JSON from ${scenarioUrl}`);
        }
    } catch (e) {
        console.warn(`[quotes] Error loading scenario JSON:`, e);
    }

    // Parse scenario to find unique models, expressions, motions, and voices
    const allowedModels = new Set();
    const allowedExpressions = new Set();
    const allowedMotions = new Set();
    const allowedVoices = new Set();

    allowedModels.add(defaultModelId);

    if (scenarioJson && scenarioJson.story) {
        Object.values(scenarioJson.story).forEach(steps => {
            if (Array.isArray(steps)) {
                steps.forEach(step => {
                    if (Array.isArray(step.chara)) {
                        step.chara.forEach(c => {
                            if (c.id) allowedModels.add(String(c.id));
                            if (c.face) {
                                const normFace = c.face.replace(/\.exp3\.json$/, '').replace(/\.exp\.json$/, '').replace(/\.json$/, '');
                                allowedExpressions.add(normFace);
                            }
                            if (typeof c.motion === 'number') {
                                allowedMotions.add(c.motion);
                            }
                            if (c.voice) {
                                allowedVoices.add(c.voice);
                            }
                        });
                    }
                });
            }
        });
    }

    // Setup parallel preloading promises
    const modelPreloadPromises = Array.from(allowedModels).map(modelId =>
        preloadModelToRam(modelId, { allowedExpressions, allowedMotions })
    );
    const voicePreloadPromise = preloadScenarioVoices(Array.from(allowedVoices), scenarioPlayer.voice);

    // Load background, BGM, required model files, and voice lines in parallel.
    // Keep loading indicator showing until all are complete.
    await Promise.all([
        initBackground().catch((e) => console.warn('[quotes] background error:', e)),
        playTrack('bgm02_anime11_hca.hca').catch((e) => console.warn('[quotes] bgm error:', e)),
        ...modelPreloadPromises.map(p => p.catch((e) => console.warn('[quotes] model preload error:', e))),
        voicePreloadPromise.catch((e) => console.warn('[quotes] voice preload error:', e))
    ]);

    document.body.classList.remove('connecting');

    // Resume audio on first user interaction if Chrome suspended the context.
    setupAudioAutoResume();

    // Render the default model (from RAM cache, instantly!)
    try {
        await loadModel(defaultModelId, {
            interactive: false,
            allowedExpressions,
            allowedMotions
        });

        // Set the active controller on our scenario player
        scenarioPlayer.controller = state.currentController;

        const attribute = CHARA_ATTRIBUTES[charaId] || 'light';
        const attEl = document.getElementById('att');
        if (attEl) attEl.className = attribute;

        loadCharaMetadata(charaId);
        setupVoiceButtons();
        setupBackBtn();
        setupVoiceSettings();
    } catch (e) {
        console.error('[quotes] model load failed:', e);
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
