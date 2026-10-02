(function () {
  var D = window.DAHLIA;
  var U = window.Dahlia;
  var page = document.body.dataset.page;

  function media(src, alt) {
    return '<div class="media"><img src="' + U.escapeHtml(src) + '" alt="' + U.escapeHtml(alt) + '" loading="lazy"></div>';
  }
  function showErr(el, text) { el.hidden = false; el.textContent = text; }

  function wireTabs(root) {
    var tabs = root.querySelectorAll(".tab");
    var panels = root.querySelectorAll(".tab-panel");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          t.classList.remove("is-on");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-on");
        tab.setAttribute("aria-selected", "true");
        panels.forEach(function (p) { p.classList.toggle("is-on", p.dataset.panel === tab.dataset.tab); });
      });
    });
  }

  function prepDates(root) {
    root.querySelectorAll('input[type="date"]').forEach(function (input) {
      if (!input.min) input.min = U.isoOffset(0);
      if (!input.value) {
        var later = input.name === "out" || input.name === "checkout";
        input.value = later ? U.isoOffset(3) : U.isoOffset(1);
      }
    });
  }

  function renderHome() {
    var card = document.getElementById("search-form");
    wireTabs(card);
    prepDates(card);
    card.addEventListener("submit", function (e) {
      e.preventDefault();
      var tab = card.querySelector(".tab.is-on").dataset.tab;
      if (tab === "tour") {
        location.href = "tours.html?date=" + encodeURIComponent(card.date.value) + "&guests=" + encodeURIComponent(card.tguests.value);
        return;
      }
      if (U.nights(card.checkin.value, card.checkout.value) < 1) {
        showErr(card.querySelector(".form-error"), "Chọn ngày trả phòng sau ngày nhận.");
        return;
      }
      location.href = "book.html?in=" + encodeURIComponent(card.checkin.value) + "&out=" + encodeURIComponent(card.checkout.value) + "&guests=" + encodeURIComponent(card.guests.value);
    });

    document.getElementById("room-grid").innerHTML = D.rooms.map(function (room) {
      return '<article class="soft-card room-card reveal"><a href="book.html?room=' + room.id + '">' + media(room.image, room.alt) + '</a>' +
        '<div class="card-body"><h3>' + U.escapeHtml(room.name) + '</h3>' +
        '<p class="spec">' + room.size + ' · ' + room.guests + ' khách</p>' +
        '<p>' + U.escapeHtml(room.desc) + '</p>' +
        '<p class="price">' + U.money(room.price) + ' / đêm</p>' +
        '<a class="btn" href="book.html?room=' + room.id + '">Book phòng</a></div></article>';
    }).join("");

    document.getElementById("tour-grid").innerHTML = D.tours.map(function (tour) {
      return '<article class="soft-card tour-card reveal"><a href="tours.html?tour=' + tour.id + '">' + media(tour.image, tour.alt) + '</a>' +
        '<div class="card-body"><h3>' + U.escapeHtml(tour.name) + '</h3>' +
        '<p class="dur">' + U.labelSession(tour.session) + ' · ' + tour.duration + '</p>' +
        '<p>' + U.escapeHtml(tour.summary) + '</p>' +
        '<p class="price">' + U.money(tour.price) + ' / khách</p>' +
        '<a class="btn" href="tours.html?tour=' + tour.id + '">Xem tour</a></div></article>';
    }).join("");
  }

  function initTours() {
    var card = document.getElementById("search-form");
    wireTabs(card);
    prepDates(card);
    var q = U.query();
    if (q.get("date")) card.date.value = q.get("date");
    if (q.get("guests")) card.tguests.value = q.get("guests");
    card.addEventListener("submit", function (e) {
      e.preventDefault();
      var tab = card.querySelector(".tab.is-on").dataset.tab;
      if (tab === "phong") {
        if (U.nights(card.checkin.value, card.checkout.value) < 1) return;
        location.href = "book.html?in=" + encodeURIComponent(card.checkin.value) + "&out=" + encodeURIComponent(card.checkout.value) + "&guests=" + encodeURIComponent(card.guests.value);
        return;
      }
      render();
    });

    var state = { session: "all", price: "all" };
    var list = document.getElementById("tour-list");
    var detail = document.getElementById("tour-detail");
    var cards = document.getElementById("tour-cards");
    var empty = document.getElementById("tour-empty");

    function render() {
      var items = D.tours.filter(function (tour) {
        if (state.session !== "all" && tour.session !== state.session) return false;
        return U.priceOk(tour, state.price);
      });
      empty.hidden = items.length > 0;
      cards.innerHTML = items.map(function (tour) {
        return '<article class="soft-card tour-card reveal"><button type="button" class="card-body" data-id="' + tour.id + '" style="text-align:left;border:0;background:transparent;padding:0">' +
          media(tour.image, tour.alt) +
          '<div class="card-body"><p class="dur">' + U.labelSession(tour.session) + ' · ' + tour.duration + '</p>' +
          '<h3>' + U.escapeHtml(tour.name) + '</h3><p>' + U.escapeHtml(tour.summary) + '</p>' +
          '<p class="price">' + U.money(tour.price) + ' / khách</p><span class="btn">Xem và đặt</span></div></button></article>';
      }).join("");
      U.bindImages(cards);
      U.initMotion(cards);
    }

    function openTour(id, push) {
      var tour = U.tourById(id);
      if (!tour) return;
      if (push) history.pushState({ tour: id }, "", "?tour=" + id);
      list.hidden = true;
      detail.hidden = false;
      detail.innerHTML = '<button type="button" class="back" id="tour-back">Quay lại danh sách</button>' +
        '<p class="eyebrow">' + U.labelSession(tour.session) + '</p><h1>' + U.escapeHtml(tour.name) + '</h1>' +
        '<p class="lede">' + U.escapeHtml(tour.summary) + '</p>' +
        '<div class="gallery">' + tour.gallery.map(function (g) { return media(g.src, g.alt); }).join("") + '</div>' +
        '<div class="tour-stack">' + tour.itinerary.map(function (step) {
          return '<article class="hour"><time>' + U.escapeHtml(step.time) + '</time><div><strong>' + U.escapeHtml(step.title) + '</strong><p>' + U.escapeHtml(step.text) + '</p></div></article>';
        }).join("") + '</div>' +
        '<div class="price-pill"><div><p>Giá mỗi khách</p><strong>' + U.money(tour.price) + '</strong><p>' + U.escapeHtml(tour.includes) + '</p></div>' +
        '<a class="btn" href="contact.html?kind=tour&tour=' + tour.id + '">Gửi yêu cầu giữ chỗ</a></div>';
      U.bindImages(detail);
      detail.querySelector("#tour-back").addEventListener("click", function () {
        history.pushState({}, "", "tours.html");
        detail.hidden = true;
        list.hidden = false;
      });
      window.scrollTo({ top: 0, behavior: U.reduce ? "auto" : "smooth" });
    }

    document.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state[chip.dataset.group] = chip.dataset.value;
        chip.parentElement.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-on"); });
        chip.classList.add("is-on");
        render();
      });
    });
    cards.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-id]");
      if (btn) openTour(btn.dataset.id, true);
    });
    window.addEventListener("popstate", function () {
      var id = U.query().get("tour");
      if (id) openTour(id, false);
      else { detail.hidden = true; list.hidden = false; }
    });
    render();
    if (q.get("tour")) openTour(q.get("tour"), false);
  }

  function initBook() {
    var q = U.query();
    var inEl = document.getElementById("in-date");
    var outEl = document.getElementById("out-date");
    var guestsEl = document.getElementById("guests");
    var list = document.getElementById("room-list");
    var box = document.getElementById("inline-book");
    var selected = q.get("room") ? U.roomById(q.get("room")) : null;
    inEl.min = U.isoOffset(0);
    outEl.min = U.isoOffset(1);
    inEl.value = q.get("in") || U.isoOffset(1);
    outEl.value = q.get("out") || U.isoOffset(3);
    if (q.get("guests")) guestsEl.value = q.get("guests");

    function render() {
      var guests = Number(guestsEl.value);
      var nights = U.nights(inEl.value, outEl.value);
      var keptName = (box.querySelector('[name="name"]') || {}).value || "";
      var keptEmail = (box.querySelector('[name="email"]') || {}).value || "";
      if (selected && selected.guests < guests) selected = null;
      var rooms = D.rooms.filter(function (r) { return r.guests >= guests; });
      list.innerHTML = rooms.length ? rooms.map(function (room) {
        var on = selected && selected.id === room.id ? " is-selected" : "";
        return '<button type="button" class="soft-card room-h' + on + '" data-id="' + room.id + '">' +
          media(room.image, room.alt) +
          '<div class="card-body"><h3>' + U.escapeHtml(room.name) + '</h3>' +
          '<p class="spec">' + room.size + ' · tối đa ' + room.guests + ' khách</p>' +
          '<p>' + U.escapeHtml(room.desc) + '</p><p class="price">' + U.money(room.price) + ' / đêm</p></div></button>';
      }).join("") : "<p>Chưa có phòng vừa số khách. Căn hộ Hoa Đất nhận tối đa 4 người.</p>";
      U.bindImages(list);
      if (!selected || nights < 1) {
        box.classList.remove("is-on");
        box.innerHTML = nights < 1 && selected ? '<p class="form-error">Chọn ngày trả phòng sau ngày nhận.</p>' : "";
        return;
      }
      var total = selected.price * nights;
      box.classList.add("is-on");
      box.innerHTML = '<p>Đang giữ chỗ ' + U.escapeHtml(selected.name) + ' · ' + nights + ' đêm · ' + guests + ' khách</p>' +
        '<p class="summary-line">' + U.money(total) + '</p>' +
        '<div class="fields"><label>Họ và tên<input name="name" autocomplete="name"></label>' +
        '<label>Email<input name="email" type="email" autocomplete="email"></label>' +
        '<p class="form-error" hidden></p>' +
        '<button class="btn" type="button" id="send-book">Gửi yêu cầu</button></div>' +
        '<div class="form-success"><h2>Đã nhận yêu cầu</h2><p>' + U.escapeHtml(U.successText) + '</p></div>';
      if (keptName) box.querySelector('[name="name"]').value = keptName;
      if (keptEmail) box.querySelector('[name="email"]').value = keptEmail;
      box.querySelector("#send-book").addEventListener("click", function () {
        var name = box.querySelector('[name="name"]').value.trim();
        var email = box.querySelector('[name="email"]').value.trim();
        var err = box.querySelector(".form-error");
        if (!name) return showErr(err, "Vui lòng điền họ tên.");
        if (!U.isEmail(email)) return showErr(err, "Email chưa đúng định dạng.");
        err.hidden = true;
        U.sendMail("Yêu cầu phòng — The Dahlia Hanoi", [
          "Họ tên: " + name,
          "Email: " + email,
          "Phòng: " + selected.name,
          "Nhận phòng: " + inEl.value,
          "Trả phòng: " + outEl.value,
          "Số đêm: " + nights,
          "Số khách: " + guests,
          "Tạm tính: " + U.money(total)
        ]);
        box.classList.add("is-sent");
        box.querySelector(".form-success").classList.add("is-on");
      });
    }
    list.addEventListener("click", function (e) {
      var btn = e.target.closest(".room-h");
      if (!btn) return;
      selected = U.roomById(btn.dataset.id);
      render();
    });
    [inEl, outEl, guestsEl].forEach(function (el) { el.addEventListener("change", render); });
    render();
  }

  function initContact() {
    var form = document.getElementById("mail-form");
    var q = U.query();
    var roomSelect = form.querySelector('[name="room"]');
    var tourSelect = form.querySelector('[name="tour"]');
    roomSelect.innerHTML = D.rooms.map(function (r) { return '<option value="' + r.id + '">' + U.escapeHtml(r.name) + '</option>'; }).join("");
    tourSelect.innerHTML = D.tours.map(function (t) { return '<option value="' + t.id + '">' + U.escapeHtml(t.name) + " · " + U.money(t.price) + '</option>'; }).join("");
    form.checkin.min = U.isoOffset(0);
    form.checkout.min = U.isoOffset(1);
    form.date.min = U.isoOffset(0);
    form.checkin.value = q.get("in") || U.isoOffset(1);
    form.checkout.value = q.get("out") || U.isoOffset(3);
    if (!form.date.value) form.date.value = U.isoOffset(1);
    if (q.get("room")) roomSelect.value = q.get("room");
    if (q.get("tour")) tourSelect.value = q.get("tour");
    var kind = q.get("kind") === "tour" ? "tour" : "phong";
    function setKind(next) {
      kind = next;
      form.querySelectorAll(".choice").forEach(function (btn) {
        var on = btn.dataset.choice === kind;
        btn.classList.toggle("is-on", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
      form.querySelectorAll(".choice-panel").forEach(function (panel) {
        panel.classList.toggle("is-on", panel.dataset.panel === kind);
      });
    }
    form.querySelectorAll(".choice").forEach(function (btn) {
      btn.addEventListener("click", function () { setKind(btn.dataset.choice); });
    });
    setKind(kind);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = form.querySelector(".form-error");
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var phone = form.phone.value.trim();
      var message = form.message.value.trim();
      if (!name) return showErr(err, "Vui lòng điền họ tên.");
      if (!U.isEmail(email)) return showErr(err, "Email chưa đúng định dạng.");
      if (!U.isPhone(phone)) return showErr(err, "Số điện thoại cần ít nhất 8 chữ số.");
      if (kind === "phong" && U.nights(form.checkin.value, form.checkout.value) < 1) return showErr(err, "Chọn ngày trả phòng sau ngày nhận.");
      if (message.length < 4) return showErr(err, "Viết vài dòng nội dung giúp khách sạn.");
      err.hidden = true;
      var lines = ["Họ tên: " + name, "Email: " + email, "Điện thoại: " + phone, "Loại: " + (kind === "tour" ? "Đặt tour" : "Đặt phòng")];
      if (kind === "phong") {
        var room = U.roomById(form.room.value);
        lines.push("Phòng: " + (room ? room.name : ""), "Nhận phòng: " + form.checkin.value, "Trả phòng: " + form.checkout.value, "Số khách: " + form.guests.value);
      } else {
        var tour = U.tourById(form.tour.value);
        lines.push("Tour: " + (tour ? tour.name : ""), "Ngày đi: " + form.date.value, "Số khách: " + form.tguests.value);
      }
      lines.push("Lời nhắn: " + message);
      U.sendMail((kind === "tour" ? "Yêu cầu tour" : "Yêu cầu phòng") + " — The Dahlia Hanoi", lines);
      form.classList.add("is-sent");
      form.querySelector(".form-success").classList.add("is-on");
    });
  }

  if (page === "home") renderHome();
  if (page === "tours") initTours();
  if (page === "book") initBook();
  if (page === "contact") initContact();
  U.initMenu();
  U.bindImages(document);
  U.initMotion();
})();
