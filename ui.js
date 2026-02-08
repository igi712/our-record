// UI controls, events, and app initialization.

import {
    state,
    applyCheek,
    applyEyeClose,
    applyMouthOpen,
    applySoulGem,
    applyTear,
    buildModelId,
    clearAssetsBaseOverride,
    downloadModelSnapshot,
    getOutfitsForCharacter,
    getSelectedCheekValue,
    loadModel,
    persistAssetsBaseOverride,
    resolveMaReAssetsBase,
    setFollowEnabledGlobal,
    showToast
} from './model.js';

function populateCharacterDropdown() {
    const characterSelect = document.getElementById('characterSelect');
    if (!characterSelect) return;

    // Clear existing options
    characterSelect.innerHTML = '';

    // Add all characters
    state.charaListData.forEach(chara => {
        const option = document.createElement('option');
        option.value = chara.id;
        // Include optional title (e.g., "Momoko Togame (Sister)")
        const label = chara.title ? `${chara.name} (${chara.title})` : chara.name;
        option.textContent = `${chara.id} - ${label}`;
        if (chara.id === state.currentCharacterId) {
            option.selected = true;
        }
        characterSelect.appendChild(option);
    });
}

function populateOutfitDropdown(charaId) {
    const outfitSelect = document.getElementById('outfitSelect');
    if (!outfitSelect) return;

    // Clear existing options
    outfitSelect.innerHTML = '';

    // Get outfits for the selected character
    const outfits = getOutfitsForCharacter(charaId);

    outfits.forEach(outfit => {
        const option = document.createElement('option');
        option.value = outfit.live2dId;
        const live2dId = String(outfit.live2dId).padStart(2, '0');
        option.textContent = `${live2dId} - ${outfit.description || live2dId}`;
        if (outfit.live2dId === state.currentLive2dId) {
            option.selected = true;
        }
        outfitSelect.appendChild(option);
    });
}


// Bootstrap: Load JSON data and initialize dropdowns
export async function initializeApp() {
    try {
        // Load character and outfit data
        const [charaResponse, live2dResponse] = await Promise.all([
            fetch('assets/totentanz/en-data/charaList.json'),
            fetch('assets/totentanz/en-data/live2dList.json')
        ]);

        const [registeredChars, registeredLive2d] = await Promise.all([
            charaResponse.json(),
            live2dResponse.json()
        ]);

        let missingChars = [];
        let missingLive2d = [];
        try {
            const [missingCharsResponse, missingLive2dResponse] = await Promise.all([
                fetch('assets/missingCharaList.json'),
                fetch('assets/missingLive2dList.json')
            ]);
            if (missingCharsResponse.ok) missingChars = await missingCharsResponse.json();
            if (missingLive2dResponse.ok) missingLive2d = await missingLive2dResponse.json();
        } catch (e) {
            // Missing files are optional; ignore if not present.
        }

        const registeredCharIds = new Set(registeredChars.map((c) => Number(c.id)));
        const registeredLive2dKeys = new Set(
            registeredLive2d.map((o) => `${Number(o.charaId)}-${String(o.live2dId).padStart(2, '0')}`)
        );

        const appendedChars = missingChars.filter((c) => !registeredCharIds.has(Number(c.id)));
        const appendedLive2d = missingLive2d.filter((o) => !registeredLive2dKeys.has(`${Number(o.charaId)}-${String(o.live2dId).padStart(2, '0')}`));

        state.charaListData = registeredChars.concat(appendedChars);
        state.live2dListData = registeredLive2d.concat(appendedLive2d);

        // Populate character dropdown
        populateCharacterDropdown();

        // Determine the initial outfit (lowest live2dId) for the default character
        const initialOutfits = getOutfitsForCharacter(state.currentCharacterId);
        if (initialOutfits.length > 0) {
            state.currentLive2dId = initialOutfits[0].live2dId;
        }

        // Populate outfit dropdown for default character
        populateOutfitDropdown(state.currentCharacterId);

        // Ensure currentModelId matches selected character + outfit
        state.currentModelId = buildModelId(state.currentCharacterId, state.currentLive2dId);


        // Setup assets base UI (override / test)
        try {
            const assetsInput = document.getElementById('assetsBaseInput');
            const testBtn = document.getElementById('assetsBaseTestBtn');
            const saveBtn = document.getElementById('assetsBaseSaveBtn');
            const clearBtn = document.getElementById('assetsBaseClearBtn');

            async function refreshAssetsInput() {
                try {
                    if (!assetsInput) return; // UI removed or hidden - nothing to do
                    const override = (typeof localStorage !== 'undefined') ? localStorage.getItem('mrAssetsBase') : null;
                    if (override) { assetsInput.value = override; return; }
                    // show resolved base (probe may take a moment)
                    assetsInput.value = await resolveMaReAssetsBase();
                } catch (e) {}
            }

            if (assetsInput) {
                assetsInput.onkeydown = (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); testBtn?.click(); } };
            }

            if (testBtn) testBtn.onclick = async () => {
                try {
                    const val = assetsInput ? assetsInput.value.trim() : '';
                    const url = val ? (String(val).replace(/\/$/, '')) : (await resolveMaReAssetsBase());
                    // Probe one well-known file under the base
                    const probe = `${url}/100100/model.model3.json`;
                    const r = await fetch(probe, { method: 'GET', cache: 'no-store' });
                    if (r && r.ok) {
                        alert('Probe OK: assets reachable at ' + url);
                    } else {
                        alert('Probe failed (HTTP ' + (r ? r.status : 'no response') + ') for ' + probe);
                    }
                    // reflect resolved value in input after probe
                    assetsInput.value = url;
                } catch (e) {
                    alert('Probe error: ' + (e && e.message ? e.message : String(e)));
                }
            };

            if (saveBtn) saveBtn.onclick = () => {
                try {
                    const val = assetsInput ? assetsInput.value.trim() : '';
                    if (!val) { clearAssetsBaseOverride(); alert('Override cleared'); }
                    else { persistAssetsBaseOverride(val); alert('Override saved'); }
                } catch (e) { alert('Save failed: ' + (e && e.message ? e.message : String(e))); }
            };

            if (clearBtn) clearBtn.onclick = () => { try { clearAssetsBaseOverride(); assetsInput.value = ''; alert('Override cleared'); } catch (e) { alert('Clear failed'); } };

            // initial fill
            (async () => { try { await refreshAssetsInput(); } catch (e) {} })();
        } catch (e) {}

        // Setup event handlers
        const characterSelect = document.getElementById('characterSelect');
        const outfitSelect = document.getElementById('outfitSelect');

        if (characterSelect) {
            characterSelect.onchange = () => {
                const charaId = parseInt(characterSelect.value);
                if (!charaId) return;

                state.currentCharacterId = charaId;

                // Get the lowest live2dId for this character
                const outfits = getOutfitsForCharacter(charaId);
                if (outfits.length > 0) {
                    state.currentLive2dId = outfits[0].live2dId;
                }

                // Update outfit dropdown
                populateOutfitDropdown(charaId);

                // Load the model (character change: reset UI/controller state)
                const modelId = buildModelId(charaId, state.currentLive2dId);
                loadModel(modelId).catch((e) => console.error(e));
            };
        }

        if (outfitSelect) {
            outfitSelect.onchange = () => {
                const live2dId = outfitSelect.value;
                if (!live2dId) return;

                state.currentLive2dId = live2dId;

                // Load the model (outfit change: reset UI/controller state)
                const modelId = buildModelId(state.currentCharacterId, live2dId);
                loadModel(modelId).catch((e) => console.error(e));
            };
        }

        // Load the default model
        loadModel(state.currentModelId).catch((e) => console.error(e));
    } catch (error) {
        console.error('Failed to initialize app:', error);
        // Fallback: try to load default model anyway
        loadModel(state.currentModelId).catch((e) => console.error(e));
    }
}

// Hotkeys: S = stop, C = capture (ignore when typing in inputs)
export function setupHotkeys() {
    try {
        window.addEventListener('keydown', (ev) => {
            try {
                if (ev.repeat) return;
                const active = document.activeElement;
                if (active) {
                    const t = active.tagName;
                    if (t === 'INPUT' || t === 'TEXTAREA' || active.isContentEditable) return; // ignore when typing
                }
                const k = (ev.key || '').toLowerCase();
                if (k === 's') {
                    try { state.currentController?.stopSequence?.(); } catch(e) { console.warn('stop hotkey failed', e); }
                    ev.preventDefault();
                } else if (k === 'c') {
                    try { downloadModelSnapshot(); } catch(e) { console.warn('capture hotkey failed', e); }
                    ev.preventDefault();
                }
            } catch (e) { console.warn('hotkey handler error', e); }
        }, false);
    } catch (e) { console.warn('setupHotkeys failed', e); }
}

// Global press-to-follow: press anywhere to enable follow; release disables follow.
export function setupPressToFollow() {
    try {
        // Global release handlers: release anywhere disables follow
        window.addEventListener('pointerup', () => setFollowEnabledGlobal(false), true);
        window.addEventListener('pointercancel', () => setFollowEnabledGlobal(false), true);
        // FIX: Only stop follow on window/tab blur, not when an element loses focus (e.g. clicking canvas after using dropdown)
        window.addEventListener('blur', (ev) => {
            if (ev.target === window || ev.target === document) setFollowEnabledGlobal(false);
        }, true);
        document.addEventListener('visibilitychange', () => { if (document.hidden) setFollowEnabledGlobal(false); }, true);

        // touch fallback for releases
        window.addEventListener('touchend', () => setFollowEnabledGlobal(false), true);
        window.addEventListener('touchcancel', () => setFollowEnabledGlobal(false), true);
    } catch (e) { console.warn('setupPressToFollow failed', e); }
}

// --- Manual parameter controls + mic lipsync, wired to v2 controller ---
export function setupManualControls() {
    const cheekRadios = Array.from(document.querySelectorAll('input[name="cheek"]'));
    const eyeClose = document.getElementById('eyeClose');
    const mouthOpen = document.getElementById('mouthOpen');
    const tear = document.getElementById('tear');
    const soulGem = document.getElementById('soulGem');
    const micToggle = document.getElementById('micToggle');
    const micSensitivityInput = document.getElementById('micSensitivity');

    cheekRadios.forEach(el => {
        el.onchange = (e) => applyCheek(e.target.value);
    });

    if (eyeClose) eyeClose.onchange = (e) => applyEyeClose(e.target.checked);

    if (mouthOpen) mouthOpen.onchange = (e) => applyMouthOpen(e.target.checked);

    if (tear) tear.onchange = (e) => applyTear(e.target.checked);

    if (soulGem) soulGem.onchange = (e) => applySoulGem(e.target.checked);

    // Keep the UI in sync when Random is pressed (controller dispatches mrv2:randomChoice).
    // This is intentionally located here (near the checkbox refs) so it always runs.
    try {
        window.addEventListener('mrv2:randomChoice', (ev) => {
            try {
                const d = ev && ev.detail;
                if (!d) return;

                // Eye Close
                try {
                    const closed = !!(d.eyeClose === true || d.eyeOpen === 0);
                    if (eyeClose) eyeClose.checked = closed;
                    applyEyeClose(closed);
                } catch {}

                // Mouth Open
                try {
                    const open = !!(d.mouthOpen || (typeof d.mouth === 'number' && d.mouth > 0.5));
                    if (mouthOpen) mouthOpen.checked = open;
                    applyMouthOpen(open);
                } catch {}

                // Tear
                try {
                    const enabled = !!d.tear;
                    if (tear) tear.checked = enabled;
                    applyTear(enabled);
                } catch {}

                // Soul Gem: intentionally ignore random changes; Random should not alter the soul gem checkbox or state.
            } catch {}
        });
    } catch {}

    // mic lipsync: analyser lives here, mouth applied via afterMotionUpdate in live2d_v2
    let micStream = null;
    let micAnalyzer = null;
    let micCtx = null;
    let micBuf = null;

    async function startMic() {
        if (micStream) return;
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showToast('Microphone not available in this browser/context');
            return;
        }
        if (!window.isSecureContext) {
            showToast('Microphone requires a secure context (HTTPS).');
        }

        try {
            micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            micCtx = new (window.AudioContext || window.webkitAudioContext)();
            const src = micCtx.createMediaStreamSource(micStream);
            micAnalyzer = micCtx.createAnalyser();
            micAnalyzer.fftSize = 1024;
            src.connect(micAnalyzer);

            micBuf = new Uint8Array(micAnalyzer.frequencyBinCount);

            // Disable mouth controls while mic is active
            if (mouthOpen) { mouthOpen.disabled = true; mouthOpen.style.pointerEvents = 'none'; mouthOpen.style.opacity = '0.5'; }

            if (micSensitivityInput) {
                micSensitivityInput.disabled = false;
                micSensitivityInput.style.pointerEvents = '';
                micSensitivityInput.style.opacity = '';
            }

            if (state.currentController) {
                state.currentController.setMic(true, micAnalyzer, micBuf, Number(micSensitivityInput?.value) || 1);
            }

            if (micToggle) micToggle.textContent = 'Stop Mic Lipsync';
        } catch (e) {
            console.error('Mic start failed', e);
            if (e && (e.name === 'NotAllowedError' || e.name === 'SecurityError')) {
                showToast('Microphone access was blocked. Check browser permissions.');
            } else if (e && e.name === 'NotFoundError') {
                showToast('No microphone device found.');
            } else {
                showToast('Microphone start failed: ' + (e && e.message ? e.message : String(e)));
            }
            stopMic();
        }
    }

    function stopMic() {
        if (micCtx) try { micCtx.close(); } catch {}
        micCtx = null;
        if (micStream) {
            try { micStream.getTracks().forEach(t => t.stop()); } catch {}
        }
        micStream = null;
        micAnalyzer = null;
        micBuf = null;

        if (state.currentController) {
            state.currentController.setMic(false, null, null, Number(micSensitivityInput?.value) || 1);
            state.currentController.clearMouthManualIfUnlocked();
        }

        if (mouthOpen) { mouthOpen.disabled = false; mouthOpen.style.pointerEvents = ''; mouthOpen.style.opacity = ''; }

        if (micSensitivityInput) {
            micSensitivityInput.disabled = true;
            micSensitivityInput.style.pointerEvents = 'none';
            micSensitivityInput.style.opacity = '0.5';
        }

        if (micToggle) micToggle.textContent = 'Start Mic Lipsync';
    }

    if (micSensitivityInput) {
        micSensitivityInput.value = 1;
        micSensitivityInput.disabled = true;
        micSensitivityInput.style.pointerEvents = 'none';
        micSensitivityInput.style.opacity = '0.5';
        micSensitivityInput.oninput = (e) => {
            if (!state.currentController) return;
            state.currentController.setMicSensitivity(Number(e.target.value) || 1);
        };
    }

    if (micToggle) micToggle.onclick = () => {
        if (micStream) stopMic(); else startMic();
    };

    // init defaults
    function initDefaults() {
        if (eyeClose) eyeClose.checked = false;
        if (mouthOpen) mouthOpen.checked = false;
        if (tear) tear.checked = false;
        if (soulGem) soulGem.checked = false;
        stopMic();
        // Cheek radios in viewer_v2.html are actual ParamCheek values (e.g. -1/0/1/2).
        // Respect whatever is currently selected in HTML.
        applyCheek(getSelectedCheekValue());
        applyEyeClose(false);
        applyMouthOpen(false);
        applyTear(false);
        applySoulGem(false);
    }
    initDefaults();

    // --- UI: menu toggle ---
    try {
        const menuToggle = document.getElementById('menuToggle');
        const controls = document.getElementById('controls');
        if (menuToggle && controls) {
            menuToggle.onclick = () => {
                const collapsed = controls.classList.toggle('collapsed');
                menuToggle.textContent = collapsed ? '☰' : '✕';
                menuToggle.setAttribute('aria-expanded', String(!collapsed));
            };
        }
    } catch (e) { console.warn('Menu init failed', e); }

    // Buttons: capture / random / follow
    try {
        const captureBtn = document.getElementById('captureBtn');
        const randomBtn = document.getElementById('randomBtn');

        if (randomBtn) randomBtn.onclick = () => state.currentController?.clickPlayRandom?.();
        if (captureBtn) captureBtn.onclick = () => downloadModelSnapshot();
    } catch {}
}
