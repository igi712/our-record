/**
 * cocos-to-pixi.js
 * A lightweight CocosStudio v1.x ExportJson / Plist player in PixiJS.
 */

/**
 * Parses Apple XML Property Lists into a JavaScript object.
 * @param {string} xmlString 
 * @returns {object|null}
 */
export function parsePlist(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    function parseValue(node) {
        if (!node) return null;
        const name = node.nodeName.toLowerCase();
        
        if (name === 'dict') {
            const obj = {};
            let currentKey = null;
            const children = Array.from(node.childNodes).filter(n => n.nodeType === 1);
            for (const child of children) {
                const childName = child.nodeName.toLowerCase();
                if (childName === 'key') {
                    currentKey = child.textContent.trim();
                } else if (currentKey) {
                    obj[currentKey] = parseValue(child);
                    currentKey = null;
                }
            }
            return obj;
        } else if (name === 'array') {
            const arr = [];
            const children = Array.from(node.childNodes).filter(n => n.nodeType === 1);
            for (const child of children) {
                arr.push(parseValue(child));
            }
            return arr;
        } else if (name === 'string') {
            return node.textContent;
        } else if (name === 'integer') {
            return parseInt(node.textContent.trim(), 10);
        } else if (name === 'real') {
            return parseFloat(node.textContent.trim());
        } else if (name === 'true') {
            return true;
        } else if (name === 'false') {
            return false;
        }
        return null;
    }
    
    const plist = xmlDoc.getElementsByTagName('plist')[0];
    if (!plist) return null;
    
    const rootDict = Array.from(plist.childNodes).find(n => n.nodeType === 1);
    return parseValue(rootDict);
}

/**
 * Decompresses base64 encoded gzipped data using the browser's native DecompressionStream.
 * @param {string} base64Str 
 * @returns {Promise<Blob>}
 */
async function decompressGzipBase64(base64Str) {
    const binaryString = atob(base64Str.trim());
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const ds = new DecompressionStream('gzip');
    const decompressedStream = new Response(bytes).body.pipeThrough(ds);
    return await new Response(decompressedStream).blob();
}

/**
 * Decodes a simple uncompressed TIFF image from an ArrayBuffer to an HTML Canvas.
 * @param {ArrayBuffer} arrayBuffer 
 * @returns {HTMLCanvasElement}
 */
function decodeTiffToCanvas(arrayBuffer) {
    const view = new DataView(arrayBuffer);
    const isLittleEndian = view.getUint16(0, true) === 0x4949; // "II"
    const magic = view.getUint16(2, isLittleEndian);
    if (magic !== 42) {
        throw new Error("Invalid TIFF magic number: " + magic);
    }
    
    const firstIfdOffset = view.getUint32(4, isLittleEndian);
    const numEntries = view.getUint16(firstIfdOffset, isLittleEndian);
    
    let width = 0;
    let height = 0;
    let compression = 1;
    let stripOffset = 0;
    let stripByteCount = 0;
    let samplesPerPixel = 1;
    
    let offset = firstIfdOffset + 2;
    for (let i = 0; i < numEntries; i++) {
        const tag = view.getUint16(offset, isLittleEndian);
        const type = view.getUint16(offset + 2, isLittleEndian);
        const count = view.getUint32(offset + 4, isLittleEndian);
        
        let value = 0;
        if (type === 3) { // SHORT
            value = view.getUint16(offset + 8, isLittleEndian);
        } else if (type === 4) { // LONG
            value = view.getUint32(offset + 8, isLittleEndian);
        }
        
        if (tag === 256) width = value;
        else if (tag === 257) height = value;
        else if (tag === 259) compression = value;
        else if (tag === 273) stripOffset = value;
        else if (tag === 279) stripByteCount = value;
        else if (tag === 277) samplesPerPixel = value;
        
        offset += 12;
    }
    
    if (compression !== 1) {
        throw new Error("Unsupported TIFF compression format: " + compression);
    }
    
    // Extract raw pixels safely
    const rawPixels = new Uint8Array(arrayBuffer, stripOffset, stripByteCount);
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    
    if (samplesPerPixel === 4) {
        // Direct copy of RGBA
        const copyLen = Math.min(rawPixels.length, width * height * 4);
        imageData.data.set(rawPixels.subarray(0, copyLen));
    } else if (samplesPerPixel === 3) {
        // RGB -> RGBA
        const dst = imageData.data;
        let sIdx = 0;
        let dIdx = 0;
        const total = width * height;
        for (let i = 0; i < total; i++) {
            dst[dIdx] = rawPixels[sIdx];
            dst[dIdx + 1] = rawPixels[sIdx + 1];
            dst[dIdx + 2] = rawPixels[sIdx + 2];
            dst[dIdx + 3] = 255;
            sIdx += 3;
            dIdx += 4;
        }
    } else {
        throw new Error("Unsupported SamplesPerPixel count: " + samplesPerPixel);
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

/**
 * Loads a CocosStudio animation from a JSON url, including its plist spritesheets and particles.
 * @param {string} exportJsonUrl 
 * @returns {Promise<{json: object, textures: Object<string, PIXI.Texture>, particles: Object<string, object>}>}
 */
export async function loadCocosStudioAssets(exportJsonUrl) {
    const response = await fetch(exportJsonUrl);
    const json = await response.json();
    
    const textures = {};
    const particles = {};
    const baseUrl = exportJsonUrl.substring(0, exportJsonUrl.lastIndexOf('/') + 1);
    
    const plistPaths = json.config_file_path || [];
    
    const loadPromises = plistPaths.map(async (plistPath) => {
        const plistUrl = baseUrl + plistPath;
        const plistResp = await fetch(plistUrl);
        const plistXml = await plistResp.text();
        const plistData = parsePlist(plistXml);
        
        if (!plistData) return;
        
        if (plistData.frames) {
            // Spritesheet plist
            const textureFileName = plistData.metadata?.textureFileName || plistPath.replace(/\.plist$/i, '.png');
            const pngUrl = baseUrl + textureFileName;
            
            await new Promise((resolve, reject) => {
                const baseTexture = PIXI.BaseTexture.from(pngUrl);
                const processAndResolve = () => {
                    try {
                        processBaseTexture(baseTexture, plistData.frames);
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                };

                if (baseTexture.valid) {
                    processAndResolve();
                } else {
                    baseTexture.on('loaded', processAndResolve);
                    baseTexture.on('error', () => reject(new Error(`Failed to load texture ${pngUrl}`)));
                }
            });
        } else if (plistData.maxParticles !== undefined) {
            // Particle plist
            if (plistData.textureImageData) {
                try {
                    const blob = await decompressGzipBase64(plistData.textureImageData);
                    const head = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
                    const isTiff = (head[0] === 0x4d && head[1] === 0x4d) || (head[0] === 0x49 && head[1] === 0x49);
                    
                    if (isTiff) {
                        try {
                            const arrayBuffer = await blob.arrayBuffer();
                            const canvas = decodeTiffToCanvas(arrayBuffer);
                            plistData.particleTexture = PIXI.Texture.from(canvas);
                            plistData.isTiff = false;
                        } catch (tiffErr) {
                            console.warn('[CocosStudioPlayer] Failed to decode TIFF natively:', tiffErr);
                            plistData.isTiff = true;
                        }
                    } else {
                        const imgUrl = URL.createObjectURL(blob);
                        plistData.particleTexture = PIXI.Texture.from(imgUrl);
                        plistData.isTiff = false;
                    }
                } catch (e) {
                    console.error('[CocosStudioPlayer] Failed to load particle texture from base64:', e);
                }
            }
            particles[plistPath] = plistData;
        }
    });
    
    function processBaseTexture(baseTexture, frames) {
        for (const frameName in frames) {
            const frame = frames[frameName];
            let x = frame.x;
            let y = frame.y;
            let w = frame.width;
            let h = frame.height;
            const rotated = frame.rotated === true;
            
            // Fallback for frame string e.g. "{{0,0},{1024,400}}"
            if (x === undefined && frame.frame) {
                const matches = frame.frame.match(/\{\{(\d+),\s*(\d+)\},\s*\{(\d+),\s*(\d+)\}\}/);
                if (matches) {
                    x = parseInt(matches[1], 10);
                    y = parseInt(matches[2], 10);
                    w = parseInt(matches[3], 10);
                    h = parseInt(matches[4], 10);
                }
            }
            
            if (x !== undefined && w !== undefined && h !== undefined) {
                const rect = new PIXI.Rectangle(x, y, w, h);
                const orig = new PIXI.Rectangle(0, 0, rotated ? h : w, rotated ? w : h);
                const trim = null;
                const rotate = rotated ? 6 : 0; // rotate 6 represents 90 degrees CCW in PixiJS v5/v6
                
                const texture = new PIXI.Texture(baseTexture, rect, orig, trim, rotate);
                textures[frameName] = texture;
            }
        }
    }
    
    await Promise.all(loadPromises);
    return { json, textures, particles };
}

/**
 * Lightweight additive / gravity particle system emulator for Cocos2d-style particles in PixiJS.
 */
export class CocosStudioParticleEmitter extends PIXI.Container {
    constructor(config) {
        super();
        this.config = {
            ...config,
            sourcePositionx: 0,
            sourcePositiony: 0
        };
        this.particlesList = [];
        this.maxParticles = config.maxParticles ?? 100;
        this.active = true;
        
        const lifespan = config.particleLifespan ?? 1.0;
        this.emissionRate = this.maxParticles / (lifespan <= 0 ? 1.0 : lifespan);
        this.emitCounter = 0;
        this.texture = config.particleTexture;
        
        // Additive blending setup: SRC_ALPHA (770) + ONE (1)
        if (config.blendFuncSource === 770 && config.blendFuncDestination === 1) {
            this.blendMode = PIXI.BLEND_MODES.ADD;
        } else {
            this.blendMode = PIXI.BLEND_MODES.NORMAL;
        }
        
        this.loopDuration = false;
        this.elapsedDuration = 0;
    }
    
    randomMinus1To1() {
        return Math.random() * 2 - 1;
    }
    
    emitParticle() {
        if (!this.texture) return;
        const c = this.config;
        
        const lifespan = Math.max(0.01, (c.particleLifespan ?? 1.0) + (c.particleLifespanVariance ?? 0) * this.randomMinus1To1());
        const startX = (c.sourcePositionx ?? 0) + (c.sourcePositionVariancex ?? 0) * this.randomMinus1To1();
        const startY = (c.sourcePositiony ?? 0) + (c.sourcePositionVariancey ?? 0) * this.randomMinus1To1();
        
        const angleDeg = (c.angle ?? 0) + (c.angleVariance ?? 0) * this.randomMinus1To1();
        const angleRad = angleDeg * Math.PI / 180;
        const speed = (c.speed ?? 0) + (c.speedVariance ?? 0) * this.randomMinus1To1();
        
        const vx = speed * Math.cos(angleRad);
        const vy = speed * Math.sin(angleRad);
        
        const startSize = Math.max(0, (c.startParticleSize ?? 10) + (c.startParticleSizeVariance ?? 0) * this.randomMinus1To1());
        const finishSize = Math.max(0, (c.finishParticleSize ?? 0) + (c.finishParticleSizeVariance ?? 0) * this.randomMinus1To1());
        
        const startColor = {
            r: Math.max(0, Math.min(1, (c.startColorRed ?? 1) + (c.startColorVarianceRed ?? 0) * this.randomMinus1To1())),
            g: Math.max(0, Math.min(1, (c.startColorGreen ?? 1) + (c.startColorVarianceGreen ?? 0) * this.randomMinus1To1())),
            b: Math.max(0, Math.min(1, (c.startColorBlue ?? 1) + (c.startColorVarianceBlue ?? 0) * this.randomMinus1To1())),
            a: Math.max(0, Math.min(1, (c.startColorAlpha ?? 1) + (c.startColorVarianceAlpha ?? 0) * this.randomMinus1To1()))
        };
        
        const finishColor = {
            r: Math.max(0, Math.min(1, (c.finishColorRed ?? 1) + (c.finishColorVarianceRed ?? 0) * this.randomMinus1To1())),
            g: Math.max(0, Math.min(1, (c.finishColorGreen ?? 1) + (c.finishColorVarianceGreen ?? 0) * this.randomMinus1To1())),
            b: Math.max(0, Math.min(1, (c.finishColorBlue ?? 1) + (c.finishColorVarianceBlue ?? 0) * this.randomMinus1To1())),
            a: Math.max(0, Math.min(1, (c.finishColorAlpha ?? 1) + (c.finishColorVarianceAlpha ?? 0) * this.randomMinus1To1()))
        };
        
        const startRot = ((c.rotationStart ?? 0) + (c.rotationStartVariance ?? 0) * this.randomMinus1To1()) * Math.PI / 180;
        const finishRot = ((c.rotationEnd ?? 0) + (c.rotationEndVariance ?? 0) * this.randomMinus1To1()) * Math.PI / 180;
        
        const sprite = new PIXI.Sprite(this.texture);
        sprite.anchor.set(0.5, 0.5);
        sprite.blendMode = this.blendMode;
        
        sprite.x = startX;
        sprite.y = -startY;
        
        const texWidth = this.texture.width || 10;
        sprite.scale.set(startSize / texWidth);
        
        sprite.alpha = startColor.a;
        sprite.rotation = -startRot;
        
        const r = Math.round(startColor.r * 255);
        const g = Math.round(startColor.g * 255);
        const b = Math.round(startColor.b * 255);
        sprite.tint = (r << 16) | (g << 8) | b;
        
        this.addChild(sprite);
        
        this.particlesList.push({
            sprite,
            time: 0,
            lifespan,
            x: startX,
            y: startY,
            vx,
            vy,
            startSize,
            finishSize,
            startColor,
            finishColor,
            startRot,
            finishRot
        });
    }
    
    update(dt) {
        const c = this.config;
        
        if (this.active) {
            const duration = c.duration ?? -1;
            if (duration > 0) {
                this.elapsedDuration += dt;
                if (this.elapsedDuration >= duration) {
                    if (this.loopDuration) {
                        this.elapsedDuration = 0;
                    } else {
                        this.active = false;
                    }
                }
            }

            if (this.active) {
                const rate = 1.0 / this.emissionRate;
                this.emitCounter += dt;
                while (this.particlesList.length < this.maxParticles && this.emitCounter > rate) {
                    this.emitParticle();
                    this.emitCounter -= rate;
                }
            }
        }
        
        const gravityX = c.gravityx ?? 0;
        const gravityY = c.gravityy ?? 0;
        const texWidth = this.texture?.width || 10;
        
        for (let i = this.particlesList.length - 1; i >= 0; i--) {
            const p = this.particlesList[i];
            p.time += dt;
            
            if (p.time >= p.lifespan) {
                this.removeChild(p.sprite);
                p.sprite.destroy();
                this.particlesList.splice(i, 1);
                continue;
            }
            
            const ratio = p.time / p.lifespan;
            
            p.vx += gravityX * dt;
            p.vy += gravityY * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            
            p.sprite.x = p.x;
            p.sprite.y = -p.y;
            p.sprite.blendMode = this.blendMode;
            
            const sizeMultiplier = window.highVisibilityParticles ? 5.0 : 1.0;
            const currentSize = (p.startSize + ratio * (p.finishSize - p.startSize)) * sizeMultiplier;
            p.sprite.scale.set(currentSize / texWidth);
            
            const currR = p.startColor.r + ratio * (p.finishColor.r - p.startColor.r);
            const currG = p.startColor.g + ratio * (p.finishColor.g - p.startColor.g);
            const currB = p.startColor.b + ratio * (p.finishColor.b - p.startColor.b);
            const currA = window.highVisibilityParticles ? 1.0 : (p.startColor.a + ratio * (p.finishColor.a - p.startColor.a));
            
            p.sprite.alpha = currA;
            const r = Math.round(currR * 255);
            const g = Math.round(currG * 255);
            const b = Math.round(currB * 255);
            p.sprite.tint = (r << 16) | (g << 8) | b;
            
            const currRot = p.startRot + ratio * (p.finishRot - p.startRot);
            p.sprite.rotation = -currRot;
        }
    }
    
    destroy(options) {
        this.active = false;
        for (const p of this.particlesList) {
            if (p.sprite) p.sprite.destroy();
        }
        this.particlesList = [];
        super.destroy(options);
    }
}

/**
 * CocosStudioArmature renders and plays the skeletal animation in PixiJS.
 */
export class CocosStudioArmature extends PIXI.Container {
    constructor(json, textures, particles = {}) {
        super();
        this.json = json;
        this.textures = textures;
        this.particles = particles;
        this.bones = {};
        this.currentMovement = null;
        this.currentFrame = 0;
        this.playing = false;
        this.loop = true;
        this.animationScale = 1;
        this.elapsedTime = 0;
        this.particleEmitters = [];
        this.nestedArmatures = [];
        
        this.buildHierarchy();
    }
    
    buildHierarchy() {
        const armatureData = this.json.armature_data?.[0];
        if (!armatureData) return;
        
        const textureData = this.json.texture_data || [];
        
        // 1. Create a PIXI.Container for each bone
        for (const bone of armatureData.bone_data) {
            const container = new PIXI.Container();
            container.name = bone.name;
            
            // Keep original setup transforms
            container.setupX = bone.x ?? 0;
            container.setupY = bone.y ?? 0;
            container.setupScaleX = bone.cX ?? 1;
            container.setupScaleY = bone.cY ?? 1;
            container.setupSkewX = bone.kX ?? 0;
            container.setupSkewY = bone.kY ?? 0;
            container.setupZ = bone.z ?? 0;
            
            // Apply setup transform with Y-flip
            container.x = container.setupX;
            container.y = -container.setupY; // Y-flip translation
            container.scale.set(container.setupScaleX, container.setupScaleY);
            container.skew.set(container.setupSkewX, -container.setupSkewY); // Y-flip skew
            container.zOrder = container.setupZ;
            
            this.bones[bone.name] = container;
            
            // 2. Initialize Displays (Sprites, Armatures, Particles)
            if (bone.display_data) {
                container.displays = [];
                for (const disp of bone.display_data) {
                    if (disp.displayType === 0) { // Sprite
                        let tex = this.textures[disp.name];
                        if (!tex) {
                            const cleanName = disp.name.replace(/\.png$/i, '');
                            tex = this.textures[cleanName] || this.textures[cleanName + '.png'];
                        }
                        
                        if (tex) {
                            const sprite = new PIXI.Sprite(tex);
                            
                            // Lookup anchor / pivot
                            const baseName = disp.name.replace(/\.png$/i, '');
                            const texInfo = textureData.find(t => t.name === baseName);
                            const pX = texInfo ? (texInfo.pX ?? 0.5) : 0.5;
                            const pY = texInfo ? (texInfo.pY ?? 0.5) : 0.5;
                            sprite.anchor.set(pX, pY);
                            
                            // Offset skin_data relative to parent bone
                            const skin = disp.skin_data?.[0] || { x: 0, y: 0, cX: 1, cY: 1, kX: 0, kY: 0 };
                            sprite.x = skin.x ?? 0;
                            sprite.y = -(skin.y ?? 0); // Y-flip offset
                            sprite.scale.set(skin.cX ?? 1, skin.cY ?? 1);
                            sprite.skew.set(skin.kX ?? 0, -(skin.kY ?? 0)); // Y-flip skew
                            
                            sprite.visible = false;
                            container.addChild(sprite);
                            container.displays.push(sprite);
                        } else {
                            container.displays.push(null);
                        }
                    } else if (disp.displayType === 1) { // Nested Armature
                        const childArmData = this.json.armature_data.find(a => a.name === disp.name);
                        if (childArmData) {
                            const childJson = {
                                ...this.json,
                                armature_data: [childArmData]
                            };
                            const subArm = new CocosStudioArmature(childJson, this.textures, this.particles);
                            subArm.visible = false;
                            container.addChild(subArm);
                            container.displays.push(subArm);
                            this.nestedArmatures.push(subArm);
                        } else {
                            container.displays.push(null);
                        }
                    } else if (disp.displayType === 2) { // Particle System
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
        }
        
        // 3. Chain parent and child bones
        for (const bone of armatureData.bone_data) {
            const container = this.bones[bone.name];
            if (bone.parent && this.bones[bone.parent]) {
                this.bones[bone.parent].addChild(container);
            } else {
                this.addChild(container);
            }
        }
    }
    
    play(movementNameOrIndex, loop = true) {
        const animationData = this.json.animation_data?.[0];
        if (!animationData) return;
        
        let movement = null;
        if (typeof movementNameOrIndex === 'number') {
            movement = animationData.mov_data[movementNameOrIndex];
        } else {
            movement = animationData.mov_data.find(m => m.name === movementNameOrIndex);
        }
        
        if (!movement) {
            console.warn('[CocosStudioPlayer] Movement not found:', movementNameOrIndex);
            return;
        }
        
        this.currentMovement = movement;
        this.currentFrame = 0;
        this.elapsedTime = 0;
        this.playing = true;
        this.loop = loop;
        
        // Reset transforms to base pose
        for (const name in this.bones) {
            const bone = this.bones[name];
            bone.x = bone.setupX;
            bone.y = -bone.setupY;
            bone.scale.set(bone.setupScaleX, bone.setupScaleY);
            bone.skew.set(bone.setupSkewX, -bone.setupSkewY);
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
        
        this.sortAllChildren();
        
        if (this.onMovementEvent) {
            try {
                this.onMovementEvent('start', this.currentMovement.name);
            } catch (e) {
                console.error('[CocosStudioPlayer] Error in onMovementEvent:', e);
            }
        }
    }
    
    stop() {
        this.playing = false;
        for (const subArm of this.nestedArmatures) {
            subArm.stop();
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
            if (frame >= duration) {
                loopCompleted = true;
            }
            frame = frame % duration;
        } else {
            if (frame >= duration - 1) {
                frame = duration - 1;
                
                // Only end playing once all active particles have finished fading out
                let hasLiveParticles = false;
                for (const emitter of this.particleEmitters) {
                    if (emitter.particlesList && emitter.particlesList.length > 0) {
                        hasLiveParticles = true;
                        break;
                    }
                }
                
                if (!hasLiveParticles) {
                    completed = true;
                    this.playing = false;
                }
            }
        }
        
        this.currentFrame = frame;
        
        // Trigger frame events
        if (this.onFrameEvent) {
            const movBoneDataList = this.currentMovement.mov_bone_data || [];
            for (const timeline of movBoneDataList) {
                const frames = timeline.frame_data || [];
                for (const f of frames) {
                    if (f.evt) {
                        let crossed = false;
                        if (loopCompleted) {
                            crossed = (f.fi >= prevFrame && f.fi < duration) || (f.fi >= 0 && f.fi <= this.currentFrame);
                        } else if (prevFrame <= this.currentFrame) {
                            crossed = (f.fi > prevFrame && f.fi <= this.currentFrame);
                        }
                        if (crossed) {
                            try {
                                this.onFrameEvent(f.evt);
                            } catch (e) {
                                console.error('[CocosStudioPlayer] Error in onFrameEvent:', e);
                            }
                        }
                    }
                }
            }
        }

        // Trigger loop/complete movement events
        if (loopCompleted && this.onMovementEvent) {
            try {
                this.onMovementEvent('loopComplete', this.currentMovement.name);
            } catch (e) {
                console.error('[CocosStudioPlayer] Error in onMovementEvent:', e);
            }
        }
        if (completed && this.onMovementEvent) {
            try {
                this.onMovementEvent('complete', this.currentMovement.name);
            } catch (e) {
                console.error('[CocosStudioPlayer] Error in onMovementEvent:', e);
            }
        }
        
        const movBoneDataList = this.currentMovement.mov_bone_data || [];
        for (const timeline of movBoneDataList) {
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
            
            let ratio = 0;
            if (nextKey.fi !== prevKey.fi) {
                ratio = (frame - prevKey.fi) / (nextKey.fi - prevKey.fi);
            }
            
            const tween = prevKey.tweenFrame !== false;
            const twE = prevKey.twE ?? 0;
            const t = tween ? this.getTweenPercent(ratio, twE) : 0;
            
            // Interpolate values
            const dx = prevKey.x + t * (nextKey.x - prevKey.x);
            const dy = prevKey.y + t * (nextKey.y - prevKey.y);
            const dScaleX = prevKey.cX + t * (nextKey.cX - prevKey.cX);
            const dScaleY = prevKey.cY + t * (nextKey.cY - prevKey.cY);
            const dSkewX = prevKey.kX + t * (nextKey.kX - prevKey.kX);
            const dSkewY = prevKey.kY + t * (nextKey.kY - prevKey.kY);
            
            const prevColor = prevKey.color || { r: 255, g: 255, b: 255, a: 255 };
            const nextColor = nextKey.color || { r: 255, g: 255, b: 255, a: 255 };
            const currR = prevColor.r + t * (nextColor.r - prevColor.r);
            const currG = prevColor.g + t * (nextColor.g - prevColor.g);
            const currB = prevColor.b + t * (nextColor.b - prevColor.b);
            const currA = prevColor.a + t * (nextColor.a - prevColor.a);
            
            // Apply transformations with Y-flip logic
            bone.x = bone.setupX + dx;
            bone.y = -(bone.setupY + dy);
            bone.scale.set(
                bone.setupScaleX * dScaleX,
                bone.setupScaleY * dScaleY
            );
            bone.skew.set(
                bone.setupSkewX + dSkewX,
                -(bone.setupSkewY + dSkewY)
            );
            bone.alpha = currA / 255;
            
            const prevZ = prevKey.z ?? 0;
            const nextZ = nextKey.z ?? 0;
            const dZ = prevZ + t * (nextZ - prevZ);
            bone.zOrder = bone.setupZ + Math.round(dZ);
            
            // Resolve active displayIndex
            const displayIndex = prevKey.dI;
            
            // Determine active blend mode from keyframe bd_src / bd_dst
            let blendMode = PIXI.BLEND_MODES.NORMAL;
            if (prevKey.bd_src === 770 && prevKey.bd_dst === 1) {
                blendMode = PIXI.BLEND_MODES.ADD;
            } else if (prevKey.bd_src === 1 && prevKey.bd_dst === 1) {
                blendMode = PIXI.BLEND_MODES.ADD;
            }
            
            const tintHex = (Math.round(currR) << 16) | (Math.round(currG) << 8) | Math.round(currB);
            
            if (bone.displays) {
                for (let j = 0; j < bone.displays.length; j++) {
                    const dispNode = bone.displays[j];
                    if (dispNode) {
                        const show = (j === displayIndex);
                        
                        if (dispNode instanceof CocosStudioParticleEmitter) {
                            dispNode.active = show;
                            dispNode.visible = show || (dispNode.particlesList && dispNode.particlesList.length > 0);
                        } else {
                            dispNode.visible = show;
                            dispNode.blendMode = blendMode;
                            if (dispNode instanceof PIXI.Sprite) {
                                dispNode.tint = tintHex;
                            }
                        }
                    }
                }
            }
        }
        
        // Update emitters
        for (const emitter of this.particleEmitters) {
            emitter.update(dt);
        }
        
        // Update nested armatures
        for (const subArm of this.nestedArmatures) {
            subArm.update(dt);
        }
        
        this.sortAllChildren();
    }
    
    getTweenPercent(ratio, twE) {
        if (twE === 0) return ratio; // Linear
        
        // Sine curves
        if (twE === 1) return (1 - Math.cos(ratio * Math.PI)) / 2; // Sine In-Out
        if (twE === 2) return Math.sin(ratio * Math.PI / 2); // Sine Out
        if (twE === 3) return 1 - Math.cos(ratio * Math.PI / 2); // Sine In
        
        // Quadratic curves
        if (twE === 4) return ratio * ratio; // Quad In
        if (twE === 5) return ratio * (2 - ratio); // Quad Out
        if (twE === 6) return ratio < 0.5 ? 2 * ratio * ratio : -1 + (4 - 2 * ratio) * ratio; // Quad In-Out
        
        // Exponential curves
        if (twE === 16) return Math.pow(2, 10 * (ratio - 1)); // Exp In
        if (twE === 17) return 1 - Math.pow(2, -10 * ratio); // Exp Out
        
        return ratio;
    }
    
    sortAllChildren() {
        const sortFunc = (a, b) => (a.zOrder || 0) - (b.zOrder || 0);
        const sortChildren = (container) => {
            if (container.children && container.children.length > 1) {
                container.children.sort(sortFunc);
            }
            for (const child of container.children) {
                if (child instanceof PIXI.Container) {
                    sortChildren(child);
                }
            }
        };
        sortChildren(this);
    }
}

/**
 * Loads a CocosStudio animation or particle config from a list of local File objects.
 * Useful for debugging and loading files directly from the user's disk.
 * @param {FileList|File[]} fileList 
 * @returns {Promise<{type: 'armature', json: object, textures: Object<string, PIXI.Texture>, particles: Object<string, object>} | {type: 'particle', config: object}>}
 */
export async function loadCocosStudioFromLocalFiles(fileList) {
    const files = Array.from(fileList);
    
    // Find json (case-insensitive)
    const jsonFile = files.find(f => {
        const lower = f.name.toLowerCase();
        return lower.endsWith('.exportjson') || lower.endsWith('.json');
    });
    
    // Find plists (case-insensitive)
    const plistFiles = files.filter(f => f.name.toLowerCase().endsWith('.plist'));
    
    // If no ExportJson but there's a particle plist, load it as particle preview
    if (!jsonFile && plistFiles.length === 1) {
        const plistFile = plistFiles[0];
        const plistXml = await plistFile.text();
        const plistData = parsePlist(plistXml);
        
        if (plistData && plistData.maxParticles !== undefined) {
            let isTiff = false;
            if (plistData.textureImageData) {
                try {
                    const blob = await decompressGzipBase64(plistData.textureImageData);
                    const head = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
                    isTiff = (head[0] === 0x4d && head[1] === 0x4d) || (head[0] === 0x49 && head[1] === 0x49);
                    
                    if (isTiff) {
                        try {
                            const arrayBuffer = await blob.arrayBuffer();
                            const canvas = decodeTiffToCanvas(arrayBuffer);
                            plistData.particleTexture = PIXI.Texture.from(canvas);
                            plistData.isTiff = false;
                        } catch (tiffErr) {
                            console.warn('[CocosStudioPlayer] Failed to decode TIFF natively:', tiffErr);
                            plistData.isTiff = true;
                        }
                    } else {
                        const imgUrl = URL.createObjectURL(blob);
                        plistData.particleTexture = PIXI.Texture.from(imgUrl);
                        plistData.isTiff = false;
                    }
                } catch (e) {
                    console.error('[CocosStudioPlayer] Failed to decompress particle image:', e);
                }
            }
            
            const texName = plistData.textureFileName;
            const pngFile = files.find(f => f.name === texName);
            if (pngFile) {
                const imgUrl = URL.createObjectURL(pngFile);
                plistData.particleTexture = PIXI.Texture.from(imgUrl);
                plistData.isTiff = false;
            }
            return { type: 'particle', config: plistData };
        }
    }
    
    if (!jsonFile) {
        throw new Error('No .ExportJson or particle .plist file found in selection.');
    }
    
    const jsonText = await jsonFile.text();
    const json = JSON.parse(jsonText);
    
    const textures = {};
    const particles = {};
    
    for (const plistFile of plistFiles) {
        const plistXml = await plistFile.text();
        const plistData = parsePlist(plistXml);
        if (!plistData) continue;
        
        if (plistData.frames) {
            const textureFileName = plistData.metadata?.textureFileName || plistFile.name.replace(/\.plist$/i, '.png');
            const pngFile = files.find(f => f.name.toLowerCase() === textureFileName.toLowerCase());
            if (!pngFile) {
                console.warn(`[CocosStudioPlayer] Spritesheet PNG not found for ${plistFile.name}: ${textureFileName}`);
                continue;
            }
            
            const pngUrl = URL.createObjectURL(pngFile);
            await new Promise((resolve, reject) => {
                const baseTexture = PIXI.BaseTexture.from(pngUrl);
                const process = () => {
                    for (const frameName in plistData.frames) {
                        const frame = plistData.frames[frameName];
                        let x = frame.x;
                        let y = frame.y;
                        let w = frame.width;
                        let h = frame.height;
                        const rotated = frame.rotated === true;
                        
                        if (x === undefined && frame.frame) {
                            const matches = frame.frame.match(/\{\{(\d+),\s*(\d+)\},\s*\{(\d+),\s*(\d+)\}\}/);
                            if (matches) {
                                x = parseInt(matches[1], 10);
                                y = parseInt(matches[2], 10);
                                w = parseInt(matches[3], 10);
                                h = parseInt(matches[4], 10);
                            }
                        }
                        
                        if (x !== undefined && w !== undefined && h !== undefined) {
                            const rect = new PIXI.Rectangle(x, y, w, h);
                            const orig = new PIXI.Rectangle(0, 0, rotated ? h : w, rotated ? w : h);
                            const trim = null;
                            const rotate = rotated ? 6 : 0;
                            const texture = new PIXI.Texture(baseTexture, rect, orig, trim, rotate);
                            textures[frameName] = texture;
                        }
                    }
                    resolve();
                };
                
                if (baseTexture.valid) {
                    process();
                } else {
                    baseTexture.on('loaded', process);
                    baseTexture.on('error', () => reject(new Error(`Failed to load local spritesheet texture`)));
                }
            });
        } else if (plistData.maxParticles !== undefined) {
            let isTiff = false;
            if (plistData.textureImageData) {
                try {
                    const blob = await decompressGzipBase64(plistData.textureImageData);
                    const head = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
                    isTiff = (head[0] === 0x4d && head[1] === 0x4d) || (head[0] === 0x49 && head[1] === 0x49);
                    
                    if (isTiff) {
                        try {
                            const arrayBuffer = await blob.arrayBuffer();
                            const canvas = decodeTiffToCanvas(arrayBuffer);
                            plistData.particleTexture = PIXI.Texture.from(canvas);
                            plistData.isTiff = false;
                        } catch (tiffErr) {
                            console.warn('[CocosStudioPlayer] Failed to decode TIFF natively:', tiffErr);
                            plistData.isTiff = true;
                        }
                    } else {
                        const imgUrl = URL.createObjectURL(blob);
                        plistData.particleTexture = PIXI.Texture.from(imgUrl);
                        plistData.isTiff = false;
                    }
                } catch (e) {
                    console.error('[CocosStudioPlayer] Failed to load particle texture from base64:', e);
                }
            }
            
            const texName = plistData.textureFileName;
            const pngFile = files.find(f => f.name === texName);
            if (pngFile) {
                const imgUrl = URL.createObjectURL(pngFile);
                plistData.particleTexture = PIXI.Texture.from(imgUrl);
                plistData.isTiff = false;
            }
            particles[plistFile.name] = plistData;
        }
    }
    
    return { type: 'armature', json, textures, particles };
}
