#!/usr/bin/env node
/**
 * Static verification of ES module import/export wiring.
 * Checks that every imported name is actually exported by the referenced module.
 */
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');

// Files to check
const FILES = ['model.js', 'model-assets.js', 'model-follow.js', 'model-snapshot.js', 'ui.js'];

// --------------------------------------------------------------------------
// Parsing helpers
// --------------------------------------------------------------------------

/** Parse all `export` lines from source text, returning a list of records:
 *    { kind: 'local', name: 'foo' }
 *    { kind: 're-export', name: 'B', source: './x.js', origName: 'A' }
 */
function parseExports(text, filename) {
  const results = [];
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // export function/asyn function/const/let/class <name>
    let m = line.match(/^export\s+(?:async\s+)?(?:function|const|let|class)\s+(\w+)/);
    if (m) {
      results.push({ kind: 'local', name: m[1] });
      continue;
    }

    // export { ... } from './x.js'  (re-exports)
    m = line.match(/^export\s+\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"]/);
    if (m) {
      const source = m[2];
      const names = m[1].split(',').map(s => s.trim()).filter(Boolean);
      for (const n of names) {
        const parts = n.split(/\s+as\s+/);
        const origName = parts[0].trim();
        const exportName = parts.length === 2 ? parts[1].trim() : origName;
        results.push({ kind: 're-export', name: exportName, source, origName });
      }
      continue;
    }

    // export { A, B, C }  (same-file named export, no 'from')
    m = line.match(/^export\s+\{\s*([^}]+)\s*\}/);
    if (m) {
      const names = m[1].split(',').map(s => s.trim()).filter(Boolean);
      for (const n of names) {
        const parts = n.split(/\s+as\s+/);
        const exportName = parts.length === 2 ? parts[1].trim() : parts[0].trim();
        results.push({ kind: 'local', name: exportName });
      }
      continue;
    }
  }
  return results;
}

/**
 * Parse all `import { ... } from './x.js'` lines from source text.
 * Returns: an array of { source, imported: [{importedName, origName}] }
 *   where origName is the name before 'as'.
 */
function parseImports(text, filename) {
  const results = [];
  const lines = text.split('\n');

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Detect start of `import { ... } from '...'`
    // May be single-line or multi-line
    const startMatch = line.match(/^import\s+\{\s*/);
    if (!startMatch) { i++; continue; }

    // Collect everything from `{` through the closing `}` and `from '...'`
    let block = line;
    let closeIdx = block.indexOf('}');
    // If not found on this line, keep appending lines
    while (closeIdx === -1 && i + 1 < lines.length) {
      i++;
      block += '\n' + lines[i];
      closeIdx = block.lastIndexOf('}');
    }

    if (closeIdx === -1) { i++; continue; } // malformed

    // Now extract the names between the first { and the matching }
    const openIdx = block.indexOf('{');
    const namesPart = block.substring(openIdx + 1, closeIdx);

    // Find `from '...'` or `from "..."`
    const fromMatch = block.match(/from\s+['"]([^'"]+)['"]/);
    if (!fromMatch) { i++; continue; }
    const source = fromMatch[1];

    const names = namesPart.split(',').map(s => s.trim()).filter(Boolean);
    const imported = names.map(n => {
      const parts = n.split(/\s+as\s+/);
      return {
        importedName: parts.length === 2 ? parts[1].trim() : parts[0].trim(),
        origName: parts[0].trim()
      };
    });
    results.push({ source, imported });
    i++;
  }
  return results;
}

// --------------------------------------------------------------------------
// Main
// --------------------------------------------------------------------------

const allExports = {};  // filename -> Set of exported names
const allImportStatements = {}; // filename -> [{source, imported}]
const fileContent = {};
const fileDir = REPO;

// Read all files
for (const f of FILES) {
  const fp = path.join(fileDir, f);
  const text = fs.readFileSync(fp, 'utf-8');
  fileContent[f] = text;
}

// 1. Parse all exports for each file
for (const f of FILES) {
  const text = fileContent[f];
  const exports = parseExports(text, f);
  console.log(`\n=== ${f}: exports ===`);
  const localNames = exports.filter(e => e.kind === 'local').map(e => e.name);
  const reExportNames = exports.filter(e => e.kind === 're-export').map(e => `${e.name} (re-exported from ${e.source})`);
  if (localNames.length) console.log(`  Local:       ${localNames.join(', ')}`);
  else console.log('  Local:       (none)');
  if (reExportNames.length) console.log(`  Re-exports:  ${reExportNames.join('\n                ')}`);
  else console.log('  Re-exports:  (none)');

  // Build the export set (resolved names without source annotation)
  const exportSet = new Set();
  for (const e of exports) exportSet.add(e.name);
  allExports[f] = exportSet;
}

// 2. Parse all imports for each file
for (const f of FILES) {
  const text = fileContent[f];
  const imports = parseImports(text, f);
  allImportStatements[f] = imports;
  if (imports.length > 0) {
    console.log(`\n=== ${f}: imports ===`);
    for (const imp of imports) {
      const names = imp.imported.map(i => i.importedName === i.origName ? i.importedName : `${i.importedName} (as ${i.origName})`).join(', ');
      console.log(`  from ${imp.source}: { ${names} }`);
    }
  }
}

// 3. Specifically print ui.js's imports from model.js
const uiImports = allImportStatements['ui.js'].filter(imp => imp.source === './model.js');
if (uiImports.length) {
  console.log(`\n=== ui.js imports from model.js ===`);
  for (const imp of uiImports) {
    console.log(`  { ${imp.imported.map(i => i.importedName).join(', ')} }`);
  }
}

// 4. Verify every import
console.log(`\n========================================`);
console.log(`VALIDATION`);
console.log(`========================================`);

let allResolve = true;
const failures = [];

for (const f of FILES) {
  for (const imp of allImportStatements[f]) {
    // Resolve relative path: e.g. './model.js' from f's directory
    const sourceRel = imp.source;
    if (!sourceRel.startsWith('.')) {
      console.log(`  WARN: non-relative import in ${f}: '${sourceRel}' — skipping check`);
      continue;
    }
    // All files are in same dir, so we can resolve directly
    const sourceFile = sourceRel.replace(/^\.\//, '');
    const exportSet = allExports[sourceFile];
    if (!exportSet) {
      console.log(`  ERROR: Source file not in check set: ${sourceFile} (imported by ${f})`);
      allResolve = false;
      failures.push(`${f} -> ${sourceRel}: source file not tracked`);
      continue;
    }

    for (const entry of imp.imported) {
      if (!exportSet.has(entry.origName)) {
        allResolve = false;
        const msg = `${f}: imports '${entry.importedName}' from ${sourceRel}, but '${entry.origName}' is not exported by ${sourceFile}`;
        failures.push(msg);
        console.log(`  FAIL: ${msg}`);
      }
    }
  }
}

// Also check that model-assets.js's import of 'state' from model.js resolves
// (already covered above)

console.log(`\n========================================`);
if (allResolve) {
  console.log(`RESULT: ALL IMPORTS RESOLVE ✓`);
} else {
  console.log(`RESULT: FAILURES:`);
  for (const f of failures) {
    console.log(`  ✗ ${f}`);
  }
}
console.log(`========================================`);
