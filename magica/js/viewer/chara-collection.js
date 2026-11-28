// chara-collection.js — Character Collection grid selector view for quotes.html

import { state } from './model.js';
import { repoUrl, magicaUrl } from '../paths.js';
import { changeBg, preloadBg, setBgPortrait, setBgWebcamVideo } from '../engine/bg.js';
import { startBgm } from '../engine/audio.js';
import {
    setStageContext,
    setStageXOffset,
    applySubtitlePlacement,
    clearStageModels
} from '../engine/l2d-stage.js';

const CHARA_ATTRIBUTES_URL = repoUrl('assets/charaAttributes.json');
const COLLECTION_BG = 'bg/web/web_0015.ExportJson';
const COLLECTION_BGM = 'bgm02_anime11_hca.hca';
const COLLECTION_X_OFFSET = -262;
let charaAttributes = {};

export async function loadCharaAttributes() {
    if (Object.keys(charaAttributes).length > 0) return charaAttributes;
    try {
        const resp = await fetch(CHARA_ATTRIBUTES_URL);
        if (resp.ok) {
            charaAttributes = await resp.json();
        }
    } catch (e) {
        console.warn('[chara-collection] Failed to load charaAttributes.json', e);
    }
    return charaAttributes;
}

const KNOWN_CHARA_NAMES = {
    1001: { name: '環 いろは', kana: 'たまき いろは' },
    1002: { name: '七海 やちよ', kana: 'ななみ やちよ' },
    1003: { name: '由比 鶴乃', kana: 'ゆい つるの' },
    1004: { name: '二葉 さな', kana: 'ふたば さな' },
    1005: { name: '深月 フェリシア', kana: 'みつき ふぇりしあ' },
    1006: { name: '梓 みふゆ', kana: 'あずさ みふゆ' },
    1007: { name: '里見 燈花', kana: 'さとみ とうか' },
    1008: { name: '柊 ねむ', kana: 'ひいらぎ ねむ' },
    1009: { name: '水波 レナ', kana: 'みなみ れな' },
    1010: { name: '十咎 ももこ', kana: 'とがめ ももこ' },
    1011: { name: '秋野 かえで', kana: 'あきの かえで' },
    2001: { name: '鹿目 まどか', kana: 'かなめ まどか' },
    2002: { name: '暁美 ほむら', kana: 'あけみ ほむら' },
    2003: { name: '美樹 さやか', kana: 'みき さやか' },
    2004: { name: '巴 マミ', kana: 'ともえ まみ' },
    2005: { name: '佐倉 杏子', kana: 'さくら きょうこ' }
};

export async function fetchCharacterCatalog() {
    try {
        const [charaResponse, live2dResponse] = await Promise.all([
            fetch(repoUrl('assets/charaList.json')).catch(() => null),
            fetch(repoUrl('assets/live2dList.json')).catch(() => null)
        ]);

        let registeredChars = [];
        let registeredLive2d = [];

        if (charaResponse && charaResponse.ok) registeredChars = await charaResponse.json();
        if (live2dResponse && live2dResponse.ok) registeredLive2d = await live2dResponse.json();

        let missingChars = [];
        let missingLive2d = [];
        try {
            const [missingCharsResponse, missingLive2dResponse] = await Promise.all([
                fetch(repoUrl('assets/missingCharaList.json')).catch(() => null),
                fetch(repoUrl('assets/missingLive2dList.json')).catch(() => null)
            ]);
            if (missingCharsResponse && missingCharsResponse.ok) missingChars = await missingCharsResponse.json();
            if (missingLive2dResponse && missingLive2dResponse.ok) missingLive2d = await missingLive2dResponse.json();
        } catch (e) {
            // Optional missing files
        }

        const missingCharIds = new Set(missingChars.map(c => Number(c.id)));
        state.missingCharIds = missingCharIds;

        const registeredLive2dKeys = new Set(
            registeredLive2d.map(o => `${Number(o.charaId)}-${String(o.live2dId).padStart(2, '0')}`)
        );

        // Exclude characters in missingCharaList.json
        state.charaListData = registeredChars.filter(c => !missingCharIds.has(Number(c.id)));
        state.live2dListData = registeredLive2d;
        state.registeredLive2dKeys = registeredLive2dKeys;
    } catch (e) {
        console.warn('[chara-collection] Failed to fetch remote catalog:', e);
    }

    // Guarantee entries from charaAttributes.json if list is empty or sparse
    const attrs = await loadCharaAttributes();
    if (!state.charaListData || state.charaListData.length === 0) {
        state.charaListData = Object.keys(attrs).map(idStr => {
            const numId = Number(idStr);
            const known = KNOWN_CHARA_NAMES[numId];
            return {
                id: numId,
                name: known ? known.name : `Magical Girl ${numId}`,
                kana: known ? known.kana : `magical girl ${numId}`
            };
        }).filter(c => !state.missingCharIds?.has(Number(c.id)));
    }

    console.info(`[chara-collection] Catalog populated with ${state.charaListData.length} characters.`);
}

function resolveCardIconUrl(cardId) {
    return magicaUrl(`resource/image_native/card/image/card_${cardId}_f.png`);
}

function resolveFrameAssetUrl(filename) {
    return magicaUrl(`resource/image_native/card/frame/${filename}`);
}

let cardIntersectionObserver = null;

function setupCardIntersectionObserver(scrollContainer) {
    if (cardIntersectionObserver) {
        cardIntersectionObserver.disconnect();
    }

    cardIntersectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cardRow = entry.target;
                if (cardRow.getAttribute('data-loaded') === 'true') {
                    observer.unobserve(cardRow);
                    return;
                }
                cardRow.setAttribute('data-loaded', 'true');
                observer.unobserve(cardRow);

                const loadIconsFn = cardRow._loadIcons;
                if (typeof loadIconsFn === 'function') {
                    loadIconsFn();
                    delete cardRow._loadIcons;
                }
            }
        });
    }, {
        root: scrollContainer || document.getElementById('charaHiddenWrap'),
        rootMargin: '250px 0px 250px 0px',
        threshold: 0
    });
}

function appendCardIconIfValid(iconWrap, chara, charaId, rank, rawAtt, upperAtt) {
    const cardId = `${charaId}${rank}`;
    const url = resolveCardIconUrl(cardId);

    const img = new Image();
    img.alt = chara.name;

    const userIcon = document.createElement('div');
    userIcon.className = `userCharaIcon ${upperAtt} RANK_${rank}`;

    const iconAtt = document.createElement('span');
    iconAtt.className = 'att';
    iconAtt.style.backgroundImage = `url('${resolveFrameAssetUrl(`att_${rawAtt}.png`)}')`;

    const iconStar = document.createElement('span');
    iconStar.className = 'star';
    iconStar.style.backgroundImage = `url('${resolveFrameAssetUrl(`star_rank_${rank}.png`)}')`;

    const iconRank = document.createElement('span');
    iconRank.className = 'rank';
    iconRank.style.backgroundImage = `url('${resolveFrameAssetUrl(`frame_rank_${rank}.png`)}')`;

    const iconBg = document.createElement('span');
    iconBg.className = 'bg';
    iconBg.style.backgroundImage = `url('${resolveFrameAssetUrl(`bg_${rawAtt}.png`)}')`;

    userIcon.appendChild(iconAtt);
    userIcon.appendChild(iconStar);
    userIcon.appendChild(iconRank);
    userIcon.appendChild(img);
    userIcon.appendChild(iconBg);

    let appended = false;
    const show = () => {
        if (appended) return;
        appended = true;
        userIcon.setAttribute('data-rank', rank);
        const children = Array.from(iconWrap.children);
        const insertBeforeEl = children.find(child => Number(child.getAttribute('data-rank')) > rank);
        if (insertBeforeEl) {
            iconWrap.insertBefore(userIcon, insertBeforeEl);
        } else {
            iconWrap.appendChild(userIcon);
        }
    };

    img.onload = () => {
        img.onload = null;
        img.onerror = null;
        show();
    };
    img.onerror = () => {
        img.onload = null;
        img.onerror = null;
        // Do not add to DOM if rank icon image 404s
    };
    img.src = url;

    if (img.complete && img.naturalWidth !== 0) {
        show();
    }
}

let lastCollectionScrollTop = 0;

export function saveCollectionScrollPosition() {
    const scrollContainer = document.getElementById('charaHiddenWrap');
    if (scrollContainer) {
        lastCollectionScrollTop = scrollContainer.scrollTop;
    }
}

export function restoreCollectionScrollPosition() {
    const scrollContainer = document.getElementById('charaHiddenWrap');
    if (scrollContainer) {
        scrollContainer.scrollTop = lastCollectionScrollTop;
    }
}

export function applySearchFilter() {
    const searchInput = document.getElementById('charaSearchInput');
    if (!searchInput) return;

    const query = searchInput.value.toLowerCase().trim();
    const cardRows = document.querySelectorAll('#charaWrapInner .chara');

    cardRows.forEach(row => {
        const charaId = row.getAttribute('data-chara-id') || '';
        const nameText = (row.querySelector('.name')?.textContent || '').toLowerCase();
        const kanaText = (row.querySelector('.kana')?.textContent || '').toLowerCase();

        if (!query || nameText.includes(query) || kanaText.includes(query) || charaId.includes(query)) {
            row.classList.remove('search-hidden');
        } else {
            row.classList.add('search-hidden');
        }
    });
}

export async function renderCharaCollectionGrid() {
    const wrapInner = document.getElementById('charaWrapInner');
    if (!wrapInner) return;

    const scrollContainer = document.getElementById('charaHiddenWrap');
    setupCardIntersectionObserver(scrollContainer);

    if (scrollContainer && !scrollContainer.getAttribute('data-has-scroll-listener')) {
        scrollContainer.setAttribute('data-has-scroll-listener', 'true');
        scrollContainer.addEventListener('scroll', () => {
            lastCollectionScrollTop = scrollContainer.scrollTop;
        });
    }

    await loadCharaAttributes();
    if (!state.charaListData || state.charaListData.length === 0) {
        await fetchCharacterCatalog();
    }

    setupTabAreaListeners();
    setupSearchFilter();

    if (wrapInner.children.length > 0) {
        if (cardIntersectionObserver) {
            Array.from(wrapInner.children).forEach(cardRow => {
                if (cardRow.getAttribute('data-loaded') !== 'true') {
                    cardIntersectionObserver.observe(cardRow);
                }
            });
        }
        applySearchFilter();
        restoreCollectionScrollPosition();
        return;
    }

    wrapInner.innerHTML = '';

    const charaList = (state.charaListData || []).filter(c => !state.missingCharIds?.has(Number(c.id)));
    charaList.forEach(chara => {
        const charaId = chara.id;
        const rawAtt = (charaAttributes[charaId] || 'light').toLowerCase();
        const upperAtt = rawAtt.toUpperCase();

        const cardRow = document.createElement('div');
        cardRow.className = `chara commonFrame4 se_decide ${upperAtt}`;
        cardRow.setAttribute('data-chara-id', charaId);
        cardRow.setAttribute('data-name', chara.name);
        cardRow.setAttribute('data-att', rawAtt);

        // Build Name Wrap
        const nameWrap = document.createElement('div');
        nameWrap.className = 'nameWrap';

        const attSpan = document.createElement('span');
        attSpan.className = `att ${upperAtt}`;

        const nameP = document.createElement('p');
        nameP.className = 'name';
        nameP.textContent = chara.name;
        if (chara.title) {
            const titleSpan = document.createElement('span');
            titleSpan.className = 'title';
            titleSpan.textContent = chara.title;
            nameP.appendChild(titleSpan);
        }

        const kanaP = document.createElement('p');
        kanaP.className = 'kana';
        kanaP.textContent = chara.kana || chara.name;

        nameWrap.appendChild(attSpan);
        nameWrap.appendChild(nameP);
        nameWrap.appendChild(kanaP);

        // Build Card Icons Wrap
        const iconWrap = document.createElement('div');
        iconWrap.className = 'charaIconWrap';

        // Determine valid card ranks for this character
        let validRanks = [];
        if (Array.isArray(chara.cardList) && chara.cardList.length > 0) {
            validRanks = chara.cardList.map(item => {
                if (!item) return null;
                if (item.card && item.card.rank) {
                    const match = String(item.card.rank).match(/\d+/);
                    return match ? Number(match[0]) : null;
                }
                if (item.cardId) {
                    return Number(String(item.cardId).slice(-1));
                }
                return null;
            }).filter(Boolean);
        }

        if (validRanks.length === 0) {
            const startRank = chara.initialRank || (Number(charaId) >= 1002 && Number(charaId) <= 1005 ? 2 : 1);
            const endRank = chara.maxRank || 5;
            for (let r = startRank; r <= endRank; r++) {
                validRanks.push(r);
            }
        }

        const loadIcons = () => {
            validRanks.forEach(rank => {
                appendCardIconIfValid(iconWrap, chara, charaId, rank, rawAtt, upperAtt);
            });
        };

        if ('IntersectionObserver' in window && scrollContainer) {
            cardRow._loadIcons = loadIcons;
            cardIntersectionObserver.observe(cardRow);
        } else {
            loadIcons();
        }

        cardRow.appendChild(nameWrap);
        cardRow.appendChild(iconWrap);

        // Click event on card row navigates to CharaCollectionDetail
        cardRow.addEventListener('click', () => {
            saveCollectionScrollPosition();
            window.location.hash = `#/CharaCollectionDetail?id=${charaId}`;
        });

        wrapInner.appendChild(cardRow);
    });

    applySearchFilter();
    restoreCollectionScrollPosition();
}

function setupTabAreaListeners() {
    const tabBtns = document.querySelectorAll('#CharaCollection #tabArea .tabBtns li');
    const charaWrap = document.getElementById('charaWrap');
    if (!tabBtns || !charaWrap) return;

    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-has-listener')) return;
        btn.setAttribute('data-has-listener', 'true');
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            tabBtns.forEach(b => b.classList.remove('current'));
            btn.classList.add('current');

            const att = (btn.getAttribute('data-att') || 'ALL').toLowerCase();
            charaWrap.className = `commonFrame2 ${att}`;
        });
    });
}

function setupSearchFilter() {
    const searchInput = document.getElementById('charaSearchInput');
    if (!searchInput || searchInput.getAttribute('data-has-listener')) return;

    searchInput.setAttribute('data-has-listener', 'true');
    searchInput.addEventListener('input', () => {
        applySearchFilter();
    });
}

let collectionRequestToken = 0;

export async function enterCharaCollection({ onBeforeReveal, hadLive2d = false, fromCollectionTop = false, fromDetail = false } = {}) {
    const token = ++collectionRequestToken;

    if (fromDetail) {
        document.body.classList.remove('connecting');
        document.getElementById('ui-layer')?.classList.remove('home-mode', 'menu-closed');
        setBgWebcamVideo(null);
        setBgPortrait(false);

        await Promise.all([
            changeBg(COLLECTION_BG, { visible: true, autoplay: true, crossfadeMs: 0 }).catch((e) =>
                console.warn('[chara-collection] background error:', e)
            ),
            startBgm(COLLECTION_BGM, { autoplay: true }).catch((e) => console.warn('[chara-collection] bgm error:', e)),
            loadCharaAttributes(),
            (!state.charaListData || state.charaListData.length === 0) ? fetchCharacterCatalog() : Promise.resolve()
        ]);
        if (token !== collectionRequestToken) return;
    } else if (fromCollectionTop) {
        const preloadTask = Promise.all([
            preloadBg(COLLECTION_BG).catch((e) => console.warn('[chara-collection] background preload error:', e)),
            startBgm(COLLECTION_BGM, { autoplay: true }).catch((e) => console.warn('[chara-collection] bgm error:', e)),
            loadCharaAttributes(),
            (!state.charaListData || state.charaListData.length === 0) ? fetchCharacterCatalog() : Promise.resolve()
        ]);

        // Step 1: let the Archive right-side UI disappear first.
        await new Promise((r) => setTimeout(r, 60));
        if (token !== collectionRequestToken) return;

        // Step 2: show Connecting... while the Archive Live2D model is still on screen.
        document.body.classList.add('connecting');
        const connectStart = performance.now();

        await preloadTask;
        if (token !== collectionRequestToken) return;

        const connectElapsed = performance.now() - connectStart;
        if (connectElapsed < 180) {
            await new Promise((r) => setTimeout(r, 180 - connectElapsed));
        }
        if (token !== collectionRequestToken) return;

        // Step 3: while Connecting... is visible, clear the model instantly.
        document.getElementById('ui-layer')?.classList.remove('home-mode', 'menu-closed');
        setBgWebcamVideo(null);
        setBgPortrait(false);
        clearStageModels();

        const afterClearStart = performance.now();
        await changeBg(COLLECTION_BG, { visible: true, autoplay: true, crossfadeMs: 250, waitForCrossfade: true }).catch((e) =>
            console.warn('[chara-collection] background error:', e)
        );
        if (token !== collectionRequestToken) return;

        const afterClearElapsed = performance.now() - afterClearStart;
        if (afterClearElapsed < 150) {
            await new Promise((r) => setTimeout(r, 150 - afterClearElapsed));
        }
        if (token !== collectionRequestToken) return;

        // Step 4: hide Connecting... before Magical Girls Archive UI appears.
        document.body.classList.remove('connecting');
        await new Promise((r) => setTimeout(r, 60));
        if (token !== collectionRequestToken) return;
    } else {
        const step1Start = performance.now();
        await Promise.all([
            preloadBg(COLLECTION_BG).catch((e) => console.warn('[chara-collection] background preload error:', e)),
            startBgm(COLLECTION_BGM, { autoplay: true }).catch((e) => console.warn('[chara-collection] bgm error:', e)),
            loadCharaAttributes(),
            (!state.charaListData || state.charaListData.length === 0) ? fetchCharacterCatalog() : Promise.resolve()
        ]);
        if (token !== collectionRequestToken) return;

        if (hadLive2d) {
            const elapsed = performance.now() - step1Start;
            if (elapsed < 200) {
                await new Promise((r) => setTimeout(r, 200 - elapsed));
            }
            if (token !== collectionRequestToken) return;
        }

        document.getElementById('ui-layer')?.classList.remove('home-mode', 'menu-closed');
        setBgWebcamVideo(null);
        setBgPortrait(false);

        clearStageModels();
        await changeBg(COLLECTION_BG, { visible: true, autoplay: true, crossfadeMs: 250, waitForCrossfade: true }).catch((e) =>
            console.warn('[chara-collection] background error:', e)
        );
        if (token !== collectionRequestToken) return;
    }

    setStageContext({ mode: 'detail' });
    setStageXOffset(COLLECTION_X_OFFSET);
    if (typeof window.updateViewerViewport === 'function') {
        window.updateViewerViewport();
    }
    applySubtitlePlacement();

    document.body.classList.remove('connecting');
    const root = document.getElementById('CharaCollection');
    root?.classList.remove('fadein');
    if (typeof onBeforeReveal === 'function') {
        onBeforeReveal();
    }
    await renderCharaCollectionGrid();
    if (token !== collectionRequestToken) return;
    if (root) {
        void root.offsetWidth;
        root.classList.add('fadein');
    }
}

export function leaveCharaCollection() {
    collectionRequestToken++;
    document.getElementById('CharaCollection')?.classList.remove('fadein');
    saveCollectionScrollPosition();
}
