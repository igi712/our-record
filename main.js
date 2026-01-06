// App wiring: model list, UI, loading, snapshot

// Models live under `assets/<id>/`.
const MODEL_OPTIONS = [
    { id: '100100', label: '100100 (Iroha)' },
    { id: '100200', label: '100200 (Yachiyo)' },
    { id: '100300', label: '100300 (Tsuruno)' },
    { id: '100400', label: '100400 (Sana)' },
    { id: '100500', label: '100500 (Felicia)' }
];

function getModelOption(modelId) {
    return MODEL_OPTIONS.find(o => o.id === modelId) ?? null;
}

let currentModel = null;
let currentModelId = MODEL_OPTIONS[0]?.id ?? '100100';

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

function setupControlsForModel(model, modelJson) {
    const motionSelect = document.getElementById('motionSelect');
    const expressionSelect = document.getElementById('expressionSelect');

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
            const { group, index } = JSON.parse(motionSelect.value);
            const ok = tryStartMotion(model, group, index);
            if (!ok) console.warn('Could not start motion', { group, index });
        };
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
            const ok = trySetExpression(model, expressionSelect.value);
            if (!ok) console.warn('Could not set expression', { name: expressionSelect.value });
        };
    }
}

async function downloadTransparentModelSnapshot() {
    const model = currentModel;
    if (!model) return;

    const renderer = app?.renderer;
    const extract = renderer?.plugins?.extract;
    if (!renderer || !extract) {
        console.warn('Snapshot not available: renderer extract plugin missing');
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
        for (let y = 0; y < h; y++) {
            const row = y * w * 4;
            for (let x = 0; x < w; x++) {
                const a = data[row + x * 4 + 3];
                if (a >= alphaThreshold) {
                    if (x < minX) minX = x;
                    if (y < minY) minY = y;
                    if (x > maxX) maxX = x;
                    if (y > maxY) maxY = y;
                }
            }
        }

        if (maxX < minX || maxY < minY) {
            return { canvas: srcCanvas, rect: { x: 0, y: 0, w, h } };
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

        const w = Math.max(1, Math.ceil(b.width + pad * 2));
        const h = Math.max(1, Math.ceil(b.height + pad * 2));

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
            console.warn('Snapshot failed: could not create PNG blob');
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

async function loadModel(modelId) {
    currentModelId = modelId;

    const modelOpt = getModelOption(modelId);

    if (currentModel) {
        try { worldContainer.removeChild(currentModel); } catch {}
        try { currentModel.destroy?.({ children: true }); } catch {}
        currentModel = null;
    }

    // Home placement uses a 1024x576 space centered inside the 1024x768 world.
    const HOME_OFFSET_X = -132;
    const HOME_Y_INTERCEPT = 287.0999674453658;
    const HOME_Y_PER_HEIGHT = 1.7775731122833498;

    const modelPath = `assets/${modelId}/model.model3.json`;
    const paramsPath = modelPath.replace(/\/model\.model3\.json$/, '/params.json');

    const modelJson = await (await fetch(modelPath)).json();

    const params = await (await fetch(paramsPath)).json();
    const heightParam = Number(params.height ?? 0);
    const modelScaleParam = Number(params.modelScale ?? 1);

    const model = await PIXI.live2d.Live2DModel.from(modelPath, { autoInteract: false });

    worldContainer.addChild(model);

    applyMagirecoIdlePolicy(model, modelJson);

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

    const canvasHeightUnits =
        readNumber(coreModel?.canvasHeight) ??
        readNumber(coreModel?.CanvasHeight) ??
        readNumber(tryGet(() => coreModel?.getCanvasHeight?.())) ??
        readNumber(tryGet(() => coreModel?.GetCanvasHeight?.())) ??
        null;

    const xGame = (HOME_W / 2) + HOME_OFFSET_X;
    const yGameFromHeight = HOME_Y_INTERCEPT + (heightParam * HOME_Y_PER_HEIGHT);
    const yGame = Number.isFinite(modelOpt?.homeYOverride) ? modelOpt.homeYOverride : yGameFromHeight;

    model.x = xGame;
    model.y = HOME_TOP + (HOME_H - yGame);

    const SCALE_TWEAK = 1.0;
    const cw = canvasWidthUnits ?? 1;
    const baseScale = ((WORLD_W / 2) * cw) / model.internalModel.originalWidth;
    const finalScale = baseScale * modelScaleParam * SCALE_TWEAK;
    model.scale.set(finalScale);

    setupControlsForModel(model, modelJson);

    currentModel = model;

    console.log('Model Loaded', {
        paramsPath,
        yGameFromHeight,
        homeYOverride: modelOpt?.homeYOverride,
        heightParam,
        modelScaleParam,
        canvasWidthUnits,
        canvasHeightUnits,
        originalWidth: model.internalModel.originalWidth,
        originalHeight: model.internalModel.originalHeight,
        baseScale,
        finalScale,
        SCALE_TWEAK,
        xGame,
        yGame,
        xWorld: model.x,
        yWorld: model.y,
        currentViewH
    });
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

{
    const snapshotBtn = document.getElementById('snapshotBtn');
    if (snapshotBtn) {
        snapshotBtn.onclick = () => {
            downloadTransparentModelSnapshot().catch((e) => console.error(e));
        };
    }
}
