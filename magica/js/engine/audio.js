// magica/js/engine/audio.js — Unified HCA worker, sound_native resolver, BGM loop player, and SE engine.

import { repoUrl, magicaUrl } from '../paths.js';
import { DEFAULT_HOME_BGM_FILE } from '../home-bg.js';

const HCA_JS_URL = repoUrl('lib/hca.js');
const KEY1 = 0x01395C51;
const KEY2 = 0x00000000;

export const SE_MAP = Object.freeze({
    1001: '1001_decision_l_hca.hca',
    1002: '1002_decision_s_hca.hca',
    1003: '1003_cancel_hca.hca',
    1008: '1008_decision_ss_hca.hca'
});

const MAX_CACHED_BGM = 10;
const MAX_CACHED_SE = 32;

const bgmDecryptedCache = new Map(); // fileName -> Promise<Uint8Array>
const seBufferCache = new Map(); // cacheKey -> Promise<AudioBuffer>

let hcaModule = null;
let hcaBlobUrl = null;
let worker = null;
let runtimePromise = null;

let soundNativeBasePromise = null;
let bgmBase = null;
let bgmBaseSource = null;

let bgmPlayer = null;
let currentBgmFile = null;
let bgmLoadToken = 0;

let seAudioCtx = null;
let seGainNode = null;
let trackedSfxToken = 0;
let trackedSfxSource = null;
let coreSePreloadStarted = false;

const VOLUME_STORAGE_KEY = 'mrVolumeSettings';
const DEFAULT_VOLUME_STEPS = Object.freeze({ bgm: 10, se: 10, voice: 10 });
const voiceVolumeListeners = new Set();

function clampVolumeStep(val) {
    const num = Math.round(Number(val));
    if (!Number.isFinite(num)) return 10;
    return Math.max(0, Math.min(10, num));
}

function loadVolumeSteps() {
    try {
        const raw = localStorage.getItem(VOLUME_STORAGE_KEY);
        if (!raw) return { ...DEFAULT_VOLUME_STEPS };
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_VOLUME_STEPS };
        return {
            bgm: parsed.bgm !== undefined ? clampVolumeStep(parsed.bgm) : 10,
            se: parsed.se !== undefined ? clampVolumeStep(parsed.se) : 10,
            voice: parsed.voice !== undefined ? clampVolumeStep(parsed.voice) : 10
        };
    } catch {
        return { ...DEFAULT_VOLUME_STEPS };
    }
}

const volumeSteps = loadVolumeSteps();

function saveVolumeSteps() {
    try {
        localStorage.setItem(VOLUME_STORAGE_KEY, JSON.stringify(volumeSteps));
    } catch {}
}

export function getVolumeSteps() {
    return { ...volumeSteps };
}

export function getBgmVolume() {
    return volumeSteps.bgm / 10;
}

export function getSeVolume() {
    return volumeSteps.se / 10;
}

export function getVoiceVolume() {
    return volumeSteps.voice / 10;
}

export function setBgmVolumeStep(step) {
    volumeSteps.bgm = clampVolumeStep(step);
    saveVolumeSteps();
    const vol = getBgmVolume();
    if (bgmPlayer && !bgmPlayer.closed && bgmPlayer.gainNode && bgmPlayer.audioCtx && bgmPlayer.audioCtx.state !== 'closed') {
        const now = bgmPlayer.audioCtx.currentTime;
        const gain = bgmPlayer.gainNode.gain;
        gain.cancelScheduledValues(now);
        gain.setValueAtTime(vol, now);
    }
    return volumeSteps.bgm;
}

export function setSeVolumeStep(step) {
    volumeSteps.se = clampVolumeStep(step);
    saveVolumeSteps();
    const vol = getSeVolume();
    if (seGainNode && seAudioCtx && seAudioCtx.state !== 'closed') {
        const now = seAudioCtx.currentTime;
        const gain = seGainNode.gain;
        gain.cancelScheduledValues(now);
        gain.setValueAtTime(vol, now);
    }
    return volumeSteps.se;
}

export function setVoiceVolumeStep(step) {
    volumeSteps.voice = clampVolumeStep(step);
    saveVolumeSteps();
    const vol = getVoiceVolume();
    for (const listener of voiceVolumeListeners) {
        try {
            listener(vol);
        } catch {}
    }
    return volumeSteps.voice;
}

export function onVoiceVolumeChange(listener) {
    if (typeof listener !== 'function') return () => {};
    voiceVolumeListeners.add(listener);
    return () => {
        voiceVolumeListeners.delete(listener);
    };
}

export async function getHcaRuntime() {
    if (worker && hcaModule) return { worker, hcaModule };
    if (runtimePromise) return runtimePromise;

    runtimePromise = (async () => {
        try {
            if (!hcaBlobUrl) {
                const response = await fetch(HCA_JS_URL);
                if (!response.ok) {
                    throw new Error(`Failed to fetch hca.js: ${response.status}`);
                }
                const blob = new Blob([await response.arrayBuffer()], { type: 'text/javascript' });
                hcaBlobUrl = URL.createObjectURL(blob);
            }
            if (!hcaModule) {
                hcaModule = await import(hcaBlobUrl);
            }
            if (!worker) {
                worker = await hcaModule.HCAWorker.create(hcaBlobUrl);
            }
            return { worker, hcaModule };
        } catch (err) {
            runtimePromise = null;
            throw err;
        }
    })();
    return runtimePromise;
}

export async function resolveSoundNativeBase() {
    if (soundNativeBasePromise) return soundNativeBasePromise;

    soundNativeBasePromise = (async () => {
        const localRoot = repoUrl('assets/ma-re-data/resource/sound_native');
        try {
            const probeUrl = `${localRoot}/bgm/${DEFAULT_HOME_BGM_FILE}`;
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 2000);
            const resp = await fetch(probeUrl, { method: 'HEAD', cache: 'no-store', signal: controller.signal });
            clearTimeout(timer);
            if (resp && resp.ok) {
                return localRoot;
            }
        } catch {}
        return 'https://raw.githubusercontent.com/igi712/ma-re-data/main/resource/sound_native';
    })();

    return soundNativeBasePromise;
}

export async function resolveBgmBase(probeFile = DEFAULT_HOME_BGM_FILE) {
    if (bgmBase) return bgmBase;

    try {
        if (window.MR_BGM_BASE) {
            bgmBase = String(window.MR_BGM_BASE).replace(/\/$/, '');
            bgmBaseSource = 'window.MR_BGM_BASE';
            return bgmBase;
        }
    } catch {}
    try {
        const v = localStorage.getItem('mrBgmBase');
        if (v) {
            bgmBase = String(v).replace(/\/$/, '');
            bgmBaseSource = 'localStorage mrBgmBase';
            return bgmBase;
        }
    } catch {}
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.has('bgmBase')) {
            bgmBase = params.get('bgmBase').replace(/\/$/, '');
            bgmBaseSource = 'query param bgmBase';
            return bgmBase;
        }
    } catch {}

    const localBgm = repoUrl('assets/ma-re-data/resource/sound_native/bgm');
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 2000);
        const resp = await fetch(`${localBgm}/${probeFile}`, {
            method: 'HEAD',
            cache: 'no-store',
            signal: controller.signal
        });
        clearTimeout(timer);
        if (resp && resp.ok) {
            bgmBase = localBgm;
            bgmBaseSource = 'local (probe)';
            return bgmBase;
        }
    } catch {}

    const root = await resolveSoundNativeBase();
    bgmBase = `${root}/bgm`;
    bgmBaseSource = root.startsWith('http') ? 'default remote' : 'local (probe)';
    return bgmBase;
}

async function decryptHcaIfNeeded(rawBytes, activeWorker, mod) {
    const info = new mod.HCAInfo(rawBytes.slice(0));
    if (info.cipher === 0) return rawBytes;
    return activeWorker.decrypt(rawBytes, KEY1, KEY2);
}

async function safeStopHcaPlayer(hcaPlayer, { fadeMs = 30 } = {}) {
    if (!hcaPlayer || hcaPlayer.closed) return;
    try {
        if (fadeMs > 0 && hcaPlayer.gainNode && hcaPlayer.audioCtx?.state === 'running') {
            const now = hcaPlayer.audioCtx.currentTime;
            const gain = hcaPlayer.gainNode.gain;
            gain.cancelScheduledValues(now);
            gain.setValueAtTime(gain.value, now);
            gain.linearRampToValueAtTime(0, now + fadeMs / 1000);
            await new Promise((r) => setTimeout(r, fadeMs + 8));
        }
        if (hcaPlayer.closed) return;
        if (hcaPlayer.bufSrc) hcaPlayer.bufSrc.onended = null;
        if (hcaPlayer.audioCtx?.state === 'suspended') {
            if (hcaPlayer.visibilityChangeListener) {
                document.removeEventListener('visibilitychange', hcaPlayer.visibilityChangeListener);
            }
            try { hcaPlayer.bufSrc?.disconnect(); } catch {}
            await hcaPlayer.audioCtx.close();
            hcaPlayer.closed = true;
            return;
        }
        await hcaPlayer.stop();
    } catch {
        try {
            if (hcaPlayer.visibilityChangeListener) {
                document.removeEventListener('visibilitychange', hcaPlayer.visibilityChangeListener);
            }
        } catch {}
        try { hcaPlayer.bufSrc?.disconnect(); } catch {}
        try { await hcaPlayer.audioCtx?.close(); } catch {}
        hcaPlayer.closed = true;
    }
}

export function getOrFetchDecryptedBgm(fileName) {
    if (bgmDecryptedCache.has(fileName)) {
        const p = bgmDecryptedCache.get(fileName);
        bgmDecryptedCache.delete(fileName);
        bgmDecryptedCache.set(fileName, p);
        return p;
    }

    const p = (async () => {
        const { worker: activeWorker, hcaModule: mod } = await getHcaRuntime();
        const base = await resolveBgmBase(fileName);
        const fileResponse = await fetch(`${base}/${fileName}`);
        if (!fileResponse.ok) {
            throw new Error(`Failed to load ${fileName}: ${fileResponse.status} ${fileResponse.statusText}`);
        }
        const hcaData = new Uint8Array(await fileResponse.arrayBuffer());
        return decryptHcaIfNeeded(hcaData, activeWorker, mod);
    })().catch((err) => {
        if (bgmDecryptedCache.get(fileName) === p) bgmDecryptedCache.delete(fileName);
        throw err;
    });

    bgmDecryptedCache.set(fileName, p);
    while (bgmDecryptedCache.size > MAX_CACHED_BGM) {
        const oldest = bgmDecryptedCache.keys().next().value;
        bgmDecryptedCache.delete(oldest);
    }
    return p;
}

export function hasBgmCached(fileName) {
    return bgmDecryptedCache.has(fileName);
}

export async function prefetchBgm(fileName) {
    if (!fileName || bgmDecryptedCache.has(fileName)) return;
    await getOrFetchDecryptedBgm(fileName);
}

export async function startBgm(fileName, { autoplay = true } = {}) {
    if (!fileName) return;
    if (fileName === currentBgmFile && bgmPlayer && !bgmPlayer.closed) {
        if (autoplay) {
            try {
                if (bgmPlayer.audioCtx?.state === 'suspended') {
                    await bgmPlayer.audioCtx.resume().catch(() => {});
                }
                bgmPlayer.play();
            } catch {}
        }
        return;
    }

    const token = ++bgmLoadToken;
    const { worker: activeWorker, hcaModule: mod } = await getHcaRuntime();
    const decrypted = await getOrFetchDecryptedBgm(fileName);
    if (token !== bgmLoadToken) return;

    const newPlayer = await mod.HCAWebAudioLoopPlayer.create(decrypted.slice(), activeWorker, getBgmVolume());
    if (token !== bgmLoadToken) {
        await safeStopHcaPlayer(newPlayer, { fadeMs: 0 });
        return;
    }

    if (bgmPlayer) {
        await safeStopHcaPlayer(bgmPlayer, { fadeMs: 30 });
    }
    if (token !== bgmLoadToken) {
        await safeStopHcaPlayer(newPlayer, { fadeMs: 0 });
        return;
    }

    bgmPlayer = newPlayer;
    currentBgmFile = fileName;
    bgmPlayer.playInBackground = true;
    const targetVolume = getBgmVolume();
    if (autoplay) {
        if (bgmPlayer.gainNode && bgmPlayer.audioCtx) {
            const now = bgmPlayer.audioCtx.currentTime;
            bgmPlayer.gainNode.gain.setValueAtTime(0, now);
            if (targetVolume > 0) {
                bgmPlayer.gainNode.gain.linearRampToValueAtTime(targetVolume, now + 0.015);
            }
        }
        bgmPlayer.play();
    }

    console.info(`[audio] Prepared ${fileName} (${bgmBaseSource})${autoplay ? ' and started playback' : ''}`);
}

export async function stopBgm({ fadeMs = 30 } = {}) {
    bgmLoadToken++;
    currentBgmFile = null;
    if (bgmPlayer) {
        const oldPlayer = bgmPlayer;
        bgmPlayer = null;
        await safeStopHcaPlayer(oldPlayer, { fadeMs });
    }
}

export function playPreparedBgm() {
    if (bgmPlayer && !bgmPlayer.closed) {
        bgmPlayer.volume = getBgmVolume();
        bgmPlayer.play();
    }
}

export function getCurrentBgmFile() {
    return currentBgmFile;
}

export function hasActiveBgmPlayer() {
    return Boolean(bgmPlayer && !bgmPlayer.closed);
}

export function isBgmUnlocked() {
    return bgmPlayer?.audioCtx?.state === 'running';
}

export async function waitForBgmUnlock(timeoutMs = 1200) {
    if (isBgmUnlocked()) return true;
    if (!bgmPlayer?.audioCtx || bgmPlayer.audioCtx.state === 'closed') return false;

    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        if (isBgmUnlocked()) return true;
    }
    return isBgmUnlocked();
}

function getSeAudioContext() {
    if (!seAudioCtx || seAudioCtx.state === 'closed') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        seAudioCtx = new AudioCtx();
        seGainNode = null;
    }
    return seAudioCtx;
}

function getSeGainNode() {
    const ctx = getSeAudioContext();
    if (!seGainNode) {
        seGainNode = ctx.createGain();
        seGainNode.gain.value = getSeVolume();
        seGainNode.connect(ctx.destination);
    }
    return seGainNode;
}

function loadSeBuffer(cacheKey, url) {
    if (seBufferCache.has(cacheKey)) {
        const p = seBufferCache.get(cacheKey);
        seBufferCache.delete(cacheKey);
        seBufferCache.set(cacheKey, p);
        return p;
    }

    const p = (async () => {
        const { worker: activeWorker, hcaModule: mod } = await getHcaRuntime();
        const resp = await fetch(url);
        if (!resp.ok) {
            throw new Error(`Failed to load SE ${url}: ${resp.status}`);
        }
        const rawBytes = new Uint8Array(await resp.arrayBuffer());
        const decrypted = await decryptHcaIfNeeded(rawBytes, activeWorker, mod);
        const wav = await activeWorker.decode(decrypted, 16);
        const wavBuffer = wav.buffer.slice(wav.byteOffset, wav.byteOffset + wav.byteLength);
        return getSeAudioContext().decodeAudioData(wavBuffer);
    })().catch((err) => {
        if (seBufferCache.get(cacheKey) === p) seBufferCache.delete(cacheKey);
        throw err;
    });

    seBufferCache.set(cacheKey, p);
    while (seBufferCache.size > MAX_CACHED_SE) {
        const oldest = seBufferCache.keys().next().value;
        seBufferCache.delete(oldest);
    }
    return p;
}

async function resolveSeTarget(seIdOrRelPath) {
    if (typeof seIdOrRelPath === 'number' || /^\d+$/.test(String(seIdOrRelPath))) {
        const id = Number(seIdOrRelPath);
        const fileName = SE_MAP[id];
        if (!fileName) return null;
        return {
            key: `se:${id}`,
            url: magicaUrl(`resource/sound_native/se/${fileName}`)
        };
    }

    const rel = String(seIdOrRelPath || '').replace(/^\/+/, '');
    if (!rel) return null;
    if (/^https?:\/\//i.test(rel)) {
        return { key: `url:${rel}`, url: rel };
    }
    const base = await resolveSoundNativeBase();
    return {
        key: `sn:${rel}`,
        url: `${base}/${rel}`
    };
}

export function stopSfx() {
    trackedSfxToken++;
    if (trackedSfxSource) {
        try { trackedSfxSource.onended = null; } catch {}
        try { trackedSfxSource.stop(); } catch {}
        try { trackedSfxSource.disconnect(); } catch {}
        trackedSfxSource = null;
    }
}

export async function startSe(seIdOrRelPath, { trackAsSfx = false } = {}) {
    const token = trackAsSfx ? ++trackedSfxToken : trackedSfxToken;
    try {
        const target = await resolveSeTarget(seIdOrRelPath);
        if (!target) return;
        if (trackAsSfx && token !== trackedSfxToken) return;

        const ctx = getSeAudioContext();
        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }

        const audioBuffer = await loadSeBuffer(target.key, target.url);
        if (trackAsSfx && token !== trackedSfxToken) return;

        if (ctx.state === 'suspended') {
            await ctx.resume().catch(() => {});
        }

        if (trackAsSfx && trackedSfxSource) {
            try { trackedSfxSource.onended = null; } catch {}
            try { trackedSfxSource.stop(); } catch {}
            try { trackedSfxSource.disconnect(); } catch {}
            trackedSfxSource = null;
        }

        const src = ctx.createBufferSource();
        src.buffer = audioBuffer;
        src.connect(getSeGainNode());
        if (trackAsSfx) {
            trackedSfxSource = src;
        }
        src.onended = () => {
            try { src.disconnect(); } catch {}
            if (trackAsSfx && trackedSfxSource === src) {
                trackedSfxSource = null;
            }
        };
        src.start(0);
    } catch (err) {
        console.warn('[audio] SE play failed:', seIdOrRelPath, err);
    }
}

export function preloadCoreSe() {
    if (coreSePreloadStarted) return;
    coreSePreloadStarted = true;
    Promise.allSettled(
        Object.keys(SE_MAP).map(async (id) => {
            const target = await resolveSeTarget(Number(id));
            if (target) return loadSeBuffer(target.key, target.url);
        })
    );
}

export async function resumeAudioContext() {
    try {
        if (bgmPlayer?.audioCtx?.state === 'suspended') {
            await bgmPlayer.audioCtx.resume();
        }
    } catch {}
    try {
        if (seAudioCtx?.state === 'suspended') {
            await seAudioCtx.resume();
        }
    } catch {}
}
