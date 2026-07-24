// js/view-loader.js — HTML view fragment loader and cacher

const templateCache = new Map();

export async function loadViewTemplate(path, targetContainerId) {
    let html = templateCache.get(path);
    if (!html) {
        try {
            const resp = await fetch(path);
            if (!resp.ok) {
                console.error(`[view-loader] Failed to fetch template at ${path}: ${resp.status}`);
                return false;
            }
            html = await resp.text();
            templateCache.set(path, html);
        } catch (err) {
            console.error(`[view-loader] Network error loading template ${path}:`, err);
            return false;
        }
    }

    const container = document.getElementById(targetContainerId);
    if (container) {
        // Append fragment if element not already mounted
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const firstChild = tempDiv.firstElementChild;
        if (firstChild && !document.getElementById(firstChild.id)) {
            container.appendChild(firstChild);
        }
        return true;
    }
    return false;
}
