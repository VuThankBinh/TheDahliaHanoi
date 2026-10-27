(function () {
  var state = {
    catalogue: null,
    tab: "operators",
    operatorId: null,
    tourId: null,
    destId: null,
    dirty: false
  };

  var panel = document.getElementById("panel");
  var statusEl = document.getElementById("status");

  function setStatus(text, bad) {
    statusEl.textContent = text || "";
    statusEl.classList.toggle("is-bad", !!bad);
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function slug(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/gi, "d")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);
  }

  function uniqueId(base, used) {
    var root = slug(base) || "muc";
    var id = root;
    var n = 2;
    var set = {};
    used.forEach(function (item) { set[item] = true; });
    while (set[id]) {
      id = (root.slice(0, 70) + "-" + n).slice(0, 80);
      n += 1;
    }
    return id;
  }

  function linesToText(list) {
    return (list || []).join("\n");
  }

  function textToLines(text) {
    return String(text || "").split(/\r?\n/).map(function (line) {
      return line.trim();
    }).filter(Boolean);
  }

  function stepsToText(steps) {
    return (steps || []).map(function (step) {
      return [step.time || "", step.title || "", step.text || ""].join(" | ");
    }).join("\n");
  }

  function textToSteps(text) {
    return textToLines(text).map(function (line) {
      var parts = line.split("|");
      return {
        time: (parts[0] || "").trim(),
        title: (parts[1] || "").trim(),
        text: parts.slice(2).join("|").trim()
      };
    });
  }

  function readJson(text, label, fallback) {
    var raw = String(text || "").trim();
    if (!raw) return { ok: true, value: fallback };
    try {
      return { ok: true, value: JSON.parse(raw) };
    } catch (err) {
      return { ok: false, error: label + " không phải JSON hợp lệ." };
    }
  }

  function markDirty() {
    state.dirty = true;
  }

  function ops() {
    return state.catalogue.operators || [];
  }

  function tours() {
    return state.catalogue.tours || [];
  }

  function destEntries() {
    var dests = state.catalogue.destinations || {};
    return Object.keys(dests).map(function (id) {
      return { id: id, dest: dests[id] };
    });
  }

  function findOp(id) {
    for (var i = 0; i < ops().length; i++) if (ops()[i].id === id) return ops()[i];
    return null;
  }

  function findTour(id) {
    for (var i = 0; i < tours().length; i++) if (tours()[i].id === id) return tours()[i];
    return null;
  }

  function commit() {
    if (state.tab === "operators") return commitOperator();
    if (state.tab === "tours") return commitTour();
    if (state.tab === "destinations") return commitDest();
    if (state.tab === "site") return commitSite();
    if (state.tab === "json") return commitJson();
    return true;
  }

  function commitOperator() {
    var form = document.getElementById("op-form");
    if (!form) return true;
    var op = findOp(state.operatorId);
    if (!op) return true;
    if (!form.name.value.trim()) {
      setStatus("Đơn vị cần có tên.", true);
      return false;
    }
    var nextId = slug(form.id.value);
    if (!/^[a-z0-9][a-z0-9-]{0,80}$/.test(nextId)) {
      setStatus("Id đơn vị chỉ dùng chữ thường, số và gạch ngang.", true);
      return false;
    }
    if (nextId !== op.id && findOp(nextId)) {
      setStatus("Id đơn vị đã tồn tại.", true);
      return false;
    }
    var prev = op.id;
    op.id = nextId;
    op.name = form.name.value.trim();
    op.nameEn = form.nameEn.value.trim();
    op.hotline = form.hotline.value.trim();
    op.hotlineHref = form.hotlineHref.value.trim();
    op.website = form.website.value.trim();
    op.address = form.address.value.trim();
    op.active = form.active.checked;
    op.childrenPolicy = textToLines(form.childrenPolicy.value);
    op.childrenPolicyEn = textToLines(form.childrenPolicyEn.value);
    if (prev !== nextId) {
      tours().forEach(function (tour) {
        if (tour.operatorId === prev) tour.operatorId = nextId;
      });
      state.operatorId = nextId;
    }
    return true;
  }

  function commitTour() {
    var form = document.getElementById("tour-form");
    if (!form) return true;
    var tour = findTour(state.tourId);
    if (!tour) return true;
    var nextId = slug(form.id.value);
    if (!/^[a-z0-9][a-z0-9-]{0,80}$/.test(nextId)) {
      setStatus("Id tour chỉ dùng chữ thường, số và gạch ngang.", true);
      return false;
    }
    if (nextId !== tour.id && findTour(nextId)) {
      setStatus("Id tour đã tồn tại.", true);
      return false;
    }
    var media = readJson(form.media.value, "Ảnh slideshow", []);
    if (!media.ok) { setStatus(media.error, true); return false; }
    if (!Array.isArray(media.value)) { setStatus("Ảnh slideshow phải là mảng JSON.", true); return false; }
    var menu = readJson(form.menuGallery.value, "Gallery menu", null);
    if (!menu.ok) { setStatus(menu.error, true); return false; }
    if (menu.value && (typeof menu.value !== "object" || Array.isArray(menu.value))) {
      setStatus("Gallery menu phải là object JSON.", true);
      return false;
    }
    if (!form.name.value.trim()) { setStatus("Tour cần có tên.", true); return false; }
    if (!findOp(form.operatorId.value)) { setStatus("Chọn đơn vị cho tour.", true); return false; }
    tour.id = nextId;
    tour.operatorId = form.operatorId.value;
    tour.destination = form.destination.value;
    tour.featured = form.featured.checked;
    tour.stars = Number(form.stars.value) || 0;
    tour.name = form.name.value.trim();
    tour.nameEn = form.nameEn.value.trim();
    tour.durationLabel = form.durationLabel.value.trim();
    tour.durationLabelEn = form.durationLabelEn.value.trim();
    tour.nightsOffset = Number(form.nightsOffset.value) || 0;
    tour.price = Number(String(form.price.value).replace(/[^\d.]/g, "")) || 0;
    tour.priceNote = form.priceNote.value.trim();
    tour.priceNoteEn = form.priceNoteEn.value.trim();
    tour.image = form.image.value.trim();
    tour.cardLine = form.cardLine.value.trim();
    tour.cardLineEn = form.cardLineEn.value.trim();
    tour.description = textToLines(form.description.value);
    tour.descriptionEn = textToLines(form.descriptionEn.value);
    tour.itinerary = textToSteps(form.itinerary.value);
    tour.itineraryEn = textToSteps(form.itineraryEn.value);
    tour.servicesIncluded = textToLines(form.servicesIncluded.value);
    tour.servicesIncludedEn = textToLines(form.servicesIncludedEn.value);
    tour.servicesExcluded = textToLines(form.servicesExcluded.value);
    tour.servicesExcludedEn = textToLines(form.servicesExcludedEn.value);
    tour.offers = textToLines(form.offers.value);
    tour.offersEn = textToLines(form.offersEn.value);
    tour.serviceNote = form.serviceNote.value.trim();
    tour.serviceNoteEn = form.serviceNoteEn.value.trim();
    tour.media = media.value;
    var policy = textToLines(form.childrenPolicy.value);
    var policyEn = textToLines(form.childrenPolicyEn.value);
    if (policy.length) tour.childrenPolicy = policy;
    else delete tour.childrenPolicy;
    if (policyEn.length) tour.childrenPolicyEn = policyEn;
    else delete tour.childrenPolicyEn;
    if (menu.value) tour.menuGallery = menu.value;
    else delete tour.menuGallery;
    state.tourId = nextId;
    return true;
  }

  function commitDest() {
    var form = document.getElementById("dest-form");
    if (!form) return true;
    var prev = state.destId;
    var dests = state.catalogue.destinations || {};
    var current = dests[prev];
    if (!current) return true;
    var nextId = slug(form.id.value);
    if (!/^[a-z0-9][a-z0-9-]{0,80}$/.test(nextId)) {
      setStatus("Id điểm đến chỉ dùng chữ thường, số và gạch ngang.", true);
      return false;
    }
    if (nextId !== prev && dests[nextId]) {
      setStatus("Id điểm đến đã tồn tại.", true);
      return false;
    }
    var media = readJson(form.media.value, "Ảnh điểm đến", []);
    if (!media.ok) { setStatus(media.error, true); return false; }
    if (!Array.isArray(media.value)) { setStatus("Ảnh điểm đến phải là mảng JSON.", true); return false; }
    if (!form.name.value.trim()) { setStatus("Điểm đến cần có tên.", true); return false; }
    var next = {
      id: nextId,
      name: form.name.value.trim(),
      nameEn: form.nameEn.value.trim(),
      title: form.title.value.trim(),
      titleEn: form.titleEn.value.trim(),
      lead: form.lead.value.trim(),
      leadEn: form.leadEn.value.trim(),
      video: form.video.value.trim(),
      media: media.value
    };
    if (nextId !== prev) delete dests[prev];
    dests[nextId] = next;
    state.catalogue.destinations = dests;
    if (prev !== nextId) {
      tours().forEach(function (tour) {
        if (tour.destination === prev) tour.destination = nextId;
      });
    }
    state.destId = nextId;
    return true;
  }

  function commitSite() {
    var form = document.getElementById("site-form");
    if (!form) return true;
    var hero = readJson(form.hero.value, "Banner", { interval: 10000, slides: [] });
    if (!hero.ok) { setStatus(hero.error, true); return false; }
    if (!hero.value || !Array.isArray(hero.value.slides)) {
      setStatus("Banner cần có mảng slides.", true);
      return false;
    }
    state.catalogue.site = state.catalogue.site || {};
    state.catalogue.site.email = form.email.value.trim();
    state.catalogue.site.phone = form.phone.value.trim();
    state.catalogue.site.bank = {
      name: form.bankName.value.trim(),
      accountName: form.accountName.value.trim(),
      accountNumber: form.accountNumber.value.trim(),
      note: form.note.value.trim(),
      noteEn: form.noteEn.value.trim()
    };
    state.catalogue.hero = hero.value;
    return true;
  }

  function commitJson() {
    var el = document.getElementById("raw-json");
    if (!el) return true;
    var data;
    try {
      data = JSON.parse(el.value);
    } catch (err) {
      setStatus("JSON không hợp lệ: " + err.message, true);
      return false;
    }
    state.catalogue = data;
    if (!findOp(state.operatorId)) state.operatorId = (ops()[0] || {}).id || null;
    if (!findTour(state.tourId)) state.tourId = (tours()[0] || {}).id || null;
    if (!(state.catalogue.destinations || {})[state.destId]) {
      state.destId = Object.keys(state.catalogue.destinations || {})[0] || null;
    }
    return true;
  }

  function field(label, name, value, extra) {
    return "<label>" + esc(label) + '<input name="' + esc(name) + '" value="' + esc(value) + '"' + (extra || "") + "></label>";
  }

  function area(label, name, value, hint) {
    return "<label>" + esc(label) +
      (hint ? '<span class="hint">' + esc(hint) + "</span>" : "") +
      '<textarea name="' + esc(name) + '">' + esc(value) + "</textarea></label>";
  }

  function renderOperators() {
    var op = findOp(state.operatorId) || ops()[0];
    state.operatorId = op ? op.id : null;
    var list = ops().map(function (item) {
      var count = tours().filter(function (tour) { return tour.operatorId === item.id; }).length;
      return '<button type="button" class="pick' + (item.id === state.operatorId ? " is-on" : "") + '" data-op="' + esc(item.id) + '">' +
        esc(item.name || item.id) +
        "<small>" + esc(item.id) + " · " + count + " tour" + (item.active === false ? " · ẩn" : "") + "</small></button>";
    }).join("");
    var form = "";
    if (op) {
      form =
        '<form id="op-form" class="form">' +
        "<h2>" + esc(op.name || "Đơn vị") + "</h2>" +
        '<div class="grid-2">' +
        field("Id", "id", op.id) +
        field("Tên", "name", op.name) +
        field("Tên tiếng Anh", "nameEn", op.nameEn) +
        field("Hotline", "hotline", op.hotline) +
        field("Link gọi", "hotlineHref", op.hotlineHref) +
        field("Website", "website", op.website) +
        "</div>" +
        field("Địa chỉ", "address", op.address) +
        '<label class="check"><input type="checkbox" name="active"' + (op.active === false ? "" : " checked") + "> Đang bán tour của đơn vị này</label>" +
        area("Children Policy", "childrenPolicy", linesToText(op.childrenPolicy), "Mỗi dòng một ý. Tour để trống sẽ dùng chính sách này.") +
        area("Children Policy (English)", "childrenPolicyEn", linesToText(op.childrenPolicyEn), "Mỗi dòng một ý.") +
        '<div class="row-actions"><button type="button" class="btn danger" id="delete-op">Xóa đơn vị</button></div>' +
        "</form>";
    }
    panel.innerHTML =
      '<div class="split"><aside class="list"><div class="list-head"><h2>Đơn vị</h2><button type="button" class="btn" id="add-op">Thêm</button></div><div class="picks">' +
      (list || "<p class=\"hint\">Chưa có đơn vị.</p>") +
      "</div></aside>" + form + "</div>";
  }

  function renderTours() {
    var tour = findTour(state.tourId) || tours()[0];
    state.tourId = tour ? tour.id : null;
    var list = tours().map(function (item) {
      var op = findOp(item.operatorId);
      return '<button type="button" class="pick' + (item.id === state.tourId ? " is-on" : "") + '" data-tour="' + esc(item.id) + '">' +
        esc(item.name || item.id) +
        "<small>" + esc((op && op.name) || item.operatorId || "Chưa gắn đơn vị") + "</small></button>";
    }).join("");
    var opOptions = ops().map(function (op) {
      return '<option value="' + esc(op.id) + '"' + (tour && tour.operatorId === op.id ? " selected" : "") + ">" + esc(op.name) + "</option>";
    }).join("");
    var destOptions = destEntries().map(function (entry) {
      return '<option value="' + esc(entry.id) + '"' + (tour && tour.destination === entry.id ? " selected" : "") + ">" + esc(entry.dest.name || entry.id) + "</option>";
    }).join("");
    var form = "";
    if (tour) {
      form =
        '<form id="tour-form" class="form">' +
        "<h2>" + esc(tour.name || "Tour") + "</h2>" +
        '<div class="grid-2">' +
        field("Id", "id", tour.id) +
        '<label>Đơn vị<select name="operatorId">' + opOptions + "</select></label>" +
        '<label>Điểm đến<select name="destination">' + destOptions + "</select></label>" +
        field("Tên", "name", tour.name) +
        field("Tên tiếng Anh", "nameEn", tour.nameEn) +
        field("Thời lượng", "durationLabel", tour.durationLabel) +
        field("Thời lượng (English)", "durationLabelEn", tour.durationLabelEn) +
        field("Giá (đồng)", "price", tour.price, ' inputmode="numeric"') +
        field("Số đêm cộng thêm", "nightsOffset", tour.nightsOffset || 0, ' inputmode="numeric"') +
        '<label>Hạng sao<select name="stars">' + [5, 4, 3, 2, 1].map(function (n) {
          return '<option value="' + n + '"' + (Number(tour.stars) === n ? " selected" : "") + ">" + n + " sao</option>";
        }).join("") + "</select></label>" +
        field("Ghi chú giá", "priceNote", tour.priceNote) +
        field("Ghi chú giá (English)", "priceNoteEn", tour.priceNoteEn) +
        "</div>" +
        '<label class="check"><input type="checkbox" name="featured"' + (tour.featured ? " checked" : "") + "> Tour nổi bật trên trang chủ</label>" +
        field("Ảnh thẻ", "image", tour.image) +
        area("Mô tả ngắn", "cardLine", tour.cardLine) +
        area("Mô tả ngắn (English)", "cardLineEn", tour.cardLineEn) +
        area("Mô tả", "description", linesToText(tour.description), "Mỗi dòng một đoạn.") +
        area("Mô tả (English)", "descriptionEn", linesToText(tour.descriptionEn), "Mỗi dòng một đoạn.") +
        area("Lịch trình", "itinerary", stepsToText(tour.itinerary), "Mỗi dòng: giờ | tiêu đề | nội dung") +
        area("Lịch trình (English)", "itineraryEn", stepsToText(tour.itineraryEn), "Mỗi dòng: time | title | text") +
        area("Đã gồm", "servicesIncluded", linesToText(tour.servicesIncluded), "Mỗi dòng một ý.") +
        area("Đã gồm (English)", "servicesIncludedEn", linesToText(tour.servicesIncludedEn)) +
        area("Chưa gồm", "servicesExcluded", linesToText(tour.servicesExcluded)) +
        area("Chưa gồm (English)", "servicesExcludedEn", linesToText(tour.servicesExcludedEn)) +
        area("Ưu đãi", "offers", linesToText(tour.offers)) +
        area("Ưu đãi (English)", "offersEn", linesToText(tour.offersEn)) +
        area("Ghi chú giá / dịch vụ", "serviceNote", tour.serviceNote || "") +
        area("Ghi chú giá / dịch vụ (English)", "serviceNoteEn", tour.serviceNoteEn || "") +
        area("Children Policy riêng", "childrenPolicy", linesToText(tour.childrenPolicy), "Để trống để dùng chính sách của đơn vị. Mỗi dòng một ý.") +
        area("Children Policy riêng (English)", "childrenPolicyEn", linesToText(tour.childrenPolicyEn), "Để trống để dùng bản tiếng Anh của đơn vị.") +
        area("Ảnh slideshow (JSON)", "media", JSON.stringify(tour.media || [], null, 2)) +
        area("Gallery menu (JSON)", "menuGallery", tour.menuGallery ? JSON.stringify(tour.menuGallery, null, 2) : "") +
        '<div class="row-actions"><button type="button" class="btn danger" id="delete-tour">Xóa tour</button></div>' +
        "</form>";
    }
    panel.innerHTML =
      '<div class="split"><aside class="list"><div class="list-head"><h2>Tour</h2><button type="button" class="btn" id="add-tour">Thêm</button></div>' +
      '<input id="tour-q" placeholder="Tìm tour hoặc đơn vị" style="margin-bottom:8px">' +
      '<div class="picks" id="tour-picks">' + (list || "<p class=\"hint\">Chưa có tour.</p>") + "</div></aside>" +
      form + "</div>";
  }

  function renderDestinations() {
    var entries = destEntries();
    var current = (state.catalogue.destinations || {})[state.destId] ? state.destId : (entries[0] && entries[0].id);
    state.destId = current || null;
    var dest = current ? state.catalogue.destinations[current] : null;
    var list = entries.map(function (entry) {
      return '<button type="button" class="pick' + (entry.id === state.destId ? " is-on" : "") + '" data-dest="' + esc(entry.id) + '">' +
        esc(entry.dest.name || entry.id) + "<small>" + esc(entry.id) + "</small></button>";
    }).join("");
    var form = "";
    if (dest) {
      form =
        '<form id="dest-form" class="form">' +
        "<h2>" + esc(dest.name || "Điểm đến") + "</h2>" +
        '<div class="grid-2">' +
        field("Id", "id", current) +
        field("Tên", "name", dest.name) +
        field("Tên tiếng Anh", "nameEn", dest.nameEn) +
        field("Tiêu đề", "title", dest.title) +
        field("Tiêu đề (English)", "titleEn", dest.titleEn) +
        "</div>" +
        area("Lead", "lead", dest.lead || "") +
        area("Lead (English)", "leadEn", dest.leadEn || "") +
        field("Video", "video", dest.video || "") +
        area("Ảnh (JSON)", "media", JSON.stringify(dest.media || [], null, 2)) +
        '<div class="row-actions"><button type="button" class="btn danger" id="delete-dest">Xóa điểm đến</button></div>' +
        "</form>";
    }
    panel.innerHTML =
      '<div class="split"><aside class="list"><div class="list-head"><h2>Điểm đến</h2><button type="button" class="btn" id="add-dest">Thêm</button></div><div class="picks">' +
      (list || "<p class=\"hint\">Chưa có điểm đến.</p>") + "</div></aside>" + form + "</div>";
  }

  function renderSite() {
    var site = state.catalogue.site || {};
    var bank = site.bank || {};
    panel.innerHTML =
      '<form id="site-form" class="site-form">' +
      "<h2>Trang web</h2>" +
      '<div class="grid-2">' +
      field("Email", "email", site.email) +
      field("Điện thoại", "phone", site.phone) +
      field("Ngân hàng", "bankName", bank.name) +
      field("Chủ tài khoản", "accountName", bank.accountName) +
      field("Số tài khoản", "accountNumber", bank.accountNumber) +
      field("Ghi chú chuyển khoản", "note", bank.note) +
      field("Ghi chú (English)", "noteEn", bank.noteEn) +
      "</div>" +
      area("Banner trang chủ (JSON)", "hero", JSON.stringify(state.catalogue.hero || { interval: 10000, slides: [] }, null, 2)) +
      "</form>";
    var heroBox = panel.querySelector("textarea");
    if (heroBox) heroBox.classList.add("tall");
  }

  function renderJson() {
    panel.innerHTML =
      '<div class="json-wrap"><p class="hint">Sửa toàn bộ catalogue rồi bấm Lưu. Cấu trúc: site, operators, hero, destinations, tours. Mỗi tour có operatorId.</p>' +
      '<textarea id="raw-json">' + esc(JSON.stringify(state.catalogue, null, 2)) + "</textarea></div>";
  }

  function render() {
    document.querySelectorAll(".tabs button").forEach(function (btn) {
      btn.classList.toggle("is-on", btn.dataset.tab === state.tab);
    });
    if (state.tab === "operators") renderOperators();
    else if (state.tab === "tours") renderTours();
    else if (state.tab === "destinations") renderDestinations();
    else if (state.tab === "site") renderSite();
    else renderJson();
    bind();
  }

  function goTab(name) {
    if (name === state.tab) return;
    if (!commit()) return;
    state.tab = name;
    render();
  }

  function bind() {
    panel.querySelectorAll("input, textarea, select").forEach(function (el) {
      if (el.id === "tour-q") return;
      el.addEventListener("input", markDirty);
      el.addEventListener("change", markDirty);
    });
    panel.querySelectorAll("[data-op]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!commit()) return;
        state.operatorId = btn.dataset.op;
        render();
      });
    });
    panel.querySelectorAll("[data-tour]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!commit()) return;
        state.tourId = btn.dataset.tour;
        render();
      });
    });
    panel.querySelectorAll("[data-dest]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!commit()) return;
        state.destId = btn.dataset.dest;
        render();
      });
    });
    var search = document.getElementById("tour-q");
    if (search) {
      search.addEventListener("input", function () {
        var q = search.value.trim().toLowerCase();
        panel.querySelectorAll("[data-tour]").forEach(function (btn) {
          btn.hidden = q && btn.textContent.toLowerCase().indexOf(q) === -1;
        });
      });
    }
    var addOp = document.getElementById("add-op");
    if (addOp) addOp.addEventListener("click", function () {
      if (!commit()) return;
      var id = uniqueId("don-vi-moi", ops().map(function (op) { return op.id; }));
      ops().push({
        id: id,
        name: "Đơn vị mới",
        nameEn: "New operator",
        hotline: "",
        hotlineHref: "",
        website: "",
        address: "",
        active: true,
        childrenPolicy: [],
        childrenPolicyEn: []
      });
      state.operatorId = id;
      markDirty();
      render();
    });
    var deleteOp = document.getElementById("delete-op");
    if (deleteOp) deleteOp.addEventListener("click", function () {
      if (!commit()) return;
      var id = state.operatorId;
      if (tours().some(function (tour) { return tour.operatorId === id; })) {
        setStatus("Còn tour thuộc đơn vị này. Chuyển tour sang đơn vị khác hoặc xóa tour trước.", true);
        return;
      }
      if (!window.confirm("Xóa đơn vị " + id + "?")) return;
      state.catalogue.operators = ops().filter(function (op) { return op.id !== id; });
      state.operatorId = (ops()[0] || {}).id || null;
      markDirty();
      render();
    });
    var addTour = document.getElementById("add-tour");
    if (addTour) addTour.addEventListener("click", function () {
      if (!commit()) return;
      if (!ops().length) { setStatus("Thêm một đơn vị trước khi thêm tour.", true); return; }
      var dests = Object.keys(state.catalogue.destinations || {});
      if (!dests.length) { setStatus("Thêm một điểm đến trước khi thêm tour.", true); return; }
      var id = uniqueId("tour-moi", tours().map(function (tour) { return tour.id; }));
      var tour = {
        id: id,
        operatorId: state.operatorId && findOp(state.operatorId) ? state.operatorId : ops()[0].id,
        destination: dests[0],
        featured: false,
        stars: 5,
        name: "Tour mới",
        nameEn: "New tour",
        durationLabel: "1 ngày",
        durationLabelEn: "1 day",
        nightsOffset: 0,
        price: 0,
        priceNote: "",
        priceNoteEn: "",
        image: "",
        media: [],
        cardLine: "",
        cardLineEn: "",
        description: [],
        descriptionEn: [],
        itinerary: [],
        itineraryEn: [],
        servicesIncluded: [],
        servicesIncludedEn: [],
        servicesExcluded: [],
        servicesExcludedEn: [],
        offers: [],
        offersEn: [],
        serviceNote: "",
        serviceNoteEn: ""
      };
      tours().push(tour);
      state.tourId = id;
      markDirty();
      render();
    });
    var deleteTour = document.getElementById("delete-tour");
    if (deleteTour) deleteTour.addEventListener("click", function () {
      var id = state.tourId;
      if (!window.confirm("Xóa tour " + id + "?")) return;
      state.catalogue.tours = tours().filter(function (tour) { return tour.id !== id; });
      state.tourId = (tours()[0] || {}).id || null;
      markDirty();
      render();
    });
    var addDest = document.getElementById("add-dest");
    if (addDest) addDest.addEventListener("click", function () {
      if (!commit()) return;
      var id = uniqueId("diem-den-moi", Object.keys(state.catalogue.destinations || {}));
      state.catalogue.destinations = state.catalogue.destinations || {};
      state.catalogue.destinations[id] = {
        id: id,
        name: "Điểm đến mới",
        nameEn: "New destination",
        title: "",
        titleEn: "",
        lead: "",
        leadEn: "",
        video: "",
        media: []
      };
      state.destId = id;
      markDirty();
      render();
    });
    var deleteDest = document.getElementById("delete-dest");
    if (deleteDest) deleteDest.addEventListener("click", function () {
      var id = state.destId;
      if (tours().some(function (tour) { return tour.destination === id; })) {
        setStatus("Còn tour dùng điểm đến này.", true);
        return;
      }
      if (!window.confirm("Xóa điểm đến " + id + "?")) return;
      delete state.catalogue.destinations[id];
      state.destId = Object.keys(state.catalogue.destinations || {})[0] || null;
      markDirty();
      render();
    });
  }

  function download() {
    if (!commit()) return;
    var blob = new Blob([JSON.stringify(state.catalogue, null, 2) + "\n"], { type: "application/json" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "catalogue.json";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function save() {
    if (!commit()) return;
    var btn = document.getElementById("save");
    btn.disabled = true;
    setStatus("Đang ghi file…");
    try {
      var res = await fetch("/api/catalogue", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.catalogue)
      });
      var body = await res.json().catch(function () { return {}; });
      if (!res.ok || !body.ok) {
        setStatus((body.errors || ["Không ghi được file."]).join(" "), true);
        return;
      }
      state.dirty = false;
      setStatus("Đã ghi đè shared/catalogue.json và shared/data.js. Tải lại trang tour để xem.");
    } catch (err) {
      setStatus("Không kết nối được máy chủ. Trong thư mục dự án chạy npm start, rồi mở http://127.0.0.1:4173/admin/ . Có thể Tải JSON để lưu bản sao.", true);
    } finally {
      btn.disabled = false;
    }
  }

  document.querySelectorAll(".tabs button").forEach(function (btn) {
    btn.addEventListener("click", function () { goTab(btn.dataset.tab); });
  });
  document.getElementById("save").addEventListener("click", save);
  document.getElementById("download").addEventListener("click", download);
  window.addEventListener("beforeunload", function (event) {
    if (!state.dirty) return;
    event.preventDefault();
    event.returnValue = "";
  });

  async function boot() {
    setStatus("Đang tải catalogue…");
    try {
      var data = null;
      try {
        var res = await fetch("/api/catalogue", { cache: "no-store" });
        if (res.ok) data = await res.json();
      } catch (err) { /* mở file tĩnh */ }
      if (!data) {
        var file = await fetch("../shared/catalogue.json", { cache: "no-store" });
        if (file.ok) data = await file.json();
      }
      if (!data && window.__CATALOGUE_RAW__) data = JSON.parse(JSON.stringify(window.__CATALOGUE_RAW__));
      if (!data) throw new Error("missing");
      state.catalogue = data;
      state.operatorId = (ops()[0] || {}).id || null;
      state.tourId = (tours()[0] || {}).id || null;
      state.destId = Object.keys(state.catalogue.destinations || {})[0] || null;
      setStatus(ops().length + " đơn vị · " + tours().length + " tour.");
      render();
    } catch (err) {
      setStatus("Không đọc được catalogue. Chạy npm start rồi mở http://127.0.0.1:4173/admin/", true);
    }
  }

  boot();
})();
