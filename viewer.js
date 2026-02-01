// Pixi / viewer setup
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;

// Use an integer DPR (ceil) but clamp to avoid extremely large backing buffers on some mobile devices.
const MAX_DPR = 2; // clamp to prevent huge memory/scrolling issues on mobile
function getAppliedDPR() { return Math.max(1, Math.min(MAX_DPR, Math.ceil(window.devicePixelRatio || 1))); }

const app = new PIXI.Application({
    backgroundColor: 0x000000,
    autoStart: true,
    view: document.getElementById('canvas'),
    antialias: true,
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

// Portrait view: keep full height, crop width to 3:4 (shows more vertical content)
const PORTRAIT_W = Math.round((WORLD_H * 3) / 4); // 576 for 768h
const PORTRAIT_H = WORLD_H;
const PORTRAIT_LEFT = Math.round((WORLD_W - PORTRAIT_W) / 2); // 224
const PORTRAIT_TOP = 0;

function getInitialViewOverride() {
    try {
        const params = new URLSearchParams(window.location.search);
        const v = String(params.get('view') || '').toLowerCase();
        if (!v) return null;
        if (v === 'home16' || v === '16:9' || v === '16x9') return 'home16';
        if (v === 'full43' || v === '4:3' || v === '4x3') return 'full43';
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

const viewerBgSprite = new PIXI.Sprite(createVerticalGradientTexture(0x000000, 0x333333));
viewerBgSprite.position.set(0, 0);
app.stage.addChild(viewerBgSprite);

const cameraContainer = new PIXI.Container();

const gameBg = new PIXI.Graphics();
cameraContainer.addChild(gameBg);

const worldContainer = new PIXI.Container();
cameraContainer.addChild(worldContainer);
app.stage.addChild(cameraContainer);

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

    viewerBgSprite.width = w;
    viewerBgSprite.height = h;

    const overrideMode = getInitialViewOverride();
    const mode = overrideMode || detectAutoViewMode();

    let viewW = VIEW43_W;
    let viewH = VIEW43_H;
    let cameraLeft = VIEW43_LEFT;
    let cameraTop = VIEW43_TOP;

    if (mode === 'home16') {
        viewW = HOME16_W;
        viewH = HOME16_H;
        cameraLeft = HOME16_LEFT;
        cameraTop = HOME16_TOP;
    } else if (mode === 'portrait') {
        viewW = PORTRAIT_W;
        viewH = PORTRAIT_H;
        cameraLeft = PORTRAIT_LEFT;
        cameraTop = PORTRAIT_TOP;
    }

    currentViewMode = mode;
    currentViewW = viewW;
    currentViewH = viewH;
    currentViewLeft = cameraLeft;
    currentViewTop = cameraTop;

    // Shift the world so the view window's top-left becomes (0,0) under the camera container.
    worldContainer.x = -cameraLeft;
    worldContainer.y = -cameraTop;

    cameraMask.clear();
    cameraMask.beginFill(0xffffff);
    cameraMask.drawRect(0, 0, viewW, viewH);
    cameraMask.endFill();

    gameBg.clear();
    gameBg.beginFill(0x999999);
    gameBg.drawRect(0, 0, viewW, viewH);
    gameBg.endFill();

    // Scale: normally fit; in portrait, fill height to avoid letterboxing and allow horizontal cropping.
    let scale;
    if (mode === 'portrait') {
        scale = h / viewH; // fill height, crop sides if needed
    } else {
        scale = Math.min(w / viewW, h / viewH);
    }
    cameraContainer.scale.set(scale);
    const vx = Math.floor((w - viewW * scale) / 2);
    const vy = Math.floor((h - viewH * scale) / 2);
    cameraContainer.position.set(vx, vy);

    // Expose active viewport metrics for placement code.
    window.VIEWPORT = {
        mode: currentViewMode,
        worldW: WORLD_W,
        worldH: WORLD_H,
        viewW: currentViewW,
        viewH: currentViewH,
        viewLeft: currentViewLeft,
        viewTop: currentViewTop,
        scaleMode: mode === 'portrait' ? 'fill-height' : 'fit'
    };
}

updateViewport();
window.addEventListener('resize', updateViewport);

// Debug: verify canvas sizing.
{
    const canvas = app.view;
    const rect = canvas.getBoundingClientRect();
    console.log('Viewer sizing', {
        devicePixelRatio: 1,
        canvasCssPx: { w: rect.width, h: rect.height },
        rendererScreen: { w: app.screen.width, h: app.screen.height },
        rendererResolution: app.renderer.resolution
    });
}

PIXI.live2d.Live2DModel.registerTicker(PIXI.Ticker);

window.app = app;
window.cameraContainer = cameraContainer;
window.worldContainer = worldContainer;
window.viewerBgSprite = viewerBgSprite;
