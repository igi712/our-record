// magica/js/router.js — Hash router for the Magia Record SPA (/magica/index.html)

import { loadViewTemplate } from './view-loader.js';
import { magicaUrl } from './paths.js';
import {
    initGlobalMenuForPage,
    collapseSideMenuForTransition,
    configureGlobalMenuForMyPage
} from './home-menu.js';
import { hasActiveStageModels } from './engine/l2d-stage.js';
import { enterMyPage, leaveMyPage } from './mypage.js';
import { enterBackgroundSet, leaveBackgroundSet } from './background-set.js';
import { enterCharaTop, leaveCharaTop } from './chara-top.js';
import { enterCameraTop, leaveCameraTop } from './camera-top.js';
import { enterConfigTop, leaveConfigTop } from './config-top.js';
import { enterCollectionTop, leaveCollectionTop } from './collection-top.js';
import { enterCharaCollection, leaveCharaCollection } from './viewer/chara-collection.js';
import { enterCharaCollectionDetail, leaveCharaCollectionDetail } from './chara-collection-detail.js';

const OPENED_FROM_ROOT_INDEX = (() => {
    try {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation?.type === 'reload') return false;
        if (!document.referrer) return false;
        const referrer = new URL(document.referrer);
        if (referrer.origin !== window.location.origin) return false;
        const path = referrer.pathname.replace(/\/+$/, '');
        return !path.endsWith('/magica/index.html') && (path === '' || path.endsWith('/index.html'));
    } catch {
        return false;
    }
})();

let routeGeneration = 0;
let activeRouteKey = null;
let collectionEntrySource = OPENED_FROM_ROOT_INDEX ? 'index' : 'direct';

function resolveRouteKey(hash) {
    if (hash.startsWith('#/BackgroundSet')) return 'BackgroundSet';
    if (hash.startsWith('#/CharaListTop')) return 'CharaListTop';
    if (hash.startsWith('#/CameraTop')) return 'CameraTop';
    if (hash.startsWith('#/ConfigTop')) return 'ConfigTop';
    if (hash.startsWith('#/CollectionTop')) return 'CollectionTop';
    if (hash.startsWith('#/CharaCollectionDetail')) return 'CharaCollectionDetail';
    if (hash.startsWith('#/CharaCollection')) return 'CharaCollection';
    return 'MyPage';
}

function isHomeFamilyRoute(routeKey) {
    return routeKey === 'MyPage'
        || routeKey === 'BackgroundSet'
        || routeKey === 'CharaListTop'
        || routeKey === 'CameraTop'
        || routeKey === 'ConfigTop';
}

async function loadRouteTemplate(relPath, generation, ...hiddenIds) {
    const mounted = await loadViewTemplate(magicaUrl(relPath), 'ui-layer');
    if (mounted) {
        for (const id of hiddenIds) {
            const el = document.getElementById(id);
            if (!el) continue;
            if (id === 'globalMenu' || id === 'sideMenu') el.style.visibility = 'hidden';
            else el.style.display = 'none';
        }
    }
    return generation === routeGeneration;
}

function setupBackBtn() {
    const handleBack = (e) => {
        if (e) e.preventDefault();
        const currentHash = window.location.hash;
        if (currentHash.startsWith('#/CharaCollectionDetail')) {
            window.location.hash = '#/CharaCollection';
        } else if (currentHash.startsWith('#/CharaCollection')) {
            if (collectionEntrySource === 'archive') {
                window.location.hash = '#/CollectionTop';
            } else if (collectionEntrySource === 'index') {
                window.location.href = '../index.html';
            } else {
                window.location.hash = '#/MyPage';
            }
        } else if (currentHash.startsWith('#/CollectionTop')) {
            window.location.hash = '#/MyPage';
        } else if (currentHash.startsWith('#/ConfigTop')) {
            window.location.hash = '#/MyPage';
        } else if (currentHash.startsWith('#/BackgroundSet')) {
            const q = currentHash.split('?')[1];
            window.location.hash = q ? `#/MyPage?${q}` : '#/MyPage';
        } else if (currentHash.startsWith('#/CharaListTop')) {
            window.location.hash = '#/MyPage';
        } else {
            window.location.hash = '#/MyPage';
        }
    };

    const globalBackBtn = document.getElementById('globalBackBtn');
    const backBtn = document.getElementById('backBtn');
    if (globalBackBtn) globalBackBtn.onclick = handleBack;
    if (backBtn) backBtn.onclick = handleBack;
}

function hideAllViews() {
    const ids = ['CharaCollection', 'CollectionTop', 'ConfigTop', 'cardDetail', 'MyPage', 'BackgroundSet', 'CharaTop', 'CameraTop'];
    for (const id of ids) {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    }
}

function leaveActiveRoute(nextRouteKey) {
    switch (activeRouteKey) {
        case 'MyPage':
            leaveMyPage({ keepHomeCache: isHomeFamilyRoute(nextRouteKey), keepStage: true });
            break;
        case 'BackgroundSet':
            leaveBackgroundSet({ keepStage: true });
            break;
        case 'CharaListTop':
            leaveCharaTop();
            break;
        case 'CameraTop':
            leaveCameraTop({ keepStage: true });
            break;
        case 'ConfigTop':
            leaveConfigTop();
            break;
        case 'CollectionTop':
            leaveCollectionTop({ keepStage: true });
            break;
        case 'CharaCollection':
            leaveCharaCollection();
            break;
        case 'CharaCollectionDetail':
            leaveCharaCollectionDetail({ keepStage: true });
            break;
        default:
            break;
    }
    if (!isHomeFamilyRoute(nextRouteKey) && activeRouteKey !== 'MyPage') {
        // Clear any cached MyPage state when leaving the Home family entirely.
        leaveMyPage({ keepHomeCache: false, keepStage: true });
    }
}

export async function handleRoute() {
    const generation = ++routeGeneration;
    const rawHash = window.location.hash;
    const hash = (!rawHash || rawHash === '#' || rawHash === '#/') ? '#/MyPage' : rawHash;
    const uiLayer = document.getElementById('ui-layer');
    if (!uiLayer) return;

    const prevRouteKey = activeRouteKey;
    const nextRouteKey = resolveRouteKey(hash);
    if (nextRouteKey === 'CharaCollection') {
        if (prevRouteKey === 'CollectionTop') {
            collectionEntrySource = 'archive';
        } else if (prevRouteKey === null && OPENED_FROM_ROOT_INDEX) {
            collectionEntrySource = 'index';
        } else if (prevRouteKey !== 'CharaCollectionDetail') {
            collectionEntrySource = 'direct';
        }
    }
    const hadLive2d = hasActiveStageModels();

    // Phase 1: hide outgoing page UI immediately while keeping top global chrome & Live2D stage alive.
    hideAllViews();
    leaveActiveRoute(nextRouteKey);
    activeRouteKey = nextRouteKey;
    if (prevRouteKey !== null) {
        collapseSideMenuForTransition();
    }

    document.body.classList.add('connecting');
    uiLayer.classList.add('route-transitioning');

    try {
        if (nextRouteKey === 'MyPage') {
            if (!document.getElementById('globalMenu')) {
                if (!await loadRouteTemplate('template/base/GlobalMenu.html', generation, 'globalMenu', 'sideMenu')) return;
            }
            if (!document.getElementById('MyPage')) {
                if (!await loadRouteTemplate('template/base/MyPage.html', generation, 'MyPage')) return;
            }

            await enterMyPage({
                hasStageToUnload: hadLive2d,
                onBeforeReveal: () => {
                    if (generation !== routeGeneration) return;
                    const myPageEl = document.getElementById('MyPage');
                    const globalBackBtn = document.getElementById('globalBackBtn');
                    if (globalBackBtn) globalBackBtn.style.display = 'none';
                    configureGlobalMenuForMyPage();
                    if (myPageEl) {
                        myPageEl.style.display = 'block';
                        myPageEl.style.visibility = 'hidden';
                    }
                    setupBackBtn();
                    uiLayer.classList.remove('route-transitioning');
                }
            });
        } else if (nextRouteKey === 'BackgroundSet') {
            if (!document.getElementById('BackgroundSet')) {
                if (!await loadRouteTemplate('template/user/BackgroundSet.html', generation, 'BackgroundSet')) return;
            }

            await enterBackgroundSet({
                hadLive2d,
                onBeforeReveal: () => {
                    if (generation !== routeGeneration) return;
                    const bgSetEl = document.getElementById('BackgroundSet');
                    const homeMenuEl = document.getElementById('globalMenu');
                    const sideMenuEl = document.getElementById('sideMenu');
                    const globalBackBtn = document.getElementById('globalBackBtn');
                    if (homeMenuEl) homeMenuEl.style.display = 'none';
                    if (sideMenuEl) sideMenuEl.style.visibility = 'hidden';
                    if (bgSetEl) bgSetEl.style.display = 'block';
                    if (globalBackBtn) globalBackBtn.style.display = 'block';
                    setupBackBtn();
                    uiLayer.classList.remove('route-transitioning');
                }
            });
        } else if (nextRouteKey === 'CharaListTop') {
            if (!document.getElementById('globalMenu')) {
                if (!await loadRouteTemplate('template/base/GlobalMenu.html', generation, 'globalMenu', 'sideMenu')) return;
            }
            if (!document.getElementById('CharaTop')) {
                if (!await loadRouteTemplate('template/chara/CharaTop.html', generation, 'CharaTop')) return;
            }

            const urlParams = new URLSearchParams(hash.split('?')[1] || '');
            const pathMatch = hash.match(/^#\/CharaListTop\/(\d{4})\b/);
            const rawId = urlParams.get('id') || (pathMatch ? pathMatch[1] : '');
            const initialCharaId = /^\d{4}$/.test(rawId) ? Number(rawId) : undefined;

            await enterCharaTop({
                initialCharaId,
                hadLive2d,
                onBeforeReveal: () => {
                    if (generation !== routeGeneration) return;
                    document.body.classList.remove('connecting');
                    const homeMenuEl = document.getElementById('globalMenu');
                    const charaTopEl = document.getElementById('CharaTop');
                    const globalBackBtn = document.getElementById('globalBackBtn');
                    if (homeMenuEl) homeMenuEl.style.display = 'block';
                    initGlobalMenuForPage();
                    if (charaTopEl) charaTopEl.style.display = 'block';
                    if (globalBackBtn) globalBackBtn.style.display = 'block';
                    setupBackBtn();
                    uiLayer.classList.remove('route-transitioning');
                }
            });
        } else if (nextRouteKey === 'CameraTop') {
            if (!document.getElementById('CameraTop')) {
                if (!await loadRouteTemplate('template/camera/CameraTop.html', generation, 'CameraTop')) return;
            }

            const urlParams = new URLSearchParams(hash.split('?')[1] || '');
            const rawId = urlParams.get('id') || '';
            const initialCharaId = /^\d{4}$/.test(rawId) ? Number(rawId) : undefined;

            await enterCameraTop({
                initialCharaId,
                hadLive2d,
                onBeforeReveal: () => {
                    if (generation !== routeGeneration) return;
                    const cameraTopEl = document.getElementById('CameraTop');
                    const homeMenuEl = document.getElementById('globalMenu');
                    const sideMenuEl = document.getElementById('sideMenu');
                    const globalBackBtn = document.getElementById('globalBackBtn');
                    if (homeMenuEl) homeMenuEl.style.display = 'none';
                    if (sideMenuEl) sideMenuEl.style.visibility = 'hidden';
                    if (globalBackBtn) globalBackBtn.style.display = 'none';
                    if (cameraTopEl) cameraTopEl.style.display = 'block';
                    setupBackBtn();
                    uiLayer.classList.remove('route-transitioning');
                }
            });
        } else if (nextRouteKey === 'ConfigTop') {
            if (!document.getElementById('globalMenu')) {
                if (!await loadRouteTemplate('template/base/GlobalMenu.html', generation, 'globalMenu', 'sideMenu')) return;
            }
            if (!document.getElementById('ConfigTop')) {
                if (!await loadRouteTemplate('template/config/ConfigTop.html', generation, 'ConfigTop')) return;
            }

            await enterConfigTop({
                hadLive2d,
                onBeforeReveal: () => {
                    if (generation !== routeGeneration) return;
                    const homeMenuEl = document.getElementById('globalMenu');
                    const configTopEl = document.getElementById('ConfigTop');
                    const globalBackBtn = document.getElementById('globalBackBtn');
                    if (homeMenuEl) homeMenuEl.style.display = 'block';
                    initGlobalMenuForPage({ showHelp: false });
                    if (configTopEl) configTopEl.style.display = 'block';
                    if (globalBackBtn) globalBackBtn.style.display = 'block';
                    setupBackBtn();
                    uiLayer.classList.remove('route-transitioning');
                }
            });
        } else if (nextRouteKey === 'CollectionTop') {
            if (!document.getElementById('globalMenu')) {
                if (!await loadRouteTemplate('template/base/GlobalMenu.html', generation, 'globalMenu', 'sideMenu')) return;
            }
            if (!document.getElementById('CollectionTop')) {
                if (!await loadRouteTemplate('template/collection/CollectionTop.html', generation, 'CollectionTop')) return;
            }

            await enterCollectionTop({
                hadLive2d,
                onBeforeReveal: () => {
                    if (generation !== routeGeneration) return;
                    const homeMenuEl = document.getElementById('globalMenu');
                    const collectionTopEl = document.getElementById('CollectionTop');
                    const globalBackBtn = document.getElementById('globalBackBtn');
                    if (homeMenuEl) homeMenuEl.style.display = 'block';
                    initGlobalMenuForPage({ showHelp: false });
                    if (collectionTopEl) collectionTopEl.style.display = 'block';
                    if (globalBackBtn) globalBackBtn.style.display = 'block';
                    setupBackBtn();
                    uiLayer.classList.remove('route-transitioning');
                }
            });
        } else if (nextRouteKey === 'CharaCollectionDetail') {
            if (!document.getElementById('cardDetail')) {
                if (!await loadRouteTemplate('template/collection/CharaCollectionDetail.html', generation, 'cardDetail')) return;
            }

            const urlParams = new URLSearchParams(hash.split('?')[1] || '');
            const charaId = Number(urlParams.get('id')) || 1001;

            await enterCharaCollectionDetail({
                charaId,
                hadLive2d,
                onBeforeReveal: () => {
                    if (generation !== routeGeneration) return;
                    const charaDetailEl = document.getElementById('cardDetail');
                    const homeMenuEl = document.getElementById('globalMenu');
                    const sideMenuEl = document.getElementById('sideMenu');
                    const globalBackBtn = document.getElementById('globalBackBtn');
                    if (homeMenuEl) homeMenuEl.style.display = 'none';
                    if (sideMenuEl) sideMenuEl.style.visibility = 'hidden';
                    if (charaDetailEl) charaDetailEl.style.display = 'block';
                    if (globalBackBtn) globalBackBtn.style.display = 'block';
                    setupBackBtn();
                    uiLayer.classList.remove('route-transitioning');
                }
            });
        } else {
            if (!document.getElementById('CharaCollection')) {
                if (!await loadRouteTemplate('template/collection/CharaCollection.html', generation, 'CharaCollection')) return;
            }

            await enterCharaCollection({
                hadLive2d,
                onBeforeReveal: () => {
                    if (generation !== routeGeneration) return;
                    document.body.classList.remove('connecting');
                    const charaCollectionEl = document.getElementById('CharaCollection');
                    const homeMenuEl = document.getElementById('globalMenu');
                    const sideMenuEl = document.getElementById('sideMenu');
                    const globalBackBtn = document.getElementById('globalBackBtn');
                    if (homeMenuEl) homeMenuEl.style.display = 'none';
                    if (sideMenuEl) sideMenuEl.style.visibility = 'hidden';
                    if (charaCollectionEl) charaCollectionEl.style.display = 'block';
                    if (globalBackBtn) globalBackBtn.style.display = 'block';
                    setupBackBtn();
                    uiLayer.classList.remove('route-transitioning');
                }
            });
        }
    } finally {
        if (generation === routeGeneration) {
            uiLayer.classList.remove('route-transitioning');
        }
    }
}

export function initRouter() {
    window.addEventListener('hashchange', () => {
        handleRoute().catch((e) => console.error('[router] Route change failed:', e));
    });
    return handleRoute();
}
