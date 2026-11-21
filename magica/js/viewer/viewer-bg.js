// Background selector modal and dynamic Pixi stage background controller.

import { resolveMaReAssetsBase, showToast } from './model.js';
import { setAssetPreloadConnecting } from './model-assets.js';
import { loadCocosStudioAssets, CocosStudioArmature } from '../../../lib/cocos-to-pixi.js';

const CATALOG_URL = 'assets/bgCatalog.json';
const DEFAULT_BG_ID = 'home:web_0011';
const FALLBACK_BG_ID = 'solid:gray';
const WORLD_W = 1024;
const WORLD_H = 768;
const INITIAL_LIMIT = 40;
const LOAD_MORE_STEP = 80;

let catalogPromise = null;
let imageNativeBasePromise = null;

let activeBgId = DEFAULT_BG_ID;
let pendingBgId = DEFAULT_BG_ID;
let bgLoadToken = 0;

let currentBgNode = null;
let currentBgKind = null;
let currentBgTicker = null;

let activeCategory = 'all';
let searchQuery = '';
let searchTimer = null;
let lastFocusedEl = null;

let thumbObserver = null;
let moreObserver = null;

const recordsById = new Map();
const recordsBySection = { solid: [], story: [], home: [] };
const sectionLimits = { solid: Infinity, story: INITIAL_LIMIT, home: INITIAL_LIMIT };
const sheetImageCache = new Map();

export function isBackgroundModalOpen() {
    const modal = document.getElementById('bgSelectorModal');
    return Boolean(modal && !modal.hidden);
}

function getImageNativeBase() {
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

function buildSearchText(entry, key) {
    if (key === 'solid') return `${entry.label} ${entry.hex} ${entry.id}`.toLowerCase();
    if (key === 'story') return `${entry.label} ${entry.file} ${entry.groupPrefix || ''} ${entry.variant || ''}`.toLowerCase();
    return `${entry.label} ${entry.subLabel || ''} ${entry.file} ${entry.dir || ''}`.toLowerCase();
}

function loadCatalog() {
    if (catalogPromise) return catalogPromise;

    catalogPromise = fetch(CATALOG_URL)
        .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then((json) => {
            recordsById.clear();
            recordsBySection.solid = [];
            recordsBySection.story = [];
            recordsBySection.home = [];

            for (const key of ['solid', 'story', 'home']) {
                for (const item of json[key] || []) {
                    const entry = { ...item, sectionKey: key };
                    const record = {
                        id: entry.id,
                        entry,
                        sectionKey: key,
                        searchText: buildSearchText(entry, key),
                        cardEl: null
                    };
                    recordsById.set(entry.id, record);
                    recordsBySection[key].push(record);
                }
            }
            return json;
        })
        .catch((err) => {
            catalogPromise = null;
            throw err;
        });

    return catalogPromise;
}

function loadHtmlImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        if (/^https?:\/\//i.test(url) && !url.startsWith(window.location.origin)) {
            img.crossOrigin = 'anonymous';
        }
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
    });
}

function getCachedSheetImage(url) {
    if (!sheetImageCache.has(url)) {
        const p = loadHtmlImage(url).catch((err) => {
            sheetImageCache.delete(url);
            throw err;
        });
        sheetImageCache.set(url, p);
    }
    return sheetImageCache.get(url);
}

function clearCurrentSceneBg() {
    if (currentBgTicker && window.app?.ticker) {
        try {
            window.app.ticker.remove(currentBgTicker);
        } catch {}
    }
    currentBgTicker = null;

    if (currentBgNode) {
        try {
            if (typeof currentBgNode.stop === 'function') {
                currentBgNode.stop();
            }
            if (currentBgNode.parent) {
                currentBgNode.parent.removeChild(currentBgNode);
            }
            if (currentBgKind === 'story' || currentBgKind === 'home-jpg') {
                // Release GPU baseTexture created specifically for this background image.
                currentBgNode.destroy({ children: true, texture: true, baseTexture: true });
            } else {
                // Keep shared BaseTextureCache entries intact across repeat Cocos loads.
                currentBgNode.destroy({ children: true });
            }
        } catch (err) {
            console.warn('[viewer-bg] Teardown failed:', err);
        }
        currentBgNode = null;
    }
    currentBgKind = null;
}

function applyMovementScale(armature) {
    // Respect Cocos movementData.scale (mov.sc) so bone timelines run at authored FPS while particles keep real-time dt.
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

async function applyBackground(entry, previousBgId) {
    if (!entry) return;
    const token = ++bgLoadToken;

    if (entry.sectionKey === 'solid' || typeof entry.color === 'number') {
        clearCurrentSceneBg();
        window.setViewerBackgroundState?.({ type: 'solid', color: entry.color });
        return;
    }

    const sceneBgContainer = window.sceneBgContainer;
    if (!sceneBgContainer) {
        console.warn('[viewer-bg] window.sceneBgContainer is missing');
        return;
    }

    setAssetPreloadConnecting(true);
    try {
        const imageNativeBase = await getImageNativeBase();
        if (token !== bgLoadToken) return;

        if (entry.sectionKey === 'story' || entry.kind === 'jpg') {
            const isStory = entry.sectionKey === 'story';
            const imgUrl = isStory
                ? `${imageNativeBase}/bg/story/${entry.file}`
                : `${imageNativeBase}/bg/${entry.dir}/${entry.file}`;

            const img = await loadHtmlImage(imgUrl);
            if (token !== bgLoadToken) return;

            const tex = new PIXI.Texture(new PIXI.BaseTexture(img));
            const sprite = new PIXI.Sprite(tex);
            sprite.anchor.set(0.5, 0.5);
            sprite.position.set(WORLD_W / 2, WORLD_H / 2);
            if (tex.width > 0 && tex.height > 0) {
                sprite.scale.set(Math.max(WORLD_W / tex.width, WORLD_H / tex.height));
            }

            clearCurrentSceneBg();
            sceneBgContainer.addChild(sprite);
            currentBgNode = sprite;
            currentBgKind = isStory ? 'story' : 'home-jpg';

            window.setViewerBackgroundState?.({ type: isStory ? 'story' : 'home', color: 0x000000 });
            return;
        }

        if (entry.kind === 'cocos') {
            const assets = await loadCocosStudioAssets(`${imageNativeBase}/bg/${entry.dir}/${entry.file}`);
            if (token !== bgLoadToken) return;

            const armature = new CocosStudioArmature(assets.json, assets.textures, assets.particles);
            armature.x = WORLD_W / 2;
            armature.y = WORLD_H / 2;

            const movData = assets.json?.animation_data?.[0]?.mov_data || [];
            if (movData.length > 0) {
                const hasAction = movData.some((m) => m && m.name === 'action');
                armature.play(hasAction ? 'action' : 0, true);
                applyMovementScale(armature);
                armature.update(0);
            }

            clearCurrentSceneBg();
            sceneBgContainer.addChild(armature);
            currentBgNode = armature;
            currentBgKind = 'home-cocos';

            currentBgTicker = (delta) => {
                if (currentBgNode === armature) {
                    armature.update(delta / 60);
                }
            };
            window.app?.ticker?.add(currentBgTicker);
            window.setViewerBackgroundState?.({ type: 'home', color: 0x000000 });
        }
    } catch (err) {
        console.error('[viewer-bg] Failed to load background:', entry.id, err);
        if (token === bgLoadToken && previousBgId) {
            activeBgId = previousBgId;
            if (isBackgroundModalOpen()) syncSelection();
        }
        showToast('Failed to load background: ' + (entry.label || entry.id));
    } finally {
        setAssetPreloadConnecting(false);
    }
}

function drawPlistCropThumb(canvas, img, thumb) {
    const cw = canvas.width;
    const ch = canvas.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, cw, ch);

    const { x, y, w, h, rot } = thumb;
    const logicalW = rot ? h : w;
    const logicalH = rot ? w : h;
    if (!logicalW || !logicalH) return;

    const scale = Math.max(cw / logicalW, ch / logicalH);
    ctx.save();
    ctx.translate(cw / 2, ch / 2);
    if (rot) ctx.rotate(-Math.PI / 2);
    ctx.drawImage(img, x, y, w, h, (-w * scale) / 2, (-h * scale) / 2, w * scale, h * scale);
    ctx.restore();
}

function getThumbDescriptor(entry) {
    if (entry.sectionKey === 'story') {
        return { type: 'story', file: entry.file };
    }
    return entry.thumb || null;
}

async function loadCardThumbnail(record) {
    const { entry, cardEl } = record;
    const thumb = getThumbDescriptor(entry);
    if (!thumb || !cardEl) return;
    if (cardEl.dataset.thumbLoaded === '1' || cardEl.dataset.thumbLoading === '1') return;
    cardEl.dataset.thumbLoading = '1';

    try {
        const imageNativeBase = await getImageNativeBase();

        if (thumb.type === 'story' || thumb.type === 'webJpg') {
            const imgEl = cardEl.querySelector('img.bg-thumb-img');
            if (!imgEl) return;
            const thumbUrl = thumb.type === 'story'
                ? `${imageNativeBase}/bg/story/${thumb.file}`
                : `${imageNativeBase}/bg/web/${thumb.file}`;

            await new Promise((resolve, reject) => {
                imgEl.onload = () => resolve();
                imgEl.onerror = () => reject(new Error(`Failed thumbnail: ${thumbUrl}`));
                imgEl.src = thumbUrl;
            });
            cardEl.dataset.thumbLoaded = '1';
            thumbObserver?.unobserve(cardEl);
        } else if (thumb.type === 'plistCrop') {
            const canvas = cardEl.querySelector('canvas.bg-thumb-canvas');
            if (!canvas) return;
            const img = await getCachedSheetImage(`${imageNativeBase}/bg/${entry.dir}/${thumb.file}`);
            drawPlistCropThumb(canvas, img, thumb);
            cardEl.dataset.thumbLoaded = '1';
            thumbObserver?.unobserve(cardEl);
        }
    } catch {
        cardEl.dataset.thumbLoaded = 'error';
        thumbObserver?.unobserve(cardEl);
    } finally {
        delete cardEl.dataset.thumbLoading;
    }
}

function setupObservers(modalBody) {
    if (!thumbObserver) {
        if (typeof IntersectionObserver !== 'function') {
            thumbObserver = {
                observe(el) {
                    const rec = recordsById.get(el.dataset.bgId);
                    if (rec && el.isConnected) loadCardThumbnail(rec);
                },
                unobserve() {}
            };
        } else {
            thumbObserver = new IntersectionObserver(
                (entries) => {
                    for (const item of entries) {
                        if (!item.isIntersecting || !item.target.isConnected) continue;
                        const rec = recordsById.get(item.target.dataset.bgId);
                        if (rec) loadCardThumbnail(rec);
                    }
                },
                { root: modalBody, rootMargin: '200px 0px', threshold: 0.01 }
            );
        }
    }

    if (!moreObserver && typeof IntersectionObserver === 'function') {
        moreObserver = new IntersectionObserver(
            (entries) => {
                for (const item of entries) {
                    if (!item.isIntersecting) continue;
                    const key = item.target.dataset.sectionKey;
                    // Auto-load next batch on scroll only when viewing a single category.
                    if (key && activeCategory === key) {
                        expandSection(key, LOAD_MORE_STEP);
                    }
                }
            },
            { root: modalBody, rootMargin: '240px 0px', threshold: 0.01 }
        );
    }
}

function getOrCreateCard(record) {
    if (record.cardEl) return record.cardEl;

    const { entry, sectionKey } = record;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'bg-card';
    btn.dataset.bgId = entry.id;

    const idInfo = sectionKey === 'solid'
        ? entry.hex
        : (entry.subLabel || entry.file.replace(/\.(exportjson|jpg)$/i, ''));
    btn.title = idInfo ? `${entry.label} (${idInfo})` : entry.label;

    const thumbEl = document.createElement('span');
    thumbEl.className = 'bg-thumb';

    if (sectionKey === 'solid') {
        const swatch = document.createElement('span');
        swatch.className = 'bg-swatch';
        swatch.style.backgroundColor = entry.hex;
        thumbEl.appendChild(swatch);
        btn.dataset.thumbLoaded = '1';
    } else if (entry.thumb?.type === 'plistCrop') {
        const canvas = document.createElement('canvas');
        canvas.className = 'bg-thumb-canvas';
        canvas.width = 160;
        canvas.height = 120;
        thumbEl.appendChild(canvas);
    } else {
        const img = document.createElement('img');
        img.className = 'bg-thumb-img';
        img.alt = '';
        img.decoding = 'async';
        thumbEl.appendChild(img);
    }

    const labelEl = document.createElement('span');
    labelEl.className = 'bg-card-label';
    labelEl.textContent = entry.label;

    btn.appendChild(thumbEl);
    btn.appendChild(labelEl);
    record.cardEl = btn;
    return btn;
}

function getFilteredRecords(key) {
    const tokens = String(searchQuery || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
    const list = recordsBySection[key] || [];
    if (tokens.length === 0) return list;
    return list.filter((rec) => tokens.every((t) => rec.searchText.includes(t)));
}

function expandSection(key, delta) {
    const matched = getFilteredRecords(key);
    const current = sectionLimits[key] ?? INITIAL_LIMIT;
    if (current >= matched.length) return;
    sectionLimits[key] = current + delta;
    renderSections();
    syncSelection();
}

function syncSelection() {
    for (const rec of recordsById.values()) {
        if (!rec.cardEl) continue;
        const selected = rec.id === pendingBgId;
        rec.cardEl.classList.toggle('is-selected', selected);
        rec.cardEl.setAttribute('aria-pressed', String(selected));
    }
}

function renderSections() {
    if (recordsById.size === 0) return;

    const modalBody = document.getElementById('bgModalBody');
    const modalStatus = document.getElementById('bgModalStatus');
    if (!modalBody) return;

    setupObservers(modalBody);

    const sections = {
        solid: { root: document.getElementById('bgSectionSolid'), grid: document.getElementById('bgGridSolid'), more: null },
        story: { root: document.getElementById('bgSectionStory'), grid: document.getElementById('bgGridStory'), more: document.getElementById('bgMoreStory') },
        home: { root: document.getElementById('bgSectionHome'), grid: document.getElementById('bgGridHome'), more: document.getElementById('bgMoreHome') }
    };

    let visibleTotal = 0;

    for (const key of ['solid', 'story', 'home']) {
        const sec = sections[key];
        if (!sec.root || !sec.grid) continue;

        const inCategory = activeCategory === 'all' || activeCategory === key;
        const matched = inCategory ? getFilteredRecords(key) : [];

        if (!inCategory || matched.length === 0) {
            sec.root.hidden = true;
            sec.grid.innerHTML = '';
            if (sec.more) {
                sec.more.hidden = true;
                moreObserver?.unobserve(sec.more);
            }
            continue;
        }

        visibleTotal += matched.length;
        sec.root.hidden = false;

        // Expand slice if the active/selected entry lies past the current limit.
        const selectedIdx = matched.findIndex((r) => r.id === pendingBgId || r.id === activeBgId);
        if (selectedIdx >= 0 && selectedIdx >= (sectionLimits[key] ?? INITIAL_LIMIT)) {
            sectionLimits[key] = selectedIdx + 20;
        }

        const limit = key === 'solid' ? matched.length : (sectionLimits[key] ?? INITIAL_LIMIT);
        const slice = matched.slice(0, limit);

        const frag = document.createDocumentFragment();
        const toObserve = [];
        for (const rec of slice) {
            const cardEl = getOrCreateCard(rec);
            frag.appendChild(cardEl);
            if (key !== 'solid' && !cardEl.dataset.thumbLoaded) {
                toObserve.push(cardEl);
            }
        }

        sec.grid.innerHTML = '';
        sec.grid.appendChild(frag);

        for (const cardEl of toObserve) {
            thumbObserver.unobserve(cardEl);
            thumbObserver.observe(cardEl);
        }

        if (sec.more) {
            const hasMore = slice.length < matched.length;
            sec.more.hidden = !hasMore;
            if (hasMore && moreObserver) {
                moreObserver.unobserve(sec.more);
                moreObserver.observe(sec.more);
            } else {
                moreObserver?.unobserve(sec.more);
            }
        }
    }

    if (modalStatus) {
        if (visibleTotal === 0) {
            modalStatus.textContent = 'No matches.';
            modalStatus.hidden = false;
        } else {
            modalStatus.textContent = '';
            modalStatus.hidden = true;
        }
    }
}

async function openModal() {
    const modal = document.getElementById('bgSelectorModal');
    const modalStatus = document.getElementById('bgModalStatus');
    const searchInput = document.getElementById('bgSearchInput');
    if (!modal) return;

    lastFocusedEl = document.activeElement;
    pendingBgId = activeBgId;
    modal.hidden = false;

    if (recordsById.size === 0 && modalStatus) {
        modalStatus.textContent = 'Loading...';
        modalStatus.hidden = false;
    }

    try {
        await loadCatalog();
        renderSections();
        syncSelection();

        requestAnimationFrame(() => {
            searchInput?.focus({ preventScroll: true });
            const selectedCard = recordsById.get(pendingBgId)?.cardEl;
            if (selectedCard?.isConnected) {
                selectedCard.scrollIntoView({ block: 'nearest' });
            }
        });
    } catch (err) {
        console.error('[viewer-bg] Catalog load failed:', err);
        if (modalStatus) {
            modalStatus.textContent = 'Failed to load background catalog.';
            modalStatus.hidden = false;
        }
    }
}

function closeModal({ commit = false } = {}) {
    const modal = document.getElementById('bgSelectorModal');
    if (!modal || modal.hidden) return;

    if (commit) {
        const chosen = recordsById.get(pendingBgId)?.entry;
        const prevBgId = activeBgId;
        modal.hidden = true;
        if (chosen && chosen.id !== activeBgId) {
            activeBgId = chosen.id;
            applyBackground(chosen, prevBgId);
        }
    } else {
        pendingBgId = activeBgId;
        modal.hidden = true;
    }

    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function' && document.contains(lastFocusedEl)) {
        lastFocusedEl.focus({ preventScroll: true });
    }
    lastFocusedEl = null;
}

async function applyDefaultBackground() {
    try {
        await loadCatalog();
        if (activeBgId !== DEFAULT_BG_ID || bgLoadToken !== 0) return;
        const entry = recordsById.get(DEFAULT_BG_ID)?.entry;
        if (!entry) return;
        await applyBackground(entry, FALLBACK_BG_ID);
        if (activeBgId === FALLBACK_BG_ID) {
            const fallback = recordsById.get(FALLBACK_BG_ID)?.entry;
            if (fallback) {
                pendingBgId = fallback.id;
                if (isBackgroundModalOpen()) syncSelection();
                await applyBackground(fallback, null);
            }
        }
    } catch (err) {
        console.warn('[viewer-bg] Failed to apply default background:', err);
        if (bgLoadToken === 0) {
            activeBgId = FALLBACK_BG_ID;
            pendingBgId = FALLBACK_BG_ID;
            window.setViewerBackgroundState?.({ type: 'solid', color: 0x999999 });
        }
    }
}

export function setupBackgroundSelector() {
    const changeBgBtn = document.getElementById('changeBgBtn');
    const modal = document.getElementById('bgSelectorModal');
    const modalBody = document.getElementById('bgModalBody');
    const searchInput = document.getElementById('bgSearchInput');
    const categorySelect = document.getElementById('bgCategorySelect');
    const okBtn = document.getElementById('bgOkBtn');
    const cancelBtn = document.getElementById('bgCancelBtn');
    const closeBtn = document.getElementById('bgModalCloseBtn');

    if (!changeBgBtn || !modal) return;

    changeBgBtn.addEventListener('click', () => openModal());

    modalBody?.addEventListener('click', (ev) => {
        const moreBtn = ev.target?.closest?.('.bg-more-btn');
        if (moreBtn?.dataset.sectionKey) {
            expandSection(moreBtn.dataset.sectionKey, LOAD_MORE_STEP);
            return;
        }
        const card = ev.target?.closest?.('.bg-card');
        if (!card) return;
        const bgId = card.dataset.bgId;
        if (!bgId || !recordsById.has(bgId)) return;
        pendingBgId = bgId;
        syncSelection();
    });

    searchInput?.addEventListener('input', () => {
        clearTimeout(searchTimer);
        const apply = () => {
            searchQuery = searchInput.value;
            sectionLimits.story = INITIAL_LIMIT;
            sectionLimits.home = INITIAL_LIMIT;
            renderSections();
            syncSelection();
        };
        if (!searchInput.value) {
            apply();
        } else {
            searchTimer = setTimeout(apply, 60);
        }
    });

    categorySelect?.addEventListener('change', () => {
        activeCategory = categorySelect.value || 'all';
        if (modalBody) modalBody.scrollTop = 0;
        renderSections();
        syncSelection();
    });

    okBtn?.addEventListener('click', () => closeModal({ commit: true }));
    cancelBtn?.addEventListener('click', () => closeModal({ commit: false }));
    closeBtn?.addEventListener('click', () => closeModal({ commit: false }));

    modal.addEventListener('click', (ev) => {
        if (ev.target === modal) closeModal({ commit: false });
    });

    window.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && isBackgroundModalOpen()) {
            ev.preventDefault();
            closeModal({ commit: false });
        }
    });

    applyDefaultBackground();
}
