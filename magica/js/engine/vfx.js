// magica/js/engine/vfx.js — Cocos2d-x transformation VFX overlay.

import { loadCocosStudioAssets, CocosStudioArmature } from '../../../lib/cocos-to-pixi.js';
import { magicaUrl } from '../paths.js';

const TRANSFORM_VFX_URL = magicaUrl('resource/image_native/effect/story/ef_adv_05.ExportJson');

let activeEffectArmature = null;
let activeEffectTick = null;
let effectLoadToken = 0;
let effectAssetsPromise = null;

function getActiveViewH() {
    return window.VIEWPORT?.viewH || 576;
}

try {
    window.addEventListener('mrv2:viewportChange', () => {
        if (activeEffectArmature && !activeEffectArmature.destroyed) {
            activeEffectArmature.y = getActiveViewH() / 2;
        }
    });
} catch {}

function loadTransformationEffectAssets() {
    if (!effectAssetsPromise) {
        effectAssetsPromise = loadCocosStudioAssets(TRANSFORM_VFX_URL).catch((err) => {
            effectAssetsPromise = null;
            throw err;
        });
    }
    return effectAssetsPromise;
}

export async function playTransformVfx(x) {
    const token = ++effectLoadToken;
    try {
        const assets = await loadTransformationEffectAssets();
        if (token !== effectLoadToken) return;

        const effectArmature = new CocosStudioArmature(assets.json, assets.textures, assets.particles);
        stopActiveArmature();

        effectArmature.x = x;
        effectArmature.y = getActiveViewH() / 2;
        window.cameraContainer.addChild(effectArmature);
        effectArmature.play('action', false);
        activeEffectArmature = effectArmature;

        const updateTick = (delta) => {
            if (!effectArmature || effectArmature.destroyed) {
                window.app?.ticker?.remove(updateTick);
                return;
            }
            if (effectArmature.playing) {
                try {
                    effectArmature.update(delta / 60);
                } catch (err) {
                    console.error('[vfx] Error updating effect:', err);
                    window.app?.ticker?.remove(updateTick);
                }
            } else {
                window.app?.ticker?.remove(updateTick);
                try {
                    if (effectArmature.parent) effectArmature.parent.removeChild(effectArmature);
                    effectArmature.destroy({ children: true });
                } catch {}
                if (activeEffectArmature === effectArmature) {
                    activeEffectArmature = null;
                    activeEffectTick = null;
                }
            }
        };

        activeEffectTick = updateTick;
        window.app.ticker.add(updateTick);
    } catch (err) {
        console.error('[vfx] Transformation effect play failed:', err);
    }
}

function stopActiveArmature() {
    if (activeEffectTick) {
        try { window.app?.ticker?.remove(activeEffectTick); } catch {}
        activeEffectTick = null;
    }
    if (activeEffectArmature) {
        try {
            if (activeEffectArmature.parent) {
                activeEffectArmature.parent.removeChild(activeEffectArmature);
            }
            activeEffectArmature.destroy({ children: true });
        } catch {}
        activeEffectArmature = null;
    }
}

export function stopVfx() {
    effectLoadToken++;
    stopActiveArmature();
}
