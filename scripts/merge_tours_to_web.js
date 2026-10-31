const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_JS_PATH = path.join(ROOT_DIR, 'shared', 'data.js');
const APP_JS_PATH = path.join(ROOT_DIR, 'voyage', 'js', 'app.js');
const TOURS_JSON_PATH = path.join(ROOT_DIR, 'tours.json');

// Read existing data.js
let dataJsContent = fs.readFileSync(DATA_JS_PATH, 'utf8');

// Verify existing file evaluates cleanly
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataJsContent, sandbox);
const existingData = sandbox.window.TOUR_DATA;

// Filter out legacy Hanoi tours (ha-noi, ha-noi-half, ha-noi-incense)
// which used old non-folder images and created duplicate entries.
const preservedTours = existingData.tours.filter(t => {
  return t.destination !== 'ha-noi' && t.destination !== 'sapa';
});
console.log(`Preserved ${preservedTours.length} base tours (Ha Long & Ninh Binh). Removed legacy Hanoi/Sapa tours.`);

// Read fresh tours from tours.json
const newToursData = JSON.parse(fs.readFileSync(TOURS_JSON_PATH, 'utf8'));
const newTours = newToursData.tours;
console.log(`Loaded ${newTours.length} authoritative tours from tours.json.`);

// 1. Add 'sapa' destination to destinations in data.js if not already present
const sapaDest = {
  id: "sapa",
  name: "Sa Pa",
  nameEn: "Sapa",
  title: "Sa Pa – Thị trấn trong sương & Bản làng Tây Bắc",
  titleEn: "Sapa – Misty Mountain Town & Northwest Villages",
  lead: "Chinh phục Nóc nhà Đông Dương Fansipan, thung lũng Mường Hoa, chợ phiên Bắc Hà và trải nghiệm homestay bản làng người H'Mông, Giáy, Dao Đỏ.",
  leadEn: "Conquer Fansipan summit, explore Muong Hoa valley, Bac Ha ethnic market, and authentic homestay experiences with local hill tribes.",
  video: "",
  media: [
    { type: "image", src: "img/tours/sapa-placeholder.jpg", alt: "Toàn cảnh Sa Pa", altEn: "Panoramic Sapa view" }
  ]
};

// 2. Add hero slide for Sapa if not present
const sapaHeroSlide = {
  type: "image",
  place: "sapa",
  poster: "img/tours/sapa-placeholder.jpg",
  src: "img/tours/sapa-placeholder.jpg",
  alt: "Highlight Sa Pa",
  altEn: "Sapa highlight"
};

existingData.destinations.sapa = existingData.destinations.sapa || sapaDest;

const hasSapaHero = existingData.hero.slides.some(s => s.place === 'sapa');
if (!hasSapaHero) {
  existingData.hero.slides.push(sapaHeroSlide);
}

// Combine preserved tours + authoritative tours from tours.json
existingData.tours = preservedTours.concat(newTours);
console.log(`Total tours in final catalogue: ${existingData.tours.length}`);

// Construct updated shared/data.js
const headerComment = `/**
 * Nguồn dữ liệu chính cho Voyage (slideshow, điểm đến, tour, form…).
 * Sửa file này rồi hard-refresh — app đọc từ window.TOUR_DATA.
 *
 * Đường dẫn ảnh: tương đối trang voyage/*.html → dùng "img/..."
 */
`;

const updatedDataJs = `${headerComment}window.TOUR_DATA = ${JSON.stringify(existingData, null, 2)};

/* Tương thích util.js / trang mẫu cũ — Voyage chỉ dùng TOUR_DATA ở trên */
window.DAHLIA = window.DAHLIA || {
  hotel: {
    name: "The Dahlia Hanoi",
    email: window.TOUR_DATA.email,
    phone: window.TOUR_DATA.phone,
    phoneHref: "tel:+842400000000",
    address: "18 Hàng Bông, Hoàn Kiếm, Hà Nội",
    line: "Đến một nơi mới. Sống một trải nghiệm khác."
  },
  rooms: [],
  tours: []
};
`;

// Test the updated dataJs in vm before writing to disk
const testSandbox = { window: {} };
vm.createContext(testSandbox);
vm.runInContext(updatedDataJs, testSandbox);
console.log(`Verified updated data.js syntax and VM execution: ${testSandbox.window.TOUR_DATA.tours.length} total tours!`);

// Write updated shared/data.js
fs.writeFileSync(DATA_JS_PATH, updatedDataJs, 'utf8');
console.log(`Saved updated shared/data.js!`);
