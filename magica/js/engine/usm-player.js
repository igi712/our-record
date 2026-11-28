// magica/js/engine/usm-player.js — Reusable streaming CRI Sofdec2 (.usm) movie player.
//
// References y2361547758/usm.js (MIT, Copyright (c) 2022 MisakaHonoka) for CRI USM
// key-schedule derivation and @SFV / @SFA chunk unmasking.
//
// Decodes VP9 (IVF) and H.264 (Annex-B) video via WebCodecs VideoDecoder and
// CRI ADX 4-bit ADPCM audio via Web Audio, streaming incrementally from fetch().body
// (including split .aaa/.aab/... archives) with viewport-framed overlay rendering.

import { repoUrl } from '../paths.js';
import { getBgmVolume } from './audio.js';

const DEFAULT_REMOTE_MOVIE_BASE = 'https://raw.githubusercontent.com/igi712/ma-re-data/main/resource/movie';
const LOCAL_MOVIE_PROBE_FILE = 'other/op_movie.usm';
const DEFAULT_CRI_KEY1 = 0x43484A86;
const DEFAULT_CRI_KEY2 = 0x00000001;

const MAGIC_CRID = 0x43524944; // 'CRID' (big-endian)
const MAGIC_SFV = 0x40534656;  // '@SFV'
const MAGIC_SFA = 0x40534641;  // '@SFA'
const MAGIC_UTF = 0x40555446;  // '@UTF'
const MAGIC_DKIF = 0x444B4946; // 'DKIF'

const ADX_BATCH_BLOCKS = 256; // 256 * 32 = 8192 samples (~170.7ms @ 48kHz)
const FADE_IN_MS = 260;
const FADE_OUT_MS = 240;

let movieBasePromise = null;
let movieBaseInfo = null; // { base, isLocal, isOverride }
let activeSession = null;

// --- Movie Base URL Resolution & Split-Chunk Streaming ---

function getMovieBaseOverride() {
    try {
        if (window.MR_MOVIE_BASE) {
            return String(window.MR_MOVIE_BASE).replace(/\/+$/, '');
        }
    } catch {}
    try {
        const stored = localStorage.getItem('mrMovieBase');
        if (stored) return String(stored).replace(/\/+$/, '');
    } catch {}
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.has('movieBase')) {
            return String(params.get('movieBase') || '').replace(/\/+$/, '');
        }
    } catch {}
    return null;
}

export async function resolveMovieBase() {
    if (movieBaseInfo) return movieBaseInfo.base;
    if (movieBasePromise) return movieBasePromise;

    movieBasePromise = (async () => {
        const override = getMovieBaseOverride();
        if (override) {
            movieBaseInfo = { base: override, isLocal: false, isOverride: true };
            return override;
        }

        const localBase = repoUrl('assets/ma-re-data/resource/movie').replace(/\/+$/, '');
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 2000);
            const resp = await fetch(`${localBase}/${LOCAL_MOVIE_PROBE_FILE}`, {
                method: 'HEAD',
                cache: 'no-store',
                signal: controller.signal
            });
            clearTimeout(timer);
            if (resp && resp.ok) {
                movieBaseInfo = { base: localBase, isLocal: true, isOverride: false };
                return localBase;
            }
        } catch {}

        movieBaseInfo = { base: DEFAULT_REMOTE_MOVIE_BASE, isLocal: false, isOverride: false };
        return DEFAULT_REMOTE_MOVIE_BASE;
    })();

    return movieBasePromise;
}

function normalizeMovieRelPath(pathOrUrl) {
    return String(pathOrUrl || '')
        .trim()
        .replace(/^\/+/, '')
        .replace(/^resource\/movie\/+/i, '');
}

function splitSuffixForIndex(index) {
    const a = 97; // 'a'
    const c2 = String.fromCharCode(a + (index % 26));
    const c1 = String.fromCharCode(a + (Math.floor(index / 26) % 26));
    const c0 = String.fromCharCode(a + (Math.floor(index / 676) % 26));
    return `${c0}${c1}${c2}`;
}

async function openCandidateMovieUrl(baseUrl, signal) {
    const resp = await fetch(baseUrl, { signal });
    if (resp.ok && resp.body) {
        return { firstResponse: resp, splitBaseUrl: null };
    }
    if (resp.status !== 404) {
        throw new Error(`HTTP ${resp.status} while loading ${baseUrl}`);
    }

    // Try split-chunk archive (.aaa, .aab, .aac, ...)
    const firstPartUrl = `${baseUrl}.${splitSuffixForIndex(0)}`;
    const partResp = await fetch(firstPartUrl, { signal });
    if (partResp.ok && partResp.body) {
        return { firstResponse: partResp, splitBaseUrl: baseUrl };
    }
    if (partResp.status !== 404) {
        throw new Error(`HTTP ${partResp.status} while loading ${firstPartUrl}`);
    }
    return null;
}

async function openMovieByteSource(moviePathOrUrl, signal) {
    const raw = String(moviePathOrUrl || '').trim();
    if (!raw) throw new Error('No movie path specified.');

    const candidates = [];
    if (/^https?:\/\//i.test(raw) || raw.startsWith('blob:')) {
        candidates.push(raw);
    } else {
        const rel = normalizeMovieRelPath(raw);
        const base = await resolveMovieBase();
        candidates.push(`${base}/${rel}`);
        if (movieBaseInfo?.isLocal && !movieBaseInfo.isOverride) {
            candidates.push(`${DEFAULT_REMOTE_MOVIE_BASE}/${rel}`);
        }
    }

    let lastErr = null;
    for (const url of candidates) {
        try {
            const opened = await openCandidateMovieUrl(url, signal);
            if (opened) {
                return opened;
            }
        } catch (err) {
            if (signal?.aborted) throw err;
            lastErr = err;
        }
    }

    throw lastErr || new Error(`Movie file not found: ${raw}`);
}

async function* iterateMovieByteChunks(opened, signal, waitForBackpressure) {
    let partIndex = 0;
    let resp = opened.firstResponse;

    while (resp && resp.body) {
        const reader = resp.body.getReader();
        try {
            while (true) {
                if (signal.aborted) return;
                if (waitForBackpressure) {
                    await waitForBackpressure();
                    if (signal.aborted) return;
                }
                const { done, value } = await reader.read();
                if (done) break;
                if (value && value.byteLength > 0) {
                    yield value;
                }
            }
        } finally {
            try { reader.cancel(); } catch {}
            try { reader.releaseLock(); } catch {}
        }

        if (!opened.splitBaseUrl || signal.aborted) break;

        partIndex += 1;
        const nextUrl = `${opened.splitBaseUrl}.${splitSuffixForIndex(partIndex)}`;
        const nextResp = await fetch(nextUrl, { signal });
        if (nextResp.status === 404) {
            break;
        }
        if (!nextResp.ok || !nextResp.body) {
            throw new Error(`HTTP ${nextResp.status} while loading ${nextUrl}`);
        }
        resp = nextResp;
    }
}

// --- Rolling Byte Queue ---

class ByteQueue {
    constructor() {
        this.chunks = [];
        this.headOffset = 0;
        this.length = 0;
    }

    push(chunk) {
        if (!chunk || chunk.byteLength === 0) return;
        this.chunks.push(chunk);
        this.length += chunk.byteLength;
    }

    peekBytes(n) {
        if (this.length < n) return null;
        const first = this.chunks[0];
        if (first && first.byteLength - this.headOffset >= n) {
            return first.subarray(this.headOffset, this.headOffset + n);
        }
        const out = new Uint8Array(n);
        let written = 0;
        let idx = 0;
        let off = this.headOffset;
        while (written < n) {
            const c = this.chunks[idx];
            const take = Math.min(n - written, c.byteLength - off);
            out.set(c.subarray(off, off + take), written);
            written += take;
            idx++;
            off = 0;
        }
        return out;
    }

    readBytes(n) {
        if (this.length < n) return null;
        const out = new Uint8Array(n);
        let written = 0;
        while (written < n) {
            const c = this.chunks[0];
            const avail = c.byteLength - this.headOffset;
            const take = Math.min(n - written, avail);
            out.set(c.subarray(this.headOffset, this.headOffset + take), written);
            written += take;
            this.headOffset += take;
            if (this.headOffset >= c.byteLength) {
                this.chunks.shift();
                this.headOffset = 0;
            }
        }
        this.length -= n;
        return out;
    }

    skip(n) {
        let rem = Math.min(n, this.length);
        this.length -= rem;
        while (rem > 0) {
            const c = this.chunks[0];
            const avail = c.byteLength - this.headOffset;
            if (rem >= avail) {
                rem -= avail;
                this.chunks.shift();
                this.headOffset = 0;
            } else {
                this.headOffset += rem;
                rem = 0;
            }
        }
    }

    consumeAll() {
        return this.readBytes(this.length) || new Uint8Array(0);
    }

    clear() {
        this.chunks.length = 0;
        this.headOffset = 0;
        this.length = 0;
    }
}

// --- CRI USM Key Schedule & Chunk Unmasking (ref: y2361547758/usm.js, MIT) ---

export function createCriMask(key1 = DEFAULT_CRI_KEY1, key2 = DEFAULT_CRI_KEY2) {
    const k1 = new Uint8Array([
        key1 & 0xff,
        (key1 >>> 8) & 0xff,
        (key1 >>> 16) & 0xff,
        (key1 >>> 24) & 0xff
    ]);
    const k2 = new Uint8Array([
        key2 & 0xff,
        (key2 >>> 8) & 0xff,
        (key2 >>> 16) & 0xff,
        (key2 >>> 24) & 0xff
    ]);

    const vm1 = new Uint8Array(0x20);
    vm1[0x00] = k1[0];
    vm1[0x01] = k1[1];
    vm1[0x02] = k1[2];
    vm1[0x03] = (k1[3] - 0x34) & 0xff;
    vm1[0x04] = (k2[0] + 0xF9) & 0xff;
    vm1[0x05] = (k2[1] ^ 0x13) & 0xff;
    vm1[0x06] = (k2[2] + 0x61) & 0xff;
    vm1[0x07] = vm1[0x00] ^ 0xFF;
    vm1[0x08] = (vm1[0x02] + vm1[0x01]) & 0xff;
    vm1[0x09] = (vm1[0x01] - vm1[0x07]) & 0xff;
    vm1[0x0A] = vm1[0x02] ^ 0xFF;
    vm1[0x0B] = vm1[0x01] ^ 0xFF;
    vm1[0x0C] = (vm1[0x0B] + vm1[0x09]) & 0xff;
    vm1[0x0D] = (vm1[0x08] - vm1[0x03]) & 0xff;
    vm1[0x0E] = vm1[0x0D] ^ 0xFF;
    vm1[0x0F] = (vm1[0x0A] - vm1[0x0B]) & 0xff;
    vm1[0x10] = (vm1[0x08] - vm1[0x0F]) & 0xff;
    vm1[0x11] = vm1[0x10] ^ vm1[0x07];
    vm1[0x12] = vm1[0x0F] ^ 0xFF;
    vm1[0x13] = vm1[0x03] ^ 0x10;
    vm1[0x14] = (vm1[0x04] - 0x32) & 0xff;
    vm1[0x15] = (vm1[0x05] + 0xED) & 0xff;
    vm1[0x16] = vm1[0x06] ^ 0xF3;
    vm1[0x17] = (vm1[0x13] - vm1[0x0F]) & 0xff;
    vm1[0x18] = (vm1[0x15] + vm1[0x07]) & 0xff;
    vm1[0x19] = (0x21 - vm1[0x13]) & 0xff;
    vm1[0x1A] = vm1[0x14] ^ vm1[0x17];
    vm1[0x1B] = (vm1[0x16] + vm1[0x16]) & 0xff;
    vm1[0x1C] = (vm1[0x17] + 0x44) & 0xff;
    vm1[0x1D] = (vm1[0x03] + vm1[0x04]) & 0xff;
    vm1[0x1E] = (vm1[0x05] - vm1[0x16]) & 0xff;
    vm1[0x1F] = vm1[0x1D] ^ vm1[0x13];

    const vm2 = new Uint8Array(0x20);
    const am = new Uint8Array(0x20);
    const t2 = [0x55, 0x52, 0x55, 0x43]; // 'URUC'
    for (let i = 0; i < 0x20; i++) {
        vm2[i] = vm1[i] ^ 0xFF;
        am[i] = (i & 1) ? t2[(i >> 1) & 3] : vm2[i];
    }

    return { vm1, vm2, am };
}

export function unmaskVideoChunk(payload, mask) {
    if (!mask || payload.byteLength < 0x240) return payload;
    const { vm1, vm2 } = mask;
    const m2 = new Uint8Array(vm2);
    for (let j = 0x140; j < payload.byteLength; j++) {
        const idx = j & 0x1f;
        const b = payload[j] ^ m2[idx];
        payload[j] = b;
        m2[idx] = b ^ vm2[idx];
    }
    const m1 = new Uint8Array(vm1);
    for (let j = 0x40; j < 0x140; j++) {
        const idx = j & 0x1f;
        m1[idx] ^= payload[j + 0x100];
        payload[j] ^= m1[idx];
    }
    return payload;
}

export function unmaskAudioChunk(payload, mask) {
    if (!mask || payload.byteLength <= 0x140) return payload;
    const { am } = mask;
    for (let j = 0x140; j < payload.byteLength; j++) {
        payload[j] ^= am[j & 0x1f];
    }
    return payload;
}

// --- Minimal CRI @UTF Table Parser (for VIDEO_HDRINFO / AUDIO_HDRINFO) ---

function parseUtfTable(buf) {
    if (!buf || buf.byteLength < 32) return null;
    const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    if (dv.getUint32(0, false) !== MAGIC_UTF) return null;

    const tableSize = dv.getUint32(4, false);
    if (8 + tableSize > buf.byteLength) return null;
    const u = buf.subarray(8, 8 + tableSize);
    const uv = new DataView(u.buffer, u.byteOffset, u.byteLength);

    const rowsOffset = uv.getUint32(0, false);
    const stringsOffset = uv.getUint32(4, false);
    const nameOffset = uv.getUint32(12, false);
    const numCols = uv.getUint16(16, false);
    const rowLen = uv.getUint16(18, false);
    const numRows = uv.getUint32(20, false);

    const readStr = (off) => {
        let end = stringsOffset + off;
        while (end < u.byteLength && u[end] !== 0) end++;
        let out = '';
        for (let i = stringsOffset + off; i < end; i++) {
            out += String.fromCharCode(u[i]);
        }
        return out;
    };

    const readVal = (pos, type) => {
        switch (type) {
            case 0: return [uv.getUint8(pos), pos + 1];
            case 1: return [uv.getInt8(pos), pos + 1];
            case 2: return [uv.getUint16(pos, false), pos + 2];
            case 3: return [uv.getInt16(pos, false), pos + 2];
            case 4: return [uv.getUint32(pos, false), pos + 4];
            case 5: return [uv.getInt32(pos, false), pos + 4];
            case 6: {
                const hi = uv.getUint32(pos, false);
                const lo = uv.getUint32(pos + 4, false);
                return [hi * 0x100000000 + lo, pos + 8];
            }
            case 7: {
                const hi = uv.getInt32(pos, false);
                const lo = uv.getUint32(pos + 4, false);
                return [hi * 0x100000000 + lo, pos + 8];
            }
            case 8: return [uv.getFloat32(pos, false), pos + 4];
            case 0xA: return [readStr(uv.getUint32(pos, false)), pos + 4];
            case 0xB: return [null, pos + 8];
            default: return [null, pos];
        }
    };

    const tableName = readStr(nameOffset);
    let pos = 24;
    const cols = [];
    for (let c = 0; c < numCols; c++) {
        const flags = u[pos++];
        const cname = readStr(uv.getUint32(pos, false));
        pos += 4;
        const storage = flags >>> 4;
        const ctype = flags & 0x0f;
        let constVal = null;
        if (storage === 3) {
            [constVal, pos] = readVal(pos, ctype);
        }
        cols.push({ cname, storage, ctype, constVal });
    }

    const rows = [];
    for (let r = 0; r < numRows; r++) {
        let p = rowsOffset + r * rowLen;
        const row = {};
        for (const col of cols) {
            if (col.storage === 3) {
                row[col.cname] = col.constVal;
            } else if (col.storage === 5) {
                [row[col.cname], p] = readVal(p, col.ctype);
            } else {
                row[col.cname] = null;
            }
        }
        rows.push(row);
    }

    return { tableName, rows };
}

// --- Streaming CRI USM Chunk Demuxer ---

export class UsmStreamDemuxer {
    constructor({ key1 = DEFAULT_CRI_KEY1, key2 = DEFAULT_CRI_KEY2, encrypted = true } = {}) {
        this.queue = new ByteQueue();
        this.mask = encrypted ? createCriMask(key1, key2) : null;
        this.videoInfo = null;
        this.audioInfo = null;
        this.videoEnded = false;
        this.audioEnded = false;
        this.onVideoHeader = null;
        this.onAudioHeader = null;
        this.onVideoData = null;
        this.onAudioData = null;
    }

    push(chunk) {
        this.queue.push(chunk);
        this.drain();
    }

    drain() {
        while (this.queue.length >= 32) {
            const hdr = this.queue.peekBytes(32);
            const dv = new DataView(hdr.buffer, hdr.byteOffset, 32);
            const magic = dv.getUint32(0, false);
            const chunkSize = dv.getUint32(4, false);
            const totalSize = 8 + chunkSize;
            if (this.queue.length < totalSize) break;

            const dataOffset = dv.getUint16(8, false);
            const padding = dv.getUint16(10, false);
            const chno = hdr[12];
            const dtype = hdr[15];

            const full = this.queue.readBytes(totalSize);
            const payloadStart = 8 + dataOffset;
            const payloadEnd = Math.max(payloadStart, totalSize - padding);
            const payload = full.subarray(payloadStart, payloadEnd);

            if (magic === MAGIC_SFV && chno === 0) {
                if (dtype === 1) {
                    const parsed = parseUtfTable(payload);
                    if (parsed?.rows?.[0]) {
                        this.videoInfo = parsed.rows[0];
                        this.onVideoHeader?.(this.videoInfo);
                    }
                } else if (dtype === 0) {
                    unmaskVideoChunk(payload, this.mask);
                    this.onVideoData?.(payload);
                } else if (dtype === 2 && payload.byteLength >= 13 && payload[1] === 0x43) {
                    // '#CONTENTS END'
                    this.videoEnded = true;
                }
            } else if (magic === MAGIC_SFA && chno === 0) {
                if (dtype === 1) {
                    const parsed = parseUtfTable(payload);
                    if (parsed?.rows?.[0]) {
                        this.audioInfo = parsed.rows[0];
                        this.onAudioHeader?.(this.audioInfo);
                    }
                } else if (dtype === 0) {
                    unmaskAudioChunk(payload, this.mask);
                    this.onAudioData?.(payload);
                } else if (dtype === 2 && payload.byteLength >= 13 && payload[1] === 0x43) {
                    // '#CONTENTS END'
                    this.audioEnded = true;
                }
            } else if (magic === MAGIC_CRID) {
                // Directory header; stream headers follow in @SFV / @SFA dtype=1 chunks.
            }
        }
    }
}

// --- Streaming CRI ADX 4-bit ADPCM Decoder ---

export class AdxStreamDecoder {
    constructor(onPcmChunk) {
        this.queue = new ByteQueue();
        this.onPcmChunk = onPcmChunk;
        this.header = null;
        this.headerSkipped = false;
        this.coeff1 = 0;
        this.coeff2 = 0;
        this.s1 = null;
        this.s2 = null;
        this.decodedSamplesPerChannel = 0;
        this.batchBuffers = null;
        this.batchSampleOffset = 0;
    }

    push(chunk) {
        this.queue.push(chunk);
        this.drain(false);
    }

    flush() {
        this.drain(true);
        this.emitBatch();
    }

    parseHeader() {
        if (this.queue.length < 20) return false;
        const hdr = this.queue.peekBytes(20);
        const dv = new DataView(hdr.buffer, hdr.byteOffset, 20);
        if (dv.getUint16(0, false) !== 0x8000) {
            throw new Error(`Unsupported audio stream magic: 0x${dv.getUint16(0, false).toString(16)}`);
        }

        const copyrightOffset = dv.getUint16(2, false);
        const dataOffset = copyrightOffset + 4;
        if (this.queue.length < dataOffset) return false;

        const encodingType = hdr[4];
        const blockSize = hdr[5];
        const sampleBits = hdr[6];
        const channels = hdr[7];
        const sampleRate = dv.getUint32(8, false);
        const totalSamples = dv.getUint32(12, false);
        const highpassFreq = dv.getUint16(16, false);
        const version = hdr[18];

        if (encodingType !== 3 || sampleBits !== 4 || blockSize < 3 || channels < 1 || channels > 8) {
            throw new Error(`Unsupported ADX parameters (enc=${encodingType}, blk=${blockSize}, bits=${sampleBits}, ch=${channels})`);
        }

        const z = Math.cos((2 * Math.PI * highpassFreq) / sampleRate);
        const a = Math.SQRT2 - z;
        const b = Math.SQRT2 - 1;
        const c = (a - Math.sqrt((a + b) * (a - b))) / b;
        this.coeff1 = Math.floor(c * 8192);
        this.coeff2 = Math.floor(-(c * c) * 4096);

        this.header = {
            dataOffset,
            blockSize,
            samplesPerBlock: (blockSize - 2) * 2,
            channels,
            sampleRate,
            totalSamples,
            highpassFreq,
            version
        };
        this.s1 = new Int32Array(channels);
        this.s2 = new Int32Array(channels);
        this.allocBatch();

        this.queue.skip(dataOffset);
        this.headerSkipped = true;
        return true;
    }

    allocBatch() {
        const { channels, samplesPerBlock } = this.header;
        const cap = ADX_BATCH_BLOCKS * samplesPerBlock;
        this.batchBuffers = Array.from({ length: channels }, () => new Float32Array(cap));
        this.batchSampleOffset = 0;
    }

    emitBatch() {
        if (!this.header || !this.batchBuffers || this.batchSampleOffset === 0) return;
        const count = this.batchSampleOffset;
        const channels = this.batchBuffers.map((buf) =>
            count === buf.length ? buf : buf.subarray(0, count).slice()
        );
        this.onPcmChunk?.(channels, this.header.sampleRate);
        this.allocBatch();
    }

    drain(isFinal) {
        if (!this.headerSkipped) {
            if (!this.parseHeader()) return;
        }

        const { blockSize, samplesPerBlock, channels, totalSamples } = this.header;
        const frameBytes = blockSize * channels;
        const coeff1 = this.coeff1;
        const coeff2 = this.coeff2;
        const batchCap = this.batchBuffers[0].length;

        while (this.queue.length >= frameBytes) {
            if (totalSamples > 0 && this.decodedSamplesPerChannel >= totalSamples) {
                this.queue.clear();
                break;
            }

            const frame = this.queue.readBytes(frameBytes);
            const remaining = totalSamples > 0
                ? Math.min(samplesPerBlock, totalSamples - this.decodedSamplesPerChannel)
                : samplesPerBlock;

            for (let ch = 0; ch < channels; ch++) {
                const base = ch * blockSize;
                const rawScale = ((frame[base] << 8) | frame[base + 1]) & 0x1FFF;
                const scale = rawScale + 1;
                let h1 = this.s1[ch];
                let h2 = this.s2[ch];
                const out = this.batchBuffers[ch];
                let outIdx = this.batchSampleOffset;
                let written = 0;

                for (let bi = 2; bi < blockSize && written < remaining; bi++) {
                    const byte = frame[base + bi];

                    // High nibble
                    let nib = (byte >> 4) & 0xF;
                    if (nib >= 8) nib -= 16;
                    let val = nib * scale + ((coeff1 * h1 + coeff2 * h2) >> 12);
                    if (val > 32767) val = 32767;
                    else if (val < -32768) val = -32768;
                    h2 = h1;
                    h1 = val;
                    out[outIdx++] = val / 32768;
                    written++;

                    if (written >= remaining) break;

                    // Low nibble
                    nib = byte & 0xF;
                    if (nib >= 8) nib -= 16;
                    val = nib * scale + ((coeff1 * h1 + coeff2 * h2) >> 12);
                    if (val > 32767) val = 32767;
                    else if (val < -32768) val = -32768;
                    h2 = h1;
                    h1 = val;
                    out[outIdx++] = val / 32768;
                    written++;
                }

                this.s1[ch] = h1;
                this.s2[ch] = h2;
            }

            this.decodedSamplesPerChannel += remaining;
            this.batchSampleOffset += remaining;

            if (this.batchSampleOffset >= batchCap) {
                this.emitBatch();
            }
        }

        if (isFinal && this.batchSampleOffset > 0) {
            this.emitBatch();
        }
    }
}

// --- Video Stream Framers (VP9 IVF + H.264 Annex-B) ---

export class IvfVp9Framer {
    constructor(onHeader, onPacket) {
        this.queue = new ByteQueue();
        this.onHeader = onHeader;
        this.onPacket = onPacket;
        this.header = null;
        this.frameIndex = 0;
    }

    push(chunk) {
        this.queue.push(chunk);
        this.drain();
    }

    flush() {
        this.drain();
    }

    drain() {
        if (!this.header) {
            if (this.queue.length < 32) return;
            const hdr = this.queue.peekBytes(32);
            const dv = new DataView(hdr.buffer, hdr.byteOffset, 32);
            if (dv.getUint32(0, false) !== MAGIC_DKIF) {
                throw new Error('Expected IVF DKIF header for VP9 stream.');
            }
            const hdrLen = dv.getUint16(6, true);
            if (this.queue.length < hdrLen) return;
            const fullHdr = this.queue.readBytes(hdrLen);
            const fdv = new DataView(fullHdr.buffer, fullHdr.byteOffset, fullHdr.byteLength);
            const width = fdv.getUint16(12, true);
            const height = fdv.getUint16(14, true);
            const rate = fdv.getUint32(16, true) || 24000;
            const scale = fdv.getUint32(20, true) || 1001;
            const numFrames = fdv.getUint32(24, true);
            this.header = { width, height, rate, scale, numFrames };
            this.onHeader?.(this.header);
        }

        while (this.queue.length >= 12) {
            const fh = this.queue.peekBytes(12);
            const dv = new DataView(fh.buffer, fh.byteOffset, 12);
            const frameSize = dv.getUint32(0, true);
            if (this.queue.length < 12 + frameSize) break;

            const ptsLo = dv.getUint32(4, true);
            const ptsHi = dv.getUint32(8, true);
            const pts = ptsLo + ptsHi * 0x100000000;

            this.queue.skip(12);
            const data = this.queue.readBytes(frameSize);
            if (data.byteLength === 0) continue;

            const b0 = data[0];
            const profile = ((b0 >> 5) & 1) | (((b0 >> 4) & 1) << 1);
            const showExisting = (b0 >> 3) & 1;
            const frameType = (b0 >> 2) & 1;
            const isKey = !showExisting && frameType === 0;

            const { rate, scale } = this.header;
            const timestampUs = Math.round(((pts * scale) / rate) * 1e6);
            const durationUs = Math.round((scale / rate) * 1e6);

            this.onPacket?.({
                codecFamily: 'vp9',
                profile,
                isKey,
                timestampUs,
                durationUs,
                data
            });
            this.frameIndex++;
        }
    }
}

export class AnnexBH264Framer {
    constructor(videoInfo, onPacket) {
        this.buffer = new Uint8Array(0);
        this.videoInfo = videoInfo || {};
        this.onPacket = onPacket;
        this.frameIndex = 0;
        this.codecString = null;
    }

    push(chunk) {
        if (!chunk || chunk.byteLength === 0) return;
        const merged = new Uint8Array(this.buffer.byteLength + chunk.byteLength);
        merged.set(this.buffer, 0);
        merged.set(chunk, this.buffer.byteLength);
        this.buffer = merged;
        this.drain(false);
    }

    flush() {
        this.drain(true);
    }

    findAudPositions(buf) {
        const positions = [];
        for (let i = 0; i + 4 < buf.byteLength; i++) {
            if (buf[i] === 0 && buf[i + 1] === 0 && buf[i + 2] === 0 && buf[i + 3] === 1 && (buf[i + 4] & 0x1f) === 9) {
                positions.push(i);
                i += 4;
            }
        }
        return positions;
    }

    inspectAu(au) {
        let isKey = false;
        for (let i = 0; i + 4 < au.byteLength; i++) {
            let nalStart = -1;
            if (au[i] === 0 && au[i + 1] === 0 && au[i + 2] === 0 && au[i + 3] === 1) {
                nalStart = i + 4;
            } else if (au[i] === 0 && au[i + 1] === 0 && au[i + 2] === 1) {
                nalStart = i + 3;
            }
            if (nalStart === -1 || nalStart >= au.byteLength) continue;
            const nalType = au[nalStart] & 0x1f;
            if (nalType === 5) isKey = true;
            if (nalType === 7 && !this.codecString && nalStart + 3 < au.byteLength) {
                const p = au[nalStart + 1].toString(16).padStart(2, '0');
                const c = au[nalStart + 2].toString(16).padStart(2, '0');
                const l = au[nalStart + 3].toString(16).padStart(2, '0');
                this.codecString = `avc1.${p}${c}${l}`;
            }
            i = nalStart;
        }
        return { isKey, codecString: this.codecString || 'avc1.42c029' };
    }

    emitAu(au) {
        if (!au || au.byteLength === 0) return;
        const { isKey, codecString } = this.inspectAu(au);
        const rate = this.videoInfo?.framerate_n || 24000;
        const scale = this.videoInfo?.framerate_d || 1001;
        const timestampUs = Math.round(((this.frameIndex * scale) / rate) * 1e6);
        const durationUs = Math.round((scale / rate) * 1e6);
        this.frameIndex++;
        this.onPacket?.({
            codecFamily: 'h264',
            codecString,
            isKey,
            timestampUs,
            durationUs,
            data: au
        });
    }

    drain(isFinal) {
        const auds = this.findAudPositions(this.buffer);
        if (auds.length >= 2) {
            for (let i = 0; i < auds.length - 1; i++) {
                this.emitAu(this.buffer.slice(auds[i], auds[i + 1]));
            }
            this.buffer = this.buffer.slice(auds[auds.length - 1]);
        }
        if (isFinal && this.buffer.byteLength > 0) {
            this.emitAu(this.buffer);
            this.buffer = new Uint8Array(0);
        }
    }
}

// --- Viewport-Framed Overlay Management ---

function syncOverlayBounds(overlay) {
    if (!overlay) return;
    const camera = window.cameraContainer;
    const vp = window.VIEWPORT;
    if (camera && vp) {
        const scale = camera.scale?.x ?? 1;
        overlay.style.left = `${camera.x}px`;
        overlay.style.top = `${camera.y}px`;
        overlay.style.width = `${vp.viewW * scale}px`;
        overlay.style.height = `${vp.viewH * scale}px`;
    } else {
        overlay.style.left = '0px';
        overlay.style.top = '0px';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
    }
}

function createOverlayDom() {
    const overlay = document.createElement('div');
    overlay.id = 'moviePlayerOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Movie playback');
    const canvas = document.createElement('canvas');
    overlay.appendChild(canvas);
    syncOverlayBounds(overlay);
    document.body.appendChild(overlay);
    return { overlay, canvas };
}

async function resolveVp9CodecConfig(profile, width, height) {
    const candidates = profile === 2
        ? ['vp09.02.41.10', 'vp09.02.40.10', 'vp09.02.31.10']
        : ['vp09.00.41.08', 'vp09.00.40.08', 'vp09.00.31.08', 'vp09.00.10.08'];

    for (const codec of candidates) {
        const cfg = { codec, codedWidth: width, codedHeight: height };
        try {
            const support = await VideoDecoder.isConfigSupported(cfg);
            if (support?.supported) return cfg;
        } catch {}
    }
    return { codec: candidates[0], codedWidth: width, codedHeight: height };
}

async function resolveH264CodecConfig(codecString, width, height) {
    const candidates = [codecString, 'avc1.640029', 'avc1.42c029', 'avc1.42e01f'].filter(Boolean);
    for (const codec of candidates) {
        const cfg = { codec, codedWidth: width, codedHeight: height };
        try {
            const support = await VideoDecoder.isConfigSupported(cfg);
            if (support?.supported) return cfg;
        } catch {}
    }
    return { codec: candidates[0], codedWidth: width, codedHeight: height };
}

function sleepAbortable(ms, signal) {
    if (signal?.aborted) return Promise.resolve();
    return new Promise((resolve) => {
        const onAbort = () => {
            clearTimeout(timer);
            resolve();
        };
        const timer = setTimeout(() => {
            signal?.removeEventListener('abort', onAbort);
            resolve();
        }, ms);
        signal?.addEventListener('abort', onAbort, { once: true });
    });
}

// --- Public Playback Controller ---

export function isUsmMoviePlaying() {
    return activeSession !== null;
}

export async function stopUsmMovie({ fadeMs = 0 } = {}) {
    if (!activeSession) return;
    await activeSession.stop({ skipped: true, fadeMs });
}

/**
 * Play a CRI USM movie fullscreen inside the active game viewport.
 * Resolves to `{ skipped: boolean }` when playback ends or is skipped.
 * Rejects if WebCodecs is unsupported or if the movie fails to load/decode.
 */
export function playUsmMovie(moviePathOrUrl, options = {}) {
    if (activeSession) {
        return Promise.resolve({ skipped: true });
    }

    if (typeof VideoDecoder === 'undefined' || typeof EncodedVideoChunk === 'undefined') {
        return Promise.reject(new Error('This browser does not support WebCodecs video playback.'));
    }

    // Create and unlock AudioContext synchronously inside the user gesture call stack.
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audioCtx = AudioCtx ? new AudioCtx() : null;
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }

    const abortController = new AbortController();
    const { signal } = abortController;
    const { overlay, canvas } = createOverlayDom();
    const ctx2d = canvas.getContext('2d', { alpha: false });

    const gainNode = audioCtx ? audioCtx.createGain() : null;
    if (gainNode && audioCtx) {
        gainNode.gain.value = typeof options.volume === 'number' ? options.volume : getBgmVolume();
        gainNode.connect(audioCtx.destination);
    }

    let resolvePlay;
    let rejectPlay;
    const playPromise = new Promise((resolve, reject) => {
        resolvePlay = resolve;
        rejectPlay = reject;
    });

    const frameQueue = [];
    const prebufferAudio = [];
    const activeAudioSources = new Set();

    let videoDecoder = null;
    let videoConfigured = false;
    let videoConfigPromise = null;
    let pendingVideoPackets = [];
    let seenKeyframe = false;
    let decoderFlushed = false;
    let streamEnded = false;
    let fatalError = null;

    let hasAudio = false;
    let playbackStarted = false;
    let paused = false;
    let audioStartTime = 0;
    let nextAudioTime = 0;
    let videoStartPerfMs = 0;
    let pauseStartPerfMs = 0;
    let totalPausedPerfMs = 0;
    let rafId = 0;
    let stopped = false;
    let pointerDownPos = null;
    let connectingShown = false;

    const setConnecting = (on) => {
        if (on && !connectingShown) {
            connectingShown = true;
            document.body.classList.add('connecting');
        } else if (!on && connectingShown) {
            connectingShown = false;
            document.body.classList.remove('connecting');
        }
    };

    const syncBoundsHandler = () => syncOverlayBounds(overlay);

    const scheduleAudioBuffer = (audioBuffer) => {
        if (!audioCtx || !gainNode || stopped) return;
        const src = audioCtx.createBufferSource();
        src.buffer = audioBuffer;
        src.connect(gainNode);
        const minStart = audioCtx.currentTime + 0.015;
        let startAt = nextAudioTime;
        if (minStart > nextAudioTime) {
            // Shift master audio origin by stall gap so video stays locked to audio after network hiccups.
            audioStartTime += (minStart - nextAudioTime);
            startAt = minStart;
        }
        nextAudioTime = startAt + audioBuffer.duration;
        activeAudioSources.add(src);
        src.onended = () => {
            activeAudioSources.delete(src);
            try { src.disconnect(); } catch {}
        };
        src.start(startAt);
    };

    const flushPrebufferedAudio = () => {
        if (!audioCtx || prebufferAudio.length === 0) return;
        audioStartTime = audioCtx.currentTime + 0.05;
        nextAudioTime = audioStartTime;
        while (prebufferAudio.length > 0) {
            scheduleAudioBuffer(prebufferAudio.shift());
        }
    };

    const getPlaybackClockUs = () => {
        if (!playbackStarted) return 0;
        if (hasAudio && audioCtx) {
            return Math.max(0, (audioCtx.currentTime - audioStartTime) * 1e6);
        }
        const now = paused ? pauseStartPerfMs : performance.now();
        return Math.max(0, (now - videoStartPerfMs - totalPausedPerfMs) * 1000);
    };

    const togglePause = () => {
        if (!playbackStarted || stopped) return;
        paused = !paused;
        if (paused) {
            pauseStartPerfMs = performance.now();
            if (audioCtx && audioCtx.state === 'running') {
                audioCtx.suspend().catch(() => {});
            }
        } else {
            totalPausedPerfMs += performance.now() - pauseStartPerfMs;
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume().catch(() => {});
            }
        }
    };

    const stop = async ({ skipped = false, error = null, fadeMs = FADE_OUT_MS } = {}) => {
        if (stopped) return;
        stopped = true;
        abortController.abort();

        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = 0;
        }

        window.removeEventListener('mrv2:viewportChange', syncBoundsHandler);
        window.removeEventListener('resize', syncBoundsHandler);
        window.removeEventListener('keydown', onKeyDown, true);
        overlay.removeEventListener('pointerdown', onPointerDown);
        overlay.removeEventListener('pointerup', onPointerUp);

        setConnecting(false);

        for (const src of activeAudioSources) {
            try { src.onended = null; } catch {}
            try { src.stop(); } catch {}
            try { src.disconnect(); } catch {}
        }
        activeAudioSources.clear();
        prebufferAudio.length = 0;

        if (audioCtx && audioCtx.state !== 'closed') {
            try { await audioCtx.close(); } catch {}
        }

        while (frameQueue.length > 0) {
            try { frameQueue.shift().close(); } catch {}
        }
        pendingVideoPackets.length = 0;

        if (videoDecoder && videoDecoder.state !== 'closed') {
            try { videoDecoder.close(); } catch {}
        }
        videoDecoder = null;

        if (fadeMs > 0) {
            overlay.classList.remove('visible');
            await new Promise((r) => setTimeout(r, fadeMs));
        }

        overlay.remove();
        if (activeSession?.stop === stop) {
            activeSession = null;
        }

        if (error) rejectPlay(error);
        else resolvePlay({ skipped });
    };

    const onKeyDown = (e) => {
        if (stopped) return;
        if (e.code === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            stop({ skipped: true });
        } else if (e.code === 'Space') {
            e.preventDefault();
            e.stopPropagation();
            togglePause();
        }
    };

    const onPointerDown = (e) => {
        if (stopped || e.button !== 0) return;
        pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e) => {
        if (stopped || e.button !== 0 || !pointerDownPos) return;
        const dx = e.clientX - pointerDownPos.x;
        const dy = e.clientY - pointerDownPos.y;
        pointerDownPos = null;
        if (Math.hypot(dx, dy) < 12) {
            e.preventDefault();
            e.stopPropagation();
            stop({ skipped: true });
        }
    };

    activeSession = { stop };

    window.addEventListener('mrv2:viewportChange', syncBoundsHandler);
    window.addEventListener('resize', syncBoundsHandler);
    window.addEventListener('keydown', onKeyDown, true);
    overlay.addEventListener('pointerdown', onPointerDown);
    overlay.addEventListener('pointerup', onPointerUp);

    // Reveal black backdrop with game-faithful fade-in.
    void overlay.offsetWidth;
    overlay.classList.add('visible');
    setConnecting(true);

    const startPlaybackIfReady = () => {
        if (playbackStarted || stopped) return;
        const enoughVideo = frameQueue.length >= 4 || (streamEnded && frameQueue.length > 0);
        const enoughAudio = !hasAudio || prebufferAudio.length >= 2 || streamEnded;
        if (!enoughVideo || !enoughAudio) return;

        playbackStarted = true;
        setConnecting(false);
        if (hasAudio && audioCtx) {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume().catch(() => {});
            }
            flushPrebufferedAudio();
        } else {
            videoStartPerfMs = performance.now();
        }
        rafId = requestAnimationFrame(renderLoop);
    };

    const renderLoop = () => {
        if (stopped) return;

        if (!paused) {
            const clockUs = getPlaybackClockUs();

            // Drop frames we've fallen behind on, keeping the latest frame <= clockUs.
            while (frameQueue.length > 1 && frameQueue[1].timestamp <= clockUs) {
                const dropped = frameQueue.shift();
                try { dropped.close(); } catch {}
            }

            if (frameQueue.length > 0 && frameQueue[0].timestamp <= clockUs) {
                const frame = frameQueue.shift();
                const dw = frame.displayWidth || frame.codedWidth || 1280;
                const dh = frame.displayHeight || frame.codedHeight || 720;
                if (canvas.width !== dw || canvas.height !== dh) {
                    canvas.width = dw;
                    canvas.height = dh;
                }
                if (ctx2d) {
                    ctx2d.drawImage(frame, 0, 0, canvas.width, canvas.height);
                }
                try { frame.close(); } catch {}
            }

            const audioDone = !hasAudio || !audioCtx || audioCtx.currentTime >= nextAudioTime - 0.025;
            if (streamEnded && decoderFlushed && frameQueue.length === 0 && audioDone) {
                stop({ skipped: false });
                return;
            }
        }

        rafId = requestAnimationFrame(renderLoop);
    };

    const submitEncodedPacket = (pkt) => {
        if (stopped || !videoDecoder || videoDecoder.state === 'closed') return;
        if (!seenKeyframe) {
            if (!pkt.isKey) return;
            seenKeyframe = true;
        }
        try {
            videoDecoder.decode(new EncodedVideoChunk({
                type: pkt.isKey ? 'key' : 'delta',
                timestamp: pkt.timestampUs,
                duration: pkt.durationUs,
                data: pkt.data
            }));
        } catch (err) {
            fatalError = err;
            stop({ error: err });
        }
    };

    const handleVideoPacket = (pkt, videoInfo) => {
        if (stopped) return;
        if (videoConfigured) {
            submitEncodedPacket(pkt);
            return;
        }
        pendingVideoPackets.push(pkt);
        if (!videoConfigPromise) {
            const width = videoInfo?.width || 1920;
            const height = videoInfo?.height || 1080;
            videoConfigPromise = (async () => {
                const cfg = pkt.codecFamily === 'h264'
                    ? await resolveH264CodecConfig(pkt.codecString, width, height)
                    : await resolveVp9CodecConfig(pkt.profile, width, height);
                if (stopped) return;

                videoDecoder = new VideoDecoder({
                    output: (frame) => {
                        if (stopped) {
                            try { frame.close(); } catch {}
                            return;
                        }
                        frameQueue.push(frame);
                        startPlaybackIfReady();
                    },
                    error: (err) => {
                        if (!stopped) {
                            fatalError = err;
                            stop({ error: err });
                        }
                    }
                });
                videoDecoder.configure(cfg);
                videoConfigured = true;

                const queued = pendingVideoPackets;
                pendingVideoPackets = [];
                for (const item of queued) {
                    submitEncodedPacket(item);
                }
            })().catch((err) => {
                if (!stopped) {
                    fatalError = err;
                    stop({ error: err });
                }
            });
        }
    };

    const waitForBackpressure = async () => {
        while (!stopped && !signal.aborted) {
            if (paused) {
                await sleepAbortable(60, signal);
                continue;
            }
            if (!playbackStarted) {
                break;
            }
            const videoAhead = frameQueue.length + (videoDecoder?.decodeQueueSize || 0);
            const audioAheadSec = (hasAudio && audioCtx)
                ? (nextAudioTime - audioCtx.currentTime)
                : 0;
            const tooMuchVideo = videoAhead >= 56;
            const tooMuchAudio = !hasAudio || audioAheadSec >= 2.5;
            if (tooMuchVideo && tooMuchAudio) {
                await sleepAbortable(40, signal);
                continue;
            }
            // Also bound memory if one track races far ahead on an unusual mux.
            if (audioAheadSec >= 6.0 || videoAhead >= 160) {
                await sleepAbortable(40, signal);
                continue;
            }
            break;
        }
    };

    // Start streaming pipeline asynchronously.
    (async () => {
        try {
            const fadePromise = sleepAbortable(FADE_IN_MS, signal);
            const opened = await openMovieByteSource(moviePathOrUrl, signal);
            await fadePromise;
            if (stopped || signal.aborted) return;

            const demuxer = new UsmStreamDemuxer({
                key1: options.key1 ?? DEFAULT_CRI_KEY1,
                key2: options.key2 ?? DEFAULT_CRI_KEY2,
                encrypted: options.encrypted !== false
            });

            let videoFramer = null;
            let audioDecoder = null;
            let videoHeader = null;

            demuxer.onVideoHeader = (hdr) => {
                videoHeader = hdr;
                if (hdr.disp_width && hdr.disp_height) {
                    canvas.width = hdr.disp_width;
                    canvas.height = hdr.disp_height;
                }
            };

            demuxer.onAudioHeader = () => {
                hasAudio = true;
            };

            demuxer.onVideoData = (payload) => {
                if (stopped) return;
                if (!videoFramer) {
                    const isIvf = payload.byteLength >= 4
                        && payload[0] === 0x44 && payload[1] === 0x4B
                        && payload[2] === 0x49 && payload[3] === 0x46;
                    const codecId = videoHeader?.mpeg_codec;
                    if (isIvf || codecId === 9) {
                        videoFramer = new IvfVp9Framer(
                            (ivfHdr) => {
                                if (!videoHeader) {
                                    videoHeader = { width: ivfHdr.width, height: ivfHdr.height };
                                }
                            },
                            (pkt) => handleVideoPacket(pkt, videoHeader)
                        );
                    } else if (codecId === 5 || (payload.byteLength >= 4 && payload[0] === 0 && payload[1] === 0 && payload[2] === 0 && payload[3] === 1)) {
                        videoFramer = new AnnexBH264Framer(videoHeader, (pkt) => handleVideoPacket(pkt, videoHeader));
                    } else {
                        throw new Error(`Unsupported USM video codec (${codecId ?? 'unknown'}).`);
                    }
                }
                videoFramer.push(payload);
            };

            demuxer.onAudioData = (payload) => {
                if (stopped || !audioCtx) return;
                hasAudio = true;
                if (!audioDecoder) {
                    audioDecoder = new AdxStreamDecoder((channelArrays, sampleRate) => {
                        if (stopped || !audioCtx || audioCtx.state === 'closed') return;
                        const frames = channelArrays[0].length;
                        if (frames === 0) return;
                        const buf = audioCtx.createBuffer(channelArrays.length, frames, sampleRate);
                        for (let c = 0; c < channelArrays.length; c++) {
                            buf.copyToChannel(channelArrays[c], c);
                        }
                        if (playbackStarted) {
                            scheduleAudioBuffer(buf);
                        } else {
                            prebufferAudio.push(buf);
                            startPlaybackIfReady();
                        }
                    });
                }
                audioDecoder.push(payload);
            };

            for await (const netChunk of iterateMovieByteChunks(opened, signal, waitForBackpressure)) {
                if (stopped || signal.aborted) return;
                demuxer.push(netChunk);
            }

            if (stopped || signal.aborted) return;
            videoFramer?.flush();
            audioDecoder?.flush();
            streamEnded = true;

            if (videoConfigPromise) {
                await videoConfigPromise;
            }
            if (stopped || signal.aborted) return;

            if (videoDecoder && videoDecoder.state === 'configured') {
                await videoDecoder.flush();
            }
            decoderFlushed = true;

            if (!playbackStarted) {
                if (frameQueue.length > 0) {
                    startPlaybackIfReady();
                } else {
                    throw new Error('No playable video frames found in USM movie.');
                }
            }
        } catch (err) {
            if (!stopped && !signal.aborted && !fatalError) {
                await stop({ error: err, fadeMs: 180 });
            }
        }
    })();

    return playPromise;
}
