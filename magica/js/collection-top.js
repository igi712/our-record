// js/collection-top.js — Archive hub (#/CollectionTop) controller

import { state } from './viewer/model.js';
import { repoUrl } from './paths.js';
import { changeBg, preloadBg, setBgPortrait, setBgWebcamVideo } from './engine/bg.js';
import { startBgm } from './engine/audio.js';
import {
    COLLECTION_TOP_X_OFFSET,
    setStageContext,
    setStageXOffset,
    applySubtitlePlacement,
    loadOutfitModels,
    destroyStageModels,
    clearStageModels,
    getActiveModelEntries,
    setModelFadeAlpha,
    fadeModelTo,
    stopVoice
} from './engine/l2d-stage.js';

const CHARA_CARDS_URL = repoUrl('assets/charaCards.json');
const ARCHIVE_BG = 'bg/web/web_0015.ExportJson';
const ARCHIVE_BGM = 'bgm02_anime11_hca.hca';

let cardsCache = null;
let lastRandomCharaId = null;
let activeController = null;
let collectionTopActive = false;
let collectionTopRequestToken = 0;

async function loadOwnedCharaCards() {
    if (cardsCache) return cardsCache;
    const resp = await fetch(CHARA_CARDS_URL);
    if (!resp.ok) throw new Error(`Failed to fetch ${CHARA_CARDS_URL}: ${resp.status}`);
    cardsCache = await resp.json();
    return cardsCache;
}

function pickRandomOwnedCharaId(cards) {
    if (!Array.isArray(cards) || cards.length === 0) return 1001;
    let pool = cards;
    if (cards.length > 1 && lastRandomCharaId != null) {
        const filtered = cards.filter((c) => Number(c.charaId) !== Number(lastRandomCharaId));
        if (filtered.length > 0) pool = filtered;
    }
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    const id = Number(chosen?.charaId) || 1001;
    lastRandomCharaId = id;
    return id;
}

function setupCollectionTopView() {
    resetCollectionTop();
    activeController = new AbortController();
    const { signal } = activeController;

    const root = document.getElementById('CollectionTop');
    if (!root) return;

    root.addEventListener('pointerdown', (e) => {
        const btn = e.target.closest('#CollectionTop .collectionBtn');
        if (btn) btn.classList.add('touch');
    }, { signal });

    const clearTouch = () => {
        root.querySelectorAll('.touch').forEach((el) => el.classList.remove('touch'));
    };
    window.addEventListener('pointerup', clearTouch, { signal });
    window.addEventListener('pointercancel', clearTouch, { signal });

    root.addEventListener('click', (e) => {
        const charaBtn = e.target.closest('#CollectionTop .charaBtn');
        if (charaBtn) {
            e.preventDefault();
            window.location.hash = '#/CharaCollection';
            return;
        }
        const otherBtn = e.target.closest('#CollectionTop .collectionBtn');
        if (otherBtn) {
            e.preventDefault();
        }
    }, { signal });
}

export function resetCollectionTop() {
    if (activeController) {
        activeController.abort();
        activeController = null;
    }
}

export async function enterCollectionTop({ onBeforeReveal, hadLive2d = false } = {}) {
    collectionTopActive = true;
    const token = ++collectionTopRequestToken;

    const step1Start = performance.now();
    const [cards] = await Promise.all([
        loadOwnedCharaCards().catch((e) => {
            console.warn('[collection-top] charaCards load failed:', e);
            return [];
        }),
        preloadBg(ARCHIVE_BG).catch((e) => console.warn('[collection-top] BG preload error:', e)),
        startBgm(ARCHIVE_BGM, { autoplay: true }).catch((e) => console.warn('[collection-top] BGM error:', e))
    ]);
    if (token !== collectionTopRequestToken || !collectionTopActive) return;

    const elapsed = performance.now() - step1Start;
    if (elapsed < 200) {
        await new Promise((r) => setTimeout(r, 200 - elapsed));
    }
    if (token !== collectionTopRequestToken || !collectionTopActive) return;

    document.getElementById('ui-layer')?.classList.remove('home-mode', 'menu-closed');
    setBgWebcamVideo(null);
    setBgPortrait(false);

    document.body.classList.remove('connecting');
    clearStageModels();
    await changeBg(ARCHIVE_BG, { visible: true, autoplay: true, crossfadeMs: 250, waitForCrossfade: true }).catch((e) =>
        console.warn('[collection-top] BG load error:', e)
    );
    if (token !== collectionTopRequestToken || !collectionTopActive) return;

    setStageContext({ mode: 'collectionTop' });
    setStageXOffset(COLLECTION_TOP_X_OFFSET);
    if (typeof window.updateViewerViewport === 'function') {
        window.updateViewerViewport();
    }
    applySubtitlePlacement();

    setupCollectionTopView();
    if (typeof onBeforeReveal === 'function') {
        onBeforeReveal();
    }

    const charaId = pickRandomOwnedCharaId(cards);
    state.currentCharacterId = charaId;
    state.currentLive2dId = '00';

    try {
        const loadedOk = await loadOutfitModels(charaId, '00', undefined, null, null, null, {
            startHidden: true,
            showConnecting: false
        });
        if (!loadedOk || token !== collectionTopRequestToken || !collectionTopActive) {
            if (!collectionTopActive) destroyStageModels();
            return;
        }

        getActiveModelEntries().forEach((m) => {
            m.visible = true;
            setModelFadeAlpha(m, 0);
            fadeModelTo(m, 250, 1);
        });
    } catch (e) {
        console.warn('[collection-top] Random Live2D load failed:', e);
    }
}

export function leaveCollectionTop({ keepStage = false } = {}) {
    collectionTopActive = false;
    collectionTopRequestToken++;
    resetCollectionTop();
    if (!keepStage) {
        stopVoice();
        destroyStageModels();
    }
}
