// magica/js/app.js — SPA bootstrapper for /magica/index.html

import { initCommonEvents } from './engine/common-events.js';
import { preloadCoreSe } from './engine/audio.js';
import { getScenarioPlayer, loadCharaAttributes } from './engine/l2d-stage.js';
import { initRouter } from './router.js';

async function init() {
    document.body.classList.add('connecting');

    const uiLayer = document.getElementById('ui-layer');
    if (uiLayer) {
        uiLayer.style.display = 'block';
    }

    initCommonEvents();
    preloadCoreSe();
    getScenarioPlayer();

    await loadCharaAttributes();

    const bareSearchId = new URLSearchParams(window.location.search).get('id');
    const bareEntry = !window.location.hash || window.location.hash === '#' || window.location.hash === '#/';
    if (bareEntry && /^\d{4}$/.test(bareSearchId || '')) {
        history.replaceState(null, '', `${window.location.pathname}${window.location.search}#/MyPage?id=${bareSearchId}`);
    }

    await initRouter();
}

init();
