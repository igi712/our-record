// model loading, assets resolution, and follow behavior.

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

let __mrResolvedAssetsBase = null;
let __mrResolvedAssetsBaseSource = null;
let __mrLoadToken = 0;
let __mrPreloadCount = 0;

function positionLoadingIndicator() {
    try {
        const el = document.getElementById('loading');
        const canvas = document.getElementById('canvas');
        if (!el || !canvas) return;

        const rect = canvas.getBoundingClientRect();
        const lw = el.offsetWidth || 334;
        const lh = el.offsetHeight || 54;

        // Align right edge to canvas right edge and bottom to canvas bottom with a small inset
        let left = Math.round(rect.right - lw);
        let top = Math.round(rect.bottom - lh - 16); // 16px inset from canvas bottom

        // Ensure the indicator doesn't go off the left/top edges
        left = Math.max(left, Math.round(rect.left + 6));
        top = Math.max(top, 6);

        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
        el.style.right = 'auto';
        el.style.bottom = 'auto';
    } catch (e) { /* ignore */ }
}

function isPortraitViewMode() {
    try {
        const vp = window.VIEWPORT;
        if (vp && typeof vp.mode === 'string') return vp.mode === 'portrait';
        return window.innerHeight > window.innerWidth;
    } catch (e) { return false; }
}

let __mrWorldDimFilter = null;

function __mrSetConnecting(on) {
    try {
        const root = document.documentElement;
        if (!root) return;
        if (on) {
            __mrPreloadCount = (__mrPreloadCount || 0) + 1;
            if (__mrPreloadCount === 1) {
                root.classList.add('connecting');

                // Apply Pixi brightness dim to worldContainer so the background gradient (viewerBgSprite)
                // is not affected. Use ColorMatrixFilter to adjust brightness.
                try {
                    if (window.worldContainer && typeof PIXI !== 'undefined') {
                        if (!__mrWorldDimFilter) {
                            __mrWorldDimFilter = new PIXI.filters.ColorMatrixFilter();
                            try { __mrWorldDimFilter.brightness(0.95, false); } catch (e) {}
                        }
                        try { window.worldContainer.filters = [__mrWorldDimFilter]; } catch (e) {}
                    }
                } catch (e) {}

                // Only use JS fallback positioning when the app's view mode is portrait
                if (isPortraitViewMode()) {
                    // position once immediately and a couple of retries to handle async layout changes on mobile
                    try { positionLoadingIndicator(); } catch (e) {}
                    setTimeout(() => { try { positionLoadingIndicator(); } catch (e) {} }, 120);
                    setTimeout(() => { try { positionLoadingIndicator(); } catch (e) {} }, 600);
                }
            }
        } else {
            __mrPreloadCount = Math.max(0, (__mrPreloadCount || 0) - 1);
            if (__mrPreloadCount === 0) {
                root.classList.remove('connecting');
                try { if (window.worldContainer) window.worldContainer.filters = null; } catch (e) {}
            }
        }
    } catch (e) {}
}

// Keep indicator positioned when viewport changes
try {
    window.addEventListener('resize', positionLoadingIndicator, true);
    window.addEventListener('orientationchange', positionLoadingIndicator, true);
    window.addEventListener('fullscreenchange', positionLoadingIndicator, true);
} catch (e) {}

// Asset base URL detection + overrides.
// Behavior:
//  1) If a local override is saved in localStorage (key: 'mrAssetsBase') or window.MR_ASSETS_BASE or query param 'assetsBase', use it.
//  2) Otherwise, try to detect a local checkout by probing a known small model JSON under
//     'assets/ma-re-data/resource/image_native/live2d_v4/100100/model.model3.json'. If it exists, prefer local path.
//  3) Fallback to a remote raw.githubusercontent.com URL (configurable via query param 'assetsRemote' or window.MR_ASSETS_REMOTE).
// Global cache to store the "virtual files" so we don't re-fetch them on outfit changes
const ramFolderCache = new Map();

// --- 1. ROBUST PRELOADER (Ignores 404s) ---

async function fetchToVirtualFile(targetUrl, fileName) {
    try {
        // Debug: report individual fetch attempts when preloading
        try { console.debug && console.debug(`[MR] preloader fetching ${fileName} from ${targetUrl}`); } catch (e) {}
        const res = await fetch(targetUrl);
        if (!res.ok) {
            // Log warning but DO NOT throw error. Return null to skip this file.
            console.warn(`[MR] Optional file missing (skipped): ${fileName} (${res.status})`);
            return null;
        }
        const blob = await res.blob();
        // Create a File-like object (works with pixi-live2d-display)
        const file = new File([blob], fileName);
        // Important: set webkitRelativePath so the library can find it "in the folder"
        Object.defineProperty(file, 'webkitRelativePath', { value: fileName });
        return file;
    } catch (e) {
        console.warn(`[MR] Network error skipping file: ${fileName}`, e);
        return null;
    }
}

async function preloadModelToRam(modelId) {
    if (ramFolderCache.has(modelId)) return ramFolderCache.get(modelId);

    // Show connecting cursor / banner while preloading
    __mrSetConnecting(true);

    try {
        const ASSETS_BASE = await resolveMaReAssetsBase();
        const baseUrl = `${ASSETS_BASE}/${modelId}/`;
        
        // We must fetch the main model JSON first to know what else to fetch
        // Try v4 first, then v2
        let mainJsonName = 'model.model3.json';
        let mainJson = await (await fetch(baseUrl + mainJsonName).catch(() => null))?.json();
        
        if (!mainJson) {
            // Fallback to Cubism 2
            mainJsonName = 'model.json';
            mainJson = await (await fetch(baseUrl + mainJsonName)).json();
        }

        const filesToFetch = new Set();
        filesToFetch.add(mainJsonName); // Add the main file itself
        filesToFetch.add('params.json'); // Add the separate params file

        // --- Collect paths from JSON ---
        
        // Cubism 4 (FileReferences)
        if (mainJson.FileReferences) {
            const fr = mainJson.FileReferences;
            if (fr.Moc) filesToFetch.add(fr.Moc);
            if (fr.Physics) filesToFetch.add(fr.Physics);
            if (fr.Pose) filesToFetch.add(fr.Pose);
            if (fr.DisplayInfo) filesToFetch.add(fr.DisplayInfo); // This is the .cdi3.json causing 404s
            if (fr.UserData) filesToFetch.add(fr.UserData);
            
            if (Array.isArray(fr.Textures)) {
                fr.Textures.forEach(t => filesToFetch.add(t));
            }
            
            if (fr.Motions) {
                Object.values(fr.Motions).forEach(group => {
                    if (Array.isArray(group)) {
                        group.forEach(m => {
                            if (m.File) filesToFetch.add(m.File);
                            if (m.Sound) filesToFetch.add(m.Sound);
                        });
                    }
                });
            }
            
            if (Array.isArray(fr.Expressions)) {
                fr.Expressions.forEach(e => { if (e.File) filesToFetch.add(e.File); });
            }
        }
        // Cubism 2
        else {
            if (mainJson.model) filesToFetch.add(mainJson.model);
            if (mainJson.physics) filesToFetch.add(mainJson.physics);
            if (mainJson.pose) filesToFetch.add(mainJson.pose);
            if (Array.isArray(mainJson.textures)) mainJson.textures.forEach(t => filesToFetch.add(t));
            
            if (mainJson.motions) {
                Object.values(mainJson.motions).forEach(group => {
                    if (Array.isArray(group)) {
                        group.forEach(m => {
                            if (m.file) filesToFetch.add(m.file);
                            if (m.sound) filesToFetch.add(m.sound);
                        });
                    }
                });
            }
            if (Array.isArray(mainJson.expressions)) {
                mainJson.expressions.forEach(e => { if (e.file) filesToFetch.add(e.file); });
            }
        }

        // --- Fetch All in Parallel ---
        const filesArray = Array.from(filesToFetch);
        try { console.info && console.info(`[MR] preloader will fetch ${filesArray.length} files for model ${modelId}:`, filesArray); } catch (e) {}
        const promises = filesArray.map(fileName => 
            fetchToVirtualFile(baseUrl + fileName, fileName)
        );

        const results = await Promise.all(promises);
        
        // Filter out nulls (files that 404'd) so the library doesn't crash trying to read them
        const validFiles = results.filter(f => f !== null);

        // Determine which names were skipped so we can optionally synthesize placeholders
        const skippedNames = [];
        for (let i = 0; i < filesArray.length; i++) {
            if (!results[i]) skippedNames.push(filesArray[i]);
        }

        try {
            const fetchedCount = results.filter(Boolean).length;
            console.info && console.info(`[MR] preloader fetched ${fetchedCount}/${filesArray.length} files for model ${modelId}. Skipped:`, skippedNames);
        } catch (e) {}

        // Create lightweight placeholder files for missing assets that the loader expects
        // (textures and JSON files). This prevents pixi-live2d's validation from failing
        // when optional files 404.
        const placeholders = [];
        if (skippedNames.length) {
            try {
                // tiny transparent 1x1 PNG base64
                const tinyPngB64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
                const b64ToUint8 = (b64) => {
                    const bin = atob(b64);
                    const arr = new Uint8Array(bin.length);
                    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
                    return arr;
                };

                for (const name of skippedNames) {
                    const lower = String(name).toLowerCase();
                    let file = null;

                    // Images
                    if (/\.(png|jpe?g|gif|webp)$/.test(lower)) {
                        const blob = new Blob([b64ToUint8(tinyPngB64)], { type: 'image/png' });
                        file = new File([blob], name, { type: 'image/png' });
                        Object.defineProperty(file, 'webkitRelativePath', { value: name });
                    }
                    // JSON-like files (empty object)
                    else if (/\.(json|exp3\.json|cdi3\.json)$/.test(lower)) {
                        const blob = new Blob([JSON.stringify({})], { type: 'application/json' });
                        file = new File([blob], name, { type: 'application/json' });
                        Object.defineProperty(file, 'webkitRelativePath', { value: name });
                    }
                    // Small empty audio placeholder
                    else if (/\.(mp3|wav|ogg|m4a)$/.test(lower)) {
                        const blob = new Blob([], { type: 'application/octet-stream' });
                        file = new File([blob], name);
                        Object.defineProperty(file, 'webkitRelativePath', { value: name });
                    }

                    if (file) {
                        placeholders.push(file);
                        console.warn && console.warn(`[MR] created placeholder for missing file: ${name}`);
                    }
                }
            } catch (e) {
                console.warn && console.warn('[MR] placeholder creation failed', e);
            }
        }

        const finalFiles = validFiles.concat(placeholders);

        if (placeholders.length) {
            console.info && console.info(`[MR] preloader added ${placeholders.length} placeholder files to satisfy loader expectations for model ${modelId}`);
        }

        ramFolderCache.set(modelId, finalFiles);
        return finalFiles;
    } finally {
        __mrSetConnecting(false);
    }
}


function getAssetsOverride() {
    try {
        // 1) explicit programmatic override
        if (window.MR_ASSETS_BASE) return String(window.MR_ASSETS_BASE).replace(/\/$/, '');

        // 2) saved override in localStorage
        try {
            const v = localStorage.getItem('mrAssetsBase');
            if (v) return String(v).replace(/\/$/, '');
        } catch (e) {}

        // 3) query param override
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.has('assetsBase')) return params.get('assetsBase').replace(/\/$/, '');
        } catch (e) {}

        return null;
    } catch (e) { return null; }
}

export async function resolveMaReAssetsBase() {
    if (__mrResolvedAssetsBase) {
        try { console.info('[MR] assets base (cached):', __mrResolvedAssetsBase, 'source:', __mrResolvedAssetsBaseSource); } catch (e) {}
        return __mrResolvedAssetsBase;
    }

    let source = 'unknown';
    const override = getAssetsOverride();
    if (override) {
        __mrResolvedAssetsBase = override;
        // detect override origin
        try {
            if (window.MR_ASSETS_BASE) source = 'window.MR_ASSETS_BASE';
            else {
                const params = new URLSearchParams(window.location.search);
                if (params.has('assetsBase')) source = 'query param assetsBase';
                else if (typeof localStorage !== 'undefined' && localStorage.getItem('mrAssetsBase')) source = 'localStorage mrAssetsBase';
            }
        } catch (e) {}
        __mrResolvedAssetsBaseSource = source;
        try { console.info('[MR] assets base resolved (override):', __mrResolvedAssetsBase, 'source:', source); } catch (e) {}
        return __mrResolvedAssetsBase;
    }

    const localBase = 'assets/ma-re-data/resource/image_native/live2d_v4';
    // Try probing a small known model JSON. Use a short timeout so detection is fast.
    try {
        const probeUrl = `${localBase}/100100/model.model3.json`;
        try { console.debug('[MR] probing local assets at', probeUrl); } catch (e) {}
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        let timer;
        if (controller) timer = setTimeout(() => controller.abort(), 2000);
        const resp = await fetch(probeUrl, { method: 'GET', cache: 'no-store', signal: controller ? controller.signal : undefined });
        if (timer) clearTimeout(timer);
        if (resp && resp.ok) {
            __mrResolvedAssetsBase = localBase;
            __mrResolvedAssetsBaseSource = 'local (probe)';
            try { console.info('[MR] assets base resolved (local probe):', __mrResolvedAssetsBase); } catch (e) {}
            return __mrResolvedAssetsBase;
        } else {
            try { console.debug('[MR] local probe HTTP result', resp && resp.status); } catch (e) {}
        }
    } catch (e) {
        try { console.debug('[MR] local probe failed:', e && (e.message || e.name) ? (e.message || e.name) : e); } catch (e2) {}
        // ignore - probe failed (not found or network error or CORS)
    }

    // No local copy detected -- choose remote base.
    try {
        const params = new URLSearchParams(window.location.search);
        const remoteParam = params.get('assetsRemote');
        const programmaticRemote = window.MR_ASSETS_REMOTE || remoteParam || null;
        if (programmaticRemote) {
            __mrResolvedAssetsBase = String(programmaticRemote).replace(/\/$/, '');
            source = window.MR_ASSETS_REMOTE ? 'window.MR_ASSETS_REMOTE' : 'query param assetsRemote';
            __mrResolvedAssetsBaseSource = source;
            try { console.info('[MR] assets base resolved (override remote):', __mrResolvedAssetsBase, 'source:', source); } catch (e) {}
            return __mrResolvedAssetsBase;
        }
    } catch (e) {}

    // Default remote (can be overridden via assetsRemote param or window.MR_ASSETS_REMOTE)
    __mrResolvedAssetsBase = 'https://raw.githubusercontent.com/igi712/ma-re-data/main/resource/image_native/live2d_v4';
    __mrResolvedAssetsBaseSource = 'default remote';
    try { console.info('[MR] assets base resolved (default remote):', __mrResolvedAssetsBase); } catch (e) {}
    return __mrResolvedAssetsBase;
}

export function persistAssetsBaseOverride(val) {
    try {
        if (!val) { localStorage.removeItem('mrAssetsBase'); }
        else localStorage.setItem('mrAssetsBase', String(val).replace(/\/$/, ''));
        // clear cached resolved value so next resolve honors change
        __mrResolvedAssetsBase = null;
    } catch (e) { console.warn('persistAssetsBaseOverride failed', e); }
}

export function clearAssetsBaseOverride() { persistAssetsBaseOverride(null); }

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

export async function downloadModelSnapshot() {
    const model = state.currentModel;
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

        const sanitizeForFilename = (s) => {
            try {
                if (!s) return '';
                return String(s).normalize('NFKD').replace(/[<>:"\/\\|?*]/g, '').replace(/[^\w\s.\-]/g, '').trim().replace(/\s+/g, '_');
            } catch (e) { return String(s).replace(/\s+/g,'_'); }
        };

        const meta = (typeof getModelOption === 'function') ? getModelOption(state.currentModelId) : null;
        const charName = meta?.character?.name ?? null;
        const outfitName = meta?.outfit?.description ?? meta?.live2dId ?? null;

        let fileBase = String(state.currentModelId || 'model');
        if (charName || outfitName) {
            const a = sanitizeForFilename(charName ?? 'model');
            const b = sanitizeForFilename(outfitName ?? '');
            fileBase = b ? `${a}_${b}` : a;
        }

        const fileName = `${fileBase}_${Date.now()}.png`;

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
                        if (state.currentController && typeof state.currentController.setEyeClosed === 'function') {
                            state.currentController.setEyeClosed(d.eyeClose === true || d.eyeOpen === 0, false);
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
                        if (state.currentController && typeof state.currentController.setMouth === 'function') {
                            // d.mouth may be 0..1 or an integer flag; treat mouthOpen flag first
                            const mouthVal = (typeof d.mouth === 'number') ? d.mouth : ((d.mouthOpen) ? 1 : 0);
                            state.currentController.setMouth(mouthVal, false);
                        } else {
                            const shouldOpen = (typeof d.mouth === 'number') ? (d.mouth > 0.5) : !!d.mouthOpen;
                            applyMouthOpen(shouldOpen);
                        }

                        const mouthEl = document.getElementById('mouthOpen');
                        if (mouthEl) mouthEl.checked = !!(d.mouthOpen || (typeof d.mouth === 'number' && d.mouth > 0.5));
                    } catch {}
                    // Tear: update controller and checkbox
                    try {
                        if (state.currentController && typeof state.currentController.setTear === 'function') {
                            state.currentController.setTear(d.tear ? 1 : 0, false);
                        }
                        const tearEl = document.getElementById('tear');
                        if (tearEl) tearEl.checked = !!d.tear;
                    } catch {}
                    // Soul Gem: intentionally ignore random choice for soul gem to avoid toggling it when Random is pressed.
                    // Do not change controller/UI for soul gem on random events.
                } catch (e) {}
            });
        } catch (e) {}
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

function cleanupOldModelHandlers(oldModel) {
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

function applyDefaultParamsAndPreservedState(model, preservedState) {
    try {
        const core = model?.internalModel?.coreModel;

        // Soul gem
        try {
            const soulVal = readParamValue(core, model, ['ParamSoulgem', 'ParamSoulGem']);
            const enabled = !!(soulVal && Number(soulVal) > 0.5);
            const soulEl = document.getElementById('soulGem');
            if (soulEl) soulEl.checked = enabled;
            if (state.currentController && typeof state.currentController.setSoulGem === 'function') state.currentController.setSoulGem(enabled ? 1 : 0, false);
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
                const eyeEl = document.getElementById('eyeClose');
                if (eyeEl) eyeEl.checked = closed;
                applyEyeClose(closed);
            }
        } catch (e) {}

        // Mouth
        try {
            const mouthVal = readParamValue(core, model, ['ParamMouthOpen', 'ParamMouth']);
            if (typeof mouthVal === 'number') {
                const open = !!(Number(mouthVal) > 0.5);
                const mouthEl = document.getElementById('mouthOpen');
                if (mouthEl) mouthEl.checked = open;
                applyMouthOpen(open);
            }
        } catch (e) {}

        // Tear
        try {
            const tearVal = readParamValue(core, model, ['ParamTear']);
            if (typeof tearVal === 'number') {
                const enabled = !!(Number(tearVal) > 0.5);
                const tearEl = document.getElementById('tear');
                if (tearEl) tearEl.checked = enabled;
                applyTear(enabled);
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
        try {
            const eyeEl = document.getElementById('eyeClose');
            if (eyeEl) { eyeEl.checked = false; applyEyeClose(false); }
        } catch (e) {}

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
                try { const eyeEl = document.getElementById('eyeClose'); if (eyeEl) { eyeEl.checked = !!preservedState.eyeClose; applyEyeClose(!!preservedState.eyeClose); } } catch (e) {}

                // Mouth
                try { const mouthEl = document.getElementById('mouthOpen'); if (mouthEl) { mouthEl.checked = !!preservedState.mouthOpen; applyMouthOpen(!!preservedState.mouthOpen); } } catch (e) {}

                // Tear
                try { const tearEl = document.getElementById('tear'); if (tearEl) { tearEl.checked = !!preservedState.tear; applyTear(!!preservedState.tear); } } catch (e) {}

                // Soul Gem
                try { const soulEl = document.getElementById('soulGem'); if (soulEl) { soulEl.checked = !!preservedState.soulGem; applySoulGem(!!preservedState.soulGem); } } catch (e) {}
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
    const preserveState = !!opts.preserveState;

    const loadToken = ++__mrLoadToken;
    const isStaleLoad = () => __mrLoadToken !== loadToken || state.currentModelId !== modelId;

    // Capture UI/controller state if we need to preserve it across outfit swaps.
    const preservedState = capturePreservedState(preserveState);

    const oldModel = state.currentModel;
    const oldController = state.currentController;

    state.currentModelId = modelId;

    let fileList = ramFolderCache.get(modelId);
    if (!fileList) {
        fileList = await preloadModelToRam(modelId);
    }

    // Pass the Array of File objects. 
    // Pixi-Live2D-Display will find the one named 'model.model3.json' automatically.
    const model = await PIXI.live2d.Live2DModel.from(fileList, { autoInteract: false });

    // POSITIONING: Get params from RAM
    const paramsFile = fileList.find(f => f.webkitRelativePath === 'params.json');
    const params = JSON.parse(await paramsFile.text());
    
    // ... (Your positioning logic using 'params.height' etc.)
    // worldContainer.addChild(model);
    
    // CONTROLLER: Get JSON from RAM
    const jsonFile = fileList.find(f => f.webkitRelativePath === 'model.model3.json');
    const modelJson = JSON.parse(await jsonFile.text());
    const modelOpt = getModelOption(modelId);

    // --- TRANSITION LOGIC START ---
    // Cleanup per-model follow handlers from the OLD model immediately
    cleanupOldModelHandlers(oldModel);

    // Detach global controller reference so UI doesn't control the dying model.
    // IMPORTANT: We do NOT call stopSequence() here. We want the old model to keep animating
    // during the fade-out. We will stop it in performFadeOut() after the visual fade is done.
    state.currentController = null;

    // Clear global reference so other scripts don't target the dying model
    state.currentModel = null;

    // Define the Fade Out function
    const performFadeOut = createFadeOut(app);

    // LOGIC:
    // If it's a Character change (!preserveState): Fade out OLD immediately. The stage will be empty briefly while NEW loads.
    // If it's an Outfit change (preserveState): Keep OLD visible. We will fade it out ONLY when NEW is ready (Crossfade).
    if (oldModel && !preserveState) {
        performFadeOut(oldModel, oldController);
    }

    // --- TRANSITION LOGIC END (Setup part) ---

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

    const ASSETS_BASE = await resolveMaReAssetsBase();
    const modelPath = `${ASSETS_BASE}/${modelId}/model.model3.json`;
    const paramsPath = `${ASSETS_BASE}/${modelId}/params.json`;

    // const modelJson = await (await fetch(modelPath)).json();

    // const params = await (await fetch(paramsPath)).json();
    const heightParam = Number(params.height ?? 0);
    let modelScaleParam = Number(params.modelScale ?? 1.3);
    if (String(modelId) === '160100') modelScaleParam = 1.3; // Infinite Iroha

    // const model = await PIXI.live2d.Live2DModel.from(modelData, { autoInteract: false });

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

    yGame = yGameFromHeight;

    model.x = xGame;
    model.y = (vp.viewTop || 0) + ((vp.viewH || WORLD_H) - yGame);

    const SCALE_TWEAK = 1.0;
    const cw = canvasWidthUnits ?? 1;
    const baseScale = ((WORLD_W / 2) * cw) / model.internalModel.originalWidth;
    const finalScale = baseScale * modelScaleParam * SCALE_TWEAK * scaleMult;
    model.scale.set(finalScale);

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
    if (isStaleLoad()) return;

    // --- TRANSITION LOGIC: CROSSFADE IF NEEDED ---
    // If we have an old model waiting (because it was an outfit change),
    // now is the time to fade it out, creating the crossfade effect.
    if (oldModel && preserveState) {
        performFadeOut(oldModel, oldController);
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

// Prime the preloader for the initial/default model id so the first visible load benefits from parallel fetching.
function primePreloadForInitialModel() {
    try {
        const id = state.currentModelId;
        if (!id) return;
        if (ramFolderCache.has(id)) {
            try { console.debug && console.debug(`[MR] preloader: model ${id} already cached`); } catch (e) {}
            return;
        }
        const run = async () => {
            try {
                console.info && console.info(`[MR] preloader starting for initial model ${id}`);
                await preloadModelToRam(id);
                console.info && console.info(`[MR] preloader completed for initial model ${id}`);
            } catch (e) {
                console.warn && console.warn(`[MR] preloader failed for ${id}`, e);
            }
        };
        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(run, { timeout: 2000 });
        } else {
            setTimeout(run, 50);
        }
    } catch (e) { }
}

// Start preloading in background without blocking module load.
primePreloadForInitialModel();
