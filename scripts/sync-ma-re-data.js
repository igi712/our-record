#!/usr/bin/env node
// Sync assets/ma-re-data with https://github.com/igi712/ma-re-data without git.
// Fetches the remote file tree (blob SHAs) via the GitHub API, hashes local files
// the same way git does, and downloads only missing/different files from raw.githubusercontent.com.
//
// Usage: node scripts/sync-ma-re-data.js [--dry-run] [--dir <path>] [--branch <name>] [--concurrency <n>]
// Optional: set GITHUB_TOKEN to raise the API rate limit (not required).

import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { mkdir, readFile, rename, rm, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const OWNER = 'igi712';
const REPO = 'ma-re-data';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const dryRun = args.includes('--dry-run');
const concurrency = Number(opt('--concurrency', 8));
const targetDir = resolve(opt('--dir', join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'ma-re-data')));

const apiHeaders = { 'User-Agent': 'ma-re-data-sync', Accept: 'application/vnd.github+json' };
if (process.env.GITHUB_TOKEN) apiHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function api(path) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`https://api.github.com${path}`, { headers: apiHeaders });
    if (res.ok) return res.json();
    if (res.status >= 500 && attempt < 3) { await new Promise((r) => setTimeout(r, 1500 * attempt)); continue; }
    const hint = res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0'
      ? ` Rate limited until ${new Date(res.headers.get('x-ratelimit-reset') * 1000).toLocaleTimeString()}; set GITHUB_TOKEN to raise the limit.`
      : '';
    throw new Error(`GitHub API ${res.status} for ${path}.${hint}`);
  }
}

// Returns [{path, sha, size}] for every blob on the branch.
async function listRemote(branch) {
  const base = `/repos/${OWNER}/${REPO}/git/trees/`;
  try {
    const tree = await api(`${base}${encodeURIComponent(branch)}?recursive=1`);
    if (!tree.truncated) return tree.tree.filter((e) => e.type === 'blob');
    console.warn('Recursive tree truncated; walking directories individually...');
  } catch (err) {
    console.warn(`Recursive tree failed (${err.message.split(':')[0]}); walking directories individually...`);
  }
  // Tree too large for one response: walk it one directory at a time.
  const out = [];
  const walk = async (ref, prefix) => {
    const t = await api(`${base}${ref}`);
    await Promise.all(t.tree.map(async (e) => {
      if (e.type === 'blob') out.push({ ...e, path: prefix + e.path });
      else if (e.type === 'tree') await walk(e.sha, `${prefix}${e.path}/`);
    }));
  };
  await walk(encodeURIComponent(branch), '');
  return out;
}

// Git blob SHA-1 of a local file, or null if it doesn't exist.
async function localBlobSha(file, remoteSize) {
  let st;
  try { st = await stat(file); } catch { return null; }
  if (!st.isFile()) return null;
  if (st.size !== remoteSize) return ''; // differs for sure; skip hashing
  const data = await readFile(file);
  return createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex');
}

async function download(entry, branch, dest) {
  const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${encodeURIComponent(branch)}/${entry.path.split('/').map(encodeURIComponent).join('/')}`;
  const tmp = `${dest}.part`;
  await mkdir(dirname(dest), { recursive: true });
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'ma-re-data-sync' } });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
      const hash = createHash('sha1').update(`blob ${entry.size}\0`);
      let bytes = 0;
      const src = Readable.fromWeb(res.body);
      src.on('data', (c) => { hash.update(c); bytes += c.length; });
      await pipeline(src, createWriteStream(tmp));
      if (bytes !== entry.size || hash.digest('hex') !== entry.sha) throw new Error('checksum mismatch');
      await rename(tmp, dest);
      return;
    } catch (err) {
      await rm(tmp, { force: true });
      if (attempt >= 3) throw new Error(`${entry.path}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

async function main() {
  const branch = opt('--branch', null) ?? (await api(`/repos/${OWNER}/${REPO}`)).default_branch;
  console.log(`Remote: ${OWNER}/${REPO}@${branch}\nLocal:  ${targetDir}${dryRun ? '  (dry run)' : ''}`);

  const remote = await listRemote(branch);
  console.log(`Remote files: ${remote.length}. Comparing...`);

  const todo = [];
  let i = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (i < remote.length) {
      const e = remote[i++];
      const sha = await localBlobSha(join(targetDir, ...e.path.split('/')), e.size);
      if (sha !== e.sha) todo.push({ entry: e, reason: sha === null ? 'missing' : 'different' });
    }
  }));
  todo.sort((a, b) => a.entry.path.localeCompare(b.entry.path));

  const total = todo.reduce((n, t) => n + t.entry.size, 0);
  console.log(`To download: ${todo.length} files (${(total / 1048576).toFixed(2)} MiB)`);
  if (dryRun) {
    for (const t of todo) console.log(`  [${t.reason}] ${t.entry.path}`);
    return;
  }

  let done = 0, failed = 0, j = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (j < todo.length) {
      const { entry, reason } = todo[j++];
      try {
        await download(entry, branch, join(targetDir, ...entry.path.split('/')));
        console.log(`[${++done + failed}/${todo.length}] ${reason}: ${entry.path}`);
      } catch (err) {
        failed++;
        console.error(`FAILED: ${err.message}`);
      }
    }
  }));
  console.log(`Done. Downloaded ${done}, failed ${failed}, up to date ${remote.length - todo.length}.`);
  if (failed) process.exitCode = 1;
}

main().catch((err) => { console.error(err.message); process.exit(1); });
