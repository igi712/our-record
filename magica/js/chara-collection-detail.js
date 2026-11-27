// magica/js/chara-collection-detail.js — Character Quotes & Outfits Detail controller (#/CharaCollectionDetail).

import { state, getOutfitsForCharacter, buildModelId } from './viewer/model.js';
import { preloadModelToRam } from './viewer/model-assets.js';
import { preloadScenarioVoices, scenarioCache } from './viewer/quotes-sequence.js';
import { fetchScenarioJson } from './viewer/model-scenario.js';
import { changeBg, preloadBg, setBgPortrait, setBgWebcamVideo } from './engine/bg.js';
import { startBgm } from './engine/audio.js';
import {
    DEFAULT_CHARA_ID,
    setStageContext,
    setStageXOffset,
    applySubtitlePlacement,
    loadCharaAttributes,
    ensureMetadataLoaded,
    loadOutfitModels,
    loadScenarioForOutfit,
    performOutfitSwap,
    cancelOutfitChanges,
    bumpOutfitChangeToken,
    getOutfitChangeToken,
    getScenarioPlayer,
    stopVoice,
    clearStageModels
} from './engine/l2d-stage.js';

const DETAIL_BG = 'bg/web/web_0015.ExportJson';
const DETAIL_BGM = 'bgm02_anime11_hca.hca';
const DETAIL_X_OFFSET = -262;

let currentLoadedCharaId = null;
let detailVoicePrefix = '00';
let detailScenarioUrl = '';
let detailActive = false;
let detailRequestToken = 0;

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

function getAvailableVoiceKeys(scenarioJson) {
    const keys = new Set();
    if (scenarioJson?.story) {
        Object.values(scenarioJson.story).forEach((steps) => {
            if (!Array.isArray(steps)) return;
            steps.forEach((step) => {
                if (!Array.isArray(step.chara)) return;
                step.chara.forEach((c) => {
                    if (c.voice) keys.add(c.voice);
                });
            });
        });
    }
    return keys;
}

function updateVoiceButtonsVisibility(charaId, prefix, availableKeys) {
    const categories = document.querySelectorAll('#charaVoice .commonFrame3');
    categories.forEach((category) => {
        if (category.parentNode?.id === 'outfitsTabContent') return;

        const voiceBtns = category.querySelectorAll('.voiceBtn');
        let visibleCount = 0;

        voiceBtns.forEach((btn) => {
            const voiceId = btn.getAttribute('data-voice');
            const voiceKey = `vo_char_${charaId}_${prefix}_${voiceId}`;
            if (availableKeys.has(voiceKey)) {
                btn.style.display = '';
                visibleCount++;
            } else {
                btn.style.display = 'none';
            }
        });

        category.style.display = visibleCount > 0 ? '' : 'none';
    });
}

function applyScenarioResult(charaId, result) {
    if (!result) return;
    detailVoicePrefix = result.voicePrefix || '00';
    detailScenarioUrl = result.scenarioUrl || '';
    if (result.scenarioJson) {
        const availableKeys = getAvailableVoiceKeys(result.scenarioJson);
        updateVoiceButtonsVisibility(charaId, detailVoicePrefix, availableKeys);
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

    outfits.forEach((outfit) => {
        const btn = document.createElement('div');
        btn.className = 'commonFrame4 outfitBtn se_decide';
        const live2dIdStr = String(outfit.live2dId).padStart(2, '0');
        btn.setAttribute('data-live2did', outfit.live2dId);
        btn.textContent = outfit.description || live2dIdStr;

        if (String(outfit.live2dId) === String(state.currentLive2dId)) {
            btn.classList.add('current');
        }

        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (btn.classList.contains('current')) return;

            document.querySelectorAll('.outfitBtn.current').forEach((b) => b.classList.remove('current'));
            btn.classList.add('current');

            const newLive2dId = outfit.live2dId;
            state.currentLive2dId = newLive2dId;
            document.querySelectorAll('.voiceBtn.current').forEach((b) => b.classList.remove('current'));

            const token = bumpOutfitChangeToken();
            try {
                await performOutfitSwap(charaId, newLive2dId, {
                    token,
                    vfxDefaultX: 250,
                    skipVfxIfDual: true,
                    applyDefaultMotionAndFace: true,
                    showConnecting: false,
                    onScenarioLoaded: (res) => applyScenarioResult(charaId, res)
                });
            } catch (err) {
                console.error('[detail] Outfit swap failed:', err);
            }
        });

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
    tabs.forEach((tab) => {
        const type = tab.getAttribute('data-type');
        if (type === 'voice' || type === 'illust') {
            tab.style.cursor = 'pointer';
            tab.onclick = (e) => {
                e.preventDefault();
                tabs.forEach((t) => t.classList.remove('current'));
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

function setupVoiceButtons() {
    const voiceBtns = document.querySelectorAll('.voiceBtn');
    const seqPlayer = getScenarioPlayer();
    voiceBtns.forEach((btn) => {
        if (btn.getAttribute('data-has-listener')) return;
        btn.setAttribute('data-has-listener', 'true');
        btn.addEventListener('click', async (e) => {
            e.preventDefault();

            document.querySelectorAll('.voiceBtn.current').forEach((b) => b.classList.remove('current'));
            btn.classList.add('current');

            const voiceId = btn.getAttribute('data-voice');
            const charaId = state.currentCharacterId || DEFAULT_CHARA_ID;
            const voiceKey = `vo_char_${charaId}_${detailVoicePrefix}_${voiceId}`;

            try {
                seqPlayer.controller = state.currentController;
                await seqPlayer.loadAndPlayVoice(detailScenarioUrl, voiceKey, charaId);
            } catch (err) {
                console.error('[detail] Error playing voice button:', err);
            }
        });
    });
}

function resetDetailViewState() {
    const detailTab = document.getElementById('detailTab');
    if (detailTab) {
        detailTab.querySelectorAll('li').forEach((tab) => {
            tab.classList.toggle('current', tab.getAttribute('data-type') === 'voice');
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
    scrollContainers.forEach((el) => {
        if (el) el.scrollTop = 0;
    });

    const cardDetail = document.getElementById('cardDetail');
    if (cardDetail) {
        cardDetail.querySelectorAll('*').forEach((child) => {
            if (child.scrollTop > 0) child.scrollTop = 0;
        });
    }
}

async function initDetailMetadata(charaId) {
    try {
        await ensureMetadataLoaded();
        const chara = state.charaListData.find((c) => Number(c.id) === Number(charaId));
        if (chara) {
            updateHeaderName(document.getElementById('charaNameText'), chara.name, chara.title);
            const kanaEl = document.getElementById('charaKanaText');
            if (kanaEl) kanaEl.textContent = chara.kana || chara.name;
        }
    } catch (e) {
        console.warn('[detail] Failed to load metadata:', e);
    }
}

export async function enterCharaCollectionDetail({ charaId = DEFAULT_CHARA_ID, onBeforeReveal, hadLive2d = false, fromCollection = false } = {}) {
    detailActive = true;
    const reqToken = ++detailRequestToken;

    const step1Start = performance.now();
    await Promise.all([
        preloadBg(DETAIL_BG).catch((e) => console.warn('[detail] background preload error:', e)),
        startBgm(DETAIL_BGM, { autoplay: true }).catch((e) => console.warn('[detail] bgm error:', e))
    ]);
    if (reqToken !== detailRequestToken || !detailActive) return;

    if (hadLive2d) {
        const elapsed = performance.now() - step1Start;
        if (elapsed < 200) {
            await new Promise((r) => setTimeout(r, 200 - elapsed));
        }
        if (reqToken !== detailRequestToken || !detailActive) return;
    }

    document.getElementById('ui-layer')?.classList.remove('home-mode', 'menu-closed');
    setBgWebcamVideo(null);
    setBgPortrait(false);

    clearStageModels();
    await changeBg(DETAIL_BG, { visible: true, autoplay: true, crossfadeMs: 250, waitForCrossfade: true }).catch((e) =>
        console.warn('[detail] background error:', e)
    );
    if (reqToken !== detailRequestToken || !detailActive) return;

    const token = bumpOutfitChangeToken();

    setStageContext({ mode: 'detail' });
    setStageXOffset(DETAIL_X_OFFSET);
    if (typeof window.updateViewerViewport === 'function') {
        window.updateViewerViewport();
    }
    applySubtitlePlacement();

    resetDetailViewState();
    currentLoadedCharaId = charaId;
    state.currentCharacterId = charaId;

    const cardEl = document.querySelector(`.chara[data-chara-id="${charaId}"]`);
    if (cardEl) {
        const cardName = cardEl.getAttribute('data-name');
        const cardAtt = cardEl.getAttribute('data-att');
        const cardTitle = cardEl.getAttribute('data-title') || cardEl.querySelector('.title')?.textContent;
        updateHeaderName(document.getElementById('charaNameText'), cardName, cardTitle);
        const attEl = document.getElementById('att');
        if (attEl && cardAtt) attEl.className = cardAtt.toLowerCase();
    }

    document.body.classList.remove('connecting');
    if (typeof onBeforeReveal === 'function') {
        onBeforeReveal();
    }

    const defaultModelId = buildModelId(charaId, '00');
    detailVoicePrefix = '00';
    let scenarioJson = null;
    const scenarioResult = await fetchScenarioJson(`${charaId}00.json`);
    if (reqToken !== detailRequestToken || token !== getOutfitChangeToken() || !detailActive) return;

    if (scenarioResult.json) {
        scenarioJson = scenarioResult.json;
        detailScenarioUrl = scenarioResult.url;
        scenarioCache.set(detailScenarioUrl, scenarioJson);
    }

    const attrs = await loadCharaAttributes();
    if (reqToken !== detailRequestToken || token !== getOutfitChangeToken() || !detailActive) return;

    const attEl = document.getElementById('att');
    if (attEl) attEl.className = attrs[charaId] || 'light';

    const metadataPromise = initDetailMetadata(charaId);

    const allowedModels = new Set([defaultModelId]);
    const allowedExpressions = new Set();
    const allowedMotions = new Set();
    const allowedVoices = new Set();

    if (scenarioJson?.story) {
        Object.values(scenarioJson.story).forEach((steps) => {
            if (!Array.isArray(steps)) return;
            steps.forEach((step) => {
                if (!Array.isArray(step.chara)) return;
                step.chara.forEach((c) => {
                    if (c.id) allowedModels.add(String(c.id));
                    if (c.face) {
                        allowedExpressions.add(
                            c.face.replace(/\.exp3\.json$/, '').replace(/\.exp\.json$/, '').replace(/\.json$/, '')
                        );
                    }
                    if (typeof c.motion === 'number') allowedMotions.add(c.motion);
                    if (c.voice) allowedVoices.add(c.voice);
                });
            });
        });
    }

    const seqPlayer = getScenarioPlayer();
    await Promise.all([
        ...Array.from(allowedModels).map((modelId) =>
            preloadModelToRam(modelId, { allowedExpressions, allowedMotions, showConnecting: false }).catch((e) =>
                console.warn('[detail] model preload error:', e)
            )
        ),
        preloadScenarioVoices(Array.from(allowedVoices), seqPlayer.voice).catch((e) =>
            console.warn('[detail] voice preload error:', e)
        )
    ]);

    if (reqToken !== detailRequestToken || token !== getOutfitChangeToken() || !detailActive) return;

    try {
        state.currentLive2dId = '00';
        const loadedOk = await loadOutfitModels(charaId, '00', token, allowedExpressions, allowedMotions, null, {
            showConnecting: false
        });
        if (!loadedOk || reqToken !== detailRequestToken || token !== getOutfitChangeToken() || !detailActive) return;

        await metadataPromise;
        if (reqToken !== detailRequestToken || token !== getOutfitChangeToken() || !detailActive) return;
        setupOutfitButtons(charaId);
        setupVoiceButtons();
        const res = await loadScenarioForOutfit(charaId, '00', token);
        if (reqToken !== detailRequestToken || token !== getOutfitChangeToken() || !detailActive) return;
        applyScenarioResult(charaId, res);
        setupTabs();
        setupVoiceDisplaySwitch();
    } catch (e) {
        console.error('[detail] Model load failed:', e);
    }
}

export function leaveCharaCollectionDetail({ keepStage = false } = {}) {
    detailActive = false;
    detailRequestToken++;
    currentLoadedCharaId = null;
    resetDetailViewState();
    if (!keepStage) {
        clearStageModels();
        document.body.classList.remove('connecting');
    }
}
