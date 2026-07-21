// extract-attributes.js
// Reads temp/localUserData.json, extracts { charaId -> attributeId }, writes assets/charaAttributes.json
// Usage: node scripts/extract-attributes.js

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '..', 'temp', 'localUserData.json');
const OUTPUT = path.join(__dirname, '..', 'assets', 'charaAttributes.json');

const raw = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
const list = raw.userCharaList;

if (!Array.isArray(list)) {
    console.error('ERROR: userCharaList not found or not an array');
    process.exit(1);
}

const map = {};

for (const entry of list) {
    const id = entry.charaId;
    const attr = entry.chara?.attributeId;
    if (id != null && attr && !map[id]) {
        // Normalise: the JS code uses lowercase, the game uses uppercase
        map[id] = attr.toLowerCase();
    }
}

fs.writeFileSync(OUTPUT, JSON.stringify(map, null, 2) + '\n', 'utf8');
console.log(`Wrote ${Object.keys(map).length} entries to ${OUTPUT}`);
