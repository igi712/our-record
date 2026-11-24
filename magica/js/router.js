// magica/js/router.js — Hash router for the Magia Record SPA (/magica/index.html)

import { loadViewTemplate } from './view-loader.js';
import { magicaUrl } from './paths.js';
import { initHomeMenu, resetHomeMenu, initGlobalMenuForPage } from './home-menu.js';
import { enterMyPage, leaveMyPage } from './mypage.js';
import { enterBackgroundSet, leaveBackgroundSet } from './background-set.js';
import { enterCharaTop, leaveCharaTop } from './chara-top.js';
import { enterCameraTop, leaveCameraTop } from './camera-top.js';
import { enterCharaCollection, leaveCharaCollection } from './viewer/chara-collection.js';
import { enterCharaCollectionDetail, leaveCharaCollectionDetail } from './chara-collection-detail.js';

let routeGeneration = 0;
let activeRouteKey = null;

function resolveRouteKey(hash) {
    if (hash.startsWith('#/BackgroundSet')) return 'BackgroundSet';
    if (hash.startsWith('#/CharaListTop')) return 'CharaListTop';
    if (hash.startsWith('#/CameraTop')) return 'CameraTop';
    if (hash.startsWith('#/CharaCollectionDetail')) return 'CharaCollectionDetail';
    if (hash.startsWith('#/CharaCollection')) return 'CharaCollection';
    return 'MyPage';
}

function isHomeFamilyRoute(routeKey) {
    return routeKey === 'MyPage'
        || routeKey === 'BackgroundSet'
        || routeKey === 'CharaListTop'
        || routeKey === 'CameraTop';
}

async function loadRouteTemplate(relPath, generation, ...staleHideIds) {
    const mounted = await loadViewTemplate(magicaUrl(relPath), 'ui-layer');
    if (generation === routeGeneration) return true;
    if (mounted) {
        for (const id of staleHideIds) {
            const el = document.getElementById(id);
            if (!el) continue;
            if (id === 'sideMenu') el.style.visibility = 'hidden';
            else el.style.display = 'none';
        }
    }
    return false;
}

function setupBackBtn() {
    const handleBack = (e) => {
        if (e) e.preventDefault();
        const currentHash = window.location.hash;
        if (currentHash.startsWith('#/CharaCollectionDetail')) {
            window.location.hash = '#/CharaCollection';
        } else if (currentHash.startsWith('#/BackgroundSet')) {
            const q = currentHash.split('?')[1];
            window.location.hash = q ? `#/MyPage?${q}` : '#/MyPage';
        } else if (currentHash.startsWith('#/CharaListTop')) {
            window.location.hash = '#/MyPage';
        } else {
            window.location.href = '../index.html';
        }
    };

    const globalBackBtn = document.getElementById('globalBackBtn');
    const backBtn = document.getElementById('backBtn');
    if (globalBackBtn) globalBackBtn.onclick = handleBack;
    if (backBtn) backBtn.onclick = handleBack;
}

function hideAllViews() {
    const ids = ['CharaCollection', 'cardDetail', 'MyPage', 'BackgroundSet', 'CharaTop', 'CameraTop'];
    for (const id of ids) {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    }
}

function leaveActiveRoute(nextRouteKey) {
    switch (activeRouteKey) {
        case 'MyPage':
            leaveMyPage({ keepHomeCache: isHomeFamilyRoute(nextRouteKey) });
            break;
        case 'BackgroundSet':
            leaveBackgroundSet();
            break;
        case 'CharaListTop':
            leaveCharaTop();
            break;
        case 'CameraTop':
            leaveCameraTop();
            break;
        case 'CharaCollection':
            leaveCharaCollection();
            break;
        case 'CharaCollectionDetail':
            leaveCharaCollectionDetail();
            break;
        default:
            break;
    }
    if (!isHomeFamilyRoute(nextRouteKey)) {
        // Clear any cached MyPage state when leaving the Home family entirely.
        leaveMyPage({ keepHomeCache: false });
    }
}

export async function handleRoute() {
    const generation = ++routeGeneration;
    const rawHash = window.location.hash;
    const hash = (!rawHash || rawHash === '#' || rawHash === '#/') ? '#/MyPage' : rawHash;
    const uiLayer = document.getElementById('ui-layer');
    if (!uiLayer) return;

    const nextRouteKey = resolveRouteKey(hash);
    leaveActiveRoute(nextRouteKey);
    activeRouteKey = nextRouteKey;
    resetHomeMenu();

    if (nextRouteKey === 'MyPage') {
        let homeMenuEl = document.getElementById('globalMenu');
        if (!homeMenuEl) {
            if (!await loadRouteTemplate('template/base/GlobalMenu.html', generation, 'globalMenu', 'sideMenu')) return;
            homeMenuEl = document.getElementById('globalMenu');
        }
        if (homeMenuEl) homeMenuEl.style.visibility = 'hidden';
        const sideMenuEl = document.getElementById('sideMenu');
        if (sideMenuEl) sideMenuEl.style.visibility = 'hidden';
        if (!await loadRouteTemplate('template/base/MyPage.html', generation, 'MyPage')) return;

        hideAllViews();
        const myPageEl = document.getElementById('MyPage');
        const globalBackBtn = document.getElementById('globalBackBtn');
        if (homeMenuEl) homeMenuEl.style.display = 'block';
        if (myPageEl) {
            myPageEl.style.display = 'block';
            myPageEl.style.visibility = 'hidden';
        }
        if (globalBackBtn) globalBackBtn.style.display = 'none';

        setupBackBtn();
        initHomeMenu();
        await enterMyPage();
    } else if (nextRouteKey === 'BackgroundSet') {
        let bgSetEl = document.getElementById('BackgroundSet');
        if (!bgSetEl) {
            if (!await loadRouteTemplate('template/user/BackgroundSet.html', generation, 'BackgroundSet')) return;
            bgSetEl = document.getElementById('BackgroundSet');
        }

        hideAllViews();
        const homeMenuEl = document.getElementById('globalMenu');
        const sideMenuEl = document.getElementById('sideMenu');
        const globalBackBtn = document.getElementById('globalBackBtn');
        if (homeMenuEl) homeMenuEl.style.display = 'none';
        if (sideMenuEl) sideMenuEl.style.visibility = 'hidden';
        if (bgSetEl) bgSetEl.style.display = 'block';
        if (globalBackBtn) globalBackBtn.style.display = 'block';

        setupBackBtn();
        await enterBackgroundSet();
    } else if (nextRouteKey === 'CharaListTop') {
        let homeMenuEl = document.getElementById('globalMenu');
        if (!homeMenuEl) {
            if (!await loadRouteTemplate('template/base/GlobalMenu.html', generation, 'globalMenu', 'sideMenu')) return;
            homeMenuEl = document.getElementById('globalMenu');
        }
        let charaTopEl = document.getElementById('CharaTop');
        if (!charaTopEl) {
            if (!await loadRouteTemplate('template/chara/CharaTop.html', generation, 'CharaTop')) return;
            charaTopEl = document.getElementById('CharaTop');
        }

        hideAllViews();
        const globalBackBtn = document.getElementById('globalBackBtn');
        if (homeMenuEl) homeMenuEl.style.display = 'block';
        if (charaTopEl) charaTopEl.style.display = 'block';
        if (globalBackBtn) globalBackBtn.style.display = 'block';

        setupBackBtn();
        initGlobalMenuForPage();
        const urlParams = new URLSearchParams(hash.split('?')[1] || '');
        const pathMatch = hash.match(/^#\/CharaListTop\/(\d{4})\b/);
        const rawId = urlParams.get('id') || (pathMatch ? pathMatch[1] : '');
        const initialCharaId = /^\d{4}$/.test(rawId) ? Number(rawId) : undefined;
        await enterCharaTop({ initialCharaId });
    } else if (nextRouteKey === 'CameraTop') {
        let cameraTopEl = document.getElementById('CameraTop');
        if (!cameraTopEl) {
            if (!await loadRouteTemplate('template/camera/CameraTop.html', generation, 'CameraTop')) return;
            cameraTopEl = document.getElementById('CameraTop');
        }

        hideAllViews();
        const homeMenuEl = document.getElementById('globalMenu');
        const sideMenuEl = document.getElementById('sideMenu');
        const globalBackBtn = document.getElementById('globalBackBtn');
        if (homeMenuEl) homeMenuEl.style.display = 'none';
        if (sideMenuEl) sideMenuEl.style.visibility = 'hidden';
        if (globalBackBtn) globalBackBtn.style.display = 'none';
        if (cameraTopEl) cameraTopEl.style.display = 'block';

        setupBackBtn();
        const urlParams = new URLSearchParams(hash.split('?')[1] || '');
        const rawId = urlParams.get('id') || '';
        const initialCharaId = /^\d{4}$/.test(rawId) ? Number(rawId) : undefined;
        await enterCameraTop({ initialCharaId });
    } else if (nextRouteKey === 'CharaCollectionDetail') {
        let charaDetailEl = document.getElementById('cardDetail');
        if (!charaDetailEl) {
            if (!await loadRouteTemplate('template/collection/CharaCollectionDetail.html', generation, 'cardDetail')) return;
            charaDetailEl = document.getElementById('cardDetail');
        }

        hideAllViews();
        const homeMenuEl = document.getElementById('globalMenu');
        const sideMenuEl = document.getElementById('sideMenu');
        const globalBackBtn = document.getElementById('globalBackBtn');
        if (homeMenuEl) homeMenuEl.style.display = 'none';
        if (sideMenuEl) sideMenuEl.style.visibility = 'hidden';
        if (charaDetailEl) charaDetailEl.style.display = 'block';
        if (globalBackBtn) globalBackBtn.style.display = 'block';

        setupBackBtn();
        const urlParams = new URLSearchParams(hash.split('?')[1] || '');
        const charaId = Number(urlParams.get('id')) || 1001;
        await enterCharaCollectionDetail({ charaId });
    } else {
        let charaCollectionEl = document.getElementById('CharaCollection');
        if (!charaCollectionEl) {
            if (!await loadRouteTemplate('template/collection/CharaCollection.html', generation, 'CharaCollection')) return;
            charaCollectionEl = document.getElementById('CharaCollection');
        }

        hideAllViews();
        const homeMenuEl = document.getElementById('globalMenu');
        const sideMenuEl = document.getElementById('sideMenu');
        const globalBackBtn = document.getElementById('globalBackBtn');
        if (homeMenuEl) homeMenuEl.style.display = 'none';
        if (sideMenuEl) sideMenuEl.style.visibility = 'hidden';
        if (charaCollectionEl) charaCollectionEl.style.display = 'block';
        if (globalBackBtn) globalBackBtn.style.display = 'block';

        setupBackBtn();
        await enterCharaCollection();
    }
}

export function initRouter() {
    window.addEventListener('hashchange', () => {
        handleRoute().catch((e) => console.error('[router] Route change failed:', e));
    });
    return handleRoute();
}
