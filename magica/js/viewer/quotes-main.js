// quotes-main.js — quotes.html module entry point
// Wires up: cocos-to-pixi background, HCA BGM loop, and the default Live2D model.
// Differences from viewer.html: no controls, no follow-on-click.
import { loadCocosStudioAssets, CocosStudioArmature, CocosStudioParticleEmitter, parsePlist } from '../../../lib/cocos-to-pixi.js';
import { loadModel, loadAdditionalModel, destroyCurrentModels, state, getOutfitsForCharacter, buildModelId, resolveMaReAssetsBase, findDefaultExpression } from './model.js';
import { preloadModelToRam, ramFolderCache, setAssetPreloadConnecting } from './model-assets.js';
import { ScenarioSequencePlayer, preloadScenarioVoices, scenarioCache } from './quotes-sequence.js';
import { fetchScenarioJson, checkScenarioUrlExists, getDualUnitConfig } from './model-scenario.js';
import { renderCharaCollectionGrid } from './chara-collection.js';
import { revealHomeMenu } from '../home-menu.js';
import { handleRoute } from '../router.js';
import { resolveSavedHomeBackground, loadCocosBackgroundAssets, DEFAULT_HOME_BG_FILE, DEFAULT_HOME_BGM_FILE } from '../home-bg.js';
import { getFavoriteCharaId, setFavoriteCharaId } from '../chara-top.js';

let activeVoicePrefix = '00';
let activeScenarioUrl = '';
let outfitChangeToken = 0;
let homeLoadPromise = null;
let homeGeneration = 0;
let homeActive = false;
let bgSetActive = false;
let charaTopActive = false;
let homeSceneMounted = false;
let homeReady = false;
let homeRevealed = false;
let homeNeedsRespawn = false;
let homeLoadedCharaId = null;
let homePendingCharaId = null;
let homeTeardownPromise = null;
let homeStopPromise = null;
let homeRequestToken = 0;
let homeDesiredActive = false;
let homeTapVoicePool = [];
let previousQuotesXOffset = null;
let committedHomeBg = null;
let bgPreviewToken = 0;

// ---- World constants (must match viewer.js) ----
const WORLD_W = 1024;
const WORLD_H = 768;
const HOME16_H = 576;
const DEFAULT_CHARA_ID = 1001;
const HOME_BGM_FILE = DEFAULT_HOME_BGM_FILE;
const HOME_BACKGROUND_FILE = `bg/web/${DEFAULT_HOME_BG_FILE}`;
const HOME_X_OFFSET = -132;
const HOME_LOGIN_SESSION_KEY = 'mrHomeLoginSeen';
const HOME_TAP_VOICE_IDS = [33, 34, 35, 36, 37, 38, 39, 40];
const HOME_TAP9_VOICE_ID = 41;
const HOME_OPENED_FROM_INDEX = (() => {
    try {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation?.type === 'reload') return false;

        const referrer = new URL(document.referrer);
        if (referrer.origin !== window.location.origin) return false;
        const path = referrer.pathname.replace(/\/+$/, '');
        return path === '' || path.endsWith('/index.html');
    } catch (e) {
        return false;
    }
})();
homeTapVoicePool = [...HOME_TAP_VOICE_IDS];

// ---- Cocos-to-pixi background ----
const MAX_CACHED_BGS = 8;
const bgAssetCache = new Map(); // key -> { assets, promise }
let bgArmature = null;
let bgTicker = null;
let outgoingBgArmature = null;
let outgoingBgTicker = null;
let bgLoadToken = 0;
let bgFadeToken = 0;
let bgPrefetchToken = 0;
let currentBgKey = null;
let currentBgMovement = 'action';
let imageNativeBasePromise = null;

function getImageNativeBase() {
    if (!imageNativeBasePromise) {
        imageNativeBasePromise = resolveMaReAssetsBase()
            .then((base) => String(base || '').replace(/\/live2d_v4\/?$/, ''))
            .catch((err) => {
                imageNativeBasePromise = null;
                throw err;
            });
    }
    return imageNativeBasePromise;
}

function collectCocosBaseTextures(assets) {
    const baseTextures = new Set();
    if (!assets) return baseTextures;
    if (assets.textures) {
        for (const tex of Object.values(assets.textures)) {
            if (tex?.baseTexture) baseTextures.add(tex.baseTexture);
        }
    }
    if (assets.particles) {
        for (const p of Object.values(assets.particles)) {
            if (p?.particleTexture?.baseTexture) baseTextures.add(p.particleTexture.baseTexture);
        }
    }
    return baseTextures;
}

function disposeCocosAssets(textures, particles, keepBaseTextures = null) {
    if (particles) {
        for (const p of Object.values(particles)) {
            const tex = p?.particleTexture;
            if (!tex) continue;
            const bt = tex.baseTexture;
            if (keepBaseTextures && keepBaseTextures.has(bt)) continue;
            const srcUrl = bt?.resource?.url;
            try { tex.destroy(true); } catch {}
            if (typeof srcUrl === 'string' && srcUrl.startsWith('blob:')) {
                try { URL.revokeObjectURL(srcUrl); } catch {}
            }
            p.particleTexture = null;
        }
    }
    if (textures) {
        const baseTextures = new Set();
        for (const tex of Object.values(textures)) {
            if (!tex) continue;
            const bt = tex.baseTexture;
            if (keepBaseTextures && keepBaseTextures.has(bt)) continue;
            if (bt) baseTextures.add(bt);
            try { tex.destroy(false); } catch {}
        }
        for (const bt of baseTextures) {
            if (bt && !bt.destroyed && (!keepBaseTextures || !keepBaseTextures.has(bt))) {
                const srcUrl = bt.resource?.url;
                try { bt.destroy(); } catch {}
                if (typeof srcUrl === 'string' && srcUrl.startsWith('blob:')) {
                    try { URL.revokeObjectURL(srcUrl); } catch {}
                }
            }
        }
    }
}

function applyMovementScale(armature) {
    const sc = Number(armature?.currentMovement?.sc);
    if (Number.isFinite(sc) && sc > 0) {
        armature.animationScale = sc;
    }
    if (Array.isArray(armature?.nestedArmatures)) {
        for (const sub of armature.nestedArmatures) {
            applyMovementScale(sub);
        }
    }
}

function collectProtectedBgBaseTextures(extraKeep = null) {
    const keep = new Set();
    const addAll = (set) => {
        if (!set) return;
        for (const bt of set) keep.add(bt);
    };
    addAll(extraKeep);
    addAll(collectCocosBaseTextures(bgArmature));
    addAll(collectCocosBaseTextures(outgoingBgArmature));
    for (const cached of bgAssetCache.values()) {
        if (cached?.assets) addAll(collectCocosBaseTextures(cached.assets));
    }
    return keep;
}

function getOrLoadCachedBgAssets(key, url) {
    if (bgAssetCache.has(key)) {
        const entry = bgAssetCache.get(key);
        bgAssetCache.delete(key);
        bgAssetCache.set(key, entry);
        return entry.promise;
    }

    const record = { assets: null, promise: null };
    record.promise = loadCocosBackgroundAssets(url)
        .then((assets) => {
            record.assets = assets;
            return assets;
        })
        .catch((err) => {
            if (bgAssetCache.get(key) === record) bgAssetCache.delete(key);
            throw err;
        });

    bgAssetCache.set(key, record);
    while (bgAssetCache.size > MAX_CACHED_BGS) {
        const oldestKey = bgAssetCache.keys().next().value;
        const oldest = bgAssetCache.get(oldestKey);
        bgAssetCache.delete(oldestKey);
        if (oldest?.assets) {
            disposeCocosAssets(oldest.assets.textures, oldest.assets.particles, collectProtectedBgBaseTextures());
        }
    }
    return record.promise;
}

function clearBgAssetCache() {
    bgPrefetchToken++;
    const entries = Array.from(bgAssetCache.values());
    bgAssetCache.clear();
    const keep = collectProtectedBgBaseTextures();
    for (const entry of entries) {
        if (entry?.assets) {
            disposeCocosAssets(entry.assets.textures, entry.assets.particles, keep);
        }
    }
}

function disposeBgNode(armature, ticker, keepBaseTextures = null) {
    if (ticker && window.app?.ticker) {
        window.app.ticker.remove(ticker);
    }
    if (armature) {
        try {
            if (typeof armature.stop === 'function') armature.stop();
            if (armature.parent) armature.parent.removeChild(armature);
            const textures = armature.textures;
            const particles = armature.particles;
            armature.destroy({ children: true });
            disposeCocosAssets(textures, particles, collectProtectedBgBaseTextures(keepBaseTextures));
        } catch (e) {}
    }
}

function finishOutgoingBgFade(keepBaseTextures = null) {
    bgFadeToken++;
    if (outgoingBgArmature || outgoingBgTicker) {
        const oldArm = outgoingBgArmature;
        const oldTick = outgoingBgTicker;
        outgoingBgArmature = null;
        outgoingBgTicker = null;
        disposeBgNode(oldArm, oldTick, keepBaseTextures);
    }
    if (bgArmature && !bgArmature.destroyed) {
        bgArmature.alpha = 1;
    }
}

function teardownCurrentBgNode(keepBaseTextures = null) {
    finishOutgoingBgFade(keepBaseTextures);
    const arm = bgArmature;
    const tick = bgTicker;
    bgArmature = null;
    bgTicker = null;
    disposeBgNode(arm, tick, keepBaseTextures);
}

async function clearBackground() {
    bgLoadToken++;
    currentBgKey = null;
    teardownCurrentBgNode();
}

async function resolveBackgroundTarget(bgInput) {
    if (typeof bgInput === 'string') {
        return { key: bgInput, url: bgInput };
    }
    const file = bgInput?.file || DEFAULT_HOME_BG_FILE;
    const dir = bgInput?.dir || 'web';
    const key = bgInput?.id || `home:${dir}/${file}`;
    if (dir === 'web' && (file === 'web_0011.ExportJson' || file === 'web_0015.ExportJson' || file === 'web_common.ExportJson')) {
        return { key, url: `bg/web/${file}` };
    }
    const base = await getImageNativeBase();
    return { key, url: `${base}/bg/${dir}/${file}` };
}

async function initBackground(bgInput = 'bg/web/web_0015.ExportJson', { visible = true, autoplay = true, crossfadeMs = 0 } = {}) {
    const token = ++bgLoadToken;
    const target = await resolveBackgroundTarget(bgInput);
    if (token !== bgLoadToken) return;

    if (bgArmature && currentBgKey === target.key) {
        bgArmature.visible = visible;
        if (autoplay && !bgArmature.isPlaying && currentBgMovement !== null) {
            bgArmature.play(currentBgMovement, true);
            applyMovementScale(bgArmature);
        }
        return;
    }

    const assets = await getOrLoadCachedBgAssets(target.key, target.url);
    if (token !== bgLoadToken) {
        return;
    }

    const keepBaseTextures = collectCocosBaseTextures(assets);
    const armature = new CocosStudioArmature(assets.json, assets.textures, assets.particles);

    // Position so the 1024x768 bg content is vertically centered in the 1024x576 home16 view.
    // cameraMask clips to (0,0,1024,576); shifting the armature up by (768-576)/2 = 96px
    // means 96px is clipped from both top and bottom, centering the bg in the view.
    armature.x = WORLD_W / 2;
    armature.y = WORLD_H / 2 - (WORLD_H - HOME16_H) / 2;

    const movData = assets.json?.animation_data?.[0]?.mov_data || [];
    const hasAction = movData.some((m) => m && m.name === 'action');
    const movement = movData.length > 0 ? (hasAction ? 'action' : 0) : null;

    const canCrossfade = crossfadeMs > 0 && visible && bgArmature && !bgArmature.destroyed && bgArmature.visible && bgArmature.parent;
    if (canCrossfade) {
        finishOutgoingBgFade(keepBaseTextures);
        outgoingBgArmature = bgArmature;
        outgoingBgTicker = bgTicker;
        const insertIdx = outgoingBgArmature.parent.getChildIndex(outgoingBgArmature) + 1;
        outgoingBgArmature.parent.addChildAt(armature, insertIdx);
        armature.alpha = 0;
    } else {
        teardownCurrentBgNode(keepBaseTextures);
        // Add behind the model (worldContainer is above index 0).
        window.cameraContainer.addChildAt(armature, 0);
        armature.alpha = 1;
    }

    bgArmature = armature;
    currentBgKey = target.key;
    currentBgMovement = movement;
    armature.visible = visible;

    if (autoplay && movement !== null) {
        armature.play(movement, true);
        applyMovementScale(armature);
        armature.update(0);
    }

    bgTicker = (delta) => {
        if (!armature.destroyed && (bgArmature === armature || outgoingBgArmature === armature)) {
            armature.update(delta / 60);
        }
    };
    window.app.ticker.add(bgTicker);

    if (canCrossfade) {
        const fadeId = ++bgFadeToken;
        const start = performance.now();
        const step = () => {
            if (fadeId !== bgFadeToken || bgArmature !== armature || armature.destroyed) return;
            const t = Math.min(1, (performance.now() - start) / crossfadeMs);
            armature.alpha = t;
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                finishOutgoingBgFade(keepBaseTextures);
            }
        };
        requestAnimationFrame(step);
    }
}

function startBackgroundAndMusic() {
    if (bgArmature) {
        bgArmature.visible = true;
        if (currentBgMovement !== null) {
            bgArmature.play(currentBgMovement, true);
            applyMovementScale(bgArmature);
        }
    }
    if (player) player.play();
}

async function preloadOpenSansFont() {
    if (!document.fonts?.load) return;
    try {
        await document.fonts.load('600 19px "Open Sans"');
    } catch (error) {
        console.warn('[quotes] Open Sans preload failed; continuing with fallback font.', error);
    }
}

// ---- HCA BGM playback ----
const HCA_JS_URL = new URL("./lib/hca.js", document.baseURI);
const KEY1 = 0x01395C51;
const KEY2 = 0x00000000;

const MAX_CACHED_BGM = 10;
const bgmDecryptedCache = new Map(); // fileName -> Promise<Uint8Array>

let hcaModule = null;
let hcaBlobUrl = null;
let worker = null;
let workerPromise = null;
let player = null;
let currentBgmFile = null;
let bgmLoadToken = 0;
let scenarioPlayer = null;
let _bgmBase = null;
let _bgmBaseSource = null;

async function safeStopHcaPlayer(hcaPlayer, { fadeMs = 30 } = {}) {
    if (!hcaPlayer || hcaPlayer.closed) return;
    try {
        if (fadeMs > 0 && hcaPlayer.gainNode && hcaPlayer.audioCtx?.state === 'running') {
            const now = hcaPlayer.audioCtx.currentTime;
            const gain = hcaPlayer.gainNode.gain;
            gain.cancelScheduledValues(now);
            gain.setValueAtTime(gain.value, now);
            gain.linearRampToValueAtTime(0, now + fadeMs / 1000);
            await new Promise((r) => setTimeout(r, fadeMs + 8));
        }
        if (hcaPlayer.closed) return;
        if (hcaPlayer.bufSrc) hcaPlayer.bufSrc.onended = null;
        if (hcaPlayer.audioCtx?.state === 'suspended') {
            if (hcaPlayer.visibilityChangeListener) {
                document.removeEventListener('visibilitychange', hcaPlayer.visibilityChangeListener);
            }
            try { hcaPlayer.bufSrc?.disconnect(); } catch {}
            await hcaPlayer.audioCtx.close();
            hcaPlayer.closed = true;
            return;
        }
        await hcaPlayer.stop();
    } catch {
        try {
            if (hcaPlayer.visibilityChangeListener) {
                document.removeEventListener('visibilitychange', hcaPlayer.visibilityChangeListener);
            }
        } catch {}
        try { hcaPlayer.bufSrc?.disconnect(); } catch {}
        try { await hcaPlayer.audioCtx?.close(); } catch {}
        hcaPlayer.closed = true;
    }
}

function getOrFetchDecryptedBgm(fileName) {
    if (bgmDecryptedCache.has(fileName)) {
        const p = bgmDecryptedCache.get(fileName);
        bgmDecryptedCache.delete(fileName);
        bgmDecryptedCache.set(fileName, p);
        return p;
    }

    const p = (async () => {
        const activeWorker = await initWorker();
        await resolveBgmBase(fileName);
        const fileResponse = await fetch(`${_bgmBase}/${fileName}`);
        if (!fileResponse.ok) {
            throw new Error(`Failed to load ${fileName}: ${fileResponse.status} ${fileResponse.statusText}`);
        }
        const hcaData = new Uint8Array(await fileResponse.arrayBuffer());
        return activeWorker.decrypt(hcaData, KEY1, KEY2);
    })().catch((err) => {
        if (bgmDecryptedCache.get(fileName) === p) bgmDecryptedCache.delete(fileName);
        throw err;
    });

    bgmDecryptedCache.set(fileName, p);
    while (bgmDecryptedCache.size > MAX_CACHED_BGM) {
        const oldest = bgmDecryptedCache.keys().next().value;
        bgmDecryptedCache.delete(oldest);
    }
    return p;
}

async function resolveBgmBase(probeFile = HOME_BGM_FILE) {
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
        const probeUrl = `${localBase}/${probeFile}`;
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
    if (workerPromise) return workerPromise;

    workerPromise = (async () => {
        try {
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
        } catch (err) {
            workerPromise = null;
            throw err;
        }
    })();
    return workerPromise;
}

async function playTrack(fileName, { autoplay = true } = {}) {
    if (fileName === currentBgmFile && player && !player.closed) {
        if (autoplay) {
            try {
                if (player.audioCtx?.state === 'suspended') {
                    await player.audioCtx.resume().catch(() => {});
                }
                player.play();
            } catch {}
        }
        return;
    }

    const token = ++bgmLoadToken;
    const activeWorker = await initWorker();
    const decrypted = await getOrFetchDecryptedBgm(fileName);
    if (token !== bgmLoadToken) return;
    const newPlayer = await hcaModule.HCAWebAudioLoopPlayer.create(decrypted.slice(), activeWorker);

    if (token !== bgmLoadToken) {
        await safeStopHcaPlayer(newPlayer, { fadeMs: 0 });
        return;
    }

    if (player) {
        await safeStopHcaPlayer(player, { fadeMs: 30 });
    }
    if (token !== bgmLoadToken) {
        await safeStopHcaPlayer(newPlayer, { fadeMs: 0 });
        return;
    }

    player = newPlayer;
    currentBgmFile = fileName;
    player.playInBackground = true;
    if (autoplay) {
        if (player.gainNode && player.audioCtx) {
            const now = player.audioCtx.currentTime;
            player.gainNode.gain.setValueAtTime(0, now);
            player.gainNode.gain.linearRampToValueAtTime(1, now + 0.015);
        }
        player.play();
    }

    console.info(`[quotes] Prepared ${fileName} (${_bgmBaseSource})${autoplay ? ' and started playback' : ''}`);
}

const CHARA_ATTRIBUTES_URL = new URL('./assets/charaAttributes.json', document.baseURI).href;
let charaAttributes = {};

async function loadCharaAttributes() {
    try {
        const resp = await fetch(CHARA_ATTRIBUTES_URL);
        if (resp.ok) {
            charaAttributes = await resp.json();
        }
    } catch (e) {
        console.warn('[quotes] failed to load charaAttributes.json, using fallback', e);
    }
}

let lastUILayerX = null;
let lastUILayerY = null;
let lastUILayerScale = null;

function updateUILayer() {
    const uiLayer = document.getElementById('ui-layer');
    if (!uiLayer) return;
    const camera = window.cameraContainer;
    if (!camera) return;
    const x = camera.x;
    const y = camera.y;
    const scale = camera.scale.x;
    if (x === lastUILayerX && y === lastUILayerY && scale === lastUILayerScale) return;
    lastUILayerX = x;
    lastUILayerY = y;
    lastUILayerScale = scale;
    uiLayer.style.left = `${x}px`;
    uiLayer.style.top = `${y}px`;
    uiLayer.style.transform = `scale(${scale})`;
}

function updateHeaderName(nameEl, charaName, charaTitle) {
    if (!nameEl || !charaName) return;
    nameEl.innerHTML = '';
    nameEl.appendChild(document.createTextNode(charaName + ' '));
    if (charaTitle) {
        const titleSpan = document.createElement('span');
        titleSpan.className = 'title';
        titleSpan.textContent = charaTitle;
        nameEl.appendChild(titleSpan);
    }
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
            updateHeaderName(nameEl, chara.name, chara.title);
            if (kanaEl) {
                kanaEl.textContent = chara.kana || chara.name;
            }
        }
    } catch (e) {
        console.warn('[quotes] Failed to load character metadata:', e);
    }
}



function getAvailableVoiceKeys(scenarioJson) {
    const keys = new Set();
    if (scenarioJson && scenarioJson.story) {
        Object.values(scenarioJson.story).forEach(steps => {
            if (Array.isArray(steps)) {
                steps.forEach(step => {
                    if (Array.isArray(step.chara)) {
                        step.chara.forEach(c => {
                            if (c.voice) keys.add(c.voice);
                        });
                    }
                });
            }
        });
    }
    return keys;
}

function updateVoiceButtonsVisibility(charaId, prefix, availableKeys) {
    const categories = document.querySelectorAll('#charaVoice .commonFrame3');
    categories.forEach(category => {
        if (category.parentNode.id === 'outfitsTabContent') return;

        const voiceBtns = category.querySelectorAll('.voiceBtn');
        let visibleCount = 0;

        voiceBtns.forEach(btn => {
            const voiceId = btn.getAttribute('data-voice');
            const voiceKey = `vo_char_${charaId}_${prefix}_${voiceId}`;

            if (availableKeys.has(voiceKey)) {
                btn.style.display = '';
                visibleCount++;
            } else {
                btn.style.display = 'none';
            }
        });

        if (visibleCount > 0) {
            category.style.display = '';
        } else {
            category.style.display = 'none';
        }
    });
}

let sfxPlayer = null;
let sfxLoadToken = 0;

async function playSfx(filePath) {
    const token = ++sfxLoadToken;
    try {
        const activeWorker = await initWorker();
        const fileResponse = await fetch(filePath);
        if (!fileResponse.ok) {
            throw new Error(`Failed to load SFX ${filePath}: ${fileResponse.status}`);
        }
        const hcaData = new Uint8Array(await fileResponse.arrayBuffer());
        if (token !== sfxLoadToken) return;
        const decrypted = await activeWorker.decrypt(hcaData, KEY1, KEY2);
        if (token !== sfxLoadToken) return;

        const newSfx = await hcaModule.HCAWebAudioLoopPlayer.create(decrypted, activeWorker);
        if (token !== sfxLoadToken) {
            await safeStopHcaPlayer(newSfx);
            return;
        }

        if (sfxPlayer) {
            await safeStopHcaPlayer(sfxPlayer);
        }

        sfxPlayer = newSfx;
        sfxPlayer.bufSrc.loop = false;
        sfxPlayer.playInBackground = true;
        sfxPlayer.bufSrc.onended = () => {
            if (sfxPlayer === newSfx) sfxPlayer = null;
            safeStopHcaPlayer(newSfx);
        };
        sfxPlayer.play();
    } catch (e) {
        console.error('[quotes] SFX play failed:', e);
    }
}

let activeEffectArmature = null;
let activeEffectTick = null;
let effectLoadToken = 0;
let effectAssetsPromise = null;

function loadTransformationEffectAssets() {
    if (!effectAssetsPromise) {
        effectAssetsPromise = loadCocosStudioAssets('magica/resource/image_native/effect/story/ef_adv_05.ExportJson')
            .catch((err) => {
                effectAssetsPromise = null;
                throw err;
            });
    }
    return effectAssetsPromise;
}

async function playTransformationEffect(x) {
    const token = ++effectLoadToken;
    try {
        const assets = await loadTransformationEffectAssets();
        if (token !== effectLoadToken) return;

        const effectArmature = new CocosStudioArmature(assets.json, assets.textures, assets.particles);

        if (activeEffectArmature) {
            if (activeEffectTick) {
                window.app.ticker.remove(activeEffectTick);
                activeEffectTick = null;
            }
            try {
                if (activeEffectArmature.parent) {
                    activeEffectArmature.parent.removeChild(activeEffectArmature);
                }
                activeEffectArmature.destroy({ children: true });
            } catch(e) {}
            activeEffectArmature = null;
        }

        effectArmature.x = x;
        effectArmature.y = 288; // Vertically center in the 1024x576 home frame

        window.cameraContainer.addChild(effectArmature);
        effectArmature.play('action', false);
        activeEffectArmature = effectArmature;

        const updateTick = (delta) => {
            if (!effectArmature || effectArmature.destroyed) {
                window.app.ticker.remove(updateTick);
                return;
            }

            if (effectArmature.playing) {
                try {
                    effectArmature.update(delta / 60);
                } catch (err) {
                    console.error('[quotes] Error updating effect:', err);
                    window.app.ticker.remove(updateTick);
                }
            } else {
                window.app.ticker.remove(updateTick);
                try {
                    if (effectArmature.parent) {
                        effectArmature.parent.removeChild(effectArmature);
                    }
                    effectArmature.destroy({ children: true });
                } catch(e) {}
                if (activeEffectArmature === effectArmature) {
                    activeEffectArmature = null;
                    activeEffectTick = null;
                }
            }
        };

        activeEffectTick = updateTick;
        window.app.ticker.add(updateTick);
    } catch (e) {
        console.error('[quotes] Transformation effect play failed:', e);
    }
}

async function stopTransformationEffects() {
    sfxLoadToken++;
    effectLoadToken++;
    if (sfxPlayer) {
        const oldSfx = sfxPlayer;
        sfxPlayer = null;
        await safeStopHcaPlayer(oldSfx);
    }
    if (activeEffectArmature) {
        if (activeEffectTick) {
            try { window.app?.ticker?.remove(activeEffectTick); } catch (e) {}
            activeEffectTick = null;
        }
        try {
            if (activeEffectArmature.parent) {
                activeEffectArmature.parent.removeChild(activeEffectArmature);
            }
            activeEffectArmature.destroy({ children: true });
        } catch (e) {}
        activeEffectArmature = null;
    }
}
window.stopTransformationEffects = stopTransformationEffects;

export function cancelOutfitChanges() {
    outfitChangeToken++;
    stopTransformationEffects();
}
window.cancelOutfitChanges = cancelOutfitChanges;

async function loadScenarioForOutfit(charaId, live2dId, changeToken) {
    const live2dIdStr = String(live2dId).padStart(2, '0');
    const pathSuffix = `${charaId}${live2dIdStr}.json`;

    let scenarioUrl = null;
    let scenarioJson = null;
    let voicePrefix = null;

    if (live2dIdStr !== '00') {
        // Check if a specific outfit scenario exists (en-download first, then ma-re-data)
        const result = await checkScenarioUrlExists(pathSuffix);
        if (result) {
            voicePrefix = live2dIdStr;
            scenarioUrl = result.url;
            // Load it (from cache or fetch with fallback)
            const cached = scenarioCache.get(scenarioUrl);
            if (cached) {
                scenarioJson = cached;
            } else {
                const fetchResult = await fetchScenarioJson(pathSuffix);
                if (fetchResult.json) {
                    scenarioJson = fetchResult.json;
                    scenarioUrl = fetchResult.url;
                    scenarioCache.set(scenarioUrl, scenarioJson);
                }
            }
        }
    }

    if (!scenarioJson) {
        // Fall back to base outfit (00) — use fetchScenarioJson for fallback support
        voicePrefix = '00';
        const fetchResult = await fetchScenarioJson(`${charaId}00.json`);
        if (fetchResult.json) {
            scenarioJson = fetchResult.json;
            scenarioUrl = fetchResult.url;
            scenarioCache.set(scenarioUrl, scenarioJson);
        }
    }

    // Guard: if a newer outfit change has occurred, discard this result to avoid races
    if (changeToken !== undefined && changeToken !== outfitChangeToken) return;

    activeVoicePrefix = voicePrefix;
    activeScenarioUrl = scenarioUrl;

    if (scenarioJson) {
        const availableKeys = getAvailableVoiceKeys(scenarioJson);
        updateVoiceButtonsVisibility(charaId, activeVoicePrefix, availableKeys);
    }
}

function setupOutfitButtons(charaId) {
    const homeContainer = document.querySelector('#outfitsTabContent .homePageOutfits');
    const homeBtns = document.querySelector('#outfitsTabContent .homeOutfits');
    const storyContainer = document.querySelector('#outfitsTabContent .storyOutfits');
    const storyBtns = document.querySelector('#outfitsTabContent .storyOutfitsList');

    if (!homeBtns || !storyBtns) return;

    homeBtns.innerHTML = '';
    storyBtns.innerHTML = '';

    const outfits = getOutfitsForCharacter(charaId);
    let homeCount = 0;
    let storyCount = 0;

    outfits.forEach(outfit => {
        const btn = document.createElement('div');
        btn.className = 'commonFrame4 outfitBtn';
        const live2dIdStr = String(outfit.live2dId).padStart(2, '0');
        btn.setAttribute('data-live2did', outfit.live2dId);
        btn.textContent = outfit.description || live2dIdStr;

        if (String(outfit.live2dId) === String(state.currentLive2dId)) {
            btn.classList.add('current');
        }

        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (btn.classList.contains('current')) return;

            document.querySelectorAll('.outfitBtn.current').forEach(b => b.classList.remove('current'));
            btn.classList.add('current');

            const newLive2dId = outfit.live2dId;
            state.currentLive2dId = newLive2dId;

            // 1. Stop any currently playing voice/sequence and clear stale highlight
            if (scenarioPlayer) {
                scenarioPlayer.stop();
            }
            document.querySelectorAll('.voiceBtn.current').forEach(b => b.classList.remove('current'));

            const modelId = buildModelId(charaId, newLive2dId);

            // Guard token to prevent race conditions during rapid clicking
            const token = ++outfitChangeToken;

            // 1b. Start loading scenario voice mappings early (parallel with model preloading/transformation)
            const scenarioPromise = loadScenarioForOutfit(charaId, newLive2dId, token);

            // 2. Preload the model into RAM first (shows "Connecting" loader/overlay if not already cached)
            try {
                await preloadModelToRam(modelId);
            } catch (err) {
                console.error('[quotes] Preload model failed:', err);
            }

            if (token !== outfitChangeToken) return;

            // 3. Play transformation sound and visual effect after connecting ends.
            //    The VFX appears at the Live2D model's current position.
            const modelX = state.currentModel?.x ?? 250;
            playSfx('magica/resource/sound_native/jingle/7205_magic_girl_hca.hca');
            playTransformationEffect(modelX);

            // Wait 0.5s (500ms) so the model change matches the transformation effect timing
            await new Promise(resolve => setTimeout(resolve, 500));
            if (token !== outfitChangeToken) return;

            // 4. Load the new model (instant since it's already preloaded in RAM)
            try {
                const loadedOk = await loadOutfitModels(charaId, newLive2dId, token);
                if (!loadedOk || token !== outfitChangeToken) return;

                // Retrieve modelJson for the loaded model to set default expression and motion
                let bestExpression = null;
                const fileList = ramFolderCache.get(modelId);
                if (fileList) {
                    const jsonFile = fileList.find(f => f.webkitRelativePath === 'model.model3.json');
                    if (jsonFile) {
                        const modelJson = JSON.parse(await jsonFile.text());
                        const expressions = modelJson?.FileReferences?.Expressions ?? [];
                        bestExpression = findDefaultExpression(expressions);
                    }
                }

                const activeControllers = scenarioPlayer?.controllers?.size > 0 
                    ? Array.from(new Set(scenarioPlayer.controllers.values())) 
                    : (state.currentController ? [state.currentController] : []);

                activeControllers.forEach(ctrl => {
                    if (!ctrl) return;
                    if (bestExpression && typeof ctrl.setExpressionByName === 'function') {
                        ctrl.setExpressionByName(bestExpression);
                    }
                    const motionIndex = ctrl.motionIndexByNumber?.get(0) ?? 0;
                    try {
                        ctrl.startMotion(ctrl.defaultMotionGroup, motionIndex);
                    } catch (e) {}
                });
            } catch (e) {
                console.error('[quotes] Model swap failed:', e);
            }

            if (token !== outfitChangeToken) return;
            // 5. Ensure scenario voice mappings have loaded (started in parallel above)
            await scenarioPromise;
        });

        // Determine if it is a Home Page Outfit (in live2dList.json) or Story Outfit (in missingLive2dList.json)
        const key = `${Number(charaId)}-${live2dIdStr}`;
        const isHomePage = state.registeredLive2dKeys && state.registeredLive2dKeys.has(key);

        if (isHomePage) {
            homeBtns.appendChild(btn);
            homeCount++;
        } else {
            storyBtns.appendChild(btn);
            storyCount++;
        }
    });

    if (homeContainer) homeContainer.style.display = homeCount > 0 ? 'block' : 'none';
    if (storyContainer) storyContainer.style.display = storyCount > 0 ? 'block' : 'none';
}

// ---- MyPage outfit cycle + wearWrap panel ----
// Ports the original MyPage.js live2d interaction to the left column:
//   - #live2dBtn click cycles the next outfit (live2dFuncRegacy); a 1s-hold
//     (live2dSelectTimer) instead opens/closes #wearWrap
//   - #wearWrap rows are built from getOutfitsForCharacter with the same
//     home/story split as setupOutfitButtons; clicking a row (wearSelect)
//     marks it .current and swaps via the token-guarded outfit flow
//   - .wearing hides the column + banner while the panel is open
//   - #favoriteChara icon = card_<charaId>_f.png from resolveMaReAssetsBase();
//     the frame is kept and a broken img is hidden when offline
const MYPAGE_OUTFIT_SFX = 'magica/resource/sound_native/jingle/7205_magic_girl_hca.hca';
const MYPAGE_OUTFIT_VFX_X = 512;

let mypageOutfitBusy = false;
let live2dHoldTimer = null;
let live2dTimerFired = false;

function myPageOutfitList() {
    const charaId = state.currentCharacterId || DEFAULT_CHARA_ID;
    const outfits = getOutfitsForCharacter(charaId);
    // Exclude entries that only exist in assets/missingLive2dList.json (story
    // outfits with no registered home live2d entry) — the custome list is for
    // models the home can actually display.
    const keys = state.registeredLive2dKeys;
    if (!keys) return outfits;
    return outfits.filter(o =>
        keys.has(`${Number(charaId)}-${String(o.live2dId).padStart(2, '0')}`)
    );
}

function myPageCurrentOutfitIndex() {
    const outfits = myPageOutfitList();
    const current = String(state.currentLive2dId || '00').padStart(2, '0');
    const index = outfits.findIndex(o => String(o.live2dId).padStart(2, '0') === current);
    return index >= 0 ? index : 0;
}

function syncMyPageOutfitUI() {
    const btn = document.getElementById('live2dBtn');
    if (btn) {
        if (myPageOutfitList().length >= 2) btn.classList.remove('off');
        else btn.classList.add('off');
    }

    const current = String(state.currentLive2dId || '00').padStart(2, '0');
    document.querySelectorAll('#MyPage #mypageWearScrollOuter .wrap').forEach(row => {
        const id = String(row.dataset.live2dId || '').padStart(2, '0');
        row.classList.toggle('current', id === current);
    });
}

let measureTextCtx = null;

// The game cuts long outfit names at a word boundary ("Kamihama University
// Affiliated") instead of clipping mid-word, so trim the label to the last
// whole word that fits the row's text area (384px row - 56px icon padding).
function fitRowLabel(row) {
    const text = row.textContent;
    if (!text) return;
    const font = window.getComputedStyle(row).font;
    if (!measureTextCtx) {
        measureTextCtx = document.createElement('canvas').getContext('2d');
    }
    const ctx = measureTextCtx;
    if (!ctx) return;
    ctx.font = font;
    const maxWidth = 384 - 56;
    if (ctx.measureText(text).width <= maxWidth) return;
    const words = text.split(' ');
    while (words.length > 1 && ctx.measureText(words.join(' ')).width > maxWidth) {
        words.pop();
    }
    let trimmed = words.join(' ');
    while (trimmed && ctx.measureText(trimmed).width > maxWidth) {
        trimmed = trimmed.slice(0, -1);
    }
    row.textContent = trimmed;
}

function buildWearRows() {
    const scrollInner = document.querySelector('#MyPage #mypageWearScrollOuter .scrollInner');
    if (!scrollInner) return;
    scrollInner.innerHTML = '';

    const outfits = myPageOutfitList();
    if (outfits.length === 0) return;

    outfits.forEach(outfit => {
        const live2dIdStr = String(outfit.live2dId).padStart(2, '0');
        const row = document.createElement('div');
        row.className = 'wrap commonFrame4 TE se_decide';
        row.dataset.live2dId = live2dIdStr;
        row.textContent = outfit.description || live2dIdStr;
        scrollInner.appendChild(row);
        fitRowLabel(row);
    });

    syncMyPageOutfitUI();
}

// While the wearWrap outfit popup is open the rest of the home chrome
// (#globalMenu status bar and #sideMenu) disappears instantly — as in the
// game, only the Live2D model, background, and popup remain. They are
// restored by the OK-close path and by stopHomeScreen.
function setWearWrapChrome(hidden) {
    ['globalMenu', 'sideMenu'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = hidden ? 'none' : '';
    });
}

function toggleWearWrap() {
    const wearWrap = document.getElementById('wearWrap');
    const myPage = document.getElementById('MyPage');
    if (!wearWrap) return;

    if (wearWrap.classList.contains('off')) {
        wearWrap.classList.remove('off');
        if (myPage) myPage.classList.add('wearing');
        setWearWrapChrome(true);
        buildWearRows();
    } else {
        wearWrap.classList.add('off');
        if (myPage) myPage.classList.remove('wearing');
        setWearWrapChrome(false);
        // OK-close as in the game: the left column, status bar, and carousel
        // reappear instantly (no animation), while the right-side menu
        // reopens with the standard menu-open choreography (model respawns
        // as a fresh instance at the center position).
        const sideMenu = document.getElementById('sideMenu');
        if (sideMenu) {
            sideMenu.classList.remove('close');
            sideMenu.classList.add('anim');
        }
        if (typeof window.mypageMenuChoreography === 'function') {
            window.mypageMenuChoreography(true);
        }
        // The banner carousel reappears with the column on OK-close; re-arm it
        // in case a menu toggle cancelled the reveal's 120ms start (review P2).
        if (typeof window.startBannerCarousel === 'function') {
            window.startBannerCarousel();
        }
    }
}

async function swapMyPageOutfit(live2dIdRaw) {
    const live2dId = String(live2dIdRaw).padStart(2, '0');
    if (String(state.currentLive2dId || '00').padStart(2, '0') === live2dId) return false;
    if (mypageOutfitBusy) return false;
    mypageOutfitBusy = true;

    const charaId = state.currentCharacterId || DEFAULT_CHARA_ID;
    const modelId = buildModelId(charaId, live2dId);
    const token = ++outfitChangeToken;
    // Snapshot before the optimistic commit so a failed load can roll back
    // state.currentLive2dId (and the .current row marker via syncMyPageOutfitUI)
    // to the outfit that actually loaded (review P3).
    const previousLive2dId = state.currentLive2dId;
    state.currentLive2dId = live2dId;

    const btn = document.getElementById('live2dBtn');
    if (btn) btn.classList.add('block');
    // While the transformation plays, the wearWrap OK button is disabled
    // (grayed out) and the whole popup ignores pointer input, as in the game.
    const wearWrap = document.getElementById('wearWrap');
    if (wearWrap) wearWrap.classList.add('block');

    try {
        if (scenarioPlayer) scenarioPlayer.stop();
        const scenarioPromise = loadScenarioForOutfit(charaId, live2dId, token);

        try {
            await preloadModelToRam(modelId);
        } catch (err) {
            console.error('[quotes] MyPage outfit preload failed:', err);
        }
        if (token !== outfitChangeToken) return false;

        playSfx(MYPAGE_OUTFIT_SFX);
        // Place the transformation VFX at the model's current position.
        playTransformationEffect(state.currentModel?.x ?? MYPAGE_OUTFIT_VFX_X);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (token !== outfitChangeToken) return false;

        let loadedOk = false;
        try {
            loadedOk = await loadOutfitModels(charaId, live2dId, token);
        } catch (err) {
            console.error('[quotes] MyPage outfit load failed:', err);
        }
        // If a newer swap or a menu-close superseded this one, it owns the
        // committed id — do not roll back (the respawn uses the clicked outfit).
        if (token !== outfitChangeToken) return false;
        if (!loadedOk) {
            console.warn(`[quotes] MyPage outfit ${live2dId} failed to load; reverting to ${previousLive2dId}`);
            state.currentLive2dId = previousLive2dId;
            syncMyPageOutfitUI();
            return false;
        }

        await scenarioPromise;
        syncMyPageOutfitUI();
        return true;
    } finally {
        if (btn) btn.classList.remove('block');
        if (wearWrap) wearWrap.classList.remove('block');
        mypageOutfitBusy = false;
    }
}

function cycleMyPageOutfit() {
    const outfits = myPageOutfitList();
    if (outfits.length < 2) return;
    const nextIndex = (myPageCurrentOutfitIndex() + 1) % outfits.length;
    swapMyPageOutfit(outfits[nextIndex].live2dId);
}

function initMyPageOutfitWiring() {
    if (window.__myPageOutfitWired) return;
    window.__myPageOutfitWired = true;

    document.addEventListener('pointerdown', (e) => {
        if (!e.target.closest('#MyPage #live2dBtn')) return;
        clearTimeout(live2dHoldTimer);
        live2dTimerFired = false;
        live2dHoldTimer = setTimeout(() => {
            live2dTimerFired = true;
            toggleWearWrap();
        }, 1000);
    });
    document.addEventListener('pointerup', () => {
        clearTimeout(live2dHoldTimer);
    });

    // Press feedback on the wearWrap rows + OK button: rows scale down
    // (.touch) and the OK button also gets the light .b_screen overlay,
    // matching the original outfit popup.
    document.addEventListener('pointerdown', (e) => {
        const el = e.target.closest('#MyPage #wearWrap .wrap, #MyPage #wearWrap #wearDecide');
        if (!el) return;
        el.classList.add('touch');
    }, true);
    document.addEventListener('pointerup', () => {
        document.querySelectorAll('#MyPage #wearWrap .touch').forEach(el => el.classList.remove('touch'));
    }, true);
    document.addEventListener('pointercancel', () => {
        document.querySelectorAll('#MyPage #wearWrap .touch').forEach(el => el.classList.remove('touch'));
    }, true);

    document.addEventListener('click', (e) => {
        if (e.target.closest('#MyPage #wearDecide')) {
            e.preventDefault();
            e.stopPropagation();
            toggleWearWrap();
            return;
        }

        const row = e.target.closest('#MyPage #mypageWearScrollOuter .wrap');
        if (row) {
            e.preventDefault();
            e.stopPropagation();
            if (row.classList.contains('current')) return;
            document.querySelectorAll('#MyPage #mypageWearScrollOuter .wrap').forEach(r => r.classList.remove('current'));
            row.classList.add('current');
            swapMyPageOutfit(row.dataset.live2dId);
            return;
        }

        const btn = e.target.closest('#MyPage #live2dBtn');
        if (btn) {
            e.preventDefault();
            e.stopPropagation();
            if (live2dTimerFired) return;
            cycleMyPageOutfit();
        }
    });
}

async function initFavoriteCharaIcon() {
    const img = document.querySelector('#MyPage #favoriteChara .charaIcon img');
    if (!img) return;

    const charaId = state.currentCharacterId || DEFAULT_CHARA_ID;
    const idForThisRun = String(charaId);
    if (img.getAttribute('data-mypage-card') === idForThisRun) return;
    img.setAttribute('data-mypage-card', idForThisRun);

    const base = await resolveMaReAssetsBase().catch(() => '');
    if (!base) return;

    const root = String(base).replace(/\/$/, '').replace(/\/live2d_v4\/?$/, '');

    let url = null;
    for (const suffix of ['5', '4', '1']) {
        const candidate = `${root}/card/image/card_${charaId}${suffix}_f.png`;
        try {
            const resp = await fetch(candidate);
            if (resp.ok) {
                url = candidate;
                break;
            }
        } catch (e) {}
    }

    if (img.getAttribute('data-mypage-card') !== idForThisRun) return;

    if (!url) {
        img.removeAttribute('src');
        img.style.display = 'none';
        return;
    }
    img.onerror = () => {
        img.removeAttribute('src');
        img.style.display = 'none';
    };
    img.style.display = '';
    img.src = url;
}

function setupTabs() {
    const detailTab = document.getElementById('detailTab');
    if (!detailTab) return;
    const tabs = detailTab.querySelectorAll('li');
    tabs.forEach(tab => {
        const type = tab.getAttribute('data-type');
        if (type === 'voice' || type === 'illust') {
            tab.style.cursor = 'pointer';
            tab.onclick = (e) => {
                e.preventDefault();
                tabs.forEach(t => t.classList.remove('current'));
                tab.classList.add('current');

                const voicesContent = document.getElementById('voicesTabContent');
                const outfitsContent = document.getElementById('outfitsTabContent');

                if (type === 'voice') {
                    if (voicesContent) voicesContent.style.display = 'block';
                    if (outfitsContent) outfitsContent.style.display = 'none';
                } else if (type === 'illust') {
                    if (voicesContent) voicesContent.style.display = 'none';
                    if (outfitsContent) outfitsContent.style.display = 'block';
                }
            };
        }
    });
}

function setupVoiceDisplaySwitch() {
    const displaySwitch = document.querySelector('#cardDetail .voiceDisplaySwitch');
    if (!displaySwitch || displaySwitch.getAttribute('data-has-listener')) return;
    displaySwitch.setAttribute('data-has-listener', 'true');
    displaySwitch.style.cursor = 'pointer';

    displaySwitch.addEventListener('click', (e) => {
        e.preventDefault();
        const checkIcon = displaySwitch.querySelector('.voiceCheck');
        if (checkIcon) {
            checkIcon.classList.toggle('on');
            const isFullScreen = checkIcon.classList.contains('on');
            const cardDetail = document.getElementById('cardDetail');
            if (cardDetail) {
                cardDetail.classList.toggle('showLive2dFullscreen', isFullScreen);
            }
        }
    });
}

let metadataPromise = null;

function ensureMetadataLoaded() {
    if (metadataPromise) return metadataPromise;
    metadataPromise = (async () => {
        try {
            const [charaResponse, live2dResponse] = await Promise.all([
                fetch('https://raw.githubusercontent.com/Puella-Care/en-data/refs/heads/main/charaList.json'),
                fetch('https://raw.githubusercontent.com/Puella-Care/en-data/refs/heads/main/live2dList.json')
            ]);

            const [registeredChars, registeredLive2d] = await Promise.all([
                charaResponse.json(),
                live2dResponse.json()
            ]);

            let missingChars = [];
            let missingLive2d = [];
            try {
                const [missingCharsResponse, missingLive2dResponse] = await Promise.all([
                    fetch('assets/missingCharaList.json'),
                    fetch('assets/missingLive2dList.json')
                ]);
                if (missingCharsResponse.ok) missingChars = await missingCharsResponse.json();
                if (missingLive2dResponse.ok) missingLive2d = await missingLive2dResponse.json();
            } catch (e) {
                // Optional missing list
            }

            const registeredCharIds = new Set(registeredChars.map(c => Number(c.id)));
            const registeredLive2dKeys = new Set(
                registeredLive2d.map(o => `${Number(o.charaId)}-${String(o.live2dId).padStart(2, '0')}`)
            );

            const appendedChars = missingChars.filter(c => !registeredCharIds.has(Number(c.id)));
            const appendedLive2d = missingLive2d.filter(o => !registeredLive2dKeys.has(`${Number(o.charaId)}-${String(o.live2dId).padStart(2, '0')}`));

            state.charaListData = registeredChars.concat(appendedChars);
            state.live2dListData = registeredLive2d.concat(appendedLive2d);
            state.registeredLive2dKeys = registeredLive2dKeys;
        } catch (e) {
            metadataPromise = null;
            throw e;
        }
    })();
    return metadataPromise;
}

async function initMetadata(charaId) {
    try {
        await ensureMetadataLoaded();

        // Update the character name text and kana
        const chara = state.charaListData.find(c => Number(c.id) === Number(charaId));
        if (chara) {
            const nameEl = document.getElementById('charaNameText');
            const kanaEl = document.getElementById('charaKanaText');
            updateHeaderName(nameEl, chara.name, chara.title);
            if (kanaEl) {
                kanaEl.textContent = chara.kana || chara.name;
            }
        }
    } catch (e) {
        console.warn('[quotes] Failed to load metadata:', e);
    }
}

function setupVoiceButtons() {
    const voiceBtns = document.querySelectorAll('.voiceBtn');
    voiceBtns.forEach(btn => {
        if (btn.getAttribute('data-has-listener')) return;
        btn.setAttribute('data-has-listener', 'true');
        btn.addEventListener('click', async (e) => {
            e.preventDefault();

            document.querySelectorAll('.voiceBtn.current').forEach(b => b.classList.remove('current'));
            btn.classList.add('current');

            const voiceId = btn.getAttribute('data-voice');
            const charaId = state.currentCharacterId || DEFAULT_CHARA_ID;

            const voiceKey = `vo_char_${charaId}_${activeVoicePrefix}_${voiceId}`;

            console.log(`[quotes] Play voice button clicked. key: ${voiceKey}, url: ${activeScenarioUrl}`);

            try {
                if (scenarioPlayer) {
                    scenarioPlayer.controller = state.currentController;
                    await scenarioPlayer.loadAndPlayVoice(activeScenarioUrl, voiceKey, charaId);
                }
            } catch (err) {
                console.error('[quotes] Error playing voice button:', err);
            }
        });
    });
}

function resetDetailViewState() {
    const detailTab = document.getElementById('detailTab');
    if (detailTab) {
        const tabs = detailTab.querySelectorAll('li');
        tabs.forEach(tab => {
            const type = tab.getAttribute('data-type');
            if (type === 'voice') {
                tab.classList.add('current');
            } else {
                tab.classList.remove('current');
            }
        });
    }

    const voicesContent = document.getElementById('voicesTabContent');
    const outfitsContent = document.getElementById('outfitsTabContent');
    if (voicesContent) voicesContent.style.display = 'block';
    if (outfitsContent) outfitsContent.style.display = 'none';

    const scrollContainers = [
        document.getElementById('cardDetail'),
        document.getElementById('hiddenWrap'),
        document.getElementById('voicesTabContent'),
        document.getElementById('outfitsTabContent'),
        document.querySelector('#cardDetail .scrollInner'),
        document.getElementById('cardDetailWrap')
    ];
    scrollContainers.forEach(el => {
        if (el) el.scrollTop = 0;
    });

    const cardDetail = document.getElementById('cardDetail');
    if (cardDetail) {
        const allChildren = cardDetail.querySelectorAll('*');
        allChildren.forEach(child => {
            if (child.scrollTop > 0) child.scrollTop = 0;
        });
    }
    destroyCurrentModels();
}
window.resetDetailViewState = resetDetailViewState;

let currentLoadedCharaId = null;

async function loadOutfitModels(charaId, live2dId, token, allowedExpressions = null, allowedMotions = null) {
    destroyCurrentModels();

    const dualConfig = await getDualUnitConfig(charaId, live2dId);
    state.dualMode = dualConfig.isDual;

    if (dualConfig.isDual) {
        // Dual-unit mode (Quotes Duo preset):
        // pos 0 (left) @ LAppView tx=216.0 + offset.x=-112.0 => x = 104.0px
        // pos 1 (right) @ LAppView tx=432.0 + offset.x=-112.0 => x = 320.0px
        const primaryId = dualConfig.primaryId;
        const secondaryId = dualConfig.secondaryId;
        const primaryZOrder = dualConfig.primaryZOrder;
        const secondaryZOrder = dualConfig.secondaryZOrder;
        const xOverride = !window.location.hash.startsWith('#/MyPage') ? [104, 320] : [229, 445];

        // Load Primary Model (pos 0)
        await loadModel(primaryId, {
            interactive: false,
            allowedExpressions,
            allowedMotions,
            xOverride: xOverride[0],
            zOrder: primaryZOrder
        });

        if (token !== undefined && token !== outfitChangeToken) {
            destroyCurrentModels();
            return false;
        }

        // Load Secondary Model (pos 1)
        const secondaryResult = await loadAdditionalModel(secondaryId, {
            interactive: false,
            allowedExpressions,
            allowedMotions,
            xOverride: xOverride[1],
            zOrder: secondaryZOrder
        });

        if (token !== undefined && token !== outfitChangeToken) {
            destroyCurrentModels();
            return false;
        }

        // Build controller map for ScenarioSequencePlayer & state
        const controllersMap = new Map();
        controllersMap.set(String(primaryId), state.currentController);
        controllersMap.set(Number(primaryId), state.currentController);
        controllersMap.set(0, state.currentController);
        controllersMap.set('pos_0', state.currentController);

        controllersMap.set(String(secondaryId), secondaryResult.controller);
        controllersMap.set(Number(secondaryId), secondaryResult.controller);
        controllersMap.set(1, secondaryResult.controller);
        controllersMap.set('pos_1', secondaryResult.controller);

        state.currentModels.set(primaryId, { model: state.currentModel, controller: state.currentController, pos: 0 });
        state.currentModels.set(secondaryId, { model: secondaryResult.model, controller: secondaryResult.controller, pos: 1 });

        if (scenarioPlayer) {
            scenarioPlayer.setControllers(controllersMap, state.currentController);
        }
    } else {
        // Single-unit mode
        const modelId = buildModelId(charaId, live2dId);
        await loadModel(modelId, {
            interactive: false,
            allowedExpressions,
            allowedMotions
        });

        if (token !== undefined && token !== outfitChangeToken) {
            destroyCurrentModels();
            return false;
        }

        state.currentModels.set(modelId, { model: state.currentModel, controller: state.currentController, pos: 0 });
        if (scenarioPlayer) {
            const controllersMap = new Map();
            controllersMap.set(String(modelId), state.currentController);
            controllersMap.set(Number(modelId), state.currentController);
            scenarioPlayer.setControllers(controllersMap, state.currentController);
        }
    }

    if (state.currentModel) state.currentModel.visible = true;
    return true;
}

async function loadCharacterDetail(charaId) {
    resetDetailViewState();

    if (currentLoadedCharaId === charaId && state.currentModel) {
        if (state.currentModel) state.currentModel.visible = true;
        return;
    }

    currentLoadedCharaId = charaId;
    state.currentCharacterId = charaId;

    // Instantly update header name & attribute from list card without waiting for network JSON
    const cardEl = document.querySelector(`.chara[data-chara-id="${charaId}"]`);
    if (cardEl) {
        const cardName = cardEl.getAttribute('data-name');
        const cardAtt = cardEl.getAttribute('data-att');
        const cardTitle = cardEl.getAttribute('data-title') || (cardEl.querySelector('.title')?.textContent);
        const nameEl = document.getElementById('charaNameText');
        const attEl = document.getElementById('att');
        updateHeaderName(nameEl, cardName, cardTitle);
        if (attEl && cardAtt) attEl.className = cardAtt.toLowerCase();
    }

    document.body.classList.add('connecting');
    const token = ++outfitChangeToken;

    const defaultModelId = String(charaId) + '00';

    activeVoicePrefix = '00';
    let scenarioJson = null;
    const scenarioResult = await fetchScenarioJson(`${charaId}00.json`);
    if (token !== outfitChangeToken) return;

    if (scenarioResult.json) {
        scenarioJson = scenarioResult.json;
        activeScenarioUrl = scenarioResult.url;
        scenarioCache.set(activeScenarioUrl, scenarioJson);
        console.info(`[quotes] Scenario JSON loaded and cached: ${activeScenarioUrl}`);
    } else {
        console.warn(`[quotes] Failed to load scenario JSON for ${charaId}00`);
    }

    await loadCharaAttributes();
    if (token !== outfitChangeToken) return;

    const attribute = charaAttributes[charaId] || 'light';
    const attEl = document.getElementById('att');
    if (attEl) attEl.className = attribute;

    const metadataPromise = initMetadata(charaId);

    const allowedModels = new Set([defaultModelId]);
    const allowedExpressions = new Set();
    const allowedMotions = new Set();
    const allowedVoices = new Set();

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
                            if (typeof c.motion === 'number') allowedMotions.add(c.motion);
                            if (c.voice) allowedVoices.add(c.voice);
                        });
                    }
                });
            }
        });
    }

    const modelPreloadPromises = Array.from(allowedModels).map(modelId =>
        preloadModelToRam(modelId, { allowedExpressions, allowedMotions })
    );
    const voicePreloadPromise = preloadScenarioVoices(Array.from(allowedVoices), scenarioPlayer.voice);

    await Promise.all([
        ...modelPreloadPromises.map(p => p.catch(e => console.warn('[quotes] model preload error:', e))),
        voicePreloadPromise.catch(e => console.warn('[quotes] voice preload error:', e))
    ]);

    if (token !== outfitChangeToken) return;
    document.body.classList.remove('connecting');

    try {
        state.currentLive2dId = '00';
        const loadedOk = await loadOutfitModels(charaId, '00', token, allowedExpressions, allowedMotions);
        if (!loadedOk || token !== outfitChangeToken) return;

        await metadataPromise;
        if (token !== outfitChangeToken) return;
        setupOutfitButtons(charaId);
        setupVoiceButtons();
        await loadScenarioForOutfit(charaId, '00', token);
        if (token !== outfitChangeToken) return;
        setupTabs();
        setupVoiceDisplaySwitch();
    } catch (e) {
        console.error('[quotes] Model load failed:', e);
    }
}

function setHomePositioning(enabled) {
    const config = window.__QUOTES_CONFIG || (window.__QUOTES_CONFIG = {});
    if (enabled) {
        if (previousQuotesXOffset === null) previousQuotesXOffset = config.xOffset;
        config.viewMode = 'home16';
        config.xOffset = HOME_X_OFFSET;
    } else if (previousQuotesXOffset !== null) {
        config.xOffset = previousQuotesXOffset;
        previousQuotesXOffset = null;
    }
}

function collectHomeScenarioResources(scenarioJson) {
    const allowedExpressions = new Set();
    const allowedMotions = new Set();
    const allowedVoices = new Set();

    if (scenarioJson?.story) {
        Object.values(scenarioJson.story).forEach(steps => {
            if (!Array.isArray(steps)) return;
            steps.forEach(step => {
                if (!Array.isArray(step.chara)) return;
                step.chara.forEach(chara => {
                    if (chara.face) {
                        allowedExpressions.add(
                            chara.face
                                .replace(/\.exp3\.json$/, '')
                                .replace(/\.exp\.json$/, '')
                                .replace(/\.json$/, '')
                        );
                    }
                    if (typeof chara.motion === 'number') allowedMotions.add(chara.motion);
                    if (chara.voice) allowedVoices.add(chara.voice);
                });
            });
        });
    }

    return { allowedExpressions, allowedMotions, allowedVoices };
}

function homeVoiceKey(voiceId) {
    // The voice prefix follows the active outfit's scenario (mirrors the
    // original view's voicePrefixNo), so an outfit with its own quote set
    // plays vo_char_<charaId>_<prefix>_<id> instead of the base '00' keys.
    const prefix = activeVoicePrefix || '00';
    return `vo_char_${state.currentCharacterId}_${prefix}_${String(voiceId).padStart(2, '0')}`;
}

async function playHomeVoice(voiceId) {
    if (!homeActive || !scenarioPlayer || !activeScenarioUrl) return;
    scenarioPlayer.controller = state.currentController;
    return scenarioPlayer.loadAndPlayVoice(activeScenarioUrl, homeVoiceKey(voiceId), state.currentCharacterId);
}

function chooseHomeLoginVoice() {
    let firstLogin = false;
    try {
        firstLogin = !sessionStorage.getItem(HOME_LOGIN_SESSION_KEY);
        if (firstLogin) sessionStorage.setItem(HOME_LOGIN_SESSION_KEY, '1');
    } catch (e) {
        firstLogin = false;
    }

    if (firstLogin) return 24;

    const category = Math.floor(Math.random() * 4);
    if (category === 1) return 29; // Other
    if (category === 2) return 30; // placeholder Max AP
    if (category === 3) return 31; // placeholder Max BP

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 25;
    if (hour >= 12 && hour < 18) return 26;
    if (hour >= 18) return 27;
    return 28;
}

function pickHomeTapVoice() {
    if (homeTapVoicePool.length === 0) {
        homeTapVoicePool = [...HOME_TAP_VOICE_IDS];
        return HOME_TAP9_VOICE_ID;
    }

    const index = Math.floor(Math.random() * homeTapVoicePool.length);
    return homeTapVoicePool.splice(index, 1)[0];
}

// ---- Menu-triggered Live2D choreography (homescreen) ----
// On menu close the model disappears abruptly ~120ms into the slide-out and
// reappears ~450ms later at screen center (x = 512, offset.x = 0 per
// notes/live2d_positioning_and_subtitles.md) with a ~200ms fade-in; on menu
// open it eases back to the home column x (512 + HOME_X_OFFSET).
// Fades use an AlphaFilter on the model's filters (container.alpha breaks with
// Live2D depth testing per model.js) and are token-cancelled so rapid menu
// toggles can't leave interleaved fade loops fighting over the model.
let menuChoreId = 0;
let menuChoreTimers = [];
let modelFadeToken = 0;

function cancelMenuChoreography() {
    menuChoreTimers.forEach(timer => clearTimeout(timer));
    menuChoreTimers = [];
    menuChoreId++;
    modelFadeToken++;
}

function choreTimer(ms, fn) {
    const id = menuChoreId;
    const timer = setTimeout(() => {
        menuChoreTimers = menuChoreTimers.filter(t => t !== timer);
        if (id !== menuChoreId) return;
        fn();
    }, ms);
    menuChoreTimers.push(timer);
}

function modelFadeFilter(model) {
    let filter = (model.filters ?? []).find(f => f instanceof PIXI.filters.AlphaFilter) ?? null;
    if (!filter) {
        filter = new PIXI.filters.AlphaFilter(model.alpha ?? 1);
        filter.resolution = window.app?.renderer?.resolution ?? 1;
        model.filters = [...(model.filters ?? []), filter];
    }
    return filter;
}

function setModelFadeAlpha(model, alpha) {
    if (!model) return;
    modelFadeFilter(model).alpha = alpha;
}

function fadeModelTo(model, ms, toAlpha, onDone) {
    if (!model) {
        if (onDone) onDone();
        return;
    }
    const filter = modelFadeFilter(model);
    const token = modelFadeToken;
    const from = filter.alpha;
    const start = performance.now();
    const tick = () => {
        if (!model || model.destroyed || token !== modelFadeToken) return;
        const t = Math.min(1, (performance.now() - start) / ms);
        const eased = 1 - Math.pow(1 - t, 3);
        filter.alpha = from + (toAlpha - from) * eased;
        if (t < 1) {
            requestAnimationFrame(tick);
        } else {
            filter.alpha = toAlpha;
            if (toAlpha >= 1) {
                const fl = model.filters;
                if (fl) {
                    const remaining = fl.filter(f => f !== filter);
                    model.filters = remaining.length ? remaining : null;
                }
            }
            if (onDone) onDone();
        }
    };
    tick();
}

// Menu open/close is a fresh model spawn, as in the game: the home model is
// destroyed instantly (no fade-out) together with any running transformation
// effect, and a new instance with default params appears at the new position.
let homeMenuSpawnToken = 0;

async function respawnHomeModel() {
    const token = ++homeMenuSpawnToken;

    // An outfit click commits state.currentLive2dId immediately, so even when
    // the menu closes mid-transformation (before the 0.5s VFX wait resolves)
    // the respawn uses the new outfit — same as the game showing the post-
    // transformation model in the center.
    const live2dId = String(state.currentLive2dId ?? '00').padStart(2, '0');

    destroyCurrentModels();
    try {
        await loadOutfitModels(state.currentCharacterId, live2dId, undefined);
        if (token !== homeMenuSpawnToken || !homeActive) {
            destroyCurrentModels();
            return;
        }
        if (state.currentModel) state.currentModel.visible = true;
    } catch (e) {
        console.warn('[quotes] Home menu model respawn failed:', e);
    }
}

function mypageMenuChoreography(open) {
    cancelMenuChoreography();
    // Commit the menu state before the model guard: toggling while the home
    // model is still preloading (phase 2) must still flip menu-closed and the
    // xOffset so a later spawn pairs the right column/center positioning with
    // the menu's visual state instead of exposing a self-healing-on-next-toggle
    // gap (review P4).
    const uiLayer = document.getElementById('ui-layer');
    if (uiLayer) uiLayer.classList.toggle('menu-closed', !open);

    window.__QUOTES_CONFIG.xOffset = open ? HOME_X_OFFSET : 0;

    if (!state.currentModel) return;

    if (scenarioPlayer) scenarioPlayer.stop();
    cancelOutfitChanges();
    respawnHomeModel();
}

window.mypageMenuChoreography = mypageMenuChoreography;

async function setMyPagePortraitMode(enabled) {
    if (!window.location.hash.startsWith('#/MyPage')) return false;

    const portrait = Boolean(enabled);
    cancelMenuChoreography();
    scenarioPlayer?.stop();
    cancelOutfitChanges();

    const config = window.__QUOTES_CONFIG || (window.__QUOTES_CONFIG = {});
    config.viewMode = portrait ? 'portrait' : 'home16';

    const sideMenu = document.getElementById('sideMenu');
    config.xOffset = portrait
        ? 0
        : sideMenu?.classList.contains('anim') ? HOME_X_OFFSET : 0;

    if (typeof window.updateViewerViewport === 'function') {
        window.updateViewerViewport();
    }

    if (!homeActive || !homeReady || !state.currentModel) return true;
    await respawnHomeModel();
    return true;
}

window.setMyPagePortraitMode = setMyPagePortraitMode;

async function revealHomeScreen() {
    if (!homeActive || !homeReady || homeRevealed) return;

    homeRevealed = true;
    try {
        if (player?.audioCtx?.state === 'suspended') await player.audioCtx.resume();
        scenarioPlayer?.resumeAudio();
        if (player) player.play();
    } catch (e) {
        console.warn('[quotes] Home audio unlock failed:', e);
    }

    if (bgArmature) bgArmature.visible = true;
    document.body.classList.remove('connecting');

    // As-in-game sequence: ~120ms after connecting clears the carousel
    // banners slide in from the right (the dots are already revealed with
    // the column); the Live2D fades in last, after the banners are in place.
    // The home quote starts at the same moment the model spawns: the voice's
    // decode latency lands the subtitle ~100-150ms into the fade-in (see
    // notes/live2d_positioning_and_subtitles.md). These run on choreTimer so
    // a menu interaction or navigation cancels the reveal cleanly.
    choreTimer(120, () => {
        if (typeof window.startBannerCarousel === 'function') {
            window.startBannerCarousel();
        }
    });
    choreTimer(550, () => {
        const targets = Array.from(new Set(
            Array.from(state.currentModels.values()).map(e => e && e.model).filter(Boolean)
        ));
        if (targets.length === 0 && state.currentModel) targets.push(state.currentModel);
        if (targets.length === 0) return;
        targets.forEach(m => {
            m.visible = true;
            setModelFadeAlpha(m, 0);
            fadeModelTo(m, 250, 1);
        });
        playHomeVoice(chooseHomeLoginVoice()).catch(e => {
            console.warn('[quotes] Home login voice failed:', e);
        });
    });
}

function resolveRequestedCharaId() {
    const hashQuery = window.location.hash.split('?')[1] || '';
    const hashId = new URLSearchParams(hashQuery).get('id');
    const searchId = new URLSearchParams(window.location.search).get('id');
    const raw = hashId || searchId || '';
    return /^\d{4}$/.test(raw) ? Number(raw) : getFavoriteCharaId();
}

async function loadHomeScreen() {
    homeDesiredActive = true;
    bgSetActive = false;
    bgPreviewToken++;
    const requestToken = ++homeRequestToken;
    while (homeTeardownPromise || homeStopPromise) {
        await (homeTeardownPromise || homeStopPromise);
        if (requestToken !== homeRequestToken) return;
    }

    const requestedId = resolveRequestedCharaId();
    const activeId = homeLoadedCharaId ?? homePendingCharaId;
    if ((homeReady || homeLoadPromise) && (activeId == null || activeId !== requestedId)) {
        console.info(`[quotes] Home character change requested: ${activeId} -> ${requestedId}`);
        homeTapVoicePool = [...HOME_TAP_VOICE_IDS];
        await teardownHomeScreen({ keepBackground: true, keepBgm: true });
        if (requestToken !== homeRequestToken) return;
    }

    homeActive = true;
    homeSceneMounted = true;
    document.getElementById('ui-layer')?.classList.add('home-mode');
    document.getElementById('ui-layer')?.classList.remove('menu-closed');
    state.currentCharacterId = requestedId;
    initMyPageOutfitWiring();
    initFavoriteCharaIcon();
    if (!state.live2dListData || state.live2dListData.length === 0) {
        initMetadata(requestedId).then(syncMyPageOutfitUI);
    }
    syncMyPageOutfitUI();

    const savedBg = await resolveSavedHomeBackground();
    if (requestToken !== homeRequestToken || !homeActive) return;
    committedHomeBg = savedBg;

    if (homeReady) {
        // Same-id re-entry (e.g. returning from #/BackgroundSet): ensure saved
        // BG + BGM are active (no-op if already loaded) and restore home layout.
        setHomePositioning(true);
        if (typeof window.updateViewerViewport === 'function') {
            window.updateViewerViewport();
        }
        await Promise.all([
            initBackground(savedBg, { visible: true, autoplay: true, crossfadeMs: 300 }).catch((e) =>
                console.warn('[quotes] Failed to restore home background:', e)
            ),
            playTrack(savedBg.bgmFile, { autoplay: true }).catch((e) =>
                console.warn('[quotes] Failed to restore home BGM:', e)
            )
        ]);
        if (requestToken !== homeRequestToken || !homeActive) return;

        if (homeNeedsRespawn) {
            homeNeedsRespawn = false;
            await respawnHomeModel();
            if (requestToken !== homeRequestToken || !homeActive) return;
        }

        revealHomeMenu();
        if (homeRevealed) {
            if (typeof window.startBannerCarousel === 'function') {
                window.startBannerCarousel();
            }
            return;
        }
        const audioUnlocked = isHomeAudioUnlocked() || await waitForHomeAudioUnlock();
        if (requestToken !== homeRequestToken) return;
        if (audioUnlocked || HOME_OPENED_FROM_INDEX) await revealHomeScreen();
        return;
    }
    if (homeLoadPromise) {
        await homeLoadPromise;
        if (requestToken !== homeRequestToken) return;
        if (!homeActive || !homeSceneMounted) return;
        revealHomeMenu();
        if (!homeRevealed) {
            const audioUnlocked = isHomeAudioUnlocked() || await waitForHomeAudioUnlock();
            if (requestToken !== homeRequestToken) return;
            if (audioUnlocked || HOME_OPENED_FROM_INDEX) await revealHomeScreen();
        } else if (typeof window.startBannerCarousel === 'function') {
            window.startBannerCarousel();
        }
        return;
    }

    const generation = ++homeGeneration;
    homePendingCharaId = requestedId;
    setHomePositioning(true);
    document.body.classList.add('connecting');

    homeLoadPromise = (async () => {
        // Phase 1: prepare the scene background and BGM independently, then
        // start both together. The Connecting state remains active over them.
        const hasExistingBg = Boolean(bgArmature && !bgArmature.destroyed && bgArmature.visible);
        await Promise.all([
            initBackground(savedBg, { visible: true, autoplay: hasExistingBg, crossfadeMs: hasExistingBg ? 300 : 0 }).catch((err) => {
                console.warn('[quotes] Saved home background failed, falling back to default:', err);
                return initBackground(HOME_BACKGROUND_FILE, { visible: true, autoplay: hasExistingBg, crossfadeMs: hasExistingBg ? 300 : 0 });
            }),
            playTrack(savedBg.bgmFile, { autoplay: false }).catch((err) => {
                console.warn('[quotes] Saved home BGM failed, falling back to default:', err);
                return playTrack(HOME_BGM_FILE, { autoplay: false });
            })
        ]);
        if (!homeActive || generation !== homeGeneration) return;
        startBackgroundAndMusic();
        console.info('[quotes] Homescreen background and BGM started; loading character assets.');
        // The GlobalMenu UI (status bar + side menu) appears right after the
        // background + BGM are playing, before the model finishes loading.
        revealHomeMenu();
        // Phase 1 is complete: let the running background/music show briefly
        // without a loading indicator. Phase 2 owns the indicator from the
        // moment its first asset request starts until all assets are ready.
        document.body.classList.remove('connecting');

        // Phase 2: keep Connecting visible while preparing the scenario,
        // model files, and every voice referenced by the homescreen scenario.
        document.body.classList.add('connecting');
        setAssetPreloadConnecting(true);
        try {
            const scenarioPath = state.currentCharacterId + '00.json';
            const scenarioResult = await fetchScenarioJson(scenarioPath);
            if (!scenarioResult.json) throw new Error(`Failed to load home scenario ${scenarioPath}`);
            if (!homeActive || generation !== homeGeneration) return;

            activeVoicePrefix = '00';
            activeScenarioUrl = scenarioResult.url;
            scenarioCache.set(activeScenarioUrl, scenarioResult.json);
            state.currentLive2dId = '00';
            state.currentModelId = state.currentCharacterId + '00';

            const { allowedExpressions, allowedMotions, allowedVoices } =
                collectHomeScenarioResources(scenarioResult.json);

            await Promise.all([
                preloadModelToRam(state.currentModelId, { allowedExpressions, allowedMotions }),
                preloadScenarioVoices(Array.from(allowedVoices), scenarioPlayer.voice),
                preloadOpenSansFont()
            ]);
            if (!homeActive || generation !== homeGeneration) return;

            const loadedOk = await loadOutfitModels(requestedId, '00', undefined, allowedExpressions, allowedMotions);
            if (!loadedOk || !homeActive || generation !== homeGeneration) {
                destroyCurrentModels();
                return;
            }

            for (const model of new Set(
                Array.from(state.currentModels.values()).map(e => e && e.model).filter(Boolean)
            )) {
                model.visible = false;
            }
            homeReady = true;
            homeLoadedCharaId = requestedId;
            console.info('[quotes] Homescreen character and voice assets preloaded; ready for reveal.');
        } finally {
            setAssetPreloadConnecting(false);
        }

        const audioUnlocked = isHomeAudioUnlocked() || await waitForHomeAudioUnlock();
        // A navigation from index.html carries the same autoplay intent as the
        // existing Quotes entry. Direct loads/reloads still wait for a gesture.
        if (audioUnlocked || HOME_OPENED_FROM_INDEX) await revealHomeScreen();
    })().catch(error => {
        console.error('[quotes] Homescreen preload failed:', error);
        homeReady = false;
        if (generation === homeGeneration) {
            document.body.classList.remove('connecting');
        }
    }).finally(() => {
        homeLoadPromise = null;
        homePendingCharaId = null;
    });

    return homeLoadPromise;
}

async function previewHomeBackground(entry) {
    if (!entry || !bgSetActive) return;
    bgPrefetchToken++;
    const token = ++bgPreviewToken;
    try {
        await Promise.all([
            initBackground(entry, { visible: true, autoplay: true, crossfadeMs: 300 }),
            playTrack(entry.bgmFile, { autoplay: true }).catch((err) => {
                console.warn('[quotes] Preview BGM failed:', entry.bgmFile, err);
                if (!player || player.closed) {
                    return playTrack(HOME_BGM_FILE, { autoplay: true }).catch(() => {});
                }
            })
        ]);
    } catch (err) {
        if (token === bgPreviewToken) {
            console.error('[quotes] Preview background failed:', entry.id, err);
        }
    }
}

async function prefetchHomeBackgrounds(entries) {
    if (!bgSetActive || !Array.isArray(entries) || entries.length === 0) return;
    const token = ++bgPrefetchToken;
    for (const entry of entries) {
        if (token !== bgPrefetchToken || !bgSetActive) return;
        try {
            const target = await resolveBackgroundTarget(entry);
            if (token !== bgPrefetchToken || !bgSetActive) return;
            if (!bgAssetCache.has(target.key)) {
                await getOrLoadCachedBgAssets(target.key, target.url);
            }
            if (token !== bgPrefetchToken || !bgSetActive) return;
            if (entry.bgm && !bgmDecryptedCache.has(entry.bgmFile)) {
                await getOrFetchDecryptedBgm(entry.bgmFile);
            }
        } catch {}
    }
}

function commitHomeBackground(entry) {
    if (entry) committedHomeBg = entry;
}

window.previewHomeBackground = previewHomeBackground;
window.prefetchHomeBackgrounds = prefetchHomeBackgrounds;
window.commitHomeBackground = commitHomeBackground;
window.getHomeCharacterId = () => state.currentCharacterId || resolveRequestedCharaId();
window.setFavoriteCharacter = (charaId) => {
    setFavoriteCharaId(charaId);
    state.currentCharacterId = Number(charaId);
    state.currentLive2dId = '00';
};

// ===== Magical Girls (#/CharaListTop) Mini Character & Stage =====
const CH_TOP_MARKER_URL = 'magica/resource/image_native/effect/web_ef_unit_marker/web_ef_unit_marker.ExportJson';
const CH_TOP_COMMON_BG = { dir: 'web', file: 'web_common.ExportJson', id: 'web_common' };
const MINI_CHARA_X = 400;
const MINI_CHARA_Y = 383;
const MINI_CACHE_LIMIT = 16;

let miniCharaLayer = null;
let unitMarkerArmature = null;
let unitMarkerTick = null;
let unitMarkerAssetsPromise = null;
let miniCharaArmature = null;
let miniCharaTick = null;
let activeMiniCharaNo = null;
let miniLoadToken = 0;
const miniAssetCache = new Map();

function ensureMiniCharaLayer() {
    if (!window.cameraContainer) return null;
    if (!miniCharaLayer || miniCharaLayer.destroyed) {
        miniCharaLayer = new PIXI.Container();
        miniCharaLayer.name = 'miniCharaLayer';
        window.cameraContainer.addChild(miniCharaLayer);
    } else if (miniCharaLayer.parent !== window.cameraContainer) {
        window.cameraContainer.addChild(miniCharaLayer);
    }
    return miniCharaLayer;
}

async function ensureUnitMarker(layer, token) {
    if (unitMarkerArmature && !unitMarkerArmature.destroyed) {
        if (unitMarkerArmature.parent !== layer) {
            layer.addChildAt(unitMarkerArmature, 0);
        }
        return;
    }
    try {
        if (!unitMarkerAssetsPromise) {
            unitMarkerAssetsPromise = loadCocosBackgroundAssets(CH_TOP_MARKER_URL).catch((err) => {
                unitMarkerAssetsPromise = null;
                throw err;
            });
        }
        const assets = await unitMarkerAssetsPromise;
        if (token !== miniLoadToken || !charaTopActive || !layer || layer.destroyed) return;

        const marker = new MiniCharArmature(assets.json, assets.textures, assets.particles);
        marker.x = MINI_CHARA_X;
        marker.y = MINI_CHARA_Y;
        marker.scale.set(0.8, 0.2);
        marker.play('player_marker_01', true);
        layer.addChildAt(marker, 0);
        unitMarkerArmature = marker;

        const tick = (delta) => {
            if (!marker || marker.destroyed || !charaTopActive) {
                if (unitMarkerTick) {
                    window.app.ticker.remove(unitMarkerTick);
                    unitMarkerTick = null;
                }
                return;
            }
            if (marker.playing) {
                try { marker.update(delta / 60); } catch {}
            }
        };
        unitMarkerTick = tick;
        window.app.ticker.add(tick);
    } catch (err) {
        console.warn('[quotes] Unit marker load failed:', err);
    }
}

function getMovementsSet(armature) {
    const movs = armature?.json?.animation_data?.[0]?.mov_data;
    if (!Array.isArray(movs)) return null;
    return new Set(movs.map((m) => m?.name).filter(Boolean));
}

function playMiniSequence(armature, animations, standPose = 'wait') {
    if (!armature || armature.destroyed) return;
    const available = getMovementsSet(armature);
    const fallbackPose = (available && !available.has(standPose))
        ? (available.has('wait') ? 'wait' : Array.from(available)[0])
        : standPose;

    const rawQueue = Array.isArray(animations) && animations.length > 0
        ? animations
        : [fallbackPose];

    const queue = rawQueue.map((name) => {
        if (!available || available.has(name)) return name;
        return fallbackPose;
    }).filter(Boolean);

    if (queue.length === 0) return;

    let idx = 0;
    const playStep = () => {
        if (!armature || armature.destroyed) return;
        const isLast = idx >= queue.length - 1;
        const movName = queue[idx];
        armature.onMovementEvent = isLast
            ? null
            : (evtName) => {
                if (evtName === 'complete') {
                    idx++;
                    playStep();
                }
            };
        try {
            armature.play(movName, isLast);
        } catch (err) {
            console.warn('[quotes] mini animation play failed:', movName, err);
        }
    };
    playStep();
}

function destroyMiniCharacterOnly() {
    if (miniCharaTick) {
        window.app.ticker.remove(miniCharaTick);
        miniCharaTick = null;
    }
    if (miniCharaArmature) {
        miniCharaArmature.onMovementEvent = null;
        try {
            if (miniCharaArmature.parent) miniCharaArmature.parent.removeChild(miniCharaArmature);
            miniCharaArmature.destroy({ children: true });
        } catch {}
        miniCharaArmature = null;
    }
    activeMiniCharaNo = null;
}

function hideCharaTopMini() {
    charaTopActive = false;
    miniLoadToken++;
    destroyMiniCharacterOnly();
    if (unitMarkerTick) {
        window.app.ticker.remove(unitMarkerTick);
        unitMarkerTick = null;
    }
    if (unitMarkerArmature) {
        try {
            if (unitMarkerArmature.parent) unitMarkerArmature.parent.removeChild(unitMarkerArmature);
            unitMarkerArmature.destroy({ children: true });
        } catch {}
        unitMarkerArmature = null;
    }
    if (miniCharaLayer) {
        try {
            if (miniCharaLayer.parent) miniCharaLayer.parent.removeChild(miniCharaLayer);
            miniCharaLayer.destroy({ children: true });
        } catch {}
        miniCharaLayer = null;
    }
}

class MiniCharArmature extends CocosStudioArmature {
    constructor(json, textures, particles, frameMeta = {}) {
        const taggedJson = {
            ...json,
            __frameMeta: frameMeta || {}
        };
        super(taggedJson, textures, particles);
        this.frameMeta = frameMeta || {};
        this.selfTrigger = null;
        this.returnToMov = null;
        this._playingSelfUnique = false;
    }

    buildHierarchy() {
        const armatureData = this.json.armature_data?.[0];
        if (!armatureData) return;

        const textureData = this.json.texture_data || [];
        const frameMeta = this.json.__frameMeta || this.frameMeta || {};
        this.boneOrder = [];

        for (const bone of armatureData.bone_data) {
            const container = new PIXI.Container();
            container.name = bone.name;
            container.parentBoneName = bone.parent || '';

            container.setupX = bone.x ?? 0;
            container.setupY = bone.y ?? 0;
            container.setupScaleX = bone.cX ?? 1;
            container.setupScaleY = bone.cY ?? 1;
            container.setupSkewX = bone.kX ?? 0;
            container.setupSkewY = bone.kY ?? 0;
            container.setupZ = bone.z ?? 0;

            container.localX = container.setupX;
            container.localY = container.setupY;
            container.localScaleX = container.setupScaleX;
            container.localScaleY = container.setupScaleY;
            container.localSkewX = container.setupSkewX;
            container.localSkewY = container.setupSkewY;
            container.zOrder = container.setupZ;

            this.bones[bone.name] = container;
            this.boneOrder.push(bone.name);

            if (bone.display_data) {
                container.displays = [];
                for (const disp of bone.display_data) {
                    if (disp.displayType === 0) {
                        let tex = this.textures[disp.name];
                        if (!tex) {
                            const cleanName = disp.name.replace(/\.png$/i, '');
                            tex = this.textures[cleanName] || this.textures[cleanName + '.png'];
                        }
                        if (tex) {
                            const sprite = new PIXI.Sprite(tex);
                            const baseName = disp.name.replace(/\.png$/i, '');
                            const texInfo = textureData.find((t) => t.name === baseName);
                            const pX = texInfo ? (texInfo.pX ?? 0.5) : 0.5;
                            const pY = texInfo ? (texInfo.pY ?? 0.5) : 0.5;

                            const meta = frameMeta[disp.name] || frameMeta[baseName + '.png'];
                            const w = tex.orig?.width || tex.width || 1;
                            const h = tex.orig?.height || tex.height || 1;
                            const origW = meta?.originalWidth ?? w;
                            const origH = meta?.originalHeight ?? h;
                            const offX = meta?.offsetX ?? 0;
                            const offY = meta?.offsetY ?? 0;
                            const anchorX = 0.5 + (((pX - 0.5) * origW) - offX) / w;
                            const anchorY = 0.5 + (((0.5 - pY) * origH) + offY) / h;
                            sprite.anchor.set(anchorX, anchorY);

                            const skin = disp.skin_data?.[0] || { x: 0, y: 0, cX: 1, cY: 1, kX: 0, kY: 0 };
                            sprite.x = skin.x ?? 0;
                            sprite.y = -(skin.y ?? 0);
                            sprite.scale.set(skin.cX ?? 1, skin.cY ?? 1);
                            sprite.skew.set(-(skin.kX ?? 0), -(skin.kY ?? 0));

                            sprite.visible = false;
                            container.addChild(sprite);
                            container.displays.push(sprite);
                        } else {
                            container.displays.push(null);
                        }
                    } else if (disp.displayType === 1) {
                        const childArmData = this.json.armature_data.find((a) => a.name === disp.name);
                        if (childArmData) {
                            const childJson = {
                                ...this.json,
                                armature_data: [childArmData]
                            };
                            const subArm = new MiniCharArmature(childJson, this.textures, this.particles, frameMeta);
                            subArm.visible = false;
                            container.addChild(subArm);
                            container.displays.push(subArm);
                            this.nestedArmatures.push(subArm);
                        } else {
                            container.displays.push(null);
                        }
                    } else if (disp.displayType === 2) {
                        const config = this.particles[disp.plist];
                        if (config) {
                            const emitter = new CocosStudioParticleEmitter(config);
                            emitter.visible = false;
                            container.addChild(emitter);
                            container.displays.push(emitter);
                            this.particleEmitters.push(emitter);
                        } else {
                            container.displays.push(null);
                        }
                    } else {
                        container.displays.push(null);
                    }
                }
            }

            // Add every bone directly to this armature so zOrder sorts globally across bones
            this.addChild(container);
        }

        this.applyWorldTransforms();
        this.sortAllChildren();
    }

    applyWorldTransforms() {
        const order = this.boneOrder || Object.keys(this.bones);
        for (const name of order) {
            const bone = this.bones[name];
            if (!bone) continue;
            const parent = bone.parentBoneName ? this.bones[bone.parentBoneName] : null;
            if (parent) {
                const x = bone.localX;
                const y = bone.localY;
                bone.worldX = x * parent.matA + y * parent.matC + parent.worldX;
                bone.worldY = x * parent.matB + y * parent.matD + parent.worldY;
                bone.worldScaleX = bone.localScaleX * parent.worldScaleX;
                bone.worldScaleY = bone.localScaleY * parent.worldScaleY;
                bone.worldSkewX = bone.localSkewX + parent.worldSkewX;
                bone.worldSkewY = bone.localSkewY + parent.worldSkewY;
            } else {
                bone.worldX = bone.localX;
                bone.worldY = bone.localY;
                bone.worldScaleX = bone.localScaleX;
                bone.worldScaleY = bone.localScaleY;
                bone.worldSkewX = bone.localSkewX;
                bone.worldSkewY = bone.localSkewY;
            }

            bone.matA = bone.worldScaleX * Math.cos(bone.worldSkewY);
            bone.matB = bone.worldScaleX * Math.sin(bone.worldSkewY);
            bone.matC = bone.worldScaleY * Math.sin(bone.worldSkewX);
            bone.matD = bone.worldScaleY * Math.cos(bone.worldSkewX);

            bone.x = bone.worldX;
            bone.y = -bone.worldY;
            bone.scale.set(bone.worldScaleX, bone.worldScaleY);
            bone.skew.set(-bone.worldSkewX, -bone.worldSkewY);
        }
    }

    play(movementNameOrIndex, loop = true) {
        const animationData = this.json.animation_data?.[0];
        if (!animationData) return;

        let movement = null;
        if (typeof movementNameOrIndex === 'number') {
            movement = animationData.mov_data[movementNameOrIndex];
        } else {
            movement = animationData.mov_data.find((m) => m.name === movementNameOrIndex);
        }

        if (!movement) {
            console.warn('[CocosStudioPlayer] Movement not found:', movementNameOrIndex);
            return;
        }

        if (!this._playingSelfUnique) {
            this.returnToMov = null;
        }
        this.selfTrigger = null;

        this.currentMovement = movement;
        this.currentFrame = 0;
        this.elapsedTime = 0;
        this.playing = true;
        this.loop = loop;

        if (loop) {
            for (const timeline of movement.mov_bone_data || []) {
                for (const f of timeline.frame_data || []) {
                    if (!f.evt) continue;
                    const m = String(f.evt).match(/^playSelf_([^_]+)_(\d+)_(\d+)$/i);
                    if (m) {
                        const minLoops = Math.max(1, parseInt(m[2], 10));
                        const maxLoops = Math.max(minLoops, parseInt(m[3], 10));
                        const remainingLoops = minLoops + Math.floor(Math.random() * (maxLoops - minLoops + 1));
                        this.selfTrigger = { targetMov: m[1], minLoops, maxLoops, remainingLoops };
                        break;
                    }
                }
                if (this.selfTrigger) break;
            }
        }

        for (const name in this.bones) {
            const bone = this.bones[name];
            bone.localX = bone.setupX;
            bone.localY = bone.setupY;
            bone.localScaleX = bone.setupScaleX;
            bone.localScaleY = bone.setupScaleY;
            bone.localSkewX = bone.setupSkewX;
            bone.localSkewY = bone.setupSkewY;
            bone.zOrder = bone.setupZ;
            bone.alpha = 1;
            if (bone.displays) {
                for (const disp of bone.displays) {
                    if (disp) disp.visible = false;
                }
            }
        }

        for (const subArm of this.nestedArmatures) {
            subArm.play(movementNameOrIndex, loop);
        }

        this.applyWorldTransforms();
        this.sortAllChildren();

        if (this.onMovementEvent) {
            try {
                this.onMovementEvent('start', this.currentMovement.name);
            } catch (e) {
                console.error('[CocosStudioPlayer] Error in onMovementEvent:', e);
            }
        }
    }

    update(dt) {
        if (!this.playing || !this.currentMovement) return;

        const prevFrame = this.currentFrame;

        this.elapsedTime += dt;
        const fps = 60;
        let frame = this.elapsedTime * fps * this.animationScale;
        const duration = this.currentMovement.dr || 1;

        let loopCompleted = false;
        let completed = false;

        if (this.loop) {
            if (frame >= duration) {
                loopCompleted = true;
            }
            frame = frame % duration;
        } else if (frame >= duration - 1) {
            frame = duration - 1;
            let hasLiveParticles = false;
            for (const emitter of this.particleEmitters) {
                if (emitter.particlesList && emitter.particlesList.length > 0) {
                    hasLiveParticles = true;
                    break;
                }
            }
            if (!hasLiveParticles) {
                completed = true;
                this.playing = false;
            }
        }

        this.currentFrame = frame;

        if (this.onFrameEvent) {
            const movBoneDataList = this.currentMovement.mov_bone_data || [];
            for (const timeline of movBoneDataList) {
                const frames = timeline.frame_data || [];
                for (const f of frames) {
                    if (f.evt) {
                        let crossed = false;
                        if (loopCompleted) {
                            crossed = (f.fi >= prevFrame && f.fi < duration) || (f.fi >= 0 && f.fi <= this.currentFrame);
                        } else if (prevFrame <= this.currentFrame) {
                            crossed = (f.fi > prevFrame && f.fi <= this.currentFrame);
                        }
                        if (crossed) {
                            try {
                                this.onFrameEvent(f.evt);
                            } catch (e) {
                                console.error('[CocosStudioPlayer] Error in onFrameEvent:', e);
                            }
                        }
                    }
                }
            }
        }

        if (loopCompleted && this.onMovementEvent) {
            try {
                this.onMovementEvent('loopComplete', this.currentMovement.name);
            } catch (e) {
                console.error('[CocosStudioPlayer] Error in onMovementEvent:', e);
            }
        }
        if (completed && this.onMovementEvent) {
            try {
                this.onMovementEvent('complete', this.currentMovement.name);
            } catch (e) {
                console.error('[CocosStudioPlayer] Error in onMovementEvent:', e);
            }
        }

        const movBoneDataList = this.currentMovement.mov_bone_data || [];
        for (const timeline of movBoneDataList) {
            const bone = this.bones[timeline.name];
            if (!bone) continue;

            const frames = timeline.frame_data || [];
            if (frames.length === 0) continue;

            let prevKey = frames[0];
            let nextKey = frames[0];

            if (frame < frames[0].fi) {
                prevKey = frames[0];
                nextKey = frames[0];
            } else if (frame >= frames[frames.length - 1].fi) {
                prevKey = frames[frames.length - 1];
                nextKey = frames[frames.length - 1];
            } else {
                for (let i = 0; i < frames.length - 1; i++) {
                    if (frame >= frames[i].fi && frame < frames[i + 1].fi) {
                        prevKey = frames[i];
                        nextKey = frames[i + 1];
                        break;
                    }
                }
            }

            let ratio = 0;
            if (nextKey.fi !== prevKey.fi) {
                ratio = (frame - prevKey.fi) / (nextKey.fi - prevKey.fi);
            }

            const tween = prevKey.tweenFrame !== false;
            const twE = prevKey.twE ?? 0;
            const t = tween ? this.getTweenPercent(ratio, twE) : 0;

            const dx = prevKey.x + t * (nextKey.x - prevKey.x);
            const dy = prevKey.y + t * (nextKey.y - prevKey.y);
            const dScaleX = prevKey.cX + t * (nextKey.cX - prevKey.cX);
            const dScaleY = prevKey.cY + t * (nextKey.cY - prevKey.cY);

            const dSkewX = prevKey.kX + t * (nextKey.kX - prevKey.kX);
            const dSkewY = prevKey.kY + t * (nextKey.kY - prevKey.kY);

            const prevColor = prevKey.color || { r: 255, g: 255, b: 255, a: 255 };
            const nextColor = nextKey.color || { r: 255, g: 255, b: 255, a: 255 };
            const currR = prevColor.r + t * (nextColor.r - prevColor.r);
            const currG = prevColor.g + t * (nextColor.g - prevColor.g);
            const currB = prevColor.b + t * (nextColor.b - prevColor.b);
            const currA = prevColor.a + t * (nextColor.a - prevColor.a);

            bone.localX = bone.setupX + dx;
            bone.localY = bone.setupY + dy;
            bone.localScaleX = bone.setupScaleX * dScaleX;
            bone.localScaleY = bone.setupScaleY * dScaleY;
            bone.localSkewX = bone.setupSkewX + dSkewX;
            bone.localSkewY = bone.setupSkewY + dSkewY;
            bone.alpha = currA / 255;

            const prevZ = prevKey.z ?? 0;
            const nextZ = nextKey.z ?? 0;
            const dZ = prevZ + t * (nextZ - prevZ);
            bone.zOrder = bone.setupZ + Math.round(dZ);

            const displayIndex = prevKey.dI;
            let blendMode = PIXI.BLEND_MODES.NORMAL;
            if ((prevKey.bd_src === 770 && prevKey.bd_dst === 1) || (prevKey.bd_src === 1 && prevKey.bd_dst === 1)) {
                blendMode = PIXI.BLEND_MODES.ADD;
            }
            const tintHex = (Math.round(currR) << 16) | (Math.round(currG) << 8) | Math.round(currB);

            if (bone.displays) {
                for (let j = 0; j < bone.displays.length; j++) {
                    const dispNode = bone.displays[j];
                    if (dispNode) {
                        const show = (j === displayIndex);
                        if (dispNode instanceof CocosStudioParticleEmitter) {
                            dispNode.active = show;
                            dispNode.visible = show || (dispNode.particlesList && dispNode.particlesList.length > 0);
                        } else {
                            dispNode.visible = show;
                            dispNode.blendMode = blendMode;
                            if (dispNode instanceof PIXI.Sprite) {
                                dispNode.tint = tintHex;
                            }
                        }
                    }
                }
            }
        }

        for (const emitter of this.particleEmitters) {
            emitter.update(dt);
        }
        for (const subArm of this.nestedArmatures) {
            subArm.update(dt);
        }

        this.applyWorldTransforms();
        this.sortAllChildren();

        if (this.loop && loopCompleted && this.selfTrigger) {
            this.selfTrigger.remainingLoops--;
            if (this.selfTrigger.remainingLoops <= 0) {
                const movs = this.json.animation_data?.[0]?.mov_data || [];
                const targetName = this.selfTrigger.targetMov.toLowerCase();
                const matchedMov = movs.find((m) => String(m?.name || '').toLowerCase() === targetName);
                if (matchedMov) {
                    this.returnToMov = this.currentMovement.name;
                    this._playingSelfUnique = true;
                    this.play(matchedMov.name, false);
                    this._playingSelfUnique = false;
                }
            }
        } else if (!this.loop && completed && this.returnToMov) {
            const backMov = this.returnToMov;
            this.returnToMov = null;
            this.play(backMov, true);
        }
    }
}

async function fetchMiniCompanionFile(primaryDir, fallbackDir, filename, asBinary = false) {
    const urls = [`${primaryDir}/${filename}`];
    if (fallbackDir && fallbackDir !== primaryDir) urls.push(`${fallbackDir}/${filename}`);
    for (const url of urls) {
        try {
            const resp = await fetch(url);
            if (!resp.ok) continue;
            const buf = await resp.arrayBuffer();
            const bytes = new Uint8Array(buf);
            const isGzip = bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
            if (isGzip && typeof DecompressionStream === 'function') {
                const decompressed = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
                return asBinary ? await new Response(decompressed).arrayBuffer() : await new Response(decompressed).text();
            }
            return asBinary ? buf : new TextDecoder().decode(bytes);
        } catch {}
    }
    return null;
}

async function getMiniAssets(miniCharaNo) {
    const key = String(miniCharaNo);
    if (miniAssetCache.has(key)) {
        const cached = miniAssetCache.get(key);
        miniAssetCache.delete(key);
        miniAssetCache.set(key, cached);
        return cached;
    }
    const base = await getImageNativeBase();
    const v2Dir = `${base}/mini/anime_v2`;
    const v1Dir = `${base}/mini/anime`;
    let assetsDir = v2Dir;
    let assets = null;
    try {
        assets = await loadCocosBackgroundAssets(`${v2Dir}/mini_${key}_r.ExportJson.gz`);
    } catch {
        assetsDir = v1Dir;
        assets = await loadCocosBackgroundAssets(`${v1Dir}/mini_${key}_r.ExportJson`);
    }

    const frameMeta = {};
    const plistPaths = (assets.json?.config_file_path || []).filter((p) => typeof p === 'string' && /\.plist$/i.test(p));
    await Promise.all(plistPaths.map(async (plistPath) => {
        try {
            const xml = await fetchMiniCompanionFile(assetsDir, v1Dir, plistPath, false);
            if (!xml) return;
            const parsed = parsePlist(xml);
            if (!parsed?.frames) return;
            for (const [frameName, frame] of Object.entries(parsed.frames)) {
                frameMeta[frameName] = {
                    width: Number(frame.width) || 0,
                    height: Number(frame.height) || 0,
                    originalWidth: Number(frame.originalWidth ?? frame.width) || 0,
                    originalHeight: Number(frame.originalHeight ?? frame.height) || 0,
                    offsetX: Number(frame.offsetX) || 0,
                    offsetY: Number(frame.offsetY) || 0
                };
            }
        } catch {}
    }));
    assets.frameMeta = frameMeta;

    if (miniAssetCache.size >= MINI_CACHE_LIMIT) {
        const oldestKey = miniAssetCache.keys().next().value;
        const oldest = miniAssetCache.get(oldestKey);
        miniAssetCache.delete(oldestKey);
        if (oldest) {
            disposeCocosAssets(oldest.textures, oldest.particles, collectCocosBaseTextures(miniCharaArmature));
        }
    }
    miniAssetCache.set(key, assets);
    return assets;
}

async function showCharaTopMini(miniCharaNo, options = {}) {
    if (!miniCharaNo) return;
    const key = String(miniCharaNo);
    const standPose = options.standPose === 'stance' ? 'stance' : 'wait';
    const animations = options.animation || [standPose];

    if (!charaTopActive) return;

    const layer = ensureMiniCharaLayer();
    if (!layer) return;

    const token = ++miniLoadToken;
    ensureUnitMarker(layer, token);

    if (activeMiniCharaNo === key && miniCharaArmature && !miniCharaArmature.destroyed) {
        miniCharaArmature.alpha = 1;
        playMiniSequence(miniCharaArmature, animations, standPose);
        return;
    }

    try {
        const assets = await getMiniAssets(key);
        if (token !== miniLoadToken || !charaTopActive || !layer || layer.destroyed) return;

        destroyMiniCharacterOnly();

        const armature = new MiniCharArmature(assets.json, assets.textures, assets.particles, assets.frameMeta);
        armature.x = MINI_CHARA_X;
        armature.y = MINI_CHARA_Y;
        armature.scale.set(1.0);
        armature.alpha = options.fade === false ? 1 : 0;
        layer.addChild(armature);
        miniCharaArmature = armature;
        activeMiniCharaNo = key;

        playMiniSequence(armature, animations, standPose);

        const tick = (delta) => {
            if (!armature || armature.destroyed || !charaTopActive) {
                if (miniCharaTick) {
                    window.app.ticker.remove(miniCharaTick);
                    miniCharaTick = null;
                }
                return;
            }
            const dt = delta / 60;
            if (armature.alpha < 1) {
                armature.alpha = Math.min(1, armature.alpha + dt / 0.3);
            }
            if (armature.playing) {
                try { armature.update(dt); } catch {}
            }
        };
        miniCharaTick = tick;
        window.app.ticker.add(tick);
    } catch (err) {
        console.warn(`[quotes] Failed to load mini character ${key}:`, err);
    }
}

window.showCharaTopMini = showCharaTopMini;
window.hideCharaTopMini = hideCharaTopMini;

async function loadCharaListTopScreen() {
    homeDesiredActive = true;
    const requestToken = ++homeRequestToken;
    while (homeTeardownPromise || homeStopPromise) {
        await (homeTeardownPromise || homeStopPromise);
        if (requestToken !== homeRequestToken) return;
    }

    cancelMenuChoreography();
    scenarioPlayer?.stop();
    cancelOutfitChanges();
    clearTimeout(live2dHoldTimer);
    live2dHoldTimer = null;

    homeActive = false;
    bgSetActive = false;
    charaTopActive = true;
    homeSceneMounted = true;
    homeNeedsRespawn = true;
    document.getElementById('ui-layer')?.classList.remove('home-mode', 'menu-closed');

    const config = window.__QUOTES_CONFIG || (window.__QUOTES_CONFIG = {});
    if (previousQuotesXOffset === null) previousQuotesXOffset = config.xOffset;
    config.viewMode = 'home16';
    config.xOffset = HOME_X_OFFSET;
    if (typeof window.updateViewerViewport === 'function') {
        window.updateViewerViewport();
    }

    destroyCurrentModels();

    const savedBg = committedHomeBg || await resolveSavedHomeBackground();
    if (requestToken !== homeRequestToken || !charaTopActive) return;
    committedHomeBg = savedBg;

    const bgTask = initBackground(CH_TOP_COMMON_BG, { visible: true, autoplay: true, crossfadeMs: 300 }).catch((err) => {
        console.warn('[quotes] CharaListTop web_common BG failed, falling back:', err);
        return initBackground('bg/web/web_0015.ExportJson', { visible: true, autoplay: true, crossfadeMs: 300 });
    });

    const needBgmStart = !player || currentBgmFile !== savedBg.bgmFile;
    const bgmTask = needBgmStart
        ? playTrack(savedBg.bgmFile, { autoplay: true }).catch((err) => {
            console.warn('[quotes] CharaListTop BGM load failed, falling back to default:', err);
            return playTrack(HOME_BGM_FILE, { autoplay: true }).catch(() => {});
        })
        : Promise.resolve();

    await Promise.all([bgTask, bgmTask]);
}

async function loadBackgroundSetScreen() {
    homeDesiredActive = true;
    const requestToken = ++homeRequestToken;
    while (homeTeardownPromise || homeStopPromise) {
        await (homeTeardownPromise || homeStopPromise);
        if (requestToken !== homeRequestToken) return;
    }

    cancelMenuChoreography();
    scenarioPlayer?.stop();
    cancelOutfitChanges();

    homeActive = false;
    bgSetActive = true;
    charaTopActive = false;
    hideCharaTopMini();
    homeSceneMounted = true;
    homeNeedsRespawn = true;
    document.getElementById('ui-layer')?.classList.remove('home-mode', 'menu-closed');

    const requestedId = resolveRequestedCharaId();
    state.currentCharacterId = requestedId;
    const live2dId = String(state.currentLive2dId ?? '00').padStart(2, '0');

    const config = window.__QUOTES_CONFIG || (window.__QUOTES_CONFIG = {});
    if (previousQuotesXOffset === null) previousQuotesXOffset = config.xOffset;
    config.viewMode = 'home16';
    config.xOffset = HOME_X_OFFSET;
    if (typeof window.updateViewerViewport === 'function') {
        window.updateViewerViewport();
    }

    const savedBg = committedHomeBg || await resolveSavedHomeBackground();
    if (requestToken !== homeRequestToken || !bgSetActive) return;
    committedHomeBg = savedBg;

    setAssetPreloadConnecting(true);
    try {
        await Promise.all([
            initBackground(savedBg, { visible: true, autoplay: true, crossfadeMs: 300 }).catch((err) => {
                console.warn('[quotes] BackgroundSet BG load failed, falling back to default:', err);
                return initBackground(HOME_BACKGROUND_FILE, { visible: true, autoplay: true, crossfadeMs: 300 });
            }),
            playTrack(savedBg.bgmFile, { autoplay: true }).catch((err) => {
                console.warn('[quotes] BackgroundSet BGM load failed, falling back to default:', err);
                return playTrack(HOME_BGM_FILE, { autoplay: true }).catch(() => {});
            })
        ]);
        if (requestToken !== homeRequestToken || !bgSetActive) return;

        destroyCurrentModels();
        const loadedOk = await loadOutfitModels(requestedId, live2dId, undefined);
        if (!loadedOk || requestToken !== homeRequestToken || !bgSetActive) {
            if (!bgSetActive && !homeActive) destroyCurrentModels();
            return;
        }

        const targets = Array.from(new Set(
            Array.from(state.currentModels.values()).map((e) => e && e.model).filter(Boolean)
        ));
        if (targets.length === 0 && state.currentModel) targets.push(state.currentModel);
        targets.forEach((m) => {
            m.visible = true;
            setModelFadeAlpha(m, 0);
            fadeModelTo(m, 250, 1);
        });
    } finally {
        setAssetPreloadConnecting(false);
        document.body.classList.remove('connecting');
    }
}

async function teardownHomeScreen({ keepBackground = false, keepBgm = false } = {}) {
    if (homeTeardownPromise) return homeTeardownPromise;
    if (!homeActive && !bgSetActive && !charaTopActive && !homeSceneMounted && !homeLoadPromise) return;

    homeTeardownPromise = (async () => {
        cancelMenuChoreography();
        homeActive = false;
        bgSetActive = false;
        charaTopActive = false;
        hideCharaTopMini();
        bgPreviewToken++;
        homeReady = false;
        homeRevealed = false;
        homeNeedsRespawn = false;
        homeLoadedCharaId = null;
        homePendingCharaId = null;
        homeGeneration++;
        const pendingLoad = homeLoadPromise;
        if (pendingLoad) await pendingLoad;

        clearTimeout(live2dHoldTimer);
        live2dHoldTimer = null;
        scenarioPlayer?.stop();
        // Close any open wearWrap popup and restore the hidden global chrome
        // (leave with the popup open would otherwise keep #globalMenu/#sideMenu
        // display:none when returning to the home).
        const wearWrap = document.getElementById('wearWrap');
        if (wearWrap) wearWrap.classList.add('off');
        const myPage = document.getElementById('MyPage');
        if (myPage) myPage.classList.remove('wearing');
        setWearWrapChrome(false);

        destroyCurrentModels();
        if (!keepBackground) {
            await clearBackground();
            clearBgAssetCache();
        }
        if (!keepBgm) {
            bgmLoadToken++;
            currentBgmFile = null;
            if (player) {
                const oldPlayer = player;
                player = null;
                await safeStopHcaPlayer(oldPlayer);
            }
        }

        setHomePositioning(false);
        homeSceneMounted = false;
        document.getElementById('ui-layer')?.classList.remove('home-mode');
        document.body.classList.remove('connecting');
    })().finally(() => {
        homeTeardownPromise = null;
    });

    return homeTeardownPromise;
}

async function stopHomeScreen() {
    homeDesiredActive = false;
    homeRequestToken++;
    if (homeStopPromise) return homeStopPromise;
    const wasActive = homeActive || bgSetActive || charaTopActive || homeSceneMounted || homeLoadPromise || Boolean(homeTeardownPromise);
    homeStopPromise = (async () => {
        await teardownHomeScreen({ keepBackground: true });
        if (!wasActive || homeActive || homeDesiredActive) return;
        await Promise.all([
            initBackground('bg/web/web_0015.ExportJson', { visible: true, autoplay: true, crossfadeMs: 300 }),
            playTrack('bgm02_anime11_hca.hca')
        ]);
        clearBgAssetCache();
    })().finally(() => {
        homeStopPromise = null;
    });
    return homeStopPromise;
}
window.stopHomeScreen = stopHomeScreen;

function setupBackBtn() {
    const handleBack = (e) => {
        if (e) e.preventDefault();
        const hash = window.location.hash;
        if (hash.startsWith('#/CharaCollectionDetail')) {
            window.location.hash = '#/CharaCollection';
        } else if (hash.startsWith('#/BackgroundSet')) {
            const q = hash.split('?')[1];
            window.location.hash = q ? `#/MyPage?${q}` : '#/MyPage';
        } else if (hash.startsWith('#/CharaListTop')) {
            window.location.hash = '#/MyPage';
        } else {
            window.location.href = 'index.html';
        }
    };

    const globalBackBtn = document.getElementById('globalBackBtn');
    const backBtn = document.getElementById('backBtn');
    if (globalBackBtn) globalBackBtn.onclick = handleBack;
    if (backBtn) backBtn.onclick = handleBack;
}

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

function isInsideHomeViewport(event) {
    const camera = window.cameraContainer;
    const viewport = window.VIEWPORT;
    if (!camera || !viewport) return false;

    const activeW = viewport.viewW * camera.scale.x;
    const activeH = viewport.viewH * camera.scale.x;
    return event.clientX >= camera.x && event.clientX <= camera.x + activeW &&
        event.clientY >= camera.y && event.clientY <= camera.y + activeH;
}

function isHomeAudioUnlocked() {
    return player?.audioCtx?.state === 'running';
}

async function waitForHomeAudioUnlock(timeoutMs = 1200) {
    if (isHomeAudioUnlocked()) return true;
    if (!player?.audioCtx || player.audioCtx.state === 'closed') return false;

    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        await new Promise(resolve => setTimeout(resolve, 50));
        if (isHomeAudioUnlocked()) return true;
    }
    return isHomeAudioUnlocked();
}

function setupHomeInteractions() {
    window.addEventListener('pointerdown', (event) => {
        if (!homeActive || !isInsideHomeViewport(event)) return;

        if (!homeRevealed) {
            if (homeReady) revealHomeScreen();
            return;
        }

        // Ignore presses on real UI surfaces (menu buttons, banner, popup,
        // wear panel). The homescreen's MyPage layer covers the whole viewport
        // with pointer-events:auto, so the renderer canvas is never the DOM
        // target — a press on the model surfaces as a press on #MyPage itself.
        const uiRootSelector = [
            '#etcMenu', '#live2dMenu', '#favoriteChara', '#mypageBanner',
            '#wearWrap', '#mypageWearScrollOuter', '#globalMenu', '#sideMenu',
            '#popupArea', '#status', '#globalBackBtn', '#cardDetail', '#CharaCollection'
        ].join(', ');
        if (event.target?.closest?.(uiRootSelector)) return;

        // Hit-test the Live2D model in stage space (same technique as the
        // model-follow canvas handler) so a tap lands on the character.
        const interaction = window.app?.renderer?.plugins?.interaction;
        const m = state.currentModel;
        if (!interaction || !m || typeof interaction.mapPositionToPoint !== 'function') return;
        const pt = new PIXI.Point();
        interaction.mapPositionToPoint(pt, event.clientX, event.clientY);
        let hit = false;
        try { hit = !!m.containsPoint(pt); } catch (e) { hit = false; }
        if (!hit) return;

        playHomeVoice(pickHomeTapVoice()).catch(e => {
            console.warn('[quotes] Home tap voice failed:', e);
        });
    }, true);

    window.addEventListener('keydown', () => {
        if (homeActive && homeReady && !homeRevealed) revealHomeScreen();
    });
}

// ---- Init sequence ----
async function init() {
    document.body.classList.add('connecting');

    // Initialize UI scaling immediately and react to viewport/resize updates
    // instead of mutating DOM styles every animation frame on app.ticker.
    updateUILayer();
    window.addEventListener('resize', updateUILayer);
    window.addEventListener('mrv2:viewportChange', updateUILayer);

    // Make UI layer visible now that it is correctly positioned and scaled
    const uiLayer = document.getElementById('ui-layer');
    if (uiLayer) {
        uiLayer.style.display = 'block';
    }

    // Instantiate scenario player early
    scenarioPlayer = new ScenarioSequencePlayer({
        controller: null,
        subtitleElement: document.getElementById('subtitle')
    });
    window.scenarioPlayer = scenarioPlayer;

    await loadCharaAttributes();

    const bareSearchId = new URLSearchParams(window.location.search).get('id');
    const bareEntry = !window.location.hash || window.location.hash === '#' || window.location.hash === '#/';
    if (bareEntry && /^\d{4}$/.test(bareSearchId || '')) {
        history.replaceState(null, '', `${window.location.pathname}${window.location.search}#/MyPage?id=${bareSearchId}`);
    }

    const initialHomeRoute = window.location.hash.startsWith('#/MyPage')
        || window.location.hash.startsWith('#/BackgroundSet')
        || window.location.hash.startsWith('#/CharaListTop');
    if (!initialHomeRoute) {
        await Promise.all([
            initBackground().catch((e) => console.warn('[quotes] background error:', e)),
            playTrack('bgm02_anime11_hca.hca').catch((e) => console.warn('[quotes] bgm error:', e))
        ]);
    }

    // Resume audio on first user interaction if Chrome suspended the context.
    setupAudioAutoResume();
    setupBackBtn();

    window.addEventListener('hashchange', () => {
        handleRoute(loadCharacterDetail, state, loadHomeScreen, loadBackgroundSetScreen, loadCharaListTopScreen)
            .catch(e => console.error('[quotes] Route change failed:', e));
    });
    await handleRoute(loadCharacterDetail, state, loadHomeScreen, loadBackgroundSetScreen, loadCharaListTopScreen);

    // Tap effect interaction
    window.addEventListener('pointerdown', showTapEffect, true);
    setupHomeInteractions();
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
