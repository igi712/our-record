// js/background-set.js — Home Background selection screen controller (#/BackgroundSet).

import {
    loadHomeBackgroundList,
    getSavedHomeBgId,
    saveHomeBgId,
    DEFAULT_HOME_BG
} from './home-bg.js';

let bound = false;
let pressedEl = null;
let entriesById = new Map();
let selectedEntry = { ...DEFAULT_HOME_BG };
let prefetchTimer = null;

function scheduleVisiblePrefetch() {
    clearTimeout(prefetchTimer);
    prefetchTimer = setTimeout(() => {
        prefetchTimer = null;
        if (typeof window.prefetchHomeBackgrounds !== 'function') return;
        const scrollInner = document.querySelector('#BackgroundSet #scrollOuter .scrollInner');
        if (!scrollInner) return;
        const top = scrollInner.scrollTop;
        const bottom = top + scrollInner.clientHeight;
        const visible = [];
        for (const row of scrollInner.querySelectorAll('.bgItem')) {
            const rowTop = row.offsetTop;
            const rowBottom = rowTop + row.offsetHeight;
            if (rowBottom >= top - 60 && rowTop <= bottom + 60) {
                const entry = entriesById.get(row.dataset.bgId);
                if (entry && entry.id !== selectedEntry?.id) visible.push(entry);
            }
            if (visible.length >= 5) break;
        }
        if (visible.length > 0) window.prefetchHomeBackgrounds(visible);
    }, 250);
}

function buildMyPageHash() {
    const q = window.location.hash.split('?')[1];
    return q ? `#/MyPage?${q}` : '#/MyPage';
}

function clearPress() {
    if (pressedEl) {
        pressedEl.classList.remove('touch');
        pressedEl = null;
    }
}

function setCurrentRow(bgId) {
    const rows = document.querySelectorAll('#BackgroundSet #scrollOuter .bgItem');
    rows.forEach((row) => {
        row.classList.toggle('current', row.dataset.bgId === bgId);
    });
}

function onPointerDown(e) {
    const el = e.target.closest('#BackgroundSet .bgItem, #BackgroundSet #mainBtn');
    if (!el) return;
    clearPress();
    pressedEl = el;
    el.classList.add('touch');
}

function onPointerUp() {
    clearPress();
}

async function handleSetClick() {
    const entry = selectedEntry || { ...DEFAULT_HOME_BG };
    saveHomeBgId(entry.id);
    if (typeof window.commitHomeBackground === 'function') {
        window.commitHomeBackground(entry);
    }
    try {
        const { openBgChangedPopup } = await import('./popups.js');
        openBgChangedPopup(entry.label, () => {
            window.location.hash = buildMyPageHash();
        });
    } catch (err) {
        console.error('[background-set] Confirmation popup failed:', err);
        window.location.hash = buildMyPageHash();
    }
}

function onClick(e) {
    const setBtn = e.target.closest('#BackgroundSet #mainBtn');
    if (setBtn) {
        e.preventDefault();
        e.stopPropagation();
        handleSetClick();
        return;
    }

    const row = e.target.closest('#BackgroundSet .bgItem');
    if (!row) return;
    e.preventDefault();
    e.stopPropagation();

    const bgId = row.dataset.bgId;
    const entry = entriesById.get(bgId);
    if (!entry) return;

    selectedEntry = entry;
    setCurrentRow(bgId);

    if (typeof window.previewHomeBackground === 'function') {
        window.previewHomeBackground(entry);
    }
}

function bindEvents() {
    if (bound) return;
    bound = true;
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('pointerup', onPointerUp, true);
    document.addEventListener('pointercancel', onPointerUp, true);
    document.addEventListener('click', onClick);
}

export async function initBackgroundSet() {
    const root = document.getElementById('BackgroundSet');
    const scrollInner = root?.querySelector('#scrollOuter .scrollInner');
    if (!root || !scrollInner) return;

    bindEvents();

    const list = await loadHomeBackgroundList();
    entriesById = new Map(list.map((entry) => [entry.id, entry]));

    const savedId = getSavedHomeBgId();
    selectedEntry = entriesById.get(savedId) || list[0] || { ...DEFAULT_HOME_BG };

    const frag = document.createDocumentFragment();
    for (const entry of list) {
        const row = document.createElement('div');
        row.className = 'commonFrame4 bgItem TE se_tabs' +
            (entry.bgm ? ' bgmIcon' : '') +
            (entry.id === selectedEntry.id ? ' current' : '');
        if (entry.isDefault) row.id = 'defaultBg';
        row.dataset.bgId = entry.id;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'bgName';
        nameSpan.textContent = entry.label;
        row.appendChild(nameSpan);

        frag.appendChild(row);
    }

    scrollInner.innerHTML = '';
    scrollInner.appendChild(frag);
    if (!scrollInner.dataset.prefetchBound) {
        scrollInner.dataset.prefetchBound = '1';
        scrollInner.addEventListener('scroll', scheduleVisiblePrefetch, { passive: true });
    }

    requestAnimationFrame(() => {
        const currentEl = scrollInner.querySelector('.bgItem.current');
        if (currentEl) {
            currentEl.scrollIntoView({ block: 'center' });
        }
        scheduleVisiblePrefetch();
    });
}

export function resetBackgroundSet() {
    clearPress();
    clearTimeout(prefetchTimer);
    prefetchTimer = null;
}
