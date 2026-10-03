(function () {
  var D = window.DAHLIA;
  var U = window.Dahlia;
  var page = document.body.dataset.page;

  function media(src, alt) {
    return '<div class="media"><img src="' + U.escapeHtml(src) + '" alt="' + U.escapeHtml(alt) + '" loading="lazy"></div>';
  }
  function showErr(el, key) {
    el.hidden = false;
    el.setAttribute("data-i18n", key);
    el.textContent = U.t(key);
  }

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
        showErr(card.querySelector(".form-error"), "err.dates");
        return;
      }
      location.href = "book.html?in=" + encodeURIComponent(card.checkin.value) + "&out=" + encodeURIComponent(card.checkout.value) + "&guests=" + encodeURIComponent(card.guests.value);
    });

    function paint() {
      document.getElementById("room-grid").innerHTML = D.rooms.map(function (room) {
        return '<article class="soft-card room-card reveal"><a href="book.html?room=' + room.id + '">' + media(room.image, U.tx(room, "alt")) + '</a>' +
          '<div class="card-body"><h3>' + U.escapeHtml(room.name) + '</h3>' +
          '<p class="spec">' + room.size + ' · ' + U.escapeHtml(U.guestsLabel(room.guests)) + '</p>' +
          '<p>' + U.escapeHtml(U.tx(room, "desc")) + '</p>' +
          '<p class="price">' + U.money(room.price) + ' ' + U.escapeHtml(U.t("perNight")) + '</p>' +
          '<a class="btn" href="book.html?room=' + room.id + '">' + U.escapeHtml(U.t("book.this")) + '</a></div></article>';
      }).join("");
      document.getElementById("tour-grid").innerHTML = D.tours.map(function (tour) {
        return '<article class="soft-card tour-card reveal"><a href="tours.html?tour=' + tour.id + '">' + media(tour.image, U.tx(tour, "alt")) + '</a>' +
          '<div class="card-body"><h3>' + U.escapeHtml(U.tx(tour, "name")) + '</h3>' +
          '<p class="dur">' + U.labelSession(tour.session) + ' · ' + U.escapeHtml(U.tx(tour, "duration")) + '</p>' +
          '<p>' + U.escapeHtml(U.tx(tour, "summary")) + '</p>' +
          '<p class="price">' + U.money(tour.price) + ' ' + U.escapeHtml(U.t("perGuest")) + '</p>' +
          '<a class="btn" href="tours.html?tour=' + tour.id + '">' + U.escapeHtml(U.t("see.tour")) + '</a></div></article>';
      }).join("");
      U.bindImages(document.getElementById("room-grid"));
      U.bindImages(document.getElementById("tour-grid"));
      U.initMotion(document.getElementById("room-grid"));
      U.initMotion(document.getElementById("tour-grid"));
    }
    paint();
    U.setRepaint(paint);
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
    var currentId = null;
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
          media(tour.image, U.tx(tour, "alt")) +
          '<div class="card-body"><p class="dur">' + U.labelSession(tour.session) + ' · ' + U.escapeHtml(U.tx(tour, "duration")) + '</p>' +
          '<h3>' + U.escapeHtml(U.tx(tour, "name")) + '</h3><p>' + U.escapeHtml(U.tx(tour, "summary")) + '</p>' +
          '<p class="price">' + U.money(tour.price) + ' ' + U.escapeHtml(U.t("perGuest")) + '</p><span class="btn">' + U.escapeHtml(U.t("viewBook")) + '</span></div></button></article>';
      }).join("");
      U.bindImages(cards);
      U.initMotion(cards);
    }

    function openTour(id, push, silent) {
      var tour = U.tourById(id);
      if (!tour) return;
      currentId = id;
      if (push) history.pushState({ tour: id }, "", "?tour=" + id);
      list.hidden = true;
      detail.hidden = false;
      detail.innerHTML = '<button type="button" class="back" id="tour-back">' + U.escapeHtml(U.t("back.list")) + '</button>' +
        '<p class="eyebrow">' + U.labelSession(tour.session) + '</p><h1>' + U.escapeHtml(U.tx(tour, "name")) + '</h1>' +
        '<p class="lede">' + U.escapeHtml(U.tx(tour, "summary")) + '</p>' +
        '<div class="gallery">' + tour.gallery.map(function (g, i) { return media(g.src, U.txAt(tour, "gallery", i, "alt")); }).join("") + '</div>' +
        '<div class="tour-stack">' + tour.itinerary.map(function (step, i) {
          return '<article class="hour"><time>' + U.escapeHtml(step.time) + '</time><div><strong>' + U.escapeHtml(U.txAt(tour, "itinerary", i, "title")) + '</strong><p>' + U.escapeHtml(U.txAt(tour, "itinerary", i, "text")) + '</p></div></article>';
        }).join("") + '</div>' +
        '<div class="price-pill"><div><p>' + U.escapeHtml(U.t("price.each")) + '</p><strong>' + U.money(tour.price) + '</strong><p>' + U.escapeHtml(U.tx(tour, "includes")) + '</p></div>' +
        '<a class="btn" href="contact.html?kind=tour&tour=' + tour.id + '">' + U.escapeHtml(U.t("btn.hold")) + '</a></div>';
      U.bindImages(detail);
      detail.querySelector("#tour-back").addEventListener("click", function () {
        history.pushState({}, "", "tours.html");
        currentId = null;
        detail.hidden = true;
        list.hidden = false;
      });
      if (!silent) window.scrollTo({ top: 0, behavior: U.reduce ? "auto" : "smooth" });
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
      else { currentId = null; detail.hidden = true; list.hidden = false; }
    });
    render();
    if (q.get("tour")) openTour(q.get("tour"), false);
    U.setRepaint(function () {
      render();
      if (currentId) openTour(currentId, false, true);
    });
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
          media(room.image, U.tx(room, "alt")) +
          '<div class="card-body"><h3>' + U.escapeHtml(room.name) + '</h3>' +
          '<p class="spec">' + room.size + ' · ' + U.escapeHtml(U.maxGuests(room.guests)) + '</p>' +
          '<p>' + U.escapeHtml(U.tx(room, "desc")) + '</p><p class="price">' + U.money(room.price) + ' ' + U.escapeHtml(U.t("perNight")) + '</p></div></button>';
      }).join("") : "<p>" + U.escapeHtml(U.t("err.noRoomPeople")) + "</p>";
      U.bindImages(list);
      if (!selected || nights < 1) {
        box.classList.remove("is-on");
        box.innerHTML = nights < 1 && selected ? '<p class="form-error">' + U.escapeHtml(U.t("err.dates")) + '</p>' : "";
        return;
      }
      var total = selected.price * nights;
      box.classList.add("is-on");
      box.innerHTML = '<p>' + U.escapeHtml(U.holdingLine(selected.name, nights, guests)) + '</p>' +
        '<p class="summary-line">' + U.money(total) + '</p>' +
        '<div class="fields"><label><span>' + U.escapeHtml(U.t("label.name")) + '</span><input name="name" autocomplete="name"></label>' +
        '<label><span>Email</span><input name="email" type="email" autocomplete="email"></label>' +
        '<p class="form-error" hidden></p>' +
        '<button class="btn" type="button" id="send-book">' + U.escapeHtml(U.t("btn.send")) + '</button></div>' +
        '<div class="form-success"><h2>' + U.escapeHtml(U.t("success.title")) + '</h2><p>' + U.escapeHtml(U.successText()) + '</p></div>';
      if (keptName) box.querySelector('[name="name"]').value = keptName;
      if (keptEmail) box.querySelector('[name="email"]').value = keptEmail;
      box.querySelector("#send-book").addEventListener("click", function () {
        var name = box.querySelector('[name="name"]').value.trim();
        var email = box.querySelector('[name="email"]').value.trim();
        var err = box.querySelector(".form-error");
        if (!name) return showErr(err, "err.name");
        if (!U.isEmail(email)) return showErr(err, "err.email");
        err.hidden = true;
        U.sendMail(U.t("mail.room"), [
          U.t("mail.name") + ": " + name,
          U.t("mail.email") + ": " + email,
          U.t("mail.roomField") + ": " + selected.name,
          U.t("mail.in") + ": " + inEl.value,
          U.t("mail.out") + ": " + outEl.value,
          U.t("mail.nights") + ": " + nights,
          U.t("mail.guests") + ": " + guests,
          U.t("mail.total") + ": " + U.money(total)
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
    U.setRepaint(render);
  }

  function initContact() {
    var form = document.getElementById("mail-form");
    var q = U.query();
    var roomSelect = form.querySelector('[name="room"]');
    var tourSelect = form.querySelector('[name="tour"]');
    function paintSelects() {
      var roomVal = roomSelect.value;
      var tourVal = tourSelect.value;
      roomSelect.innerHTML = D.rooms.map(function (r) { return '<option value="' + r.id + '">' + U.escapeHtml(r.name) + '</option>'; }).join("");
      tourSelect.innerHTML = D.tours.map(function (item) { return '<option value="' + item.id + '">' + U.escapeHtml(U.tx(item, "name")) + " · " + U.money(item.price) + '</option>'; }).join("");
      if (roomVal) roomSelect.value = roomVal;
      if (tourVal) tourSelect.value = tourVal;
    }
    paintSelects();
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
      if (!name) return showErr(err, "err.name");
      if (!U.isEmail(email)) return showErr(err, "err.email");
      if (!U.isPhone(phone)) return showErr(err, "err.phone");
      if (kind === "phong" && U.nights(form.checkin.value, form.checkout.value) < 1) return showErr(err, "err.dates");
      if (message.length < 4) return showErr(err, "err.msg");
      err.hidden = true;
      var lines = [U.t("mail.name") + ": " + name, U.t("mail.email") + ": " + email, U.t("mail.phone") + ": " + phone, U.t("mail.kind") + ": " + (kind === "tour" ? U.t("mail.bookTour") : U.t("mail.bookRoom"))];
      if (kind === "phong") {
        var room = U.roomById(form.room.value);
        lines.push(U.t("mail.roomField") + ": " + (room ? room.name : ""), U.t("mail.in") + ": " + form.checkin.value, U.t("mail.out") + ": " + form.checkout.value, U.t("mail.guests") + ": " + form.guests.value);
      } else {
        var tour = U.tourById(form.tour.value);
        lines.push(U.t("mail.tourField") + ": " + (tour ? U.tx(tour, "name") : ""), U.t("mail.when") + ": " + form.date.value, U.t("mail.guests") + ": " + form.tguests.value);
      }
      lines.push(U.t("mail.note") + ": " + message);
      U.sendMail(kind === "tour" ? U.t("mail.tour") : U.t("mail.room"), lines);
      form.classList.add("is-sent");
      form.querySelector(".form-success").classList.add("is-on");
    });
    U.setRepaint(paintSelects);
  }

  if (page === "home") renderHome();
  if (page === "tours") initTours();
  if (page === "book") initBook();
  if (page === "contact") initContact();
  U.initMenu();
  U.bindImages(document);
  U.initMotion();
})();
