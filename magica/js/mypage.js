// js/mypage.js — MyPage left-edge utility column controller (#/MyPage)
//
// Plain-JS port of the original MyPage.js Backbone view (no game data):
//   - static demo data: present count, banner art, event end date
//   - press feedback (.touch, brightness 120%) on the column buttons;
//     #present / #announce / #favoriteChara are no-ops, #config opens the
//     EtcPopup via the popups.js module (lazy-imported, wired in STEP-009)
//   - #presentBadge count + present-icon shake (.anim) when gifts are pending
//   - #mypageBanner carousel: 3s dwell per banner driven by the CSS
//     banner_stop / banner_slideIn / banner_slideOut keyframes (animationend
//     state machine, per BannerView.js), indicator dots synced; the cycle
//     stops on route leave (resetMyPage)
//   - menuShow()/menuHide() API: toggles #MyPage.menuShow/.menuHide,
//     #status .myPageShow/.myPageHide, and #mypageBanner.hide together, as
//     GlobalMenuView.menuToggle did; home-menu.js calls them via
//     window.mypageMenuShow / window.mypageMenuHide

// Static demo values for the MyPage left column (no live game data).
export const MYPAGE_DEMO = {
    presentCount: 5,
    banners: [
        'magica/resource/image_web/banner/announce/banner_0705_m.png',
        'magica/resource/image_web/banner/announce/banner_0737_m.png',
        'magica/resource/image_web/banner/announce/banner_0742_m.png',
        'magica/resource/image_web/banner/announce/banner_0747_m.png',
        'magica/resource/image_web/banner/announce/banner_0750_m.png'
    ],
    eventEndAt: '12/4まで'
};

const COLUMN_OVERLAY = '#MyPage #favoriteChara .tapArea, #MyPage #etcMenu span.se_decide, #MyPage #live2dMenu span.se_decide';

let bound = false;
let pressedEl = null;
let bannerActive = false;
let bannerIndex = 0;
let bannerLength = 0;

function fillDemoData() {
    const present = document.getElementById('present');
    if (present && MYPAGE_DEMO.presentCount > 0) present.classList.add('anim');

    const badge = document.getElementById('presentBadge');
    if (badge) badge.textContent = String(MYPAGE_DEMO.presentCount);

    renderBanner();
}

function renderBanner() {
    const banner = document.getElementById('mypageBanner');
    if (!banner) return;
    banner.innerHTML = '';

    bannerLength = MYPAGE_DEMO.banners.length;
    bannerIndex = 0;
    bannerActive = false;

    MYPAGE_DEMO.banners.forEach((src, index) => {
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

// Start the carousel when the home screen reveal reaches its banner phase:
// the first item is left without .show (base rule keeps it at opacity 0) so
// it slides in from the right on demand instead of being fully visible.
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
    if (on) dots[index].classList.add('on');
    else dots[index].classList.remove('on');
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

    const status = document.querySelector('#globalMenu .user #status');
    if (status) {
        status.classList.remove('myPageHide');
        status.classList.add('myPageShow');
    }

    const banner = document.getElementById('mypageBanner');
    if (banner) banner.classList.remove('hide');

    // The reveal choreography (quotes-main.js revealHomeScreen) is what starts
    // the carousel, but a menu toggle cancels that choreography via
    // cancelMenuChoreography before the 120ms banner timer fires, leaving the
    // carousel stuck off (review P2). Re-arm it here: startBannerCarousel is
    // bannerActive-guarded so once it is running this is a no-op, and any
    // menu reopen restarts a suppressed carousel.
    startBannerCarousel();
}

export function mypageMenuHide() {
    const myPage = document.getElementById('MyPage');
    if (!myPage) return;
    myPage.classList.remove('menuShow');
    myPage.classList.add('menuHide');

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

function onPointerDown(e) {
    const el = e.target.closest(COLUMN_OVERLAY);
    if (!el) return;
    clearPress();
    pressedEl = el;
    el.classList.add('touch');
}

function onPointerUp() {
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

function onClick(e) {
    if (!e.target.closest('#config')) return;
    e.preventDefault();
    e.stopPropagation();
    openEtcPopup();
}

function bindEvents() {
    if (bound) return;
    bound = true;
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('pointerup', onPointerUp, true);
    document.addEventListener('pointercancel', onPointerUp, true);
    document.addEventListener('click', onClick);
    document.addEventListener('animationend', onBannerAnimationEnd);
}

export function initMyPage() {
    const myPage = document.getElementById('MyPage');
    if (!myPage) return;

    fillDemoData();
    bindEvents();
    window.mypageMenuShow = mypageMenuShow;
    window.mypageMenuHide = mypageMenuHide;
    window.startBannerCarousel = startBannerCarousel;
}

export function resetMyPage() {
    clearPress();
    bannerActive = false;
}
