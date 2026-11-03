const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const WWWROOT_DIR = path.join(ROOT_DIR, 'wwwroot');
const DATA_JS_PATH = path.join(WWWROOT_DIR, 'shared', 'data.js');

const dataContent = fs.readFileSync(DATA_JS_PATH, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataContent, sandbox);
const tourData = sandbox.window.TOUR_DATA;

console.log("=== TOUR DATA VERIFICATION ===");
console.log(`Total tours: ${tourData.tours.length}`);

let counts = { 'ha-long': 0, 'ninh-binh': 0, 'ha-noi': 0, 'sapa': 0 };
let errors = [];

tourData.tours.forEach(t => {
  counts[t.destination] = (counts[t.destination] || 0) + 1;

  // Check image exists in wwwroot
  if (!fs.existsSync(path.join(WWWROOT_DIR, t.image))) {
    errors.push(`Tour ${t.id} image missing in wwwroot: ${t.image}`);
  }

  // Check all media items exist
  (t.media || []).forEach((m, idx) => {
    if (!fs.existsSync(path.join(WWWROOT_DIR, m.src))) {
      errors.push(`Tour ${t.id} media[${idx}] missing: ${m.src}`);
    }
  });

  // Check menuGallery items exist if present
  if (t.menuGallery && t.menuGallery.images) {
    t.menuGallery.images.forEach((m, idx) => {
      if (!fs.existsSync(path.join(WWWROOT_DIR, m.src))) {
        errors.push(`Tour ${t.id} menuGallery[${idx}] missing: ${m.src}`);
      }
    });
  }
});

console.log(`Destination breakdown:`, counts);

if (errors.length > 0) {
  console.error(`Found ${errors.length} validation errors:`);
  errors.forEach(e => console.error(` - ${e}`));
  process.exit(1);
} else {
  console.log("All destination checks PASSED with 0 errors!");
}
