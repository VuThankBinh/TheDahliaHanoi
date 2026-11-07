/**
 * Gắn ảnh Sapa vào catalogue.
 * File Catalogue tour sapa.docx và Catalogue Sapa May Travel.pdf chỉ là trang ảnh,
 * không có lớp chữ, nên script không ghi đè lịch trình đang có.
 * Ảnh lấy từ Wikimedia Commons, chỉ giấy phép được dùng trên web thương mại
 * (CC0, public domain, CC BY, CC BY-SA — không lấy NC/ND), rồi ghi src và credit vào tour.
 *
 * Chạy: node tools/import-sapa-images.js
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { writeCatalogue } = require("./catalogue-io");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "wwwroot", "img", "tours", "sapa");
const CATALOGUE = path.join(ROOT, "shared", "catalogue.json");
const UA = "TheDahliaHanoiCatalogue/1.0 (local Sapa image import; educational tour site)";

const SHOTS = [
  { code: "town", file: "town.jpg", query: "Sapa town market street", require: [["Sapa", "sapa", "chapa"], ["town", "market", "church", "street", "centre"]], not: ["paddy", "terrace", "rice", "ledziny"], alt: "Thị trấn Sapa", altEn: "Sapa town" },
  { code: "sleeper", file: "sleeper-bus.jpg", query: "sleeper bus Hanoi Sapa", must: ["bus"], alt: "Xe giường nằm Hà Nội – Sapa", altEn: "Hanoi–Sapa sleeper bus" },
  { code: "catcat", file: "cat-cat.jpg", query: "Cat Cat village Sapa", must: ["cat cat", "catcat"], alt: "Bản Cát Cát", altEn: "Cat Cat village" },
  { code: "catcat-falls", file: "cat-cat-waterfall.jpg", query: "Cat Cat waterfall Sapa", must: ["cat"], alt: "Thác Cát Cát", altEn: "Cat Cat waterfall" },
  { code: "hamrong", file: "ham-rong.jpg", query: "Ham Rong mountain Sapa view", must: ["ham rong", "hàm rồng"], not: ["ql.4d", "ta phin", "horse", "statue"], alt: "Núi Hàm Rồng", altEn: "Ham Rong mountain" },
  { code: "fansipan", file: "fansipan.jpg", query: "Fansipan cable car", must: ["fansipan"], alt: "Cáp treo Fansipan", altEn: "Fansipan cable car" },
  { code: "bachha", file: "bac-ha-market.jpg", query: "Bac Ha market", must: ["bac ha", "bắc hà"], alt: "Chợ phiên Bắc Hà", altEn: "Bac Ha market" },
  { code: "terraces", file: "muong-hoa.jpg", query: "Rice terraces in Sapa", must: ["terrace", "rice", "paddy"], alt: "Ruộng bậc thang Sapa", altEn: "Sapa rice terraces" },
  { code: "ylinh", file: "y-linh-ho.jpg", query: "Y Linh Ho Sapa", must: ["linh"], alt: "Hồ Ý Linh", altEn: "Y Linh Ho" },
  { code: "laochai", file: "lao-chai.jpg", query: "Lao Chai village Sapa", must: ["lao chai", "lao chải"], alt: "Bản Lao Chải", altEn: "Lao Chai village" },
  { code: "tavan", file: "ta-van.jpg", query: "Ta Van village Sapa", must: ["ta van", "tả van"], alt: "Bản Tả Van", altEn: "Ta Van village" },
  { code: "hmong", file: "hmong.jpg", query: "Hmong people Sapa", must: ["hmong", "h'mong", "h mong"], alt: "Người H'Mông ở Sapa", altEn: "Hmong people in Sapa" },
  { code: "giangta", file: "giang-ta-chai.jpg", query: "Giang Ta Chai Sapa", must: ["giang"], alt: "Bản Giàng Tả Chải", altEn: "Giang Ta Chai village" },
  { code: "motorbike", file: "motorbike.jpg", query: "motorcycle Sapa rice", must: ["motor", "bike"], alt: "Xe máy trên đường Sapa", altEn: "Motorbike on a Sapa road" },
  { code: "seomyty", file: "seo-my-ty.jpg", query: "Seo My Ty Sapa", must: ["seo"], alt: "Bản Seo Mỹ Tỷ", altEn: "Seo My Ty village" },
  { code: "waterfall", file: "waterfall.jpg", query: "waterfall Sapa", must: ["waterfall", "thác", "falls"], alt: "Thác ở Sapa", altEn: "A waterfall near Sapa" },
  { code: "tiensa", file: "tien-sa.jpg", query: "Tien Sa waterfall Sapa", must: ["tien", "tiên", "waterfall"], alt: "Thác Tiên Sa", altEn: "Tien Sa waterfall" }
];

const TOURS = {
  "sapa-bac-ha-2d1n": ["bachha", "sleeper", "town", "catcat", "catcat-falls"],
  "sapa-bac-ha-3d2n": ["bachha", "sleeper", "town", "catcat", "catcat-falls", "hamrong", "fansipan"],
  "sapa-catcat-fansipan-2d1n": ["fansipan", "town", "catcat", "catcat-falls"],
  "sapa-catcat-hamrong-2d1n": ["hamrong", "town", "catcat", "catcat-falls"],
  "sapa-hotel-2d2n": ["catcat", "sleeper", "town", "catcat-falls", "hamrong"],
  "sapa-hotel-fansipan-2d2n": ["catcat", "sleeper", "town", "catcat-falls", "hamrong"],
  "sapa-hotel-3d2n": ["hamrong", "town", "fansipan", "catcat", "tiensa"],
  "sapa-catcat-hamrong-fansipan-3d2n": ["fansipan", "town", "hamrong", "catcat"],
  "sapa-hotel-3d3n": ["fansipan", "sleeper", "town", "hamrong", "catcat", "tiensa"],
  "sapa-trekking-1d": ["terraces", "ylinh", "laochai", "tavan"],
  "sapa-homestay-2d1n": ["tavan", "ylinh", "terraces", "laochai", "giangta"],
  "sapa-homestay-2d2n": ["tavan", "sleeper", "terraces", "hmong", "giangta"],
  "sapa-homestay-fansipan-2d2n": ["tavan", "sleeper", "terraces", "hmong", "giangta"],
  "sapa-hotel-homestay-3d2n": ["terraces", "town", "catcat", "catcat-falls", "tavan", "hmong", "giangta"],
  "sapa-hotel-homestay-3d3n": ["terraces", "town", "catcat", "catcat-falls", "tavan", "hmong", "giangta"],
  "sapa-motorbike-trekking-2d1n": ["motorbike", "ylinh", "terraces", "laochai", "tavan", "hmong", "giangta"],
  "sapa-motorbike-2d1n": ["motorbike", "ylinh", "terraces", "laochai", "tavan", "hmong", "giangta"],
  "sapa-motorbike-trekking-2d2n": ["motorbike", "tavan", "hmong", "seomyty", "waterfall"],
  "sapa-motorbike-2d2n": ["motorbike", "tavan", "hmong", "seomyty", "waterfall"]
};

const AVOID = ["map", "logo", "icon", "diagram", "flag", "svg", "coat of arms", "emblem", "stamp", "coin", "location map"];

function strip(value) {
  return String(value || "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/\s+/g, " ").trim();
}

function licenseOk(name) {
  const s = String(name || "").toLowerCase();
  if (!s) return false;
  if (s.includes("nc") || s.includes("non-commercial") || s.includes("noncommercial")) return false;
  if (s.includes("nd") || s.includes("no derivative") || s.includes("noderiv")) return false;
  return s.includes("cc0") || s.includes("public domain") || s.includes("cc by");
}

async function search(query) {
  const url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiurlwidth=1920&gsrsearch=" + encodeURIComponent("filetype:bitmap " + query);
  let wait = 8000;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA, "Api-User-Agent": UA } });
    if (res.status === 429) {
      console.log("  search rate limit, wait " + wait + "ms");
      await sleep(wait);
      wait *= 2;
      continue;
    }
    if (!res.ok) throw new Error("Commons " + res.status + " for " + query);
    const data = await res.json();
    return Object.values((data.query && data.query.pages) || {});
  }
  throw new Error("Commons still limited for " + query);
}

function pick(pages, shot) {
  const ranked = pages.map(function (page) {
    const info = (page.imageinfo || [])[0] || {};
    const title = String(page.title || "").toLowerCase();
    const meta = info.extmetadata || {};
    const license = strip(meta.LicenseShortName && meta.LicenseShortName.value);
    return { page, info, title, license };
  }).filter(function (item) {
    if (!item.info.url || item.info.mime !== "image/jpeg") return false;
    if ((item.info.width || 0) < 1200) return false;
    if (!licenseOk(item.license)) return false;
    if (AVOID.some(function (word) { return item.title.includes(word); })) return false;
    if (/19[0-5]\d|museum/.test(item.title)) return false;
    if ((shot.not || []).some(function (word) { return item.title.includes(word); })) return false;
    const groups = shot.require || [shot.must];
    return groups.every(function (group) {
      return group.some(function (word) { return item.title.includes(word); });
    });
  });
  ranked.sort(function (a, b) { return (b.info.width || 0) - (a.info.width || 0); });
  return ranked[0] || null;
}

function sleep(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

async function saveJpeg(url, dest) {
  let wait = 5000;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.status === 429) {
      console.log("  rate limit, wait " + wait + "ms");
      await sleep(wait);
      wait *= 2;
      continue;
    }
    if (!res.ok) throw new Error("Download " + res.status + " " + url);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).rotate().resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 78 }).toFile(dest);
    return;
  }
  throw new Error("Still rate limited: " + url);
}

function creditOf(info, title) {
  const meta = info.extmetadata || {};
  const artist = strip(meta.Artist && meta.Artist.value) || "Wikimedia Commons";
  const license = strip(meta.LicenseShortName && meta.LicenseShortName.value);
  const file = String(title || "").replace(/^File:/, "");
  return {
    credit: artist + " · Wikimedia Commons · " + license,
    creditEn: artist + " · Wikimedia Commons · " + license,
    source: "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(file).replace(/%20/g, "_")
  };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const found = {};
  for (const shot of SHOTS) {
    let pages = [];
    try {
      pages = await search(shot.query);
    } catch (err) {
      console.log("SKIP " + shot.code + " — " + err.message);
      continue;
    }
    const chosen = pick(pages, shot);
    if (!chosen) {
      console.log("MISS " + shot.code + " — " + shot.query);
      continue;
    }
    const downloadUrl = chosen.info.thumburl || chosen.info.url;
    const dest = path.join(OUT_DIR, shot.file);
    try {
      if (!fs.existsSync(dest)) await saveJpeg(downloadUrl, dest);
    } catch (err) {
      console.log("SKIP " + shot.code + " — " + err.message);
      continue;
    }
    const credit = creditOf(chosen.info, chosen.page.title);
    found[shot.code] = Object.assign({ shot: shot, rel: "img/tours/sapa/" + shot.file }, credit);
    console.log("OK   " + shot.code + " ← " + chosen.page.title + " (" + chosen.license + ")");
    await sleep(1500);
  }

  const catalogue = JSON.parse(fs.readFileSync(CATALOGUE, "utf8"));
  let touched = 0;
  catalogue.tours.forEach(function (tour) {
    const codes = TOURS[tour.id];
    if (!codes) return;
    const shots = codes.map(function (code) { return found[code]; }).filter(Boolean);
    const unique = [];
    shots.forEach(function (item) {
      if (!unique.some(function (have) { return have.rel === item.rel; })) unique.push(item);
    });
    if (!unique.length) return;
    tour.image = unique[0].rel;
    tour.media = unique.map(function (item) {
      return {
        type: "image",
        src: item.rel,
        alt: item.shot.alt + ". " + item.credit,
        altEn: item.shot.altEn + ". " + item.creditEn,
        credit: item.credit,
        source: item.source
      };
    });
    touched += 1;
  });
  writeCatalogue(catalogue);
  console.log("Updated " + touched + " Sapa tours. Shots saved: " + Object.keys(found).length + "/" + SHOTS.length);
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
