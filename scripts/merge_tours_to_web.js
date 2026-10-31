const fs = require('fs');
const path = require('path');
const catalogueIo = require('../tools/catalogue-io');

const ROOT_DIR = path.resolve(__dirname, '..');
const TOURS_JSON_PATH = path.join(ROOT_DIR, 'tours.json');

// Read existing catalogue.json
const cat = JSON.parse(fs.readFileSync(catalogueIo.JSON_PATH, 'utf8'));

// 1. Add sapa destination if missing
cat.destinations.sapa = cat.destinations.sapa || {
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

// 2. Add sapa hero slide if missing
if (!cat.hero.slides.some(s => s.place === 'sapa')) {
  cat.hero.slides.push({
    type: "image",
    place: "sapa",
    poster: "img/tours/sapa-placeholder.jpg",
    src: "img/tours/sapa-placeholder.jpg",
    alt: "Highlight Sa Pa",
    altEn: "Sapa highlight"
  });
}

// 3. Preserve 12 base tours (Halong & Ninh Binh)
const preservedTours = cat.tours.filter(t => t.destination !== 'ha-noi' && t.destination !== 'sapa');
console.log(`Preserved ${preservedTours.length} base tours (Ha Long & Ninh Binh).`);

// 4. Load 25 authoritative tours from tours.json
const newToursData = JSON.parse(fs.readFileSync(TOURS_JSON_PATH, 'utf8'));
const newTours = newToursData.tours.map(t => {
  if (t.destination === 'sapa') {
    t.operatorId = 'may';
  } else {
    t.operatorId = 'heritage';
  }
  return t;
});

// 5. Combine to 37 tours
cat.tours = preservedTours.concat(newTours);
console.log(`Total tours to write: ${cat.tours.length}`);

// 6. Write through catalogue-io to update both shared/catalogue.json and shared/data.js
catalogueIo.writeCatalogue(cat);
console.log('SUCCESS: Updated shared/catalogue.json and shared/data.js via catalogue-io!');
