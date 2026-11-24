// js/background-set.js — Home Background selection screen controller (#/BackgroundSet).

import {
    loadHomeBackgroundList,
    getSavedHomeBgId,
    saveHomeBgId,
    resolveSavedHomeBackground,
    DEFAULT_HOME_BG,
    DEFAULT_HOME_BG_FILE,
    DEFAULT_HOME_BGM_FILE
} from './home-bg.js';
import { state } from './viewer/model.js';
import { setAssetPreloadConnecting } from './viewer/model-assets.js';
import { changeBg, prefetchBg, setBgPortrait, setBgWebcamVideo } from './engine/bg.js';
import { startBgm, prefetchBgm, hasActiveBgmPlayer } from './engine/audio.js';
import {
    DEFAULT_CHARA_ID,
    BG_SET_X_OFFSET,
    setStageContext,
    setStageXOffset,
    applySubtitlePlacement,
    loadOutfitModels,
    destroyStageModels,
    getActiveModelEntries,
    setModelFadeAlpha,
    fadeModelTo,
    stopVoice
} from './engine/l2d-stage.js';

let bound = false;
let pressedEl = null;
let entriesById = new Map();
let selectedEntry = { ...DEFAULT_HOME_BG };
let committedHomeBg = null;
let prefetchTimer = null;
let bgSetActive = false;
let bgSetRequestToken = 0;
let bgPreviewToken = 0;

export function getCommittedHomeBg() {
    return committedHomeBg;
}

export function setCommittedHomeBg(entry) {
    if (entry) committedHomeBg = entry;
}

function resolveRequestedCharaId() {
    const hashQuery = window.location.hash.split('?')[1] || '';
    const hashId = new URLSearchParams(hashQuery).get('id');
    const searchId = new URLSearchParams(window.location.search).get('id');
    const raw = hashId || searchId || '';
    if (/^\d{4}$/.test(raw)) return Number(raw);
    try {
        const fav = localStorage.getItem('favoriteCharaId');
        if (fav && /^\d{4}$/.test(fav)) return Number(fav);
    } catch {}
    return DEFAULT_CHARA_ID;
}

function scheduleVisiblePrefetch() {
    clearTimeout(prefetchTimer);
    prefetchTimer = setTimeout(async () => {
        prefetchTimer = null;
        if (!bgSetActive) return;
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
        if (visible.length === 0) return;
        await prefetchBg(visible);
        for (const entry of visible) {
            if (!bgSetActive) return;
            if (entry.bgm) {
                await prefetchBgm(entry.bgmFile).catch(() => {});
            }
        }
    }, 250);
}

async function previewHomeBackground(entry) {
    if (!entry || !bgSetActive) return;
    const token = ++bgPreviewToken;
    try {
        await Promise.all([
            changeBg(entry, { visible: true, autoplay: true, crossfadeMs: 200 }),
            startBgm(entry.bgmFile, { autoplay: true }).catch((err) => {
                console.warn('[background-set] Preview BGM failed:', entry.bgmFile, err);
                if (!hasActiveBgmPlayer()) {
                    return startBgm(DEFAULT_HOME_BGM_FILE, { autoplay: true }).catch(() => {});
                }
            })
        ]);
    } catch (err) {
        if (token === bgPreviewToken) {
            console.error('[background-set] Preview background failed:', entry.id, err);
        }
    }
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
    setCommittedHomeBg(entry);
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
    previewHomeBackground(entry);
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

export async function enterBackgroundSet() {
    bgSetActive = true;
    const token = ++bgSetRequestToken;

    stopVoice();
    setBgWebcamVideo(null);
    setBgPortrait(false);
    setStageContext({ mode: 'bgSet' });
    setStageXOffset(BG_SET_X_OFFSET);
    if (typeof window.updateViewerViewport === 'function') {
        window.updateViewerViewport();
    }
    applySubtitlePlacement();

    const requestedId = resolveRequestedCharaId();
    state.currentCharacterId = requestedId;
    const live2dId = String(state.currentLive2dId ?? '00').padStart(2, '0');

    await initBackgroundSet();
    if (token !== bgSetRequestToken || !bgSetActive) return;

    const savedBg = committedHomeBg || await resolveSavedHomeBackground();
    if (token !== bgSetRequestToken || !bgSetActive) return;
    committedHomeBg = savedBg;

    setAssetPreloadConnecting(true);
    try {
        await Promise.all([
            changeBg(savedBg, { visible: true, autoplay: true, crossfadeMs: 200 }).catch((err) => {
                console.warn('[background-set] BG load failed, falling back to default:', err);
                return changeBg(`bg/web/${DEFAULT_HOME_BG_FILE}`, { visible: true, autoplay: true, crossfadeMs: 200 });
            }),
            startBgm(savedBg.bgmFile, { autoplay: true }).catch((err) => {
                console.warn('[background-set] BGM load failed, falling back to default:', err);
                return startBgm(DEFAULT_HOME_BGM_FILE, { autoplay: true }).catch(() => {});
            })
        ]);
        if (token !== bgSetRequestToken || !bgSetActive) return;

        destroyStageModels();
        const loadedOk = await loadOutfitModels(requestedId, live2dId, undefined, null, null, null, { startHidden: true });
        if (!loadedOk || token !== bgSetRequestToken || !bgSetActive) {
            if (!bgSetActive) destroyStageModels();
            return;
        }

        getActiveModelEntries().forEach((m) => {
            m.visible = true;
            setModelFadeAlpha(m, 0);
            fadeModelTo(m, 250, 1);
        });
    } finally {
        setAssetPreloadConnecting(false);
        document.body.classList.remove('connecting');
    }
}

export function leaveBackgroundSet() {
    bgSetActive = false;
    bgSetRequestToken++;
    bgPreviewToken++;
    resetBackgroundSet();
    destroyStageModels();
}
