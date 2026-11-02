const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('====================================================');
console.log('       COMPREHENSIVE PROJECT INTEGRITY AUDIT        ');
console.log('====================================================\n');

let issues = [];

// 1. JS Syntax Check
const jsFiles = [
  'server.js',
  'tools/catalogue-io.js',
  'shared/data.js',
  'shared/util.js',
  'admin/admin.js',
  'wwwroot/js/app.js',
  'wwwroot/js/data.js',
  'wwwroot/shared/data.js',
  'wwwroot/shared/util.js',
  'scripts/verify_all_tours.js',
  'scripts/test_ui_rendering.js',
  'scripts/test_booking_feature.js',
  'scripts/test_server_endpoints.js'
];

jsFiles.forEach(f => {
  if (!fs.existsSync(f)) {
    issues.push('Missing JS file: ' + f);
    return;
  }
  try {
    const code = fs.readFileSync(f, 'utf8');
    new vm.Script(code);
    console.log('[OK] JS Syntax: ' + f);
  } catch(e) {
    issues.push('JS Syntax Error in ' + f + ': ' + e.message);
  }
});

// 2. JSON Validation
const jsonFiles = [
  'package.json',
  'shared/catalogue.json',
  'wwwroot/shared/catalogue.json'
];

jsonFiles.forEach(f => {
  if (!fs.existsSync(f)) {
    issues.push('Missing JSON file: ' + f);
    return;
  }
  try {
    JSON.parse(fs.readFileSync(f, 'utf8'));
    console.log('[OK] JSON Valid: ' + f);
  } catch(e) {
    issues.push('JSON Parse Error in ' + f + ': ' + e.message);
  }
});

// 3. Synchronization Check between shared/ and wwwroot/shared/
const catRoot = fs.readFileSync('shared/catalogue.json', 'utf8');
const catWww = fs.readFileSync('wwwroot/shared/catalogue.json', 'utf8');
if (catRoot === catWww) {
  console.log('[OK] catalogue.json matches between shared/ and wwwroot/shared/');
} else {
  issues.push('shared/catalogue.json and wwwroot/shared/catalogue.json are OUT OF SYNC!');
}

const dataRoot = fs.readFileSync('shared/data.js', 'utf8');
const dataWww = fs.readFileSync('wwwroot/shared/data.js', 'utf8');
if (dataRoot === dataWww) {
  console.log('[OK] data.js matches between shared/ and wwwroot/shared/');
} else {
  issues.push('shared/data.js and wwwroot/shared/data.js are OUT OF SYNC!');
}

// 4. Check HTML Links in wwwroot/
const htmlFiles = [
  'wwwroot/index.html',
  'wwwroot/tours.html',
  'wwwroot/book.html',
  'wwwroot/contact.html',
  'wwwroot/payment-guide.html'
];

htmlFiles.forEach(hf => {
  const content = fs.readFileSync(hf, 'utf8');
  // Check for any obsolete ../shared or ../assets links
  if (content.includes('../shared/')) {
    issues.push(hf + ' still contains ../shared/ reference!');
  }
  if (content.includes('../assets/')) {
    issues.push(hf + ' still contains ../assets/ reference!');
  }

  // Check linked CSS, JS, images in HTML
  const srcRegex = /(?:src|href)=["']([^"']+)["']/g;
  let m;
  while ((m = srcRegex.exec(content)) !== null) {
    let link = m[1];
    if (link.startsWith('http') || link.startsWith('//') || link.startsWith('#') || link.startsWith('tel:') || link.startsWith('mailto:')) continue;
    link = link.split('?')[0].split('#')[0];
    if (!link) continue;
    const targetPath = path.join('wwwroot', link);
    if (!fs.existsSync(targetPath)) {
      issues.push(hf + ' broken link: ' + m[1] + ' (resolved: ' + targetPath + ')');
    }
  }
  console.log('[OK] HTML verified: ' + hf);
});

// 5. Check CSS url(...) assets
const cssContent = fs.readFileSync('wwwroot/css/style.css', 'utf8');
const urlRegex = /url\(["']?([^"')]+)["']?\)/g;
let um;
while ((um = urlRegex.exec(cssContent)) !== null) {
  let u = um[1];
  if (u.startsWith('data:') || u.startsWith('http') || u.startsWith('//')) continue;
  u = u.split('?')[0].split('#')[0];
  const target = path.join('wwwroot/css', u);
  if (!fs.existsSync(target)) {
    issues.push('CSS broken url(): ' + um[1] + ' (resolved: ' + target + ')');
  }
}
console.log('[OK] CSS style.css internal url() references verified');

// 6. Check all 37 tours and all their media in wwwroot/
const cat = JSON.parse(catWww);
let mediaCount = 0;
let missingMedia = [];

cat.tours.forEach(t => {
  function checkMedia(rel, desc) {
    if (!rel) return;
    mediaCount++;
    const p = path.join('wwwroot', rel);
    if (!fs.existsSync(p)) {
      missingMedia.push(t.id + ' -> ' + desc + ': ' + rel);
    }
  }

  checkMedia(t.image, 'image');
  (t.media || []).forEach((m, idx) => {
    checkMedia(m.src, 'media[' + idx + '].src');
    if (m.poster) checkMedia(m.poster, 'media[' + idx + '].poster');
  });
  (t.gallery || []).forEach((g, idx) => {
    checkMedia(typeof g === 'string' ? g : g.src, 'gallery[' + idx + ']');
  });
  (t.menuImages || []).forEach((m, idx) => {
    checkMedia(m.src, 'menuImages[' + idx + ']');
  });
});

const dests = Array.isArray(cat.destinations) ? cat.destinations : Object.values(cat.destinations || {});
dests.forEach(d => {
  function checkMedia(rel, desc) {
    if (!rel) return;
    mediaCount++;
    const p = path.join('wwwroot', rel);
    if (!fs.existsSync(p)) {
      missingMedia.push('dest:' + d.id + ' -> ' + desc + ': ' + rel);
    }
  }
  checkMedia(d.hero_image, 'hero_image');
  (d.gallery || []).forEach((g, idx) => {
    checkMedia(typeof g === 'string' ? g : g.src, 'gallery[' + idx + ']');
  });
  (d.media || []).forEach((m, idx) => {
    checkMedia(typeof m === 'string' ? m : m.src, 'media[' + idx + ']');
  });
});

console.log('[OK] Verified ' + mediaCount + ' media references across 37 tours & destinations.');
if (missingMedia.length) {
  missingMedia.forEach(m => issues.push('Missing media: ' + m));
}

// 7. Check server.js file resolution
const testServerPaths = [
  '/',
  '/index.html',
  '/tours.html',
  '/book.html',
  '/contact.html',
  '/payment-guide.html',
  '/css/style.css',
  '/js/app.js',
  '/shared/catalogue.json',
  '/shared/data.js',
  '/assets/logo.png',
  '/img/tours/lanha-tropical-cruise/anh/Tropical_-_00.jpg',
  '/voyage/index.html',
  '/voyage/tours.html',
  '/voyage/img/tours/lanha-tropical-cruise/anh/Tropical_-_00.jpg',
  '/admin/',
  '/admin/index.html',
  '/admin/admin.js',
  '/admin/admin.css'
];

testServerPaths.forEach(p => {
  let rel = p;
  if (rel === '/' || rel === '') rel = '/index.html';
  if (rel.endsWith('/')) rel += 'index.html';
  if (rel.startsWith('/voyage/')) rel = rel.substring(7);

  const fileInWww = path.resolve('wwwroot', '.' + rel);
  const fileInRoot = path.resolve('.', '.' + rel);

  if (!fs.existsSync(fileInWww) && !fs.existsSync(fileInRoot)) {
    issues.push('Server route fails to resolve: ' + p);
  }
});
console.log('[OK] Server URL routing verified.');

// Summary
console.log('\n====================================================');
console.log('                 AUDIT SUMMARY                      ');
console.log('====================================================');
if (issues.length === 0) {
  console.log('STATUS: PERFECT! 0 ISSUES FOUND.');
} else {
  console.log('STATUS: ' + issues.length + ' ISSUES FOUND:');
  issues.forEach((iss, i) => console.log('  ' + (i+1) + '. ' + iss));
}

