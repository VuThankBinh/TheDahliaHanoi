const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const JSON_PATH = path.join(ROOT, "shared", "catalogue.json");
const DATA_JS_PATH = path.join(ROOT, "shared", "data.js");
const ID_RE = /^[a-z0-9][a-z0-9-]{0,80}$/;

function validate(data) {
  const errors = [];
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return ["Catalogue phải là một object JSON."];
  }
  if (!data.site || typeof data.site !== "object" || Array.isArray(data.site)) {
    errors.push("Thiếu object site (email, phone, bank).");
  }
  if (!Array.isArray(data.operators) || !data.operators.length) {
    errors.push("Cần ít nhất một đơn vị.");
  }
  if (!Array.isArray(data.tours)) errors.push("Thiếu mảng tours.");
  if (data.hero && data.hero.slides && !Array.isArray(data.hero.slides)) {
    errors.push("hero.slides phải là mảng.");
  }

  const opIds = new Set();
  (data.operators || []).forEach(function (op, i) {
    const label = (op && op.id) || ("#" + (i + 1));
    if (!op || typeof op !== "object") {
      errors.push("Đơn vị " + label + " không hợp lệ.");
      return;
    }
    if (!ID_RE.test(op.id || "")) errors.push("Id đơn vị không hợp lệ: " + label + " (chữ thường, số, gạch ngang).");
    else if (opIds.has(op.id)) errors.push("Trùng id đơn vị: " + op.id);
    else opIds.add(op.id);
    if (!String(op.name || "").trim()) errors.push("Đơn vị " + label + " thiếu tên.");
    ["childrenPolicy", "childrenPolicyEn"].forEach(function (key) {
      if (op[key] != null && !Array.isArray(op[key])) errors.push("Đơn vị " + label + ": " + key + " phải là mảng dòng.");
    });
  });

  const dests = data.destinations && typeof data.destinations === "object" ? data.destinations : {};
  const tourIds = new Set();
  (data.tours || []).forEach(function (tour, i) {
    const label = (tour && tour.id) || ("#" + (i + 1));
    if (!tour || typeof tour !== "object") {
      errors.push("Tour " + label + " không hợp lệ.");
      return;
    }
    if (!ID_RE.test(tour.id || "")) errors.push("Id tour không hợp lệ: " + label);
    else if (tourIds.has(tour.id)) errors.push("Trùng id tour: " + tour.id);
    else tourIds.add(tour.id);
    if (!String(tour.name || "").trim()) errors.push("Tour " + label + " thiếu tên.");
    if (!tour.operatorId || !opIds.has(tour.operatorId)) {
      errors.push("Tour " + label + " chưa gắn đơn vị hợp lệ.");
    }
    if (tour.destination && !dests[tour.destination]) {
      errors.push("Tour " + label + " trỏ tới điểm đến không có: " + tour.destination);
    }
  });

  Object.keys(dests).forEach(function (id) {
    if (!ID_RE.test(id)) errors.push("Id điểm đến không hợp lệ: " + id);
    if (!dests[id] || !String(dests[id].name || "").trim()) errors.push("Điểm đến " + id + " thiếu tên.");
  });

  return errors;
}

function renderDataJs(catalogue) {
  const json = JSON.stringify(catalogue, null, 2);
  return `/**
 * Catalogue Voyage — sinh từ shared/catalogue.json.
 * Sửa bằng trang Quản trị: npm start, rồi mở /admin/. Đừng sửa tay file này.
 */
(function () {
  var RAW = ${json};

  function clone(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function normalize(raw) {
    var data = clone(raw || {});
    data.site = data.site || {};
    data.hero = data.hero || { interval: 10000, slides: [] };
    data.destinations = data.destinations || {};
    data.tours = Array.isArray(data.tours) ? data.tours : [];
    if (!Array.isArray(data.operators) || !data.operators.length) {
      var legacy = data.partner || {};
      data.operators = [{
        id: "heritage",
        name: legacy.name || "Heritage Vietnam Travel",
        nameEn: legacy.nameEn || legacy.name || "Heritage Vietnam Travel",
        hotline: legacy.hotline || "",
        hotlineHref: legacy.hotlineHref || "",
        website: legacy.website || "",
        address: legacy.address || "",
        active: true,
        childrenPolicy: [],
        childrenPolicyEn: []
      }];
    }
    data.operators.forEach(function (op) {
      op.childrenPolicy = Array.isArray(op.childrenPolicy) ? op.childrenPolicy : [];
      op.childrenPolicyEn = Array.isArray(op.childrenPolicyEn) ? op.childrenPolicyEn : [];
      if (op.active == null) op.active = true;
    });
    var fallbackId = data.operators[0].id;
    data.tours.forEach(function (tour) {
      if (!tour.operatorId) tour.operatorId = fallbackId;
    });
    var primary = null;
    for (var i = 0; i < data.operators.length; i++) {
      if (data.operators[i].active !== false) {
        primary = data.operators[i];
        break;
      }
    }
    primary = primary || data.operators[0];
    data.partner = {
      id: primary.id,
      name: primary.name || "",
      hotline: primary.hotline || "",
      hotlineHref: primary.hotlineHref || "",
      website: primary.website || "",
      address: primary.address || ""
    };
    data.email = data.site.email || data.email || "";
    data.phone = data.site.phone || data.phone || "";
    data.bank = data.site.bank || data.bank || {};
    return data;
  }

  window.__CATALOGUE_RAW__ = RAW;
  window.TOUR_DATA = normalize(RAW);
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
})();
`;
}

function writeCatalogue(catalogue) {
  const errors = validate(catalogue);
  if (errors.length) {
    const err = new Error(errors.join("\n"));
    err.errors = errors;
    throw err;
  }
  fs.writeFileSync(JSON_PATH, JSON.stringify(catalogue, null, 2) + "\n", "utf8");
  fs.writeFileSync(DATA_JS_PATH, renderDataJs(catalogue), "utf8");
}

module.exports = { writeCatalogue, validate, renderDataJs, JSON_PATH, DATA_JS_PATH, ROOT };
