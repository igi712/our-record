// Pixi / viewer setup
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;

// Clamp DPR to avoid extremely large backing buffers on high-DPI mobile devices.
const MAX_DPR = 2; // clamp to prevent huge memory/scrolling issues on mobile
function getAppliedDPR() { return Math.max(1, Math.min(MAX_DPR, window.devicePixelRatio || 1)); }

const viewerBgState = { type: 'home', color: 0x000000 };

const app = new PIXI.Application({
    backgroundColor: viewerBgState.color,
    autoStart: true,
    sharedTicker: true,
    view: document.getElementById('canvas'),
    antialias: false,
    autoDensity: true,
    resolution: getAppliedDPR()
});
// Hint to the browser/canvas to use smooth scaling
if (app.renderer && app.renderer.view && app.renderer.view.style) app.renderer.view.style.imageRendering = 'auto';
// Ensure the page doesn't scroll due to canvas backing size on some mobile browsers
try { document.body.style.overflow = 'hidden'; } catch (e) {}

function colorToCssHex(rgb) {
    const n = Number(rgb) >>> 0;
    return '#' + n.toString(16).padStart(6, '0');
}

function createVerticalGradientTexture(topRgb, bottomRgb, height = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = Math.max(2, height | 0);
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, colorToCssHex(topRgb));
    grad.addColorStop(1, colorToCssHex(bottomRgb));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return PIXI.Texture.from(canvas);
}



// World is 1024x768 (4:3).
// Historically we viewed the 16:9 home region (1024x576) centered inside it.
// v2 viewer now defaults to full 4:3, but keeps the 16:9 numbers for future use.
const WORLD_W = 1024;
const WORLD_H = 768;

// 16:9 home region inside the 4:3 world (preserved for future use)
const HOME16_W = 1024;
const HOME16_H = 576;
const HOME16_LEFT = 0;
const HOME16_TOP = (WORLD_H - HOME16_H) / 2;

// Full 4:3 view
const VIEW43_W = WORLD_W;
const VIEW43_H = WORLD_H;
const VIEW43_LEFT = 0;
const VIEW43_TOP = 0;

// Full (taller) view: tuned taller height to show more of the model
const VIEWFULL_W = WORLD_W;
const VIEWFULL_H = 955;
const VIEWFULL_LEFT = 0;
const VIEWFULL_TOP = (WORLD_H - VIEWFULL_H) / 2;

// Portrait view: keep full height, crop width to 3:4 (shows more vertical content)
const PORTRAIT_W = Math.round((WORLD_H * 3) / 4); // 576 for 768h
const PORTRAIT_H = WORLD_H;
const PORTRAIT_LEFT = Math.round((WORLD_W - PORTRAIT_W) / 2); // 224
const PORTRAIT_TOP = 0;

// Session-only user view preference (null = auto default)
let userViewMode = null;

function getInitialViewOverride() {
    try {
        const params = new URLSearchParams(window.location.search);
        const v = String(params.get('view') || '').toLowerCase();
        if (!v) return null;
        if (v === 'home16' || v === '16:9' || v === '16x9') return 'home16';
        if (v === 'full43' || v === '4:3' || v === '4x3') return 'full43';
        if (v === 'full' || v === 'tall') return 'full';
        if (v === 'portrait') return 'portrait';

        return null;
    } catch {
        return null;
    }
}

function detectAutoViewMode() {
    // Portrait if the browser viewport is portrait.
    return (window.innerHeight || 0) > (window.innerWidth || 0) ? 'portrait' : 'full43';
}

const cameraContainer = new PIXI.Container();

const gameBg = new PIXI.Graphics();
cameraContainer.addChild(gameBg);

const sceneBgContainer = new PIXI.Container();
cameraContainer.addChild(sceneBgContainer);

const worldContainer = new PIXI.Container();
cameraContainer.addChild(worldContainer);
app.stage.addChild(cameraContainer);

// Opaque borders covering bleeding from Live2D custom rendering
const viewerBgTexture = createVerticalGradientTexture(0x000000, 0x333333);
const viewerBgGraphics = new PIXI.Graphics();
app.stage.addChild(viewerBgGraphics);

const cameraMask = new PIXI.Graphics();
cameraContainer.addChild(cameraMask);
cameraContainer.mask = cameraMask;



let currentViewW = VIEW43_W;
let currentViewH = VIEW43_H;
let currentViewLeft = VIEW43_LEFT;
let currentViewTop = VIEW43_TOP;
let currentViewMode = 'full43';

function updateViewport() {
    const w = Math.max(1, window.innerWidth || 1);
    const h = Math.max(1, window.innerHeight || 1);

    // Update renderer resolution if DPR changed (helps when user zooms or rotates device)
    const dprNow = getAppliedDPR();
    if (app.renderer.resolution !== dprNow) {
        app.renderer.resolution = dprNow;
        console.log('DPR changed -> applied renderer resolution:', window.devicePixelRatio, '->', dprNow);
    }

    // Ensure CSS canvas size matches viewport to avoid scroll and fractional scaling artifacts
    try {
        app.view.style.width = w + 'px';
        app.view.style.height = h + 'px';
    } catch (e) {}

    app.renderer.resize(w, h);

    // Opaque borders are updated at the end of the function

    const overrideMode = getInitialViewOverride();
    const configMode = window.__QUOTES_CONFIG?.viewMode;
    const isPortraitViewport = h > w;

    let mode;
    if (configMode) {
        mode = configMode;
    } else {
        const requested = userViewMode || overrideMode;
        if (isPortraitViewport) {
            // Portrait only switches between Normal (768h) and Full (tallH); skip 16:9.
            mode = (requested === 'full' || requested === 'portrait-full') ? 'portrait-full' : 'portrait';
        } else {
            mode = requested || detectAutoViewMode();
            if (mode === 'portrait-full') mode = 'full';
        }
    }

    let viewW = VIEW43_W;
    let viewH = VIEW43_H;
    let cameraLeft = VIEW43_LEFT;
    let cameraTop = VIEW43_TOP;

    if (mode === 'home16') {
        viewW = HOME16_W;
        viewH = HOME16_H;
        cameraLeft = HOME16_LEFT;
        cameraTop = HOME16_TOP;
    } else if (mode === 'full') {
        viewW = VIEWFULL_W;
        viewH = VIEWFULL_H;
        cameraLeft = VIEWFULL_LEFT;
        cameraTop = VIEWFULL_TOP;
    } else if (mode === 'portrait' || mode === 'portrait-full') {
        const targetH = (mode === 'portrait-full') ? VIEWFULL_H : PORTRAIT_H;
        // Fill available viewport width (up to WORLD_W) in responsive portrait so wider portrait windows don't show pillarboxes.
        viewW = (!configMode && isPortraitViewport)
            ? Math.max(PORTRAIT_W, Math.min(WORLD_W, Math.ceil(targetH * (w / h)) + 2))
            : PORTRAIT_W;
        viewH = targetH;
        cameraLeft = (WORLD_W - viewW) / 2;
        cameraTop = (WORLD_H - targetH) / 2;
    }

    const isPortraitMode = (mode === 'portrait' || mode === 'portrait-full');

    currentViewMode = mode;
    currentViewW = viewW;
    currentViewH = viewH;
    currentViewLeft = cameraLeft;
    currentViewTop = cameraTop;

    // Shift the scene background and world so the view window's top-left becomes (0,0) under the camera container.
    // For taller views (viewH > WORLD_H), scale the background around world center so it covers height (cropping left/right).
    const bgScale = Math.max(1, viewH / WORLD_H);
    sceneBgContainer.pivot.set(WORLD_W / 2, WORLD_H / 2);
    sceneBgContainer.scale.set(bgScale);
    sceneBgContainer.position.set(WORLD_W / 2 - cameraLeft, WORLD_H / 2 - cameraTop);
    worldContainer.x = -cameraLeft;
    worldContainer.y = -cameraTop;

    cameraMask.clear();
    cameraMask.beginFill(0xffffff);
    cameraMask.drawRect(0, 0, viewW, viewH);
    cameraMask.endFill();

    const isQuotesMode = Boolean(window.__QUOTES_CONFIG?.noGameBg);
    const isSolidBg = !isQuotesMode && viewerBgState.type === 'solid';
    const stageColor = isSolidBg ? viewerBgState.color : 0x000000;

    app.renderer.backgroundColor = stageColor;

    // Always clear gameBg; fill behind scene backgrounds unless suppressed by config.
    // Solid backgrounds already clear the canvas to stageColor, so skip the redundant fill.
    gameBg.clear();
    if (!isQuotesMode && !isSolidBg) {
        gameBg.beginFill(stageColor);
        gameBg.drawRect(0, 0, viewW, viewH);
        gameBg.endFill();
    }

    // Scale: normally fit; in portrait, fill height to avoid letterboxing and allow horizontal cropping.
    let scale;
    if (isPortraitMode) {
        scale = h / viewH; // fill height, crop sides if needed
    } else {
        scale = Math.min(w / viewW, h / viewH);
    }
    cameraContainer.scale.set(scale);
    const vx = Math.floor((w - viewW * scale) / 2);
    const vy = Math.floor((h - viewH * scale) / 2);
    cameraContainer.position.set(vx, vy);

    // Draw opaque borders over the letterbox/pillarbox areas when framing Story/Home/Quotes scenes.
    // Solid/test backgrounds omit borders so the solid color fills the full viewport seamlessly.
    viewerBgGraphics.clear();
    if (!isSolidBg) {
        const matrix = new PIXI.Matrix();
        matrix.scale(1, h / 256); // Stretch the 256px gradient to the screen height
        viewerBgGraphics.beginTextureFill({ texture: viewerBgTexture, matrix: matrix });

        // Top border
        if (vy > 0) viewerBgGraphics.drawRect(0, 0, w, vy);
        // Bottom border
        if (h - (vy + viewH * scale) > 0) viewerBgGraphics.drawRect(0, vy + viewH * scale, w, h - (vy + viewH * scale));
        // Left border
        if (vx > 0) viewerBgGraphics.drawRect(0, vy, vx, viewH * scale);
        // Right border
        if (w - (vx + viewW * scale) > 0) viewerBgGraphics.drawRect(vx + viewW * scale, vy, w - (vx + viewW * scale), viewH * scale);

        viewerBgGraphics.endFill();
    }

    // Expose active viewport metrics for placement code.
    window.VIEWPORT = {
        mode: currentViewMode,
        isPortrait: isPortraitMode,
        worldW: WORLD_W,
        worldH: WORLD_H,
        viewW: currentViewW,
        viewH: currentViewH,
        viewLeft: currentViewLeft,
        viewTop: currentViewTop,
        scaleMode: isPortraitMode ? 'fill-height' : 'fit'
    };

    try {
        window.dispatchEvent(new CustomEvent('mrv2:viewportChange', { detail: window.VIEWPORT }));
    } catch {}
}

window.setViewerViewMode = function setViewerViewMode(nextMode) {
    if (window.__QUOTES_CONFIG?.viewMode) return currentViewMode;
    userViewMode = nextMode || null;
    updateViewport();
    return currentViewMode;
};

window.cycleViewerViewMode = function cycleViewerViewMode() {
    if (window.__QUOTES_CONFIG?.viewMode) return currentViewMode;
    const isPortraitViewport = (window.innerHeight || 0) > (window.innerWidth || 0);
    if (isPortraitViewport) {
        userViewMode = (currentViewMode === 'portrait-full') ? 'full43' : 'full';
    } else {
        const order = ['full43', 'home16', 'full'];
        const idx = order.indexOf(currentViewMode);
        userViewMode = order[(idx + 1) % order.length];
    }
    updateViewport();
    return currentViewMode;
};

/**
 * Updates the viewer stage background framing mode and solid backdrop color.
 * @param {{ type?: 'solid'|'story'|'home', color?: number }} nextState
 */
window.setViewerBackgroundState = function setViewerBackgroundState(nextState = {}) {
    const nextType = nextState && (nextState.type === 'story' || nextState.type === 'home' || nextState.type === 'solid')
        ? nextState.type
        : 'solid';
    const nextColor = Number.isFinite(nextState?.color)
        ? (nextState.color >>> 0)
        : (nextType === 'solid' ? 0x999999 : 0x000000);
    viewerBgState.type = nextType;
    viewerBgState.color = nextColor;
    updateViewport();
};

window.updateViewerViewport = updateViewport;
updateViewport();
window.addEventListener('resize', updateViewport);

// Debug: verify canvas sizing.
{
    const canvas = app.view;
    const rect = canvas.getBoundingClientRect();
    console.log('Viewer sizing', {
        devicePixelRatio: window.devicePixelRatio || 1,
        canvasCssPx: { w: rect.width, h: rect.height },
        rendererScreen: { w: app.screen.width, h: app.screen.height },
        rendererResolution: app.renderer.resolution
    });
}

PIXI.live2d.Live2DModel.registerTicker(PIXI.Ticker);

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        app.ticker.stop();
    } else {
        app.ticker.start();
    }
});

window.app = app;
window.cameraContainer = cameraContainer;
window.sceneBgContainer = sceneBgContainer;
window.worldContainer = worldContainer;
window.viewerBgSprite = viewerBgGraphics;
