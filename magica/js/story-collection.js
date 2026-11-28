// magica/js/story-collection.js — Archive -> Stories (#/StoryCollection) controller

import { repoUrl, magicaUrl } from './paths.js';
import { changeBg, preloadBg, setBgPortrait, setBgWebcamVideo } from './engine/bg.js';
import { startBgm, stopBgm } from './engine/audio.js';
import { playUsmMovie, stopUsmMovie, isUsmMoviePlaying } from './engine/usm-player.js';
import {
    setStageContext,
    setStageXOffset,
    applySubtitlePlacement,
    clearStageModels
} from './engine/l2d-stage.js';
import { markDragScroll, isDragScrollActive } from './engine/common-events.js';
import {
    openStoryOutlinePopup,
    openStoryGalleryPopup,
    openStoryNoticePopup,
    closeStoryPopup
} from './popups.js';

const CATALOG_URL = repoUrl('assets/storyCatalog.json');
const COLLECTION_BG = 'bg/web/web_0015.ExportJson';
const COLLECTION_BGM = 'bgm02_anime11_hca.hca';
const COLLECTION_X_OFFSET = -262;
const STORAGE_CONTINUOUS_KEY = 'continuousPlayFlag';
const PROLOGUE_STORIES = [
    '000001-1',
    '000002-1',
    '000003-1',
    '000003-2',
    '000003-3',
    '000003-4',
    '000003-5'
];

const MOVIE_PATHS = {
    ep1opening: 'resource/movie/other/op_movie.usm',
    ep1ending: 'resource/movie/other/102005_epilogue.usm',
    ep1ending_mn: 'resource/movie/other/102005_epilogue_mn.usm',
    ep2opening: 'resource/movie/other/op_movie2.usm',
    ep2ending: 'resource/movie/other/103305_epilogue.usm'
};

let catalogCache = null;
let activeController = null;
let storyCollectionToken = 0;
let activeTab = 'main';
let continuousPlay = false;
let renderedTabs = new Set();

async function loadStoryCatalog() {
    if (catalogCache) return catalogCache;
    const resp = await fetch(CATALOG_URL);
    if (!resp.ok) throw new Error(`Failed to fetch ${CATALOG_URL}: ${resp.status}`);
    catalogCache = await resp.json();
    return catalogCache;
}

function splitStoryIds(raw) {
    if (Array.isArray(raw)) return raw.filter(Boolean);
    return String(raw || '')
        .replace(/:/g, ',')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
}

// --- Clean hooks for future Story Player / USM Movie Player / MagiRepo ---

export function handleStoryPlayback(storyIds, meta = {}) {
    const ids = splitStoryIds(storyIds);
    console.info('[story-collection] playStory:', meta, ids);
    if (ids.length === 0) {
        openStoryNoticePopup({
            title: 'Story Confirmation',
            message: 'There is no story available.'
        });
        return;
    }
    openStoryNoticePopup({
        title: 'Story Playback',
        message: 'The story player is not implemented yet.'
    });
}

export async function handleMoviePlayback(movieId) {
    if (isUsmMoviePlaying()) return;
    const moviePath = MOVIE_PATHS[movieId] || '';
    console.info('[story-collection] playMovie:', { movieId, moviePath });
    if (!moviePath) {
        openStoryNoticePopup({
            title: 'Movie Playback',
            message: 'The selected movie is not available.'
        });
        return;
    }

    const token = storyCollectionToken;
    // Start playUsmMovie synchronously within the click gesture so AudioContext unlocks cleanly.
    const playPromise = playUsmMovie(moviePath);
    stopBgm({ fadeMs: 220 }).catch((e) => console.warn('[story-collection] stopBgm error:', e));

    try {
        await playPromise;
        if (token === storyCollectionToken) {
            startBgm(COLLECTION_BGM, { autoplay: true }).catch((e) =>
                console.warn('[story-collection] BGM resume error:', e)
            );
        }
    } catch (err) {
        console.warn('[story-collection] Movie playback failed:', movieId, err);
        if (token === storyCollectionToken) {
            startBgm(COLLECTION_BGM, { autoplay: true }).catch((e) =>
                console.warn('[story-collection] BGM resume error:', e)
            );
            openStoryNoticePopup({
                title: 'Movie Playback',
                message: err?.message || 'Failed to play the movie.'
            });
        }
    }
}

export function handleMagiRepoClick() {
    console.info('[story-collection] openMagiRepo');
    openStoryNoticePopup({
        title: 'MagiRepo',
        message: 'MagiRepo is not implemented yet.'
    });
}

// --- DOM Builders ---

function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
}

function createGoldBtn(className, upperText, mainText) {
    const p = createEl('p', `sb_gold_01 TE ${className}`);
    p.appendChild(createEl('span', 'b_screen'));
    if (upperText) {
        p.appendChild(createEl('span', 'buttonUpper c_gold', upperText));
        p.appendChild(document.createElement('br'));
    }
    p.appendChild(document.createTextNode(mainText));
    return p;
}

function createBannerImage(relPath, fallbackTitle) {
    const img = document.createElement('img');
    img.className = 'titleWrapper';
    img.loading = 'lazy';
    img.alt = fallbackTitle || '';
    img.src = magicaUrl(`resource/image_web/${relPath}`);
    img.addEventListener('error', () => {
        const parent = img.parentElement;
        if (!parent) return;
        img.remove();
        parent.appendChild(createEl('span', 'bannerFallback', fallbackTitle || 'Story'));
    }, { once: true });
    return img;
}

function createStaticPrologueWrap() {
    const wrap = createEl('div', 'wrap');

    const titleWrap = createEl('div', 'chapterTitleWrap commonFrame4 se_tabs');
    titleWrap.dataset.chapter = '00';
    titleWrap.appendChild(createEl('h3', 'chapterNumber', 'Prologue'));
    titleWrap.appendChild(createEl('div', 'panArrow chapterIdPan00'));
    wrap.appendChild(titleWrap);

    const listWrap = createEl('div', 'sectionListWrap chapterId00');
    const secWrap = createEl('div', 'sectionWrap commonFrame3 CLEARED');
    secWrap.appendChild(createEl('span', 'sectionTitle', 'Again, Another Witch'));
    secWrap.appendChild(createEl('h2', 'sectionNumber', 'Prologue'));
    const startBtn = createGoldBtn('se_decide storyStart prologueStart', 'CLEAR', 'Playback');
    startBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isDragScrollActive()) return;
        handleStoryPlayback(PROLOGUE_STORIES, { tab: 'main', chapterId: 0, title: 'Prologue' });
    });
    secWrap.appendChild(startBtn);
    listWrap.appendChild(secWrap);
    wrap.appendChild(listWrap);

    return wrap;
}

function createStandardChapterWrap(chapter, tabKey, catalog) {
    const wrap = createEl('div', 'wrap');
    const chapterKey = String(chapter.chapterId);

    const titleWrap = createEl('div', 'chapterTitleWrap commonFrame4 se_tabs');
    titleWrap.dataset.chapter = chapterKey;

    if (chapter.chapterLabel) {
        titleWrap.appendChild(createEl('h3', 'chapterNumber', chapter.chapterLabel));
    } else if (chapter.displayCardId) {
        const faceDiv = createEl('div', 'faceImg');
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.alt = '';
        img.src = magicaUrl(`resource/image_native/card/image/card_${chapter.displayCardId}_f.png`);
        img.addEventListener('error', () => {
            img.style.visibility = 'hidden';
        }, { once: true });
        faceDiv.appendChild(img);
        titleWrap.appendChild(faceDiv);
    }

    titleWrap.appendChild(createEl('div', 'chapterTitle', chapter.title));
    titleWrap.appendChild(createEl('div', `panArrow chapterIdPan${chapterKey}`));
    wrap.appendChild(titleWrap);

    if (chapter.hasGallery) {
        const galleryBtn = createEl(
            'div',
            `popupGalleryBtn chapterGallery${chapterKey} sb_gold_01 se_decide TE`,
            'View Gallery'
        );
        galleryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isDragScrollActive()) return;
            const partGalleries = (catalog.stills || []).filter((g) => g.partNo === chapter.partNo);
            openStoryGalleryPopup({
                galleries: partGalleries,
                initialChapterId: chapter.chapterId
            });
        });
        wrap.appendChild(galleryBtn);
    }

    const sectionListWrap = createEl(
        'div',
        `sectionListWrap chapterId${chapterKey}${chapter.hasGallery ? ' gallery' : ''}`
    );

    const sections = chapter.sectionList || [];
    sections.forEach((sec, secIdx) => {
        if (sec.hasMirrorBattle) {
            const mirrorWrap = createEl('div', 'sectionWrap commonFrame3 CLEARED mirrorBattle');
            mirrorWrap.appendChild(createEl('span', 'sectionTitle', 'The Beginning of a Miracle'));
            mirrorWrap.appendChild(createEl('h2', 'sectionNumber', 'Chapter 12'));
            const mBtn = createGoldBtn('se_decide storyStart', null, 'Playback');
            mBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (isDragScrollActive()) return;
                handleStoryPlayback(['mirror_battle_103305'], {
                    tab: tabKey,
                    chapterId: chapter.chapterId,
                    sectionId: sec.sectionId,
                    mirrorBattle: true
                });
            });
            mirrorWrap.appendChild(mBtn);
            sectionListWrap.appendChild(mirrorWrap);
        }

        const secWrap = createEl('div', 'sectionWrap commonFrame3 CLEARED');
        if (sec.sectionId != null) secWrap.classList.add(`sectionId${sec.sectionId}`);

        secWrap.appendChild(createEl('span', 'sectionTitle', sec.title || ''));
        const numLabel = sec.sectionLabel || sec.sectionNo || '';
        if (numLabel) {
            secWrap.appendChild(createEl('h2', 'sectionNumber', numLabel));
        }

        if (sec.outline) {
            const outlineBtn = createGoldBtn('se_decide outline', null, 'The Story So Far');
            outlineBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (isDragScrollActive()) return;
                openStoryOutlinePopup({
                    title: sec.outlineTitle || `${numLabel} Summary`,
                    outline: sec.outline,
                    defaultCardId: sec.outlineCardId || 10011
                });
            });
            secWrap.appendChild(outlineBtn);
        }

        const playBtn = createGoldBtn('se_decide storyStart', 'CLEAR', 'Playback');
        playBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isDragScrollActive()) return;

            let ids;
            if (continuousPlay) {
                if (tabKey === 'arena') {
                    const allLayers = catalog.arena || [];
                    const startIdx = allLayers.findIndex((a) => a.chapterId === chapter.chapterId);
                    ids = allLayers
                        .slice(startIdx >= 0 ? startIdx : 0)
                        .flatMap((a) => a.sectionList?.[0]?.storyArr || []);
                } else {
                    ids = sections.slice(secIdx).flatMap((s) => s.storyArr || []);
                }
            } else {
                ids = (sec.storyArr || []).slice();
            }

            handleStoryPlayback(ids, {
                tab: tabKey,
                chapterId: chapter.chapterId,
                sectionId: sec.sectionId,
                continuous: continuousPlay
            });
        });
        secWrap.appendChild(playBtn);
        sectionListWrap.appendChild(secWrap);
    });

    wrap.appendChild(sectionListWrap);
    return wrap;
}

function createBannerPillsWrap(item, chapterKey, startBtnClass, tabKey) {
    const wrap = createEl('div', 'wrap');

    const titleWrap = createEl('div', 'chapterTitleWrap commonFrame4 se_tabs');
    titleWrap.dataset.chapter = chapterKey;
    const titleDiv = createEl('div', 'chapterTitle');
    titleDiv.appendChild(createBannerImage(item.banner, item.eventName));
    titleWrap.appendChild(titleDiv);
    titleWrap.appendChild(createEl('div', `panArrow chapterIdPan${chapterKey}`));
    wrap.appendChild(titleWrap);

    const sectionListWrap = createEl('div', `sectionListWrap chapterId${chapterKey}`);
    const multiStory = createEl('div', 'eventMultiStory');

    const stories = item.storyList || [];
    stories.forEach((st, idx) => {
        const btnWrap = createEl('div', 'btnWrap');
        const pill = createEl('span', `mb_white TE se_decide ${startBtnClass}`);
        pill.dataset.ids = st.storyIds || '';
        pill.appendChild(createEl('span', 'b_screen'));
        pill.appendChild(document.createTextNode(st.storyTitle || ''));
        pill.addEventListener('click', (e) => {
            e.preventDefault();
            if (isDragScrollActive()) return;
            const ids = continuousPlay
                ? stories.slice(idx).flatMap((entry) => splitStoryIds(entry.storyIds))
                : splitStoryIds(st.storyIds);
            handleStoryPlayback(ids, {
                tab: tabKey,
                eventId: item.id ?? item.eventId ?? item.campaignId,
                storyTitle: st.storyTitle,
                continuous: continuousPlay
            });
        });
        btnWrap.appendChild(pill);
        multiStory.appendChild(btnWrap);
    });

    sectionListWrap.appendChild(multiStory);
    wrap.appendChild(sectionListWrap);
    return wrap;
}

function createBranchOrWitchWrap(item, chapterKey) {
    const isWitch = item.eventType === 'WITCH';
    const wrap = createEl('div', `wrap ${isWitch ? 'WITCH' : 'BRANCH'}`);

    const titleWrap = createEl('div', 'chapterTitleWrap commonFrame4 se_tabs');
    titleWrap.dataset.chapter = chapterKey;
    const titleDiv = createEl('div', 'chapterTitle');
    titleDiv.appendChild(createBannerImage(item.banner, item.eventName));
    titleWrap.appendChild(titleDiv);
    titleWrap.appendChild(createEl('div', `panArrow chapterIdPan${chapterKey}`));
    wrap.appendChild(titleWrap);

    const sectionListWrap = createEl('div', `sectionListWrap chapterId${chapterKey}`);

    (item.storyList || []).forEach((st, idx) => {
        const row = createEl('div', 'commonFrame3 storyWrap');

        const charaBox = createEl('div', 'branchStoryChara');
        const label = isWitch ? (st.storyTitle || '') : (st.pointTitle || '');
        charaBox.appendChild(createEl('p', 'charaTxt', label));

        const headerImg = document.createElement('img');
        headerImg.loading = 'lazy';
        headerImg.alt = '';
        if (isWitch) {
            headerImg.src = idx === 0
                ? magicaUrl('resource/image_web/event/branch/common/quest_header_9900.png')
                : magicaUrl('resource/image_web/event/eventWitch/common/story_collection_header.png');
        } else {
            headerImg.src = Number(st.charaId) === 9900 || st.charaId == null
                ? magicaUrl('resource/image_web/event/branch/common/quest_header_9900.png')
                : magicaUrl(`resource/image_web/event/branch/${item.id}/quest_header_${st.charaId}.png`);
        }
        charaBox.appendChild(headerImg);
        row.appendChild(charaBox);

        if (!isWitch && Number(st.charaId) !== 9900) {
            row.appendChild(createEl('span', 'branchStoryTitle', st.storyTitle || ''));
        }

        const btnWrap = createEl('div', 'btnWrap');
        const playBtn = createGoldBtn('se_decide eventStoryStart', null, 'Playback');
        playBtn.dataset.ids = st.storyIds || '';
        playBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isDragScrollActive()) return;
            handleStoryPlayback(splitStoryIds(st.storyIds), {
                tab: 'event',
                eventId: item.id,
                eventType: item.eventType,
                storyTitle: st.storyTitle
            });
        });
        btnWrap.appendChild(playBtn);
        row.appendChild(btnWrap);

        sectionListWrap.appendChild(row);
    });

    wrap.appendChild(sectionListWrap);
    return wrap;
}

function renderTabContent(tabKey, catalog) {
    if (renderedTabs.has(tabKey)) return;
    renderedTabs.add(tabKey);

    const container = document.querySelector(`#StoryCollection #${tabKey} .scrollInner`);
    if (!container) return;

    const frag = document.createDocumentFragment();

    if (tabKey === 'main') {
        frag.appendChild(createStaticPrologueWrap());
    }

    if (
        tabKey === 'main' ||
        tabKey === 'mainSecond' ||
        tabKey === 'sub' ||
        tabKey === 'subSecond' ||
        tabKey === 'chara' ||
        tabKey === 'arena' ||
        tabKey === 'accomplish'
    ) {
        const list = catalog[tabKey] || [];
        if (list.length === 0 && tabKey !== 'main') {
            frag.appendChild(createEl('p', 'storyCautionText ts_white', 'There is no story available here.'));
        } else {
            for (const ch of list) {
                frag.appendChild(createStandardChapterWrap(ch, tabKey, catalog));
            }
        }
    } else if (tabKey === 'puellaHistoria') {
        const list = catalog.puellaHistoria || [];
        if (list.length === 0) {
            frag.appendChild(createEl('p', 'storyCautionText ts_white', 'There is no story available here.'));
        } else {
            for (const item of list) {
                frag.appendChild(
                    createBannerPillsWrap(item, `Event${item.eventId}`, 'puellaHistoriaStoryStart', 'puellaHistoria')
                );
            }
        }
    } else if (tabKey === 'event') {
        const list = catalog.event || [];
        if (list.length === 0) {
            frag.appendChild(createEl('p', 'storyCautionText ts_white', 'There is no story available here.'));
        } else {
            for (const item of list) {
                const key = `Event${item.id}`;
                if (item.eventType === 'BRANCH' || item.eventType === 'WITCH') {
                    frag.appendChild(createBranchOrWitchWrap(item, key));
                } else {
                    frag.appendChild(createBannerPillsWrap(item, key, 'eventStoryStart', 'event'));
                }
            }
        }
    } else if (tabKey === 'special') {
        const list = catalog.special || [];
        if (list.length === 0) {
            frag.appendChild(createEl('p', 'storyCautionText ts_white', 'There is no story available here.'));
        } else {
            for (const item of list) {
                frag.appendChild(
                    createBannerPillsWrap(item, `Special${item.campaignId}`, 'eventStoryStart', 'special')
                );
            }
        }
    }

    container.appendChild(frag);
}

// --- Drag-to-scroll helper ---

function attachDragScroll(scrollEl, signal) {
    if (!scrollEl) return;
    let dragging = false;
    let startY = 0;
    let startTop = 0;

    scrollEl.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        dragging = true;
        startY = e.clientY;
        startTop = scrollEl.scrollTop;
    }, { signal });

    window.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dy = e.clientY - startY;
        if (Math.abs(dy) > 6) {
            markDragScroll(140);
            scrollEl.scrollTop = startTop - dy;
        }
    }, { signal });

    const end = () => { dragging = false; };
    window.addEventListener('pointerup', end, { signal });
    window.addEventListener('pointercancel', end, { signal });
}

// --- View Setup ---

function setupStoryCollectionView(catalog) {
    resetStoryCollection();
    activeController = new AbortController();
    const { signal } = activeController;

    const root = document.getElementById('StoryCollection');
    if (!root) return;

    try {
        continuousPlay = localStorage.getItem(STORAGE_CONTINUOUS_KEY) === '1';
    } catch {
        continuousPlay = false;
    }

    const contBtn = document.getElementById('continuousPlayBtn');
    const midBtn = document.getElementById('middlePlayBtn');
    const listWrap = document.getElementById('listWrap');
    const listTitle = document.getElementById('listTitle');
    const tabBtns = root.querySelectorAll('#tabBtn .btn');

    contBtn?.classList.toggle('on', continuousPlay);
    midBtn?.classList.remove('on');

    // Initialize default active tab ("main")
    activeTab = 'main';
    renderedTabs = new Set();
    root.querySelectorAll('.listMain .scrollInner').forEach((el) => {
        el.innerHTML = '';
    });
    if (listWrap) listWrap.className = 'commonFrame1 main';
    if (listTitle) listTitle.textContent = 'Main Story';
    tabBtns.forEach((btn) => {
        btn.classList.toggle('current', btn.dataset.wrap === 'main');
    });

    renderTabContent('main', catalog);

    // Drag-to-scroll on tab sidebar and each tab's list container
    attachDragScroll(document.getElementById('storyTabScroll'), signal);
    root.querySelectorAll('.listMain .hiddenWrap').forEach((wrap) => {
        attachDragScroll(wrap, signal);
    });

    // Touch press highlight
    root.addEventListener('pointerdown', (e) => {
        const te = e.target.closest('#StoryCollection .TE');
        if (te) te.classList.add('touch');
    }, { signal });
    const clearTouch = () => {
        root.querySelectorAll('.TE.touch').forEach((el) => el.classList.remove('touch'));
    };
    window.addEventListener('pointerup', clearTouch, { signal });
    window.addEventListener('pointercancel', clearTouch, { signal });

    // Top-right buttons
    contBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (isDragScrollActive()) return;
        continuousPlay = !continuousPlay;
        contBtn.classList.toggle('on', continuousPlay);
        try {
            localStorage.setItem(STORAGE_CONTINUOUS_KEY, continuousPlay ? '1' : '0');
        } catch {}
    }, { signal });

    midBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (isDragScrollActive()) return;
        openStoryNoticePopup({
            title: 'Story Confirmation',
            message: 'There is no story bookmark available.'
        });
    }, { signal });

    // Sidebar clicks (category tabs, movie buttons, MagiRepo)
    const tabList = document.getElementById('tabBtn');
    tabList?.addEventListener('click', (e) => {
        const btn = e.target.closest('#tabBtn .btn');
        if (!btn || isDragScrollActive()) return;
        e.preventDefault();

        if (btn.classList.contains('movieBtn')) {
            handleMoviePlayback(btn.dataset.id);
            return;
        }
        if (btn.classList.contains('magirepo')) {
            handleMagiRepoClick();
            return;
        }

        const nextWrap = btn.dataset.wrap;
        if (!nextWrap || nextWrap === activeTab) return;

        tabBtns.forEach((b) => b.classList.remove('current'));
        btn.classList.add('current');

        if (listWrap) {
            listWrap.classList.remove(activeTab);
            listWrap.classList.add(nextWrap);
        }
        const label = btn.querySelector('span')?.textContent?.trim();
        if (listTitle && label) listTitle.textContent = label;

        activeTab = nextWrap;
        renderTabContent(activeTab, catalog);

        const hiddenWrap = document.getElementById(`${activeTab}HiddenWrap`);
        if (hiddenWrap) hiddenWrap.scrollTop = 0;
    }, { signal });

    // Accordion expand/collapse on chapter headers
    listWrap?.addEventListener('click', (e) => {
        const header = e.target.closest('.chapterTitleWrap');
        if (!header || isDragScrollActive()) return;
        e.preventDefault();

        const chapterKey = header.dataset.chapter;
        if (!chapterKey) return;
        const tabContainer = document.getElementById(activeTab);
        if (!tabContainer) return;

        const sectionList = tabContainer.getElementsByClassName(`chapterId${chapterKey}`)[0];
        const arrow = tabContainer.getElementsByClassName(`chapterIdPan${chapterKey}`)[0];
        const galleryBtn = tabContainer.getElementsByClassName(`chapterGallery${chapterKey}`)[0];

        if (!sectionList) return;
        const isOpen = sectionList.classList.toggle('on');
        if (arrow) arrow.classList.toggle('on', isOpen);
        if (galleryBtn) galleryBtn.classList.toggle('on', isOpen);

        if (isOpen) {
            const scrollContainer = document.getElementById(`${activeTab}HiddenWrap`);
            const wrapEl = header.closest('.wrap');
            if (scrollContainer && wrapEl) {
                scrollContainer.scrollTop = Math.max(0, wrapEl.offsetTop - 20);
            }
        }
    }, { signal });
}

export function resetStoryCollection() {
    if (activeController) {
        activeController.abort();
        activeController = null;
    }
}

export async function enterStoryCollection({ onBeforeReveal, hadLive2d = false, fromCollectionTop = false } = {}) {
    const token = ++storyCollectionToken;

    if (fromCollectionTop) {
        const preloadTask = Promise.all([
            preloadBg(COLLECTION_BG).catch((e) => console.warn('[story-collection] BG preload error:', e)),
            startBgm(COLLECTION_BGM, { autoplay: true }).catch((e) => console.warn('[story-collection] BGM error:', e)),
            loadStoryCatalog()
        ]);

        // Let CollectionTop right-side buttons fade/hide first.
        await new Promise((r) => setTimeout(r, 60));
        if (token !== storyCollectionToken) return;

        document.body.classList.add('connecting');
        const connectStart = performance.now();

        const [, , catalog] = await preloadTask;
        if (token !== storyCollectionToken) return;

        const elapsed = performance.now() - connectStart;
        if (elapsed < 180) {
            await new Promise((r) => setTimeout(r, 180 - elapsed));
        }
        if (token !== storyCollectionToken) return;

        document.getElementById('ui-layer')?.classList.remove('home-mode', 'menu-closed');
        setBgWebcamVideo(null);
        setBgPortrait(false);
        clearStageModels();

        const bgStart = performance.now();
        await changeBg(COLLECTION_BG, { visible: true, autoplay: true, crossfadeMs: 250, waitForCrossfade: true }).catch((e) =>
            console.warn('[story-collection] BG error:', e)
        );
        if (token !== storyCollectionToken) return;

        const bgElapsed = performance.now() - bgStart;
        if (bgElapsed < 150) {
            await new Promise((r) => setTimeout(r, 150 - bgElapsed));
        }
        if (token !== storyCollectionToken) return;

        document.body.classList.remove('connecting');
        await new Promise((r) => setTimeout(r, 60));
        if (token !== storyCollectionToken) return;

        setupStoryCollectionView(catalog);
    } else {
        const step1Start = performance.now();
        const [, , catalog] = await Promise.all([
            preloadBg(COLLECTION_BG).catch((e) => console.warn('[story-collection] BG preload error:', e)),
            startBgm(COLLECTION_BGM, { autoplay: true }).catch((e) => console.warn('[story-collection] BGM error:', e)),
            loadStoryCatalog()
        ]);
        if (token !== storyCollectionToken) return;

        if (hadLive2d) {
            const elapsed = performance.now() - step1Start;
            if (elapsed < 200) {
                await new Promise((r) => setTimeout(r, 200 - elapsed));
            }
            if (token !== storyCollectionToken) return;
        }

        document.getElementById('ui-layer')?.classList.remove('home-mode', 'menu-closed');
        setBgWebcamVideo(null);
        setBgPortrait(false);
        clearStageModels();

        await changeBg(COLLECTION_BG, { visible: true, autoplay: true, crossfadeMs: 250, waitForCrossfade: true }).catch((e) =>
            console.warn('[story-collection] BG error:', e)
        );
        if (token !== storyCollectionToken) return;

        document.body.classList.remove('connecting');
        setupStoryCollectionView(catalog);
    }

    setStageContext({ mode: 'detail' });
    setStageXOffset(COLLECTION_X_OFFSET);
    if (typeof window.updateViewerViewport === 'function') {
        window.updateViewerViewport();
    }
    applySubtitlePlacement();

    const root = document.getElementById('StoryCollection');
    root?.classList.remove('fadein');
    if (typeof onBeforeReveal === 'function') {
        onBeforeReveal();
    }
    if (root) {
        void root.offsetWidth;
        root.classList.add('fadein');
    }
}

export function leaveStoryCollection() {
    storyCollectionToken++;
    stopUsmMovie({ fadeMs: 0 });
    closeStoryPopup();
    document.getElementById('StoryCollection')?.classList.remove('fadein');
    resetStoryCollection();
}
