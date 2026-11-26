// js/mypage.js — MyPage homescreen controller (#/MyPage)

import { state, resolveMaReAssetsBase } from './viewer/model.js';
import { preloadModelToRam, setAssetPreloadConnecting, ramFolderCache } from './viewer/model-assets.js';
import { preloadScenarioVoices, scenarioCache } from './viewer/quotes-sequence.js';
import { fetchScenarioJson } from './viewer/model-scenario.js';
import { magicaUrl } from './paths.js';
import { resolveSavedHomeBackground, DEFAULT_HOME_BG_FILE, DEFAULT_HOME_BGM_FILE } from './home-bg.js';
import { revealHomeMenu } from './home-menu.js';
import { getFavoriteCharaId } from './chara-top.js';
import { setCommittedHomeBg } from './background-set.js';
import { changeBg, preloadBg, showBg, hasVisibleBg, setBgPortrait, setBgWebcamVideo } from './engine/bg.js';
import {
    startBgm,
    playPreparedBgm,
    isBgmUnlocked,
    waitForBgmUnlock,
    startSe
} from './engine/audio.js';
import { setTapEffectSuppressed } from './engine/common-events.js';
import {
    DEFAULT_CHARA_ID,
    HOME_X_OFFSET,
    setStageContext,
    setStageXOffset,
    applySubtitlePlacement,
    applyPortraitModelTransform,
    setModelFadeAlpha,
    fadeModelTo,
    cancelModelFades,
    ensureMetadataLoaded,
    getHomeOutfits,
    loadOutfitModels,
    loadScenarioForOutfit,
    performOutfitSwap,
    cancelOutfitChanges,
    bumpOutfitChangeToken,
    getOutfitChangeToken,
    getActiveScenario,
    getScenarioPlayer,
    getActiveModelEntries,
    stopVoice,
    resumeVoiceAudio,
    destroyStageModels,
    clearStageModels
} from './engine/l2d-stage.js';

export const MYPAGE_DEMO = {
    presentCount: 10,
    banners: [
        magicaUrl('resource/image_web/banner/announce/banner_0705_m.png'),
        magicaUrl('resource/image_web/banner/announce/banner_0737_m.png'),
        magicaUrl('resource/image_web/banner/announce/banner_0742_m.png'),
        magicaUrl('resource/image_web/banner/announce/banner_0747_m.png'),
        magicaUrl('resource/image_web/banner/announce/banner_0750_m.png')
    ],
    eventEndAt: '12/4まで'
};

const COLUMN_OVERLAY = '#MyPage #favoriteChara .tapArea, #MyPage #etcMenu span.se_decide, #MyPage #live2dMenu span.se_decide';
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
        return !path.endsWith('/magica/index.html') && (path === '' || path.endsWith('/index.html'));
    } catch {
        return false;
    }
})();

let bound = false;
let outfitWired = false;
let stageInteractionsWired = false;
let pressedEl = null;
let bannerActive = false;
let bannerIndex = 0;
let bannerLength = 0;
let portraitActive = false;
let portraitRequest = 0;
let uiHidden = false;
let uiHideRestoreTimer = null;
let uiHideDisplayState = null;
let live2dMenuRevealTimer = null;

let homeActive = false;
let homeReady = false;
let homeRevealed = false;
let homeNeedsRespawn = false;
let homeLoadedCharaId = null;
let homePendingCharaId = null;
let homeLive2dId = '00';
let homeLoadPromise = null;
let homeGeneration = 0;
let homeRequestToken = 0;
let homeTapVoicePool = [...HOME_TAP_VOICE_IDS];

let wearOpenedWithMenuOpen = true;
let mypageOutfitBusy = false;
let live2dHoldTimer = null;
let live2dTimerFired = false;
let menuChoreId = 0;
let menuChoreTimers = [];
let homeMenuSpawnToken = 0;
let measureTextCtx = null;

function fillDemoData() {
    const present = document.getElementById('present');
    if (present && MYPAGE_DEMO.presentCount > 0) present.classList.add('anim');

    const badge = document.getElementById('presentBadge');
    if (badge) badge.textContent = String(MYPAGE_DEMO.presentCount);

    renderBanner();

    const eventDeadline = document.querySelector('.endAtText');
    if (eventDeadline) {
        eventDeadline.textContent = String(MYPAGE_DEMO.eventEndAt);
    }
}

function renderBanner() {
    const banner = document.getElementById('mypageBanner');
    if (!banner) return;
    banner.innerHTML = '';

    bannerLength = MYPAGE_DEMO.banners.length;
    bannerIndex = 0;
    bannerActive = false;

    MYPAGE_DEMO.banners.forEach((src) => {
        const img = document.createElement('img');
        img.className = 'mypageBanner';
        img.src = src;
        img.alt = '';
        banner.appendChild(img);
    });

    if (bannerLength === 0) return;

    const indicatorWrap = document.createElement('div');
    indicatorWrap.id = 'indicatorWrap';
    for (let i = 0; i < bannerLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'indiIcon' + (i === 0 ? ' on' : '');
        indicatorWrap.appendChild(dot);
    }
    banner.appendChild(indicatorWrap);
}

export function startBannerCarousel() {
    if (bannerActive) return;
    const banner = document.getElementById('mypageBanner');
    const imgs = banner ? banner.querySelectorAll('img.mypageBanner') : [];
    const img = imgs[bannerIndex];
    if (!img) return;
    img.classList.add('show');
    bannerActive = bannerLength > 1;
}

function setDot(index, on) {
    const banner = document.getElementById('mypageBanner');
    if (!banner) return;
    const dots = banner.querySelectorAll('#indicatorWrap .indiIcon');
    if (!dots[index]) return;
    dots[index].classList.toggle('on', on);
}

function onBannerAnimationEnd(e) {
    if (!bannerActive || bannerLength < 2) return;
    const img = e.target;
    if (!img.classList || !img.classList.contains('mypageBanner')) return;

    const classes = img.classList;
    if (classes.contains('show') || classes.contains('showRevers')) {
        classes.remove('show', 'showRevers');
        classes.add('showing');
    } else if (classes.contains('showing')) {
        classes.remove('showing');
        classes.add('hide');
        setDot(bannerIndex, false);
        bannerIndex = (bannerIndex + 1) % bannerLength;
        setDot(bannerIndex, true);
        const banner = document.getElementById('mypageBanner');
        const imgs = banner ? banner.querySelectorAll('img.mypageBanner') : [];
        if (imgs[bannerIndex]) imgs[bannerIndex].classList.add('show');
    } else if (classes.contains('hide')) {
        classes.remove('hide');
    } else if (classes.contains('hideRevers')) {
        classes.remove('hideRevers');
    }
}

export function mypageMenuShow() {
    const myPage = document.getElementById('MyPage');
    if (!myPage) return;
    myPage.classList.remove('menuHide');
    myPage.classList.add('menuShow');

    const live2dMenu = document.getElementById('live2dMenu');
    clearTimeout(live2dMenuRevealTimer);
    if (live2dMenu) live2dMenu.classList.remove('show');

    const status = document.querySelector('#globalMenu .user #status');
    if (status) {
        status.classList.remove('myPageHide');
        status.classList.add('myPageShow');
    }

    const banner = document.getElementById('mypageBanner');
    if (banner) banner.classList.remove('hide');

    startBannerCarousel();
}

export function mypageMenuHide() {
    const myPage = document.getElementById('MyPage');
    if (!myPage) return;
    myPage.classList.remove('menuShow');
    myPage.classList.add('menuHide');

    if (!uiHidden) {
        const live2dMenu = document.getElementById('live2dMenu');
        if (live2dMenu) {
            clearTimeout(live2dMenuRevealTimer);
            live2dMenuRevealTimer = setTimeout(() => {
                live2dMenu.classList.add('show');
                live2dMenuRevealTimer = null;
            }, 700);
        }
    }

    const status = document.querySelector('#globalMenu .user #status');
    if (status) {
        status.classList.remove('myPageShow');
        status.classList.add('myPageHide');
    }

    const banner = document.getElementById('mypageBanner');
    if (banner) banner.classList.add('hide');
}

function clearPress() {
    if (pressedEl) {
        pressedEl.classList.remove('touch');
        pressedEl = null;
    }
}

function setUiHiddenDisplay(hidden) {
    const menu = document.getElementById('menu');
    const live2dMenu = document.getElementById('live2dMenu');
    if (!menu || !live2dMenu) return;

    if (hidden) {
        uiHideDisplayState = {
            menu: portraitActive ? '' : menu.style.display,
            live2dMenu: live2dMenu.style.display
        };
        menu.style.display = 'none';
        live2dMenu.style.display = 'none';
        return;
    }

    const displayState = uiHideDisplayState || { menu: '', live2dMenu: '' };
    menu.style.display = portraitActive ? 'none' : displayState.menu;
    live2dMenu.style.display = displayState.live2dMenu;
    uiHideDisplayState = null;
}

function clearUiHideRestoreTimer() {
    if (uiHideRestoreTimer) {
        clearTimeout(uiHideRestoreTimer);
        uiHideRestoreTimer = null;
    }
}

function restoreHiddenUi() {
    clearUiHideRestoreTimer();
    if (!uiHidden) return;
    uiHidden = false;
    setTapEffectSuppressed(false);
    startSe(1008);
    setUiHiddenDisplay(false);
}

function onUiHideLongPressStart(e) {
    if (!uiHidden || !e.isPrimary) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    clearUiHideRestoreTimer();
    uiHideRestoreTimer = setTimeout(restoreHiddenUi, 800);
}

function onUiHideLongPressEnd(e) {
    if (!uiHidden || !e.isPrimary) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    clearUiHideRestoreTimer();
}

async function showUiHidePrompt() {
    if (uiHidden) return;
    try {
        const module = await import('./popups.js');
        if (module && typeof module.openUiHidePopup === 'function') {
            module.openUiHidePopup({
                portrait: portraitActive,
                onConfirm: confirmUiHide
            });
        }
    } catch (err) {
        console.error('[mypage] UiHidePopup open failed:', err);
    }
}

function confirmUiHide() {
    uiHidden = true;
    setTapEffectSuppressed(true);
    setUiHiddenDisplay(true);
}

function applyPortraitDomClasses(active) {
    document.getElementById('MyPage')?.classList.toggle('portrait', active);
    document.getElementById('live2dMenu')?.classList.toggle('portrait', active);
    document.getElementById('wearWrap')?.classList.toggle('portrait', active);
    document.querySelector('#MyPage .live2dArea')?.classList.toggle('portrait', active);
    const menu = document.getElementById('menu');
    if (menu && !uiHidden) {
        menu.style.display = active ? 'none' : '';
    }
}

function cancelMenuChoreography({ keepModelFades = false } = {}) {
    menuChoreTimers.forEach((timer) => clearTimeout(timer));
    menuChoreTimers = [];
    menuChoreId++;
    if (!keepModelFades) cancelModelFades();
}

function choreTimer(ms, fn) {
    const id = menuChoreId;
    const timer = setTimeout(() => {
        menuChoreTimers = menuChoreTimers.filter((t) => t !== timer);
        if (id !== menuChoreId) return;
        fn();
    }, ms);
    menuChoreTimers.push(timer);
}

async function respawnHomeModel() {
    const token = ++homeMenuSpawnToken;
    const live2dId = String(state.currentLive2dId ?? '00').padStart(2, '0');
    const charaId = state.currentCharacterId || DEFAULT_CHARA_ID;

    destroyStageModels();
    try {
        await loadOutfitModels(charaId, live2dId, undefined);
        if (token !== homeMenuSpawnToken || !homeActive) {
            destroyStageModels();
            return;
        }
        getActiveModelEntries().forEach((m) => { m.visible = true; });
        await loadScenarioForOutfit(charaId, live2dId);
    } catch (e) {
        console.warn('[mypage] Home menu model respawn failed:', e);
    }
}

export function onMyPageMenuChoreography(open) {
    cancelMenuChoreography();
    const uiLayer = document.getElementById('ui-layer');
    if (uiLayer) uiLayer.classList.toggle('menu-closed', !open);

    setStageContext({ menuClosed: !open });
    setStageXOffset(open ? HOME_X_OFFSET : 0);
    applySubtitlePlacement();

    if (!state.currentModel) return;
    stopVoice();
    cancelOutfitChanges();
    respawnHomeModel();
}

async function setMyPagePortraitMode(enabled, { silent = false } = {}) {
    const portrait = Boolean(enabled);
    if (portrait && !window.location.hash.startsWith('#/MyPage')) return false;

    cancelMenuChoreography();
    stopVoice();
    cancelOutfitChanges();

    const sideMenu = document.getElementById('sideMenu');
    const xOffset = portrait ? 0 : (sideMenu?.classList.contains('anim') ? HOME_X_OFFSET : 0);

    setStageContext({ mode: 'home', portrait });
    setStageXOffset(xOffset);
    setBgPortrait(portrait);
    applySubtitlePlacement();

    if (silent || !homeActive || !homeReady || !state.currentModel) return true;
    await respawnHomeModel();
    return true;
}

async function togglePortrait() {
    const request = ++portraitRequest;
    const next = !portraitActive;
    const accepted = await setMyPagePortraitMode(next);
    if (request !== portraitRequest || accepted === false) return;

    portraitActive = next;
    applyPortraitDomClasses(portraitActive);
}

function resolveRequestedCharaId() {
    const hashQuery = window.location.hash.split('?')[1] || '';
    const hashId = new URLSearchParams(hashQuery).get('id');
    const searchId = new URLSearchParams(window.location.search).get('id');
    const raw = hashId || searchId || '';
    return /^\d{4}$/.test(raw) ? Number(raw) : getFavoriteCharaId();
}

function myPageCurrentOutfitIndex() {
    const outfits = getHomeOutfits(state.currentCharacterId || DEFAULT_CHARA_ID);
    const current = String(state.currentLive2dId || '00').padStart(2, '0');
    const index = outfits.findIndex((o) => String(o.live2dId).padStart(2, '0') === current);
    return index >= 0 ? index : 0;
}

function syncMyPageOutfitUI() {
    const btn = document.getElementById('live2dBtn');
    if (btn) {
        btn.classList.toggle('off', getHomeOutfits(state.currentCharacterId || DEFAULT_CHARA_ID).length < 2);
    }

    const current = String(state.currentLive2dId || '00').padStart(2, '0');
    document.querySelectorAll('#MyPage #mypageWearScrollOuter .wrap').forEach((row) => {
        const id = String(row.dataset.live2dId || '').padStart(2, '0');
        row.classList.toggle('current', id === current);
    });
}

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

    const outfits = getHomeOutfits(state.currentCharacterId || DEFAULT_CHARA_ID);
    if (outfits.length === 0) return;

    outfits.forEach((outfit) => {
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

function setWearWrapChrome(hidden) {
    ['globalMenu', 'sideMenu'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.style.display = hidden ? 'none' : '';
    });
}

function toggleWearWrap() {
    const wearWrap = document.querySelector('#MyPage #wearWrap');
    const myPage = document.getElementById('MyPage');
    if (!wearWrap) return;

    if (wearWrap.classList.contains('off')) {
        wearOpenedWithMenuOpen = document.getElementById('sideMenu')?.classList.contains('anim') ?? false;
        wearWrap.classList.remove('off');
        myPage?.classList.add('wearing');
        setWearWrapChrome(true);
        buildWearRows();
    } else {
        wearWrap.classList.add('off');
        myPage?.classList.remove('wearing');
        setWearWrapChrome(false);
        const sideMenu = document.getElementById('sideMenu');
        if (portraitActive) {
            const menu = document.getElementById('menu');
            if (menu) menu.style.display = 'none';
            document.getElementById('live2dMenu')?.classList.add('show');
        } else if (wearOpenedWithMenuOpen) {
            if (sideMenu) {
                sideMenu.classList.remove('close');
                sideMenu.classList.add('anim');
            }
            onMyPageMenuChoreography(true);
            startBannerCarousel();
        } else {
            if (sideMenu) {
                sideMenu.classList.remove('anim');
                sideMenu.classList.add('close');
            }
            document.getElementById('live2dMenu')?.classList.add('show');
        }
    }
}

async function swapMyPageOutfit(live2dIdRaw) {
    const live2dId = String(live2dIdRaw).padStart(2, '0');
    if (String(state.currentLive2dId || '00').padStart(2, '0') === live2dId) return false;
    if (mypageOutfitBusy) return false;
    mypageOutfitBusy = true;

    const charaId = state.currentCharacterId || DEFAULT_CHARA_ID;
    const token = bumpOutfitChangeToken();
    const previousLive2dId = state.currentLive2dId;
    state.currentLive2dId = live2dId;

    const btn = document.getElementById('live2dBtn');
    btn?.classList.add('block');
    const wearWrap = document.querySelector('#MyPage #wearWrap');
    wearWrap?.classList.add('block');

    try {
        let loadedOk = false;
        try {
            loadedOk = await performOutfitSwap(charaId, live2dId, {
                token,
                vfxDefaultX: 512,
                skipVfxIfDual: true
            });
        } catch (err) {
            console.error('[mypage] MyPage outfit load failed:', err);
        }

        if (token !== getOutfitChangeToken()) return false;
        if (!loadedOk) {
            console.warn(`[mypage] MyPage outfit ${live2dId} failed to load; reverting to ${previousLive2dId}`);
            state.currentLive2dId = previousLive2dId;
            syncMyPageOutfitUI();
            return false;
        }

        if (homeActive) homeLive2dId = live2dId;
        syncMyPageOutfitUI();
        return true;
    } finally {
        btn?.classList.remove('block');
        wearWrap?.classList.remove('block');
        mypageOutfitBusy = false;
    }
}

function cycleMyPageOutfit() {
    const outfits = getHomeOutfits(state.currentCharacterId || DEFAULT_CHARA_ID);
    if (outfits.length < 2) return;
    const nextIndex = (myPageCurrentOutfitIndex() + 1) % outfits.length;
    swapMyPageOutfit(outfits[nextIndex].live2dId);
}

function initMyPageOutfitWiring() {
    if (outfitWired) return;
    outfitWired = true;

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

    document.addEventListener('pointerdown', (e) => {
        const el = e.target.closest('#MyPage #wearWrap .wrap, #MyPage #wearWrap #wearDecide');
        if (el) el.classList.add('touch');
    }, true);
    document.addEventListener('pointerup', () => {
        document.querySelectorAll('#MyPage #wearWrap .touch').forEach((el) => el.classList.remove('touch'));
    }, true);
    document.addEventListener('pointercancel', () => {
        document.querySelectorAll('#MyPage #wearWrap .touch').forEach((el) => el.classList.remove('touch'));
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
            document.querySelectorAll('#MyPage #mypageWearScrollOuter .wrap').forEach((r) => r.classList.remove('current'));
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
    img.removeAttribute('src');
    img.style.display = 'none';

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
        } catch {}
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

function collectHomeScenarioResources(scenarioJson) {
    const allowedExpressions = new Set();
    const allowedMotions = new Set();
    const allowedVoices = new Set();

    if (scenarioJson?.story) {
        Object.values(scenarioJson.story).forEach((steps) => {
            if (!Array.isArray(steps)) return;
            steps.forEach((step) => {
                if (!Array.isArray(step.chara)) return;
                step.chara.forEach((chara) => {
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
    const { activeVoicePrefix } = getActiveScenario();
    const prefix = activeVoicePrefix || '00';
    return `vo_char_${state.currentCharacterId}_${prefix}_${String(voiceId).padStart(2, '0')}`;
}

async function playHomeVoice(voiceId) {
    const { activeScenarioUrl } = getActiveScenario();
    if (!homeActive || !activeScenarioUrl) return;
    const seqPlayer = getScenarioPlayer();
    seqPlayer.controller = state.currentController;
    return seqPlayer.loadAndPlayVoice(activeScenarioUrl, homeVoiceKey(voiceId), state.currentCharacterId);
}

function chooseHomeLoginVoice() {
    let firstLogin = false;
    try {
        firstLogin = !sessionStorage.getItem(HOME_LOGIN_SESSION_KEY);
        if (firstLogin) sessionStorage.setItem(HOME_LOGIN_SESSION_KEY, '1');
    } catch {
        firstLogin = false;
    }

    if (firstLogin) return 24;

    const category = Math.floor(Math.random() * 4);
    if (category === 1) return 29;
    if (category === 2) return 30;
    if (category === 3) return 31;

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

async function preloadOpenSansFont() {
    if (!document.fonts?.load) return;
    try {
        await document.fonts.load('600 19px "Open Sans"');
    } catch (error) {
        console.warn('[mypage] Open Sans preload failed; continuing with fallback font.', error);
    }
}

async function revealHomeScreen() {
    if (!homeActive || !homeReady || homeRevealed) return;
    homeRevealed = true;

    try {
        playPreparedBgm();
        resumeVoiceAudio();
    } catch (e) {
        console.warn('[mypage] Home audio unlock failed:', e);
    }

    showBg();
    document.body.classList.remove('connecting');

    choreTimer(120, () => {
        startBannerCarousel();
    });
    choreTimer(550, () => {
        const targets = getActiveModelEntries();
        if (targets.length === 0) return;
        targets.forEach((m) => {
            m.visible = true;
            setModelFadeAlpha(m, 0);
            fadeModelTo(m, 250, 1);
        });
        playHomeVoice(chooseHomeLoginVoice()).catch((e) => {
            console.warn('[mypage] Home login voice failed:', e);
        });
    });
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

function setupHomeStageInteractions() {
    if (stageInteractionsWired) return;
    stageInteractionsWired = true;

    window.addEventListener('pointerdown', (event) => {
        if (!homeActive || !isInsideHomeViewport(event)) return;

        if (!homeRevealed) {
            if (homeReady) revealHomeScreen();
            return;
        }

        const uiRootSelector = [
            '#etcMenu', '#live2dMenu', '#favoriteChara', '#mypageBanner',
            '#wearWrap', '#mypageWearScrollOuter', '#globalMenu', '#sideMenu',
            '#popupArea', '#status', '#globalBackBtn', '#cardDetail', '#CharaCollection'
        ].join(', ');
        if (event.target?.closest?.(uiRootSelector)) return;

        const interaction = window.app?.renderer?.plugins?.interaction;
        const m = state.currentModel;
        if (!interaction || !m || typeof interaction.mapPositionToPoint !== 'function') return;
        const pt = new PIXI.Point();
        interaction.mapPositionToPoint(pt, event.clientX, event.clientY);
        let hit = false;
        try {
            hit = getActiveModelEntries().some((model) => model.containsPoint(pt));
        } catch {
            hit = false;
        }
        if (!hit) return;

        playHomeVoice(pickHomeTapVoice()).catch((e) => {
            console.warn('[mypage] Home tap voice failed:', e);
        });
    }, true);

    window.addEventListener('keydown', () => {
        if (homeActive && homeReady && !homeRevealed) revealHomeScreen();
    });

    window.addEventListener('mrv2:viewportChange', () => {
        if (portraitActive && homeActive) {
            if (state.dualMode) {
                applyPortraitModelTransform(state.primaryModel || state.currentModel, 0, true);
                applyPortraitModelTransform(state.secondaryModel, 1, true);
            } else {
                applyPortraitModelTransform(state.currentModel, 0, false);
            }
        }
    });
}

function onPointerDown(e) {
    if (uiHidden) {
        onUiHideLongPressStart(e);
        return;
    }
    const el = e.target.closest(COLUMN_OVERLAY);
    if (!el) return;
    clearPress();
    pressedEl = el;
    el.classList.add('touch');
}

function onPointerUp(e) {
    if (uiHidden) {
        onUiHideLongPressEnd(e);
        return;
    }
    clearPress();
}

async function openEtcPopup() {
    try {
        const module = await import('./popups.js');
        if (module && typeof module.openEtcPopup === 'function') {
            module.openEtcPopup();
        }
    } catch (err) {
        console.error('[mypage] EtcPopup open failed:', err);
    }
}

async function openProfilePopup() {
    try {
        const module = await import('./popups.js');
        if (module && typeof module.openProfilePopup === 'function') {
            const charaId = state.currentCharacterId || resolveRequestedCharaId();
            module.openProfilePopup({
                charaId,
                onChangeBackground: () => {
                    const q = window.location.hash.split('?')[1];
                    window.location.hash = q ? `#/BackgroundSet?${q}` : '#/BackgroundSet';
                },
                onChangeFavorite: () => {
                    window.location.hash = `#/CharaListTop?id=${charaId}`;
                }
            });
        }
    } catch (err) {
        console.error('[mypage] ProfilePopup open failed:', err);
    }
}

function onClick(e) {
    const cameraButton = e.target.closest('#cameraLinkBtn');
    if (cameraButton && !uiHidden) {
        e.preventDefault();
        e.stopPropagation();
        const q = window.location.hash.split('?')[1];
        window.location.hash = q ? `#/CameraTop?${q}` : '#/CameraTop';
        return;
    }

    const portraitButton = e.target.closest('#portraitBtn');
    if (portraitButton && !uiHidden) {
        e.preventDefault();
        e.stopPropagation();
        togglePortrait();
        return;
    }

    const uiHideButton = e.target.closest('#uiHideBtn');
    if (uiHideButton && !uiHidden) {
        e.preventDefault();
        e.stopPropagation();
        showUiHidePrompt();
        return;
    }

    const favoriteBtn = e.target.closest('#favoriteChara');
    if (favoriteBtn && !uiHidden) {
        e.preventDefault();
        e.stopPropagation();
        openProfilePopup();
        return;
    }

    if (!e.target.closest('#config')) return;
    e.preventDefault();
    e.stopPropagation();
    openEtcPopup();
}

function bindEvents() {
    if (bound) return;
    bound = true;
    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('pointerup', onPointerUp, true);
    window.addEventListener('pointercancel', onPointerUp, true);
    document.addEventListener('click', onClick);
    document.addEventListener('animationend', onBannerAnimationEnd);
}

export function initMyPage() {
    const myPage = document.getElementById('MyPage');
    if (!myPage) return;

    fillDemoData();
    bindEvents();
    setupHomeStageInteractions();
}

export function resetMyPage({ keepStage = false } = {}) {
    clearPress();
    bannerActive = false;
    portraitRequest++;
    if (live2dMenuRevealTimer) {
        clearTimeout(live2dMenuRevealTimer);
        live2dMenuRevealTimer = null;
    }
    clearUiHideRestoreTimer();
    if (uiHidden) {
        uiHidden = false;
        setTapEffectSuppressed(false);
        setUiHiddenDisplay(false);
    }
    if (portraitActive) {
        portraitActive = false;
        applyPortraitDomClasses(false);
        if (!keepStage) {
            setMyPagePortraitMode(false, { silent: true });
        }
    }
    document.getElementById('live2dMenu')?.classList.remove('show');
    document.getElementById('MyPage')?.classList.remove('menuHide', 'menuShow', 'wearing', 'reveal');
    document.querySelector('#globalMenu .user #status')?.classList.remove('myPageHide', 'myPageShow');
}

export async function enterMyPage({ onBeforeReveal, hasStageToUnload = false } = {}) {
    const requestToken = ++homeRequestToken;
    const generation = ++homeGeneration;

    const requestedId = resolveRequestedCharaId();
    const sameLoadedChara = homeLoadedCharaId != null && homeLoadedCharaId === requestedId;
    if (!sameLoadedChara) {
        homeTapVoicePool = [...HOME_TAP_VOICE_IDS];
        homeLive2dId = '00';
        homeReady = false;
        homeLoadedCharaId = null;
    }

    homeActive = true;
    homeRevealed = false;
    homeNeedsRespawn = false;
    homePendingCharaId = requestedId;
    document.body.classList.add('connecting');

    const loadTask = (async () => {
        const savedBg = await resolveSavedHomeBackground();
        if (requestToken !== homeRequestToken || !homeActive || generation !== homeGeneration) return;
        setCommittedHomeBg(savedBg);

        const hasExistingBg = hasVisibleBg();
        if (hasStageToUnload) {
            const step1Start = performance.now();
            let bgTarget = savedBg;
            await Promise.all([
                preloadBg(savedBg).catch((err) => {
                    console.warn('[mypage] Saved home background preload failed, falling back to default:', err);
                    bgTarget = `bg/web/${DEFAULT_HOME_BG_FILE}`;
                    return preloadBg(bgTarget).catch(() => {});
                }),
                startBgm(savedBg.bgmFile, { autoplay: hasExistingBg }).catch((err) => {
                    console.warn('[mypage] Saved home BGM failed, falling back to default:', err);
                    return startBgm(DEFAULT_HOME_BGM_FILE, { autoplay: hasExistingBg }).catch(() => {});
                })
            ]);
            if (requestToken !== homeRequestToken || !homeActive || generation !== homeGeneration) return;

            const elapsed = performance.now() - step1Start;
            if (elapsed < 200) {
                await new Promise((r) => setTimeout(r, 200 - elapsed));
            }
            if (requestToken !== homeRequestToken || !homeActive || generation !== homeGeneration) return;

            clearStageModels();
            await changeBg(bgTarget, {
                visible: true,
                autoplay: hasExistingBg,
                crossfadeMs: hasExistingBg ? 250 : 0,
                waitForCrossfade: hasExistingBg
            }).catch((err) => {
                console.warn('[mypage] Saved home background failed, falling back to default:', err);
                return changeBg(`bg/web/${DEFAULT_HOME_BG_FILE}`, {
                    visible: true,
                    autoplay: hasExistingBg,
                    crossfadeMs: hasExistingBg ? 250 : 0,
                    waitForCrossfade: hasExistingBg
                });
            });
        } else {
            await Promise.all([
                changeBg(savedBg, {
                    visible: true,
                    autoplay: hasExistingBg,
                    crossfadeMs: hasExistingBg ? 250 : 0,
                    waitForCrossfade: hasExistingBg
                }).catch((err) => {
                    console.warn('[mypage] Saved home background failed, falling back to default:', err);
                    return changeBg(`bg/web/${DEFAULT_HOME_BG_FILE}`, {
                        visible: true,
                        autoplay: hasExistingBg,
                        crossfadeMs: hasExistingBg ? 250 : 0,
                        waitForCrossfade: hasExistingBg
                    });
                }),
                startBgm(savedBg.bgmFile, { autoplay: hasExistingBg }).catch((err) => {
                    console.warn('[mypage] Saved home BGM failed, falling back to default:', err);
                    return startBgm(DEFAULT_HOME_BGM_FILE, { autoplay: hasExistingBg }).catch(() => {});
                })
            ]);
        }
        if (requestToken !== homeRequestToken || !homeActive || generation !== homeGeneration) return;

        setBgWebcamVideo(null);
        setBgPortrait(false);
        setStageContext({ mode: 'home', menuClosed: false, portrait: false });
        setStageXOffset(HOME_X_OFFSET);
        if (typeof window.updateViewerViewport === 'function') {
            window.updateViewerViewport();
        }
        applySubtitlePlacement();

        const uiLayer = document.getElementById('ui-layer');
        uiLayer?.classList.add('home-mode');
        uiLayer?.classList.remove('menu-closed');

        const live2dId = String(homeLive2dId || '00').padStart(2, '0');
        state.currentCharacterId = requestedId;
        state.currentLive2dId = live2dId;

        if (typeof onBeforeReveal === 'function') {
            onBeforeReveal();
        }

        initMyPage();
        initMyPageOutfitWiring();
        initFavoriteCharaIcon();
        ensureMetadataLoaded().then(() => {
            if (homeActive && state.currentCharacterId === requestedId) syncMyPageOutfitUI();
        }).catch(() => {});
        syncMyPageOutfitUI();

        showBg();
        playPreparedBgm();
        revealHomeMenu();

        const modelId = `${requestedId}${live2dId}`;
        const usedPreloadConnecting = !ramFolderCache.has(modelId);
        if (usedPreloadConnecting) {
            setAssetPreloadConnecting(true);
        }
        try {
            let scenarioJson = null;
            if (live2dId === '00') {
                const scenarioPath = `${requestedId}00.json`;
                const scenarioResult = await fetchScenarioJson(scenarioPath);
                if (!scenarioResult.json) throw new Error(`Failed to load home scenario ${scenarioPath}`);
                if (requestToken !== homeRequestToken || !homeActive || generation !== homeGeneration) return;
                scenarioCache.set(scenarioResult.url, scenarioResult.json);
                scenarioJson = scenarioResult.json;
            } else {
                const loadedScenario = await loadScenarioForOutfit(requestedId, live2dId);
                if (requestToken !== homeRequestToken || !homeActive || generation !== homeGeneration) return;
                scenarioJson = loadedScenario?.scenarioJson || null;
            }

            state.currentLive2dId = live2dId;
            state.currentModelId = modelId;

            const { allowedExpressions, allowedMotions, allowedVoices } =
                collectHomeScenarioResources(scenarioJson);

            const seqPlayer = getScenarioPlayer();
            await Promise.all([
                preloadModelToRam(modelId, { allowedExpressions, allowedMotions }),
                preloadScenarioVoices(Array.from(allowedVoices), seqPlayer.voice),
                preloadOpenSansFont()
            ]);
            if (requestToken !== homeRequestToken || !homeActive || generation !== homeGeneration) return;

            const loadedOk = await loadOutfitModels(requestedId, live2dId, undefined, allowedExpressions, allowedMotions, null, { startHidden: true });
            if (!loadedOk || requestToken !== homeRequestToken || !homeActive || generation !== homeGeneration) {
                destroyStageModels();
                return;
            }
            await loadScenarioForOutfit(requestedId, live2dId);
            if (requestToken !== homeRequestToken || !homeActive || generation !== homeGeneration) {
                destroyStageModels();
                return;
            }

            getActiveModelEntries().forEach((model) => { model.visible = false; });
            homeReady = true;
            homeLoadedCharaId = requestedId;
            homeLive2dId = live2dId;
        } finally {
            if (usedPreloadConnecting) {
                setAssetPreloadConnecting(false);
            }
        }

        const audioUnlocked = isBgmUnlocked() || await waitForBgmUnlock();
        if (requestToken !== homeRequestToken || !homeActive || generation !== homeGeneration) return;
        if (audioUnlocked || HOME_OPENED_FROM_INDEX) await revealHomeScreen();
    })().catch((error) => {
        console.error('[mypage] Homescreen preload failed:', error);
        homeReady = false;
        if (generation === homeGeneration) {
            document.body.classList.remove('connecting');
        }
    }).finally(() => {
        if (homeLoadPromise === loadTask) {
            homeLoadPromise = null;
        }
        homePendingCharaId = null;
    });

    homeLoadPromise = loadTask;
    return loadTask;
}

export function leaveMyPage({ keepHomeCache = true, keepStage = false } = {}) {
    homeRequestToken++;
    homeActive = false;
    homeRevealed = false;
    cancelMenuChoreography({ keepModelFades: keepStage });

    clearTimeout(live2dHoldTimer);
    live2dHoldTimer = null;

    const wearWrap = document.querySelector('#MyPage #wearWrap');
    wearWrap?.classList.add('off');
    document.getElementById('MyPage')?.classList.remove('wearing', 'reveal');
    setWearWrapChrome(false);
    resetMyPage({ keepStage });

    if (!keepStage) {
        cancelOutfitChanges();
        stopVoice();
        setBgPortrait(false);
        document.getElementById('ui-layer')?.classList.remove('home-mode', 'menu-closed');
        document.body.classList.remove('connecting');
        destroyStageModels();
    }

    if (keepHomeCache) {
        homeNeedsRespawn = true;
    } else {
        homeGeneration++;
        homeReady = false;
        homeNeedsRespawn = false;
        homeLoadedCharaId = null;
        homePendingCharaId = null;
        homeLive2dId = '00';
        homeTapVoicePool = [...HOME_TAP_VOICE_IDS];
    }
}
