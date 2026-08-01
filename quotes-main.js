// quotes-main.js — quotes.html module entry point
// Wires up: cocos-to-pixi background, HCA BGM loop, and the default Live2D model.
// Differences from viewer.html: no controls, no follow-on-click.
import { loadCocosStudioAssets, CocosStudioArmature } from './lib/cocos-to-pixi.js';
import { loadModel, loadAdditionalModel, destroyCurrentModels, state, getOutfitsForCharacter, buildModelId } from './model.js';
import { preloadModelToRam, ramFolderCache, setAssetPreloadConnecting } from './model-assets.js';
import { ScenarioSequencePlayer, preloadScenarioVoices, scenarioCache } from './quotes-sequence.js';
import { fetchScenarioJson, checkScenarioUrlExists, getDualUnitConfig } from './model-scenario.js';
import { renderCharaCollectionGrid } from './chara-collection.js';

let activeVoicePrefix = '00';
let activeScenarioUrl = '';
let outfitChangeToken = 0;
let homeLoadPromise = null;
let homeGeneration = 0;
let homeActive = false;
let homeSceneMounted = false;
let homeReady = false;
let homeRevealed = false;
let homeTapVoicePool = [];
let previousQuotesXOffset = null;

// ---- World constants (must match viewer.js) ----
const WORLD_W = 1024;
const WORLD_H = 768;
const HOME16_H = 576;
const HOME_CHARA_ID = 1001;
const HOME_MODEL_ID = '100100';
const HOME_SCENARIO_PATH = '100100.json';
const HOME_BGM_FILE = 'bgm01_anime07_hca.hca';
const HOME_BACKGROUND_FILE = 'bg/web/web_0011.ExportJson';
const HOME_X_OFFSET = -132;
const HOME_LOGIN_SESSION_KEY = 'mrHomeLoginSeen';
const HOME_LOGIN_DELAY_MS = 100; // Half of model.js transitionIn's 200ms fade-in.
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
let bgArmature = null;
let bgTicker = null;

async function clearBackground() {
    if (bgTicker && window.app?.ticker) {
        window.app.ticker.remove(bgTicker);
    }
    bgTicker = null;

    if (bgArmature) {
        try {
            if (bgArmature.parent) bgArmature.parent.removeChild(bgArmature);
            bgArmature.destroy({ children: true });
        } catch (e) {}
        bgArmature = null;
    }
}

async function initBackground(exportJsonPath = 'bg/web/web_0015.ExportJson', { visible = true, autoplay = true } = {}) {
    await clearBackground();
    const assets = await loadCocosStudioAssets(exportJsonPath);
    bgArmature = new CocosStudioArmature(assets.json, assets.textures, assets.particles);

    // Position so the 1024x768 bg content is vertically centered in the 1024x576 home16 view.
    // cameraMask clips to (0,0,1024,576); shifting the armature up by (768-576)/2 = 96px
    // means 96px is clipped from both top and bottom, centering the bg in the view.
    bgArmature.x = WORLD_W / 2;
    bgArmature.y = WORLD_H / 2 - (WORLD_H - HOME16_H) / 2;

    // Add behind the model (worldContainer is index 1; insert at 0).
    window.cameraContainer.addChildAt(bgArmature, 0);
    bgArmature.visible = visible;

    if (autoplay) bgArmature.play('action', true);

    bgTicker = (delta) => {
        if (bgArmature) bgArmature.update(delta / 60);
    };
    window.app.ticker.add(bgTicker);
}

function startBackgroundAndMusic() {
    if (bgArmature) {
        bgArmature.visible = true;
        bgArmature.play('action', true);
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

let hcaModule = null;
let hcaBlobUrl = null;
let worker = null;
let player = null;
let scenarioPlayer = null;
let _bgmBase = null;
let _bgmBaseSource = null;

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

async function playTrack(fileName, { autoplay = true } = {}) {
    const activeWorker = await initWorker();
    await resolveBgmBase(fileName);

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
    if (autoplay) player.play();

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

function updateUILayer() {
    const uiLayer = document.getElementById('ui-layer');
    if (!uiLayer) return;
    const camera = window.cameraContainer;
    if (!camera) return;
    uiLayer.style.left = `${camera.x}px`;
    uiLayer.style.top = `${camera.y}px`;
    uiLayer.style.transform = `scale(${camera.scale.x})`;
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

async function playSfx(filePath) {
    try {
        const activeWorker = await initWorker();
        const fileResponse = await fetch(filePath);
        if (!fileResponse.ok) {
            throw new Error(`Failed to load SFX ${filePath}: ${fileResponse.status}`);
        }
        const hcaData = new Uint8Array(await fileResponse.arrayBuffer());
        const decrypted = await activeWorker.decrypt(hcaData, KEY1, KEY2);

        if (sfxPlayer) {
            try { await sfxPlayer.stop(); } catch(e) {}
        }

        sfxPlayer = await hcaModule.HCAWebAudioLoopPlayer.create(decrypted, activeWorker);
        sfxPlayer.bufSrc.loop = false;
        sfxPlayer.playInBackground = true;
        sfxPlayer.play();
    } catch (e) {
        console.error('[quotes] SFX play failed:', e);
    }
}

let activeEffectArmature = null;
let activeEffectTick = null;

async function playTransformationEffect(x) {
    try {
        const assets = await loadCocosStudioAssets('magica/resource/image_native/effect/story/ef_adv_05.ExportJson');
        const effectArmature = new CocosStudioArmature(assets.json, assets.textures, assets.particles);

        if (activeEffectArmature) {
            if (activeEffectTick) {
                window.app.ticker.remove(activeEffectTick);
                activeEffectTick = null;
            }
            try {
                window.cameraContainer.removeChild(activeEffectArmature);
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
                if (activeEffectArmature === effectArmature) {
                    try {
                        window.cameraContainer.removeChild(effectArmature);
                        effectArmature.destroy({ children: true });
                    } catch(e) {}
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
    if (sfxPlayer) {
        try { await sfxPlayer.stop(); } catch (e) {}
        sfxPlayer = null;
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

            // 3. Play transformation sound and visual effect after connecting ends
            const modelX = 250; // Static single-model X position for Quotes page transformation VFX
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

                        const mtnExMatches = [];
                        for (const expr of expressions) {
                            const fullName = String(expr.Name ?? expr.name ?? '');
                            const name = fullName.replace(/\.exp3\.json$/, '').replace(/\.json$/, '');
                            const match = name.match(/^mtn_ex_01(\d+)$/);
                            if (match) {
                                const number = Number(match[1]);
                                mtnExMatches.push({ originalName: fullName, name, number });
                            }
                        }
                        if (mtnExMatches.length > 0) {
                            mtnExMatches.sort((a, b) => a.number - b.number);
                            bestExpression = mtnExMatches[0].originalName;
                        } else if (expressions.length > 0) {
                            bestExpression = expressions[0].Name ?? expressions[0].name;
                        }
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

async function initMetadata(charaId) {
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
        btn.addEventListener('click', async (e) => {
            e.preventDefault();

            document.querySelectorAll('.voiceBtn.current').forEach(b => b.classList.remove('current'));
            btn.classList.add('current');

            const voiceId = btn.getAttribute('data-voice');
            const charaId = state.currentCharacterId || 1001;

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

async function loadOutfitModels(charaId, live2dId, token, allowedExpressions = new Set(), allowedMotions = new Set()) {
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

        // Load Primary Model (pos 0)
        await loadModel(primaryId, {
            interactive: false,
            allowedExpressions,
            allowedMotions,
            xOverride: 104.0,
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
            xOverride: 320.0,
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
    return `vo_char_${HOME_CHARA_ID}_00_${String(voiceId).padStart(2, '0')}`;
}

async function playHomeVoice(voiceId) {
    if (!homeActive || !scenarioPlayer || !activeScenarioUrl) return;
    scenarioPlayer.controller = state.currentController;
    return scenarioPlayer.loadAndPlayVoice(activeScenarioUrl, homeVoiceKey(voiceId), HOME_CHARA_ID);
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
    if (state.currentModel) state.currentModel.visible = true;
    document.body.classList.remove('connecting');

    try {
        await new Promise(resolve => setTimeout(resolve, HOME_LOGIN_DELAY_MS));
        await playHomeVoice(chooseHomeLoginVoice());
    } catch (e) {
        console.warn('[quotes] Home login voice failed:', e);
    }
}

async function loadHomeScreen() {
    homeActive = true;
    homeSceneMounted = true;
    document.getElementById('ui-layer')?.classList.add('home-mode');
    if (homeReady) return;
    if (homeLoadPromise) return homeLoadPromise;

    const generation = ++homeGeneration;
    setHomePositioning(true);
    document.body.classList.add('connecting');

    homeLoadPromise = (async () => {
        // Phase 1: prepare the scene background and BGM independently, then
        // start both together. The Connecting state remains active over them.
        await Promise.all([
            initBackground(HOME_BACKGROUND_FILE, { visible: true, autoplay: false }),
            playTrack(HOME_BGM_FILE, { autoplay: false })
        ]);
        if (!homeActive || generation !== homeGeneration) return;
        startBackgroundAndMusic();
        console.info('[quotes] Homescreen background and BGM started; loading character assets.');
        // Phase 1 is complete: let the running background/music show briefly
        // without a loading indicator. Phase 2 owns the indicator from the
        // moment its first asset request starts until all assets are ready.
        document.body.classList.remove('connecting');

        // Phase 2: keep Connecting visible while preparing the scenario,
        // model files, and every voice referenced by the homescreen scenario.
        document.body.classList.add('connecting');
        setAssetPreloadConnecting(true);
        try {
            const scenarioResult = await fetchScenarioJson(HOME_SCENARIO_PATH);
            if (!scenarioResult.json) throw new Error(`Failed to load home scenario ${HOME_SCENARIO_PATH}`);
            if (!homeActive || generation !== homeGeneration) return;

            activeVoicePrefix = '00';
            activeScenarioUrl = scenarioResult.url;
            scenarioCache.set(activeScenarioUrl, scenarioResult.json);
            state.currentCharacterId = HOME_CHARA_ID;
            state.currentLive2dId = '00';

            const { allowedExpressions, allowedMotions, allowedVoices } =
                collectHomeScenarioResources(scenarioResult.json);

            await Promise.all([
                preloadModelToRam(HOME_MODEL_ID, { allowedExpressions, allowedMotions }),
                preloadScenarioVoices(Array.from(allowedVoices), scenarioPlayer.voice),
                preloadOpenSansFont()
            ]);
            if (!homeActive || generation !== homeGeneration) return;

            destroyCurrentModels();
            await loadModel(HOME_MODEL_ID, {
                interactive: false,
                allowedExpressions,
                allowedMotions
            });
            if (!homeActive || generation !== homeGeneration) {
                destroyCurrentModels();
                return;
            }

            state.currentModels.set(HOME_MODEL_ID, {
                model: state.currentModel,
                controller: state.currentController,
                pos: 0
            });
            scenarioPlayer.setControllers(
                new Map([
                    [HOME_MODEL_ID, state.currentController],
                    [Number(HOME_MODEL_ID), state.currentController]
                ]),
                state.currentController
            );

            if (state.currentModel) state.currentModel.visible = false;
            homeReady = true;
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
    }).finally(() => {
        homeLoadPromise = null;
    });

    return homeLoadPromise;
}

async function stopHomeScreen() {
    if (!homeActive && !homeSceneMounted && !homeLoadPromise) return;

    homeActive = false;
    homeReady = false;
    homeRevealed = false;
    homeGeneration++;
    const pendingLoad = homeLoadPromise;
    if (pendingLoad) await pendingLoad;

    scenarioPlayer?.stop();
    destroyCurrentModels();
    await clearBackground();
    if (player) {
        try { await player.stop(); } catch (e) {}
        player = null;
    }

    setHomePositioning(false);
    homeSceneMounted = false;
    document.getElementById('ui-layer')?.classList.remove('home-mode');
    document.body.classList.remove('connecting');

    await Promise.all([
        initBackground('bg/web/web_0015.ExportJson'),
        playTrack('bgm02_anime11_hca.hca')
    ]);
}
window.stopHomeScreen = stopHomeScreen;

function setupBackBtn() {
    const handleBack = (e) => {
        if (e) e.preventDefault();
        const hash = window.location.hash;
        if (hash.startsWith('#/CharaCollectionDetail')) {
            window.location.hash = '#/CharaCollection';
        } else {
            window.location.href = 'index.html';
        }
    };

    const globalBackBtn = document.getElementById('globalBackBtn');
    const backBtn = document.getElementById('backBtn');
    if (globalBackBtn) globalBackBtn.onclick = handleBack;
    if (backBtn) backBtn.onclick = handleBack;
}

import { handleRoute } from './magica/js/router.js';

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

        if (event.target?.closest?.('#ui-layer')) return;
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

    // Initialize UI scaling immediately so it is positioned correctly from the start.
    updateUILayer();
    window.addEventListener('resize', updateUILayer);
    window.app.ticker.add(updateUILayer);

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

    const initialHomeRoute = window.location.hash.startsWith('#/MyPage');
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
        handleRoute(loadCharacterDetail, state, loadHomeScreen)
            .catch(e => console.error('[quotes] Route change failed:', e));
    });
    await handleRoute(loadCharacterDetail, state, loadHomeScreen);

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
