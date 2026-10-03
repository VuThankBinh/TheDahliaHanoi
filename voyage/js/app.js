(function () {
  var D = window.DAHLIA;
  var U = window.Dahlia;
  var page = document.body.dataset.page;

  function media(src, alt, eager) {
    return '<div class="media"><img src="' + U.escapeHtml(src) + '" alt="' + U.escapeHtml(alt) + '"' +
      (eager ? ' fetchpriority="high"' : ' loading="lazy"') + '></div>';
  }

  function showErr(el, key) {
    el.hidden = false;
    el.setAttribute("data-i18n", key);
    el.textContent = U.t(key);
  }

  function wireTabs(root) {
    var tabs = root.querySelectorAll(".tab");
    var panels = root.querySelectorAll(".search-fields");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          t.classList.remove("is-on");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-on");
        tab.setAttribute("aria-selected", "true");
        panels.forEach(function (p) {
          p.classList.toggle("is-on", p.dataset.panel === tab.dataset.tab);
        });
      });
    });
  }

  function prepDates(root) {
    root.querySelectorAll('input[type="date"]').forEach(function (input) {
      if (!input.min) input.min = U.isoOffset(0);
      if (!input.value) {
        var later = input.name === "checkout" || input.name === "out";
        input.value = later ? U.isoOffset(3) : U.isoOffset(1);
      }
    });
  }

  function roomCard(room) {
    return '<a class="v-card reveal" href="book.html?room=' + room.id + '">' +
      '<div class="media">' +
      '<span class="price-badge">' + U.money(room.price) + ' ' + U.escapeHtml(U.t("perNight")) + '</span>' +
      '<img src="' + U.escapeHtml(room.image) + '" alt="' + U.escapeHtml(U.tx(room, "alt")) + '" loading="lazy">' +
      '</div>' +
      '<div class="body">' +
      '<p class="meta">' + U.escapeHtml(room.size) + ' · ' + U.escapeHtml(U.guestsLabel(room.guests)) + '</p>' +
      '<h3>' + U.escapeHtml(room.name) + '</h3>' +
      '<p class="desc">' + U.escapeHtml(U.tx(room, "desc")) + '</p>' +
      '<div class="foot-row"><span class="price">' + U.money(room.price) + ' <span>' + U.escapeHtml(U.t("perNight")) + '</span></span>' +
      '<span class="link-more" style="min-height:36px;padding:0 12px;font-size:13px">' + U.escapeHtml(U.t("link.book")) + '</span></div>' +
      '</div></a>';
  }

  function tourCard(tour) {
    return '<a class="v-card reveal" href="tours.html?tour=' + tour.id + '">' +
      '<div class="media">' +
      '<span class="tag-badge">' + U.labelKind(tour.kind) + '</span>' +
      '<span class="price-badge">' + U.money(tour.price) + '</span>' +
      '<img src="' + U.escapeHtml(tour.image) + '" alt="' + U.escapeHtml(U.tx(tour, "alt")) + '" loading="lazy">' +
      '</div>' +
      '<div class="body">' +
      '<p class="meta">' + U.escapeHtml(U.tx(tour, "duration")) + ' · ' + U.escapeHtml(U.maxGuests(tour.maxPeople)) + '</p>' +
      '<h3>' + U.escapeHtml(U.tx(tour, "name")) + '</h3>' +
      '<p class="desc">' + U.escapeHtml(U.tx(tour, "summary")) + '</p>' +
      '<div class="foot-row"><span class="price">' + U.money(tour.price) + ' <span>' + U.escapeHtml(U.t("perGuest")) + '</span></span>' +
      '<span class="link-more" style="min-height:36px;padding:0 12px;font-size:13px">' + U.escapeHtml(U.t("link.see")) + '</span></div>' +
      '</div></a>';
  }

  function renderHome() {
    var bar = document.getElementById("search-form");
    wireTabs(bar);
    prepDates(bar);
    bar.addEventListener("submit", function (e) {
      e.preventDefault();
      var tab = bar.querySelector(".tab.is-on").dataset.tab;
      var err = bar.querySelector(".form-error");
      if (tab === "tour") {
        location.href = "tours.html?date=" + encodeURIComponent(bar.date.value) +
          "&guests=" + encodeURIComponent(bar.tguests.value);
        return;
      }
      if (U.nights(bar.checkin.value, bar.checkout.value) < 1) {
        return showErr(err, "err.dates");
      }
      if (err) err.hidden = true;
      location.href = "book.html?in=" + encodeURIComponent(bar.checkin.value) +
        "&out=" + encodeURIComponent(bar.checkout.value) +
        "&guests=" + encodeURIComponent(bar.guests.value);
    });

    function paint() {
      document.getElementById("room-grid").innerHTML = D.rooms.map(roomCard).join("");
      document.getElementById("tour-rail").innerHTML = D.tours.map(tourCard).join("");
      U.bindImages(document.getElementById("room-grid"));
      U.bindImages(document.getElementById("tour-rail"));
      U.initMotion(document.getElementById("room-grid"));
      U.initMotion(document.getElementById("tour-rail"));
    }
    paint();
    U.setRepaint(paint);

    var form = document.getElementById("quick-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var err = form.querySelector(".form-error");
      if (!name) return showErr(err, "err.name");
      if (!U.isEmail(email)) return showErr(err, "err.email");
      if (message.length < 4) return showErr(err, "err.msg");
      err.hidden = true;
      U.sendMail(U.t("mail.home"), [
        U.t("mail.name") + ": " + name,
        U.t("mail.email") + ": " + email,
        U.t("mail.note") + ": " + message
      ]);
      form.classList.add("is-sent");
      form.querySelector(".form-success").classList.add("is-on");
    });
  }

  function initTours() {
    var list = document.getElementById("tour-list");
    var detail = document.getElementById("tour-detail");
    var cards = document.getElementById("tour-cards");
    var empty = document.getElementById("tour-empty");
    var state = { day: "all", kind: "all", price: "all", people: "all" };
    var currentId = null;

    function filtered() {
      return D.tours.filter(function (tour) {
        if (state.day !== "all" && tour.day !== state.day) return false;
        if (state.kind !== "all" && tour.kind !== state.kind) return false;
        if (!U.priceOk(tour, state.price)) return false;
        return U.peopleOk(tour, state.people);
      });
    }

    function renderCards() {
      var items = filtered();
      empty.hidden = items.length > 0;
      cards.innerHTML = items.map(function (tour) {
        return '<button type="button" class="tour-row reveal" data-id="' + tour.id + '">' +
          media(tour.image, U.tx(tour, "alt")) +
          '<div class="mid">' +
          '<p class="meta">' + U.labelDay(tour.day) + ' · ' + U.labelKind(tour.kind) + '</p>' +
          '<h3>' + U.escapeHtml(U.tx(tour, "name")) + '</h3>' +
          '<p class="desc">' + U.escapeHtml(U.tx(tour, "summary")) + '</p>' +
          '<p class="meta">' + U.escapeHtml(U.tx(tour, "duration")) + ' · ' + U.escapeHtml(U.maxGuests(tour.maxPeople)) + '</p>' +
          '</div>' +
          '<div class="side">' +
          '<span class="price">' + U.money(tour.price) + '</span>' +
          '<span class="go">' + U.escapeHtml(U.t("viewBookArrow")) + '</span>' +
          '</div></button>';
      }).join("");
      U.bindImages(cards);
      U.initMotion(cards);
    }

    function openTour(id, push, silent) {
      var tour = U.tourById(id);
      if (!tour) return showList(false);
      currentId = id;
      if (push) history.pushState({ tour: id }, "", "?tour=" + encodeURIComponent(id));
      list.hidden = true;
      detail.hidden = false;
      detail.innerHTML =
        '<button type="button" class="back" id="tour-back">' + U.escapeHtml(U.t("back.arrow")) + '</button>' +
        '<div class="detail-hero reveal">' + media(tour.image, U.tx(tour, "alt"), true) + '</div>' +
        '<div>' +
        '<p class="eyebrow seq">' + U.labelDay(tour.day) + ' · ' + U.labelKind(tour.kind) + '</p>' +
        '<h1 class="seq">' + U.escapeHtml(U.tx(tour, "name")) + '</h1>' +
        '<p class="lede seq">' + U.escapeHtml(U.tx(tour, "summary")) + '</p>' +
        '</div>' +
        '<div class="gallery">' + tour.gallery.map(function (g, i) { return media(g.src, U.txAt(tour, "gallery", i, "alt")); }).join("") + '</div>' +
        '<div><h2>' + U.escapeHtml(U.t("itin")) + '</h2>' +
        '<ol class="itin" style="margin-top:14px">' + tour.itinerary.map(function (step, i) {
          return '<li><time>' + U.escapeHtml(step.time) + '</time><div><strong>' +
            U.escapeHtml(U.txAt(tour, "itinerary", i, "title")) + '</strong><p>' + U.escapeHtml(U.txAt(tour, "itinerary", i, "text")) + '</p></div></li>';
        }).join("") + '</ol></div>' +
        '<div class="detail-cta">' +
        '<div><p class="eyebrow" style="margin:0">' + U.escapeHtml(U.t("price.each")) + '</p><strong>' + U.money(tour.price) + '</strong>' +
        '<p class="hint" style="margin-top:6px">' + U.escapeHtml(U.tx(tour, "includes")) + '. ' + U.escapeHtml(U.t("price.sample")) + '</p></div>' +
        '<a class="btn" href="contact.html?kind=tour&tour=' + tour.id + '">' + U.escapeHtml(U.t("btn.hold")) + '</a>' +
        '</div>';
      U.bindImages(detail);
      U.initMotion(detail);
      detail.querySelector("#tour-back").addEventListener("click", function () {
        history.pushState({}, "", "tours.html");
        showList(true);
      });
      if (!silent) window.scrollTo({ top: 0, behavior: U.reduce ? "auto" : "smooth" });
    }

    function showList(scroll) {
      currentId = null;
      detail.hidden = true;
      detail.innerHTML = "";
      list.hidden = false;
      if (scroll) window.scrollTo({ top: 0, behavior: U.reduce ? "auto" : "smooth" });
    }

    document.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var group = chip.dataset.group;
        state[group] = chip.dataset.value;
        chip.parentElement.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-on"); });
        chip.classList.add("is-on");
        renderCards();
      });
    });
    cards.addEventListener("click", function (e) {
      var btn = e.target.closest(".tour-row");
      if (btn) openTour(btn.dataset.id, true);
    });
    window.addEventListener("popstate", function () {
      var id = U.query().get("tour");
      if (id) openTour(id, false);
      else showList(false);
    });
    renderCards();
    var initial = U.query().get("tour");
    if (initial) openTour(initial, false);
    U.setRepaint(function () {
      renderCards();
      if (currentId) openTour(currentId, false, true);
    });
  }

  function initBook() {
    var inEl = document.getElementById("in-date");
    var outEl = document.getElementById("out-date");
    var guestsEl = document.getElementById("guests");
    var picks = document.getElementById("room-picks");
    var summary = document.getElementById("summary");
    var selected = null;
    var q = U.query();
    inEl.min = U.isoOffset(0);
    outEl.min = U.isoOffset(1);
    inEl.value = q.get("in") || U.isoOffset(1);
    outEl.value = q.get("out") || U.isoOffset(3);
    if (q.get("guests")) guestsEl.value = q.get("guests");

    function stay() {
      return {
        inn: inEl.value,
        out: outEl.value,
        nights: U.nights(inEl.value, outEl.value),
        guests: Number(guestsEl.value)
      };
    }

    function renderRooms() {
      var s = stay();
      var rooms = D.rooms.filter(function (r) { return r.guests >= s.guests; });
      if (selected && selected.guests < s.guests) selected = null;
      if (!rooms.length) {
        picks.innerHTML = '<p>' + U.escapeHtml(U.t("err.noRoom")) + '</p>';
        renderSummary();
        return;
      }
      picks.innerHTML = rooms.map(function (room) {
        var on = selected && selected.id === room.id ? " is-selected" : "";
        return '<button type="button" class="pick' + on + '" data-id="' + room.id + '" aria-pressed="' + (on ? "true" : "false") + '">' +
          media(room.image, U.tx(room, "alt")) +
          '<div class="body"><h3>' + U.escapeHtml(room.name) + '</h3>' +
          '<p class="meta">' + room.size + ' · ' + U.escapeHtml(U.maxGuests(room.guests)) + '</p>' +
          '<p class="desc">' + U.escapeHtml(U.tx(room, "desc")) + '</p>' +
          '<p class="price">' + U.money(room.price) + ' <span>' + U.escapeHtml(U.t("perNight")) + '</span></p></div></button>';
      }).join("");
      U.bindImages(picks);
      renderSummary();
    }

    function renderSummary() {
      if (!selected) {
        summary.classList.remove("is-on");
        summary.innerHTML = '<p class="hint">' + U.escapeHtml(U.t("pick.hint")) + '</p>';
        return;
      }
      var s = stay();
      summary.classList.add("is-on");
      if (s.nights < 1) {
        summary.innerHTML = '<p class="form-error">' + U.escapeHtml(U.t("err.dates")) + '</p>';
        return;
      }
      var total = selected.price * s.nights;
      var href = "contact.html?kind=phong&room=" + selected.id +
        "&in=" + encodeURIComponent(s.inn) +
        "&out=" + encodeURIComponent(s.out) +
        "&guests=" + s.guests;
      summary.innerHTML =
        '<p class="eyebrow">' + U.escapeHtml(U.t("estimate")) + '</p>' +
        '<p><strong>' + U.escapeHtml(selected.name) + '</strong></p>' +
        '<p class="hint">' + U.escapeHtml(U.stayLine(s.nights, s.guests)) + '</p>' +
        '<p class="hint">' + U.formatDate(s.inn) + ' → ' + U.formatDate(s.out) + '</p>' +
        '<p class="total">' + U.money(total) + '</p>' +
        '<a class="btn block" href="' + href + '">' + U.escapeHtml(U.t("btn.send")) + '</a>';
    }

    picks.addEventListener("click", function (e) {
      var btn = e.target.closest(".pick");
      if (!btn) return;
      selected = U.roomById(btn.dataset.id);
      renderRooms();
    });
    [inEl, outEl, guestsEl].forEach(function (el) { el.addEventListener("change", renderRooms); });
    var preset = q.get("room");
    if (preset) selected = U.roomById(preset);
    renderRooms();
    U.setRepaint(renderRooms);
  }

  function fillSelect(select, items, placeholder) {
    select.innerHTML = '<option value="">' + U.escapeHtml(placeholder) + '</option>' + items.map(function (item) {
      return '<option value="' + item.id + '">' + U.escapeHtml(U.tx(item, "name")) + '</option>';
    }).join("");
  }

  function initContact() {
    var form = document.getElementById("mail-form");
    var q = U.query();
    function paintSelects() {
      var roomVal = form.room.value;
      var tourVal = form.tour.value;
      fillSelect(form.room, D.rooms, U.t("choose.room"));
      fillSelect(form.tour, D.tours, U.t("choose.tour"));
      if (roomVal) form.room.value = roomVal;
      if (tourVal) form.tour.value = tourVal;
    }
    paintSelects();
    form.checkin.min = U.isoOffset(0);
    form.checkout.min = U.isoOffset(0);
    form.date.min = U.isoOffset(0);
    if (q.get("in")) form.checkin.value = q.get("in");
    if (q.get("out")) form.checkout.value = q.get("out");
    if (q.get("room")) form.room.value = q.get("room");
    if (q.get("tour")) form.tour.value = q.get("tour");
    if (!form.checkin.value) form.checkin.value = U.isoOffset(1);
    if (!form.checkout.value) form.checkout.value = U.isoOffset(3);
    if (!form.date.value) form.date.value = U.isoOffset(1);

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
      if (kind === "phong" && U.nights(form.checkin.value, form.checkout.value) < 1) {
        return showErr(err, "err.dates");
      }
      if (message.length < 4) return showErr(err, "err.msg");
      err.hidden = true;
      var room = U.roomById(form.room.value);
      var tour = U.tourById(form.tour.value);
      var lines = [
        U.t("mail.name") + ": " + name,
        U.t("mail.email") + ": " + email,
        U.t("mail.phone") + ": " + phone,
        U.t("mail.kind") + ": " + (kind === "tour" ? U.t("mail.kindTour") : U.t("mail.kindRoom"))
      ];
      if (kind === "phong") {
        lines.push(
          U.t("mail.roomField") + ": " + (room ? room.name : "—"),
          U.t("mail.in") + ": " + (form.checkin.value || "—"),
          U.t("mail.out") + ": " + (form.checkout.value || "—"),
          U.t("mail.guests") + ": " + (form.guests ? form.guests.value : "—")
        );
      } else {
        lines.push(
          U.t("mail.tourField") + ": " + (tour ? U.tx(tour, "name") : "—"),
          U.t("mail.date") + ": " + (form.date.value || "—"),
          U.t("mail.guests") + ": " + (form.tguests ? form.tguests.value : "—")
        );
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
  U.initSolidHeader();
  U.bindImages(document);
  U.initMotion();
})();
