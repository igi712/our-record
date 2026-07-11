// model loading, assets resolution, and follow behavior.

import { resolveMaReAssetsBase, primePreloadForInitialModel, preloadModelToRam, ramFolderCache, nextLoadToken, isLoadTokenStale } from './model-assets.js';
export { resolveMaReAssetsBase, persistAssetsBaseOverride, clearAssetsBaseOverride } from './model-assets.js';
import { setupFollowForModel, cleanupOldModelHandlers } from './model-follow.js';
export { setFollowEnabledGlobal } from './model-follow.js';

export const state = {
    charaListData: [],
    live2dListData: [],
    currentCharacterId: 1001, // Default to Iroha
    currentLive2dId: '00', // Default to Magical Girl outfit
    currentModel: null,
    currentController: null,
    currentModelId: '100100', // Default: Iroha Tamaki - Magical Girl
    desiredFollowState: false // current follow state (true while pressed)
};





export function fillSelect(selectEl, options) {
    selectEl.innerHTML = '';
    for (const opt of options) {
        const el = document.createElement('option');
        el.value = opt.value;
        el.textContent = opt.label;
        selectEl.appendChild(el);
    }
}

export function setSelectValue(selectEl, value) {
    for (const opt of selectEl.options) {
        if (opt.value === value) {
            selectEl.value = value;
            return;
        }
    }
}

export function showToast(msg, ms = 3000) {
    // toasts removed per request; no-op
}

export function getSelectedCheekValue() {
    const v = document.querySelector('input[name="cheek"]:checked')?.value;
    if (v != null) return v;
    return document.querySelector('input[name="cheek"]')?.value ?? -1;
}

export function applyCheek(value) {
    if (!state.currentController) return;
    state.currentController.setCheek(value, false);
}

// scenario_adv.json name: eyeClose (0/1)
export function applyEyeClose(isClosed) {
    if (!state.currentController) return;
    // Prefer scenario-style API if available; fall back for older controller versions.
    if (typeof state.currentController.setEyeClose === 'function') state.currentController.setEyeClose(isClosed, false);
    else state.currentController.setEyeClosed(isClosed, false);
}

// scenario_adv.json name: mouthOpen (0/1)
export function applyMouthOpen(isOpen) {
    if (!state.currentController) return;
    const v = isOpen ? 1 : 0;
    if (typeof state.currentController.setMouthOpen === 'function') state.currentController.setMouthOpen(v, false);
    else state.currentController.setMouth(v, false);
}

// scenario_adv.json name: tear (0/1)
export function applyTear(enabled) {
    if (!state.currentController) return;
    const v = enabled ? 1 : 0;
    if (typeof state.currentController.setTear === 'function') state.currentController.setTear(v, false);
}

// scenario_adv.json name: soulGem (0/1)
export function applySoulGem(enabled) {
    if (!state.currentController) return;
    const v = enabled ? 1 : 0;
    if (typeof state.currentController.setSoulGem === 'function') state.currentController.setSoulGem(v, false);
}

export { downloadModelSnapshot } from './model-snapshot.js';

function findBestMtnExExpression(expressions) {
    if (!Array.isArray(expressions)) return null;

    // Find all expressions that match mtn_ex_01X pattern
    const mtnExMatches = [];
    for (const expr of expressions) {
        const fullName = String(expr.Name ?? expr.name ?? '');
        // Strip common extensions from the name for pattern matching
        const name = fullName.replace(/\.exp3\.json$/, '').replace(/\.json$/, '');
        const match = name.match(/^mtn_ex_01(\d+)$/);
        if (match) {
            const number = Number(match[1]);
            mtnExMatches.push({ originalName: fullName, name, number });
        }
    }

    // If no mtn_ex_01X expressions found, return null
    if (mtnExMatches.length === 0) return null;

    // Sort by number and return the lowest
    mtnExMatches.sort((a, b) => a.number - b.number);
    return mtnExMatches[0].originalName;
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
            if (!state.currentController) return;
            const { group, index } = JSON.parse(motionSelect.value);
            state.currentController.startMotion(group, index);
        };
        if (replayBtn) {
            replayBtn.onclick = () => {
                if (!state.currentController) return;
                const { group, index } = JSON.parse(motionSelect.value);
                state.currentController.startMotion(group, index);
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

        // Attempt to set the best mtn_ex_01X expression, fallback to first option
        let selectedExpression = null;
        if (expressionOptions.length > 0) {
            const bestMtnEx = findBestMtnExExpression(expressions);
            if (bestMtnEx) {
                selectedExpression = bestMtnEx;
            } else {
                selectedExpression = expressionOptions[0].value;
            }
            expressionSelect.value = selectedExpression;
        }

        expressionSelect.onchange = () => {
            if (!state.currentController) return;
            const ok = state.currentController.setExpressionByName(expressionSelect.value);
            if (!ok) console.warn('Could not set expression', { name: expressionSelect.value });
        };

        // Reflect random choices from controller in the UI
        // Wraps each item's sync in a try/catch that logs via safeWarn, so one
        // failing item doesn't abort the rest.
        const syncRandomChoiceItem = (label, fn) => {
            try { fn(); } catch (e) { safeWarn('mrv2:randomChoice handler failed', e); }
        };

        window.addEventListener('mrv2:randomChoice', (ev) => {
            try {
                const d = ev && ev.detail;
                if (!d) return;
                syncRandomChoiceItem('motion', () => {
                    if (motionSelect && typeof d.motionGroup !== 'undefined' && typeof d.motionIndex === 'number') {
                        const v = JSON.stringify({ group: d.motionGroup, index: d.motionIndex });
                        setSelectValue(motionSelect, v);
                        motionSelect.value = v;
                    }
                });
                syncRandomChoiceItem('expression', () => {
                    if (expressionSelect && typeof d.faceName === 'string' && d.faceName !== 'null') {
                        setSelectValue(expressionSelect, d.faceName);
                        expressionSelect.value = d.faceName;
                    }
                });
                syncRandomChoiceItem('cheek', () => {
                    const r = document.querySelectorAll('input[name="cheek"]');
                    for (const el of r) {
                        if (String(el.value) === String(d.cheek)) {
                            el.checked = true;
                            applyCheek(el.value);
                            break;
                        }
                    }
                });
                syncRandomChoiceItem('eye', () => {
                    if (state.currentController && typeof state.currentController.setEyeClosed === 'function') {
                        state.currentController.setEyeClosed(d.eyeClose === true || d.eyeOpen === 0, false);
                    } else {
                        applyEyeClose(d.eyeOpen === 0);
                    }
                    const eyeEl = document.getElementById('eyeClose');
                    if (eyeEl) eyeEl.checked = (d.eyeClose === true || d.eyeOpen === 0);
                });
                syncRandomChoiceItem('mouth', () => {
                    if (state.currentController && typeof state.currentController.setMouth === 'function') {
                        const mouthVal = (typeof d.mouth === 'number') ? d.mouth : ((d.mouthOpen) ? 1 : 0);
                        state.currentController.setMouth(mouthVal, false);
                    } else {
                        const shouldOpen = (typeof d.mouth === 'number') ? (d.mouth > 0.5) : !!d.mouthOpen;
                        applyMouthOpen(shouldOpen);
                    }
                    const mouthEl = document.getElementById('mouthOpen');
                    if (mouthEl) mouthEl.checked = !!(d.mouthOpen || (typeof d.mouth === 'number' && d.mouth > 0.5));
                });
                syncRandomChoiceItem('tear', () => {
                    if (state.currentController && typeof state.currentController.setTear === 'function') {
                        state.currentController.setTear(d.tear ? 1 : 0, false);
                    }
                    const tearEl = document.getElementById('tear');
                    if (tearEl) tearEl.checked = !!d.tear;
                });
                // Soul Gem: intentionally ignore random choice for soul gem to avoid toggling it when Random is pressed.
            } catch (e) { safeWarn('mrv2:randomChoice handler failed', e); }
        });

    }
}

const waitMs = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function waitForFrames(count) {
    for (let i = 0; i < count; i++) {
        await new Promise(resolve => requestAnimationFrame(resolve));
    }
}

function capturePreservedState(preserveState) {
    if (!preserveState) return null;
    try {
        const motionSelectEl = document.getElementById('motionSelect');
        const expressionSelectEl = document.getElementById('expressionSelect');
        return {
            motionValue: motionSelectEl?.value ?? null,
            faceName: expressionSelectEl?.value ?? null,
            cheek: getSelectedCheekValue(),
            eyeClose: !!document.getElementById('eyeClose')?.checked,
            mouthOpen: !!document.getElementById('mouthOpen')?.checked,
            tear: !!document.getElementById('tear')?.checked,
            soulGem: !!document.getElementById('soulGem')?.checked
        };
    } catch (e) { return null; }
}

function createFadeOut(appRef) {
    return function performFadeOut(target, controller) {
        if (!target) return;

        // Setup AlphaFilter for smooth fade out
        const filter = new PIXI.filters.AlphaFilter(1);
        // Ensure resolution matches renderer to prevent blurriness
        try { filter.resolution = appRef.renderer.resolution; } catch(e) {}
        target.filters = [filter];

        const duration = 200;
        const start = performance.now();

        function tick() {
            const now = performance.now();
            const progress = Math.min(1, (now - start) / duration);

            if (target.filters && target.filters[0]) {
                target.filters[0].alpha = 1 - progress;
            }

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                // Done. Now we safe to stop animations and destroy.
                try {
                    if (controller && typeof controller.stopSequence === 'function') {
                        controller.stopSequence();
                    }
                } catch(e) {}

                try {
                    if (target.parent) target.parent.removeChild(target);
                    target.destroy({ children: true });
                } catch (e) {}
            }
        }
        requestAnimationFrame(tick);
    };
}

function readParamValue(core, model, names) {
    try {
        if (!core) return null;
        for (const name of names) {
            try {
                if (typeof core.getParameterValueById === 'function') {
                    const v = core.getParameterValueById(name);
                    if (typeof v !== 'undefined' && v !== null) return v;
                }
                if (typeof core.getParameterValue === 'function') {
                    const v = core.getParameterValue(name);
                    if (typeof v !== 'undefined' && v !== null) return v;
                }
            } catch (e) {}
        }

        if (Array.isArray(core.parameters)) {
            for (const p of core.parameters) {
                const id = String(p.id || p.parameterId || p.name || '');
                for (const name of names) {
                    if (id === name) {
                        if (typeof p.value !== 'undefined') return p.value;
                    }
                }
            }
        }

        if (model.internalModel && typeof model.internalModel.getParameterValue === 'function') {
            for (const name of names) {
                try {
                    const v = model.internalModel.getParameterValue(name);
                    if (typeof v !== 'undefined' && v !== null) return v;
                } catch (e) {}
            }
        }

        return null;
    } catch (e) { return null; }
}

// Sets a checkbox/radio's `checked` state and applies the value to the controller.
// Encapsulates the repeated "read param -> set UI -> apply to controller" pattern
// used by applyDefaultParamsAndPreservedState.
function syncParamToUI(elId, checked, applyFn) {
    try {
        const el = document.getElementById(elId);
        if (el) el.checked = !!checked;
        if (typeof applyFn === 'function') applyFn(!!checked);
    } catch (e) {}
}

function applyDefaultParamsAndPreservedState(model, preservedState) {
    try {
        const core = model?.internalModel?.coreModel;

        // Soul gem
        try {
            const soulVal = readParamValue(core, model, ['ParamSoulgem', 'ParamSoulGem']);
            const enabled = !!(soulVal && Number(soulVal) > 0.5);
            syncParamToUI('soulGem', enabled, (on) => {
                const c = state.currentController;
                if (c && typeof c.setSoulGem === 'function') c.setSoulGem(on ? 1 : 0, false);
            });
        } catch (e) {}

        // Eye (use ParamEyeOpen if present, otherwise average left/right)
        try {
            let eyeVal = readParamValue(core, model, ['ParamEyeOpen']);
            if (eyeVal == null) {
                const l = readParamValue(core, model, ['ParamEyeLOpen']);
                const r = readParamValue(core, model, ['ParamEyeROpen']);
                if (typeof l === 'number' && typeof r === 'number') eyeVal = (l + r) / 2;
                else if (typeof l === 'number') eyeVal = l;
                else if (typeof r === 'number') eyeVal = r;
            }
            if (typeof eyeVal === 'number') {
                const closed = !!(Number(eyeVal) < 0.5);
                syncParamToUI('eyeClose', closed, applyEyeClose);
            }
        } catch (e) {}

        // Mouth
        try {
            const mouthVal = readParamValue(core, model, ['ParamMouthOpen', 'ParamMouth']);
            if (typeof mouthVal === 'number') {
                const open = !!(Number(mouthVal) > 0.5);
                syncParamToUI('mouthOpen', open, applyMouthOpen);
            }
        } catch (e) {}

        // Tear
        try {
            const tearVal = readParamValue(core, model, ['ParamTear']);
            if (typeof tearVal === 'number') {
                const enabled = !!(Number(tearVal) > 0.5);
                syncParamToUI('tear', enabled, applyTear);
            }
        } catch (e) {}

        // Cheek (some models may expose a ParamCheek)
        try {
            const cheekVal = readParamValue(core, model, ['ParamCheek']);
            if (typeof cheekVal === 'number') {
                const v = String(cheekVal);
                try {
                    const r = document.querySelectorAll('input[name="cheek"]');
                    for (const el of r) {
                        if (String(el.value) === v) {
                            el.checked = true;
                            applyCheek(el.value);
                            break;
                        }
                    }
                } catch (e) {}
            }
        } catch (e) {}

        // Force eyes open by default on model load (user preference override)
        syncParamToUI('eyeClose', false, applyEyeClose);

        // If the caller requested preservation of state (e.g., switching outfit for same character),
        // re-apply preserved UI/controller state and prefer it over model defaults.
        try {
            if (preservedState) {
                // Motion: try to set previous motion if available
                try {
                    const ms = document.getElementById('motionSelect');
                    if (ms && preservedState.motionValue) {
                        setSelectValue(ms, preservedState.motionValue);
                        ms.value = preservedState.motionValue;
                    }
                } catch (e) {}

                // Expression/Face
                try {
                    const es = document.getElementById('expressionSelect');
                    if (es && preservedState.faceName) {
                        setSelectValue(es, preservedState.faceName);
                        es.value = preservedState.faceName;
                    }
                } catch (e) {}

                // Cheek
                try {
                    if (preservedState.cheek != null) {
                        applyCheek(preservedState.cheek);
                        const r = document.querySelectorAll('input[name="cheek"]');
                        for (const el of r) { el.checked = (String(el.value) === String(preservedState.cheek)); }
                    }
                } catch (e) {}

                // Eye Close
                syncParamToUI('eyeClose', !!preservedState.eyeClose, applyEyeClose);

                // Mouth
                syncParamToUI('mouthOpen', !!preservedState.mouthOpen, applyMouthOpen);

                // Tear
                syncParamToUI('tear', !!preservedState.tear, applyTear);

                // Soul Gem
                syncParamToUI('soulGem', !!preservedState.soulGem, (on) => {
                    const c = state.currentController;
                    if (c && typeof c.setSoulGem === 'function') c.setSoulGem(on ? 1 : 0, false);
                });
            }
        } catch (e) {}

    } catch (e) {}
}



async function applyInitialMotionAndExpression(opts) {
    const {
        controller,
        modelJson,
        isStaleLoad,
        startMotionTracked
    } = opts || {};

    if (!controller) return;
    const motionSelect = document.getElementById('motionSelect');
    const expressionSelect = document.getElementById('expressionSelect');

    const parseMotionValue = (raw) => {
        try {
            if (!raw) return null;
            const v = JSON.parse(raw);
            if (!v || typeof v.group === 'undefined' || typeof v.index !== 'number') return null;
            return { group: v.group, index: v.index };
        } catch { return null; }
    };

    const getMotionSelection = () => {
        const parsed = parseMotionValue(motionSelect?.value);
        if (parsed) return parsed;
        const group = controller.defaultMotionGroup || (modelJson?.FileReferences?.Motions ? Object.keys(modelJson.FileReferences.Motions)[0] : null);
        return group ? { group, index: 0 } : null;
    };

    const motionDelays = [0, 50, 150, 300];
    for (const d of motionDelays) {
        if (d) await waitMs(d);
        if (typeof isStaleLoad === 'function' && isStaleLoad()) return;
        const sel = getMotionSelection();
        if (!sel) break;
        if (startMotionTracked(sel.group, sel.index)) break;
    }

    const expressionDelays = [0, 50, 150, 300];
    for (const d of expressionDelays) {
        if (d) await waitMs(d);
        if (typeof isStaleLoad === 'function' && isStaleLoad()) return;
        const name = expressionSelect?.value;
        if (!name) break;
        try {
            if (controller.setExpressionByName(name)) break;
        } catch {}
    }
}

function warmUpModelInteraction(model) {
    // FIX #1: Force an internal update tick to start the motion immediately
    try { model.update(10); } catch {}
    // FIX #3: Force a Transform update on the Pixi object so the world matrix is valid
    // for the very first interaction check.
    try { model.updateTransform(); } catch {}

    // FIX #4: Warm up bounds + interaction hit testing.
    // When swapping models via the dropdown, the first click can be missed if the
    // object hasn't had its bounds computed yet for Pixi's hit-testing.
    try { model.getBounds(true); } catch {}
    try {
        const interaction = app?.renderer?.plugins?.interaction;
        if (interaction && typeof interaction.update === 'function') interaction.update();
    } catch {}
}

export async function loadModel(modelId, opts = {}) {
    const ctx = beginLoad(modelId, opts);
    const { model, params, modelJson } = await fetchAndCreateModel(modelId);

    const performFadeOut = createFadeOut(app);
    beginTransition(ctx, performFadeOut);

    positionModel(model, params, modelId);

    const { controller, lastMotionStart } = await createAndConfigureController(
        model, modelJson, ctx.preservedState, ctx.isStaleLoad
    );

    // Debug instrumentation (opt-in via ?debugFollow=1)
    installFollowDebugInstrumentation(model);

    // Follow-on-click interactive behavior: keep for viewer, skip for quotes/story pages.
    if (opts.interactive !== false) {
        setupFollowForModel(model);
    }

    await transitionIn(model, ctx, performFadeOut, lastMotionStart);
}

// Phase 1: capture load context (stale-token, preserved state, old model/controller refs).
function beginLoad(modelId, opts) {
    const preserveState = !!opts.preserveState;

    const loadToken = nextLoadToken();
    const isStaleLoad = () => isLoadTokenStale(loadToken) || state.currentModelId !== modelId;

    // Capture UI/controller state if we need to preserve it across outfit swaps.
    const preservedState = capturePreservedState(preserveState);

    const oldModel = state.currentModel;
    const oldController = state.currentController;

    state.currentModelId = modelId;

    return { preserveState, loadToken, isStaleLoad, preservedState, oldModel, oldController };
}

// Phase 2: RAM cache lookup + model creation + JSON parsing.
async function fetchAndCreateModel(modelId) {
    let fileList = ramFolderCache.get(modelId);
    if (!fileList) {
        fileList = await preloadModelToRam(modelId);
    }

    // Pixi-Live2D-Display will find the one named 'model.model3.json' automatically.
    const model = await PIXI.live2d.Live2DModel.from(fileList, { autoInteract: false });

    // POSITIONING: Get params from RAM
    const paramsFile = fileList.find(f => f.webkitRelativePath === 'params.json');
    const params = JSON.parse(await paramsFile.text());

    // CONTROLLER: Get JSON from RAM
    const jsonFile = fileList.find(f => f.webkitRelativePath === 'model.model3.json');
    const modelJson = JSON.parse(await jsonFile.text());

    return { model, params, modelJson };
}

// Phase 3: transition bookkeeping for the OLD model (cleanup + fade-out on character change).
function beginTransition(ctx, performFadeOut) {
    // Cleanup per-model follow handlers from the OLD model immediately
    cleanupOldModelHandlers(ctx.oldModel);

    // Detach global controller reference so UI doesn't control the dying model.
    // IMPORTANT: We do NOT call stopSequence() here. We want the old model to keep animating
    // during the fade-out. We will stop it in performFadeOut() after the visual fade is done.
    state.currentController = null;

    // Clear global reference so other scripts don't target the dying model
    state.currentModel = null;

    // LOGIC:
    // If it's a Character change (!preserveState): Fade out OLD immediately. The stage will be empty briefly while NEW loads.
    // If it's an Outfit change (preserveState): Keep OLD visible. We will fade it out ONLY when NEW is ready (Crossfade).
    if (ctx.oldModel && !ctx.preserveState) {
        performFadeOut(ctx.oldModel, ctx.oldController);
    }
}

// Phase 4: placement math (16:9 home / 4:3 / portrait profiles).
function positionModel(model, params, modelId) {
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

    const heightParam = Number(params.height ?? 0);
    let modelScaleParam = Number(params.modelScale ?? 1.3);
    if (String(modelId) === '160100') modelScaleParam = 1.3; // Infinite Iroha

    // Hide initially so we can fade in
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
        const home16OffsetX = (window.__QUOTES_CONFIG?.xOffset ?? HOME16_OFFSET_X);
        xGame = (HOME16_W / 2) + home16OffsetX;
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

    yGame = yGameFromHeight;

    model.x = xGame;
    model.y = (vp.viewTop || 0) + ((vp.viewH || WORLD_H) - yGame);

    const SCALE_TWEAK = 1.0;
    const cw = canvasWidthUnits ?? 1;
    const baseScale = ((WORLD_W / 2) * cw) / model.internalModel.originalWidth;
    const finalScale = baseScale * modelScaleParam * SCALE_TWEAK * scaleMult;
    model.scale.set(finalScale);
}

// Phase 5: create v2 controller + wire controls + apply default/preserved params + initial motion.
async function createAndConfigureController(model, modelJson, preservedState, isStaleLoad) {
    // v2 controller (magireco_viewer-inspired)
    const newController = window.createMagirecoStyleControllerV2(model, modelJson);
    state.currentController = newController;

    // Track the most recent motion start so we can wait before fading in.
    let lastMotionStart = null;
    const startMotionTracked = (group, index) => {
        try {
            const res = newController.startMotion(group, index);
            lastMotionStart = res;
            return typeof res === 'undefined' ? true : !!res;
        } catch (e) {
            lastMotionStart = null;
            return false;
        }
    };

    // Apply initial cheek based on current UI selection.
    // (Expressions can rewrite params; we keep a manual override active.)
    try {
        const cheekValue = document.querySelector('input[name="cheek"]:checked')?.value;
        if (cheekValue != null) state.currentController.setCheek(cheekValue, false);
    } catch {}

    setupControlsForModel(model, modelJson);

    // Reflect model's default parameter values (soulGem, eyeClose, mouthOpen, tear, cheek) in the UI and controller (if present).
    applyDefaultParamsAndPreservedState(model, preservedState);

    // Apply the selected motion/expression, with retries for long-load cases.
    try {
        await applyInitialMotionAndExpression({
            controller: newController,
            modelJson,
            isStaleLoad,
            startMotionTracked
        });
    } catch {}

    warmUpModelInteraction(model);

    // Ensure autoInteract is explicitly disabled by default; we'll enable it only while user presses the model.
    try { model._autoInteract = false; } catch {}

    return { controller: newController, lastMotionStart };
}

// Debug instrumentation (opt-in via ?debugFollow=1) — logs follow events to reproduce bugs.
function installFollowDebugInstrumentation(model) {
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('debugFollow') !== '1') return;
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
    } catch (e) { console.warn('[v2 follow][DBG] params failed', e); }
}

// Phase 6: wait for motion, crossfade old model (if outfit change), then fade in new model.
async function transitionIn(model, ctx, performFadeOut, lastMotionStart) {
    // Wait for the chosen motion to finish loading/starting before fading in.
    try {
        if (lastMotionStart && typeof lastMotionStart.then === 'function') {
            await lastMotionStart;
        }
    } catch {}

    // Give the model a frame or two to apply the first motion update.
    await waitForFrames(2);
    try { model.update(10); } catch {}
    try { model.updateTransform(); } catch {}

    // If the user switched models mid-load, bail out before showing this one.
    if (ctx.isStaleLoad()) return;

    // --- TRANSITION LOGIC: CROSSFADE IF NEEDED ---
    // If we have an old model waiting (because it was an outfit change),
    // now is the time to fade it out, creating the crossfade effect.
    if (ctx.oldModel && ctx.preserveState) {
        performFadeOut(ctx.oldModel, ctx.oldController);
    }
    // --- END TRANSITION LOGIC ---

    // --- FADE IN LOGIC ---
    // We use AlphaFilter because standard container.alpha often breaks with Live2D's
    // internal depth testing/culling.
    const alphaFilter = new PIXI.filters.AlphaFilter(0);

    // FIX: Set resolution to match the renderer to prevent blurriness during the fade
    alphaFilter.resolution = app.renderer.resolution;

    model.filters = [alphaFilter];
    model.visible = true;

    state.currentModel = model;

    const fadeDuration = 200;
    const fadeStartTime = performance.now();

    function animateFade() {
        // If the user switched models mid-fade, stop updating this old one
        if (state.currentModel !== model) return;

        const now = performance.now();
        const elapsed = now - fadeStartTime;
        const progress = Math.min(1, elapsed / fadeDuration);

        if (alphaFilter) {
            alphaFilter.alpha = progress;
        }

        if (progress < 1) {
            requestAnimationFrame(animateFade);
        } else {
            // Performance optimization: Remove the filter once fully visible
            // so Pixi doesn't have to render to an offscreen buffer every frame.
            model.filters = null;
        }
    }

    requestAnimationFrame(animateFade);
    // --- END FADE IN LOGIC ---
}



// Helper functions for character/outfit management
export function getOutfitsForCharacter(charaId) {
    return state.live2dListData.filter(outfit => outfit.charaId === charaId);
}

export function buildModelId(charaId, live2dId) {
    return String(charaId).padStart(4, '0') + String(live2dId).padStart(2, '0');
}

export function getModelOption(modelId) {
    if (!modelId) return null;
    const s = String(modelId);
    const charaId = Number(s.slice(0, 4));
    const live2dId = String(s.slice(4)).padStart(2, '0');

    const character = state.charaListData.find(c => c.id === charaId) ?? null;
    const outfit = state.live2dListData.find(o => o.charaId === charaId && String(o.live2dId).padStart(2, '0') === live2dId) ?? null;

    const charLabel = character ? (character.title ? `${character.name} (${character.title})` : character.name) : null;
    const outfitDesc = outfit?.description ?? live2dId;
    const label = charLabel ? `${String(charaId)} - ${charLabel} (${String(live2dId).padStart(2,'0')} - ${outfitDesc})` : modelId;

    return {
        id: modelId,
        charaId,
        live2dId,
        character,
        outfit,
        label
    };
}

// Start preloading in background without blocking module load.
// (primePreloadForInitialModel is defined in model-assets.js and imported above.)
primePreloadForInitialModel();
