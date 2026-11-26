// js/camera-top.js — Photo Mode (#/CameraTop) controller

import { state, buildModelId } from './viewer/model.js';
import { preloadModelToRam, setAssetPreloadConnecting } from './viewer/model-assets.js';
import { getFavoriteCharaId } from './chara-top.js';
import { openCharaFilterPopup, openCameraSavedPopup, openCameraHelpPopup } from './popups.js';
import { repoUrl } from './paths.js';
import { resolveSavedHomeBackground, DEFAULT_HOME_BG_FILE, DEFAULT_HOME_BGM_FILE } from './home-bg.js';
import { getCommittedHomeBg, setCommittedHomeBg } from './background-set.js';
import { changeBg, preloadBg, getImageNativeBase, setBgPortrait, setBgWebcamVideo } from './engine/bg.js';
import { startBgm, startSe } from './engine/audio.js';
import { updateUILayer, markDragScroll } from './engine/common-events.js';
import {
    WORLD_W,
    HOME16_H,
    DEFAULT_CHARA_ID,
    setStageContext,
    setStageXOffset,
    applySubtitlePlacement,
    ensureMetadataLoaded,
    getHomeOutfits,
    loadScenarioForOutfit,
    loadOutfitModels,
    performOutfitSwap,
    cancelOutfitChanges,
    bumpOutfitChangeToken,
    getActiveScenario,
    getScenarioPlayer,
    stopVoice,
    destroyStageModels,
    clearStageModels
} from './engine/l2d-stage.js';

const CHARA_CARDS_URL = repoUrl('assets/charaCards.json');
const STORAGE_SORT_KEY = 'SortFilterMemoryList';
const SORT_MEMORY_BUCKET = 'Camera_chara';
const DEFAULT_SORT_PRM = ['rank', 'desc', null, null, null, null, null];
const HOME_TAP_VOICE_IDS = [33, 34, 35, 36, 37, 38, 39, 40];
const HOME_TAP9_VOICE_ID = 41;

const SORT_ITEMS = [
    { key: 'get', label: 'Date', className: 'sortGet' },
    { key: 'level', label: 'Level', className: 'sortLv' },
    { key: 'rank', label: 'Rarity', className: 'sortRank' },
    { key: 'atk', label: 'ATK', className: 'sortAtk' },
    { key: 'def', label: 'DEF', className: 'sortDef' },
    { key: 'hp', label: 'HP', className: 'sortHp' },
    { key: 'eplv', label: 'Episode Lvl.', className: 'sortEplv' },
    { key: 'rev', label: 'Magic Lvl.', className: 'sortRev' },
    { key: 'mlv', label: 'Magia Lvl.', className: 'sortMlv' },
    { key: 'enhance', label: 'Spirit', className: 'sortEnhance' },
    { key: 'composeAttribute', label: 'Attribute', className: 'sortComposeAttribute' }
];

const SORT_BY_KEY = new Map(SORT_ITEMS.map((item, index) => [item.key, { ...item, index }]));
const ATTR_ORDER = { FIRE: 0, WATER: 1, TIMBER: 2, LIGHT: 3, DARK: 4, VOID: 5 };

let cardsCache = null;
let activeController = null;
let iconObserver = null;
let scrollFadeTimer = null;
let didDragScroll = false;

let currentCharaId = DEFAULT_CHARA_ID;
let currentLive2dId = '00';
let currentIsDual = false;
let currentOutfits = [];
let toggleFlg = 0;
let l2dTouchCnt = 0;
let cameraRunning = false;
let wearChanging = false;
let charaDrawerOpen = false;
let shutterBusy = false;
let lastCharaToggleAt = 0;
let cameraTopActive = false;
let cameraRequestToken = 0;
let cameraSpawnToken = 0;

let posCooldownTimer = null;
let wearBlockTimer = null;
let timerCountdownHandle = null;
let shutterDelayHandle = null;
let webcamStream = null;
let webcamVideoEl = null;

let currentSortPrm = [...DEFAULT_SORT_PRM];
let charaListBuilt = false;
const iconElementsByCharaId = new Map();

function loadSortMemory() {
    try {
        const raw = localStorage.getItem(STORAGE_SORT_KEY);
        if (!raw) return [...DEFAULT_SORT_PRM];
        const parsed = JSON.parse(raw);
        const list = parsed?.[SORT_MEMORY_BUCKET];
        if (Array.isArray(list) && list.length >= 6 && SORT_BY_KEY.has(list[0])) {
            return [
                list[0],
                list[1] === 'asc' ? 'asc' : 'desc',
                list[2] || null,
                list[3] || null,
                list[4] || null,
                list[5] || null,
                list[6] || null
            ];
        }
    } catch {}
    return [...DEFAULT_SORT_PRM];
}

function saveSortMemory(sortPrm) {
    try {
        const raw = localStorage.getItem(STORAGE_SORT_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        const next = parsed && typeof parsed === 'object' ? parsed : {};
        next[SORT_MEMORY_BUCKET] = sortPrm;
        localStorage.setItem(STORAGE_SORT_KEY, JSON.stringify(next));
    } catch {}
}

async function loadCharaCards() {
    if (cardsCache) return cardsCache;
    const resp = await fetch(CHARA_CARDS_URL);
    if (!resp.ok) throw new Error(`Failed to fetch ${CHARA_CARDS_URL}: ${resp.status}`);
    const list = await resp.json();
    cardsCache = list.map((card) => {
        const rankNum = Number(String(card.rank || 'RANK_4').split('_')[1]) || 4;
        const createdParts = String(card.createdAt || '2024/01/01 00:00:00').split(' ');
        const dateParts = (createdParts[0] || '2024/01/01').split('/');
        const timeParts = (createdParts[1] || '00:00:00').split(':');
        const createdTime = new Date(
            Number(dateParts[0]) || 2024,
            (Number(dateParts[1]) || 1) - 1,
            Number(dateParts[2]) || 1,
            Number(timeParts[0]) || 0,
            Number(timeParts[1]) || 0,
            Number(timeParts[2]) || 0
        ).getTime();
        return {
            ...card,
            rankNum,
            totalHp: (Number(card.hp) || 0) + (Number(card.addendHp) || 0),
            totalAtk: (Number(card.attack) || 0) + (Number(card.addendAttack) || 0),
            totalDef: (Number(card.defense) || 0) + (Number(card.addendDefense) || 0),
            createdShort: (createdParts[0] || '').slice(2),
            createdTime
        };
    });
    return cardsCache;
}

function getCardSortValue(card, sortKey) {
    switch (sortKey) {
        case 'get': return card.createdTime;
        case 'level': return card.level;
        case 'rank': return card.rankNum;
        case 'atk': return card.totalAtk;
        case 'def': return card.totalDef;
        case 'hp': return card.totalHp;
        case 'eplv': return card.episodeLevel;
        case 'rev': return card.revision;
        case 'mlv': return card.magiaLevel;
        case 'enhance': return card.enhanceCnt;
        case 'composeAttribute': return card.atbEnhanceCnt;
        default: return card.rankNum;
    }
}

function matchesFilter(card, sortPrm) {
    if (sortPrm[2]) {
        const set = new Set(String(sortPrm[2]).split(',').filter(Boolean));
        if (set.size && !set.has(card.attributeId)) return false;
    }
    if (sortPrm[3]) {
        const set = new Set(String(sortPrm[3]).split(',').filter(Boolean));
        if (set.size && !set.has(card.rank)) return false;
    }
    if (sortPrm[4] === 'enable' && !card.enhanced) return false;
    if (sortPrm[4] === 'disable' && card.enhanced) return false;
    if (sortPrm[5]) {
        const set = new Set(String(sortPrm[5]).split(',').filter(Boolean));
        const initType = card.filterInitialType || card.initialType;
        if (set.size && !set.has(initType)) return false;
    }
    if (sortPrm[6]) {
        const q = String(sortPrm[6]).toLowerCase().trim();
        if (q) {
            const name = String(card.name || '').toLowerCase();
            const title = String(card.title || '').toLowerCase();
            const idStr = String(card.charaId || '');
            if (!name.includes(q) && !title.includes(q) && !idStr.includes(q)) return false;
        }
    }
    return true;
}

function compareCards(a, b, sortKey, ascDesc) {
    const valA = getCardSortValue(a, sortKey);
    const valB = getCardSortValue(b, sortKey);
    if (valA !== valB) return ascDesc === 'asc' ? valA - valB : valB - valA;
    if (sortKey !== 'get') {
        const attDiff = (ATTR_ORDER[a.attributeId] ?? 99) - (ATTR_ORDER[b.attributeId] ?? 99);
        if (attDiff !== 0) return attDiff;
        if (a.rankNum !== b.rankNum) return b.rankNum - a.rankNum;
    }
    return b.charaId - a.charaId;
}

function loadCardIconAssets(li, nativeRoot) {
    if (li.dataset.loaded === 'true') return;
    li.dataset.loaded = 'true';
    li.querySelectorAll('[data-bg-rel]').forEach((span) => {
        span.style.backgroundImage = `url("${nativeRoot}/${span.dataset.bgRel}")`;
    });
    const img = li.querySelector('img[data-img-rel]');
    if (img) img.src = `${nativeRoot}/${img.dataset.imgRel}`;
}

function createCharaIconElement(card) {
    const attLower = String(card.attributeId || 'LIGHT').toLowerCase();
    const rankLower = String(card.rank || 'RANK_4').toLowerCase();
    const li = document.createElement('li');
    li.className = 'userCharaIcon se_decide';
    li.dataset.charaId = String(card.charaId);
    li.innerHTML = `
        <span class="att" data-bg-rel="card/frame/att_${attLower}.png"></span>
        <span class="star" data-bg-rel="card/frame/star_${rankLower}.png"></span>
        <span class="rank" data-bg-rel="card/frame/frame_${rankLower}.png"></span>
        <img data-img-rel="card/image/card_${card.displayCardId}_f.png" alt="">
        <span class="lv"><span>${card.level}</span></span>
        <span class="atk">${card.totalAtk}</span>
        <span class="def">${card.totalDef}</span>
        <span class="hp">${card.totalHp}</span>
        <span class="eplv">${card.episodeLevel}</span>
        <span class="get">${card.createdShort}</span>
        <span class="bg" data-bg-rel="card/frame/bg_${attLower}.png"></span>
        <span class="rev">${card.revision}</span>
        <span class="mlv">${card.magiaLevel}</span>
        <span class="enhance">${card.enhanceCnt}</span>
        <span class="composeAttribute">${card.atbEnhanceCnt}</span>`;
    return li;
}

function updateSortAndFilterControls() {
    const wrap = document.getElementById('cameraCharaListWrap');
    if (!wrap) return;
    const sortBtn = wrap.querySelector('.sortBtn');
    const orderBtn = wrap.querySelector('.orderBtn');
    const filterBtn = wrap.querySelector('.sortPopup');
    const listEl = wrap.querySelector('.charaListElms');

    const [sortKey, ascDesc] = currentSortPrm;
    const sortMeta = SORT_BY_KEY.get(sortKey) || SORT_BY_KEY.get('rank');

    if (sortBtn) {
        sortBtn.dataset.id = sortMeta.key;
        sortBtn.textContent = sortMeta.label;
    }
    if (orderBtn) {
        orderBtn.dataset.id = ascDesc;
        orderBtn.classList.toggle('asc', ascDesc === 'asc');
        orderBtn.classList.toggle('desc', ascDesc !== 'asc');
    }
    if (filterBtn) {
        const hasFilter = Boolean(currentSortPrm[2] || currentSortPrm[3] || currentSortPrm[4] || currentSortPrm[5] || currentSortPrm[6]);
        filterBtn.classList.toggle('filterOn', hasFilter);
    }
    if (listEl) {
        for (const item of SORT_ITEMS) listEl.classList.remove(item.className);
        listEl.classList.add(sortMeta.className);
    }
}

function updateScrollIndicator() {
    const wrap = document.getElementById('cameraCharaListWrap');
    const scrollWrap = wrap?.querySelector('.charaListScrollWrap');
    const inner = wrap?.querySelector('.scrollIndicatorInnerX');
    if (!scrollWrap || !inner) return;

    const clientW = scrollWrap.clientWidth;
    const scrollW = scrollWrap.scrollWidth;
    if (scrollW <= clientW) {
        inner.style.width = '0px';
        inner.classList.remove('onScroll');
        return;
    }
    const thumbW = Math.max(40, Math.round((clientW / scrollW) * clientW));
    const maxScroll = scrollW - clientW;
    const maxOffset = clientW - thumbW;
    const offset = maxScroll > 0 ? Math.round((scrollWrap.scrollLeft / maxScroll) * maxOffset) : 0;
    inner.style.width = `${thumbW}px`;
    inner.style.transform = `translate3d(${offset}px, 0, 0)`;
    inner.classList.add('onScroll');
    if (scrollFadeTimer) clearTimeout(scrollFadeTimer);
    scrollFadeTimer = setTimeout(() => inner.classList.remove('onScroll'), 650);
}

function applySortAndFilter(cards, nativeRoot) {
    const wrap = document.getElementById('cameraCharaListWrap');
    const listEl = wrap?.querySelector('.charaListElms');
    const cautionEl = wrap?.querySelector('.charaListCaution');
    if (!listEl) return;

    const [sortKey, ascDesc] = currentSortPrm;
    const sorted = [...cards].sort((a, b) => compareCards(a, b, sortKey, ascDesc));

    let visibleCount = 0;
    const frag = document.createDocumentFragment();
    for (const card of sorted) {
        const li = iconElementsByCharaId.get(card.charaId);
        if (!li) continue;
        const visible = matchesFilter(card, currentSortPrm);
        li.classList.toggle('hide', !visible);
        if (visible) visibleCount++;
        frag.appendChild(li);
    }
    listEl.appendChild(frag);

    if (cautionEl) cautionEl.classList.toggle('hide', visibleCount > 0);
    updateSortAndFilterControls();

    let hydrated = 0;
    for (const card of sorted) {
        const li = iconElementsByCharaId.get(card.charaId);
        if (li && !li.classList.contains('hide')) {
            loadCardIconAssets(li, nativeRoot);
            if (++hydrated >= 20) break;
        }
    }
    updateScrollIndicator();
}

function updateCharaListSelection(charaId, nativeRoot) {
    iconElementsByCharaId.forEach((li, id) => {
        const selected = id === Number(charaId);
        li.classList.toggle('select', selected);
        if (selected && nativeRoot) loadCardIconAssets(li, nativeRoot);
    });
}

function scrollSelectedIntoView(charaId) {
    const scrollWrap = document.querySelector('#cameraCharaListWrap .charaListScrollWrap');
    const li = iconElementsByCharaId.get(Number(charaId));
    if (!scrollWrap || !li || li.classList.contains('hide')) return;
    const left = li.offsetLeft;
    const right = left + li.offsetWidth;
    const viewLeft = scrollWrap.scrollLeft;
    const viewRight = viewLeft + scrollWrap.clientWidth;
    if (left < viewLeft || right > viewRight) {
        scrollWrap.scrollLeft = Math.max(0, left - Math.floor(scrollWrap.clientWidth / 2) + Math.floor(li.offsetWidth / 2));
    }
}

let measureCtx = null;
function fitWearRowLabel(row) {
    const text = row.textContent;
    if (!text) return;
    const font = window.getComputedStyle(row).font;
    if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
    if (!measureCtx) return;
    measureCtx.font = font;
    const maxWidth = 384 - 56;
    if (measureCtx.measureText(text).width <= maxWidth) return;
    const words = text.split(' ');
    while (words.length > 1 && measureCtx.measureText(words.join(' ')).width > maxWidth) {
        words.pop();
    }
    let trimmed = words.join(' ');
    while (trimmed && measureCtx.measureText(trimmed).width > maxWidth) {
        trimmed = trimmed.slice(0, -1);
    }
    row.textContent = trimmed;
}

function buildWearList() {
    const scrollInner = document.querySelector('#CameraTop #cameraWearScrollOuter .scrollInner');
    if (!scrollInner) return;
    scrollInner.innerHTML = '';

    const outfits = currentOutfits.length > 0
        ? currentOutfits
        : [{ live2dId: '00', description: 'Magical Girl' }];

    const cur = String(currentLive2dId || '00').padStart(2, '0');
    outfits.forEach((outfit) => {
        const idStr = String(outfit.live2dId).padStart(2, '0');
        const row = document.createElement('div');
        row.className = 'commonFrame4 TE se_tabs wrap' + (idStr === cur ? ' current' : '');
        row.dataset.live2dId = idStr;
        row.textContent = outfit.description || idStr;
        scrollInner.appendChild(row);
        fitWearRowLabel(row);
    });
}

async function spawnCameraModel({ charaId, live2dId = '00', presetIndex = 0, wearMode = false, playTransformVfx = false } = {}) {
    if (!cameraTopActive) return null;
    const token = ++cameraSpawnToken;
    const cid = Number(charaId) || DEFAULT_CHARA_ID;
    const l2d = String(live2dId || '00').padStart(2, '0');

    setStageContext({
        mode: 'camera',
        cameraPresetIndex: Number(presetIndex) || 0,
        cameraWearOpen: Boolean(wearMode)
    });
    state.currentCharacterId = cid;
    state.currentLive2dId = l2d;

    stopVoice();
    await ensureMetadataLoaded().catch(() => {});
    if (token !== cameraSpawnToken || !cameraTopActive) return null;

    const outfits = getHomeOutfits(cid);
    const modelId = buildModelId(cid, l2d);

    setAssetPreloadConnecting(true);
    try {
        if (playTransformVfx) {
            const swapToken = bumpOutfitChangeToken();
            const ok = await performOutfitSwap(cid, l2d, {
                token: swapToken,
                vfxDefaultX: 350,
                skipVfxIfDual: true
            });
            if (!ok || token !== cameraSpawnToken || !cameraTopActive) {
                if (!cameraTopActive) destroyStageModels();
                return null;
            }
        } else {
            const scenarioPromise = loadScenarioForOutfit(cid, l2d);
            await preloadModelToRam(modelId);
            if (token !== cameraSpawnToken || !cameraTopActive) return null;

            const loadedOk = await loadOutfitModels(cid, l2d);
            if (!loadedOk || token !== cameraSpawnToken || !cameraTopActive) {
                if (!cameraTopActive) destroyStageModels();
                return null;
            }
            await scenarioPromise;
            if (token !== cameraSpawnToken || !cameraTopActive) return null;
        }

        return {
            isDual: Boolean(state.dualMode),
            outfits
        };
    } finally {
        setAssetPreloadConnecting(false);
        document.body.classList.remove('connecting');
    }
}

async function playCameraTapVoice(charaId, live2dId = '00', tapCount = 0) {
    const { activeScenarioUrl, activeVoicePrefix } = getActiveScenario();
    if (!cameraTopActive || !activeScenarioUrl) return;
    const seqPlayer = getScenarioPlayer();
    const cid = Number(charaId) || state.currentCharacterId || DEFAULT_CHARA_ID;
    const pool = [...HOME_TAP_VOICE_IDS];
    if (tapCount >= 7) pool.push(HOME_TAP9_VOICE_ID);
    const chosenId = pool[Math.floor(Math.random() * pool.length)];
    const prefix = activeVoicePrefix || String(live2dId || '00').padStart(2, '0');
    const voiceKey = `vo_char_${cid}_${prefix}_${String(chosenId).padStart(2, '0')}`;
    applySubtitlePlacement({ isDual: state.dualMode });
    seqPlayer.controller = state.currentController;
    return seqPlayer.loadAndPlayVoice(activeScenarioUrl, voiceKey, cid);
}

async function spawnCurrentModel({ wearMode = false, playTransformVfx = false } = {}) {
    const res = await spawnCameraModel({
        charaId: currentCharaId,
        live2dId: currentLive2dId,
        presetIndex: toggleFlg,
        wearMode,
        playTransformVfx
    });
    if (res) {
        currentIsDual = Boolean(res.isDual);
        if (Array.isArray(res.outfits)) currentOutfits = res.outfits;
        buildWearList();
    }
}

function startPosCooldown() {
    const posBtn = document.getElementById('posToggle');
    const backBtn = document.getElementById('CameraPageBackLinkBtn');
    posBtn?.classList.add('off');
    backBtn?.classList.add('off');
    clearTimeout(posCooldownTimer);
    posCooldownTimer = setTimeout(() => {
        posBtn?.classList.remove('off');
        backBtn?.classList.remove('off');
        posCooldownTimer = null;
    }, 700);
}

async function handlePosToggle() {
    const posBtn = document.getElementById('posToggle');
    if (posBtn?.classList.contains('off') || wearChanging || charaDrawerOpen) return;
    const maxPresets = (currentIsDual && currentLive2dId === '00') ? 8 : 5;
    toggleFlg = (toggleFlg + 1) % maxPresets;
    startPosCooldown();
    await spawnCurrentModel({ wearMode: false });
}

async function ensureCharaListBuilt(signal) {
    if (charaListBuilt) return;
    charaListBuilt = true;

    const wrap = document.getElementById('cameraCharaListWrap');
    const scrollWrap = wrap?.querySelector('.charaListScrollWrap');
    const listEl = wrap?.querySelector('.charaListElms');
    if (!wrap || !scrollWrap || !listEl) return;

    const [cards, nativeRoot] = await Promise.all([loadCharaCards(), getImageNativeBase()]);
    if (signal.aborted) return;

    currentSortPrm = loadSortMemory();
    iconElementsByCharaId.clear();
    listEl.innerHTML = '';

    iconObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            loadCardIconAssets(entry.target, nativeRoot);
            iconObserver?.unobserve(entry.target);
        }
    }, { root: scrollWrap, rootMargin: '240px' });

    const frag = document.createDocumentFragment();
    for (const card of cards) {
        const li = createCharaIconElement(card);
        iconElementsByCharaId.set(card.charaId, li);
        frag.appendChild(li);
        iconObserver.observe(li);
    }
    listEl.appendChild(frag);

    applySortAndFilter(cards, nativeRoot);
    updateCharaListSelection(currentCharaId, nativeRoot);
    scrollSelectedIntoView(currentCharaId);

    listEl.addEventListener('click', async (e) => {
        if (didDragScroll) return;
        const li = e.target.closest('li.userCharaIcon');
        if (!li) return;
        const id = Number(li.dataset.charaId);
        if (!id || id === currentCharaId) return;
        currentCharaId = id;
        currentLive2dId = '00';
        toggleFlg = 0;
        l2dTouchCnt = 0;
        updateCharaListSelection(id, nativeRoot);
        startPosCooldown();
        await spawnCurrentModel({ wearMode: false });
    }, { signal });

    wrap.querySelector('.sortBtn')?.addEventListener('click', () => {
        const curMeta = SORT_BY_KEY.get(currentSortPrm[0]) || SORT_BY_KEY.get('rank');
        const nextMeta = SORT_ITEMS[(curMeta.index + 1) % SORT_ITEMS.length];
        currentSortPrm[0] = nextMeta.key;
        saveSortMemory(currentSortPrm);
        applySortAndFilter(cards, nativeRoot);
    }, { signal });

    wrap.querySelector('.orderBtn')?.addEventListener('click', () => {
        currentSortPrm[1] = currentSortPrm[1] === 'asc' ? 'desc' : 'asc';
        saveSortMemory(currentSortPrm);
        applySortAndFilter(cards, nativeRoot);
    }, { signal });

    wrap.querySelector('.sortPopup')?.addEventListener('click', () => {
        openCharaFilterPopup(currentSortPrm, (filters) => {
            if (signal.aborted || !Array.isArray(filters)) return;
            currentSortPrm[2] = filters[0] || null;
            currentSortPrm[3] = filters[1] || null;
            currentSortPrm[4] = filters[2] || null;
            currentSortPrm[5] = filters[3] || null;
            currentSortPrm[6] = filters[4] || null;
            saveSortMemory(currentSortPrm);
            applySortAndFilter(cards, nativeRoot);
        });
    }, { signal });

    setupDragScroll(scrollWrap, signal);
}

function setupDragScroll(scrollWrap, signal) {
    let dragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    scrollWrap.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        dragging = true;
        didDragScroll = false;
        startX = e.clientX;
        startScrollLeft = scrollWrap.scrollLeft;
        scrollWrap.classList.add('dragging');
    }, { signal });

    window.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const scale = window.cameraContainer?.scale?.x || 1;
        const dx = (e.clientX - startX) / scale;
        if (Math.abs(dx) > 4) didDragScroll = true;
        scrollWrap.scrollLeft = startScrollLeft - dx;
    }, { signal });

    const endDrag = () => {
        if (!dragging) return;
        dragging = false;
        scrollWrap.classList.remove('dragging');
        if (didDragScroll) {
            markDragScroll();
            setTimeout(() => { didDragScroll = false; }, 0);
        }
    };
    window.addEventListener('pointerup', endDrag, { signal });
    window.addEventListener('pointercancel', endDrag, { signal });

    scrollWrap.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            scrollWrap.scrollLeft += e.deltaY;
        }
    }, { passive: false, signal });

    scrollWrap.addEventListener('scroll', updateScrollIndicator, { passive: true, signal });
}

async function handleCharaDrawerToggle(signal) {
    const now = Date.now();
    if (now - lastCharaToggleAt < 450) return;
    lastCharaToggleAt = now;

    const root = document.getElementById('CameraTop');
    const drawer = document.querySelector('#CameraTop #chara');
    if (!root || !drawer) return;

    drawer.classList.remove('forceOff');
    drawer.classList.toggle('off');
    charaDrawerOpen = root.classList.toggle('changing');
    if (charaDrawerOpen) {
        await ensureCharaListBuilt(signal);
        const nativeRoot = await getImageNativeBase().catch(() => '');
        updateCharaListSelection(currentCharaId, nativeRoot);
        scrollSelectedIntoView(currentCharaId);
    }
}

async function handleWearToggle() {
    const root = document.getElementById('CameraTop');
    const wearWrap = document.querySelector('#CameraTop #wearWrap');
    if (!root || !wearWrap) return;

    if (wearChanging) {
        wearChanging = false;
        wearWrap.classList.add('off');
        root.classList.remove('wearing');
        await spawnCurrentModel({ wearMode: false });
    } else {
        wearChanging = true;
        buildWearList();
        wearWrap.classList.remove('off');
        root.classList.add('wearing');
        await spawnCurrentModel({ wearMode: true });
    }
}

async function handleWearSelect(row) {
    const wearWrap = document.querySelector('#CameraTop #wearWrap');
    if (!wearWrap || wearWrap.classList.contains('block') || row.classList.contains('current')) return;

    const nextId = String(row.dataset.live2dId || '00').padStart(2, '0');
    wearWrap.querySelectorAll('.wrap.current').forEach((el) => el.classList.remove('current'));
    row.classList.add('current');
    currentLive2dId = nextId;
    toggleFlg = 0;

    wearWrap.classList.add('block');
    clearTimeout(wearBlockTimer);
    wearBlockTimer = setTimeout(() => {
        wearWrap.classList.remove('block');
        wearBlockTimer = null;
    }, 1500);

    await spawnCurrentModel({ wearMode: true, playTransformVfx: true });
}

function stopWebcam() {
    if (webcamStream) {
        webcamStream.getTracks().forEach((t) => {
            try { t.stop(); } catch {}
        });
        webcamStream = null;
    }
    if (webcamVideoEl) {
        try {
            webcamVideoEl.pause();
            webcamVideoEl.srcObject = null;
            webcamVideoEl.remove();
        } catch {}
        webcamVideoEl = null;
    }
    setBgWebcamVideo(null);
    updateUILayer();
}

async function startWebcamOrFallback() {
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
        return false;
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false
        });
        if (!cameraRunning) {
            stream.getTracks().forEach((t) => t.stop());
            return false;
        }
        webcamStream = stream;
        const video = document.createElement('video');
        video.id = 'cameraVideo';
        video.playsInline = true;
        video.muted = true;
        video.autoplay = true;
        video.srcObject = stream;
        document.getElementById('app')?.prepend(video);
        webcamVideoEl = video;

        await new Promise((resolve) => {
            if (video.readyState >= 1) resolve();
            else {
                video.addEventListener('loadedmetadata', resolve, { once: true });
                setTimeout(resolve, 1500);
            }
        });
        await video.play().catch(() => {});
        if (cameraRunning) {
            setBgWebcamVideo(video);
            updateUILayer();
        }
        return true;
    } catch (err) {
        console.info('[camera-top] Webcam unavailable or denied; keeping Home background fallback:', err?.message || err);
        return false;
    }
}

async function captureCameraPhoto() {
    await startSe('surround/7023_camera_hca.hca');
    const renderer = window.app?.renderer;
    const extract = renderer?.plugins?.extract;
    const cam = window.cameraContainer;
    if (!renderer || !extract || !cam) return false;

    const outCanvas = document.createElement('canvas');
    outCanvas.width = WORLD_W;
    outCanvas.height = HOME16_H;
    const outCtx = outCanvas.getContext('2d');

    if (webcamVideoEl && webcamVideoEl.readyState >= 2) {
        const vw = webcamVideoEl.videoWidth || WORLD_W;
        const vh = webcamVideoEl.videoHeight || HOME16_H;
        const scale = Math.max(WORLD_W / vw, HOME16_H / vh);
        const dw = vw * scale;
        const dh = vh * scale;
        outCtx.drawImage(webcamVideoEl, (WORLD_W - dw) / 2, (HOME16_H - dh) / 2, dw, dh);
    }

    const prevX = cam.x;
    const prevY = cam.y;
    const prevSx = cam.scale.x;
    const prevSy = cam.scale.y;
    setBgWebcamVideo(null);
    cam.position.set(0, 0);
    cam.scale.set(1, 1);

    const rt = PIXI.RenderTexture.create({ width: WORLD_W, height: HOME16_H, resolution: 1 });
    let pixiCanvas = null;
    try {
        renderer.render(cam, { renderTexture: rt, clear: true });
        pixiCanvas = extract.canvas(rt);
        outCtx.drawImage(pixiCanvas, 0, 0, WORLD_W, HOME16_H);
    } finally {
        rt.destroy(true);
        cam.position.set(prevX, prevY);
        cam.scale.set(prevSx, prevSy);
        if (webcamVideoEl && cameraRunning) {
            setBgWebcamVideo(webcamVideoEl);
        }
        updateUILayer();
    }

    const blob = await new Promise((resolve) => outCanvas.toBlob(resolve, 'image/png'));
    if (pixiCanvas) {
        pixiCanvas.width = 0;
        pixiCanvas.height = 0;
    }
    outCanvas.width = 0;
    outCanvas.height = 0;
    if (!blob) return false;

    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const url = URL.createObjectURL(blob);
    try {
        const a = document.createElement('a');
        a.href = url;
        a.download = `magia-record-photo-${stamp}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    } finally {
        URL.revokeObjectURL(url);
    }
    return true;
}

async function handleCameraRunToggle() {
    const root = document.getElementById('CameraTop');
    if (!root || shutterBusy) return;

    if (cameraRunning) {
        cameraRunning = false;
        stopWebcam();
        root.classList.remove('cameraActive');
    } else {
        cameraRunning = true;
        root.classList.add('cameraActive');
        await startWebcamOrFallback();
    }
}

function triggerFlash() {
    const flash = document.getElementById('cameraFlash');
    if (!flash) return;
    flash.classList.remove('flash');
    void flash.offsetWidth;
    flash.classList.add('flash');
}

function executeShutter() {
    if (!cameraRunning || shutterBusy) return;
    shutterBusy = true;
    const root = document.getElementById('CameraTop');
    root?.classList.add('shuttering');

    clearTimeout(shutterDelayHandle);
    shutterDelayHandle = setTimeout(async () => {
        shutterDelayHandle = null;
        try {
            triggerFlash();
            await captureCameraPhoto();
        } catch (err) {
            console.error('[camera-top] Photo capture failed:', err);
        } finally {
            root?.classList.remove('shuttering');
            shutterBusy = false;
            openCameraSavedPopup();
        }
    }, 500);
}

function handleStartTimer() {
    if (!cameraRunning || shutterBusy) return;
    shutterBusy = true;
    const root = document.getElementById('CameraTop');
    root?.classList.add('shuttering');

    clearTimeout(timerCountdownHandle);
    timerCountdownHandle = setTimeout(() => {
        timerCountdownHandle = null;
        shutterBusy = false;
        executeShutter();
    }, 4500);
}

function setupTouchFeedback(root, signal) {
    const SEL = '#posToggle:not(.off), #charaChange, #changeDecide, #wearChange, #cameraRun, #shutter, #startTimer, #wearWrap .wrap, #cameraWearDecide';
    root.addEventListener('pointerdown', (e) => {
        const target = e.target.closest(SEL);
        if (target) target.classList.add('touch');
    }, { signal });

    const clear = () => {
        root.querySelectorAll('.touch').forEach((el) => el.classList.remove('touch'));
    };
    window.addEventListener('pointerup', clear, { signal });
    window.addEventListener('pointercancel', clear, { signal });
}

export async function initCameraTop({ initialCharaId } = {}) {
    resetCameraTop();
    activeController = new AbortController();
    const { signal } = activeController;

    const root = document.getElementById('CameraTop');
    if (!root) return;

    currentCharaId = Number(initialCharaId) || getFavoriteCharaId();
    currentLive2dId = '00';
    toggleFlg = 0;
    l2dTouchCnt = 0;
    cameraRunning = false;
    wearChanging = false;
    charaDrawerOpen = false;
    shutterBusy = false;
    charaListBuilt = false;

    root.classList.remove('cameraActive', 'shuttering', 'wearing', 'changing');
    document.querySelector('#CameraTop #chara')?.classList.add('forceOff', 'off');
    document.querySelector('#CameraTop #wearWrap')?.classList.add('off');

    startPosCooldown();
    await spawnCurrentModel({ wearMode: false });
    if (signal.aborted) return;

    document.getElementById('CameraPageBackLinkBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.currentTarget.classList.contains('off') || cameraRunning || shutterBusy) return;
        const q = window.location.hash.split('?')[1];
        window.location.hash = q ? `#/MyPage?${q}` : '#/MyPage';
    }, { signal });

    document.getElementById('cameraHelp')?.addEventListener('click', (e) => {
        e.preventDefault();
        openCameraHelpPopup();
    }, { signal });

    document.getElementById('posToggle')?.addEventListener('click', (e) => {
        e.preventDefault();
        handlePosToggle();
    }, { signal });

    root.querySelectorAll('.charaToggle').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleCharaDrawerToggle(signal);
        }, { signal });
    });

    root.querySelectorAll('.wearToggle').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleWearToggle();
        }, { signal });
    });

    document.querySelector('#CameraTop #cameraWearScrollOuter .scrollInner')?.addEventListener('click', (e) => {
        const row = e.target.closest('.wrap');
        if (!row) return;
        e.preventDefault();
        handleWearSelect(row);
    }, { signal });

    root.querySelector('.live2dArea')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (shutterBusy) return;
        playCameraTapVoice(currentCharaId, currentLive2dId, l2dTouchCnt++);
    }, { signal });

    document.getElementById('cameraRun')?.addEventListener('click', (e) => {
        e.preventDefault();
        handleCameraRunToggle();
    }, { signal });

    document.getElementById('shutter')?.addEventListener('click', (e) => {
        e.preventDefault();
        executeShutter();
    }, { signal });

    document.getElementById('startTimer')?.addEventListener('click', (e) => {
        e.preventDefault();
        handleStartTimer();
    }, { signal });

    setupTouchFeedback(root, signal);
}

export function resetCameraTop() {
    if (activeController) {
        activeController.abort();
        activeController = null;
    }
    if (iconObserver) {
        iconObserver.disconnect();
        iconObserver = null;
    }
    clearTimeout(scrollFadeTimer);
    clearTimeout(posCooldownTimer);
    clearTimeout(wearBlockTimer);
    clearTimeout(timerCountdownHandle);
    clearTimeout(shutterDelayHandle);
    scrollFadeTimer = null;
    posCooldownTimer = null;
    wearBlockTimer = null;
    timerCountdownHandle = null;
    shutterDelayHandle = null;

    stopWebcam();
    cameraRunning = false;
    wearChanging = false;
    charaDrawerOpen = false;
    shutterBusy = false;
    charaListBuilt = false;
    didDragScroll = false;
    iconElementsByCharaId.clear();

    const root = document.getElementById('CameraTop');
    if (root) {
        root.classList.remove('cameraActive', 'shuttering', 'wearing', 'changing');
    }
    const listEl = document.querySelector('#cameraCharaListWrap .charaListElms');
    if (listEl) listEl.innerHTML = '';
}

export async function enterCameraTop({ initialCharaId, onBeforeReveal, hadLive2d = false } = {}) {
    cameraTopActive = true;
    const token = ++cameraRequestToken;

    const step1Start = performance.now();
    const savedBg = getCommittedHomeBg() || await resolveSavedHomeBackground();
    if (token !== cameraRequestToken || !cameraTopActive) return;
    setCommittedHomeBg(savedBg);

    let bgTarget = savedBg;
    await Promise.all([
        preloadBg(savedBg).catch((err) => {
            console.warn('[camera-top] BG preload failed, falling back to default:', err);
            bgTarget = `bg/web/${DEFAULT_HOME_BG_FILE}`;
            return preloadBg(bgTarget).catch(() => {});
        }),
        startBgm(savedBg.bgmFile, { autoplay: true }).catch((err) => {
            console.warn('[camera-top] BGM load failed, falling back to default:', err);
            return startBgm(DEFAULT_HOME_BGM_FILE, { autoplay: true }).catch(() => {});
        }),
        ensureMetadataLoaded().catch(() => {})
    ]);
    if (token !== cameraRequestToken || !cameraTopActive) return;

    if (hadLive2d) {
        const elapsed = performance.now() - step1Start;
        if (elapsed < 200) {
            await new Promise((r) => setTimeout(r, 200 - elapsed));
        }
        if (token !== cameraRequestToken || !cameraTopActive) return;
    }

    document.getElementById('ui-layer')?.classList.remove('home-mode', 'menu-closed');
    setBgWebcamVideo(null);
    setBgPortrait(false);

    clearStageModels();
    await changeBg(bgTarget, { visible: true, autoplay: true, crossfadeMs: 250, waitForCrossfade: true }).catch((err) => {
        console.warn('[camera-top] BG load failed, falling back to default:', err);
        return changeBg(`bg/web/${DEFAULT_HOME_BG_FILE}`, { visible: true, autoplay: true, crossfadeMs: 250, waitForCrossfade: true });
    });
    if (token !== cameraRequestToken || !cameraTopActive) return;

    setStageContext({ mode: 'camera', cameraPresetIndex: 0, cameraWearOpen: false });
    setStageXOffset(0);
    if (typeof window.updateViewerViewport === 'function') {
        window.updateViewerViewport();
    }

    if (typeof onBeforeReveal === 'function') {
        onBeforeReveal();
    }
    await initCameraTop({ initialCharaId });
}

export function leaveCameraTop({ keepStage = false } = {}) {
    cameraTopActive = false;
    cameraRequestToken++;
    cameraSpawnToken++;
    resetCameraTop();
    if (!keepStage) {
        cancelOutfitChanges();
        stopVoice();
        destroyStageModels();
    }
}
