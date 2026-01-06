// Pixi / viewer setup
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;

// Keep a 1:1 pixel backbuffer (avoid HiDPI differences).
const FORCE_DPR_1 = true;

const app = new PIXI.Application({
    backgroundColor: 0x000000,
    autoStart: true,
    view: document.getElementById('canvas'),
    antialias: true,
    autoDensity: !FORCE_DPR_1,
    resolution: FORCE_DPR_1 ? 1 : (window.devicePixelRatio || 1)
});

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
        FORCE_DPR_1,
        devicePixelRatio: window.devicePixelRatio,
        canvasCssPx: { w: rect.width, h: rect.height },
        rendererScreen: { w: app.screen.width, h: app.screen.height },
        rendererResolution: app.renderer.resolution
    });
}

PIXI.live2d.Live2DModel.registerTicker(PIXI.Ticker);
