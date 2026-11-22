// js/chara-top.js — Magical Girls (#/CharaListTop / #CharaTop) controller

import { resolveMaReAssetsBase } from './viewer/model.js';
import { openFavoriteChangedPopup, openCharaFilterPopup } from './popups.js';

const CHARA_CARDS_URL = 'assets/charaCards.json';
const STORAGE_FAV_KEY = 'favoriteCharaId';
const STORAGE_POSE_KEY = 'miniCharaStandPose';
const STORAGE_SORT_KEY = 'SortFilterMemoryList';
const SORT_MEMORY_BUCKET = 'CharaTop_chara';
const DEFAULT_FAVORITE_ID = 1001;
const DEFAULT_SORT_PRM = ['rank', 'desc', null, null, null, null, null];

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

const ATTR_ORDER = {
    FIRE: 0,
    WATER: 1,
    TIMBER: 2,
    LIGHT: 3,
    DARK: 4,
    VOID: 5
};

let cardsCache = null;
let imageNativeBaseCache = null;
let selectedCharaId = null;
let currentSortPrm = [...DEFAULT_SORT_PRM];
let activeController = null;
let iconObserver = null;
let scrollFadeTimer = null;
let didDragScroll = false;
const iconElementsByCharaId = new Map();

export function getFavoriteCharaId() {
    try {
        const raw = localStorage.getItem(STORAGE_FAV_KEY);
        if (raw && /^\d{4}$/.test(raw)) return Number(raw);
    } catch { /* ignore storage restrictions */ }
    return DEFAULT_FAVORITE_ID;
}

export function setFavoriteCharaId(charaId) {
    const num = Number(charaId);
    if (!Number.isInteger(num) || num <= 0) return;
    try {
        localStorage.setItem(STORAGE_FAV_KEY, String(num));
    } catch { /* ignore storage restrictions */ }
}

export function getMiniCharaStandPose() {
    try {
        const raw = localStorage.getItem(STORAGE_POSE_KEY);
        if (raw === 'stance' || raw === 'wait') return raw;
    } catch { /* ignore storage restrictions */ }
    return 'wait';
}

function setMiniCharaStandPose(pose) {
    const normalized = pose === 'stance' ? 'stance' : 'wait';
    try {
        localStorage.setItem(STORAGE_POSE_KEY, normalized);
    } catch { /* ignore storage restrictions */ }
    return normalized;
}

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
    } catch { /* ignore malformed storage */ }
    return [...DEFAULT_SORT_PRM];
}

function saveSortMemory(sortPrm) {
    try {
        const raw = localStorage.getItem(STORAGE_SORT_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        const next = parsed && typeof parsed === 'object' ? parsed : {};
        next[SORT_MEMORY_BUCKET] = sortPrm;
        localStorage.setItem(STORAGE_SORT_KEY, JSON.stringify(next));
    } catch { /* ignore storage restrictions */ }
}

async function getImageNativeRoot() {
    if (imageNativeBaseCache) return imageNativeBaseCache;
    const live2dBase = await resolveMaReAssetsBase();
    imageNativeBaseCache = String(live2dBase).replace(/\/live2d_v4\/?$/, '');
    return imageNativeBaseCache;
}

async function loadCharaCards() {
    if (cardsCache) return cardsCache;
    const resp = await fetch(CHARA_CARDS_URL);
    if (!resp.ok) throw new Error(`Failed to fetch ${CHARA_CARDS_URL}: ${resp.status}`);
    const list = await resp.json();
    cardsCache = list.map((card) => {
        const rankNum = Number(String(card.rank || 'RANK_4').split('_')[1]) || 4;
        const maxRare = Number(card.maxRare) || rankNum;
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
            maxRare,
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
    const attFilter = sortPrm[2];
    if (attFilter) {
        const set = new Set(String(attFilter).split(',').filter(Boolean));
        if (set.size && !set.has(card.attributeId)) return false;
    }

    const rankFilter = sortPrm[3];
    if (rankFilter) {
        const set = new Set(String(rankFilter).split(',').filter(Boolean));
        if (set.size && !set.has(card.rank)) return false;
    }

    const enhanceFilter = sortPrm[4];
    if (enhanceFilter === 'enable' && !card.enhanced) return false;
    if (enhanceFilter === 'disable' && card.enhanced) return false;

    const initialFilter = sortPrm[5];
    if (initialFilter) {
        const set = new Set(String(initialFilter).split(',').filter(Boolean));
        const initType = card.filterInitialType || card.initialType;
        if (set.size && !set.has(initType)) return false;
    }

    return true;
}

function compareCards(a, b, sortKey, ascDesc) {
    const valA = getCardSortValue(a, sortKey);
    const valB = getCardSortValue(b, sortKey);
    if (valA !== valB) {
        return ascDesc === 'asc' ? valA - valB : valB - valA;
    }
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
    const bgSpans = li.querySelectorAll('[data-bg-rel]');
    bgSpans.forEach((span) => {
        span.style.backgroundImage = `url("${nativeRoot}/${span.dataset.bgRel}")`;
    });
    const img = li.querySelector('img[data-img-rel]');
    if (img) {
        img.src = `${nativeRoot}/${img.dataset.imgRel}`;
    }
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
    const sortBtn = document.getElementById('sortBtn');
    const orderBtn = document.querySelector('#CharaTop .orderBtn');
    const filterBtn = document.getElementById('sortPopup');
    const listEl = document.getElementById('charaListElms');

    const sortKey = currentSortPrm[0];
    const ascDesc = currentSortPrm[1];
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
        const hasFilter = Boolean(currentSortPrm[2] || currentSortPrm[3] || currentSortPrm[4] || currentSortPrm[5]);
        filterBtn.classList.toggle('filterOn', hasFilter);
    }
    if (listEl) {
        for (const item of SORT_ITEMS) {
            listEl.classList.remove(item.className);
        }
        listEl.classList.add(sortMeta.className);
    }
}

function updateScrollIndicator() {
    const scrollWrap = document.getElementById('charaListScrollWrap');
    const inner = document.querySelector('#CharaTop .scrollIndicatorInnerX');
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
    scrollFadeTimer = setTimeout(() => {
        inner.classList.remove('onScroll');
    }, 650);
}

function applySortAndFilter(cards, nativeRoot) {
    const listEl = document.getElementById('charaListElms');
    const cautionEl = document.querySelector('#CharaTop .charaListCaution');
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

    if (cautionEl) {
        cautionEl.classList.toggle('hide', visibleCount > 0);
    }
    updateSortAndFilterControls();

    // Eagerly hydrate the first batch of visible icons after re-order
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

function renderCharaDataCard(card) {
    const dataEl = document.getElementById('charaData');
    if (!dataEl || !card) return;

    const attEl = document.getElementById('charaDataAtt');
    if (attEl) attEl.className = `type_f ${card.attributeId || 'LIGHT'}`;

    const rareEl = document.getElementById('rare');
    if (rareEl) rareEl.className = card.rank || 'RANK_5';

    const nameEl = document.getElementById('charaDataName');
    if (nameEl) nameEl.textContent = card.name || '';

    const titleEl = document.getElementById('charaDataTitle');
    if (titleEl) {
        if (card.title) {
            titleEl.textContent = card.title;
            titleEl.style.display = '';
        } else {
            titleEl.textContent = '';
            titleEl.style.display = 'none';
        }
    }

    const lvEl = document.getElementById('currentLv');
    if (lvEl) lvEl.textContent = String(card.level);
    const maxLvEl = document.getElementById('currentMaxLv');
    if (maxLvEl) maxLvEl.textContent = String(card.maxLevel);
    const lvMaxEl = document.getElementById('charaDataLvMax');
    if (lvMaxEl) lvMaxEl.classList.toggle('on', card.level >= card.maxLevel);

    const setStat = (id, bonusId, base, bonus) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String((Number(base) || 0) + (Number(bonus) || 0));
        const bEl = document.getElementById(bonusId);
        if (bEl) {
            if (bonus > 0) {
                bEl.textContent = `(+${bonus})`;
                bEl.style.display = '';
            } else {
                bEl.textContent = '';
                bEl.style.display = 'none';
            }
        }
    };
    setStat('charaDataHp', 'charaDataHpBonus', card.hp, card.addendHp);
    setStat('charaDataAtk', 'charaDataAtkBonus', card.attack, card.addendAttack);
    setStat('charaDataDef', 'charaDataDefBonus', card.defense, card.addendDefense);

    const revNum = document.getElementById('charaDataRevision');
    if (revNum) revNum.textContent = String(card.revision);
    const revIcons = document.querySelectorAll('#charaDataRevisionIcons li');
    revIcons.forEach((li, idx) => li.classList.toggle('on', idx < card.revision));

    const magiaNum = document.getElementById('charaDataMagiaLv');
    if (magiaNum) magiaNum.textContent = String(card.magiaLevel);
    const magiaIcons = document.querySelectorAll('#charaDataMagiaIcons li');
    magiaIcons.forEach((li, idx) => {
        li.classList.toggle('on', idx < card.magiaLevel);
        li.classList.toggle('none', idx >= card.maxRare);
    });

    const epNum = document.getElementById('episodeLv');
    if (epNum) epNum.textContent = String(card.episodeLevel);
    const epMaxEl = document.getElementById('charaDataEpLvMax');
    if (epMaxEl) epMaxEl.classList.toggle('on', card.episodeLevel >= 5);

    const compAttEl = document.querySelector('#CharaTop #btnArea .composeAttribute');
    if (compAttEl) {
        compAttEl.className = `TE composeAttribute ${String(card.attributeId || 'LIGHT').toLowerCase()}`;
    }

    const leaderBtn = document.getElementById('leaderChangeBtn');
    if (leaderBtn) {
        leaderBtn.classList.toggle('off', card.charaId === getFavoriteCharaId());
    }
}

function updateLargeCardImage(card, nativeRoot) {
    const imgWrap = document.getElementById('charaImgL');
    const imgEl = document.getElementById('charaLargeImg');
    if (!imgWrap || !imgEl || !card) return;

    imgWrap.classList.remove('anim');
    imgEl.src = '';
    void imgWrap.offsetWidth;
    imgEl.src = `${nativeRoot}/card/image/card_${card.displayCardId}_l.png`;
    imgWrap.classList.add('anim');
}

function selectChara(charaId, cardsById, nativeRoot) {
    const card = cardsById.get(Number(charaId));
    if (!card) return;
    selectedCharaId = card.charaId;

    iconElementsByCharaId.forEach((li, id) => {
        li.classList.toggle('select', id === card.charaId);
        if (id === card.charaId) loadCardIconAssets(li, nativeRoot);
    });

    renderCharaDataCard(card);
    updateLargeCardImage(card, nativeRoot);

    if (typeof window.showCharaTopMini === 'function') {
        window.showCharaTopMini(card.miniCharaNo, { standPose: getMiniCharaStandPose() });
    }
}

function scrollSelectedIntoView(charaId) {
    const scrollWrap = document.getElementById('charaListScrollWrap');
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

function setupTouchFeedback(rootEl, signal) {
    const TOUCH_SEL = [
        '#detailBtn',
        '#leaderChangeBtn:not(.off)',
        '#poseChangeBtn',
        '#sortBtn',
        '#sortPopup',
        '.orderBtn',
        '#btnArea.top ul li:not(.off)'
    ].join(', ');

    rootEl.addEventListener('pointerdown', (e) => {
        const target = e.target.closest(TOUCH_SEL);
        if (target) target.classList.add('touch');
    }, { signal });

    const clearTouch = () => {
        rootEl.querySelectorAll('.touch').forEach((el) => el.classList.remove('touch'));
    };
    window.addEventListener('pointerup', clearTouch, { signal });
    window.addEventListener('pointercancel', clearTouch, { signal });
}

function pickFallbackCharaId(listEl, cards) {
    const targetLi = listEl.querySelector('li.userCharaIcon:not(.hide)')
        || listEl.querySelector('li.userCharaIcon');
    return targetLi ? Number(targetLi.dataset.charaId) : (cards[0]?.charaId ?? null);
}

export async function initCharaTop({ initialCharaId } = {}) {
    resetCharaTop();
    activeController = new AbortController();
    const { signal } = activeController;

    const rootEl = document.getElementById('CharaTop');
    const listEl = document.getElementById('charaListElms');
    const scrollWrap = document.getElementById('charaListScrollWrap');
    if (!rootEl || !listEl || !scrollWrap) return;

    const [cards, nativeRoot] = await Promise.all([loadCharaCards(), getImageNativeRoot()]);
    if (signal.aborted) return;

    const cardsById = new Map(cards.map((c) => [c.charaId, c]));
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

    const requested = Number(initialCharaId);
    if (cardsById.has(requested)) {
        selectChara(requested, cardsById, nativeRoot);
        scrollSelectedIntoView(requested);
    } else {
        const startId = pickFallbackCharaId(listEl, cards);
        if (startId != null) {
            selectChara(startId, cardsById, nativeRoot);
        }
        scrollWrap.scrollLeft = 0;
    }

    listEl.addEventListener('click', (e) => {
        if (didDragScroll) return;
        const li = e.target.closest('li.userCharaIcon');
        if (!li) return;
        const id = Number(li.dataset.charaId);
        if (id && id !== selectedCharaId) {
            selectChara(id, cardsById, nativeRoot);
        }
    }, { signal });

    document.getElementById('leaderChangeBtn')?.addEventListener('click', () => {
        const card = cardsById.get(selectedCharaId);
        if (!card || card.charaId === getFavoriteCharaId()) return;
        setFavoriteCharaId(card.charaId);
        document.getElementById('leaderChangeBtn')?.classList.add('off');
        if (typeof window.setFavoriteCharacter === 'function') {
            window.setFavoriteCharacter(card.charaId);
        }
        openFavoriteChangedPopup(card.name);
    }, { signal });

    document.getElementById('poseChangeBtn')?.addEventListener('click', () => {
        const card = cardsById.get(selectedCharaId);
        if (!card) return;
        const nextPose = setMiniCharaStandPose(getMiniCharaStandPose() === 'wait' ? 'stance' : 'wait');
        if (typeof window.showCharaTopMini === 'function') {
            window.showCharaTopMini(card.miniCharaNo, { standPose: nextPose });
        }
    }, { signal });

    document.getElementById('miniCharaTapArea')?.addEventListener('click', () => {
        const card = cardsById.get(selectedCharaId);
        if (!card) return;
        const standPose = getMiniCharaStandPose();
        if (typeof window.showCharaTopMini === 'function') {
            window.showCharaTopMini(card.miniCharaNo, {
                animation: ['reaction', standPose],
                standPose
            });
        }
    }, { signal });

    document.getElementById('sortBtn')?.addEventListener('click', () => {
        const curMeta = SORT_BY_KEY.get(currentSortPrm[0]) || SORT_BY_KEY.get('rank');
        const nextMeta = SORT_ITEMS[(curMeta.index + 1) % SORT_ITEMS.length];
        currentSortPrm[0] = nextMeta.key;
        saveSortMemory(currentSortPrm);
        applySortAndFilter(cards, nativeRoot);
    }, { signal });

    rootEl.querySelector('.orderBtn')?.addEventListener('click', () => {
        currentSortPrm[1] = currentSortPrm[1] === 'asc' ? 'desc' : 'asc';
        saveSortMemory(currentSortPrm);
        applySortAndFilter(cards, nativeRoot);
    }, { signal });

    document.getElementById('sortPopup')?.addEventListener('click', () => {
        openCharaFilterPopup(currentSortPrm, (filters) => {
            if (signal.aborted || !Array.isArray(filters)) return;
            currentSortPrm[2] = filters[0] || null;
            currentSortPrm[3] = filters[1] || null;
            currentSortPrm[4] = filters[2] || null;
            currentSortPrm[5] = filters[3] || null;
            saveSortMemory(currentSortPrm);
            applySortAndFilter(cards, nativeRoot);
            const selectedLi = iconElementsByCharaId.get(selectedCharaId);
            if (!selectedLi || selectedLi.classList.contains('hide')) {
                const nextId = pickFallbackCharaId(listEl, cards);
                if (nextId != null && nextId !== selectedCharaId) {
                    selectChara(nextId, cardsById, nativeRoot);
                }
                scrollWrap.scrollLeft = 0;
                updateScrollIndicator();
            }
        });
    }, { signal });

    setupDragScroll(scrollWrap, signal);
    setupTouchFeedback(rootEl, signal);
}

export function resetCharaTop() {
    if (activeController) {
        activeController.abort();
        activeController = null;
    }
    if (iconObserver) {
        iconObserver.disconnect();
        iconObserver = null;
    }
    if (scrollFadeTimer) {
        clearTimeout(scrollFadeTimer);
        scrollFadeTimer = null;
    }
    didDragScroll = false;
    selectedCharaId = null;
    iconElementsByCharaId.clear();
    const listEl = document.getElementById('charaListElms');
    if (listEl) listEl.innerHTML = '';
}
