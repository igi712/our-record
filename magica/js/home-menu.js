// js/home-menu.js — GlobalMenu controller for the homescreen (#/MyPage)
//
// Recreates the original Magia Record MyPage behaviors in plain JS:
//   - the side menu is CLOSED by default; on MyPage it is auto-opened only once
//     the home screen (background + BGM + model) has finished loading
//     (revealHomeMenu is invoked from quotes-main.js revealHomeScreen)
//   - on MyPage the #sideMenuBg backdrop and .homeBtn are hidden (noneDisp),
//     matching GlobalMenuView.pagePerHandler
//   - the #menu capsule toggles the menu open/closed with the original
//     `.anim` / `.close` state classes, and drives the MyPage left column via
//     the mypage.js menuShow()/menuHide() callbacks (window.mypageMenuShow /
//     window.mypageMenuHide), replicating GlobalMenuView.menuToggle's coupling
//   - hover / press overlays (.overlayOn, .touch)
//   - data-href routing: Unit -> #/CharaCollection, homeBtn -> #/MyPage,
//     everything else no-op
//   - static demo values for the player status bar (no live game data)

import { resetMyPage } from './mypage.js';

// Static demo values for the top-left player status bar.
export const HOME_STATUS_DEMO = {
    rank: '1',
    expRemain: 'あと 100',
    expPercent: 40,
    money: '12345',
    acp: 74,
    maxAcp: 156
};

const MENU_OVERLAY = '#globalMenu .btnOverlay, #sideMenu .btnOverlay';
const MENU_LINK = '#globalMenu [data-href], #sideMenu [data-href]';
const MENU_TOGGLE = '#sideMenu #menu';

let bound = false;
let pressedEl = null;

function fillStatusDemo() {
    const exp = document.getElementById('exp');
    if (!exp) return;

    const rankEl = exp.querySelector('.userRank');
    if (rankEl) {
        rankEl.innerHTML = '';
        for (const ch of String(HOME_STATUS_DEMO.rank)) {
            const img = document.createElement('img');
            img.src = `magica/resource/image_web/common/number/${ch}.png`;
            img.alt = ch;
            rankEl.appendChild(img);
        }
    }

    const pointWrap = exp.querySelector('.pointWrap');
    if (pointWrap) pointWrap.textContent = HOME_STATUS_DEMO.expRemain;

    const gaugeInner = exp.querySelector('.gaugeInner');
    if (gaugeInner) gaugeInner.style.width = `${HOME_STATUS_DEMO.expPercent}%`;

    const moneyEl = document.querySelector('#money .pointWrap');
    if (moneyEl) moneyEl.textContent = String(HOME_STATUS_DEMO.money);

    const acpEl = document.querySelector('#ap .ACP');
    const maxAcpEl = document.querySelector('#ap .MAX_ACP');
    if (acpEl) acpEl.textContent = HOME_STATUS_DEMO.acp;
    if (maxAcpEl) maxAcpEl.textContent = HOME_STATUS_DEMO.maxAcp;
}

function setMenuOpen(open, { chrome = true } = {}) {
    const sideMenu = document.getElementById('sideMenu');
    const sideMenuBg = document.getElementById('sideMenuBg');
    if (!sideMenu) return;

    if (open) {
        sideMenu.classList.remove('close');
        sideMenu.classList.add('anim');
        if (sideMenuBg) {
            sideMenuBg.classList.remove('close');
            sideMenuBg.classList.add('anim');
        }
        if (chrome && typeof window.mypageMenuShow === 'function') {
            window.mypageMenuShow();
        }
    } else {
        sideMenu.classList.remove('anim');
        sideMenu.classList.add('close');
        if (sideMenuBg) {
            sideMenuBg.classList.remove('anim');
            sideMenuBg.classList.add('close');
        }
        if (chrome && typeof window.mypageMenuHide === 'function') {
            window.mypageMenuHide();
        }
    }
    // chrome:false (initial reveal) animates only the right-side menu; the
    // column/status/Live2D choreography is skipped so they stay static until
    // their own reveal points (MyPage visibility, revealHomeScreen).
    if (chrome && typeof window.mypageMenuChoreography === 'function') {
        window.mypageMenuChoreography(open);
    }
}

function toggleMenu() {
    const sideMenu = document.getElementById('sideMenu');
    if (!sideMenu) return;
    setMenuOpen(!sideMenu.classList.contains('anim'));
}

function setMenuClosed() {
    const sideMenu = document.getElementById('sideMenu');
    if (!sideMenu) return;
    sideMenu.classList.remove('anim', 'close');
    const sideMenuBg = document.getElementById('sideMenuBg');
    if (sideMenuBg) sideMenuBg.classList.remove('anim', 'close', 'noneDisp');
    const homeBtn = sideMenu.querySelector('.homeBtn');
    if (homeBtn) homeBtn.classList.remove('noneDisp');
    const status = document.querySelector('#globalMenu .user #status');
    if (status) status.classList.remove('myPageShow', 'myPageHide');
}

function hideMenuUI() {
    const globalMenu = document.getElementById('globalMenu');
    const sideMenu = document.getElementById('sideMenu');
    if (globalMenu) globalMenu.style.visibility = 'hidden';
    if (sideMenu) sideMenu.style.visibility = 'hidden';
}

function showMenuUI() {
    const globalMenu = document.getElementById('globalMenu');
    const sideMenu = document.getElementById('sideMenu');
    if (globalMenu) globalMenu.style.visibility = 'visible';
    if (sideMenu) sideMenu.style.visibility = 'visible';
}

function clearPress() {
    if (pressedEl) {
        pressedEl.classList.remove('overlayOn');
        pressedEl.classList.remove('touch');
        pressedEl = null;
    }
}

function onPointerDown(e) {
    const el = e.target.closest(MENU_OVERLAY);
    if (!el) return;
    clearPress();
    pressedEl = el;
    el.classList.add('overlayOn');
    el.classList.add('touch');
}

function onPointerUp() {
    clearPress();
}

function onMouseOver(e) {
    const el = e.target.closest(MENU_OVERLAY);
    if (el && el !== pressedEl) el.classList.add('overlayOn');
}

function onMouseOut(e) {
    const el = e.target.closest(MENU_OVERLAY);
    if (el && el !== pressedEl) el.classList.remove('overlayOn');
}

function onClick(e) {
    const menuBtn = e.target.closest(MENU_TOGGLE);
    if (menuBtn) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
        return;
    }

    const link = e.target.closest(MENU_LINK);
    if (!link) return;
    e.preventDefault();
    e.stopPropagation();

    const href = link.dataset.href;
    if (href === '#/CharaListTop') {
        window.location.hash = '#/CharaCollection';
    } else if (href === '#/MyPage') {
        window.location.hash = '#/MyPage';
    }
    // All other routes (#/MemoriaTop, #/FormationTop, #/GachaTop, #/MissionTop,
    // #/ShopTop, #/PatrolTop, #/MainQuest, #/Scene0Top) are no-ops.
}

function bindEvents() {
    if (bound) return;
    bound = true;
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('pointerup', onPointerUp, true);
    document.addEventListener('pointercancel', onPointerUp, true);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('click', onClick);
}

export function initHomeMenu() {
    const sideMenu = document.getElementById('sideMenu');
    if (!sideMenu) return;

    fillStatusDemo();
    bindEvents();

    // Mount in the closed, hidden state. The default template state ships 0/0
    // in the status bar, so the whole menu stays hidden until the reveal (the
    // side menu's closed state already renders it invisible — same pattern).
    setMenuClosed();
    hideMenuUI();
}

export function revealHomeMenu() {
    const sideMenu = document.getElementById('sideMenu');
    if (!sideMenu) return;

    showMenuUI();
    setMenuOpen(true, { chrome: false });

    // On MyPage the backdrop and home button are suppressed.
    const sideMenuBg = document.getElementById('sideMenuBg');
    if (sideMenuBg) sideMenuBg.classList.add('noneDisp');
    const homeBtn = sideMenu.querySelector('.homeBtn');
    if (homeBtn) homeBtn.classList.add('noneDisp');

    // The left utility column + carousel were hidden (visibility) during the
    // load; per the in-game sequence they fade IN PLACE ~180ms after the
    // right-side menu starts sliding in, instead of being visible from the
    // start or re-running the menu-toggle slide.
    scheduleColumnReveal();
}

let columnRevealId = 0;

function scheduleColumnReveal() {
    const id = ++columnRevealId;
    setTimeout(() => {
        if (id !== columnRevealId) return;
        const myPage = document.getElementById('MyPage');
        if (!myPage) return;
        myPage.style.visibility = 'visible';
        myPage.classList.add('reveal');
    }, 180);
}

export function resetHomeMenu() {
    clearPress();
    columnRevealId++;
    showMenuUI();
    setMenuClosed();
    const myPage = document.getElementById('MyPage');
    if (myPage) myPage.classList.remove('reveal');
    // The banner container may carry .hide from a menu-close; clear it so the
    // next reveal shows the carousel again.
    const banner = document.getElementById('mypageBanner');
    if (banner) banner.classList.remove('hide');
    resetMyPage();
}
