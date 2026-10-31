const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_JS_PATH = path.join(ROOT_DIR, 'shared', 'data.js');

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

  // Check Ha Long & Lan Ha tours
  if (t.destination === 'ha-long') {
    if (t.price !== 0) errors.push(`Ha Long tour ${t.id} has non-zero price: ${t.price}`);
    if (t.priceNote !== "Liên hệ") errors.push(`Ha Long tour ${t.id} priceNote is "${t.priceNote}", expected "Liên hệ"`);
    if (!t.pricingTable) errors.push(`Ha Long tour ${t.id} missing pricingTable`);
    if (!fs.existsSync(path.join(ROOT_DIR, 'voyage', t.image))) {
      errors.push(`Ha Long tour ${t.id} image missing on disk: ${t.image}`);
    }
  }

  // Check Ninh Binh tours
  if (t.destination === 'ninh-binh') {
    if (t.price !== 0) errors.push(`Ninh Binh tour ${t.id} has non-zero price: ${t.price}`);
    if (t.priceNote !== "Liên hệ") errors.push(`Ninh Binh tour ${t.id} priceNote is "${t.priceNote}", expected "Liên hệ"`);
    if (!t.pricingTable) errors.push(`Ninh Binh tour ${t.id} missing pricingTable`);
    if (!fs.existsSync(path.join(ROOT_DIR, 'voyage', t.image))) {
      errors.push(`Ninh Binh tour ${t.id} image missing on disk: ${t.image}`);
    }
  }

  // Check Sapa tours
  if (t.destination === 'sapa') {
    if (t.price !== 0) errors.push(`Sapa tour ${t.id} has non-zero price: ${t.price}`);
    if (t.priceNote !== "Liên hệ") errors.push(`Sapa tour ${t.id} priceNote is "${t.priceNote}", expected "Liên hệ"`);
    if (!t.pricingTable) errors.push(`Sapa tour ${t.id} missing pricingTable`);
    if (!t.image.includes('sapa-placeholder.jpg')) {
      errors.push(`Sapa tour ${t.id} image is not placeholder: ${t.image}`);
    }
  }

  // Check Hanoi Craft tours
  if (t.id.startsWith('ha-noi-city-craft') || t.id.startsWith('ha-noi-craft')) {
    if (t.price <= 0) errors.push(`Hanoi craft tour ${t.id} has price <= 0`);
    t.media.forEach(m => {
      if (!m.src.includes('hanoi-craft/')) {
        errors.push(`Hanoi craft tour ${t.id} has unexpected image: ${m.src}`);
      }
    });
  }

  // Check Hanoi Traditional tours
  if (t.id.startsWith('ha-noi-traditional')) {
    if (t.price <= 0) errors.push(`Hanoi traditional tour ${t.id} has price <= 0`);
    t.media.forEach(m => {
      if (!m.src.includes('hanoi-traditional/')) {
        errors.push(`Hanoi traditional tour ${t.id} has unexpected image: ${m.src}`);
      }
    });
  }
});

console.log("Destination breakdown:", counts);
if (errors.length > 0) {
  console.error(`Found ${errors.length} validation errors:`);
  errors.forEach(e => console.error(" - " + e));
  process.exit(1);
} else {
  console.log("All destination checks PASSED with 0 errors!");
}
