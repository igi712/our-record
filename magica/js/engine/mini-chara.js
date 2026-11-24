// magica/js/engine/mini-chara.js — Cocos2d-x MiniChara armature + unit marker renderer.

import { CocosStudioArmature, CocosStudioParticleEmitter, parsePlist } from '../../../lib/cocos-to-pixi.js';
import { loadCocosBackgroundAssets } from '../home-bg.js';
import { magicaUrl } from '../paths.js';
import { collectCocosBaseTextures, disposeCocosAssets, getImageNativeBase } from './bg.js';

const CH_TOP_MARKER_URL = magicaUrl('resource/image_native/effect/web_ef_unit_marker/web_ef_unit_marker.ExportJson');
const MINI_CHARA_X = 400;
const MINI_CHARA_Y = 383;
const MINI_CACHE_LIMIT = 16;

let miniStageActive = false;
let miniCharaLayer = null;
let unitMarkerArmature = null;
let unitMarkerTick = null;
let unitMarkerAssetsPromise = null;
let miniCharaArmature = null;
let miniCharaTick = null;
let activeMiniCharaNo = null;
let miniLoadToken = 0;
const miniAssetCache = new Map();

class MiniCharArmature extends CocosStudioArmature {
    constructor(json, textures, particles, frameMeta = {}) {
        super({ ...json, __frameMeta: frameMeta || {} }, textures, particles);
        this.frameMeta = frameMeta || {};
        this.selfTrigger = null;
        this.returnToMov = null;
        this._playingSelfUnique = false;
    }

    buildHierarchy() {
        const armatureData = this.json.armature_data?.[0];
        if (!armatureData) return;

        const textureData = this.json.texture_data || [];
        const frameMeta = this.json.__frameMeta || this.frameMeta || {};
        this.boneOrder = [];

        for (const bone of armatureData.bone_data) {
            const container = new PIXI.Container();
            container.name = bone.name;
            container.parentBoneName = bone.parent || '';

            container.setupX = bone.x ?? 0;
            container.setupY = bone.y ?? 0;
            container.setupScaleX = bone.cX ?? 1;
            container.setupScaleY = bone.cY ?? 1;
            container.setupSkewX = bone.kX ?? 0;
            container.setupSkewY = bone.kY ?? 0;
            container.setupZ = bone.z ?? 0;

            container.localX = container.setupX;
            container.localY = container.setupY;
            container.localScaleX = container.setupScaleX;
            container.localScaleY = container.setupScaleY;
            container.localSkewX = container.setupSkewX;
            container.localSkewY = container.setupSkewY;
            container.zOrder = container.setupZ;

            this.bones[bone.name] = container;
            this.boneOrder.push(bone.name);

            if (bone.display_data) {
                container.displays = [];
                for (const disp of bone.display_data) {
                    if (disp.displayType === 0) {
                        let tex = this.textures[disp.name];
                        if (!tex) {
                            const cleanName = disp.name.replace(/\.png$/i, '');
                            tex = this.textures[cleanName] || this.textures[cleanName + '.png'];
                        }
                        if (tex) {
                            const sprite = new PIXI.Sprite(tex);
                            const baseName = disp.name.replace(/\.png$/i, '');
                            const texInfo = textureData.find((t) => t.name === baseName);
                            const pX = texInfo ? (texInfo.pX ?? 0.5) : 0.5;
                            const pY = texInfo ? (texInfo.pY ?? 0.5) : 0.5;

                            const meta = frameMeta[disp.name] || frameMeta[baseName + '.png'];
                            const w = tex.orig?.width || tex.width || 1;
                            const h = tex.orig?.height || tex.height || 1;
                            const origW = meta?.originalWidth ?? w;
                            const origH = meta?.originalHeight ?? h;
                            const offX = meta?.offsetX ?? 0;
                            const offY = meta?.offsetY ?? 0;
                            const anchorX = 0.5 + (((pX - 0.5) * origW) - offX) / w;
                            const anchorY = 0.5 + (((0.5 - pY) * origH) + offY) / h;
                            sprite.anchor.set(anchorX, anchorY);

                            const skin = disp.skin_data?.[0] || { x: 0, y: 0, cX: 1, cY: 1, kX: 0, kY: 0 };
                            sprite.x = skin.x ?? 0;
                            sprite.y = -(skin.y ?? 0);
                            sprite.scale.set(skin.cX ?? 1, skin.cY ?? 1);
                            sprite.skew.set(-(skin.kX ?? 0), -(skin.kY ?? 0));

                            sprite.visible = false;
                            container.addChild(sprite);
                            container.displays.push(sprite);
                        } else {
                            container.displays.push(null);
                        }
                    } else if (disp.displayType === 1) {
                        const childArmData = this.json.armature_data.find((a) => a.name === disp.name);
                        if (childArmData) {
                            const childJson = { ...this.json, armature_data: [childArmData] };
                            const subArm = new MiniCharArmature(childJson, this.textures, this.particles, frameMeta);
                            subArm.visible = false;
                            container.addChild(subArm);
                            container.displays.push(subArm);
                            this.nestedArmatures.push(subArm);
                        } else {
                            container.displays.push(null);
                        }
                    } else if (disp.displayType === 2) {
                        const config = this.particles[disp.plist];
                        if (config) {
                            const emitter = new CocosStudioParticleEmitter(config);
                            emitter.visible = false;
                            container.addChild(emitter);
                            container.displays.push(emitter);
                            this.particleEmitters.push(emitter);
                        } else {
                            container.displays.push(null);
                        }
                    } else {
                        container.displays.push(null);
                    }
                }
            }

            this.addChild(container);
        }

        this.applyWorldTransforms();
        this.sortAllChildren();
    }

    applyWorldTransforms() {
        const order = this.boneOrder || Object.keys(this.bones);
        for (const name of order) {
            const bone = this.bones[name];
            if (!bone) continue;
            const parent = bone.parentBoneName ? this.bones[bone.parentBoneName] : null;
            if (parent) {
                const x = bone.localX;
                const y = bone.localY;
                bone.worldX = x * parent.matA + y * parent.matC + parent.worldX;
                bone.worldY = x * parent.matB + y * parent.matD + parent.worldY;
                bone.worldScaleX = bone.localScaleX * parent.worldScaleX;
                bone.worldScaleY = bone.localScaleY * parent.worldScaleY;
                bone.worldSkewX = bone.localSkewX + parent.worldSkewX;
                bone.worldSkewY = bone.localSkewY + parent.worldSkewY;
            } else {
                bone.worldX = bone.localX;
                bone.worldY = bone.localY;
                bone.worldScaleX = bone.localScaleX;
                bone.worldScaleY = bone.localScaleY;
                bone.worldSkewX = bone.localSkewX;
                bone.worldSkewY = bone.localSkewY;
            }

            bone.matA = bone.worldScaleX * Math.cos(bone.worldSkewY);
            bone.matB = bone.worldScaleX * Math.sin(bone.worldSkewY);
            bone.matC = bone.worldScaleY * Math.sin(bone.worldSkewX);
            bone.matD = bone.worldScaleY * Math.cos(bone.worldSkewX);

            bone.x = bone.worldX;
            bone.y = -bone.worldY;
            bone.scale.set(bone.worldScaleX, bone.worldScaleY);
            bone.skew.set(-bone.worldSkewX, -bone.worldSkewY);
        }
    }

    play(movementNameOrIndex, loop = true) {
        const animationData = this.json.animation_data?.[0];
        if (!animationData) return;

        const movement = typeof movementNameOrIndex === 'number'
            ? animationData.mov_data[movementNameOrIndex]
            : animationData.mov_data.find((m) => m.name === movementNameOrIndex);

        if (!movement) {
            console.warn('[mini-chara] Movement not found:', movementNameOrIndex);
            return;
        }

        if (!this._playingSelfUnique) {
            this.returnToMov = null;
        }
        this.selfTrigger = null;

        this.currentMovement = movement;
        this.currentFrame = 0;
        this.elapsedTime = 0;
        this.playing = true;
        this.loop = loop;

        if (loop) {
            for (const timeline of movement.mov_bone_data || []) {
                for (const f of timeline.frame_data || []) {
                    if (!f.evt) continue;
                    const m = String(f.evt).match(/^playSelf_([^_]+)_(\d+)_(\d+)$/i);
                    if (m) {
                        const minLoops = Math.max(1, parseInt(m[2], 10));
                        const maxLoops = Math.max(minLoops, parseInt(m[3], 10));
                        const remainingLoops = minLoops + Math.floor(Math.random() * (maxLoops - minLoops + 1));
                        this.selfTrigger = { targetMov: m[1], minLoops, maxLoops, remainingLoops };
                        break;
                    }
                }
                if (this.selfTrigger) break;
            }
        }

        for (const name in this.bones) {
            const bone = this.bones[name];
            bone.localX = bone.setupX;
            bone.localY = bone.setupY;
            bone.localScaleX = bone.setupScaleX;
            bone.localScaleY = bone.setupScaleY;
            bone.localSkewX = bone.setupSkewX;
            bone.localSkewY = bone.setupSkewY;
            bone.zOrder = bone.setupZ;
            bone.alpha = 1;
            if (bone.displays) {
                for (const disp of bone.displays) {
                    if (disp) disp.visible = false;
                }
            }
        }

        for (const subArm of this.nestedArmatures) {
            subArm.play(movementNameOrIndex, loop);
        }

        this.applyWorldTransforms();
        this.sortAllChildren();

        if (this.onMovementEvent) {
            try { this.onMovementEvent('start', this.currentMovement.name); } catch {}
        }
    }

    update(dt) {
        if (!this.playing || !this.currentMovement) return;

        const prevFrame = this.currentFrame;
        this.elapsedTime += dt;
        const fps = 60;
        let frame = this.elapsedTime * fps * this.animationScale;
        const duration = this.currentMovement.dr || 1;

        let loopCompleted = false;
        let completed = false;

        if (this.loop) {
            if (frame >= duration) loopCompleted = true;
            frame = frame % duration;
        } else if (frame >= duration - 1) {
            frame = duration - 1;
            const hasLiveParticles = this.particleEmitters.some(
                (emitter) => emitter.particlesList && emitter.particlesList.length > 0
            );
            if (!hasLiveParticles) {
                completed = true;
                this.playing = false;
            }
        }

        this.currentFrame = frame;

        if (this.onFrameEvent) {
            for (const timeline of this.currentMovement.mov_bone_data || []) {
                for (const f of timeline.frame_data || []) {
                    if (!f.evt) continue;
                    const crossed = loopCompleted
                        ? (f.fi >= prevFrame && f.fi < duration) || (f.fi >= 0 && f.fi <= this.currentFrame)
                        : (prevFrame <= this.currentFrame && f.fi > prevFrame && f.fi <= this.currentFrame);
                    if (crossed) {
                        try { this.onFrameEvent(f.evt); } catch {}
                    }
                }
            }
        }

        if (loopCompleted && this.onMovementEvent) {
            try { this.onMovementEvent('loopComplete', this.currentMovement.name); } catch {}
        }
        if (completed && this.onMovementEvent) {
            try { this.onMovementEvent('complete', this.currentMovement.name); } catch {}
        }

        for (const timeline of this.currentMovement.mov_bone_data || []) {
            const bone = this.bones[timeline.name];
            if (!bone) continue;

            const frames = timeline.frame_data || [];
            if (frames.length === 0) continue;

            let prevKey = frames[0];
            let nextKey = frames[0];

            if (frame < frames[0].fi) {
                prevKey = frames[0];
                nextKey = frames[0];
            } else if (frame >= frames[frames.length - 1].fi) {
                prevKey = frames[frames.length - 1];
                nextKey = frames[frames.length - 1];
            } else {
                for (let i = 0; i < frames.length - 1; i++) {
                    if (frame >= frames[i].fi && frame < frames[i + 1].fi) {
                        prevKey = frames[i];
                        nextKey = frames[i + 1];
                        break;
                    }
                }
            }

            const ratio = nextKey.fi !== prevKey.fi
                ? (frame - prevKey.fi) / (nextKey.fi - prevKey.fi)
                : 0;

            const tween = prevKey.tweenFrame !== false;
            const t = tween ? this.getTweenPercent(ratio, prevKey.twE ?? 0) : 0;

            bone.localX = bone.setupX + prevKey.x + t * (nextKey.x - prevKey.x);
            bone.localY = bone.setupY + prevKey.y + t * (nextKey.y - prevKey.y);
            bone.localScaleX = bone.setupScaleX * (prevKey.cX + t * (nextKey.cX - prevKey.cX));
            bone.localScaleY = bone.setupScaleY * (prevKey.cY + t * (nextKey.cY - prevKey.cY));
            bone.localSkewX = bone.setupSkewX + prevKey.kX + t * (nextKey.kX - prevKey.kX);
            bone.localSkewY = bone.setupSkewY + prevKey.kY + t * (nextKey.kY - prevKey.kY);

            const prevColor = prevKey.color || { r: 255, g: 255, b: 255, a: 255 };
            const nextColor = nextKey.color || { r: 255, g: 255, b: 255, a: 255 };
            const currR = prevColor.r + t * (nextColor.r - prevColor.r);
            const currG = prevColor.g + t * (nextColor.g - prevColor.g);
            const currB = prevColor.b + t * (nextColor.b - prevColor.b);
            const currA = prevColor.a + t * (nextColor.a - prevColor.a);
            bone.alpha = currA / 255;

            const prevZ = prevKey.z ?? 0;
            const nextZ = nextKey.z ?? 0;
            bone.zOrder = bone.setupZ + Math.round(prevZ + t * (nextZ - prevZ));

            const displayIndex = prevKey.dI;
            let blendMode = PIXI.BLEND_MODES.NORMAL;
            if ((prevKey.bd_src === 770 && prevKey.bd_dst === 1) || (prevKey.bd_src === 1 && prevKey.bd_dst === 1)) {
                blendMode = PIXI.BLEND_MODES.ADD;
            }
            const tintHex = (Math.round(currR) << 16) | (Math.round(currG) << 8) | Math.round(currB);

            if (bone.displays) {
                for (let j = 0; j < bone.displays.length; j++) {
                    const dispNode = bone.displays[j];
                    if (!dispNode) continue;
                    const show = (j === displayIndex);
                    if (dispNode instanceof CocosStudioParticleEmitter) {
                        dispNode.active = show;
                        dispNode.visible = show || (dispNode.particlesList && dispNode.particlesList.length > 0);
                    } else {
                        dispNode.visible = show;
                        dispNode.blendMode = blendMode;
                        if (dispNode instanceof PIXI.Sprite) dispNode.tint = tintHex;
                    }
                }
            }
        }

        for (const emitter of this.particleEmitters) emitter.update(dt);
        for (const subArm of this.nestedArmatures) subArm.update(dt);

        this.applyWorldTransforms();
        this.sortAllChildren();

        if (this.loop && loopCompleted && this.selfTrigger) {
            this.selfTrigger.remainingLoops--;
            if (this.selfTrigger.remainingLoops <= 0) {
                const movs = this.json.animation_data?.[0]?.mov_data || [];
                const targetName = this.selfTrigger.targetMov.toLowerCase();
                const matchedMov = movs.find((m) => String(m?.name || '').toLowerCase() === targetName);
                if (matchedMov) {
                    this.returnToMov = this.currentMovement.name;
                    this._playingSelfUnique = true;
                    this.play(matchedMov.name, false);
                    this._playingSelfUnique = false;
                }
            }
        } else if (!this.loop && completed && this.returnToMov) {
            const backMov = this.returnToMov;
            this.returnToMov = null;
            this.play(backMov, true);
        }
    }
}

function ensureMiniCharaLayer() {
    if (!window.cameraContainer) return null;
    if (!miniCharaLayer || miniCharaLayer.destroyed) {
        miniCharaLayer = new PIXI.Container();
        miniCharaLayer.name = 'miniCharaLayer';
        window.cameraContainer.addChild(miniCharaLayer);
    } else if (miniCharaLayer.parent !== window.cameraContainer) {
        window.cameraContainer.addChild(miniCharaLayer);
    }
    return miniCharaLayer;
}

async function ensureUnitMarker(layer, token) {
    if (unitMarkerArmature && !unitMarkerArmature.destroyed) {
        if (unitMarkerArmature.parent !== layer) layer.addChildAt(unitMarkerArmature, 0);
        return;
    }
    try {
        if (!unitMarkerAssetsPromise) {
            unitMarkerAssetsPromise = loadCocosBackgroundAssets(CH_TOP_MARKER_URL).catch((err) => {
                unitMarkerAssetsPromise = null;
                throw err;
            });
        }
        const assets = await unitMarkerAssetsPromise;
        if (token !== miniLoadToken || !miniStageActive || !layer || layer.destroyed) return;

        const marker = new MiniCharArmature(assets.json, assets.textures, assets.particles);
        marker.x = MINI_CHARA_X;
        marker.y = MINI_CHARA_Y;
        marker.scale.set(0.8, 0.2);
        marker.play('player_marker_01', true);
        layer.addChildAt(marker, 0);
        unitMarkerArmature = marker;

        const tick = (delta) => {
            if (!marker || marker.destroyed || !miniStageActive) {
                if (unitMarkerTick) {
                    window.app?.ticker?.remove(unitMarkerTick);
                    unitMarkerTick = null;
                }
                return;
            }
            if (marker.playing) {
                try { marker.update(delta / 60); } catch {}
            }
        };
        unitMarkerTick = tick;
        window.app.ticker.add(tick);
    } catch (err) {
        console.warn('[mini-chara] Unit marker load failed:', err);
    }
}

function getMovementsSet(armature) {
    const movs = armature?.json?.animation_data?.[0]?.mov_data;
    if (!Array.isArray(movs)) return null;
    return new Set(movs.map((m) => m?.name).filter(Boolean));
}

function playMiniSequence(armature, animations, standPose = 'wait') {
    if (!armature || armature.destroyed) return;
    const available = getMovementsSet(armature);
    const fallbackPose = (available && !available.has(standPose))
        ? (available.has('wait') ? 'wait' : Array.from(available)[0])
        : standPose;

    const rawQueue = Array.isArray(animations) && animations.length > 0 ? animations : [fallbackPose];
    const queue = rawQueue.map((name) => (!available || available.has(name)) ? name : fallbackPose).filter(Boolean);
    if (queue.length === 0) return;

    let idx = 0;
    const playStep = () => {
        if (!armature || armature.destroyed) return;
        const isLast = idx >= queue.length - 1;
        const movName = queue[idx];
        armature.onMovementEvent = isLast
            ? null
            : (evtName) => {
                if (evtName === 'complete') {
                    idx++;
                    playStep();
                }
            };
        try {
            armature.play(movName, isLast);
        } catch (err) {
            console.warn('[mini-chara] animation play failed:', movName, err);
        }
    };
    playStep();
}

function destroyMiniCharacterOnly() {
    if (miniCharaTick) {
        window.app?.ticker?.remove(miniCharaTick);
        miniCharaTick = null;
    }
    if (miniCharaArmature) {
        miniCharaArmature.onMovementEvent = null;
        try {
            if (miniCharaArmature.parent) miniCharaArmature.parent.removeChild(miniCharaArmature);
            miniCharaArmature.destroy({ children: true });
        } catch {}
        miniCharaArmature = null;
    }
    activeMiniCharaNo = null;
}

async function fetchMiniCompanionFile(primaryDir, fallbackDir, filename, asBinary = false) {
    const urls = [`${primaryDir}/${filename}`];
    if (fallbackDir && fallbackDir !== primaryDir) urls.push(`${fallbackDir}/${filename}`);
    for (const url of urls) {
        try {
            const resp = await fetch(url);
            if (!resp.ok) continue;
            const buf = await resp.arrayBuffer();
            const bytes = new Uint8Array(buf);
            const isGzip = bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
            if (isGzip && typeof DecompressionStream === 'function') {
                const decompressed = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
                return asBinary ? await new Response(decompressed).arrayBuffer() : await new Response(decompressed).text();
            }
            return asBinary ? buf : new TextDecoder().decode(bytes);
        } catch {}
    }
    return null;
}

async function getMiniAssets(miniCharaNo) {
    const key = String(miniCharaNo);
    if (miniAssetCache.has(key)) {
        const cached = miniAssetCache.get(key);
        miniAssetCache.delete(key);
        miniAssetCache.set(key, cached);
        return cached;
    }
    const base = await getImageNativeBase();
    const v2Dir = `${base}/mini/anime_v2`;
    const v1Dir = `${base}/mini/anime`;
    let assetsDir = v2Dir;
    let assets = null;
    try {
        assets = await loadCocosBackgroundAssets(`${v2Dir}/mini_${key}_r.ExportJson.gz`);
    } catch {
        assetsDir = v1Dir;
        assets = await loadCocosBackgroundAssets(`${v1Dir}/mini_${key}_r.ExportJson`);
    }

    const frameMeta = {};
    const plistPaths = (assets.json?.config_file_path || []).filter((p) => typeof p === 'string' && /\.plist$/i.test(p));
    await Promise.all(plistPaths.map(async (plistPath) => {
        try {
            const xml = await fetchMiniCompanionFile(assetsDir, v1Dir, plistPath, false);
            if (!xml) return;
            const parsed = parsePlist(xml);
            if (!parsed?.frames) return;
            for (const [frameName, frame] of Object.entries(parsed.frames)) {
                frameMeta[frameName] = {
                    width: Number(frame.width) || 0,
                    height: Number(frame.height) || 0,
                    originalWidth: Number(frame.originalWidth ?? frame.width) || 0,
                    originalHeight: Number(frame.originalHeight ?? frame.height) || 0,
                    offsetX: Number(frame.offsetX) || 0,
                    offsetY: Number(frame.offsetY) || 0
                };
            }
        } catch {}
    }));
    assets.frameMeta = frameMeta;

    if (miniAssetCache.size >= MINI_CACHE_LIMIT) {
        const oldestKey = miniAssetCache.keys().next().value;
        const oldest = miniAssetCache.get(oldestKey);
        miniAssetCache.delete(oldestKey);
        if (oldest) {
            disposeCocosAssets(oldest.textures, oldest.particles, collectCocosBaseTextures(miniCharaArmature));
        }
    }
    miniAssetCache.set(key, assets);
    return assets;
}

export async function showMiniChara(miniCharaNo, options = {}) {
    if (!miniCharaNo) return;
    miniStageActive = true;
    const key = String(miniCharaNo);
    const standPose = options.standPose === 'stance' ? 'stance' : 'wait';
    const animations = options.animation || [standPose];

    const layer = ensureMiniCharaLayer();
    if (!layer) return;

    const token = ++miniLoadToken;
    ensureUnitMarker(layer, token);

    if (activeMiniCharaNo === key && miniCharaArmature && !miniCharaArmature.destroyed) {
        miniCharaArmature.alpha = 1;
        playMiniSequence(miniCharaArmature, animations, standPose);
        return;
    }

    try {
        const assets = await getMiniAssets(key);
        if (token !== miniLoadToken || !miniStageActive || !layer || layer.destroyed) return;

        destroyMiniCharacterOnly();

        const armature = new MiniCharArmature(assets.json, assets.textures, assets.particles, assets.frameMeta);
        armature.x = MINI_CHARA_X;
        armature.y = MINI_CHARA_Y;
        armature.scale.set(1.0);
        armature.alpha = options.fade === false ? 1 : 0;
        layer.addChild(armature);
        miniCharaArmature = armature;
        activeMiniCharaNo = key;

        playMiniSequence(armature, animations, standPose);

        const tick = (delta) => {
            if (!armature || armature.destroyed || !miniStageActive) {
                if (miniCharaTick) {
                    window.app?.ticker?.remove(miniCharaTick);
                    miniCharaTick = null;
                }
                return;
            }
            const dt = delta / 60;
            if (armature.alpha < 1) {
                armature.alpha = Math.min(1, armature.alpha + dt / 0.3);
            }
            if (armature.playing) {
                try { armature.update(dt); } catch {}
            }
        };
        miniCharaTick = tick;
        window.app.ticker.add(tick);
    } catch (err) {
        console.warn(`[mini-chara] Failed to load mini character ${key}:`, err);
    }
}

export function hideMiniChara() {
    miniStageActive = false;
    miniLoadToken++;
    destroyMiniCharacterOnly();
    if (unitMarkerTick) {
        window.app?.ticker?.remove(unitMarkerTick);
        unitMarkerTick = null;
    }
    if (unitMarkerArmature) {
        try {
            if (unitMarkerArmature.parent) unitMarkerArmature.parent.removeChild(unitMarkerArmature);
            unitMarkerArmature.destroy({ children: true });
        } catch {}
        unitMarkerArmature = null;
    }
    if (miniCharaLayer) {
        try {
            if (miniCharaLayer.parent) miniCharaLayer.parent.removeChild(miniCharaLayer);
            miniCharaLayer.destroy({ children: true });
        } catch {}
        miniCharaLayer = null;
    }
}
