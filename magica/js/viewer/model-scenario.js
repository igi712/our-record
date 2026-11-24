// Scenario resolution and dual-unit config helper.

import { scenarioCache } from './quotes-sequence.js';
import { buildModelId } from './model.js';

const SCENARIO_REMOTE_MARE_BASE = 'https://raw.githubusercontent.com/igi712/ma-re-data/main/resource/scenario/json/general';
const SCENARIO_LOCAL_MARE_BASE = new URL('../../../assets/ma-re-data/resource/scenario/json/general', import.meta.url).href;

let _scenarioPrimaryBase = null;
let _scenarioLocalMareAvailable = null;

export async function resolveScenarioBase() {
    if (!_scenarioPrimaryBase) {
        _scenarioPrimaryBase = 'https://raw.githubusercontent.com/Puella-Care/en-download/refs/heads/main/magica/resource/download/asset/master/resource/scenario/json/general';
    }
    return _scenarioPrimaryBase;
}

export async function resolveMaReScenarioBases() {
    const bases = [];

    if (_scenarioLocalMareAvailable === null) {
        try {
            const probeUrl = `${SCENARIO_LOCAL_MARE_BASE}/100100.json`;
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 2000);
            const resp = await fetch(probeUrl, { method: 'HEAD', cache: 'no-store', signal: controller.signal });
            clearTimeout(timer);
            _scenarioLocalMareAvailable = resp.ok;
        } catch (e) {
            _scenarioLocalMareAvailable = false;
        }
    }
    if (_scenarioLocalMareAvailable) {
        bases.push(SCENARIO_LOCAL_MARE_BASE);
    }

    bases.push(SCENARIO_REMOTE_MARE_BASE);

    return bases;
}

export async function fetchScenarioJson(pathSuffix) {
    if (scenarioCache.has(pathSuffix)) {
        return { json: scenarioCache.get(pathSuffix), url: pathSuffix };
    }

    const primaryBase = await resolveScenarioBase();
    const primaryUrl = `${primaryBase}/${pathSuffix}`;

    let resp = await fetch(primaryUrl).catch(() => null);
    if (resp && resp.ok) {
        const json = await resp.json();
        scenarioCache.set(pathSuffix, json);
        return { json, url: primaryUrl };
    }

    const fallbackBases = await resolveMaReScenarioBases();
    for (const base of fallbackBases) {
        const fallbackUrl = `${base}/${pathSuffix}`;
        console.info(`[scenario] Scenario not found at en-download, trying ma-re-data fallback: ${fallbackUrl}`);
        resp = await fetch(fallbackUrl).catch(() => null);
        if (resp && resp.ok) {
            const json = await resp.json();
            scenarioCache.set(pathSuffix, json);
            scenarioCache.set(fallbackUrl, json);
            return { json, url: fallbackUrl };
        }
    }

    return { json: null, url: primaryUrl };
}

async function checkUrlExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (e) {
        try {
            const resp = await fetch(url);
            return resp.ok;
        } catch {
            return false;
        }
    }
}

export async function checkScenarioUrlExists(pathSuffix) {
    const primaryBase = await resolveScenarioBase();
    const primaryUrl = `${primaryBase}/${pathSuffix}`;
    if (await checkUrlExists(primaryUrl)) return { url: primaryUrl, source: 'primary' };

    const fallbackBases = await resolveMaReScenarioBases();
    for (const base of fallbackBases) {
        const fallbackUrl = `${base}/${pathSuffix}`;
        if (await checkUrlExists(fallbackUrl)) return { url: fallbackUrl, source: 'ma-re-data' };
    }

    return null;
}

export async function getDualUnitConfig(charaId, live2dId) {
    const live2dIdStr = String(live2dId).padStart(2, '0');
    const defaultModelId = buildModelId(charaId, live2dIdStr);

    let scenarioJson = null;
    if (live2dIdStr === '00') {
        const fetchResult = await fetchScenarioJson(`${charaId}00.json`);
        if (fetchResult.json) scenarioJson = fetchResult.json;
    }

    const detectedModels = new Set([defaultModelId]);
    const coOccurringCount = new Map();
    const zOrderMap = new Map();
    if (scenarioJson && scenarioJson.story) {
        Object.values(scenarioJson.story).forEach(steps => {
            if (Array.isArray(steps)) {
                steps.forEach(step => {
                    if (Array.isArray(step.chara)) {
                        const stepIds = [];
                        step.chara.forEach(c => {
                            if (c.id != null) {
                                const idStr = String(c.id);
                                stepIds.push(idStr);
                                detectedModels.add(idStr);
                                if (typeof c.zOrder === 'number') {
                                    zOrderMap.set(idStr, c.zOrder);
                                    if (typeof c.pos === 'number') {
                                        zOrderMap.set(`pos_${c.pos}`, c.zOrder);
                                    }
                                }
                            }
                        });
                        if (stepIds.includes(defaultModelId)) {
                            stepIds.forEach(idStr => {
                                if (idStr !== defaultModelId && idStr.startsWith(String(charaId))) {
                                    coOccurringCount.set(idStr, (coOccurringCount.get(idStr) || 0) + 1);
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    const modelIdList = Array.from(detectedModels);
    let secondaryId = null;
    let secondaryCooccur = 0;
    for (const [idStr, count] of coOccurringCount) {
        if (count > secondaryCooccur) {
            secondaryCooccur = count;
            secondaryId = idStr;
        }
    }
    const isDual = (live2dIdStr === '00' && secondaryId !== null);

    if (!isDual) {
        return {
            isDual: false,
            defaultModelId,
            modelIdList
        };
    }

    const primaryId = defaultModelId;
    const primaryZOrder = zOrderMap.get(String(primaryId)) ?? zOrderMap.get('pos_0') ?? 0;
    const secondaryZOrder = zOrderMap.get(String(secondaryId)) ?? zOrderMap.get('pos_1') ?? 0;

    return {
        isDual: true,
        primaryId,
        secondaryId,
        primaryZOrder,
        secondaryZOrder,
        modelIdList
    };
}
