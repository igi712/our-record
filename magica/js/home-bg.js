// js/home-bg.js — Home Background catalog loader, .ExportJson.gz loader & localStorage persistence.

import { loadCocosStudioAssets, loadCocosStudioFromLocalFiles, parsePlist } from '../../lib/cocos-to-pixi.js';
import { repoUrl } from './paths.js';

const CATALOG_URL = repoUrl('assets/bgCatalog.json');
const STORAGE_KEY = 'mrHomeBackground';

export const DEFAULT_HOME_BG_ID = 'home:web_0011';
export const DEFAULT_HOME_BG_FILE = 'web_0011.ExportJson';
export const DEFAULT_HOME_BGM_FILE = 'bgm01_anime07_hca.hca';

export const DEFAULT_HOME_BG = Object.freeze({
    id: DEFAULT_HOME_BG_ID,
    file: DEFAULT_HOME_BG_FILE,
    dir: 'web',
    label: 'Blue Skies (Default)',
    bgm: null,
    bgmFile: DEFAULT_HOME_BGM_FILE,
    isDefault: true
});

let catalogPromise = null;

function toHomeBgEntry(item) {
    const bgm = item.bgm || null;
    return {
        id: item.id,
        file: item.file,
        dir: item.dir || 'web',
        label: item.label || item.file,
        bgm,
        bgmFile: bgm ? `${bgm}_hca.hca` : DEFAULT_HOME_BGM_FILE,
        isDefault: item.id === DEFAULT_HOME_BG_ID
    };
}

export function loadHomeBackgroundList() {
    if (catalogPromise) return catalogPromise;

    catalogPromise = fetch(CATALOG_URL)
        .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then((json) => {
            const list = (json.home || [])
                .filter((item) => item && item.category === 'home' && item.kind === 'cocos')
                .map(toHomeBgEntry);
            if (!list.some((e) => e.id === DEFAULT_HOME_BG_ID)) {
                list.unshift({ ...DEFAULT_HOME_BG });
            }
            return list;
        })
        .catch((err) => {
            console.warn('[home-bg] Failed to load bgCatalog.json, falling back to default:', err);
            catalogPromise = null;
            return [{ ...DEFAULT_HOME_BG }];
        });

    return catalogPromise;
}

export function getSavedHomeBgId() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved || DEFAULT_HOME_BG_ID;
    } catch {
        return DEFAULT_HOME_BG_ID;
    }
}

export function saveHomeBgId(bgId) {
    const id = bgId || DEFAULT_HOME_BG_ID;
    try {
        if (id === DEFAULT_HOME_BG_ID) {
            localStorage.removeItem(STORAGE_KEY);
        } else {
            localStorage.setItem(STORAGE_KEY, id);
        }
    } catch (err) {
        console.warn('[home-bg] Failed to save home background id:', err);
    }
}

export async function resolveSavedHomeBackground() {
    const list = await loadHomeBackgroundList();
    const savedId = getSavedHomeBgId();
    return list.find((e) => e.id === savedId) || list[0] || { ...DEFAULT_HOME_BG };
}

async function fetchGzippedText(url) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status}`);
    const bytes = new Uint8Array(await resp.arrayBuffer());
    const isGzip = bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
    if (!isGzip) {
        return new TextDecoder().decode(bytes).replace(/\0+$/g, '').trim();
    }
    const ds = new DecompressionStream('gzip');
    const decompressed = new Blob([bytes]).stream().pipeThrough(ds);
    return (await new Response(decompressed).text()).replace(/\0+$/g, '').trim();
}

export async function loadCocosBackgroundAssets(exportJsonUrl) {
    if (!/\.gz$/i.test(exportJsonUrl)) {
        return loadCocosStudioAssets(exportJsonUrl);
    }

    const baseUrl = exportJsonUrl.substring(0, exportJsonUrl.lastIndexOf('/') + 1);
    const jsonName = exportJsonUrl.substring(exportJsonUrl.lastIndexOf('/') + 1).replace(/\.gz$/i, '');
    const jsonText = await fetchGzippedText(exportJsonUrl);
    const json = JSON.parse(jsonText);

    const plistPaths = (json.config_file_path || []).filter((p) => typeof p === 'string' && /\.plist$/i.test(p));
    const pngNames = new Set();

    const plistFiles = await Promise.all(plistPaths.map(async (plistPath) => {
        const resp = await fetch(baseUrl + plistPath);
        if (!resp.ok) throw new Error(`Failed to fetch ${baseUrl + plistPath}: ${resp.status}`);
        const xml = await resp.text();
        const parsed = parsePlist(xml);
        if (parsed?.frames) {
            pngNames.add(parsed.metadata?.textureFileName || plistPath.replace(/\.plist$/i, '.png'));
        } else if (!parsed?.textureImageData && parsed?.textureFileName) {
            pngNames.add(parsed.textureFileName);
        }
        return new File([xml], plistPath, { type: 'application/xml' });
    }));

    const pngFiles = (await Promise.all(Array.from(pngNames).map(async (pngName) => {
        const resp = await fetch(baseUrl + pngName);
        if (!resp.ok) return null;
        const blob = await resp.blob();
        return new File([blob], pngName, { type: 'image/png' });
    }))).filter(Boolean);

    const jsonFile = new File([jsonText], jsonName, { type: 'application/json' });
    return loadCocosStudioFromLocalFiles([jsonFile, ...plistFiles, ...pngFiles]);
}
