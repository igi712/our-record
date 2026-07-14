const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const charaListUrl = 'https://raw.githubusercontent.com/Puella-Care/en-data/refs/heads/main/charaList.json';
const live2dListUrl = 'https://raw.githubusercontent.com/Puella-Care/en-data/refs/heads/main/live2dList.json';
const live2dDir = path.join(repoRoot, 'assets', 'ma-re-data', 'resource', 'image_native', 'live2d_v4');

const missingCharsOut = path.join(repoRoot, 'assets', 'missingCharaList.json');
const missingLive2dOut = path.join(repoRoot, 'assets', 'missingLive2dList.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function extractNames(charaName) {
  if (!charaName) {
    return { baseName: '', outfitName: '' };
  }
  let base = String(charaName).trim();
  const underscoreIndex = base.indexOf('_');
  if (underscoreIndex !== -1) {
    base = base.slice(0, underscoreIndex).trim();
  }
  let outfitName = '';
  const match = base.match(/[（(]([^）)]+)[）)]/);
  if (match) {
    outfitName = match[1].trim();
  }
  const baseName = base.replace(/[（(].*[）)]/, '').trim();
  return { baseName, outfitName };
}

function isDigitsOnly(text) {
  return /^[0-9]+$/.test(text);
}

function walkDirs(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function main() {
  const charaList = await fetch(charaListUrl).then(res => res.json());
  const live2dList = await fetch(live2dListUrl).then(res => res.json());

  const existingCharaIds = new Set(charaList.map((c) => Number(c.id)));
  const existingLive2d = new Set(
    live2dList.map((l) => `${Number(l.charaId)}-${String(l.live2dId).padStart(2, '0')}`)
  );

  const missingCharactersById = new Map();
  const missingOutfits = [];

  const folderNames = walkDirs(live2dDir).filter(isDigitsOnly);

  for (const folderName of folderNames) {
    const folderNum = Number(folderName);
    if (!Number.isFinite(folderNum)) continue;

    const charaId = Math.floor(folderNum / 100);
    const live2dId = String(folderNum % 100).padStart(2, '0');
    const key = `${charaId}-${live2dId}`;

    const paramsPath = path.join(live2dDir, folderName, 'params.json');
    if (!fs.existsSync(paramsPath)) continue;

    let params;
    try {
      params = JSON.parse(fs.readFileSync(paramsPath, 'utf8'));
    } catch {
      continue;
    }

    const { baseName, outfitName } = extractNames(params.charaName);

    if (!existingCharaIds.has(charaId)) {
      if (!missingCharactersById.has(charaId) || (!missingCharactersById.get(charaId).name && baseName)) {
        missingCharactersById.set(charaId, { id: charaId, name: baseName });
      }
    }

    if (!existingLive2d.has(key)) {
      missingOutfits.push({
        charaId,
        live2dId,
        description: outfitName
      });
    }
  }

  const missingCharacters = Array.from(missingCharactersById.values()).sort((a, b) => a.id - b.id);
  const sortedOutfits = missingOutfits.sort((a, b) => (a.charaId - b.charaId) || a.live2dId.localeCompare(b.live2dId));

  fs.writeFileSync(missingCharsOut, JSON.stringify(missingCharacters, null, 2) + '\n', 'utf8');
  fs.writeFileSync(missingLive2dOut, JSON.stringify(sortedOutfits, null, 2) + '\n', 'utf8');

  console.log(`Wrote ${missingCharacters.length} characters to ${missingCharsOut}`);
  console.log(`Wrote ${sortedOutfits.length} outfits to ${missingLive2dOut}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
