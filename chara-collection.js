// chara-collection.js — Character Collection grid selector view for quotes.html

import { state } from './model.js';

const CHARA_ATTRIBUTES_URL = new URL('./assets/charaAttributes.json', document.baseURI).href;
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
            fetch('https://raw.githubusercontent.com/Puella-Care/en-data/refs/heads/main/charaList.json').catch(() => null),
            fetch('https://raw.githubusercontent.com/Puella-Care/en-data/refs/heads/main/live2dList.json').catch(() => null)
        ]);

        let registeredChars = [];
        let registeredLive2d = [];

        if (charaResponse && charaResponse.ok) registeredChars = await charaResponse.json();
        if (live2dResponse && live2dResponse.ok) registeredLive2d = await live2dResponse.json();

        let missingChars = [];
        let missingLive2d = [];
        try {
            const [missingCharsResponse, missingLive2dResponse] = await Promise.all([
                fetch('assets/missingCharaList.json').catch(() => null),
                fetch('assets/missingLive2dList.json').catch(() => null)
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
    return `https://raw.githubusercontent.com/igi712/ma-re-data/main/resource/image_native/card/image/card_${cardId}_f.png`;
}

function resolveFrameAssetUrl(filename) {
    return `assets/ma-re-data/resource/image_native/card/frame/${filename}`;
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

    img.onload = () => show();
    img.onerror = () => {
        // Do not add to DOM if rank icon image 404s
    };
    img.src = url;

    if (img.complete && img.naturalWidth !== 0) {
        show();
    }
}

export async function renderCharaCollectionGrid() {
    const wrapInner = document.getElementById('charaWrapInner');
    if (!wrapInner) return;

    await loadCharaAttributes();
    if (!state.charaListData || state.charaListData.length === 0) {
        await fetchCharacterCatalog();
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

        validRanks.forEach(rank => {
            appendCardIconIfValid(iconWrap, chara, charaId, rank, rawAtt, upperAtt);
        });

        cardRow.appendChild(nameWrap);
        cardRow.appendChild(iconWrap);

        // Click event on card row navigates to CharaCollectionDetail
        cardRow.addEventListener('click', () => {
            window.location.hash = `#/CharaCollectionDetail?id=${charaId}`;
        });

        wrapInner.appendChild(cardRow);
    });

    setupTabAreaListeners();
    setupSearchFilter();
}

function setupTabAreaListeners() {
    const tabBtns = document.querySelectorAll('#CharaCollection #tabArea .tabBtns li');
    const charaWrap = document.getElementById('charaWrap');
    if (!tabBtns || !charaWrap) return;

    tabBtns.forEach(btn => {
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
        const query = searchInput.value.toLowerCase().trim();
        const cardRows = document.querySelectorAll('#charaWrapInner .chara');

        cardRows.forEach(row => {
            const charaId = row.getAttribute('data-chara-id') || '';
            const nameText = (row.querySelector('.name')?.textContent || '').toLowerCase();

            if (!query || nameText.includes(query) || charaId.includes(query)) {
                row.classList.remove('search-hidden');
            } else {
                row.classList.add('search-hidden');
            }
        });
    });
}
