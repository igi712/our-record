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

// World is 1024x768 (4:3), but we always view the 16:9 home region (1024x576)
// centered inside it.
const WORLD_W = 1024;
const WORLD_H = 768;
const HOME_W = 1024;
const HOME_H = 576;
const HOME_TOP = (WORLD_H - HOME_H) / 2;

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

let currentViewH = HOME_H;

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

    const viewH = HOME_H;
    currentViewH = viewH;
    const cameraTop = HOME_TOP;

    worldContainer.y = -cameraTop;

    cameraMask.clear();
    cameraMask.beginFill(0xffffff);
    cameraMask.drawRect(0, 0, WORLD_W, viewH);
    cameraMask.endFill();

    gameBg.clear();
    gameBg.beginFill(0x999999);
    gameBg.drawRect(0, 0, WORLD_W, viewH);
    gameBg.endFill();

    const scale = Math.min(w / WORLD_W, h / viewH);
    cameraContainer.scale.set(scale);
    const vx = Math.floor((w - WORLD_W * scale) / 2);
    const vy = Math.floor((h - viewH * scale) / 2);
    cameraContainer.position.set(vx, vy);
}

updateViewport();
window.addEventListener('resize', updateViewport);

// Debug: verify canvas sizing.
{
    const canvas = app.view;
    const rect = canvas.getBoundingClientRect();
    console.log('Viewer sizing', {
        devicePixelRatio: DPR,
        canvasCssPx: { w: rect.width, h: rect.height },
        rendererScreen: { w: app.screen.width, h: app.screen.height },
        rendererResolution: app.renderer.resolution
    });
}

PIXI.live2d.Live2DModel.registerTicker(PIXI.Ticker);
