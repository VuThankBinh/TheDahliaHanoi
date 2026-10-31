const fs = require('fs');
const path = require('path');
const catalogueIo = require('../tools/catalogue-io');

const ROOT_DIR = path.resolve(__dirname, '..');
const TOURS_JSON_PATH = path.join(ROOT_DIR, 'tours.json');

// Read existing catalogue.json
const cat = JSON.parse(fs.readFileSync(catalogueIo.JSON_PATH, 'utf8'));

// 1. Update Destinations
cat.destinations['ha-long'] = {
  id: "ha-long",
  name: "Hạ Long – Lan Hạ",
  nameEn: "Ha Long – Lan Ha Bay",
  title: "Hạ Long & Lan Hạ – Kỳ quan vịnh biển & Du thuyền đẳng cấp",
  titleEn: "Ha Long & Lan Ha – Marine Wonders & Luxury Cruises",
  lead: "Trải nghiệm du thuyền ngủ đêm 4 sao Cozy Bay Grand, siêu du thuyền 5 sao Cozy Bay Premium & Sea Lion, và hải trình độc bản 7 tiếng Tropical Cruise khám phá vịnh Lan Hạ, đảo Cát Bà.",
  leadEn: "Experience 4-star Cozy Bay Grand overnight cruise, 5-star day cruises Cozy Bay Premium & Sea Lion, and exclusive 7-hour Tropical Cruise across Lan Ha Bay and Cat Ba Island.",
  video: "img/video/16092120_2560_1440_30fps.mp4",
  media: [
    { type: "image", src: "img/tours/halong-cozy-bay-grand/overview-sundeck/Overview_0.JPG", alt: "Du thuyền Cozy Bay Grand", altEn: "Cozy Bay Grand cruise" },
    { type: "image", src: "img/tours/lanha-tropical-cruise/anh/Tropical_-_00.jpg", alt: "Du thuyền Tropical Cruise vịnh Lan Hạ", altEn: "Tropical Cruise Lan Ha Bay" }
  ]
};

cat.destinations['ninh-binh'] = {
  id: "ninh-binh",
  name: "Ninh Bình",
  nameEn: "Ninh Binh",
  title: "Ninh Bình – Non nước Tràng An & Cố đô Hoa Lư",
  titleEn: "Ninh Binh – Trang An Landscape & Ancient Capital",
  lead: "Khám phá quần thể danh thắng Tràng An di sản UNESCO, chèo thuyền Tam Cốc, chinh phục đỉnh Hang Múa, đại tự Bái Đính và đạp xe xuyên làng quê thanh bình.",
  leadEn: "Explore UNESCO World Heritage Trang An, Tam Coc boat tour, Mua Cave viewpoint, historic Bai Dinh Pagoda, and serene countryside cycling.",
  video: "img/video/2169880-hd_1280_720_30fps.mp4",
  media: [
    { type: "image", src: "img/destinations/ninh-binh/trang-an-boat.jpg", alt: "Danh thắng Tràng An", altEn: "Trang An Landscape Complex" },
    { type: "image", src: "img/tours/ninh-binh/xe-ap/Cozy-NinhBinh-01.jpg", alt: "Đạp xe làng quê Ninh Bình", altEn: "Ninh Binh countryside cycling" }
  ]
};

cat.destinations.sapa = {
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

// 2. Update Hero Slides
cat.hero.slides = [
  {
    type: "image",
    place: "ha-noi",
    poster: "img/tours/dest-hanoi-1.jpg",
    src: "img/tours/dest-hanoi-1.jpg",
    alt: "Hà Nội ngàn năm văn hiến",
    altEn: "Hanoi thousand years of culture"
  },
  {
    type: "image",
    place: "ha-long",
    poster: "img/tours/halong-cozy-bay-grand/overview-sundeck/Overview_0.JPG",
    src: "img/tours/halong-cozy-bay-grand/overview-sundeck/Overview_0.JPG",
    alt: "Du thuyền Hạ Long & Lan Hạ",
    altEn: "Ha Long & Lan Ha Cruise"
  },
  {
    type: "image",
    place: "ninh-binh",
    poster: "img/destinations/ninh-binh/trang-an-boat.jpg",
    src: "img/destinations/ninh-binh/trang-an-boat.jpg",
    alt: "Quần thể danh thắng Tràng An Ninh Bình",
    altEn: "Trang An Landscape Complex Ninh Binh"
  },
  {
    type: "image",
    place: "sapa",
    poster: "img/tours/sapa-placeholder.jpg",
    src: "img/tours/sapa-placeholder.jpg",
    alt: "Highlight Sa Pa",
    altEn: "Sapa highlight"
  }
];

// 3. Load 37 authoritative tours from tours.json
const newToursData = JSON.parse(fs.readFileSync(TOURS_JSON_PATH, 'utf8'));
const finalTours = newToursData.tours.map(t => {
  if (t.destination === 'sapa') {
    t.operatorId = 'may';
  } else {
    t.operatorId = 'heritage';
  }
  return t;
});

console.log(`Setting catalogue.tours to ${finalTours.length} authoritative tours from raw_docs.`);
cat.tours = finalTours;

// 4. Validate and write to shared/catalogue.json and shared/data.js
catalogueIo.writeCatalogue(cat);
console.log('SUCCESS: Updated shared/catalogue.json and shared/data.js via catalogue-io!');
