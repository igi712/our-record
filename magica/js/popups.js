// js/popups.js — Shared Magia Record popup controller (EtcPopup, MyProfilePopup, BgChangedPopup, FavChangedPopup, CharaFilterPopup)
//
// Lazily creates #popupArea + #popupCurtain on <body> (position: fixed,
// z-index 1000000; CSS in mypage.css & profile.css). Mounted outside the
// transformed #ui-layer so fixed positioning stays viewport-relative, and
// scales the inner popup box to window.cameraContainer.scale.x.

import { HOME_STATUS_DEMO } from './home-menu.js';
import { resolveMaReAssetsBase } from './viewer/model.js';

const ETC_TEMPLATE = 'magica/template/etc/EtcPopup.html';
const PROFILE_TEMPLATE = 'magica/template/user/MyProfilePopup.html';
const CARD_SORT_TEMPLATE = 'magica/template/card/CardSort.html';
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
    '#popupArea #bgChangePop .decideBtn',
    '#popupArea #favChangePop .popupCloseBtn',
    '#popupArea #sortFilterPop .filterAtt',
    '#popupArea #sortFilterPop .filterRank',
    '#popupArea #sortFilterPop .filterEnhance',
    '#popupArea #sortFilterPop .filterInitial',
    '#popupArea #sortFilterPop #cardSortBtnsArea .sort'
].join(', ');

let popupArea = null;
let activePopup = null; // { kind: 'etc' | 'profile' | 'bgChanged' | 'favChanged' | 'sortFilter', el, canClose, onChangeBackground, onChangeFavorite, onConfirm, onApply }
let pending = false;
let bound = false;
let etcTemplateCache = null;
let profileTemplateCache = null;
let cardSortTemplateCache = null;
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
    if (kind === 'sortFilter' && cardSortTemplateCache) return cardSortTemplateCache;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status}`);
    const html = await resp.text();
    if (kind === 'etc') etcTemplateCache = html;
    if (kind === 'profile') profileTemplateCache = html;
    if (kind === 'sortFilter') cardSortTemplateCache = html;
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

export async function openProfilePopup({ charaId = 1001, onChangeBackground, onChangeFavorite } = {}) {
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
            onChangeBackground: typeof onChangeBackground === 'function' ? onChangeBackground : null,
            onChangeFavorite: typeof onChangeFavorite === 'function' ? onChangeFavorite : null
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

export function openFavoriteChangedPopup(charaName) {
    if (activePopup) closeActivePopup({ immediate: true });
    const area = ensurePopupArea();

    const el = document.createElement('div');
    el.id = 'favChangePop';
    el.className = 'popupContent open typeC';

    const inner = document.createElement('div');
    inner.className = 'popupInner';

    const closeX = document.createElement('span');
    closeX.className = 'popupCloseBtn closeDefault se_cancel TE';

    const title = document.createElement('div');
    title.className = 'popupTitle';
    title.textContent = 'Changed';

    const textArea = document.createElement('div');
    textArea.className = 'popupTextArea';
    textArea.textContent = `${charaName || 'Magical Girl'} has been set as your favorite.`;

    const btnTable = document.createElement('table');
    btnTable.className = 'popupBtnArea';
    btnTable.innerHTML = `
        <tr>
            <td><span class="popupCloseBtn btn b_white TE se_decide"><span class="b_screen"></span>Close</span></td>
        </tr>`;

    inner.appendChild(closeX);
    inner.appendChild(title);
    inner.appendChild(textArea);
    inner.appendChild(btnTable);
    el.appendChild(inner);
    area.appendChild(el);

    applyPopupScale(inner);

    const curtain = area.querySelector('#popupCurtain');
    if (curtain) curtain.classList.add('show');
    activePopup = {
        kind: 'favChanged',
        el,
        canClose: true
    };
    bindEvents();
}

const FILTER_GROUPS = [
    { selector: '.filterAtt', dataKey: 'typeFilter', prmIndex: 2, single: false },
    { selector: '.filterRank', dataKey: 'rankfilterId', prmIndex: 3, single: false },
    { selector: '.filterEnhance', dataKey: 'enhancefilterId', prmIndex: 4, single: true },
    { selector: '.filterInitial', dataKey: 'initialfilterId', prmIndex: 5, single: false }
];

function applyFilterStateToPopup(root, sortPrm) {
    for (const group of FILTER_GROUPS) {
        const raw = sortPrm?.[group.prmIndex] || null;
        const selected = raw ? new Set(String(raw).split(',').filter(Boolean)) : null;
        const buttons = root.querySelectorAll(group.selector);
        buttons.forEach((btn) => btn.classList.remove('current'));
        if (!selected || selected.size === 0 || selected.has('ALL')) {
            const allBtn = root.querySelector(`${group.selector}.ALL`);
            if (allBtn) allBtn.classList.add('current');
        } else {
            let matched = false;
            buttons.forEach((btn) => {
                const val = btn.dataset[group.dataKey];
                if (val && val !== 'ALL' && selected.has(val)) {
                    btn.classList.add('current');
                    matched = true;
                }
            });
            if (!matched) {
                const allBtn = root.querySelector(`${group.selector}.ALL`);
                if (allBtn) allBtn.classList.add('current');
            }
        }
    }
}

function readFilterStateFromPopup(root) {
    return FILTER_GROUPS.map((group) => {
        const allBtn = root.querySelector(`${group.selector}.ALL`);
        if (allBtn?.classList.contains('current')) return null;
        const vals = [];
        root.querySelectorAll(`${group.selector}.current`).forEach((btn) => {
            const val = btn.dataset[group.dataKey];
            if (val && val !== 'ALL') vals.push(val);
        });
        return vals.length ? vals.join(',') : null;
    });
}

export async function openCharaFilterPopup(currentSortPrm, onApply) {
    if (pending) return;
    if (activePopup) closeActivePopup({ immediate: true });
    pending = true;
    try {
        const area = ensurePopupArea();
        const template = await fetchTemplate(CARD_SORT_TEMPLATE, 'sortFilter');

        const el = document.createElement('div');
        el.id = 'sortFilterPop';
        el.className = 'popupContent open typeB';

        const inner = document.createElement('div');
        inner.className = 'popupInner';

        const closeX = document.createElement('span');
        closeX.className = 'popupCloseBtn closeDefault se_cancel TE';

        const textArea = document.createElement('div');
        textArea.className = 'popupTextArea';
        textArea.innerHTML = template;

        inner.appendChild(closeX);
        inner.appendChild(textArea);
        el.appendChild(inner);
        area.appendChild(el);

        applyFilterStateToPopup(inner, currentSortPrm);
        applyPopupScale(inner);

        const curtain = area.querySelector('#popupCurtain');
        if (curtain) curtain.classList.add('show');
        activePopup = {
            kind: 'sortFilter',
            el,
            canClose: true,
            onApply: typeof onApply === 'function' ? onApply : null
        };
        bindEvents();
    } catch (err) {
        console.error('[popups] CharaFilterPopup open failed:', err);
    } finally {
        pending = false;
    }
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

    if (activePopup.kind === 'sortFilter') {
        const applyBtn = e.target.closest('#sortFilterPop #cardSortBtnsArea .sort');
        if (applyBtn) {
            e.preventDefault();
            e.stopPropagation();
            const filters = readFilterStateFromPopup(activePopup.el);
            const cb = activePopup.onApply;
            closeActivePopup();
            if (cb) cb(filters);
            return;
        }
        for (const group of FILTER_GROUPS) {
            const btn = e.target.closest(`#sortFilterPop ${group.selector}`);
            if (!btn) continue;
            e.preventDefault();
            e.stopPropagation();
            const val = btn.dataset[group.dataKey];
            const buttons = activePopup.el.querySelectorAll(group.selector);
            const allBtn = activePopup.el.querySelector(`${group.selector}.ALL`);
            if (val === 'ALL') {
                buttons.forEach((b) => b.classList.remove('current'));
                if (allBtn) allBtn.classList.add('current');
            } else if (group.single) {
                const wasCurrent = btn.classList.contains('current');
                buttons.forEach((b) => b.classList.remove('current'));
                if (wasCurrent) {
                    if (allBtn) allBtn.classList.add('current');
                } else {
                    btn.classList.add('current');
                }
            } else {
                if (allBtn) allBtn.classList.remove('current');
                btn.classList.toggle('current');
                const anyActive = Array.from(buttons).some((b) => b !== allBtn && b.classList.contains('current'));
                if (!anyActive && allBtn) allBtn.classList.add('current');
            }
            return;
        }
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
        if (e.target.closest('#myProfile .leaderChangeBtn')) {
            e.preventDefault();
            e.stopPropagation();
            const cb = activePopup.onChangeFavorite;
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
    if (e.target.closest('#popupArea .etcPopInner, #popupArea .popupInner')) return;
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
