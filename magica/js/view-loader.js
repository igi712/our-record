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
        // Append each top-level element if not already mounted. Views may have
        // multiple roots (GlobalMenu renders #globalMenu + #sideMenu), so the
        // whole top-level fragment is mounted rather than just the first child.
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const roots = Array.from(tempDiv.children);
        let mounted = false;
        for (const child of roots) {
            if (!child.id || !document.getElementById(child.id)) {
                container.appendChild(child);
                mounted = true;
            }
        }
        return mounted;
    }
    return false;
}
