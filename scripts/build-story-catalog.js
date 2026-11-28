#!/usr/bin/env node
/**
 * Build assets/storyCatalog.json and copy Story Collection image_web assets
 * into magica/resource/image_web/ (layering EN overlays over JP assets).
 *
 * Usage:
 *   node scripts/build-story-catalog.js --fetch-only  # Download community JSONs & EN image_web overlays to temp/
 *   node scripts/build-story-catalog.js               # Build assets/storyCatalog.json & copy assets (no network)
 */

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const PARENT = path.resolve(REPO, '..');

const CONNECT_DIR = path.join(PARENT, 'connect');
const EN_DATA_DIR = path.join(PARENT, 'assets', 'totentanz', 'en-data');
const PH_ROOT = path.join(PARENT, 'assets', 'puella-historia', 'magica');
const PH_IMG_DIR = path.join(PH_ROOT, 'resource', 'image_web');
const MAGIRECO_STATIC_IMG_DIR = path.join(PARENT, 'assets', 'MagiRecoStatic', 'magica', 'resource', 'image_web');
const TOTENTANZ_EN_IMG_DIR = path.join(PARENT, 'assets', 'totentanz', 'en-image_web', 'magica', 'resource', 'image_web');
const MARE_ADV_DIR = path.join(REPO, 'assets', 'ma-re-data', 'resource', 'scenario', 'json', 'adv');

const TEMP_DIR = path.join(REPO, 'temp');
const EN_IMG_CACHE_DIR = path.join(TEMP_DIR, 'en-image_web-cache', 'magica', 'resource', 'image_web');

const OUTPUT_CATALOG = path.join(REPO, 'assets', 'storyCatalog.json');
const OUTPUT_IMG_DIR = path.join(REPO, 'magica', 'resource', 'image_web');

const COMMUNITY_JSON_URLS = {
    'puellaStoryList.json': 'https://github.com/user-attachments/files/29160648/puellaStoryList.json',
    'campaignStoryList.json': 'https://github.com/user-attachments/files/29240624/campaignStoryList.json',
    'eventStoryList.json': 'https://github.com/user-attachments/files/29240625/eventStoryList.json',
};

const EN_IMAGE_WEB_RAW_BASE = 'https://raw.githubusercontent.com/Puella-Care/en-image_web/main/magica/resource/image_web/';
const EN_IMAGE_WEB_TREE_API = 'https://api.github.com/repos/Puella-Care/en-image_web/git/trees/main?recursive=1';

const DIRECT_EN_SPRITES = [
    'page/collection/btn_restart_off.png',
    'page/collection/btn_restart_on.png',
    'page/collection/btn_continue_off.png',
    'page/collection/btn_continue_on.png',
    'page/quest/puellaHistoria/archives/story_collection_commontitle.png',
];

// Hardcoded section 103305 story IDs from original StoryCollection.js
const SECTION_103305_STORIES = [
    '103305-1_eP5wU', '103305-3_eP5wU', '103305-4_eP5wU', '103305-5_eP5wU',
    '103305-6_eP5wU', '103305-7_eP5wU', '103305-10_eP5wU', '103305-11_eP5wU',
    '103305-8_eP5wU', '103305-9_eP5wU', '103305-12_eP5wU', '103305-13_eP5wU',
    '103305-14_eP5wU', '103305-15_eP5wU', '103305-16_eP5wU', '103305-17_eP5wU',
    '103305-18_eP5wU', '103305-19_eP5wU',
];

// Hardcoded Pillar of Tomorrow list from puellaHistoria/lastBattle/Utility.js
const PILLAR_OF_TOMORROW_STORIES = {
    event: [
        { storyId: '519810-0', storyTitle: 'Ep.1' },
        { storyId: '104101-1', storyTitle: 'Ep.2', secret: 'KaoO4' },
        { storyId: '104101-2', storyTitle: 'Ep.3', secret: 'KaoO4' },
        { storyId: '104101-3', storyTitle: 'Ep.4', secret: 'KaoO4' },
        { storyId: '104101-4', storyTitle: 'Ep.5', secret: 'KaoO4' },
        { storyId: '104101-5', storyTitle: 'Ep.6', secret: 'KaoO4' },
        { storyId: '104101-6', storyTitle: 'Ep.7', secret: 'KaoO4' },
        { storyId: '104101-7', storyTitle: 'Ep.8', secret: 'KaoO4' },
        { storyId: '519810-1', storyTitle: 'Ep.9' },
        { storyId: '519810-2', storyTitle: 'Epilogue' },
    ],
    special: [
        { storyId: '519810-11_YcZ2I', charaId: 1045, storyTitle: '水名 露' },
        { storyId: '519810-12_YcZ2I', charaId: 1046, storyTitle: '千鶴' },
        { storyId: '519810-13_YcZ2I', charaId: 1048, storyTitle: 'エボニー' },
        { storyId: '519810-14_YcZ2I', charaId: 1049, storyTitle: 'オルガ' },
        { storyId: '519810-15_YcZ2I', charaId: 1050, storyTitle: 'ガンヒルト' },
        { storyId: '519810-16_YcZ2I', charaId: 1051, storyTitle: 'ヘルカ' },
        { storyId: '519810-17_YcZ2I', charaId: 1052, storyTitle: 'トヨ' },
        { storyId: '519810-18_YcZ2I', charaId: 1053, storyTitle: 'アマリュリス' },
    ],
};

function readJson(filePath, fallback = null) {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    return JSON.parse(raw);
}

function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

async function downloadBuffer(url) {
    const res = await fetch(url, {
        headers: { 'User-Agent': 'our-record-story-catalog-builder' },
        redirect: 'follow',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return Buffer.from(await res.arrayBuffer());
}

async function fetchAssetsToTemp() {
    ensureDir(TEMP_DIR);
    ensureDir(EN_IMG_CACHE_DIR);

    for (const [filename, url] of Object.entries(COMMUNITY_JSON_URLS)) {
        const dest = path.join(TEMP_DIR, filename);
        try {
            const buf = await downloadBuffer(url);
            JSON.parse(buf.toString('utf8').replace(/^\uFEFF/, ''));
            fs.writeFileSync(dest, buf);
            console.log(`[fetch] Saved ${filename} (${(buf.length / 1024).toFixed(1)} KB)`);
        } catch (err) {
            console.error(`[fetch] Failed ${filename}: ${err.message}`);
            throw err;
        }
    }

    const toFetch = new Set(DIRECT_EN_SPRITES);
    try {
        const res = await fetch(EN_IMAGE_WEB_TREE_API, {
            headers: {
                'User-Agent': 'our-record-story-catalog-builder',
                Accept: 'application/vnd.github+json',
            },
        });
        if (res.ok) {
            const tree = await res.json();
            const prefix = 'magica/resource/image_web/';
            for (const entry of tree.tree || []) {
                if (entry.type !== 'blob' || !entry.path.startsWith(prefix)) continue;
                const rel = entry.path.slice(prefix.length);
                if (
                    /^page\/collection\/btn_(restart|continue)_(on|off)\.png$/i.test(rel) ||
                    /^page\/collection\/storyCollection\/.+\.png$/i.test(rel) ||
                    /^page\/quest\/puellaHistoria.*\.png$/i.test(rel) ||
                    /\/story_collection_title\.png$/i.test(rel) ||
                    /\/quest_header_.*\.png$/i.test(rel) ||
                    /\/story_collection_header\.png$/i.test(rel)
                ) {
                    toFetch.add(rel);
                }
            }
        } else {
            console.warn(`[fetch] GitHub tree API returned ${res.status}; using direct sprite list only.`);
        }
    } catch (err) {
        console.warn(`[fetch] GitHub tree API failed (${err.message}); using direct sprite list only.`);
    }

    let okCount = 0;
    let missCount = 0;
    const list = Array.from(toFetch);
    const concurrency = 8;
    let idx = 0;
    await Promise.all(
        Array.from({ length: concurrency }, async () => {
            while (idx < list.length) {
                const rel = list[idx++];
                const dest = path.join(EN_IMG_CACHE_DIR, ...rel.split('/'));
                try {
                    const buf = await downloadBuffer(EN_IMAGE_WEB_RAW_BASE + rel);
                    ensureDir(path.dirname(dest));
                    fs.writeFileSync(dest, buf);
                    okCount++;
                } catch {
                    missCount++;
                }
            }
        })
    );
    console.log(`[fetch] EN image_web overlays: downloaded ${okCount}, absent/skipped ${missCount}`);
}

function indexScenarioFilesBySection() {
    const map = new Map();
    if (!fs.existsSync(MARE_ADV_DIR)) return map;
    for (const sub of fs.readdirSync(MARE_ADV_DIR, { withFileTypes: true })) {
        if (!sub.isDirectory()) continue;
        const dirPath = path.join(MARE_ADV_DIR, sub.name);
        for (const f of fs.readdirSync(dirPath)) {
            if (!f.endsWith('.json')) continue;
            const id = f.slice(0, -5);
            const dash = id.indexOf('-');
            if (dash <= 0) continue;
            const secId = Number(id.slice(0, dash));
            if (!Number.isFinite(secId)) continue;
            if (!map.has(secId)) map.set(secId, []);
            map.get(secId).push(id);
        }
    }
    for (const arr of map.values()) {
        arr.sort((a, b) => {
            const epA = parseInt(a.split('-')[1], 10) || 0;
            const epB = parseInt(b.split('-')[1], 10) || 0;
            if (epA !== epB) return epA - epB;
            return a.localeCompare(b);
        });
    }
    return map;
}

function formatChapterLabel(chapterNoForView) {
    const raw = String(chapterNoForView ?? '').trim();
    if (!raw || raw === '序章' || raw.toLowerCase() === 'prologue') return 'Prologue';
    const jpMatch = /^第(\d+)章$/.exec(raw);
    if (jpMatch) return `Ch.${jpMatch[1]}`;
    if (/^\d+$/.test(raw)) return `Ch.${raw}`;
    return raw;
}

function formatEpTitle(rawTitle) {
    if (!rawTitle) return rawTitle;
    const s = String(rawTitle).trim();
    if (s === '序' || s === 'プロローグ') return 'Prologue';
    const m = /^(\d+)話$/.exec(s);
    if (m) return `Ep.${m[1]}`;
    return s;
}

function normalizeOutline(text) {
    if (!text) return '';
    return String(text).replace(/＠/g, '\n');
}

function buildStoryArrFromBattles(battles, secret) {
    const arr = [];
    const suffix = secret ? `_${secret}` : '';
    const sorted = battles.slice().sort((a, b) => a.questBattleId - b.questBattleId);
    for (const b of sorted) {
        const qb = b.questBattle;
        if (!qb) continue;
        if (qb.startStory) arr.push(qb.startStory + suffix);
        if (Array.isArray(qb.questStoryList)) {
            for (const s of qb.questStoryList) {
                if (s) arr.push(s + suffix);
            }
        }
        if (qb.endStory) arr.push(qb.endStory + suffix);
    }
    return arr;
}

function buildStoryCatalog() {
    const userChapters = readJson(path.join(CONNECT_DIR, 'userChapterList.json'), []);
    const userSections = readJson(path.join(CONNECT_DIR, 'userSectionList.json'), []);
    const userBattles = readJson(path.join(CONNECT_DIR, 'userQuestBattleList.json'), []);
    const sectionStills = readJson(path.join(CONNECT_DIR, 'sectionStillList.json'), []);
    const connectArena = readJson(path.join(CONNECT_DIR, 'arenaBattleFreeRankClassList.json'), []);
    const connectLive2d = readJson(path.join(CONNECT_DIR, 'userLive2dList.json'), []);

    const puellaSource = readJson(path.join(TEMP_DIR, 'puellaStoryList.json')) ||
        readJson(path.join(CONNECT_DIR, 'puellaStoryList.json'), []);
    const campaignSource = readJson(path.join(TEMP_DIR, 'campaignStoryList.json')) ||
        readJson(path.join(CONNECT_DIR, 'campaignStoryList.json'), []);
    const eventSource = readJson(path.join(TEMP_DIR, 'eventStoryList.json')) ||
        readJson(path.join(CONNECT_DIR, 'eventStoryList.json'), []);

    const enChapterList = readJson(path.join(EN_DATA_DIR, 'chapterList.json'), []);
    const enSectionList = readJson(path.join(EN_DATA_DIR, 'sectionList.json'), []);
    const enEventMapObj = readJson(path.join(EN_DATA_DIR, 'eventStoryMap.json'), {});
    const enStoryMapObj = readJson(path.join(EN_DATA_DIR, 'storyMap.json'), {});
    const enArenaList = readJson(path.join(EN_DATA_DIR, 'arenaBattleFreeRankClassList.json'), []);
    const enCharaList = readJson(path.join(EN_DATA_DIR, 'charaList.json'), []);
    const enLive2dList = readJson(path.join(EN_DATA_DIR, 'live2dList.json'), []);

    const charaCards = readJson(path.join(REPO, 'assets', 'charaCards.json'), []);
    const missingCharaList = readJson(path.join(REPO, 'assets', 'missingCharaList.json'), []);
    const missingCharaIds = new Set(missingCharaList.map((c) => Number(c.id)));

    const enChapterById = new Map(enChapterList.map((c) => [Number(c.chapterId), c]));
    const enSectionById = new Map(enSectionList.map((s) => [Number(s.sectionId), s]));
    const enEventById = new Map(Object.entries(enEventMapObj));
    const enStoryById = new Map(Object.entries(enStoryMapObj));
    const enArenaByClass = new Map(enArenaList.map((a) => [a.arenaBattleFreeRankClass, a]));
    const enCharaById = new Map(enCharaList.map((c) => [Number(c.id), c]));

    const charaByName = new Map();
    const defaultCardByCharaId = new Map();
    for (const c of enCharaList) {
        if (c.name) charaByName.set(c.name, c.id);
        if (c.defaultCardId) defaultCardByCharaId.set(Number(c.id), Number(c.defaultCardId));
    }
    for (const c of charaCards) {
        const cid = Number(c.charaId);
        if (!defaultCardByCharaId.has(cid) && c.defaultCardId) {
            defaultCardByCharaId.set(cid, Number(c.defaultCardId));
        }
    }

    const live2dDescMap = new Map();
    for (const l of enLive2dList) {
        live2dDescMap.set(`${Number(l.charaId)}-${String(l.live2dId).padStart(2, '0')}`, l.description);
    }
    for (const l of connectLive2d) {
        const key = `${Number(l.charaId)}-${String(l.live2dId).padStart(2, '0')}`;
        if (!live2dDescMap.has(key) && l.live2d?.description) {
            live2dDescMap.set(key, l.live2d.description);
        }
    }

    const battlesBySection = new Map();
    for (const b of userBattles) {
        const sid = Number(b.questBattle?.sectionId);
        if (!Number.isFinite(sid)) continue;
        if (!battlesBySection.has(sid)) battlesBySection.set(sid, []);
        battlesBySection.get(sid).push(b);
    }

    const scenarioFilesBySection = indexScenarioFilesBySection();

    // --- 1. Stills (Main Story CG Galleries) ---
    const stillsBySection = new Map();
    for (const st of sectionStills) {
        const m = /IMAGE_PATH=([^;]+)/.exec(st.viewParameters || '');
        if (!m) continue;
        const imgs = m[1].split(',').map((s) => s.trim()).filter(Boolean);
        if (imgs.length) stillsBySection.set(Number(st.sectionId), imgs);
    }

    const stills = [];
    const galleryChapterIds = new Set();
    for (const uc of userChapters) {
        if (uc.chapter?.questType !== 'MAIN') continue;
        const cid = Number(uc.chapterId);
        const secs = userSections
            .filter((s) => Number(s.section?.genericId) === cid)
            .sort((a, b) => a.sectionId - b.sectionId);
        const stillList = [];
        for (const s of secs) {
            const imgs = stillsBySection.get(Number(s.sectionId));
            if (imgs) stillList.push(...imgs);
        }
        if (stillList.length) {
            const enCh = enChapterById.get(cid);
            const chLabel = formatChapterLabel(enCh?.chapterNoForView ?? uc.chapter.chapterNoForView);
            const partNo = uc.chapter.partNo || 1;
            galleryChapterIds.add(cid);
            stills.push({
                chapterId: cid,
                partNo,
                title: `Main Story 【Arc ${partNo}】  ${chLabel}`,
                stillList,
            });
        }
    }
    stills.sort((a, b) => a.chapterId - b.chapterId);

    // --- 2. Main Story & Another Story (main, mainSecond, sub, subSecond) ---
    const userChapterMap = new Map(userChapters.map((c) => [Number(c.chapterId), c]));
    const userSectionMap = new Map(userSections.map((s) => [Number(s.sectionId), s]));

    function buildChapterAndSections(chapterId, questType, partNo) {
        const uc = userChapterMap.get(chapterId);
        const enCh = enChapterById.get(chapterId);
        const chapterNoForView = enCh?.chapterNoForView ?? uc?.chapter?.chapterNoForView ?? String(chapterId);
        const chapterLabel = formatChapterLabel(chapterNoForView);
        const title = enCh?.title ?? uc?.chapter?.title ?? `Chapter ${chapterId}`;

        // Gather section IDs from connect + en-data prefix convention (10XXYY for MAIN, 20XXYY for SUB)
        const secMap = new Map();
        for (const us of userSections) {
            if (Number(us.section?.genericId) === chapterId) {
                secMap.set(Number(us.sectionId), us);
            }
        }
        const prefix = questType === 'MAIN' ? `10${String(chapterId).padStart(2, '0')}` : `20${String(chapterId).padStart(2, '0')}`;
        for (const enSec of enSectionList) {
            const sidStr = String(enSec.sectionId);
            if (sidStr.length === 6 && sidStr.startsWith(prefix) && !secMap.has(Number(enSec.sectionId))) {
                secMap.set(Number(enSec.sectionId), null);
            }
        }

        const sectionList = [];
        const sortedIds = Array.from(secMap.keys()).sort((a, b) => a - b);
        for (const sid of sortedIds) {
            const us = secMap.get(sid);
            const enSec = enSectionById.get(sid);
            const sec = us?.section;

            const sectionNo = sec?.genericIndex ?? (sid % 100);
            const secTitle = enSec?.title ?? sec?.title ?? `Episode ${sectionNo}`;
            const outline = normalizeOutline(enSec?.outline ?? sec?.outline ?? '');
            let outlineCardId = sec?.defaultCardId ? Number(sec.defaultCardId) : null;
            if (!outlineCardId && enSec?.charaName) {
                const cid = charaByName.get(enSec.charaName);
                if (cid && defaultCardByCharaId.has(cid)) {
                    outlineCardId = defaultCardByCharaId.get(cid);
                }
            }
            if (!outlineCardId) outlineCardId = 10011;

            let storyArr;
            if (sid === 103305) {
                storyArr = SECTION_103305_STORIES.slice();
            } else {
                const rawBattles = (battlesBySection.get(sid) || []).filter(
                    (b) => !b.questBattle?.questBattleType || b.questBattle.questBattleType !== 'HARD'
                );
                storyArr = buildStoryArrFromBattles(rawBattles, sec?.secret);
                if (storyArr.length === 0 && scenarioFilesBySection.has(sid)) {
                    storyArr = scenarioFilesBySection.get(sid).slice();
                }
            }

            const sectionLabel = chapterLabel === 'Prologue'
                ? `Prologue: Ep.${sectionNo}`
                : `${chapterLabel}: Ep.${sectionNo}`;
            const outlineTitle = chapterLabel === 'Prologue'
                ? `Story up to Prologue Ep.${sectionNo}`
                : `Story up to ${chapterLabel} Ep.${sectionNo}`;

            const entry = {
                sectionId: sid,
                sectionNo,
                sectionLabel,
                title: secTitle,
                outlineTitle,
                outline,
                outlineCardId,
                storyArr,
            };
            if (sid === 103305) entry.hasMirrorBattle = true;
            sectionList.push(entry);
        }

        return {
            chapterId,
            partNo,
            questType,
            chapterLabel,
            title,
            hasGallery: galleryChapterIds.has(chapterId),
            sectionList,
        };
    }

    const main = [];
    const mainSecond = [];
    const sub = [];
    const subSecond = [];

    const allMainIds = new Set(
        userChapters
            .filter((c) => c.chapter?.questType === 'MAIN' && (c.chapter.partNo === 1 || c.chapter.partNo === 2))
            .map((c) => Number(c.chapterId))
    );
    allMainIds.add(33); // Arc 2 Ch.12

    for (const cid of Array.from(allMainIds).sort((a, b) => a - b)) {
        const uc = userChapterMap.get(cid);
        const partNo = cid === 33 ? 2 : (uc?.chapter?.partNo || 1);
        const built = buildChapterAndSections(cid, 'MAIN', partNo);
        if (partNo === 1) main.push(built);
        else mainSecond.push(built);
    }

    const allSubIds = new Set(
        userChapters
            .filter((c) => c.chapter?.questType === 'SUB')
            .map((c) => Number(c.chapterId))
    );
    for (let cid = 71; cid <= 81; cid++) allSubIds.add(cid);

    for (const cid of Array.from(allSubIds).sort((a, b) => a - b)) {
        const uc = userChapterMap.get(cid);
        const partNo = cid >= 71 ? 2 : (uc?.chapter?.partNo || 1);
        const built = buildChapterAndSections(cid, 'SUB', partNo);
        if (partNo === 1) sub.push(built);
        else subSecond.push(built);
    }

    // --- 3. Puella Historia ---
    const puellaHistoria = [];

    // 3a. Present Day Kamihama (eventId: 0)
    {
        const ph99Sections = userSections
            .filter((s) => Number(s.section?.viewParameterMap?.PUELLAHISTORIA_NORMAL_NUM) === 99)
            .sort((a, b) => a.sectionId - b.sectionId);
        const quests = [];
        for (const us of ph99Sections) {
            const secret = us.section?.secret;
            const bList = (battlesBySection.get(Number(us.sectionId)) || [])
                .slice()
                .sort((a, b) => a.questBattleId - b.questBattleId);
            for (const b of bList) {
                if (!b.questBattle?.startStory) continue;
                const storyIds = secret ? `${b.questBattle.startStory}_${secret}` : b.questBattle.startStory;
                quests.push(storyIds);
            }
        }
        const storyList = quests.map((storyIds, idx) => ({
            storyTitle: idx === 0 ? 'Prologue' : `Ep.${idx}`,
            storyIds,
        }));
        if (storyList.length) {
            puellaHistoria.push({
                eventId: 0,
                eventName: 'Present Day Kamihama',
                banner: 'page/quest/puellaHistoria/archives/story_collection_commontitle.png',
                storyList,
            });
        }
    }

    // 3b. Historical Arcs from puellaStoryList.json
    const phMiddle = Array.isArray(puellaSource) ? puellaSource : [];
    for (const item of phMiddle.slice().sort((a, b) => Number(a.eventId) - Number(b.eventId))) {
        const eventType = String(item.eventType || 'DAILYTOWER').toLowerCase();
        const storyList = (item.storyList || []).map((st) => {
            const mapped = enStoryById.get(String(st.storyIds));
            const title = mapped?.storyTitle || formatEpTitle(st.storyTitle);
            return {
                storyTitle: title,
                storyIds: String(st.storyIds || ''),
            };
        });
        if (!storyList.length) continue;
        puellaHistoria.push({
            eventId: Number(item.eventId),
            eventName: enEventById.get(String(item.eventId)) || item.eventName || `Puella Historia ${item.eventId}`,
            banner: `event/${eventType}/${item.eventId}/story_collection_title.png`,
            storyList,
        });
    }

    // 3c. Pillar of Tomorrow (eventId: 99)
    {
        const storyList = [];
        for (const item of PILLAR_OF_TOMORROW_STORIES.event) {
            const storyIds = item.secret ? `${item.storyId}_${item.secret}` : item.storyId;
            const mapped = enStoryById.get(storyIds);
            storyList.push({
                storyTitle: mapped?.storyTitle || item.storyTitle,
                storyIds,
            });
        }
        for (const item of PILLAR_OF_TOMORROW_STORIES.special) {
            const mapped = enStoryById.get(item.storyId);
            const ch = enCharaById.get(item.charaId);
            storyList.push({
                storyTitle: mapped?.storyTitle || ch?.name || item.storyTitle,
                storyIds: item.storyId,
            });
        }
        puellaHistoria.push({
            eventId: 99,
            eventName: 'Pillar of Tomorrow',
            banner: 'page/quest/puellaHistoria_lastBattle/event/1198/story_collection_title.png',
            storyList,
        });
    }

    // --- 4. Magical Girl Stories (chara) ---
    const charaSectionsByCharaId = new Map();
    const seenCharaSectionIds = new Set();

    function addCharaSection(cid, entry) {
        if (!charaSectionsByCharaId.has(cid)) charaSectionsByCharaId.set(cid, []);
        charaSectionsByCharaId.get(cid).push(entry);
        seenCharaSectionIds.add(entry.sectionId);
    }

    for (const us of userSections) {
        const sec = us.section;
        if (!sec) continue;
        const sid = Number(us.sectionId);
        const enSec = enSectionById.get(sid);
        if (sec.questType === 'CHARA') {
            const cid = Number(sec.genericId);
            const ch = enCharaById.get(cid);
            const suffix = ch?.title ? ` (${ch.title})` : '';
            const rawTitle = enSec?.title ?? sec.title ?? `Ep.${sec.genericIndex}`;
            const rawBattles = battlesBySection.get(sid) || [];
            let storyArr = buildStoryArrFromBattles(rawBattles, sec.secret);
            if (!storyArr.length && scenarioFilesBySection.has(sid)) {
                storyArr = scenarioFilesBySection.get(sid).slice();
            }
            addCharaSection(cid, {
                sectionId: sid,
                sectionNo: `Ep.${sec.genericIndex}`,
                title: `${rawTitle}${suffix}`,
                storyArr,
            });
        } else if (sec.questType === 'COSTUME') {
            const cid = Number(sec.charaId);
            const ch = enCharaById.get(cid);
            const suffix = ch?.title ? ` (${ch.title})` : '';
            const live2dId = String(sec.genericId).slice(-2).padStart(2, '0');
            const desc = live2dDescMap.get(`${cid}-${live2dId}`) || `Costume (${live2dId})`;
            const rawTitle = enSec?.title ?? sec.title ?? desc;
            const rawBattles = battlesBySection.get(sid) || [];
            let storyArr = buildStoryArrFromBattles(rawBattles, sec.secret);
            if (!storyArr.length && scenarioFilesBySection.has(sid)) {
                storyArr = scenarioFilesBySection.get(sid).slice();
            }
            addCharaSection(cid, {
                sectionId: sid,
                sectionNo: desc,
                title: `${rawTitle}${suffix}`,
                storyArr,
            });
        }
    }

    // Fill remaining 3xxxxx (CHARA) and 7xxxxx (COSTUME) sections from totentanz/en-data/sectionList.json
    for (const enSec of enSectionList) {
        const sid = Number(enSec.sectionId);
        if (seenCharaSectionIds.has(sid)) continue;
        if (sid >= 300000 && sid < 400000) {
            const cid = Math.floor((sid - 300000) / 10);
            if (!enCharaById.has(cid)) continue;
            const epNo = sid % 10;
            const ch = enCharaById.get(cid);
            const suffix = ch?.title ? ` (${ch.title})` : '';
            addCharaSection(cid, {
                sectionId: sid,
                sectionNo: `Ep.${epNo}`,
                title: `${enSec.title}${suffix}`,
                storyArr: scenarioFilesBySection.get(sid)?.slice() || [`${sid}-1`],
            });
        } else if (sid >= 700000 && sid < 800000) {
            const cid = Math.floor((sid - 700000) / 10);
            if (!enCharaById.has(cid)) continue;
            const ch = enCharaById.get(cid);
            const suffix = ch?.title ? ` (${ch.title})` : '';
            addCharaSection(cid, {
                sectionId: sid,
                sectionNo: 'Costume Story',
                title: `${enSec.title}${suffix}`,
                storyArr: scenarioFilesBySection.get(sid)?.slice() || [`${sid}-1`],
            });
        }
    }

    const chara = [];
    for (const ch of enCharaList.slice().sort((a, b) => Number(a.id) - Number(b.id))) {
        const cid = Number(ch.id);
        if (missingCharaIds.has(cid)) continue;
        const sectionList = charaSectionsByCharaId.get(cid);
        if (!sectionList || sectionList.length === 0) continue;
        sectionList.sort((a, b) => a.sectionId - b.sectionId);
        const displayCardId = defaultCardByCharaId.get(cid) || Number(`${cid}1`);
        chara.push({
            chapterId: cid,
            title: ch.title ? `${ch.name} (${ch.title})` : ch.name,
            displayCardId,
            sectionList,
        });
    }

    // --- 5. Mirrors Story (arena) ---
    const arena = connectArena
        .slice()
        .sort((a, b) => b.sortKey - a.sortKey)
        .map((a) => {
            const enA = enArenaByClass.get(a.arenaBattleFreeRankClass);
            const className = enA?.className || a.className;
            const storyTitle = enA?.storyTitle || className;
            return {
                chapterId: a.arenaBattleFreeRankClass,
                title: className,
                sectionList: [
                    {
                        sectionId: a.openConditionSectionId,
                        sectionNo: className,
                        title: storyTitle,
                        storyArr: [a.storyId],
                    },
                ],
            };
        });

    // --- 6. Event Stories (event) ---
    const rawEvents = Array.isArray(eventSource) ? eventSource.map((e) => ({ ...e })) : [];
    const has2019 = rawEvents.some((e) => Number(e.regularEventId) === 2019);
    if (!has2019) {
        const idx1164 = rawEvents.findIndex((e) => Number(e.eventId) === 1164);
        const insertIdx = idx1164 >= 0 ? idx1164 : rawEvents.length;
        rawEvents.splice(insertIdx, 0, {
            regularEventId: 2019,
            eventName: 'Kimochi Battle Special Edition: Alina Eve',
            regularEventType: 'GROUPBATTLE',
            storyList: [{ storyTitle: 'OP', storyIds: '420191-0' }],
        });
    }

    const event = [];
    for (const ev of rawEvents) {
        if (!Array.isArray(ev.storyList) || ev.storyList.length === 0) continue;
        const isRegular = !ev.eventId && Boolean(ev.regularEventId);
        const id = Number(isRegular ? ev.regularEventId : ev.eventId);
        const rawType = String(isRegular ? ev.regularEventType : ev.eventType || '');
        const eventKind = isRegular ? 'regularEvent' : 'event';
        let eventDir = rawType.toLowerCase();
        if (rawType === 'ARENAMISSION') eventDir = 'arenaMission';
        else if (rawType === 'GROUPBATTLE') eventDir = 'groupBattle';
        else if (rawType === 'WITCH') eventDir = 'eventWitch';

        const eventName = enEventById.get(String(id)) || ev.eventName || `Event ${id}`;
        const storyList = ev.storyList.map((st) => {
            const mapped = enStoryById.get(String(st.storyIds));
            const out = {
                storyTitle: mapped?.storyTitle || formatEpTitle(st.storyTitle),
                storyIds: String(st.storyIds || ''),
            };
            if (st.charaId != null) out.charaId = st.charaId;
            if (mapped?.pointTitle || st.pointTitle) {
                out.pointTitle = mapped?.pointTitle || st.pointTitle;
            }
            return out;
        });

        event.push({
            id,
            isRegular,
            eventType: rawType,
            eventName,
            banner: `${eventKind}/${eventDir}/${id}/story_collection_title.png`,
            storyList,
        });
    }

    // --- 7. Battle Museum (accomplish) ---
    const accomplish = [
        {
            chapterId: 2013,
            title: 'Prologue',
            displayCardId: null,
            sectionList: [
                {
                    sectionId: 2013,
                    sectionNo: 'OP',
                    title: 'Prologue',
                    storyArr: ['420131-0'],
                },
            ],
        },
    ];
    const regAccSections = userSections
        .filter((s) => s.section?.questType === 'REG_ACC')
        .sort((a, b) => a.sectionId - b.sectionId);
    for (const us of regAccSections) {
        const sid = Number(us.sectionId);
        const enSec = enSectionById.get(sid);
        const title = enSec?.title || us.section.title;
        const bList = (battlesBySection.get(sid) || [])
            .filter((b) => b.questBattle?.startStory)
            .sort((a, b) => a.questBattleId - b.questBattleId);
        let displayCardId = null;
        const sectionList = [];
        let ep = 1;
        for (let i = 0; i < bList.length; i++) {
            const qb = bList[i].questBattle;
            if (qb.parameterMap?.CARDID) displayCardId = Number(qb.parameterMap.CARDID);
            const floor = qb.parameterMap?.FLOOR;
            sectionList.push({
                sectionId: sid,
                sectionNo: floor ? `Stage${floor}` : `Stage${i + 1}`,
                title: `Ep.${ep++}`,
                storyArr: [qb.startStory],
            });
        }
        if (sectionList.length) {
            accomplish.push({
                chapterId: sid,
                title,
                displayCardId,
                sectionList,
            });
        }
    }

    // --- 8. Special / Campaign Stories (special) ---
    const special = [];
    const sortedCampaigns = (Array.isArray(campaignSource) ? campaignSource : [])
        .slice()
        .sort((a, b) => Number(b.campaignId) - Number(a.campaignId));
    for (const camp of sortedCampaigns) {
        if (!Array.isArray(camp.storyList) || camp.storyList.length === 0) continue;
        const cid = Number(camp.campaignId);
        const storyList = camp.storyList.map((st) => {
            const mapped = enStoryById.get(String(st.storyIds));
            return {
                storyTitle: mapped?.storyTitle || formatEpTitle(st.storyTitle),
                storyIds: String(st.storyIds || ''),
            };
        });
        special.push({
            campaignId: cid,
            eventName: enEventById.get(String(cid)) || `Special ${cid}`,
            banner: `campaign/story/${cid}/story_collection_title.png`,
            storyList,
        });
    }

    return {
        main,
        mainSecond,
        puellaHistoria,
        sub,
        subSecond,
        chara,
        arena,
        event,
        accomplish,
        special,
        stills,
    };
}

function findOverlaySource(relPosix) {
    const parts = relPosix.split('/');
    for (const root of [EN_IMG_CACHE_DIR, TOTENTANZ_EN_IMG_DIR, MAGIRECO_STATIC_IMG_DIR, PH_IMG_DIR]) {
        const candidate = path.join(root, ...parts);
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
            return candidate;
        }
    }
    return null;
}

function copyImageAssets(catalog) {
    const needed = new Set([
        'common/btn/btn_m_white.png',
        'page/collection/btn_restart_off.png',
        'page/collection/btn_restart_on.png',
        'page/collection/btn_continue_off.png',
        'page/collection/btn_continue_on.png',
        'event/branch/common/quest_header_9900.png',
        'event/eventWitch/common/story_collection_header.png',
    ]);

    const scDir = path.join(PH_IMG_DIR, 'page', 'collection', 'storyCollection');
    if (fs.existsSync(scDir)) {
        for (const f of fs.readdirSync(scDir)) {
            if (f.endsWith('.png')) needed.add(`page/collection/storyCollection/${f}`);
        }
    }

    for (const g of catalog.stills) {
        for (const img of g.stillList) {
            needed.add(`thumbnail/${img.replace(/\.jpg$/i, '.png')}`);
        }
    }

    for (const ph of catalog.puellaHistoria) {
        if (ph.banner) needed.add(ph.banner);
    }

    for (const ev of catalog.event) {
        if (ev.banner) needed.add(ev.banner);
        if (ev.eventType === 'BRANCH') {
            for (const st of ev.storyList) {
                if (st.charaId != null && Number(st.charaId) !== 9900) {
                    needed.add(`event/branch/${ev.id}/quest_header_${st.charaId}.png`);
                }
            }
        }
    }

    for (const sp of catalog.special) {
        if (sp.banner) needed.add(sp.banner);
    }

    let copied = 0;
    let totalBytes = 0;
    const missing = [];

    for (const rel of Array.from(needed).sort()) {
        const src = findOverlaySource(rel);
        if (!src) {
            missing.push(rel);
            continue;
        }
        const dest = path.join(OUTPUT_IMG_DIR, ...rel.split('/'));
        ensureDir(path.dirname(dest));
        fs.copyFileSync(src, dest);
        copied++;
        totalBytes += fs.statSync(dest).size;
    }

    return { copied, totalBytes, missing };
}

async function main() {
    const fetchOnly = process.argv.includes('--fetch-only');
    if (fetchOnly) {
        await fetchAssetsToTemp();
        return;
    }

    const catalog = buildStoryCatalog();
    ensureDir(path.dirname(OUTPUT_CATALOG));
    const json = JSON.stringify(catalog);
    fs.writeFileSync(OUTPUT_CATALOG, json, 'utf8');

    const { copied, totalBytes, missing } = copyImageAssets(catalog);

    console.log('=== Story Catalog Summary ===');
    for (const key of ['main', 'mainSecond', 'puellaHistoria', 'sub', 'subSecond', 'chara', 'arena', 'event', 'accomplish', 'special', 'stills']) {
        console.log(`  ${key.padEnd(15)} ${catalog[key].length}`);
    }
    console.log(`Catalog written: ${OUTPUT_CATALOG} (${(Buffer.byteLength(json) / 1024).toFixed(1)} KB)`);
    console.log(`Copied image_web assets: ${copied} files (${(totalBytes / 1048576).toFixed(2)} MB)`);
    if (missing.length) {
        console.log(`Missing optional image_web assets (${missing.length}):`);
        for (const m of missing.slice(0, 25)) console.log(`  - ${m}`);
        if (missing.length > 25) console.log(`  ... and ${missing.length - 25} more`);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
