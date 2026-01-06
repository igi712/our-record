// App wiring: model list, UI, loading, snapshot

// Models live under `assets/<id>/`.
const MODEL_OPTIONS = [
    { id: '100100', label: '100100 (Iroha)' },
    { id: '100200', label: '100200 (Yachiyo)' },
    { id: '100300', label: '100300 (Tsuruno)' },
    { id: '100400', label: '100400 (Sana)' },
    { id: '100500', label: '100500 (Felicia)' }
];

function getModelOption(modelId) {
    return MODEL_OPTIONS.find(o => o.id === modelId) ?? null;
}

let currentModel = null;
let currentModelId = MODEL_OPTIONS[0]?.id ?? '100100';

function fillSelect(selectEl, options) {
    selectEl.innerHTML = '';
    for (const opt of options) {
        const el = document.createElement('option');
        el.value = opt.value;
        el.textContent = opt.label;
        selectEl.appendChild(el);
    }
}

function setSelectValue(selectEl, value) {
    for (const opt of selectEl.options) {
        if (opt.value === value) {
            selectEl.value = value;
            return;
        }
    }
}

function setupControlsForModel(model, modelJson) {
    const motionSelect = document.getElementById('motionSelect');
    const expressionSelect = document.getElementById('expressionSelect');

    if (motionSelect) {
        const motionsObj = modelJson?.FileReferences?.Motions ?? {};
        const motionOptions = [];

        for (const [group, arr] of Object.entries(motionsObj)) {
            if (!Array.isArray(arr)) continue;
            for (let i = 0; i < arr.length; i++) {
                const m = arr[i] ?? {};
                const name = String(m.Name ?? i);
                motionOptions.push({
                    value: JSON.stringify({ group, index: i }),
                    label: `${group}: ${name}`
                });
            }
        }

        fillSelect(motionSelect, motionOptions);
        if (motionOptions.length > 0) motionSelect.value = motionOptions[0].value;

        motionSelect.onchange = () => {
            const { group, index } = JSON.parse(motionSelect.value);
            const ok = tryStartMotion(model, group, index);
            if (!ok) console.warn('Could not start motion', { group, index });
        };
    }

    if (expressionSelect) {
        const expressions = modelJson?.FileReferences?.Expressions ?? [];
        const expressionOptions = [];

        if (Array.isArray(expressions)) {
            for (let i = 0; i < expressions.length; i++) {
                const e = expressions[i] ?? {};
                const name = String(e.Name ?? i);
                expressionOptions.push({ value: name, label: name });
            }
        }

        fillSelect(expressionSelect, expressionOptions);
        if (expressionOptions.length > 0) expressionSelect.value = expressionOptions[0].value;

        expressionSelect.onchange = () => {
            const ok = trySetExpression(model, expressionSelect.value);
            if (!ok) console.warn('Could not set expression', { name: expressionSelect.value });
        };
    }
}

async function downloadTransparentModelSnapshot() {
    const model = currentModel;
    if (!model) return;

    const renderer = app?.renderer;
    const extract = renderer?.plugins?.extract;
    if (!renderer || !extract) {
        console.warn('Snapshot not available: renderer extract plugin missing');
        return;
    }

    const originalParent = model.parent;
    const originalIndex = originalParent ? originalParent.getChildIndex(model) : -1;
    const original = {
        x: model.x,
        y: model.y,
        scaleX: model.scale.x,
        scaleY: model.scale.y,
        rotation: model.rotation,
        skewX: model.skew.x,
        skewY: model.skew.y,
        pivotX: model.pivot.x,
        pivotY: model.pivot.y,
        anchorX: model.anchor?.x,
        anchorY: model.anchor?.y
    };

    const captureRoot = new PIXI.Container();
    captureRoot.sortableChildren = false;

    const cropCanvasToAlpha = (srcCanvas, alphaThreshold = 1) => {
        const w = srcCanvas.width | 0;
        const h = srcCanvas.height | 0;
        if (w <= 0 || h <= 0) return { canvas: srcCanvas, rect: { x: 0, y: 0, w: 0, h: 0 } };

        const ctx = srcCanvas.getContext('2d', { willReadFrequently: true });
        const img = ctx.getImageData(0, 0, w, h);
        const data = img.data;

        let minX = w, minY = h, maxX = -1, maxY = -1;
        for (let y = 0; y < h; y++) {
            const row = y * w * 4;
            for (let x = 0; x < w; x++) {
                const a = data[row + x * 4 + 3];
                if (a >= alphaThreshold) {
                    if (x < minX) minX = x;
                    if (y < minY) minY = y;
                    if (x > maxX) maxX = x;
                    if (y > maxY) maxY = y;
                }
            }
        }

        if (maxX < minX || maxY < minY) {
            return { canvas: srcCanvas, rect: { x: 0, y: 0, w, h } };
        }

        const cw = (maxX - minX + 1) | 0;
        const ch = (maxY - minY + 1) | 0;
        const out = document.createElement('canvas');
        out.width = cw;
        out.height = ch;
        const outCtx = out.getContext('2d');
        outCtx.drawImage(srcCanvas, minX, minY, cw, ch, 0, 0, cw, ch);
        return { canvas: out, rect: { x: minX, y: minY, w: cw, h: ch } };
    };

    try {
        originalParent?.removeChild(model);
        captureRoot.addChild(model);

        const SNAPSHOT_RESOLUTION = 2;

        const b = model.getBounds(true);

        const maxDim = Math.max(b.width, b.height);
        const pad = Math.max(64, Math.min(256, Math.ceil(maxDim * 0.15)));

        const w = Math.max(1, Math.ceil(b.width + pad * 2));
        const h = Math.max(1, Math.ceil(b.height + pad * 2));

        const cx = b.x + b.width / 2;
        const cy = b.y + b.height / 2;
        model.x = original.x + (w / 2 - cx);
        model.y = original.y + (h / 2 - cy);

        const rt = PIXI.RenderTexture.create({ width: w, height: h, resolution: SNAPSHOT_RESOLUTION });
        renderer.render(captureRoot, { renderTexture: rt, clear: true });

        const canvas = extract.canvas(rt);
        rt.destroy(true);

        const cropped = cropCanvasToAlpha(canvas, 1);
        const outCanvas = cropped.canvas;

        const fileBase = String(currentModelId || 'model');
        const fileName = `${fileBase}_${outCanvas.width}x${outCanvas.height}_${Date.now()}.png`;

        const blob = await new Promise((resolve) => outCanvas.toBlob(resolve, 'image/png'));
        if (!blob) {
            console.warn('Snapshot failed: could not create PNG blob');
            return;
        }

        const url = URL.createObjectURL(blob);
        try {
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } finally {
            URL.revokeObjectURL(url);
        }
    } catch (e) {
        console.error('Snapshot failed', e);
    } finally {
        try { captureRoot.removeChild(model); } catch {}
        try {
            if (originalParent) originalParent.addChildAt(model, Math.max(0, originalIndex));
        } catch {
            try { worldContainer.addChild(model); } catch {}
        }

        model.x = original.x;
        model.y = original.y;
        model.scale.set(original.scaleX, original.scaleY);
        model.rotation = original.rotation;
        model.skew.set(original.skewX, original.skewY);
        model.pivot.set(original.pivotX, original.pivotY);
        if (model.anchor && Number.isFinite(original.anchorX) && Number.isFinite(original.anchorY)) {
            model.anchor.set(original.anchorX, original.anchorY);
        }
    }
}

async function loadModel(modelId) {
    currentModelId = modelId;

    const modelOpt = getModelOption(modelId);

    if (currentModel) {
        try { worldContainer.removeChild(currentModel); } catch {}
        try { currentModel.destroy?.({ children: true }); } catch {}
        currentModel = null;
    }

    // Home placement uses a 1024x576 space centered inside the 1024x768 world.
    const HOME_OFFSET_X = -132;
    const HOME_Y_INTERCEPT = 287.0999674453658;
    const HOME_Y_PER_HEIGHT = 1.7775731122833498;

    const modelPath = `assets/${modelId}/model.model3.json`;
    const paramsPath = modelPath.replace(/\/model\.model3\.json$/, '/params.json');

    const modelJson = await (await fetch(modelPath)).json();

    const params = await (await fetch(paramsPath)).json();
    const heightParam = Number(params.height ?? 0);
    const modelScaleParam = Number(params.modelScale ?? 1);

    const model = await PIXI.live2d.Live2DModel.from(modelPath, { autoInteract: false });

    worldContainer.addChild(model);

    applyMagirecoIdlePolicy(model, modelJson);

    model.anchor.set(0.5, 0.5);

    const coreModel = model?.internalModel?.coreModel;
    const readNumber = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    };
    const tryGet = (fn) => {
        try { return fn(); } catch { return null; }
    };

    const canvasWidthUnits =
        readNumber(coreModel?.canvasWidth) ??
        readNumber(coreModel?.CanvasWidth) ??
        readNumber(tryGet(() => coreModel?.getCanvasWidth?.())) ??
        readNumber(tryGet(() => coreModel?.GetCanvasWidth?.())) ??
        null;

    const canvasHeightUnits =
        readNumber(coreModel?.canvasHeight) ??
        readNumber(coreModel?.CanvasHeight) ??
        readNumber(tryGet(() => coreModel?.getCanvasHeight?.())) ??
        readNumber(tryGet(() => coreModel?.GetCanvasHeight?.())) ??
        null;

    const xGame = (HOME_W / 2) + HOME_OFFSET_X;
    const yGameFromHeight = HOME_Y_INTERCEPT + (heightParam * HOME_Y_PER_HEIGHT);
    const yGame = Number.isFinite(modelOpt?.homeYOverride) ? modelOpt.homeYOverride : yGameFromHeight;

    model.x = xGame;
    model.y = HOME_TOP + (HOME_H - yGame);

    const SCALE_TWEAK = 1.0;
    const cw = canvasWidthUnits ?? 1;
    const baseScale = ((WORLD_W / 2) * cw) / model.internalModel.originalWidth;
    const finalScale = baseScale * modelScaleParam * SCALE_TWEAK;
    model.scale.set(finalScale);

    setupControlsForModel(model, modelJson);

    currentModel = model;

    console.log('Model Loaded', {
        paramsPath,
        yGameFromHeight,
        homeYOverride: modelOpt?.homeYOverride,
        heightParam,
        modelScaleParam,
        canvasWidthUnits,
        canvasHeightUnits,
        originalWidth: model.internalModel.originalWidth,
        originalHeight: model.internalModel.originalHeight,
        baseScale,
        finalScale,
        SCALE_TWEAK,
        xGame,
        yGame,
        xWorld: model.x,
        yWorld: model.y,
        currentViewH
    });
}

// Bootstrap
{
    const modelSelect = document.getElementById('modelSelect');
    if (modelSelect) {
        fillSelect(modelSelect, MODEL_OPTIONS.map(m => ({ value: m.id, label: m.label })));
        setSelectValue(modelSelect, currentModelId);
        modelSelect.onchange = () => {
            if (!modelSelect.value) return;
            loadModel(modelSelect.value).catch((e) => console.error(e));
        };
    }
}

loadModel(currentModelId).catch((e) => console.error(e));

{
    const snapshotBtn = document.getElementById('snapshotBtn');
    if (snapshotBtn) {
        snapshotBtn.onclick = () => {
            downloadTransparentModelSnapshot().catch((e) => console.error(e));
        };
    }
}

// --- Manual parameter controls (cheek, eyes, mouth) and optional mic lipsync ---
{
    const cheek0 = document.getElementById('cheek0');
    const cheek1 = document.getElementById('cheek1');
    const cheek2 = document.getElementById('cheek2');
    const cheekLock = document.getElementById('cheekLock');
    const eyeClosed = document.getElementById('eyeClosed');
    const eyeLock = document.getElementById('eyeLock');
    const mouthRange = document.getElementById('mouthRange');
    const mouthLock = document.getElementById('mouthLock');
    const micToggle = document.getElementById('micToggle');

    function setParameterById(model, id, value) {
        const im = model?.internalModel;
        const core = im?.coreModel;
        if (!core) return false;
        const v = Number(value) || 0;
        try {
            if (typeof core.setParameterValueById === 'function') {
                core.setParameterValueById(id, v, 1);
                return true;
            }
        } catch {}
        try {
            if (typeof core.setParamFloat === 'function') {
                const idx = Number(im?.[id + 'ParamIndex']) ?? -1;
                if (Number.isFinite(idx) && idx >= 0) {
                    core.setParamFloat(idx, v);
                    return true;
                }
            }
        } catch {}
        return false;
    }

    function applyCheek(value, lock) {
        if (!currentModel) return;
        const im = currentModel.internalModel;
        im.__magirecoCheekValue = Number(value) || 0;
        im.__magirecoCheekManualActive = true;
        im.__magirecoCheekLocked = !!lock;
        setParameterById(currentModel, 'ParamCheek', im.__magirecoCheekValue);
    }

    function applyEyeClosed(isClosed, lock) {
        if (!currentModel) return;
        const im = currentModel.internalModel;
        im.__magirecoEyeManualActive = !!isClosed;
        im.__magirecoEyeManualValue = isClosed ? 0 : 1;
        im.__magirecoEyeManualLocked = !!lock;
        // Immediately set params
        setParameterById(currentModel, 'ParamEyeLOpen', im.__magirecoEyeManualValue);
        setParameterById(currentModel, 'ParamEyeROpen', im.__magirecoEyeManualValue);
    }

    function applyMouth(value, lock) {
        if (!currentModel) return;
        const im = currentModel.internalModel;
        im.__magirecoMouthValue = Number(value) || 0;
        im.__magirecoMouthManualActive = true;
        im.__magirecoMouthLocked = !!lock;
        // Only control mouth open amount to avoid clobbering model mouth form (smile/frown).
        setParameterById(currentModel, 'ParamMouthOpenY', im.__magirecoMouthValue);
    }

    // Radio wiring
    [cheek0, cheek1, cheek2].forEach(el => {
        if (!el) return;
        el.onchange = (e) => applyCheek(e.target.value, cheekLock?.checked);
    });
    if (cheekLock) cheekLock.onchange = (e) => {
        const v = document.querySelector('input[name="cheek"]:checked')?.value ?? 0;
        applyCheek(v, e.target.checked);
    };

    if (eyeClosed) eyeClosed.onchange = (e) => applyEyeClosed(e.target.checked, eyeLock?.checked);
    if (eyeLock) eyeLock.onchange = (e) => applyEyeClosed(!!eyeClosed?.checked, e.target.checked);

    if (mouthRange) mouthRange.oninput = (e) => {
        // no-op while mic lipsync is active
        if (currentModel?.internalModel?.__magirecoMicActive) return;
        applyMouth(e.target.value, mouthLock?.checked);
    };
    if (mouthLock) mouthLock.onchange = (e) => {
        if (currentModel?.internalModel?.__magirecoMicActive) return;
        applyMouth(mouthRange?.value ?? 0, e.target.checked);
    };

    // mic lipsync
    let micStream = null;
    let micAnalyzer = null;
    let micCtx = null;
    let micRAF = null;

    function showToast(msg, ms = 3000) {
        try {
            const t = document.getElementById('toast');
            if (!t) return;
            t.textContent = String(msg);
            t.style.display = 'block';
            t.style.opacity = '1';
            clearTimeout(t.__toastTimer);
            t.__toastTimer = setTimeout(() => { t.style.display = 'none'; }, ms);
        } catch {}
    }

    async function startMic() {
        if (micStream) return;
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showToast('Microphone not available in this browser/context');
            return;
        }
        if (!window.isSecureContext) {
            showToast('Microphone requires a secure context (HTTPS).');
            // we still try, but browsers often block it
        }
        // try reading permission status for nicer messaging
        try {
            if (navigator.permissions && navigator.permissions.query) {
                try {
                    const p = await navigator.permissions.query({ name: 'microphone' });
                    if (p.state === 'denied') {
                        showToast('Microphone permission denied. Please enable it in browser settings.');
                        return;
                    }
                } catch {}
            }
        } catch {}

        try {
            micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            micCtx = new (window.AudioContext || window.webkitAudioContext)();
            const src = micCtx.createMediaStreamSource(micStream);
            micAnalyzer = micCtx.createAnalyser();
            micAnalyzer.fftSize = 1024;
            src.connect(micAnalyzer);

            const buf = new Uint8Array(micAnalyzer.frequencyBinCount);

            // Disable mouth controls while mic is active to avoid conflicts
            if (mouthRange) {
                mouthRange.disabled = true;
                mouthRange.style.pointerEvents = 'none';
                mouthRange.style.opacity = '0.5';
            }
            if (mouthLock) {
                mouthLock.disabled = true;
                mouthLock.style.pointerEvents = 'none';
                mouthLock.style.opacity = '0.5';
            }

            function frame() {
                // Use frequency-domain data like magireco_viewer for consistent sensitivity
                micAnalyzer.getByteFrequencyData(buf);
                const step = 100;
                const maxIndex = Math.min(700, buf.length - 1);
                const samples = [];
                for (let i = 0; i <= maxIndex; i += step) samples.push(buf[i]);
                const sum = samples.reduce((s, v) => s + v, 0);
                const avg = samples.length ? (sum / samples.length) : 0;

                const micSensitivityInput = document.getElementById('micSensitivity');
                const sensitivity = micSensitivityInput ? Number(micSensitivityInput.value) || 1 : 1;

                const mouthValBase = (avg - 20) / 60;
                const mouthValue = Math.min(1, Math.max(0, mouthValBase * sensitivity));

                if (currentModel) {
                    const im = currentModel.internalModel;
                    im.__magirecoMouthValue = mouthValue;
                    im.__magirecoMouthManualActive = true;
                    im.__magirecoMicActive = true;
                    if (mouthLock?.checked) im.__magirecoMouthLocked = true;
                    setParameterById(currentModel, 'ParamMouthOpenY', mouthValue);
                }
                micRAF = requestAnimationFrame(frame);
            }
            micRAF = requestAnimationFrame(frame);
            if (micToggle) micToggle.textContent = 'Stop Mic Lipsync';
            // enable mic sensitivity while mic is running
            const micSensitivityInput = document.getElementById('micSensitivity');
            if (micSensitivityInput) {
                micSensitivityInput.disabled = false;
                micSensitivityInput.style.pointerEvents = '';
                micSensitivityInput.style.opacity = '';
            }
        } catch (e) {
            console.error('Mic start failed', e);
            // friendly messages for common cases
            if (e && (e.name === 'NotAllowedError' || e.name === 'SecurityError')) {
                showToast('Microphone access was blocked. Check browser permissions or try Fullscreen first.');
            } else if (e && e.name === 'NotFoundError') {
                showToast('No microphone device found.');
            } else {
                showToast('Microphone start failed: ' + (e && e.message ? e.message : String(e)));
            }
            stopMic();
        }
    }

    function stopMic() {
        if (micRAF) cancelAnimationFrame(micRAF);
        micRAF = null;
        if (micCtx) try { micCtx.close(); } catch {}
        micCtx = null;
        if (micStream) {
            try { micStream.getTracks().forEach(t => t.stop()); } catch {}
        }
        micStream = null;
        micAnalyzer = null;
        if (currentModel && currentModel.internalModel) {
            currentModel.internalModel.__magirecoMicActive = false;
            // if mouth was only mic-driven and not locked, clear manual active so other systems resume
            if (!mouthLock?.checked) currentModel.internalModel.__magirecoMouthManualActive = false;
        }
        // Re-enable mouth UI
        if (mouthRange) {
            mouthRange.disabled = false;
            mouthRange.style.pointerEvents = '';
            mouthRange.style.opacity = '';
        }
        if (mouthLock) {
            mouthLock.disabled = false;
            mouthLock.style.pointerEvents = '';
            mouthLock.style.opacity = '';
        }
        // disable mic sensitivity when mic is stopped
        const micSensitivityInput = document.getElementById('micSensitivity');
        if (micSensitivityInput) {
            micSensitivityInput.disabled = true;
            micSensitivityInput.style.pointerEvents = 'none';
            micSensitivityInput.style.opacity = '0.5';
        }
        if (micToggle) micToggle.textContent = 'Start Mic Lipsync';
    }

    if (micToggle) micToggle.onclick = () => {
        if (micStream) stopMic(); else startMic();
    };

    // initialize UI values when a model loads (best-effort without calling inner helpers)
    const initControlsForModel = () => {
        try {
            if (!currentModel) return;
            const im = currentModel.internalModel;
            if (!im) return;

            // default: cheek 0
            if (cheek0) cheek0.checked = true;
            if (cheekLock) cheekLock.checked = false;
            im.__magirecoCheekValue = 0; im.__magirecoCheekManualActive = false; im.__magirecoCheekLocked = false;
            setParameterById(currentModel, 'ParamCheek', 0);

            // eyes default
            if (eyeClosed) eyeClosed.checked = false;
            if (eyeLock) eyeLock.checked = false;
            im.__magirecoEyeManualActive = false; im.__magirecoEyeManualValue = 1; im.__magirecoEyeManualLocked = false;
            setParameterById(currentModel, 'ParamEyeLOpen', 1);
            setParameterById(currentModel, 'ParamEyeROpen', 1);

            // mouth default
            if (mouthRange) mouthRange.value = 0;
            if (mouthLock) mouthLock.checked = false;
            im.__magirecoMouthValue = 0; im.__magirecoMouthManualActive = false; im.__magirecoMouthLocked = false; im.__magirecoMicActive = false;
            setParameterById(currentModel, 'ParamMouthOpenY', 0);

            // mic sensitivity default: disabled until mic starts
            const micSensitivityInput = document.getElementById('micSensitivity');
            if (micSensitivityInput) {
                micSensitivityInput.value = 1;
                micSensitivityInput.disabled = true;
                micSensitivityInput.style.pointerEvents = 'none';
                micSensitivityInput.style.opacity = '0.5';
            }

            // stop mic if running
            try { if (typeof stopMic === 'function') stopMic(); } catch {}
        } catch (e) { console.warn('initControlsForModel failed', e); }
    };

    // attach to model load path by watching currentModel changes (poll-ish)
    let lastModelWatch = null;
    function watchModelForInit() {
        if (currentModel !== lastModelWatch) {
            lastModelWatch = currentModel;
            initControlsForModel();
        }
        requestAnimationFrame(watchModelForInit);
    }
    watchModelForInit();

    // --- UI: menu toggle and fullscreen ---
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

        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const updateFullscreenUI = () => {
            if (!fullscreenBtn) return;
            fullscreenBtn.textContent = document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen';
        };
        if (fullscreenBtn) {
            fullscreenBtn.onclick = async () => {
                if (!document.fullscreenElement) {
                    try {
                        // try to request fullscreen and hide navigation UI when supported
                        if (document.documentElement.requestFullscreen.length === 0) {
                            await document.documentElement.requestFullscreen();
                        } else {
                            try { await document.documentElement.requestFullscreen({ navigationUI: 'hide' }); } catch { await document.documentElement.requestFullscreen(); }
                        }
                        // attempt to lock orientation to landscape when entering fullscreen (may fail silently)
                        try { if (screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape'); } catch (e) {}
                    } catch (e) { console.warn('requestFullscreen failed', e); }
                } else {
                    try {
                        await document.exitFullscreen();
                        try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) {}
                    } catch (e) { console.warn('exitFullscreen failed', e); }
                }
            };
            updateFullscreenUI();
            document.addEventListener('fullscreenchange', () => {
                updateFullscreenUI();
                try { updateRotateHint(); } catch {}
                try { applyFullscreenStyles(!!document.fullscreenElement); } catch {}
            });
        }

        // show rotate hint when in portrait on narrow devices
        function updateRotateHint() {
            try {
                const el = document.getElementById('rotateHint');
                if (!el) return;
                const isPortrait = window.innerHeight > window.innerWidth;
                // only show on narrow screens (mobile)
                if (isPortrait && Math.min(window.innerWidth, window.innerHeight) < 720) el.style.display = 'flex'; else el.style.display = 'none';
            } catch {}
        }
        window.addEventListener('resize', updateRotateHint);
        window.addEventListener('orientationchange', updateRotateHint);
        updateRotateHint();
    } catch (e) { console.warn('Menu/Fullscreen init failed', e); }

    function applyFullscreenStyles(isFull) {
        try {
            const canvas = app?.view;
            if (!canvas) return;
            if (isFull) {
                canvas.style.position = 'fixed';
                canvas.style.left = '0';
                canvas.style.top = '0';
                canvas.style.width = '100vw';
                canvas.style.height = '100vh';
                canvas.style.objectFit = 'cover';
                try { document.documentElement.style.backgroundColor = '#000'; } catch {}
            } else {
                canvas.style.position = '';
                canvas.style.left = '';
                canvas.style.top = '';
                canvas.style.width = '';
                canvas.style.height = '';
                canvas.style.objectFit = '';
                try { document.documentElement.style.backgroundColor = ''; } catch {}
                // force a layout refresh
                updateViewport();
            }
        } catch (e) { console.warn('applyFullscreenStyles failed', e); }
    }
}
