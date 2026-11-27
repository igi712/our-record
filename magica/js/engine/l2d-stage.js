// magica/js/engine/l2d-stage.js — Shared Live2D stage, metadata, placement, scenario playback, and outfit swaps.

import { loadModel, loadAdditionalModel, destroyCurrentModels, state, getOutfitsForCharacter, buildModelId, findDefaultExpression } from '../viewer/model.js';
import { preloadModelToRam, ramFolderCache } from '../viewer/model-assets.js';
import { ScenarioSequencePlayer, scenarioCache } from '../viewer/quotes-sequence.js';
import { fetchScenarioJson, checkScenarioUrlExists, getDualUnitConfig } from '../viewer/model-scenario.js';
import { repoUrl } from '../paths.js';
import { getHcaRuntime, getVoiceVolume, onVoiceVolumeChange, startSe, stopSfx } from './audio.js';
import { playTransformVfx, stopVfx } from './vfx.js';

export const WORLD_W = 1024;
export const WORLD_H = 768;
export const HOME16_H = 576;
export const DEFAULT_CHARA_ID = 1001;
export const HOME_X_OFFSET = -132;
export const BG_SET_X_OFFSET = -162;
export const COLLECTION_TOP_X_OFFSET = -192;

const OUTFIT_SFX_REL = 'jingle/7205_magic_girl_hca.hca';

export const CAMERA_SINGLE_PRESETS = [
    { x: 512, subLeft: 507 },
    { x: 674, subLeft: 669 },
    { x: 836, subLeft: 669 },
    { x: 188, subLeft: 345 },
    { x: 350, subLeft: 345 }
];

export const CAMERA_DUAL_PRESETS = [
    { dualX: [396, 632], subLeft: 507 },
    { dualX: [516, 752], subLeft: 627 },
    { dualX: [636, 872], subLeft: 747 },
    { dualX: [156, 392], subLeft: 267 },
    { dualX: [276, 512], subLeft: 387 },
    { dualX: [316, 672], subLeft: 507 },
    { dualX: [286, 742], subLeft: 507 },
    { dualX: [216, 808], subLeft: 507 }
];

let scenarioPlayer = null;
let activeVoicePrefix = '00';
let activeScenarioUrl = '';
let outfitChangeToken = 0;
let modelFadeToken = 0;

let charaAttributes = {};
let charaAttributesLoaded = false;
let metadataPromise = null;

const stageCtx = {
    mode: 'detail', // 'home' | 'bgSet' | 'camera' | 'detail'
    menuClosed: false,
    portrait: false,
    cameraPresetIndex: 0,
    cameraWearOpen: false
};

export function getScenarioPlayer() {
    if (!scenarioPlayer) {
        scenarioPlayer = new ScenarioSequencePlayer({
            controller: null,
            subtitleElement: document.getElementById('subtitle'),
            getHcaRuntime,
            getVoiceVolume
        });
        onVoiceVolumeChange((level) => scenarioPlayer?.setVolume(level));
        window.scenarioPlayer = scenarioPlayer;
    }
    return scenarioPlayer;
}

export function stopVoice() {
    scenarioPlayer?.stop();
}

export function resumeVoiceAudio() {
    scenarioPlayer?.resumeAudio();
}

export function getActiveScenario() {
    return { activeVoicePrefix, activeScenarioUrl };
}

export function setStageContext(patch = {}) {
    Object.assign(stageCtx, patch);
}

export function getStageContext() {
    return { ...stageCtx };
}

export function setStageXOffset(xOffset) {
    const config = window.__QUOTES_CONFIG || (window.__QUOTES_CONFIG = {});
    config.viewMode = 'dynamic';
    config.xOffset = xOffset;
}

export async function loadCharaAttributes() {
    if (charaAttributesLoaded) return charaAttributes;
    try {
        const resp = await fetch(repoUrl('assets/charaAttributes.json'));
        if (resp.ok) {
            charaAttributes = await resp.json();
            charaAttributesLoaded = true;
        }
    } catch (e) {
        console.warn('[l2d-stage] failed to load charaAttributes.json:', e);
    }
    return charaAttributes;
}

export function getCharaAttributes() {
    return charaAttributes;
}

export function ensureMetadataLoaded() {
    if (metadataPromise) return metadataPromise;
    metadataPromise = (async () => {
        try {
            const [charaResponse, live2dResponse] = await Promise.all([
                fetch('https://raw.githubusercontent.com/Puella-Care/en-data/refs/heads/main/charaList.json'),
                fetch('https://raw.githubusercontent.com/Puella-Care/en-data/refs/heads/main/live2dList.json')
            ]);

            const [registeredChars, registeredLive2d] = await Promise.all([
                charaResponse.json(),
                live2dResponse.json()
            ]);

            let missingChars = [];
            let missingLive2d = [];
            try {
                const [missingCharsResponse, missingLive2dResponse] = await Promise.all([
                    fetch(repoUrl('assets/missingCharaList.json')),
                    fetch(repoUrl('assets/missingLive2dList.json'))
                ]);
                if (missingCharsResponse.ok) missingChars = await missingCharsResponse.json();
                if (missingLive2dResponse.ok) missingLive2d = await missingLive2dResponse.json();
            } catch {}

            const registeredCharIds = new Set(registeredChars.map((c) => Number(c.id)));
            const registeredLive2dKeys = new Set(
                registeredLive2d.map((o) => `${Number(o.charaId)}-${String(o.live2dId).padStart(2, '0')}`)
            );

            const appendedChars = missingChars.filter((c) => !registeredCharIds.has(Number(c.id)));
            const appendedLive2d = missingLive2d.filter(
                (o) => !registeredLive2dKeys.has(`${Number(o.charaId)}-${String(o.live2dId).padStart(2, '0')}`)
            );

            state.charaListData = registeredChars.concat(appendedChars);
            state.live2dListData = registeredLive2d.concat(appendedLive2d);
            state.registeredLive2dKeys = registeredLive2dKeys;
        } catch (e) {
            metadataPromise = null;
            throw e;
        }
    })();
    return metadataPromise;
}

export function getHomeOutfits(charaId = state.currentCharacterId || DEFAULT_CHARA_ID) {
    const outfits = getOutfitsForCharacter(charaId);
    const keys = state.registeredLive2dKeys;
    if (!keys) return outfits;
    return outfits.filter((o) =>
        keys.has(`${Number(charaId)}-${String(o.live2dId).padStart(2, '0')}`)
    );
}

export function resolveActivePlacement(isDual) {
    if (stageCtx.mode === 'camera') {
        if (stageCtx.cameraWearOpen) {
            return isDual ? { dualX: [184, 420] } : { singleX: 350 };
        }
        if (isDual) {
            const preset = CAMERA_DUAL_PRESETS[stageCtx.cameraPresetIndex % CAMERA_DUAL_PRESETS.length];
            return { dualX: preset.dualX };
        }
        const preset = CAMERA_SINGLE_PRESETS[stageCtx.cameraPresetIndex % CAMERA_SINGLE_PRESETS.length];
        return { singleX: preset.x };
    }
    if (stageCtx.mode === 'bgSet') {
        return isDual ? { dualX: [164, 420] } : { singleX: 350 };
    }
    if (stageCtx.mode === 'collectionTop') {
        return isDual ? { dualX: [180, 416] } : { singleX: 320 };
    }
    if (stageCtx.mode === 'home') {
        if (stageCtx.portrait) {
            return { portrait: true, singleX: 512, dualX: [512, 512] };
        }
        if (stageCtx.menuClosed) {
            return isDual ? { dualX: [396, 632] } : { singleX: 512 };
        }
        return isDual ? { dualX: [244, 480] } : { singleX: 380 };
    }
    return isDual ? { dualX: [104, 320] } : { singleX: 250 };
}

export function applySubtitlePlacement({ isDual = state.dualMode, presetIndex } = {}) {
    const sub = document.getElementById('subtitle');
    if (!sub) return;
    if (stageCtx.mode === 'camera') {
        const list = isDual ? CAMERA_DUAL_PRESETS : CAMERA_SINGLE_PRESETS;
        const idx = (presetIndex ?? stageCtx.cameraPresetIndex) % list.length;
        sub.style.fontSize = '18px';
        sub.style.top = '';
        sub.style.transform = '';
        sub.style.left = `${list[idx].subLeft}px`;
        return;
    }
    if (stageCtx.mode === 'home') {
        if (stageCtx.portrait) {
            const viewH = window.VIEWPORT?.viewH || HOME16_H;
            sub.style.fontSize = '19px';
            sub.style.left = '710px';
            sub.style.top = `${viewH / 2}px`;
            sub.style.transform = 'translate(-50%, -50%) rotate(270deg)';
            return;
        }
        sub.style.fontSize = '19px';
        sub.style.top = '';
        sub.style.transform = '';
        sub.style.left = stageCtx.menuClosed ? '507px' : (isDual ? '362px' : '377px');
        return;
    }
    sub.style.fontSize = '';
    sub.style.left = '';
    sub.style.top = '';
    sub.style.transform = '';
}

export function applyPortraitModelTransform(model, posIndex, isDual) {
    if (!model) return;
    const params = model.__mrPlacement?.params || {};
    const heightParam = Number(params.height ?? 0);
    const viewH = window.VIEWPORT?.viewH || HOME16_H;
    const viewTop = window.VIEWPORT?.viewTop ?? ((WORLD_H - viewH) / 2);
    const aspect = WORLD_W / viewH;
    const portraitFactor = Math.min(2.0, 1.3 * aspect);
    const portraitScale = (portraitFactor / 1.3) * 0.85;
    if (!model.__mrBaseScale) {
        model.__mrBaseScale = model.scale.x;
    }
    model.rotation = -Math.PI / 2;
    model.scale.set(model.__mrBaseScale * portraitScale);
    model.x = (WORLD_W / 2) - (heightParam + 35) * portraitFactor * aspect;
    model.y = isDual
        ? viewTop + (posIndex === 0 ? 0.75 * viewH : 0.25 * viewH)
        : (WORLD_H / 2);
}

function modelFadeFilter(model) {
    let filter = (model.filters ?? []).find((f) => f instanceof PIXI.filters.AlphaFilter) ?? null;
    if (!filter) {
        filter = new PIXI.filters.AlphaFilter(model.alpha ?? 1);
        filter.resolution = window.app?.renderer?.resolution ?? 1;
        // Live2DModel.getBounds() only covers the Cubism canvas rect, which clips wide
        // parts (e.g. Devil Homura's wings) while a filter is active. Use the full screen.
        if (window.app?.screen) model.filterArea = window.app.screen;
        model.filters = [...(model.filters ?? []), filter];
    }
    return filter;
}

export function setModelFadeAlpha(model, alpha) {
    if (!model) return;
    modelFadeFilter(model).alpha = alpha;
}

export function cancelModelFades() {
    modelFadeToken++;
}

export function fadeModelTo(model, ms, toAlpha, onDone, onCancel) {
    if (!model || model.destroyed) {
        if (onCancel) onCancel();
        return;
    }
    const filter = modelFadeFilter(model);
    const token = modelFadeToken;
    const from = filter.alpha;
    const start = performance.now();
    const tick = () => {
        if (!model || model.destroyed || token !== modelFadeToken) {
            if (onCancel) onCancel();
            return;
        }
        const t = Math.min(1, (performance.now() - start) / ms);
        const eased = 1 - Math.pow(1 - t, 3);
        filter.alpha = from + (toAlpha - from) * eased;
        if (t < 1) {
            requestAnimationFrame(tick);
        } else {
            filter.alpha = toAlpha;
            if (toAlpha >= 1) {
                const fl = model.filters;
                if (fl) {
                    const remaining = fl.filter((f) => f !== filter);
                    model.filters = remaining.length ? remaining : null;
                    if (!remaining.length) model.filterArea = null;
                }
            }
            if (onDone) onDone();
        }
    };
    tick();
}

export function destroyStageModels() {
    destroyCurrentModels();
}

export function getActiveModelEntries() {
    const targets = Array.from(new Set(
        Array.from(state.currentModels.values()).map((e) => e && e.model).filter(Boolean)
    ));
    if (targets.length === 0 && state.currentModel) targets.push(state.currentModel);
    return targets;
}

export function hasActiveStageModels() {
    return getActiveModelEntries().some((m) => m && !m.destroyed && m.visible);
}

export function clearStageModels() {
    stopVoice();
    cancelOutfitChanges();
    cancelModelFades();
    destroyStageModels();
}

export function stopTransformationEffects() {
    stopSfx();
    stopVfx();
}

export function cancelOutfitChanges() {
    outfitChangeToken++;
    stopTransformationEffects();
}

export function getOutfitChangeToken() {
    return outfitChangeToken;
}

export function bumpOutfitChangeToken() {
    return ++outfitChangeToken;
}

export async function loadScenarioForOutfit(charaId, live2dId, changeToken) {
    const live2dIdStr = String(live2dId).padStart(2, '0');
    const pathSuffix = `${charaId}${live2dIdStr}.json`;

    let scenarioUrl = null;
    let scenarioJson = null;
    let voicePrefix = null;

    if (live2dIdStr !== '00') {
        const result = await checkScenarioUrlExists(pathSuffix);
        if (result) {
            voicePrefix = live2dIdStr;
            scenarioUrl = result.url;
            const cached = scenarioCache.get(scenarioUrl);
            if (cached) {
                scenarioJson = cached;
            } else {
                const fetchResult = await fetchScenarioJson(pathSuffix);
                if (fetchResult.json) {
                    scenarioJson = fetchResult.json;
                    scenarioUrl = fetchResult.url;
                    scenarioCache.set(scenarioUrl, scenarioJson);
                }
            }
        }
    }

    if (!scenarioJson) {
        voicePrefix = '00';
        const fetchResult = await fetchScenarioJson(`${charaId}00.json`);
        if (fetchResult.json) {
            scenarioJson = fetchResult.json;
            scenarioUrl = fetchResult.url;
            scenarioCache.set(scenarioUrl, scenarioJson);
        }
    }

    if (changeToken !== undefined && changeToken !== outfitChangeToken) return null;

    activeVoicePrefix = voicePrefix;
    activeScenarioUrl = scenarioUrl;
    return { scenarioJson, scenarioUrl, voicePrefix };
}

export async function loadOutfitModels(
    charaId,
    live2dId,
    token,
    allowedExpressions = null,
    allowedMotions = null,
    placementOverride = null,
    { startHidden = false, showConnecting = true } = {}
) {
    destroyCurrentModels();

    const dualConfig = await getDualUnitConfig(charaId, live2dId);
    state.dualMode = dualConfig.isDual;
    const placement = placementOverride || resolveActivePlacement(dualConfig.isDual);
    const seqPlayer = getScenarioPlayer();

    if (dualConfig.isDual) {
        const { primaryId, secondaryId, primaryZOrder, secondaryZOrder } = dualConfig;
        const xOverride = placement.dualX || [104, 320];

        const preloadTasks = [];
        if (!ramFolderCache.has(primaryId)) {
            preloadTasks.push(preloadModelToRam(primaryId, { allowedExpressions, allowedMotions, showConnecting }));
        }
        if (!ramFolderCache.has(secondaryId)) {
            preloadTasks.push(preloadModelToRam(secondaryId, { allowedExpressions, allowedMotions, showConnecting }));
        }
        if (preloadTasks.length > 0) {
            await Promise.all(preloadTasks);
            if (token !== undefined && token !== outfitChangeToken) return false;
        }

        await loadModel(primaryId, {
            interactive: false,
            allowedExpressions,
            allowedMotions,
            xOverride: xOverride[0],
            zOrder: primaryZOrder,
            deferReveal: true,
            showConnecting
        });
        if (token !== undefined && token !== outfitChangeToken) {
            destroyCurrentModels();
            return false;
        }

        const secondaryResult = await loadAdditionalModel(secondaryId, {
            interactive: false,
            allowedExpressions,
            allowedMotions,
            xOverride: xOverride[1],
            zOrder: secondaryZOrder,
            deferReveal: true,
            showConnecting
        });
        if (token !== undefined && token !== outfitChangeToken) {
            destroyCurrentModels();
            return false;
        }

        await new Promise((resolve) => requestAnimationFrame(resolve));
        if (token !== undefined && token !== outfitChangeToken) {
            destroyCurrentModels();
            return false;
        }

        if (placement.portrait) {
            applyPortraitModelTransform(state.currentModel, 0, true);
            applyPortraitModelTransform(secondaryResult?.model, 1, true);
        }

        const controllersMap = new Map();
        controllersMap.set(String(primaryId), state.currentController);
        controllersMap.set(Number(primaryId), state.currentController);
        controllersMap.set(0, state.currentController);
        controllersMap.set('pos_0', state.currentController);

        controllersMap.set(String(secondaryId), secondaryResult.controller);
        controllersMap.set(Number(secondaryId), secondaryResult.controller);
        controllersMap.set(1, secondaryResult.controller);
        controllersMap.set('pos_1', secondaryResult.controller);

        state.currentModels.set(primaryId, { model: state.currentModel, controller: state.currentController, pos: 0 });
        state.currentModels.set(secondaryId, { model: secondaryResult.model, controller: secondaryResult.controller, pos: 1 });

        seqPlayer.setControllers(controllersMap, state.currentController);
        applySubtitlePlacement({ isDual: true });
        if (!startHidden) {
            if (state.currentModel) state.currentModel.visible = true;
            if (secondaryResult?.model) secondaryResult.model.visible = true;
        }
        return true;
    }

    const modelId = buildModelId(charaId, live2dId);
    await loadModel(modelId, {
        interactive: false,
        allowedExpressions,
        allowedMotions,
        xOverride: placement.singleX,
        deferReveal: startHidden,
        showConnecting
    });
    if (token !== undefined && token !== outfitChangeToken) {
        destroyCurrentModels();
        return false;
    }

    if (placement.portrait) {
        applyPortraitModelTransform(state.currentModel, 0, false);
    }

    state.currentModels.set(modelId, { model: state.currentModel, controller: state.currentController, pos: 0 });
    const controllersMap = new Map();
    controllersMap.set(String(modelId), state.currentController);
    controllersMap.set(Number(modelId), state.currentController);
    seqPlayer.setControllers(controllersMap, state.currentController);

    applySubtitlePlacement({ isDual: false });
    if (!startHidden && state.currentModel) state.currentModel.visible = true;
    return true;
}

export async function performOutfitSwap(
    charaId,
    live2dId,
    {
        token = ++outfitChangeToken,
        vfxDefaultX = 250,
        skipVfxIfDual = false,
        applyDefaultMotionAndFace = false,
        showConnecting = true,
        onScenarioLoaded = null
    } = {}
) {
    const l2d = String(live2dId).padStart(2, '0');
    const modelId = buildModelId(charaId, l2d);

    stopVoice();
    const scenarioPromise = loadScenarioForOutfit(charaId, l2d, token);

    let isDualUnit = false;
    if (skipVfxIfDual) {
        isDualUnit = state.dualMode
            || (await getDualUnitConfig(charaId, l2d)).isDual
            || (await getDualUnitConfig(charaId, '00')).isDual;
    }

    await preloadModelToRam(modelId, { showConnecting });
    if (token !== outfitChangeToken) return false;

    if (!skipVfxIfDual || !isDualUnit) {
        startSe(OUTFIT_SFX_REL, { trackAsSfx: true });
        playTransformVfx(state.currentModel?.x ?? vfxDefaultX);
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (token !== outfitChangeToken) return false;
    }

    const loadedOk = await loadOutfitModels(charaId, l2d, token, null, null, null, { showConnecting });
    if (!loadedOk || token !== outfitChangeToken) return false;

    if (applyDefaultMotionAndFace) {
        let bestExpression = null;
        const fileList = ramFolderCache.get(modelId);
        if (fileList) {
            const jsonFile = fileList.find((f) => f.webkitRelativePath === 'model.model3.json');
            if (jsonFile) {
                const modelJson = JSON.parse(await jsonFile.text());
                bestExpression = findDefaultExpression(modelJson?.FileReferences?.Expressions ?? []);
            }
        }
        const seqPlayer = getScenarioPlayer();
        const activeControllers = seqPlayer.controllers?.size > 0
            ? Array.from(new Set(seqPlayer.controllers.values()))
            : (state.currentController ? [state.currentController] : []);
        activeControllers.forEach((ctrl) => {
            if (!ctrl) return;
            if (bestExpression && typeof ctrl.setExpressionByName === 'function') {
                ctrl.setExpressionByName(bestExpression);
            }
            const motionIndex = ctrl.motionIndexByNumber?.get(0) ?? 0;
            try { ctrl.startMotion(ctrl.defaultMotionGroup, motionIndex); } catch {}
        });
    }

    const scenarioData = await scenarioPromise;
    if (token !== outfitChangeToken) return false;
    if (onScenarioLoaded && scenarioData) {
        onScenarioLoaded(scenarioData);
    }
    return true;
}
