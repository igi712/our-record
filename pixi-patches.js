// PIXI-level patches for the Live2D viewer.
// Loaded as a classic script AFTER pixi.min.js / pixi-live2d-display but BEFORE
// viewer.js and live2d.js so the patches are installed before any model loads.
// Self-contained: no dependencies on other viewer code.

(function () {
    'use strict';

    function safeWarn() {
        try { console.warn.apply(console, arguments); } catch {}
    }

    // Shared by live2d.js (which loads after this file) for safe warning logs.
    window.safeWarn = safeWarn;

    // Patch: Fallback for missing textures so models render even when some texture files 404.
    // Installs a safe replacement for PIXI.Texture.fromURL and `PIXI.Texture.from`.
    (function installPixiTextureFallback() {
        function makePlaceholder() {
            try {
                const c = document.createElement('canvas');
                c.width = 2; c.height = 2;
                const ctx = c.getContext('2d');
                ctx.clearRect(0,0,2,2);
                const base = new PIXI.BaseTexture(c);
                return new PIXI.Texture(base);
            } catch (e) {
                // If PIXI not available yet, return a simple object to avoid throws.
                return { _placeholder: true };
            }
        }

        function doPatch() {
            if (!window.PIXI) return false;
            if (PIXI.__mrTextureFallbackInstalled) return true;

            // Patch async loader from URL
            try {
                if (typeof PIXI.Texture.fromURL === 'function') {
                    const origFromURL = PIXI.Texture.fromURL.bind(PIXI.Texture);
                    PIXI.Texture.fromURL = async function (url, options) {
                        try {
                            return await origFromURL(url, options);
                        } catch (e) {
                            safeWarn('Missing texture, using placeholder:', url);
                            return makePlaceholder();
                        }
                    };
                }
            } catch (e) {}

            // Patch synchronous Texture.from (often used by libraries)
            try {
                if (typeof PIXI.Texture.from === 'function') {
                    const origFrom = PIXI.Texture.from.bind(PIXI.Texture);
                    PIXI.Texture.from = function (resource, options) {
                        try {
                            return origFrom(resource, options);
                        } catch (e) {
                            safeWarn('Texture.from failed, using placeholder:', resource);
                            return makePlaceholder();
                        }
                    };
                }
            } catch (e) {}

            PIXI.__mrTextureFallbackInstalled = true;
            return true;
        }

        // Try immediate patch; also retry once PIXI becomes available.
        try { doPatch(); } catch (e) {}
        const handle = setInterval(() => { if (doPatch()) clearInterval(handle); }, 250);
    })();

    // Suppress thrown/rejected texture-loading errors from terminating model load.
    (function suppressTextureErrors() {
        try {
            window.addEventListener('unhandledrejection', function (ev) {
                try {
                    const r = ev && ev.reason ? String(ev.reason) : '';
                    if (r.includes('Texture loading error')) {
                        safeWarn('Suppressed unhandled rejection:', r);
                        ev.preventDefault();
                    }
                } catch (e) {}
            });
            window.addEventListener('error', function (ev) {
                try {
                    const m = ev && ev.message ? String(ev.message) : '';
                    if (m.includes('Texture loading error')) {
                        safeWarn('Suppressed error event:', m);
                        ev.preventDefault();
                    }
                } catch (e) {}
            });
        } catch (e) {}
    })();
})();
