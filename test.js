// test.js — Antrian App smoke tests
// jpXCode | jpxcode.pages.dev
const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;

function assert(cond, msg) {
  if (cond) { pass++; console.log(`  [PASS] ${msg}`); }
  else      { fail++; console.log(`  [FAIL] ${msg}`); }
}

// ── 1. File existence ────────────────────────────────────────
console.log('\n=== File Existence ===');
const requiredFiles = ['index.html', 'loket.html', 'display.html', 'config.js', 'global.css', 'vercel.json', 'README.md'];
for (const f of requiredFiles) {
  assert(fs.existsSync(path.join(__dirname, f)), `${f} exists`);
}

// ── 2. Config.js valid ───────────────────────────────────────
console.log('\n=== Config Validation ===');
let APP_CONFIG;
try {
  const configSrc = fs.readFileSync(path.join(__dirname, 'config.js'), 'utf-8');
  // Strip const declaration, eval to get object
  const wrapped = configSrc.replace('const APP_CONFIG =', 'APP_CONFIG =');
  eval(wrapped);
  assert(true, 'config.js parses without error');
} catch(e) {
  assert(false, `config.js parse error: ${e.message}`);
}

assert(APP_CONFIG && APP_CONFIG.brand, 'APP_CONFIG.brand exists');
assert(APP_CONFIG && APP_CONFIG.brand.name, 'brand.name defined');
assert(APP_CONFIG && APP_CONFIG.brand.address, 'brand.address defined');
assert(APP_CONFIG && APP_CONFIG.brand.phone, 'brand.phone defined');
assert(APP_CONFIG && APP_CONFIG.queue, 'APP_CONFIG.queue exists');
assert(APP_CONFIG && APP_CONFIG.queue.prefix, 'queue.prefix defined');
assert(APP_CONFIG && APP_CONFIG.queue.padStart >= 1, 'queue.padStart >= 1');
assert(APP_CONFIG && APP_CONFIG.queue.maxLoket >= 1, 'queue.maxLoket >= 1');
assert(APP_CONFIG && APP_CONFIG.tts, 'APP_CONFIG.tts exists');
assert(APP_CONFIG && APP_CONFIG.tts.lang, 'tts.lang defined');
assert(APP_CONFIG && APP_CONFIG.tts.template, 'tts.template defined');
assert(APP_CONFIG && APP_CONFIG.tts.template.includes('{prefix}'), 'tts.template has {prefix} placeholder');
assert(APP_CONFIG && APP_CONFIG.tts.template.includes('{nomor}'), 'tts.template has {nomor} placeholder');
assert(APP_CONFIG && APP_CONFIG.tts.template.includes('{loket}'), 'tts.template has {loket} placeholder');
assert(APP_CONFIG && APP_CONFIG.audio, 'APP_CONFIG.audio exists');
assert(APP_CONFIG && APP_CONFIG.display, 'APP_CONFIG.display exists');
assert(APP_CONFIG && APP_CONFIG.display.maxRiwayat >= 1, 'display.maxRiwayat >= 1');
assert(APP_CONFIG && APP_CONFIG.receipt, 'APP_CONFIG.receipt exists');

// ── 3. HTML structure checks ─────────────────────────────────
console.log('\n=== HTML Structure ===');
const indexHtml   = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const loketHtml   = fs.readFileSync(path.join(__dirname, 'loket.html'), 'utf-8');
const displayHtml = fs.readFileSync(path.join(__dirname, 'display.html'), 'utf-8');

// All load config.js
assert(indexHtml.includes('src="config.js"'), 'index.html loads config.js');
assert(loketHtml.includes('src="config.js"'), 'loket.html loads config.js');
assert(displayHtml.includes('src="config.js"'), 'display.html loads config.js');

// All load global.css
assert(indexHtml.includes('href="global.css"'), 'index.html loads global.css');
assert(loketHtml.includes('href="global.css"'), 'loket.html loads global.css');
assert(displayHtml.includes('href="global.css"'), 'display.html loads global.css');

// DOCTYPE
assert(indexHtml.startsWith('<!DOCTYPE html>'), 'index.html has DOCTYPE');
assert(loketHtml.startsWith('<!DOCTYPE html>'), 'loket.html has DOCTYPE');
assert(displayHtml.startsWith('<!DOCTYPE html>'), 'display.html has DOCTYPE');

// ── 4. localStorage key consistency ──────────────────────────
console.log('\n=== localStorage Key Consistency ===');
const LS_KEYS = ['antrian_tertinggi', 'antrian_dipanggil_global', 'panggilan_aktif', 'antrian_timestamp'];

// index.html must use antrian_tertinggi and antrian_timestamp
assert(indexHtml.includes("'antrian_tertinggi'"), 'index uses antrian_tertinggi');
assert(indexHtml.includes("'antrian_timestamp'"), 'index uses antrian_timestamp');

// loket.html must use antrian_tertinggi, antrian_dipanggil_global, panggilan_aktif
assert(loketHtml.includes("'antrian_tertinggi'"), 'loket uses antrian_tertinggi');
assert(loketHtml.includes("'antrian_dipanggil_global'"), 'loket uses antrian_dipanggil_global');
assert(loketHtml.includes("'panggilan_aktif'"), 'loket uses panggilan_aktif');

// display.html must listen for panggilan_aktif
assert(displayHtml.includes("'panggilan_aktif'"), 'display uses panggilan_aktif');
assert(displayHtml.includes("'antrian_tertinggi'"), 'display uses antrian_tertinggi');

// ── 5. Critical functions ────────────────────────────────────
console.log('\n=== Critical Functions ===');

// index.html
assert(indexHtml.includes('function generateAntrian'), 'index: generateAntrian defined');
assert(indexHtml.includes('function updateStats'), 'index: updateStats defined');
assert(indexHtml.includes('function tutupOverlay'), 'index: tutupOverlay defined');
assert(indexHtml.includes('function cetakUlang'), 'index: cetakUlang defined');
assert(indexHtml.includes('function updateClock'), 'index: updateClock defined');

// loket.html
assert(loketHtml.includes('function panggilBerikutnya'), 'loket: panggilBerikutnya defined');
assert(loketHtml.includes('function panggilUlang'), 'loket: panggilUlang defined');
assert(loketHtml.includes('function resetSistem'), 'loket: resetSistem defined');
assert(loketHtml.includes('function eksekusiPanggilan'), 'loket: eksekusiPanggilan defined');
assert(loketHtml.includes('function updateStats'), 'loket: updateStats defined');
assert(loketHtml.includes('function addLog'), 'loket: addLog defined');

// display.html
assert(displayHtml.includes('function tampilkanPanggilan'), 'display: tampilkanPanggilan defined');
assert(displayHtml.includes('function panggilSuara'), 'display: panggilSuara defined');
assert(displayHtml.includes('function playChime'), 'display: playChime defined');
assert(displayHtml.includes('function tambahRiwayat'), 'display: tambahRiwayat defined');
assert(displayHtml.includes('function updateStats'), 'display: updateStats defined');

// ── 6. Storage event listeners ───────────────────────────────
console.log('\n=== Event Listeners ===');
assert(indexHtml.includes("addEventListener('storage'"), 'index: storage listener');
assert(loketHtml.includes("addEventListener('storage'"), 'loket: storage listener');
assert(displayHtml.includes("addEventListener('storage'"), 'display: storage listener');

// ── 7. Brand config usage ────────────────────────────────────
console.log('\n=== Brand Config Usage ===');
assert(indexHtml.includes('APP_CONFIG.brand.name'), 'index uses APP_CONFIG.brand.name');
assert(loketHtml.includes('APP_CONFIG.brand.name'), 'loket uses APP_CONFIG.brand.name');
assert(displayHtml.includes('APP_CONFIG.brand.name'), 'display uses APP_CONFIG.brand.name');

// ── 8. Print support (index only) ────────────────────────────
console.log('\n=== Print Support ===');
assert(indexHtml.includes('window.print()'), 'index: window.print() called');
assert(indexHtml.includes('areaCetak'), 'index: areaCetak section exists');

// ── 9. CSS checks ────────────────────────────────────────────
console.log('\n=== CSS Checks ===');
const globalCSS = fs.readFileSync(path.join(__dirname, 'global.css'), 'utf-8');
assert(globalCSS.includes('@media print'), 'global.css: print media query');
assert(globalCSS.includes('58mm'), 'global.css: 58mm thermal width');
assert(globalCSS.includes('jpXCode'), 'global.css: jpXCode signature');
assert(globalCSS.includes('Inter'), 'global.css: Inter font');
assert(globalCSS.includes('JetBrains Mono'), 'global.css: JetBrains Mono font');

// ── 10. Security headers (vercel.json) ───────────────────────
console.log('\n=== Vercel Config ===');
const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'vercel.json'), 'utf-8'));
assert(vercelConfig.cleanUrls === true, 'vercel: cleanUrls enabled');
const secHeaders = vercelConfig.headers[0].headers.map(h => h.key);
assert(secHeaders.includes('X-Content-Type-Options'), 'vercel: X-Content-Type-Options header');
assert(secHeaders.includes('X-Frame-Options'), 'vercel: X-Frame-Options header');

// ── 11. TTS template integrity ───────────────────────────────
console.log('\n=== TTS Template ===');
const tpl = APP_CONFIG.tts.template;
const placeholders = ['{prefix}', '{nomor}', '{loket}'];
for (const p of placeholders) {
  assert(tpl.includes(p), `template contains ${p}`);
}
// display.html replaces all placeholders
assert(displayHtml.includes(".replace('{prefix}'"), 'display replaces {prefix}');
assert(displayHtml.includes(".replace('{nomor}'"), 'display replaces {nomor}');
assert(displayHtml.includes(".replace('{loket}'"), 'display replaces {loket}');

// ── 12. Queue formatting consistency ─────────────────────────
console.log('\n=== Queue Format ===');
// All files that format nomor should use APP_CONFIG.queue.prefix and padStart
assert(indexHtml.includes('APP_CONFIG.queue.prefix'), 'index uses queue.prefix');
assert(indexHtml.includes('APP_CONFIG.queue.padStart'), 'index uses queue.padStart');
assert(loketHtml.includes('APP_CONFIG.queue.prefix'), 'loket uses queue.prefix');
assert(loketHtml.includes('APP_CONFIG.queue.padStart'), 'loket uses queue.padStart');

// ── Summary ──────────────────────────────────────────────────
console.log('\n' + '='.repeat(48));
console.log(`  TOTAL: ${pass + fail} tests | PASS: ${pass} | FAIL: ${fail}`);
console.log('='.repeat(48));
process.exit(fail > 0 ? 1 : 0);
