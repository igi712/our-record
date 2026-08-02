// js/router.js — Hash router for quotes SPA

import { loadViewTemplate } from './view-loader.js';
import { renderCharaCollectionGrid } from '../../chara-collection.js';
import { initHomeMenu, resetHomeMenu } from './home-menu.js';

export async function handleRoute(loadCharacterDetail, state, loadHomeScreen) {
    const hash = window.location.hash || '#/CharaCollection';
    const uiLayer = document.getElementById('ui-layer');
    if (!uiLayer) return;

    if (!hash.startsWith('#/MyPage') && window.stopHomeScreen) {
        await window.stopHomeScreen();
    }
    resetHomeMenu();

    const setupBackBtn = () => {
        const handleBack = (e) => {
            if (e) e.preventDefault();
            const currentHash = window.location.hash;
            if (currentHash.startsWith('#/CharaCollectionDetail')) {
                window.location.hash = '#/CharaCollection';
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
            await loadViewTemplate('magica/template/base/GlobalMenu.html', 'ui-layer');
            homeMenuEl = document.getElementById('globalMenu');
        }

        const charaCollectionEl = document.getElementById('CharaCollection');
        const cardDetailEl = document.getElementById('cardDetail');
        if (charaCollectionEl) charaCollectionEl.style.display = 'none';
        if (cardDetailEl) cardDetailEl.style.display = 'none';
        if (homeMenuEl) homeMenuEl.style.display = 'block';

        setupBackBtn();
        initHomeMenu();
        if (typeof loadHomeScreen === 'function') {
            await loadHomeScreen();
        }
    } else if (hash.startsWith('#/CharaCollectionDetail')) {
        let charaDetailEl = document.getElementById('cardDetail');
        if (!charaDetailEl) {
            await loadViewTemplate('magica/template/collection/CharaCollectionDetail.html', 'ui-layer');
            charaDetailEl = document.getElementById('cardDetail');
        }

        const charaCollectionEl = document.getElementById('CharaCollection');
        if (charaCollectionEl) charaCollectionEl.style.display = 'none';
        if (charaDetailEl) charaDetailEl.style.display = 'block';

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
            await loadViewTemplate('magica/template/collection/CharaCollection.html', 'ui-layer');
            charaCollectionEl = document.getElementById('CharaCollection');
        }

        const cardDetailEl = document.getElementById('cardDetail');
        if (cardDetailEl) cardDetailEl.style.display = 'none';
        const homeMenuEl = document.getElementById('globalMenu');
        if (homeMenuEl) homeMenuEl.style.display = 'none';
        if (charaCollectionEl) charaCollectionEl.style.display = 'block';

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

        // Destroy Live2D model instance when returning to collection
        if (state.currentModel) {
            if (state.currentModel.parent) {
                state.currentModel.parent.removeChild(state.currentModel);
            }
            try { state.currentModel.destroy({ children: true }); } catch (e) {}
            state.currentModel = null;
            state.currentController = null;
        }

        document.body.classList.remove('connecting');

        await renderCharaCollectionGrid();
    }
}
