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

  function renderHome() {
    function paint() {
      document.getElementById("room-catalog").innerHTML = D.rooms.map(function (room, i) {
        return '<a class="crow reveal" href="book.html?room=' + room.id + '">' +
          '<span class="idx">0' + (i + 1) + '</span>' + media(room.image, U.tx(room, "alt")) +
          '<div><h3>' + U.escapeHtml(room.name) + '</h3><p>' + U.escapeHtml(U.tx(room, "desc")) + '</p></div>' +
          '<div class="side"><p>' + room.size + ' · ' + U.escapeHtml(U.guestsLabel(room.guests)) + '</p><strong>' + U.money(room.price) + '</strong></div></a>';
      }).join("");
      document.getElementById("tour-catalog").innerHTML = D.tours.map(function (tour) {
        return '<a class="trow reveal" href="tours.html?tour=' + tour.id + '">' +
          media(tour.image, U.tx(tour, "alt")) +
          '<div><span class="tag">' + U.labelNoir(tour.noir) + '</span><h3>' + U.escapeHtml(U.tx(tour, "name")) + '</h3>' +
          '<p>' + U.escapeHtml(U.tx(tour, "duration")) + ' · ' + U.escapeHtml(U.tx(tour, "summary")) + '</p></div>' +
          '<div class="side"><p class="price">' + U.money(tour.price) + '</p></div></a>';
      }).join("");
      U.bindImages(document.getElementById("room-catalog"));
      U.bindImages(document.getElementById("tour-catalog"));
      U.initMotion(document.getElementById("room-catalog"));
      U.initMotion(document.getElementById("tour-catalog"));
    }
    paint();
    U.setRepaint(paint);
  }

  function initTours() {
    var list = document.getElementById("tour-list");
    var detail = document.getElementById("tour-detail");
    var cards = document.getElementById("tour-cards");
    var empty = document.getElementById("tour-empty");
    var filter = "all";
    var currentId = null;

    function render() {
      var items = D.tours.filter(function (tour) { return filter === "all" || tour.noir === filter; });
      empty.hidden = items.length > 0;
      cards.innerHTML = items.map(function (tour) {
        return '<button type="button" class="trow reveal" data-id="' + tour.id + '">' +
          media(tour.image, U.tx(tour, "alt")) +
          '<div><span class="tag">' + U.labelNoir(tour.noir) + '</span><h3>' + U.escapeHtml(U.tx(tour, "name")) + '</h3>' +
          '<p>' + U.escapeHtml(U.tx(tour, "duration")) + ' · ' + U.escapeHtml(U.maxGuests(tour.maxPeople)) + '</p>' +
          '<p>' + U.escapeHtml(U.tx(tour, "summary")) + '</p></div>' +
          '<div class="side"><p class="price">' + U.money(tour.price) + '</p><span>' + U.escapeHtml(U.t("viewBook")) + '</span></div></button>';
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
        '<div class="detail-grid"><div><span class="tag">' + U.labelNoir(tour.noir) + '</span>' +
        '<h1 style="margin-top:12px">' + U.escapeHtml(U.tx(tour, "name")) + '</h1><p class="lede">' + U.escapeHtml(U.tx(tour, "summary")) + '</p>' +
        '<div class="gallery">' + tour.gallery.map(function (g, i) { return media(g.src, U.txAt(tour, "gallery", i, "alt")); }).join("") + '</div>' +
        '<ol class="itin">' + tour.itinerary.map(function (step, i) {
          return '<li><time>' + U.escapeHtml(step.time) + '</time><div><strong>' + U.escapeHtml(U.txAt(tour, "itinerary", i, "title")) + '</strong><p>' + U.escapeHtml(U.txAt(tour, "itinerary", i, "text")) + '</p></div></li>';
        }).join("") + '</ol></div>' +
        '<aside class="side-card"><p>' + U.escapeHtml(U.t("price.one")) + '</p><strong>' + U.money(tour.price) + '</strong>' +
        '<p>' + U.escapeHtml(U.tx(tour, "duration")) + '</p><p>' + U.escapeHtml(U.tx(tour, "includes")) + '</p>' +
        '<a class="btn cream" href="contact.html?kind=tour&tour=' + tour.id + '">' + U.escapeHtml(U.t("btn.send")) + '</a></aside></div>';
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
        filter = chip.dataset.value;
        document.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-on"); });
        chip.classList.add("is-on");
        render();
      });
    });
    cards.addEventListener("click", function (e) {
      var btn = e.target.closest(".trow");
      if (btn) openTour(btn.dataset.id, true);
    });
    window.addEventListener("popstate", function () {
      var id = U.query().get("tour");
      if (id) openTour(id, false);
      else { currentId = null; detail.hidden = true; list.hidden = false; }
    });
    render();
    var initial = U.query().get("tour");
    if (initial) openTour(initial, false);
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
    var picks = document.getElementById("room-picks");
    var confirm = document.getElementById("confirm-body");
    var selected = q.get("room") ? U.roomById(q.get("room")) : null;
    var reached = selected ? 2 : 1;
    var step = 1;
    inEl.min = U.isoOffset(0);
    outEl.min = U.isoOffset(1);
    inEl.value = q.get("in") || U.isoOffset(1);
    outEl.value = q.get("out") || U.isoOffset(3);
    if (q.get("guests")) guestsEl.value = q.get("guests");

    function stay() {
      return { inn: inEl.value, out: outEl.value, nights: U.nights(inEl.value, outEl.value), guests: Number(guestsEl.value) };
    }

    function renderRooms() {
      var s = stay();
      if (selected && selected.guests < s.guests) selected = null;
      var rooms = D.rooms.filter(function (r) { return r.guests >= s.guests; });
      picks.innerHTML = rooms.length ? rooms.map(function (room) {
        var on = selected && selected.id === room.id ? " is-selected" : "";
        return '<button type="button" class="pick' + on + '" data-id="' + room.id + '">' +
          media(room.image, U.tx(room, "alt")) +
          '<div><h3>' + U.escapeHtml(room.name) + '</h3><p>' + room.size + ' · ' + U.escapeHtml(U.maxGuests(room.guests)) + '</p><p>' + U.escapeHtml(U.tx(room, "desc")) + '</p></div>' +
          '<strong>' + U.money(room.price) + '</strong></button>';
      }).join("") : "<p>" + U.escapeHtml(U.t("err.noRoomShort")) + "</p>";
      U.bindImages(picks);
    }

    function renderConfirm() {
      var s = stay();
      if (!selected || s.nights < 1) {
        confirm.innerHTML = "<p>" + U.escapeHtml(U.t("err.back")) + "</p>";
        return;
      }
      var total = selected.price * s.nights;
      var keptName = (confirm.querySelector('[name="name"]') || {}).value || "";
      var keptEmail = (confirm.querySelector('[name="email"]') || {}).value || "";
      confirm.innerHTML = '<p>' + U.escapeHtml(selected.name) + '</p>' +
        '<p>' + U.formatDate(s.inn) + ' → ' + U.formatDate(s.out) + '</p>' +
        '<p>' + U.escapeHtml(U.stayLine(s.nights, s.guests)) + '</p>' +
        '<p class="summary" style="font-family:Cormorant Garamond,serif;font-size:48px;margin:8px 0">' + U.money(total) + '</p>' +
        '<label><span>' + U.escapeHtml(U.t("label.name")) + '</span><input name="name" autocomplete="name"></label>' +
        '<label><span>Email</span><input name="email" type="email" autocomplete="email"></label>' +
        '<p class="form-error" hidden></p>' +
        '<button class="btn cream" type="button" id="send-book">' + U.escapeHtml(U.t("btn.send")) + '</button>' +
        '<div class="form-success" hidden><h2>' + U.escapeHtml(U.t("success.title")) + '</h2><p>' + U.escapeHtml(U.t("success.plain")) + '</p></div>';
      if (keptName) confirm.querySelector('[name="name"]').value = keptName;
      if (keptEmail) confirm.querySelector('[name="email"]').value = keptEmail;
      confirm.querySelector("#send-book").addEventListener("click", function () {
        var name = confirm.querySelector('[name="name"]').value.trim();
        var email = confirm.querySelector('[name="email"]').value.trim();
        var err = confirm.querySelector(".form-error");
        if (!name) return showErr(err, "err.name");
        if (!U.isEmail(email)) return showErr(err, "err.email");
        err.hidden = true;
        U.sendMail(U.t("mail.room"), [
          U.t("mail.name") + ": " + name, U.t("mail.email") + ": " + email, U.t("mail.roomField") + ": " + selected.name,
          U.t("mail.in") + ": " + s.inn, U.t("mail.out") + ": " + s.out, U.t("mail.nights") + ": " + s.nights,
          U.t("mail.guests") + ": " + s.guests, U.t("mail.total") + ": " + U.money(total)
        ]);
        confirm.querySelectorAll("label, .form-error, #send-book, .summary").forEach(function (el) { el.hidden = true; });
        var ok = confirm.querySelector(".form-success");
        ok.hidden = false;
        ok.classList.add("is-on");
      });
    }

    function paint() {
      document.querySelectorAll(".step-panel").forEach(function (panel) {
        panel.classList.toggle("is-on", Number(panel.dataset.step) === step);
      });
      document.querySelectorAll(".steps button").forEach(function (btn) {
        var n = Number(btn.dataset.go);
        btn.classList.toggle("is-on", n === step);
        btn.classList.toggle("is-done", n < step || (n <= reached && n !== step));
      });
      if (step === 2) renderRooms();
      if (step === 3) renderConfirm();
    }

    function go(n) {
      var err = document.getElementById("step-error");
      err.hidden = true;
      if (n > 1 && stay().nights < 1) {
        showErr(err, "err.dates");
        step = 1;
        paint();
        return;
      }
      if (n > 2 && !selected) {
        showErr(err, "err.room");
        step = 2;
        paint();
        return;
      }
      if (n > reached + 1) return;
      step = n;
      reached = Math.max(reached, n);
      paint();
    }

    document.getElementById("to-rooms").addEventListener("click", function () { go(2); });
    document.getElementById("to-confirm").addEventListener("click", function () { go(3); });
    document.querySelectorAll(".steps button").forEach(function (btn) {
      btn.addEventListener("click", function () { go(Number(btn.dataset.go)); });
    });
    picks.addEventListener("click", function (e) {
      var btn = e.target.closest(".pick");
      if (!btn) return;
      selected = U.roomById(btn.dataset.id);
      reached = Math.max(reached, 2);
      renderRooms();
    });
    [inEl, outEl, guestsEl].forEach(function (el) {
      el.addEventListener("change", function () { if (step === 2) renderRooms(); });
    });
    paint();
    U.setRepaint(paint);
  }

  function initContact() {
    var form = document.getElementById("mail-form");
    var q = U.query();
    function paintSelects() {
      var roomVal = form.room.value;
      var tourVal = form.tour.value;
      form.room.innerHTML = '<option value="">' + U.escapeHtml(U.t("choose.room")) + '</option>' + D.rooms.map(function (r) {
        return '<option value="' + r.id + '">' + U.escapeHtml(r.name) + '</option>';
      }).join("");
      form.tour.innerHTML = '<option value="">' + U.escapeHtml(U.t("choose.tour")) + '</option>' + D.tours.map(function (item) {
        return '<option value="' + item.id + '">' + U.escapeHtml(U.tx(item, "name")) + '</option>';
      }).join("");
      if (roomVal) form.room.value = roomVal;
      if (tourVal) form.tour.value = tourVal;
    }
    paintSelects();
    if (q.get("kind")) form.kind.value = q.get("kind");
    if (q.get("room")) form.room.value = q.get("room");
    if (q.get("tour")) form.tour.value = q.get("tour");
    form.checkin.min = U.isoOffset(0);
    form.checkout.min = U.isoOffset(0);
    if (q.get("in")) form.checkin.value = q.get("in");
    if (q.get("out")) form.checkout.value = q.get("out");
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
      if (form.kind.value === "phong" && U.nights(form.checkin.value, form.checkout.value) < 1) {
        return showErr(err, "err.dates");
      }
      if (message.length < 4) return showErr(err, "err.msg");
      err.hidden = true;
      var room = U.roomById(form.room.value);
      var tour = U.tourById(form.tour.value);
      U.sendMail(U.t("mail.web"), [
        U.t("mail.name") + ": " + name, U.t("mail.email") + ": " + email, U.t("mail.phone") + ": " + phone,
        U.t("mail.kind") + ": " + (form.kind.value === "tour" ? U.t("mail.kindTour") : U.t("mail.kindRoom")),
        U.t("mail.roomField") + ": " + (room ? room.name : "—"),
        U.t("mail.in") + ": " + (form.checkin.value || "—"),
        U.t("mail.out") + ": " + (form.checkout.value || "—"),
        U.t("mail.tourField") + ": " + (tour ? U.tx(tour, "name") : "—"),
        U.t("mail.note") + ": " + message
      ]);
      form.classList.add("is-success");
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
