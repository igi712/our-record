// Follow behavior: pointer-driven gaze tracking, press-to-follow, and eye-center offset.

import { state } from './model.js';

// Centralized follow setter used by model press handlers and global release handlers
export function setFollowEnabledGlobal(enabled, initialEvent, targetModel) {
    state.desiredFollowState = !!enabled;
    // Use targetModel if provided (clicked instance), otherwise fallback to global current
    const activeModel = targetModel || state.currentModel;

    if (activeModel) {
        try {
            if (typeof activeModel.__mrSetFollowEnabled === 'function') activeModel.__mrSetFollowEnabled(state.desiredFollowState);
        } catch (e) { console.warn('[v2 follow] setFollowEnabledGlobal failed', e); }

        // manage per-model move handler lifecycle
        try {
            if (!state.desiredFollowState) {
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
                                    if (!state.desiredFollowState) return;
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

// Remove per-model follow handlers from a model that is being unloaded.
export function cleanupOldModelHandlers(oldModel) {
    try {
        if (!oldModel) return;
        // Disable interaction on the dying model so user can't click it while it fades
        oldModel.interactive = false;
        try { oldModel._autoInteract = false; } catch {}

        // Remove specific handlers
        if (oldModel.__mrPressHandler) {
            try { oldModel.off('pointerdown', oldModel.__mrPressHandler); } catch {}
            try { delete oldModel.__mrPressHandler; } catch {}
        }
        if (oldModel.__mrMoveHandler) {
            try { window.removeEventListener('pointermove', oldModel.__mrMoveHandler, true); } catch {}
            try { window.removeEventListener('touchmove', oldModel.__mrMoveHandler, true); } catch {}
            try { delete oldModel.__mrMoveHandler; } catch {}
        }
    } catch {}
}

// Wire up per-model follow on a freshly created model: toggle helper, pointer/click
// handlers, canvas-level press-to-follow hit-test, and the eye-center offset computation.
export function setupFollowForModel(model) {
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
            if (typeof model.__mrSetFollowEnabled === 'function') model.__mrSetFollowEnabled(!!state.desiredFollowState);

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
                                const m = state.currentModel;
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
}
