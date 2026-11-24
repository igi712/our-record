// magica/js/paths.js — Path helpers resolved from import.meta.url so modules
// work identically whether loaded from repo root (viewer.html) or magica/index.html.

export const MAGICA_ROOT = new URL('../', import.meta.url);
export const REPO_ROOT = new URL('../../', import.meta.url);

export function magicaUrl(relPath = '') {
    return new URL(String(relPath).replace(/^\/+/, ''), MAGICA_ROOT).href;
}

export function repoUrl(relPath = '') {
    return new URL(String(relPath).replace(/^\/+/, ''), REPO_ROOT).href;
}
