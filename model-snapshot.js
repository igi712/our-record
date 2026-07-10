// Model snapshot capture: renders the current model to an alpha-cropped PNG.

import { getModelOption, showToast, state } from './model.js';

export async function downloadModelSnapshot() {
    const model = state.currentModel;
    if (!model) return;

    const app = window.app;
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
            } catch (e) { return String(s).replace(/\s+/g, '_'); }
        };

        const meta = getModelOption(state.currentModelId);
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
            try { window.worldContainer.addChild(model); } catch {}
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
