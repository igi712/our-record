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
 * Loads a CocosStudio animation from a JSON url, including its plist spritesheets.
 * @param {string} exportJsonUrl 
 * @returns {Promise<{json: object, textures: Object<string, PIXI.Texture>}>}
 */
export async function loadCocosStudioAssets(exportJsonUrl) {
    const response = await fetch(exportJsonUrl);
    const json = await response.json();
    
    const textures = {};
    const baseUrl = exportJsonUrl.substring(0, exportJsonUrl.lastIndexOf('/') + 1);
    
    const plistPaths = json.config_file_path || [];
    
    const loadPromises = plistPaths.map(async (plistPath) => {
        const plistUrl = baseUrl + plistPath;
        const plistResp = await fetch(plistUrl);
        const plistXml = await plistResp.text();
        const plistData = parsePlist(plistXml);
        
        if (!plistData || !plistData.frames) return;
        
        const textureFileName = plistData.metadata?.textureFileName || plistPath.replace(/\.plist$/i, '.png');
        const pngUrl = baseUrl + textureFileName;
        
        return new Promise((resolve, reject) => {
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
    });
    
    function processBaseTexture(baseTexture, frames) {
        for (const frameName in frames) {
            const frame = frames[frameName];
            let x = frame.x;
            let y = frame.y;
            let w = frame.width;
            let h = frame.height;
            
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
                const texture = new PIXI.Texture(baseTexture, rect);
                textures[frameName] = texture;
            }
        }
    }
    
    await Promise.all(loadPromises);
    return { json, textures };
}

/**
 * CocosStudioArmature renders and plays the skeletal animation in PixiJS.
 */
export class CocosStudioArmature extends PIXI.Container {
    constructor(json, textures) {
        super();
        this.json = json;
        this.textures = textures;
        this.bones = {};
        this.currentMovement = null;
        this.currentFrame = 0;
        this.playing = false;
        this.loop = true;
        this.animationScale = 1;
        this.elapsedTime = 0;
        
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
            
            // 2. Initialize Displays (Sprites)
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
        this.sortAllChildren();
    }
    
    stop() {
        this.playing = false;
    }
    
    update(dt) {
        if (!this.playing || !this.currentMovement) return;
        
        this.elapsedTime += dt;
        const fps = 60;
        let frame = this.elapsedTime * fps * this.animationScale;
        const duration = this.currentMovement.dr || 1;
        
        if (this.loop) {
            frame = frame % duration;
        } else {
            if (frame >= duration - 1) {
                frame = duration - 1;
                this.playing = false;
            }
        }
        
        this.currentFrame = frame;
        
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
            
            const prevA = (prevKey.color?.a !== undefined) ? prevKey.color.a / 255 : 1;
            const nextA = (nextKey.color?.a !== undefined) ? nextKey.color.a / 255 : 1;
            const dAlpha = prevA + t * (nextA - prevA);
            
            // Apply transformations with Y-flip logic
            bone.x = bone.setupX + dx;
            bone.y = -(bone.setupY + dy);
            bone.scale.set(
                bone.setupScaleX + dScaleX - 1,
                bone.setupScaleY + dScaleY - 1
            );
            bone.skew.set(
                bone.setupSkewX + dSkewX,
                -(bone.setupSkewY + dSkewY)
            );
            bone.alpha = dAlpha;
            
            const prevZ = prevKey.z ?? 0;
            const nextZ = nextKey.z ?? 0;
            const dZ = prevZ + t * (nextZ - prevZ);
            bone.zOrder = bone.setupZ + Math.round(dZ);
            
            const displayIndex = prevKey.dI;
            if (bone.displays) {
                for (let j = 0; j < bone.displays.length; j++) {
                    if (bone.displays[j]) {
                        bone.displays[j].visible = (j === displayIndex);
                    }
                }
            }
        }
        
        this.sortAllChildren();
    }
    
    getTweenPercent(ratio, twE) {
        if (twE === 0) return ratio; // Linear
        if (twE === 1) return (1 - Math.cos(ratio * Math.PI)) / 2; // Ease In Out
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
