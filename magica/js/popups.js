// js/popups.js — Shared Magia Record popup controller (EtcPopup, MyProfilePopup, BgChangedPopup)
//
// Lazily creates #popupArea + #popupCurtain on <body> (position: fixed,
// z-index 1000000; CSS in mypage.css & profile.css). Mounted outside the
// transformed #ui-layer so fixed positioning stays viewport-relative, and
// scales the inner popup box to window.cameraContainer.scale.x.

import { HOME_STATUS_DEMO } from './home-menu.js';
import { resolveMaReAssetsBase } from './viewer/model.js';

const ETC_TEMPLATE = 'magica/template/etc/EtcPopup.html';
const PROFILE_TEMPLATE = 'magica/template/user/MyProfilePopup.html';
const CLOSE_ANIM_MS = 200;

const PROFILE_DEMO = {
    userName: 'Our Record',
    comment: '...',
    riche: '10000000',
    stage: '125',
    totalForces: '21862101',
    totalForcesRank: '2',
    followCount: '50',
    followerCount: '50',
    playerId: 'OURRECORD',
    freeRankLayer: 'Layer 36',
    mirrorsPts: '99999',
    mirrorsWins: '999'
};

const TOUCH_SELECTOR = [
    '#popupArea .etcPopWrap .se_decide',
    '#popupArea #myProfile .profBtn',
    '#popupArea #myProfile .bgChangeBtn',
    '#popupArea #myProfile .leaderChangeBtn',
    '#popupArea #myProfile .totalForcesHelpBtn',
    '#popupArea #myProfile .arenaHelpBtn',
    '#popupArea #bgChangePop .decideBtn'
].join(', ');

let popupArea = null;
let activePopup = null; // { kind: 'etc' | 'profile' | 'bgChanged', el, canClose, onChangeBackground, onConfirm }
let pending = false;
let bound = false;
let etcTemplateCache = null;
let profileTemplateCache = null;
let cardArtRequestToken = 0;

function ensurePopupArea() {
    if (popupArea) return popupArea;
    popupArea = document.getElementById('popupArea');
    if (!popupArea) {
        popupArea = document.createElement('div');
        popupArea.id = 'popupArea';
        document.body.appendChild(popupArea);
    }
    if (!popupArea.querySelector('#popupCurtain')) {
        const curtain = document.createElement('div');
        curtain.id = 'popupCurtain';
        popupArea.prepend(curtain);
    }
    return popupArea;
}

function applyPopupScale(innerEl) {
    if (!innerEl) return;
    const s = window.cameraContainer?.scale?.x ?? 1;
    if (s !== 1) {
        innerEl.style.transformOrigin = 'center center';
        innerEl.style.transform = `scale(${s})`;
    } else {
        innerEl.style.transformOrigin = '';
        innerEl.style.transform = '';
    }
}

async function fetchTemplate(url, kind) {
    if (kind === 'etc' && etcTemplateCache) return etcTemplateCache;
    if (kind === 'profile' && profileTemplateCache) return profileTemplateCache;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status}`);
    const html = await resp.text();
    if (kind === 'etc') etcTemplateCache = html;
    if (kind === 'profile') profileTemplateCache = html;
    return html;
}

function closeActivePopup({ immediate = false } = {}) {
    if (!activePopup) return;
    const closing = activePopup;
    activePopup = null;
    cardArtRequestToken++;

    const curtain = popupArea ? popupArea.querySelector('#popupCurtain') : null;
    if (curtain) curtain.classList.remove('show');

    const el = closing.el;
    if (!el) return;
    if (immediate) {
        el.remove();
        return;
    }
    el.classList.remove('open');
    el.classList.add('close');
    setTimeout(() => el.remove(), CLOSE_ANIM_MS);
}

export async function openEtcPopup() {
    if (activePopup?.kind === 'etc' || pending) return;
    if (activePopup) closeActivePopup({ immediate: true });
    pending = true;
    try {
        const html = await fetchTemplate(ETC_TEMPLATE, 'etc');
        const area = ensurePopupArea();

        const el = document.createElement('div');
        el.className = 'popupContent open etcPop';
        el.innerHTML = html;
        area.appendChild(el);

        applyPopupScale(el.querySelector('.etcPopInner'));

        const curtain = area.querySelector('#popupCurtain');
        if (curtain) curtain.classList.add('show');
        activePopup = { kind: 'etc', el, canClose: true };
        bindEvents();
    } catch (err) {
        console.error('[popups] EtcPopup open failed:', err);
    } finally {
        pending = false;
    }
}

export function closeEtcPopup() {
    if (activePopup?.kind === 'etc') closeActivePopup();
}

async function loadProfileCardArt(imgEl, charaId) {
    if (!imgEl) return;
    const token = ++cardArtRequestToken;
    imgEl.style.display = 'none';

    const base = await resolveMaReAssetsBase().catch(() => '');
    if (!base || token !== cardArtRequestToken || !imgEl.isConnected) return;

    const root = String(base).replace(/\/$/, '').replace(/\/live2d_v4\/?$/, '');
    let url = null;
    for (const suffix of ['5', '4', '1']) {
        const candidate = `${root}/card/image/card_${charaId}${suffix}_l.png`;
        try {
            const resp = await fetch(candidate, { method: 'HEAD' });
            if (resp.ok) {
                url = candidate;
                break;
            }
        } catch {}
    }

    if (token !== cardArtRequestToken || !imgEl.isConnected || !url) return;
    imgEl.onerror = () => {
        imgEl.removeAttribute('src');
        imgEl.style.display = 'none';
    };
    imgEl.onload = () => {
        if (token === cardArtRequestToken && imgEl.isConnected) {
            imgEl.style.display = '';
        }
    };
    imgEl.src = url;
}

function populateProfileDemo(rootEl) {
    const stoneText = document.querySelector('#money .pointWrap')?.textContent?.trim() || String(HOME_STATUS_DEMO.money);
    const setText = (sel, val) => {
        const el = rootEl.querySelector(sel);
        if (el) el.textContent = String(val);
    };
    setText('#myProfStone .pointWrap', stoneText);
    setText('#myProfHasRiche .pointWrap', PROFILE_DEMO.riche);
    setText('.profUserName', PROFILE_DEMO.userName);
    setText('.userLevel', HOME_STATUS_DEMO.rank);
    setText('.reachingAccomplish', PROFILE_DEMO.stage);
    setText('#totalForces', PROFILE_DEMO.totalForces);
    setText('#totalForcesRanking', PROFILE_DEMO.totalForcesRank);
    setText('.userFollow', PROFILE_DEMO.followCount);
    setText('.userFollower', PROFILE_DEMO.followerCount);
    setText('.myprofUserId .colValue', PROFILE_DEMO.playerId);
    setText('.markWrap.freeRank', PROFILE_DEMO.freeRankLayer);
    const arenaNums = rootEl.querySelectorAll('.arenaParams .freeNum');
    if (arenaNums[0]) arenaNums[0].textContent = PROFILE_DEMO.mirrorsPts;
    if (arenaNums[1]) arenaNums[1].textContent = PROFILE_DEMO.mirrorsWins;
    setText('#followImageWrap .messageInner', PROFILE_DEMO.comment);
}

export async function openProfilePopup({ charaId = 1001, onChangeBackground } = {}) {
    if (activePopup?.kind === 'profile' || pending) return;
    if (activePopup) closeActivePopup({ immediate: true });
    pending = true;
    try {
        const html = await fetchTemplate(PROFILE_TEMPLATE, 'profile');
        const area = ensurePopupArea();

        const el = document.createElement('div');
        el.className = 'popupContent open typeB userProfile';
        const inner = document.createElement('div');
        inner.className = 'popupInner';
        inner.innerHTML = html;
        el.appendChild(inner);
        area.appendChild(el);

        populateProfileDemo(inner);
        applyPopupScale(inner);

        const curtain = area.querySelector('#popupCurtain');
        if (curtain) curtain.classList.add('show');
        activePopup = {
            kind: 'profile',
            el,
            canClose: true,
            onChangeBackground: typeof onChangeBackground === 'function' ? onChangeBackground : null
        };
        bindEvents();

        loadProfileCardArt(inner.querySelector('#followImageWrap .charaImage'), charaId);
    } catch (err) {
        console.error('[popups] ProfilePopup open failed:', err);
    } finally {
        pending = false;
    }
}

export function closeProfilePopup() {
    if (activePopup?.kind === 'profile') closeActivePopup();
}

export function openBgChangedPopup(bgName, onConfirm) {
    if (activePopup) closeActivePopup({ immediate: true });
    const area = ensurePopupArea();

    const el = document.createElement('div');
    el.id = 'bgChangePop';
    el.className = 'popupContent open typeA';

    const inner = document.createElement('div');
    inner.className = 'popupInner';

    const title = document.createElement('div');
    title.className = 'popupTitle';
    title.textContent = 'Changed';

    const textArea = document.createElement('div');
    textArea.className = 'popupTextArea';
    textArea.appendChild(document.createTextNode('Your Home Background has been'));
    textArea.appendChild(document.createElement('br'));
    textArea.appendChild(document.createTextNode(`changed to ${bgName}.`));

    const btnTable = document.createElement('table');
    btnTable.className = 'popupBtnArea';
    btnTable.innerHTML = `
        <tr>
            <td><span class="decideBtn btn b_pink TE se_decide"><span class="b_screen"></span>Home</span></td>
        </tr>`;

    inner.appendChild(title);
    inner.appendChild(textArea);
    inner.appendChild(btnTable);
    el.appendChild(inner);
    area.appendChild(el);

    applyPopupScale(inner);

    const curtain = area.querySelector('#popupCurtain');
    if (curtain) curtain.classList.add('show');
    activePopup = {
        kind: 'bgChanged',
        el,
        canClose: false,
        onConfirm: typeof onConfirm === 'function' ? onConfirm : null
    };
    bindEvents();
}

function onPointerDown(e) {
    const btn = e.target.closest(TOUCH_SELECTOR);
    if (!btn) return;
    btn.classList.add('touch');
}

function onPointerUp() {
    if (!popupArea) return;
    popupArea.querySelectorAll('.touch').forEach((el) => el.classList.remove('touch'));
}

function onKeyDown(e) {
    if (e.key !== 'Escape' || !activePopup || !activePopup.canClose) return;
    e.preventDefault();
    closeActivePopup();
}

function onPopupClick(e) {
    if (!activePopup) return;

    if (activePopup.kind === 'bgChanged') {
        if (e.target.closest('#bgChangePop .decideBtn')) {
            e.preventDefault();
            e.stopPropagation();
            const cb = activePopup.onConfirm;
            closeActivePopup();
            if (cb) cb();
        }
        return;
    }

    if (e.target.closest('.popupCloseBtn')) {
        e.preventDefault();
        e.stopPropagation();
        closeActivePopup();
        return;
    }

    if (activePopup.kind === 'etc') {
        if (e.target.closest('.etcPopWrap .collectionBtn')) {
            e.preventDefault();
            e.stopPropagation();
            closeActivePopup();
            window.location.hash = '#/CharaCollection';
            return;
        }
        if (e.target.closest('.etcPopWrap .se_decide')) {
            e.preventDefault();
            e.stopPropagation();
        }
        return;
    }

    if (activePopup.kind === 'profile') {
        if (e.target.closest('#myProfile .bgChangeBtn')) {
            e.preventDefault();
            e.stopPropagation();
            const cb = activePopup.onChangeBackground;
            closeActivePopup();
            if (cb) cb();
            return;
        }
        if (e.target.closest('#myProfile .se_decide')) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
}

function onBackdropClick(e) {
    if (!activePopup || !activePopup.canClose) return;
    if (e.target.closest('.etcPop .etcPopInner')) return;
    if (e.target.closest('.userProfile .popupInner')) return;
    if (e.target.closest('#popupArea')) closeActivePopup();
}

function onHashChange() {
    closeActivePopup();
}

function onViewportChange() {
    if (!activePopup?.el) return;
    const inner = activePopup.el.querySelector('.etcPopInner, .popupInner');
    applyPopupScale(inner);
}

function bindEvents() {
    if (bound) return;
    bound = true;
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('pointerup', onPointerUp, true);
    document.addEventListener('pointercancel', onPointerUp, true);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onPopupClick);
    document.addEventListener('click', onBackdropClick);
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('mrv2:viewportChange', onViewportChange);
}
