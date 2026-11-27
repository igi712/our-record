// js/popups.js — Shared Magia Record popup controller (EtcPopup, MyProfilePopup, BgChangedPopup, FavChangedPopup, CharaFilterPopup)
//
// Lazily creates #popupArea + #popupCurtain on <body> (position: fixed,
// z-index 1000000; CSS in mypage.css & profile.css). Mounted outside the
// transformed #ui-layer so fixed positioning stays viewport-relative, and
// scales the inner popup box to window.cameraContainer.scale.x.

import { HOME_STATUS_DEMO } from './home-menu.js';
import { resolveMaReAssetsBase } from './viewer/model.js';
import { magicaUrl } from './paths.js';

const ETC_TEMPLATE = magicaUrl('template/etc/EtcPopup.html');
const PROFILE_TEMPLATE = magicaUrl('template/user/MyProfilePopup.html');
const CARD_SORT_TEMPLATE = magicaUrl('template/card/CardSort.html');
const CLOSE_ANIM_MS = 200;
const STORAGE_PLAYER_NAME_KEY = 'mrPlayerName';
const MAX_PLAYER_NAME_LEN = 12;

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

export function getPlayerName() {
    try {
        const saved = localStorage.getItem(STORAGE_PLAYER_NAME_KEY);
        if (saved && saved.trim()) return saved.trim().slice(0, MAX_PLAYER_NAME_LEN);
    } catch {}
    return PROFILE_DEMO.userName;
}

export function setPlayerName(name) {
    const trimmed = String(name ?? '').trim().slice(0, MAX_PLAYER_NAME_LEN);
    if (!trimmed) return getPlayerName();
    try {
        localStorage.setItem(STORAGE_PLAYER_NAME_KEY, trimmed);
    } catch {}
    return trimmed;
}

export function getPlayerId() {
    return PROFILE_DEMO.playerId;
}

const TOUCH_SELECTOR = [
    '#popupArea .etcPopWrap .se_decide',
    '#popupArea #myProfile .profBtn',
    '#popupArea #myProfile .bgChangeBtn',
    '#popupArea #myProfile .leaderChangeBtn',
    '#popupArea #myProfile .totalForcesHelpBtn',
    '#popupArea #myProfile .arenaHelpBtn',
    '#popupArea #bgChangePop .decideBtn',
    '#popupArea #favChangePop .popupCloseBtn',
    '#popupArea #configNoticePop .popupCloseBtn',
    '#popupArea #nameChangePopWrap .popupCloseBtn',
    '#popupArea #nameChangePopWrap .decideBtn',
    '#popupArea .uiHidePop .popupCloseBtn',
    '#popupArea .uiHidePop .decideBtn',
    '#popupArea #cameraSavedPop .popupCloseBtn',
    '#popupArea #cameraHelpPop .popupCloseBtn',
    '#popupArea #cameraHelpPop .colLow',
    '#popupArea #sortFilterPop .filterAtt',
    '#popupArea #sortFilterPop .filterRank',
    '#popupArea #sortFilterPop .filterEnhance',
    '#popupArea #sortFilterPop .filterInitial',
    '#popupArea #sortFilterPop #filterNameClear',
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

function syncPopupAreaBounds() {
    if (!popupArea) return;
    const camera = window.cameraContainer;
    const vp = window.VIEWPORT;
    if (!camera || !vp) return;
    const scale = camera.scale?.x ?? 1;
    popupArea.style.left = `${camera.x}px`;
    popupArea.style.top = `${camera.y}px`;
    popupArea.style.width = `${vp.viewW * scale}px`;
    popupArea.style.height = `${vp.viewH * scale}px`;
}

function ensurePopupArea() {
    if (popupArea) {
        syncPopupAreaBounds();
        return popupArea;
    }
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
    syncPopupAreaBounds();
    return popupArea;
}

function applyPopupScale(innerEl) {
    if (!innerEl) return;
    const s = window.cameraContainer?.scale?.x ?? 1;
    const isPortrait = Boolean(innerEl.closest('.portrait'));
    if (s !== 1 || isPortrait) {
        innerEl.style.transformOrigin = 'center center';
        innerEl.style.transform = isPortrait
            ? (s !== 1 ? `scale(${s}) rotate(270deg)` : 'rotate(270deg)')
            : `scale(${s})`;
    } else {
        innerEl.style.transformOrigin = '';
        innerEl.style.transform = '';
    }
}

async function fetchTemplate(url, kind) {
    if (kind === 'etc' && etcTemplateCache) return etcTemplateCache;
    if (kind === 'profile' && profileTemplateCache) return profileTemplateCache;
    if (kind === 'sortFilter' && cardSortTemplateCache) return cardSortTemplateCache;
    const resp = await fetch(url, { cache: 'no-cache' });
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
    setText('.profUserName', getPlayerName());
    setText('.userLevel', HOME_STATUS_DEMO.rank);
    setText('.reachingAccomplish', PROFILE_DEMO.stage);
    setText('#totalForces', PROFILE_DEMO.totalForces);
    setText('#totalForcesRanking', PROFILE_DEMO.totalForcesRank);
    setText('.userFollow', PROFILE_DEMO.followCount);
    setText('.userFollower', PROFILE_DEMO.followerCount);
    setText('.myprofUserId .colValue', getPlayerId());
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

export async function copyTextToClipboard(text) {
    const value = String(text ?? '');
    try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            await navigator.clipboard.writeText(value);
            return true;
        }
    } catch {}
    try {
        const ta = document.createElement('textarea');
        ta.value = value;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        return ok;
    } catch {
        return false;
    }
}

export function openConfigNoticePopup(titleText, messageText, buttonLabel = 'OK') {
    if (activePopup) closeActivePopup({ immediate: true });
    const area = ensurePopupArea();

    const el = document.createElement('div');
    el.id = 'configNoticePop';
    el.className = 'popupContent open typeC';

    const inner = document.createElement('div');
    inner.className = 'popupInner';

    const closeX = document.createElement('span');
    closeX.className = 'popupCloseBtn closeDefault se_cancel TE';

    const title = document.createElement('div');
    title.className = 'popupTitle';
    title.textContent = titleText || '';

    const textArea = document.createElement('div');
    textArea.className = 'popupTextArea';
    textArea.textContent = messageText || '';

    const btnTable = document.createElement('table');
    btnTable.className = 'popupBtnArea';
    btnTable.innerHTML = `
        <tr>
            <td><span class="popupCloseBtn btn b_white TE se_decide"><span class="b_screen"></span></span></td>
        </tr>`;
    btnTable.querySelector('.popupCloseBtn')?.appendChild(document.createTextNode(buttonLabel));

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
        kind: 'configNotice',
        el,
        canClose: true
    };
    bindEvents();
}

export function openNameChangePopup({ currentName, maxLength = MAX_PLAYER_NAME_LEN, onSave } = {}) {
    if (activePopup) closeActivePopup({ immediate: true });
    const area = ensurePopupArea();

    const el = document.createElement('div');
    el.id = 'nameChangePopWrap';
    el.className = 'popupContent open typeC';

    const inner = document.createElement('div');
    inner.className = 'popupInner';

    const closeX = document.createElement('span');
    closeX.className = 'popupCloseBtn closeDefault se_cancel TE';

    const title = document.createElement('div');
    title.className = 'popupTitle';
    title.textContent = 'Change Name';

    const initialValue = String(currentName ?? getPlayerName()).slice(0, maxLength);

    const textArea = document.createElement('div');
    textArea.className = 'popupTextArea';
    textArea.innerHTML = `
        <div class="nameChangeBody">
            <p class="namePrompt">Please enter your new Player Name.</p>
            <div class="nameInputRow">
                <input id="changeName" class="commonFrame3" type="text" maxlength="${maxLength}" autocomplete="off">
                <span class="textCount"><span id="textCount">0</span>/${maxLength}</span>
            </div>
            <div id="nameChangeError" class="c_red"></div>
        </div>`;

    const inputEl = textArea.querySelector('#changeName');
    const countEl = textArea.querySelector('#textCount');
    const errorEl = textArea.querySelector('#nameChangeError');
    if (inputEl) {
        inputEl.value = initialValue;
        if (countEl) countEl.textContent = String(initialValue.length);
        inputEl.addEventListener('input', () => {
            if (countEl) countEl.textContent = String(inputEl.value.length);
            if (errorEl) errorEl.textContent = '';
        });
    }

    const btnTable = document.createElement('table');
    btnTable.className = 'popupBtnArea';
    btnTable.innerHTML = `
        <tr>
            <td><span class="popupCloseBtn btn b_white TE se_cancel"><span class="b_screen"></span>Cancel</span></td>
            <td><span class="decideBtn btn b_pink TE se_decide"><span class="b_screen"></span>Change</span></td>
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
        kind: 'nameChange',
        el,
        canClose: true,
        onSave: typeof onSave === 'function' ? onSave : null
    };
    bindEvents();

    requestAnimationFrame(() => {
        if (inputEl && inputEl.isConnected) {
            inputEl.focus();
            inputEl.select();
        }
    });
}

export function openUiHidePopup({ portrait = false, onConfirm } = {}) {
    if (activePopup) closeActivePopup({ immediate: true });
    const area = ensurePopupArea();

    const el = document.createElement('div');
    el.className = 'popupContent open uiHidePop' + (portrait ? ' portrait' : '');

    const inner = document.createElement('div');
    inner.className = 'popupInner';

    const textArea = document.createElement('div');
    textArea.className = 'popupTextArea';
    textArea.innerHTML = 'Hide the on-screen buttons?<br><br>Press and hold the screen<br>to display them again.';

    const btnTable = document.createElement('table');
    btnTable.className = 'popupBtnArea';
    btnTable.innerHTML = `
        <tr>
            <td><span class="popupCloseBtn btn b_white TE se_cancel"><span class="b_screen"></span>Cancel</span></td>
            <td><span class="decideBtn btn b_pink TE se_decide"><span class="b_screen"></span>Hide</span></td>
        </tr>`;

    inner.appendChild(textArea);
    inner.appendChild(btnTable);
    el.appendChild(inner);
    area.appendChild(el);

    applyPopupScale(inner);

    const curtain = area.querySelector('#popupCurtain');
    if (curtain) curtain.classList.remove('show');
    activePopup = {
        kind: 'uiHide',
        el,
        canClose: false,
        onConfirm: typeof onConfirm === 'function' ? onConfirm : null
    };
    bindEvents();
}

export function openCameraSavedPopup() {
    if (activePopup) closeActivePopup({ immediate: true });
    const area = ensurePopupArea();

    const el = document.createElement('div');
    el.id = 'cameraSavedPop';
    el.className = 'popupContent open typeC';

    const inner = document.createElement('div');
    inner.className = 'popupInner';

    const closeX = document.createElement('span');
    closeX.className = 'popupCloseBtn closeDefault se_cancel TE';

    const title = document.createElement('div');
    title.className = 'popupTitle';
    title.textContent = 'Photo Mode';

    const textArea = document.createElement('div');
    textArea.className = 'popupTextArea';
    textArea.textContent = 'Photo saved!';

    const btnTable = document.createElement('table');
    btnTable.className = 'popupBtnArea';
    btnTable.innerHTML = `
        <tr>
            <td><span class="popupCloseBtn btn b_white TE se_decide"><span class="b_screen"></span>OK</span></td>
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
        kind: 'cameraSaved',
        el,
        canClose: true
    };
    bindEvents();
}

export function openCameraHelpPopup() {
    if (activePopup) closeActivePopup({ immediate: true });
    const area = ensurePopupArea();

    const el = document.createElement('div');
    el.id = 'cameraHelpPop';
    el.className = 'popupContent open typeB';

    const inner = document.createElement('div');
    inner.className = 'popupInner';

    const closeX = document.createElement('span');
    closeX.className = 'popupCloseBtn closeDefault se_cancel TE';

    const title = document.createElement('div');
    title.className = 'popupTitle';
    title.textContent = 'Photo Mode';

    const textArea = document.createElement('div');
    textArea.className = 'popupTextArea';
    textArea.innerHTML = `
        <div id="HelpPopup">
            <div class="hiddenWrap" id="helpPopScrollOuter">
                <div class="scrollInner">
                    <div class="helpRows">
                        <div class="colLow se_tabs commonFrame4">Taking Photos of Magical Girls<span class="panArrow"></span></div>
                        <div class="colText">
                            Tap the MENU button on the Home screen to hide the side menus, then tap Options to open Photo Mode.<br><br>
                            ■ Photo Settings<br>
                            ・<strong>Change Position</strong>: Tap to cycle the Magical Girl's display position (5 presets for single units, 8 for dual units).<br>
                            ・<strong>Change Magical Girl</strong>: Choose which Magical Girl to photograph.<br>
                            ・<strong>Outfits</strong>: Switch between the Magical Girl's available outfits.<br>
                            ・<strong>Start Photo Session</strong>: Uses your device camera behind the Magical Girl (or keeps your Home background if unavailable). Tap the shutter button or use the 5-second Timer to save a photo.
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    inner.appendChild(closeX);
    inner.appendChild(title);
    inner.appendChild(textArea);
    el.appendChild(inner);
    area.appendChild(el);

    applyPopupScale(inner);

    const curtain = area.querySelector('#popupCurtain');
    if (curtain) curtain.classList.add('show');
    activePopup = {
        kind: 'cameraHelp',
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
    const searchInput = root.querySelector('#charaFilterSearchInput');
    if (searchInput) {
        searchInput.value = sortPrm?.[6] ? String(sortPrm[6]) : '';
    }
}

function readFilterStateFromPopup(root) {
    const groups = FILTER_GROUPS.map((group) => {
        const allBtn = root.querySelector(`${group.selector}.ALL`);
        if (allBtn?.classList.contains('current')) return null;
        const vals = [];
        root.querySelectorAll(`${group.selector}.current`).forEach((btn) => {
            const val = btn.dataset[group.dataKey];
            if (val && val !== 'ALL') vals.push(val);
        });
        return vals.length ? vals.join(',') : null;
    });
    const searchVal = root.querySelector('#charaFilterSearchInput')?.value?.trim() || '';
    return [...groups, searchVal || null];
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

function submitActiveNameChange() {
    if (!activePopup || activePopup.kind !== 'nameChange') return;
    const inputEl = activePopup.el.querySelector('#changeName');
    const errorEl = activePopup.el.querySelector('#nameChangeError');
    const trimmed = String(inputEl?.value ?? '').trim();
    if (!trimmed) {
        if (errorEl) errorEl.textContent = 'Enter your Player Name.';
        inputEl?.focus();
        return;
    }
    const saved = setPlayerName(trimmed);
    const cb = activePopup.onSave;
    closeActivePopup({ immediate: true });
    if (cb) cb(saved);
    openConfigNoticePopup('Change Name', 'Your Player Name has been updated.', 'Close');
}

function onKeyDown(e) {
    if (!activePopup) return;
    if (e.key === 'Enter') {
        if (activePopup.kind === 'nameChange' && e.target?.id === 'changeName') {
            e.preventDefault();
            submitActiveNameChange();
            return;
        }
        if (activePopup.kind === 'sortFilter' && e.target?.id === 'charaFilterSearchInput') {
            e.preventDefault();
            const filters = readFilterStateFromPopup(activePopup.el);
            const cb = activePopup.onApply;
            closeActivePopup();
            if (cb) cb(filters);
            return;
        }
    }
    if (e.key !== 'Escape' || !activePopup.canClose) return;
    e.preventDefault();
    closeActivePopup();
}

function onPopupClick(e) {
    if (!activePopup) return;

    if (activePopup.kind === 'nameChange') {
        if (e.target.closest('#nameChangePopWrap .decideBtn')) {
            e.preventDefault();
            e.stopPropagation();
            submitActiveNameChange();
            return;
        }
    }

    if (activePopup.kind === 'uiHide') {
        if (e.target.closest('.uiHidePop .decideBtn')) {
            e.preventDefault();
            e.stopPropagation();
            const cb = activePopup.onConfirm;
            closeActivePopup();
            if (cb) cb();
            return;
        }
    }

    if (activePopup.kind === 'cameraHelp') {
        const rowBtn = e.target.closest('#cameraHelpPop .colLow');
        if (rowBtn) {
            e.preventDefault();
            e.stopPropagation();
            const row = rowBtn.closest('.helpRows');
            row?.querySelector('.panArrow')?.classList.toggle('on');
            row?.querySelector('.colText')?.classList.toggle('open');
            return;
        }
    }

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
        if (e.target.closest('#sortFilterPop #filterNameClear')) {
            e.preventDefault();
            e.stopPropagation();
            const input = activePopup.el.querySelector('#charaFilterSearchInput');
            if (input) {
                input.value = '';
                input.focus();
            }
            return;
        }
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
            window.location.hash = '#/CollectionTop';
            return;
        }
        if (e.target.closest('.etcPopWrap .configBtn')) {
            e.preventDefault();
            e.stopPropagation();
            closeActivePopup();
            window.location.hash = '#/ConfigTop';
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
        if (e.target.closest('#myProfile .userIdCopyBtn')) {
            e.preventDefault();
            e.stopPropagation();
            copyTextToClipboard(getPlayerId()).then(() => {
                openConfigNoticePopup('Player ID', 'Copied to your clipboard.', 'OK');
            });
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
    syncPopupAreaBounds();
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
