// Asset base URL resolution, RAM preloading, and loading indicator.

import { state } from './model.js';

// --- Module-private mutable state ---
let __mrResolvedAssetsBase = null;
let __mrResolvedAssetsBaseSource = null;
let __mrLoadToken = 0;
let __mrPreloadCount = 0;
let __mrWorldDimFilter = null;

// --- Loading indicator positioning + "connecting" overlay ---

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

// --- Asset base URL detection + overrides ---
// Behavior:
//  1) If a local override is saved in localStorage (key: 'mrAssetsBase') or window.MR_ASSETS_BASE or query param 'assetsBase', use it.
//  2) Otherwise, try to detect a local checkout by probing a known small model JSON under
//     'assets/ma-re-data/resource/image_native/live2d_v4/100100/model.model3.json'. If it exists, prefer local path.
//  3) Fallback to a remote raw.githubusercontent.com URL (configurable via query param 'assetsRemote' or window.MR_ASSETS_REMOTE).
// Global cache to store the "virtual files" so we don't re-fetch them on outfit changes
export const ramFolderCache = new Map();

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

export async function preloadModelToRam(modelId) {
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

// --- Load-token helpers (stale-load detection, owned here) ---
// loadModel() increments a token before each load and checks staleness after async gaps.

export function nextLoadToken() {
    return ++__mrLoadToken;
}

export function isLoadTokenStale(token) {
    return __mrLoadToken !== token;
}

// Prime the preloader for the initial/default model id so the first visible load benefits from parallel fetching.
export function primePreloadForInitialModel() {
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

// NOTE: primePreloadForInitialModel() is not invoked at module top-level here because it
// depends on `state` (imported from model.js), which is initialized only after this module
// is evaluated. model.js calls it at the bottom of its own module body.
