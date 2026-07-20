// quotes-main.js — quotes.html module entry point
// Wires up: cocos-to-pixi background, HCA BGM loop, and the default Live2D model.
// Differences from viewer.html: no controls, no follow-on-click.
import { loadCocosStudioAssets, CocosStudioArmature } from './lib/cocos-to-pixi.js';
import { loadModel, state, getOutfitsForCharacter, buildModelId } from './model.js';
import { preloadModelToRam, ramFolderCache } from './model-assets.js';
import { DEFAULT_SCENARIO_URL, ScenarioSequencePlayer, preloadScenarioVoices, scenarioCache } from './quotes-sequence.js';

let activeVoicePrefix = '00';
let activeScenarioUrl = '';
let outfitChangeToken = 0;

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

async function checkUrlExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (e) {
        try {
            const resp = await fetch(url);
            return resp.ok;
        } catch {
            return false;
        }
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
        const assets = await loadCocosStudioAssets('assets/magica/resource/image_native/effect/story/ef_adv_05.ExportJson');
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

async function loadScenarioForOutfit(charaId, live2dId) {
    const scenarioBase = await resolveScenarioBase();
    const live2dIdStr = String(live2dId).padStart(2, '0');
    
    let scenarioUrl = `${scenarioBase}/${charaId}${live2dIdStr}.json`;
    let exists = false;
    
    if (live2dIdStr !== '00') {
        exists = await checkUrlExists(scenarioUrl);
    }
    
    if (exists) {
        activeVoicePrefix = live2dIdStr;
        activeScenarioUrl = scenarioUrl;
    } else {
        activeVoicePrefix = '00';
        activeScenarioUrl = `${scenarioBase}/${charaId}00.json`;
    }
    
    let scenarioJson = scenarioCache.get(activeScenarioUrl);
    if (!scenarioJson) {
        try {
            const resp = await fetch(activeScenarioUrl);
            if (resp.ok) {
                scenarioJson = await resp.json();
                scenarioCache.set(activeScenarioUrl, scenarioJson);
                console.info(`[quotes] Scenario loaded and cached: ${activeScenarioUrl}`);
            }
        } catch (e) {
            console.error(`[quotes] Failed to fetch scenario: ${activeScenarioUrl}`, e);
        }
    }
    
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

            // 1. Stop any currently playing voice/sequence
            if (scenarioPlayer) {
                scenarioPlayer.stop();
            }

            const modelId = buildModelId(charaId, newLive2dId);

            // Guard token to prevent race conditions during rapid clicking
            const token = ++outfitChangeToken;

            // 2. Preload the model into RAM first (shows "Connecting" loader/overlay if not already cached)
            try {
                await preloadModelToRam(modelId);
            } catch (err) {
                console.error('[quotes] Preload model failed:', err);
            }

            if (token !== outfitChangeToken) return;

            // 3. Play transformation sound and visual effect after connecting ends
            const modelX = state.currentModel ? state.currentModel.x : 252;
            playSfx('assets/magica/resource/sound_native/jingle/7205_magic_girl_hca.hca');
            playTransformationEffect(modelX);

            // Wait 0.5s (500ms) so the model change matches the transformation effect timing
            await new Promise(resolve => setTimeout(resolve, 500));
            if (token !== outfitChangeToken) return;

            // 4. Load the new model (instant since it's already preloaded in RAM)
            try {
                await loadModel(modelId, { interactive: false });
                if (token !== outfitChangeToken) return;

                // Update controller reference on scenario player
                if (scenarioPlayer) {
                    scenarioPlayer.controller = state.currentController;
                }

                // Retrieve modelJson for the loaded model to set default expression and motion
                const fileList = ramFolderCache.get(modelId);
                if (fileList) {
                    const jsonFile = fileList.find(f => f.webkitRelativePath === 'model.model3.json');
                    if (jsonFile) {
                        const modelJson = JSON.parse(await jsonFile.text());
                        const expressions = modelJson?.FileReferences?.Expressions ?? [];

                        let bestExpression = null;
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

                        if (bestExpression && state.currentController) {
                            state.currentController.setExpressionByName(bestExpression);
                        }
                    }
                }

                if (state.currentController) {
                    const motionIndex = state.currentController.motionIndexByNumber?.get(0);
                    if (typeof motionIndex === 'number') {
                        state.currentController.startMotion(state.currentController.defaultMotionGroup, motionIndex);
                    }
                }
            } catch (e) {
                console.error('[quotes] Model swap failed:', e);
            }

            if (token !== outfitChangeToken) return;
            // 5. Load/apply scenario voice mappings
            await loadScenarioForOutfit(charaId, newLive2dId);
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
    const tabs = document.querySelectorAll('#detailTab li');
    tabs.forEach(tab => {
        const type = tab.getAttribute('data-type');
        if (type === 'voice' || type === 'illust') {
            tab.addEventListener('click', (e) => {
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
            });
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
            if (nameEl) nameEl.textContent = chara.name;
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
    activeVoicePrefix = '00';
    activeScenarioUrl = `${scenarioBase}/${charaId}00.json`;
    let scenarioJson = null;
    try {
        const resp = await fetch(activeScenarioUrl);
        if (resp.ok) {
            scenarioJson = await resp.json();
            scenarioCache.set(activeScenarioUrl, scenarioJson);
            console.info(`[quotes] Scenario JSON loaded and cached: ${activeScenarioUrl}`);
        } else {
            console.warn(`[quotes] Failed to load scenario JSON from ${activeScenarioUrl}`);
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
        state.currentLive2dId = '00';
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

        await initMetadata(charaId);
        setupOutfitButtons(charaId);
        setupVoiceButtons();
        setupBackBtn();
        setupVoiceSettings();
        await loadScenarioForOutfit(charaId, '00');
        setupTabs();
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
