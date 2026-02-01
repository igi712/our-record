// Our Record v2: keep positioning logic, swap Live2D handling to a magireco_viewer-inspired controller.

// Models live under `assets/<id>/`.

const MODEL_OPTIONS = [
    { id: '100100', label: '100100 (Iroha)' },
    { id: '100200', label: '100200 (Yachiyo)' },
    { id: '100300', label: '100300 (Tsuruno)' },
    { id: '100400', label: '100400 (Sana)' },
    { id: '100500', label: '100500 (Felicia)' },
    { id: '300301', label: '300301 (Hinano (Uniform))' },
    { id: '301900', label: '301900 (Ayaka)' },
    { id: '303050', label: '303050 (Konomi (Winter))' }
];

function getModelOption(modelId) {
    return MODEL_OPTIONS.find(o => o.id === modelId) ?? null;
}

let currentModel = null;
let currentController = null;
let currentModelId = MODEL_OPTIONS[0]?.id ?? '100100';
let desiredFollowState = false; // current follow state (true while pressed)

// Centralized follow setter used by model press handlers and global release handlers
function setFollowEnabledGlobal(enabled, initialEvent, targetModel) {
    desiredFollowState = !!enabled;
    // Use targetModel if provided (clicked instance), otherwise fallback to global current
    const activeModel = targetModel || currentModel;

    if (activeModel) {
        try {
            if (typeof activeModel.__mrSetFollowEnabled === 'function') activeModel.__mrSetFollowEnabled(desiredFollowState);
        } catch (e) { console.warn('[v2 follow] setFollowEnabledGlobal failed', e); }

        // manage per-model move handler lifecycle
        try {
            if (!desiredFollowState) {
                // remove move handler if present
                if (activeModel.__mrMoveHandler) {
                    try { window.removeEventListener('pointermove', activeModel.__mrMoveHandler, true); } catch {}
                    try { window.removeEventListener('touchmove', activeModel.__mrMoveHandler, true); } catch {}
                    try { delete activeModel.__mrMoveHandler; } catch {}
                }

                // clear any pending initial-focus retries
                if (Array.isArray(activeModel.__mrMoveRetryTimers)) {
                    try { activeModel.__mrMoveRetryTimers.forEach(t => clearTimeout(t)); } catch {}
                    try { delete activeModel.__mrMoveRetryTimers; } catch {}
                }
            } else {
                // when enabling, ensure a move handler is attached
                if (!activeModel.__mrMoveHandler) {
                    const moveHandler = function(ev) {
                        try {
                            const im = activeModel.internalModel;
                            const fc = im && im.focusController;
                            if (!fc) return;

                            const rect = app?.view?.getBoundingClientRect?.();
                            const clientX = ev.clientX ?? (ev.touches && ev.touches[0] && ev.touches[0].clientX);
                            const clientY = ev.clientY ?? (ev.touches && ev.touches[0] && ev.touches[0].clientY);
                            if (clientX == null || clientY == null || !rect) return;

                            const canvasX = clientX - rect.left;
                            const canvasY = clientY - rect.top;

                            // Convert to model coordinates
                            // We do NOT call updateTransform here to avoid lag, assuming render loop handles it,
                            // but for the initial press, we force updated it in loadModel.
                            const pt = new PIXI.Point(canvasX, canvasY);
                            try { activeModel.toModelPosition(pt, pt, true); } catch {}

                            const origW = Number(im.originalWidth) || 1;
                            const origH = Number(im.originalHeight) || 1;

                            // Compute raw normalized coordinates (-1..1)
                            const rawNormX = (pt.x / origW) * 2 - 1;
                            const rawNormY = (pt.y / origH) * 2 - 1;
                            const eyeOffset = Number(activeModel.__mrEyeNormOffset) || 0;

                            // Sensitivity factor: per-model override or global override via window.__mrFollowSensitivity
                            const sensitivity = Number(activeModel.__mrFollowSensitivity ?? window.__mrFollowSensitivity ?? 1) || 1;

                            // Scale displacement: X relative to model center (0), Y relative to eye centroid (eyeOffset)
                            let finalNormX = rawNormX * sensitivity * 2;
                            let finalNormY = (eyeOffset + rawNormY * sensitivity) * 2;

                            // Clamp to reasonable range to avoid extreme focus values
                            const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
                            finalNormX = clamp(finalNormX, -2, 2);
                            finalNormY = clamp(finalNormY, -2, 2);

                            try { fc.focus(finalNormX, -finalNormY, false); } catch {}
                        } catch (e) { console.warn('[v2 follow] moveHandler error', e); }
                    };

                    activeModel.__mrMoveHandler = moveHandler;
                    window.addEventListener('pointermove', moveHandler, true);
                    window.addEventListener('touchmove', moveHandler, true);
                }

                // Immediate trigger: update focus using the press event immediately.
                // This ensures the eyes snap to cursor on the very first click.
                if (initialEvent && activeModel.__mrMoveHandler) {
                    try { activeModel.__mrMoveHandler(initialEvent); } catch (e) {}

                    // In some cases (model just created / focusController not present yet), the
                    // handler will return early. Schedule a few short retries so the initial
                    // press reliably snaps gaze once internals are ready. These timers are
                    // per-model and cleared when follow is disabled.
                    try {
                        const retryDelays = [50, 150, 350];
                        if (!Array.isArray(activeModel.__mrMoveRetryTimers)) activeModel.__mrMoveRetryTimers = [];
                        for (const d of retryDelays) {
                            const t = setTimeout(() => {
                                try {
                                    if (!desiredFollowState) return;
                                    if (typeof activeModel.__mrMoveHandler === 'function') {
                                        try { activeModel.__mrMoveHandler(initialEvent); } catch {}
                                    }
                                } catch (e) {}
                            }, d);
                            activeModel.__mrMoveRetryTimers.push(t);
                        }
                    } catch (e) { }
                }
            }
        } catch (e) { console.warn('[v2 follow] manage move handler failed', e); }
    }
}


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

function showToast(msg, ms = 3000) {
    // toasts removed per request; no-op
}

async function downloadModelSnapshot() {
    const model = currentModel;
    if (!model) return;

    const renderer = app?.renderer;
    const extract = renderer?.plugins?.extract;
    if (!renderer || !extract) {
        showToast('Snapshot not available: renderer extract plugin missing');
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
        for (let yy = 0; yy < h; yy++) {
            const row = yy * w * 4;
            for (let xx = 0; xx < w; xx++) {
                const a = data[row + xx * 4 + 3];
                if (a >= alphaThreshold) {
                    if (xx < minX) minX = xx;
                    if (yy < minY) minY = yy;
                    if (xx > maxX) maxX = xx;
                    if (yy > maxY) maxY = yy;
                }
            }
        }

        if (maxX < minX || maxY < minY) {
            return { canvas: srcCanvas, rect: { x: 0, y: 0, w, h } };
        }

        // Bottom-trim heuristic: scan up from the detected bottom and stop trimming
        // when we encounter any fully-opaque pixel (alpha === 255). This prevents
        // aggressive over-trimming while still allowing removal of a thin crop line.
        const origHeight = (maxY - minY + 1) | 0;

        let foundOpaqueRow = -1;
        // Limit scanning to a reasonable number of rows to bound runtime (e.g., up to 128 rows)
        const scanLimit = Math.min(origHeight, 128);
        for (let t = 0; t < scanLimit; t++) {
            const yy = maxY - t;
            if (yy < minY) break;
            const row = yy * w * 4;
            let anyFullyOpaque = false;
            for (let xx = 0; xx < w; xx++) {
                if (data[row + xx * 4 + 3] === 255) { anyFullyOpaque = true; break; }
            }
            if (anyFullyOpaque) {
                foundOpaqueRow = yy;
                break;
            }
        }

        if (foundOpaqueRow >= minY) {
            // Trim up to the opaque row (no extra margin to avoid over-trim)
            maxY = Math.max(minY, foundOpaqueRow);
        } else {
            // No fully-opaque row found near the bottom -- leave maxY as initially detected.
            // (This avoids accidental over-cropping when only semi-opaque pixels exist.)
            maxY = maxY;
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

        const w = Math.max(1, Math.ceil(b.width + pad * 6));
        const h = Math.max(1, Math.ceil(b.height + pad * 3));

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
            showToast('Snapshot failed: could not create PNG blob');
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
        showToast('Snapshot failed: ' + (e && e.message ? e.message : String(e)));
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

function setupControlsForModel(model, modelJson) {
    const motionSelect = document.getElementById('motionSelect');
    const expressionSelect = document.getElementById('expressionSelect');
    let replayBtn = document.getElementById('replayBtn');
    if (!replayBtn && motionSelect) {
        replayBtn = document.createElement('button');
        replayBtn.id = 'replayBtn';
        replayBtn.textContent = 'Replay';
        replayBtn.style.marginLeft = '0.5em';
        motionSelect.parentNode?.insertBefore(replayBtn, motionSelect.nextSibling);
    }

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
            if (!currentController) return;
            const { group, index } = JSON.parse(motionSelect.value);
            currentController.startMotion(group, index);
        };
        if (replayBtn) {
            replayBtn.onclick = () => {
                if (!currentController) return;
                const { group, index } = JSON.parse(motionSelect.value);
                currentController.startMotion(group, index);
            };
        }
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
            if (!currentController) return;
            const ok = currentController.setExpressionByName(expressionSelect.value);
            if (!ok) console.warn('Could not set expression', { name: expressionSelect.value });
        };

        // Reflect random choices from controller in the UI
        try {
            window.addEventListener('mrv2:randomChoice', (ev) => {
                try {
                    const d = ev && ev.detail;
                    if (!d) return;
                    // Motion select
                    if (motionSelect && typeof d.motionGroup !== 'undefined' && typeof d.motionIndex === 'number') {
                        const v = JSON.stringify({ group: d.motionGroup, index: d.motionIndex });
                        setSelectValue(motionSelect, v);
                        motionSelect.value = v;
                    }
                    // Expression
                    if (expressionSelect && typeof d.faceName === 'string' && d.faceName !== 'null') {
                        setSelectValue(expressionSelect, d.faceName);
                        expressionSelect.value = d.faceName;
                    }
                    // Cheek radio
                    try {
                        const r = document.querySelectorAll('input[name="cheek"]');
                        for (const el of r) {
                            if (String(el.value) === String(d.cheek)) {
                                el.checked = true;
                                applyCheek(el.value);
                                break;
                            }
                        }
                    } catch {}
                    // Eyes: update controller and the UI checkbox
                    try {
                        // controller: use explicit method to support tweening
                        if (currentController && typeof currentController.setEyeClosed === 'function') {
                            currentController.setEyeClosed(d.eyeClose === true || d.eyeOpen === 0, false);
                        } else {
                            applyEyeClosed(d.eyeOpen === 0);
                        }

                        // UI: find the checkbox by id and update checked state
                        const eyeEl = document.getElementById('eyeClose');
                        if (eyeEl) eyeEl.checked = (d.eyeClose === true || d.eyeOpen === 0);
                    } catch {}
                    // Mouth: update controller and the UI checkbox
                    try {
                        // controller: prefer tweened setter
                        if (currentController && typeof currentController.setMouth === 'function') {
                            // d.mouth may be 0..1 or an integer flag; treat mouthOpen flag first
                            const mouthVal = (typeof d.mouth === 'number') ? d.mouth : ((d.mouthOpen) ? 1 : 0);
                            currentController.setMouth(mouthVal, false);
                        } else {
                            const shouldOpen = (typeof d.mouth === 'number') ? (d.mouth > 0.5) : !!d.mouthOpen;
                            applyMouthOpen(shouldOpen);
                        }

                        const mouthEl = document.getElementById('mouthOpen');
                        if (mouthEl) mouthEl.checked = !!(d.mouthOpen || (typeof d.mouth === 'number' && d.mouth > 0.5));
                    } catch {}
                    // Tear: update controller and checkbox
                    try {
                        if (currentController && typeof currentController.setTear === 'function') {
                            currentController.setTear(d.tear ? 1 : 0, false);
                        }
                        const tearEl = document.getElementById('tear');
                        if (tearEl) tearEl.checked = !!d.tear;
                    } catch {}
                    // Soul Gem: update controller and checkbox
                    try {
                        if (currentController && typeof currentController.setSoulGem === 'function') {
                            currentController.setSoulGem(d.soulGem ? 1 : 0, false);
                        }
                        const soulEl = document.getElementById('soulGem');
                        if (soulEl) soulEl.checked = !!d.soulGem;
                    } catch {}
                } catch (e) {}
            });
        } catch (e) {}
    }
}

async function loadModel(modelId) {
    currentModelId = modelId;

    const modelOpt = getModelOption(modelId);

    // Clean up per-model follow handlers from the previous model (if any)
    try {
        const prev = currentModel;
        // remove per-model press handler
        try {
            if (prev && prev.__mrPressHandler) {
                try { prev.off('pointerdown', prev.__mrPressHandler); } catch {}
                try { delete prev.__mrPressHandler; } catch {}
            }
        } catch {}

        // remove per-model move handler
        try {
            if (prev && prev.__mrMoveHandler) {
                try { window.removeEventListener('pointermove', prev.__mrMoveHandler, true); } catch {}
                try { window.removeEventListener('touchmove', prev.__mrMoveHandler, true); } catch {}
                try { delete prev.__mrMoveHandler; } catch {}
            }
        } catch {}
    } catch {}

    if (currentController) {
        try { currentController.stopSequence?.(); } catch {}
        currentController = null;
    }

    if (currentModel) {
        try { worldContainer.removeChild(currentModel); } catch {}
        try { currentModel.destroy?.({ children: true }); } catch {}
        currentModel = null;
    }

    // Placement profiles.
    // Keep the original 16:9 home placement math intact for future use.
    const HOME16_OFFSET_X = -132;
    const HOME16_Y_INTERCEPT = 287.0999674453658;
    const HOME16_Y_PER_HEIGHT = 1.7775731122833498;

    // 4:3 (1200x900-derived) placement: yGame = a + b*height in a 1024x768 space.
    // Derived from your 1200x900 landscape logs by converting SetMvpMatrix ty into yGame
    // via: yGame = (WORLD_H/2) * (1 + ty) where WORLD_H=768.
    const VIEW43_OFFSET_X = -132;
    const VIEW43_Y_INTERCEPT = 383.35314268220066;
    const VIEW43_Y_PER_HEIGHT = 1.1379321886101403;

    // Portrait behavior: center model horizontally in portrait view (no per-height x regression).
    // We'll simply center at WORLD_W/2 and avoid changing scale in portrait.
    // (Old regression constants removed in favor of simple centering.)

    const modelPath = `assets/${modelId}/model.model3.json`;
    const paramsPath = modelPath.replace(/\/model\.model3\.json$/, '/params.json');

    const modelJson = await (await fetch(modelPath)).json();

    const params = await (await fetch(paramsPath)).json();
    const heightParam = Number(params.height ?? 0);
    const modelScaleParam = Number(params.modelScale ?? 1);

    const model = await PIXI.live2d.Live2DModel.from(modelPath, { autoInteract: false });
    
    // FIX: Hide initially to prevent "flash" of default motion
    model.visible = false;

    worldContainer.addChild(model);

    // Positioning: keep existing math.
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

    const vp = window.VIEWPORT || { mode: 'full43', worldW: WORLD_W, worldH: WORLD_H, viewW: WORLD_W, viewH: WORLD_H, viewLeft: 0, viewTop: 0 };
    const viewMode = String(vp.mode || 'full43');

    let xGame;
    let yGameFromHeight;
    let yGame;
    let scaleMult = 1.0;

    if (viewMode === 'home16') {
        xGame = (HOME16_W / 2) + HOME16_OFFSET_X;
        yGameFromHeight = HOME16_Y_INTERCEPT + (heightParam * HOME16_Y_PER_HEIGHT);
    } else {
        // full43 + portrait both use the 4:3-derived y regression.
        yGameFromHeight = VIEW43_Y_INTERCEPT + (heightParam * VIEW43_Y_PER_HEIGHT);

        if (viewMode === 'portrait') {
            // Center horizontally in portrait.
            xGame = (WORLD_W / 2);
            scaleMult = 1.0;
        } else {
            xGame = (WORLD_W / 2) + VIEW43_OFFSET_X;
        }
    }

    yGame = Number.isFinite(modelOpt?.homeYOverride) ? modelOpt.homeYOverride : yGameFromHeight;

    model.x = xGame;
    model.y = (vp.viewTop || 0) + ((vp.viewH || WORLD_H) - yGame);

    const SCALE_TWEAK = 1.0;
    const cw = canvasWidthUnits ?? 1;
    const baseScale = ((WORLD_W / 2) * cw) / model.internalModel.originalWidth;
    const finalScale = baseScale * modelScaleParam * SCALE_TWEAK * scaleMult;
    model.scale.set(finalScale);

    // v2 controller (magireco_viewer-inspired)
    currentController = window.createMagirecoStyleControllerV2(model, modelJson);

    // Apply initial cheek based on current UI selection.
    // (Expressions can rewrite params; we keep a manual override active.)
    try {
        const cheekValue = document.querySelector('input[name="cheek"]:checked')?.value;
        if (cheekValue != null) currentController.setCheek(cheekValue, false);
    } catch {}

    // Default: start motion 0 in the primary group if possible.
    try { 
        currentController.startMotion(currentController.defaultMotionGroup, 0); 
        // FIX #1: Force an internal update tick to start the motion immediately
        model.update(10);
        // FIX #3: Force a Transform update on the Pixi object so the world matrix is valid
        // for the very first interaction check.
        model.updateTransform();

        // FIX #4: Warm up bounds + interaction hit testing.
        // When swapping models via the dropdown, the first click can be missed if the
        // object hasn't had its bounds computed yet for Pixi's hit-testing.
        try { model.getBounds(true); } catch {}
        try {
            const interaction = app?.renderer?.plugins?.interaction;
            if (interaction && typeof interaction.update === 'function') interaction.update();
        } catch {}
    } catch {}

    setupControlsForModel(model, modelJson);

    // Reflect model's default ParamSoulgem value in the UI and controller (if present).
    try {
        const core = model?.internalModel?.coreModel;
        let soulVal = null;
        try {
            if (core) {
                if (typeof core.getParameterValueById === 'function') soulVal = core.getParameterValueById('ParamSoulgem');
                else if (typeof core.getParameterValue === 'function') soulVal = core.getParameterValue('ParamSoulgem');
                else if (Array.isArray(core.parameters)) {
                    const p = core.parameters.find(p => String(p.id || p.parameterId || p.name) === 'ParamSoulgem' || String(p.id || p.parameterId || p.name) === 'ParamSoulGem');
                    if (p && typeof p.value !== 'undefined') soulVal = p.value;
                } else if (model.internalModel && typeof model.internalModel.getParameterValue === 'function') soulVal = model.internalModel.getParameterValue('ParamSoulgem');
            }
        } catch (e) {}

        const enabled = !!(soulVal && Number(soulVal) > 0.5);
        const soulEl = document.getElementById('soulGem');
        if (soulEl) soulEl.checked = enabled;
        if (currentController && typeof currentController.setSoulGem === 'function') currentController.setSoulGem(enabled ? 1 : 0, false);
    } catch (e) {}

    // Ensure autoInteract is explicitly disabled by default; we'll enable it only while user presses the model.
    try { model._autoInteract = false; } catch {}

    // Debug instrumentation (opt-in via ?debugFollow=1)
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('debugFollow') === '1') {
            try {
                // wrap the internal flag to log sets and stack traces
                let __mr_follow_val = !!model._autoInteract;
                Object.defineProperty(model, '_autoInteract', {
                    configurable: true,
                    enumerable: false,
                    get() { return __mr_follow_val; },
                    set(v) {
                        const prev = __mr_follow_val;
                        __mr_follow_val = !!v;
                        console.log('[v2 follow][DBG] _autoInteract set ->', __mr_follow_val, 'prev:', prev);
                        console.trace();
                    }
                });

                // global event logging to compare devtools-on vs devtools-off behavior
                const logEv = (ev) => console.log('[v2 follow][DBG] event', ev.type, 'pointerType:', ev.pointerType || ev.type, 'buttons:', ev.buttons);
                window.addEventListener('pointerdown', logEv, true);
                window.addEventListener('pointerup', logEv, true);
                window.addEventListener('pointercancel', logEv, true);
                window.addEventListener('pointermove', logEv, true);
                window.addEventListener('blur', (e) => console.log('[v2 follow][DBG] blur')); 

                // also listen to mouse/touch end in case environment uses those
                window.addEventListener('mouseup', (e) => console.log('[v2 follow][DBG] mouseup'), true);
                window.addEventListener('touchend', (e) => console.log('[v2 follow][DBG] touchend'), true);
                window.addEventListener('touchcancel', (e) => console.log('[v2 follow][DBG] touchcancel'), true);

                console.log('[v2 follow][DBG] instrumentation enabled. Reproduce the bug with DevTools device toolbar ON and OFF and compare events.');
            } catch (e) { console.warn('[v2 follow][DBG] instrumentation failed', e); }
        }
    } catch (e) { console.warn('[v2 follow][DBG] params failed', e); }

    // Per-model follow helper (toggle-only).
    try {
        model.__mrSetFollowEnabled = (enabled) => {
            try {
                const next = !!enabled;
                model.__mrFollowEnabled = next;

                // Critical: keep pixi-live2d's internal pointer-driven focus OFF.
                // We drive focus ourselves via window pointermove + fc.focus (with __mrEyeNormOffset).
                try { model.autoInteract = false; } catch {}
                try { model._autoInteract = false; } catch {}

                // When disabling follow, return gaze to center.
                if (!next) {
                    try {
                        const fc = model.internalModel && model.internalModel.focusController;
                        if (fc && typeof fc.focus === 'function') {
                            fc.focus(0, 0, false);
                        } else if (typeof model.focus === 'function') {
                            try { model.focus((model.width || 0) / 2, (model.height || 0) / 2, false); } catch {}
                        }
                    } catch (e) { console.warn('[v2 follow] reset focus failed', e); }
                }
            } catch (e) {}
        };
        model.__mrIsFollowEnabled = () => { try { return !!model.__mrFollowEnabled; } catch { return false; } };
        // Start disabled
        model.__mrSetFollowEnabled(false);
        // apply persisted desired state to newly loaded model
        try {
            if (typeof model.__mrSetFollowEnabled === 'function') model.__mrSetFollowEnabled(!!desiredFollowState);

            // Ensure the model receives pointerdown so pressing the model triggers follow
            try {
                model.interactive = true;
                model.buttonMode = true;
                
                const pressHandler = (ev) => { 
                    try { 
                        // Mark the underlying DOM event so global canvas handlers don't double-trigger.
                        try { if (ev?.data?.originalEvent) ev.data.originalEvent.__mrFollowHandled = true; } catch {}
                        // FIX #2: Pass specific model instance.
                        // Pass 'ev.data.originalEvent' if it exists (Pixi), otherwise 'ev' (Native DOM).
                        // This allows setFollowEnabledGlobal to access clientX/Y correctly.
                        setFollowEnabledGlobal(true, ev.data ? ev.data.originalEvent : ev, model); 
                    } catch (e) { 
                        console.warn('[v2 follow] pressHandler failed', e); 
                    } 
                };
                
                try { model.on('pointerdown', pressHandler); model.__mrPressHandler = pressHandler; } catch (e) { console.warn('[v2 follow] attach pressHandler failed', e); }

                // Canvas-level press-to-follow hit-test.
                // This fixes the "first press after interacting with HTML UI" case where Pixi's
                // object-level pointerdown can be missed (pointer capture/focus quirks).
                try {
                    if (!window.__mrCanvasPressToFollowInstalled && app && app.view) {
                        const canvasHandler = function(ev) {
                            try {
                                if (!ev) return;
                                if (ev.__mrFollowHandled) return;
                                const m = currentModel;
                                if (!m) return;

                                const interaction = app?.renderer?.plugins?.interaction;
                                if (!interaction || typeof interaction.mapPositionToPoint !== 'function') return;

                                const pt = new PIXI.Point();
                                interaction.mapPositionToPoint(pt, ev.clientX, ev.clientY);

                                let hit = false;
                                try { hit = !!m.containsPoint(pt); } catch { hit = false; }

                                if (!hit && typeof interaction.hitTest === 'function') {
                                    try {
                                        const obj = interaction.hitTest(pt, app.stage);
                                        let cur = obj;
                                        while (cur) {
                                            if (cur === m) { hit = true; break; }
                                            cur = cur.parent;
                                        }
                                    } catch {}
                                }

                                if (!hit) return;

                                try { ev.__mrFollowHandled = true; } catch {}
                                setFollowEnabledGlobal(true, ev, m);
                            } catch (e) {
                                console.warn('[v2 follow] canvasHandler failed', e);
                            }
                        };

                        app.view.addEventListener('pointerdown', canvasHandler, true);
                        window.__mrCanvasPressToFollowInstalled = true;
                        window.__mrCanvasPressToFollowHandler = canvasHandler;
                    }
                } catch (e) { console.warn('[v2 follow] setup canvas press-to-follow failed', e); }

                // compute eye center offset (normalized) so gaze maps to eyes instead of mid-waist
                try {
                    // robust detector: waits for drawable vertices (retries), picks top N drawables by centroid Y,
                    // logs which drawables were chosen, stores selection on model, and applies offset (used during follow)
                    (function computeAndApplyEyeOffsetOnModel(m, opts = {}) {
                        const maxTries = Number(opts.maxTries) || 20;
                        const delayMs = Number(opts.delayMs) || 150;
                        const topCandidates = Number(opts.topCandidates) || 6;
                        let tries = 0;
                        function schedule() { if (tries >= maxTries) return; setTimeout(attempt, delayMs); }
                        function attempt() {
                            tries++;
                            if (!m || !m.internalModel) return schedule();
                            const im = m.internalModel;
                            const ids = (typeof im.getDrawableIDs === 'function') ? im.getDrawableIDs()
                                      : (typeof im.getDrawableIds === 'function' ? im.getDrawableIds() : []);
                            if (!ids || !ids.length) return schedule();

                            const origH = Number(im.originalHeight) || 1;
                            const entries = [];
                            for (let i = 0; i < ids.length; i++) {
                                let verts = null;
                                try {
                                    if (typeof im.getDrawableVertices === 'function') verts = im.getDrawableVertices(i);
                                    if (verts && !(verts instanceof Array)) verts = Array.from(verts);
                                } catch (e) { verts = null; }
                                if (!Array.isArray(verts) || verts.length < 2) continue;
                                let sumY = 0, c = 0;
                                for (let vi = 1; vi < verts.length; vi += 2) { sumY += verts[vi]; c++; }
                                if (c === 0) continue;
                                const meanY = sumY / c;
                                const normY = (meanY / origH) * 2 - 1;
                                entries.push({ index: i, name: String(ids[i] || ''), meanY, normY });
                            }

                            if (entries.length === 0) return schedule();

                            entries.sort((a, b) => a.meanY - b.meanY); // top-to-bottom (smaller meanY is higher)
                            const selected = entries.slice(0, topCandidates);
                            // compute median of selected meanY values to be robust to outliers
                            const ys = selected.map(e => Number(e.meanY)).filter(n => Number.isFinite(n));
                            ys.sort((a, b) => a - b);
                            let medianEyeY = 0;
                            if (ys.length > 0) {
                                const mid = Math.floor(ys.length / 2);
                                if (ys.length % 2 === 1) medianEyeY = ys[mid];
                                else medianEyeY = (ys[mid - 1] + ys[mid]) / 2;
                            }
                            const eyeNorm = (medianEyeY / origH) * 2 - 1;
                            const offset = -eyeNorm; // store negative so raw normalized Y minus offset maps center->eyes

                            m.__mrLastEyeSelection = { selected, medianEyeY, origH, eyeNorm, offset };

                            // set the stored offset first so any subsequent focus calculations use it
                            m.__mrEyeNormOffset = offset;

                            // console.log('[v2 follow] computed eye offset', Number(offset.toFixed(6)), 'from drawables:', selected.map(s => `${s.index}:${s.name}`));
                        }
                        attempt();
                    })(model, { maxTries: 20, delayMs: 150, topCandidates: 50 });
                } catch (e) { console.warn('[v2 follow] eye offset compute failed', e); model.__mrEyeNormOffset = 0; }

            } catch (e) { console.warn('[v2 follow] setup press handler failed', e); }

        } catch {}
    } catch {}

    // FIX #1: Make visible only after motion setup is complete.
    model.visible = true;
    currentModel = model;
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

// Hotkeys: S = stop, C = capture (ignore when typing in inputs)
(function setupHotkeys(){
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
                    try { currentController?.stopSequence?.(); } catch(e) { console.warn('stop hotkey failed', e); }
                    ev.preventDefault();
                } else if (k === 'c') {
                    try { downloadModelSnapshot(); } catch(e) { console.warn('capture hotkey failed', e); }
                    ev.preventDefault();
                }
            } catch (e) { console.warn('hotkey handler error', e); }
        }, false);
    } catch (e) { console.warn('setupHotkeys failed', e); }
})();

// Global press-to-follow: press anywhere to enable follow; release disables follow.
(function setupPressToFollow(){
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
})();

// --- Manual parameter controls + mic lipsync, wired to v2 controller ---
{
    const cheekRadios = Array.from(document.querySelectorAll('input[name="cheek"]'));
    const eyeClose = document.getElementById('eyeClose');
    const mouthOpen = document.getElementById('mouthOpen');
    const tear = document.getElementById('tear');
    const soulGem = document.getElementById('soulGem');
    const micToggle = document.getElementById('micToggle');
    const micSensitivityInput = document.getElementById('micSensitivity');

    function getSelectedCheekValue() {
        const v = document.querySelector('input[name="cheek"]:checked')?.value;
        if (v != null) return v;
        return cheekRadios[0]?.value ?? -1;
    }

    function applyCheek(value) {
        if (!currentController) return;
        currentController.setCheek(value, false);
    }

    // scenario_adv.json name: eyeClose (0/1)
    function applyEyeClose(isClosed) {
        if (!currentController) return;
        // Prefer scenario-style API if available; fall back for older controller versions.
        if (typeof currentController.setEyeClose === 'function') currentController.setEyeClose(isClosed, false);
        else currentController.setEyeClosed(isClosed, false);
    }

    // scenario_adv.json name: mouthOpen (0/1)
    function applyMouthOpen(isOpen) {
        if (!currentController) return;
        const v = isOpen ? 1 : 0;
        if (typeof currentController.setMouthOpen === 'function') currentController.setMouthOpen(v, false);
        else currentController.setMouth(v, false);
    }

    // scenario_adv.json name: tear (0/1)
    function applyTear(enabled) {
        if (!currentController) return;
        const v = enabled ? 1 : 0;
        if (typeof currentController.setTear === 'function') currentController.setTear(v, false);
    }

    // scenario_adv.json name: soulGem (0/1)
    function applySoulGem(enabled) {
        if (!currentController) return;
        const v = enabled ? 1 : 0;
        if (typeof currentController.setSoulGem === 'function') currentController.setSoulGem(v, false);
    }

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

                // Soul Gem
                try {
                    const enabled = !!d.soulGem;
                    if (soulGem) soulGem.checked = enabled;
                    applySoulGem(enabled);
                } catch {}
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

            if (currentController) {
                currentController.setMic(true, micAnalyzer, micBuf, Number(micSensitivityInput?.value) || 1);
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

        if (currentController) {
            currentController.setMic(false, null, null, Number(micSensitivityInput?.value) || 1);
            currentController.clearMouthManualIfUnlocked();
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
            if (!currentController) return;
            currentController.setMicSensitivity(Number(e.target.value) || 1);
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

        if (randomBtn) randomBtn.onclick = () => currentController?.clickPlayRandom?.();
        if (captureBtn) captureBtn.onclick = () => downloadModelSnapshot();
    } catch {}
}