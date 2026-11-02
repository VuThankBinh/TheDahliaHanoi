const path = require('path');
const fs = require('fs');

const root = path.resolve('.');
const WWWROOT = path.join(root, 'wwwroot');

function resolveFile(urlPath) {
  let rel = decodeURIComponent(urlPath.split("?")[0]);
  if (rel === "/" || rel === "") rel = "/index.html";
  if (rel.endsWith("/")) rel += "index.html";

  // Backward-compatibility: rewrite legacy /voyage/... to /...
  if (rel.startsWith("/voyage/")) {
    rel = rel.substring(7);
  }

  // 1. Check in WWWROOT first
  const fileInWww = path.resolve(WWWROOT, "." + rel);
  const fromWww = path.relative(WWWROOT, fileInWww);
  if (!fromWww.startsWith("..") && !path.isAbsolute(fromWww) && fs.existsSync(fileInWww)) {
    return fileInWww;
  }

  // 2. Check in ROOT for /admin/, etc.
  const fileInRoot = path.resolve(root, "." + rel);
  const fromRoot = path.relative(root, fileInRoot);
  if (!fromRoot.startsWith("..") && !path.isAbsolute(fromRoot) && fs.existsSync(fileInRoot)) {
    return fileInRoot;
  }

  return null;
}

const testPaths = [
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

let failed = 0;
testPaths.forEach(p => {
  const resolved = resolveFile(p);
  if (resolved && fs.existsSync(resolved)) {
    console.log(`[PASS] ${p} -> ${path.relative(root, resolved)}`);
  } else {
    console.error(`[FAIL] ${p} -> ${resolved}`);
    failed++;
  }
});

if (failed === 0) {
  console.log('\nALL 19 URL PATHS RESOLVED PERFECTLY TO WWWROOT AND ADMIN!');
} else {
  process.exit(1);
}
