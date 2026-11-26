// magica/js/engine/bg.js — Shared Cocos2d-x background renderer, crossfader, and LRU cache.

import { CocosStudioArmature } from '../../../lib/cocos-to-pixi.js';
import { resolveMaReAssetsBase } from '../viewer/model.js';
import { loadCocosBackgroundAssets, DEFAULT_HOME_BG_FILE } from '../home-bg.js';
import { repoUrl } from '../paths.js';

const WORLD_W = 1024;
const WORLD_H = 768;
const HOME16_H = 576;
const MAX_CACHED_BGS = 8;

const bgAssetCache = new Map(); // key -> { assets, promise }
let bgArmature = null;
let bgTicker = null;
let outgoingBgArmature = null;
let outgoingBgTicker = null;
let bgLoadToken = 0;
let bgFadeToken = 0;
let bgFadeResolve = null;
let bgPrefetchToken = 0;
let currentBgKey = null;
let currentBgMovement = 'action';
let bgPortraitActive = false;
let cameraWebcamSprite = null;
let cameraWebcamVideo = null;
let imageNativeBasePromise = null;

export function getImageNativeBase() {
    if (!imageNativeBasePromise) {
        imageNativeBasePromise = resolveMaReAssetsBase()
            .then((base) => String(base || '').replace(/\/live2d_v4\/?$/, ''))
            .catch((err) => {
                imageNativeBasePromise = null;
                throw err;
            });
    }
    return imageNativeBasePromise;
}

export function collectCocosBaseTextures(assets) {
    const baseTextures = new Set();
    if (!assets) return baseTextures;
    if (assets.textures) {
        for (const tex of Object.values(assets.textures)) {
            if (tex?.baseTexture) baseTextures.add(tex.baseTexture);
        }
    }
    if (assets.particles) {
        for (const p of Object.values(assets.particles)) {
            if (p?.particleTexture?.baseTexture) baseTextures.add(p.particleTexture.baseTexture);
        }
    }
    return baseTextures;
}

export function disposeCocosAssets(textures, particles, keepBaseTextures = null) {
    if (particles) {
        for (const p of Object.values(particles)) {
            const tex = p?.particleTexture;
            if (!tex) continue;
            const bt = tex.baseTexture;
            if (keepBaseTextures && keepBaseTextures.has(bt)) continue;
            const srcUrl = bt?.resource?.url;
            try { tex.destroy(true); } catch {}
            if (typeof srcUrl === 'string' && srcUrl.startsWith('blob:')) {
                try { URL.revokeObjectURL(srcUrl); } catch {}
            }
            p.particleTexture = null;
        }
    }
    if (textures) {
        const baseTextures = new Set();
        for (const tex of Object.values(textures)) {
            if (!tex) continue;
            const bt = tex.baseTexture;
            if (keepBaseTextures && keepBaseTextures.has(bt)) continue;
            if (bt) baseTextures.add(bt);
            try { tex.destroy(false); } catch {}
        }
        for (const bt of baseTextures) {
            if (bt && !bt.destroyed && (!keepBaseTextures || !keepBaseTextures.has(bt))) {
                const srcUrl = bt.resource?.url;
                try { bt.destroy(); } catch {}
                if (typeof srcUrl === 'string' && srcUrl.startsWith('blob:')) {
                    try { URL.revokeObjectURL(srcUrl); } catch {}
                }
            }
        }
    }
}

function applyMovementScale(armature) {
    const sc = Number(armature?.currentMovement?.sc);
    if (Number.isFinite(sc) && sc > 0) {
        armature.animationScale = sc;
    }
    if (Array.isArray(armature?.nestedArmatures)) {
        for (const sub of armature.nestedArmatures) {
            applyMovementScale(sub);
        }
    }
}

function collectProtectedBgBaseTextures(extraKeep = null) {
    const keep = new Set();
    const addAll = (set) => {
        if (!set) return;
        for (const bt of set) keep.add(bt);
    };
    addAll(extraKeep);
    addAll(collectCocosBaseTextures(bgArmature));
    addAll(collectCocosBaseTextures(outgoingBgArmature));
    for (const cached of bgAssetCache.values()) {
        if (cached?.assets) addAll(collectCocosBaseTextures(cached.assets));
    }
    return keep;
}

function getOrLoadCachedBgAssets(key, url) {
    if (bgAssetCache.has(key)) {
        const entry = bgAssetCache.get(key);
        bgAssetCache.delete(key);
        bgAssetCache.set(key, entry);
        return entry.promise;
    }

    const record = { assets: null, promise: null };
    record.promise = loadCocosBackgroundAssets(url)
        .then((assets) => {
            record.assets = assets;
            return assets;
        })
        .catch((err) => {
            if (bgAssetCache.get(key) === record) bgAssetCache.delete(key);
            throw err;
        });

    bgAssetCache.set(key, record);
    while (bgAssetCache.size > MAX_CACHED_BGS) {
        const oldestKey = bgAssetCache.keys().next().value;
        const oldest = bgAssetCache.get(oldestKey);
        bgAssetCache.delete(oldestKey);
        if (oldest?.assets) {
            disposeCocosAssets(oldest.assets.textures, oldest.assets.particles, collectProtectedBgBaseTextures());
        }
    }
    return record.promise;
}

export function clearBgCache() {
    bgPrefetchToken++;
    const entries = Array.from(bgAssetCache.values());
    bgAssetCache.clear();
    const keep = collectProtectedBgBaseTextures();
    for (const entry of entries) {
        if (entry?.assets) {
            disposeCocosAssets(entry.assets.textures, entry.assets.particles, keep);
        }
    }
}

function disposeBgNode(armature, ticker, keepBaseTextures = null) {
    if (ticker && window.app?.ticker) {
        window.app.ticker.remove(ticker);
    }
    if (armature) {
        try {
            if (typeof armature.stop === 'function') armature.stop();
            if (armature.parent) armature.parent.removeChild(armature);
            const textures = armature.textures;
            const particles = armature.particles;
            armature.destroy({ children: true });
            disposeCocosAssets(textures, particles, collectProtectedBgBaseTextures(keepBaseTextures));
        } catch {}
    }
}

function finishOutgoingBgFade(keepBaseTextures = null) {
    bgFadeToken++;
    const resolveFade = bgFadeResolve;
    bgFadeResolve = null;
    if (outgoingBgArmature || outgoingBgTicker) {
        const oldArm = outgoingBgArmature;
        const oldTick = outgoingBgTicker;
        outgoingBgArmature = null;
        outgoingBgTicker = null;
        disposeBgNode(oldArm, oldTick, keepBaseTextures);
    }
    if (bgArmature && !bgArmature.destroyed) {
        bgArmature.alpha = 1;
    }
    if (resolveFade) resolveFade();
}

function teardownCurrentBgNode(keepBaseTextures = null) {
    finishOutgoingBgFade(keepBaseTextures);
    const arm = bgArmature;
    const tick = bgTicker;
    bgArmature = null;
    bgTicker = null;
    disposeBgNode(arm, tick, keepBaseTextures);
}

export async function removeBg() {
    bgLoadToken++;
    currentBgKey = null;
    teardownCurrentBgNode();
}

async function resolveBackgroundTarget(bgInput) {
    if (typeof bgInput === 'string') {
        const url = /^https?:\/\//i.test(bgInput) ? bgInput : repoUrl(bgInput);
        return { key: bgInput, url };
    }
    const file = bgInput?.file || DEFAULT_HOME_BG_FILE;
    const dir = bgInput?.dir || 'web';
    const key = bgInput?.id || `home:${dir}/${file}`;
    if (dir === 'web' && (file === 'web_0011.ExportJson' || file === 'web_0015.ExportJson' || file === 'web_common.ExportJson')) {
        return { key, url: repoUrl(`bg/web/${file}`) };
    }
    const base = await getImageNativeBase();
    return { key, url: `${base}/bg/${dir}/${file}` };
}

function applyPortraitTransform(arm = bgArmature) {
    if (!arm || arm.destroyed) return;
    if (bgPortraitActive) {
        arm.rotation = -Math.PI / 2;
        arm.scale.set(WORLD_W / WORLD_H);
    } else {
        arm.rotation = 0;
        arm.scale.set(1);
    }
}

export function setBgPortrait(enabled) {
    bgPortraitActive = Boolean(enabled);
    applyPortraitTransform(bgArmature);
}

export function hasVisibleBg() {
    return Boolean(bgArmature && !bgArmature.destroyed && bgArmature.visible);
}

export function showBg() {
    if (!bgArmature || bgArmature.destroyed) return;
    bgArmature.visible = cameraWebcamSprite ? false : true;
    if (!bgArmature.playing && currentBgMovement !== null) {
        bgArmature.play(currentBgMovement, true);
        applyMovementScale(bgArmature);
        bgArmature.update(0);
    }
}

export async function changeBg(bgInput = 'bg/web/web_0015.ExportJson', { visible = true, autoplay = true, crossfadeMs = 200, waitForCrossfade = false } = {}) {
    const token = ++bgLoadToken;
    const target = await resolveBackgroundTarget(bgInput);
    if (token !== bgLoadToken) return;

    if (bgArmature && currentBgKey === target.key) {
        bgArmature.visible = cameraWebcamSprite ? false : visible;
        applyPortraitTransform(bgArmature);
        if (autoplay && !bgArmature.playing && currentBgMovement !== null) {
            bgArmature.play(currentBgMovement, true);
            applyMovementScale(bgArmature);
        }
        return;
    }

    const assets = await getOrLoadCachedBgAssets(target.key, target.url);
    if (token !== bgLoadToken) return;

    const keepBaseTextures = collectCocosBaseTextures(assets);
    const armature = new CocosStudioArmature(assets.json, assets.textures, assets.particles);

    // Center the 1024x768 background inside the 1024x576 home16 camera mask.
    armature.x = WORLD_W / 2;
    armature.y = WORLD_H / 2 - (WORLD_H - HOME16_H) / 2;

    const movData = assets.json?.animation_data?.[0]?.mov_data || [];
    const hasAction = movData.some((m) => m && m.name === 'action');
    const movement = movData.length > 0 ? (hasAction ? 'action' : 0) : null;

    const canCrossfade = crossfadeMs > 0 && visible && bgArmature && !bgArmature.destroyed && bgArmature.visible && bgArmature.parent;
    if (canCrossfade) {
        finishOutgoingBgFade(keepBaseTextures);
        outgoingBgArmature = bgArmature;
        outgoingBgTicker = bgTicker;
        const insertIdx = outgoingBgArmature.parent.getChildIndex(outgoingBgArmature) + 1;
        outgoingBgArmature.parent.addChildAt(armature, insertIdx);
        armature.alpha = 0;
    } else {
        teardownCurrentBgNode(keepBaseTextures);
        window.cameraContainer.addChildAt(armature, 0);
        armature.alpha = 1;
    }

    bgArmature = armature;
    currentBgKey = target.key;
    currentBgMovement = movement;
    armature.visible = cameraWebcamSprite ? false : visible;
    applyPortraitTransform(armature);

    if (autoplay && movement !== null) {
        armature.play(movement, true);
        applyMovementScale(armature);
        armature.update(0);
    }

    bgTicker = (delta) => {
        if (!armature.destroyed && (bgArmature === armature || outgoingBgArmature === armature)) {
            armature.update(delta / 60);
        }
    };
    window.app.ticker.add(bgTicker);

    if (canCrossfade) {
        const fadeId = ++bgFadeToken;
        const start = performance.now();
        let fadePromise = null;
        if (waitForCrossfade) {
            fadePromise = new Promise((resolve) => {
                bgFadeResolve = resolve;
            });
        }
        const finishNow = () => {
            if (bgFadeResolve) {
                const resolveFade = bgFadeResolve;
                bgFadeResolve = null;
                resolveFade();
            }
        };
        const step = () => {
            if (fadeId !== bgFadeToken || bgArmature !== armature || armature.destroyed) {
                finishNow();
                return;
            }
            const t = Math.min(1, (performance.now() - start) / crossfadeMs);
            armature.alpha = t;
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                finishOutgoingBgFade(keepBaseTextures);
            }
        };
        requestAnimationFrame(step);
        if (fadePromise) await fadePromise;
    }
}

export async function preloadBg(bgInput) {
    if (!bgInput) return;
    const target = await resolveBackgroundTarget(bgInput);
    if (!bgAssetCache.has(target.key)) {
        await getOrLoadCachedBgAssets(target.key, target.url);
    }
}

export async function prefetchBg(entries) {
    const list = Array.isArray(entries) ? entries : [entries];
    const token = ++bgPrefetchToken;
    for (const entry of list) {
        if (!entry || token !== bgPrefetchToken) return;
        try {
            const target = await resolveBackgroundTarget(entry);
            if (token !== bgPrefetchToken) return;
            if (!bgAssetCache.has(target.key)) {
                await getOrLoadCachedBgAssets(target.key, target.url);
            }
        } catch {}
    }
}

export function setBgWebcamVideo(videoEl) {
    if (cameraWebcamSprite) {
        try {
            if (cameraWebcamSprite.parent) cameraWebcamSprite.parent.removeChild(cameraWebcamSprite);
            cameraWebcamSprite.destroy({ texture: true, baseTexture: true });
        } catch {}
        cameraWebcamSprite = null;
    }
    cameraWebcamVideo = videoEl || null;
    if (videoEl && window.cameraContainer) {
        const tex = PIXI.Texture.from(videoEl);
        const sprite = new PIXI.Sprite(tex);
        sprite.anchor.set(0.5, 0.5);
        sprite.x = WORLD_W / 2;
        sprite.y = HOME16_H / 2;
        const vw = videoEl.videoWidth || WORLD_W;
        const vh = videoEl.videoHeight || HOME16_H;
        const scale = Math.max(WORLD_W / vw, HOME16_H / vh);
        sprite.scale.set(scale);
        window.cameraContainer.addChildAt(sprite, 0);
        cameraWebcamSprite = sprite;
        if (bgArmature && !bgArmature.destroyed) bgArmature.visible = false;
    } else if (bgArmature && !bgArmature.destroyed) {
        bgArmature.visible = true;
    }
    return cameraWebcamVideo;
}

export function getBgWebcamVideo() {
    return cameraWebcamVideo;
}
