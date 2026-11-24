// js/router.js — Hash router for quotes SPA

import { loadViewTemplate } from './view-loader.js';
import { destroyCurrentModels } from './viewer/model.js';
import { renderCharaCollectionGrid } from './viewer/chara-collection.js';
import { initHomeMenu, resetHomeMenu, initGlobalMenuForPage } from './home-menu.js';
import { initMyPage, resetMyPage } from './mypage.js';
import { initBackgroundSet, resetBackgroundSet } from './background-set.js';
import { initCharaTop, resetCharaTop } from './chara-top.js';
import { initCameraTop, resetCameraTop } from './camera-top.js';

let routeGeneration = 0;

/**
 * Loads a view template and returns false if a newer route superseded this one
 * while awaiting the fetch, hiding any newly mounted elements so they cannot
 * appear over the active route.
 */
async function loadRouteTemplate(path, generation, ...staleHideIds) {
    const mounted = await loadViewTemplate(path, 'ui-layer');
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

export async function handleRoute(loadCharacterDetail, state, loadHomeScreen, loadBackgroundSetScreen, loadCharaListTopScreen, loadCameraTopScreen) {
    const generation = ++routeGeneration;
    const hash = window.location.hash || '#/CharaCollection';
    const uiLayer = document.getElementById('ui-layer');
    if (!uiLayer) return;

    const isHomeFamily = hash.startsWith('#/MyPage') || hash.startsWith('#/BackgroundSet') || hash.startsWith('#/CharaListTop') || hash.startsWith('#/CameraTop');
    if (!isHomeFamily && window.stopHomeScreen) {
        await window.stopHomeScreen();
        if (generation !== routeGeneration) return;
    }
    if (!hash.startsWith('#/CharaListTop') && typeof window.hideCharaTopMini === 'function') {
        window.hideCharaTopMini();
    }
    resetHomeMenu();
    resetMyPage();
    resetBackgroundSet();
    resetCharaTop();
    resetCameraTop();

    const setupBackBtn = () => {
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
                window.location.href = 'index.html';
            }
        };

        const globalBackBtn = document.getElementById('globalBackBtn');
        const backBtn = document.getElementById('backBtn');
        if (globalBackBtn) globalBackBtn.onclick = handleBack;
        if (backBtn) backBtn.onclick = handleBack;
    };

    if (hash.startsWith('#/MyPage')) {
        let homeMenuEl = document.getElementById('globalMenu');
        if (!homeMenuEl) {
            if (!await loadRouteTemplate('magica/template/base/GlobalMenu.html', generation, 'globalMenu', 'sideMenu')) return;
            homeMenuEl = document.getElementById('globalMenu');
        }
        // Hide immediately after mount: the raw template shows 0/0 in the
        // status bar and the #menu capsule of #sideMenu must not flash while
        // MyPage.html still loads / during the home load (sideMenu has no
        // hidden default state — only hideMenuUI() hides it).
        if (homeMenuEl) homeMenuEl.style.visibility = 'hidden';
        const sideMenuEl = document.getElementById('sideMenu');
        if (sideMenuEl) sideMenuEl.style.visibility = 'hidden';
        if (!await loadRouteTemplate('magica/template/base/MyPage.html', generation, 'MyPage')) return;

        const charaCollectionEl = document.getElementById('CharaCollection');
        const cardDetailEl = document.getElementById('cardDetail');
        const bgSetEl = document.getElementById('BackgroundSet');
        const charaTopEl = document.getElementById('CharaTop');
        const cameraTopEl = document.getElementById('CameraTop');
        const myPageEl = document.getElementById('MyPage');
        const globalBackBtn = document.getElementById('globalBackBtn');
        if (charaCollectionEl) charaCollectionEl.style.display = 'none';
        if (cardDetailEl) cardDetailEl.style.display = 'none';
        if (bgSetEl) bgSetEl.style.display = 'none';
        if (charaTopEl) charaTopEl.style.display = 'none';
        if (cameraTopEl) cameraTopEl.style.display = 'none';
        if (homeMenuEl) homeMenuEl.style.display = 'block';
        if (myPageEl) myPageEl.style.display = 'block';
        if (globalBackBtn) globalBackBtn.style.display = 'none';
        // The left column + carousel stay hidden until the home reveal, so
        // nothing of them shows during the background/BGM load.
        if (myPageEl) myPageEl.style.visibility = 'hidden';

        setupBackBtn();
        initHomeMenu();
        initMyPage();
        if (typeof loadHomeScreen === 'function') {
            await loadHomeScreen();
        }
    } else if (hash.startsWith('#/BackgroundSet')) {
        let bgSetEl = document.getElementById('BackgroundSet');
        if (!bgSetEl) {
            if (!await loadRouteTemplate('magica/template/user/BackgroundSet.html', generation, 'BackgroundSet')) return;
            bgSetEl = document.getElementById('BackgroundSet');
        }

        const charaCollectionEl = document.getElementById('CharaCollection');
        const cardDetailEl = document.getElementById('cardDetail');
        const myPageEl = document.getElementById('MyPage');
        const charaTopEl = document.getElementById('CharaTop');
        const cameraTopEl = document.getElementById('CameraTop');
        const homeMenuEl = document.getElementById('globalMenu');
        const sideMenuEl = document.getElementById('sideMenu');
        const globalBackBtn = document.getElementById('globalBackBtn');
        if (charaCollectionEl) charaCollectionEl.style.display = 'none';
        if (cardDetailEl) cardDetailEl.style.display = 'none';
        if (myPageEl) myPageEl.style.display = 'none';
        if (charaTopEl) charaTopEl.style.display = 'none';
        if (cameraTopEl) cameraTopEl.style.display = 'none';
        if (homeMenuEl) homeMenuEl.style.display = 'none';
        if (sideMenuEl) sideMenuEl.style.visibility = 'hidden';
        if (bgSetEl) bgSetEl.style.display = 'block';
        if (globalBackBtn) globalBackBtn.style.display = 'block';

        setupBackBtn();
        await initBackgroundSet();
        if (generation !== routeGeneration) return;
        if (typeof loadBackgroundSetScreen === 'function') {
            await loadBackgroundSetScreen();
        }
    } else if (hash.startsWith('#/CharaListTop')) {
        let homeMenuEl = document.getElementById('globalMenu');
        if (!homeMenuEl) {
            if (!await loadRouteTemplate('magica/template/base/GlobalMenu.html', generation, 'globalMenu', 'sideMenu')) return;
            homeMenuEl = document.getElementById('globalMenu');
        }
        let charaTopEl = document.getElementById('CharaTop');
        if (!charaTopEl) {
            if (!await loadRouteTemplate('magica/template/chara/CharaTop.html', generation, 'CharaTop')) return;
            charaTopEl = document.getElementById('CharaTop');
        }

        const charaCollectionEl = document.getElementById('CharaCollection');
        const cardDetailEl = document.getElementById('cardDetail');
        const myPageEl = document.getElementById('MyPage');
        const bgSetEl = document.getElementById('BackgroundSet');
        const cameraTopEl = document.getElementById('CameraTop');
        const globalBackBtn = document.getElementById('globalBackBtn');
        if (charaCollectionEl) charaCollectionEl.style.display = 'none';
        if (cardDetailEl) cardDetailEl.style.display = 'none';
        if (myPageEl) myPageEl.style.display = 'none';
        if (bgSetEl) bgSetEl.style.display = 'none';
        if (cameraTopEl) cameraTopEl.style.display = 'none';
        if (homeMenuEl) homeMenuEl.style.display = 'block';
        if (charaTopEl) charaTopEl.style.display = 'block';
        if (globalBackBtn) globalBackBtn.style.display = 'block';

        setupBackBtn();
        initGlobalMenuForPage();
        if (typeof loadCharaListTopScreen === 'function') {
            await loadCharaListTopScreen();
            if (generation !== routeGeneration) return;
        }
        const urlParams = new URLSearchParams(hash.split('?')[1] || '');
        const pathMatch = hash.match(/^#\/CharaListTop\/(\d{4})\b/);
        const rawId = urlParams.get('id') || (pathMatch ? pathMatch[1] : '');
        const initialCharaId = /^\d{4}$/.test(rawId) ? Number(rawId) : undefined;
        await initCharaTop({ initialCharaId });
    } else if (hash.startsWith('#/CameraTop')) {
        let cameraTopEl = document.getElementById('CameraTop');
        if (!cameraTopEl) {
            if (!await loadRouteTemplate('magica/template/camera/CameraTop.html', generation, 'CameraTop')) return;
            cameraTopEl = document.getElementById('CameraTop');
        }

        const charaCollectionEl = document.getElementById('CharaCollection');
        const cardDetailEl = document.getElementById('cardDetail');
        const myPageEl = document.getElementById('MyPage');
        const bgSetEl = document.getElementById('BackgroundSet');
        const charaTopEl = document.getElementById('CharaTop');
        const homeMenuEl = document.getElementById('globalMenu');
        const sideMenuEl = document.getElementById('sideMenu');
        const globalBackBtn = document.getElementById('globalBackBtn');
        if (charaCollectionEl) charaCollectionEl.style.display = 'none';
        if (cardDetailEl) cardDetailEl.style.display = 'none';
        if (myPageEl) myPageEl.style.display = 'none';
        if (bgSetEl) bgSetEl.style.display = 'none';
        if (charaTopEl) charaTopEl.style.display = 'none';
        if (homeMenuEl) homeMenuEl.style.display = 'none';
        if (sideMenuEl) sideMenuEl.style.visibility = 'hidden';
        if (globalBackBtn) globalBackBtn.style.display = 'none';
        if (cameraTopEl) cameraTopEl.style.display = 'block';

        setupBackBtn();
        if (typeof loadCameraTopScreen === 'function') {
            await loadCameraTopScreen();
            if (generation !== routeGeneration) return;
        }
        const urlParams = new URLSearchParams(hash.split('?')[1] || '');
        const rawId = urlParams.get('id') || '';
        const initialCharaId = /^\d{4}$/.test(rawId) ? Number(rawId) : undefined;
        await initCameraTop({ initialCharaId });
    } else if (hash.startsWith('#/CharaCollectionDetail')) {
        let charaDetailEl = document.getElementById('cardDetail');
        if (!charaDetailEl) {
            if (!await loadRouteTemplate('magica/template/collection/CharaCollectionDetail.html', generation, 'cardDetail')) return;
            charaDetailEl = document.getElementById('cardDetail');
        }

        const charaCollectionEl = document.getElementById('CharaCollection');
        const myPageEl = document.getElementById('MyPage');
        const bgSetEl = document.getElementById('BackgroundSet');
        const charaTopEl = document.getElementById('CharaTop');
        const cameraTopEl = document.getElementById('CameraTop');
        if (charaCollectionEl) charaCollectionEl.style.display = 'none';
        if (charaDetailEl) charaDetailEl.style.display = 'block';
        if (myPageEl) myPageEl.style.display = 'none';
        if (bgSetEl) bgSetEl.style.display = 'none';
        if (charaTopEl) charaTopEl.style.display = 'none';
        if (cameraTopEl) cameraTopEl.style.display = 'none';
        const sideMenuEl = document.getElementById('sideMenu');
        if (sideMenuEl) sideMenuEl.style.visibility = 'hidden';
        const globalBackBtn = document.getElementById('globalBackBtn');
        if (globalBackBtn) globalBackBtn.style.display = 'block';

        setupBackBtn();

        const urlParams = new URLSearchParams(hash.split('?')[1] || '');
        const charaId = Number(urlParams.get('id')) || 1001;

        if (state.currentModel) state.currentModel.visible = true;
        document.body.classList.remove('connecting');

        if (typeof loadCharacterDetail === 'function') {
            await loadCharacterDetail(charaId);
        }
    } else {
        let charaCollectionEl = document.getElementById('CharaCollection');
        if (!charaCollectionEl) {
            if (!await loadRouteTemplate('magica/template/collection/CharaCollection.html', generation, 'CharaCollection')) return;
            charaCollectionEl = document.getElementById('CharaCollection');
        }

        const cardDetailEl = document.getElementById('cardDetail');
        if (cardDetailEl) cardDetailEl.style.display = 'none';
        const homeMenuEl = document.getElementById('globalMenu');
        if (homeMenuEl) homeMenuEl.style.display = 'none';
        const sideMenuEl = document.getElementById('sideMenu');
        if (sideMenuEl) sideMenuEl.style.visibility = 'hidden';
        const myPageEl = document.getElementById('MyPage');
        if (myPageEl) myPageEl.style.display = 'none';
        const bgSetEl = document.getElementById('BackgroundSet');
        if (bgSetEl) bgSetEl.style.display = 'none';
        const charaTopEl = document.getElementById('CharaTop');
        if (charaTopEl) charaTopEl.style.display = 'none';
        const cameraTopEl = document.getElementById('CameraTop');
        if (cameraTopEl) cameraTopEl.style.display = 'none';
        if (charaCollectionEl) charaCollectionEl.style.display = 'block';
        const globalBackBtn = document.getElementById('globalBackBtn');
        if (globalBackBtn) globalBackBtn.style.display = 'block';

        setupBackBtn();

        // Cancel any pending outfit change/model load, stop transformation SFX/VFX, clear subtitles, and reset detail view state
        if (window.cancelOutfitChanges) {
            window.cancelOutfitChanges();
        }
        if (window.scenarioPlayer) {
            window.scenarioPlayer.stop();
        }
        if (window.stopTransformationEffects) {
            window.stopTransformationEffects();
        }
        if (window.resetDetailViewState) {
            window.resetDetailViewState();
        }

        // Destroy Live2D model instance(s) and GPU textures when returning to collection
        destroyCurrentModels();

        document.body.classList.remove('connecting');

        await renderCharaCollectionGrid();
    }
}
