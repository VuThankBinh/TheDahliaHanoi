(function () {
  var D = window.DAHLIA;
  var U = window.Dahlia;
  var page = document.body.dataset.page;

  function media(src, alt) {
    return '<div class="media"><img src="' + U.escapeHtml(src) + '" alt="' + U.escapeHtml(alt) + '" loading="lazy"></div>';
  }
  function showErr(el, text) { el.hidden = false; el.textContent = text; }

  function renderHome() {
    document.getElementById("room-catalog").innerHTML = D.rooms.map(function (room, i) {
      return '<a class="crow reveal" href="book.html?room=' + room.id + '">' +
        '<span class="idx">0' + (i + 1) + '</span>' + media(room.image, room.alt) +
        '<div><h3>' + U.escapeHtml(room.name) + '</h3><p>' + U.escapeHtml(room.desc) + '</p></div>' +
        '<div class="side"><p>' + room.size + ' · ' + room.guests + ' khách</p><strong>' + U.money(room.price) + '</strong></div></a>';
    }).join("");
    document.getElementById("tour-catalog").innerHTML = D.tours.map(function (tour) {
      return '<a class="trow reveal" href="tours.html?tour=' + tour.id + '">' +
        media(tour.image, tour.alt) +
        '<div><span class="tag">' + U.labelNoir(tour.noir) + '</span><h3>' + U.escapeHtml(tour.name) + '</h3>' +
        '<p>' + U.escapeHtml(tour.duration) + ' · ' + U.escapeHtml(tour.summary) + '</p></div>' +
        '<div class="side"><p class="price">' + U.money(tour.price) + '</p></div></a>';
    }).join("");
  }

  function initTours() {
    var list = document.getElementById("tour-list");
    var detail = document.getElementById("tour-detail");
    var cards = document.getElementById("tour-cards");
    var empty = document.getElementById("tour-empty");
    var filter = "all";

    function render() {
      var items = D.tours.filter(function (tour) { return filter === "all" || tour.noir === filter; });
      empty.hidden = items.length > 0;
      cards.innerHTML = items.map(function (tour) {
        return '<button type="button" class="trow reveal" data-id="' + tour.id + '">' +
          media(tour.image, tour.alt) +
          '<div><span class="tag">' + U.labelNoir(tour.noir) + '</span><h3>' + U.escapeHtml(tour.name) + '</h3>' +
          '<p>' + U.escapeHtml(tour.duration) + ' · tối đa ' + tour.maxPeople + ' khách</p>' +
          '<p>' + U.escapeHtml(tour.summary) + '</p></div>' +
          '<div class="side"><p class="price">' + U.money(tour.price) + '</p><span>Xem và đặt</span></div></button>';
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
        '<div class="detail-grid"><div><span class="tag">' + U.labelNoir(tour.noir) + '</span>' +
        '<h1 style="margin-top:12px">' + U.escapeHtml(tour.name) + '</h1><p class="lede">' + U.escapeHtml(tour.summary) + '</p>' +
        '<div class="gallery">' + tour.gallery.map(function (g) { return media(g.src, g.alt); }).join("") + '</div>' +
        '<ol class="itin">' + tour.itinerary.map(function (step) {
          return '<li><time>' + U.escapeHtml(step.time) + '</time><div><strong>' + U.escapeHtml(step.title) + '</strong><p>' + U.escapeHtml(step.text) + '</p></div></li>';
        }).join("") + '</ol></div>' +
        '<aside class="side-card"><p>Mỗi khách</p><strong>' + U.money(tour.price) + '</strong>' +
        '<p>' + U.escapeHtml(tour.duration) + '</p><p>' + U.escapeHtml(tour.includes) + '</p>' +
        '<a class="btn cream" href="contact.html?kind=tour&tour=' + tour.id + '">Gửi yêu cầu</a></aside></div>';
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
      else { detail.hidden = true; list.hidden = false; }
    });
    render();
    var initial = U.query().get("tour");
    if (initial) openTour(initial, false);
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
          media(room.image, room.alt) +
          '<div><h3>' + U.escapeHtml(room.name) + '</h3><p>' + room.size + ' · tối đa ' + room.guests + ' khách</p><p>' + U.escapeHtml(room.desc) + '</p></div>' +
          '<strong>' + U.money(room.price) + '</strong></button>';
      }).join("") : "<p>Chưa có phòng vừa số khách.</p>";
      U.bindImages(picks);
    }

    function renderConfirm() {
      var s = stay();
      if (!selected || s.nights < 1) {
        confirm.innerHTML = "<p>Quay lại để chọn ngày và phòng.</p>";
        return;
      }
      var total = selected.price * s.nights;
      confirm.innerHTML = '<p>' + U.escapeHtml(selected.name) + '</p>' +
        '<p>' + U.formatDate(s.inn) + ' → ' + U.formatDate(s.out) + '</p>' +
        '<p>' + s.nights + ' đêm · ' + s.guests + ' khách</p>' +
        '<p class="summary" style="font-family:Cormorant Garamond,serif;font-size:48px;margin:8px 0">' + U.money(total) + '</p>' +
        '<label>Họ và tên<input name="name" autocomplete="name"></label>' +
        '<label>Email<input name="email" type="email" autocomplete="email"></label>' +
        '<p class="form-error" hidden></p>' +
        '<button class="btn cream" type="button" id="send-book">Gửi yêu cầu</button>' +
        '<div class="form-success" hidden><h2>Đã nhận yêu cầu</h2><p>Thư đã được mở sẵn tới hello@thedahliahanoi.com. Nếu cửa sổ thư không hiện, gửi trực tiếp tới địa chỉ này.</p></div>';
      confirm.querySelector("#send-book").addEventListener("click", function () {
        var name = confirm.querySelector('[name="name"]').value.trim();
        var email = confirm.querySelector('[name="email"]').value.trim();
        var err = confirm.querySelector(".form-error");
        if (!name) return showErr(err, "Vui lòng điền họ tên.");
        if (!U.isEmail(email)) return showErr(err, "Email chưa đúng định dạng.");
        err.hidden = true;
        U.sendMail("Yêu cầu phòng — The Dahlia Hanoi", [
          "Họ tên: " + name, "Email: " + email, "Phòng: " + selected.name,
          "Nhận phòng: " + s.inn, "Trả phòng: " + s.out, "Số đêm: " + s.nights,
          "Số khách: " + s.guests, "Tạm tính: " + U.money(total)
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
        showErr(err, "Chọn ngày trả phòng sau ngày nhận.");
        step = 1;
        paint();
        return;
      }
      if (n > 2 && !selected) {
        showErr(err, "Chọn một phòng trước.");
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
  }

  function initContact() {
    var form = document.getElementById("mail-form");
    var q = U.query();
    form.room.innerHTML = '<option value="">Chọn phòng</option>' + D.rooms.map(function (r) {
      return '<option value="' + r.id + '">' + U.escapeHtml(r.name) + '</option>';
    }).join("");
    form.tour.innerHTML = '<option value="">Chọn tour</option>' + D.tours.map(function (t) {
      return '<option value="' + t.id + '">' + U.escapeHtml(t.name) + '</option>';
    }).join("");
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
      if (!name) return showErr(err, "Vui lòng điền họ tên.");
      if (!U.isEmail(email)) return showErr(err, "Email chưa đúng định dạng.");
      if (!U.isPhone(phone)) return showErr(err, "Số điện thoại cần ít nhất 8 chữ số.");
      if (form.kind.value === "phong" && U.nights(form.checkin.value, form.checkout.value) < 1) {
        return showErr(err, "Chọn ngày trả phòng sau ngày nhận.");
      }
      if (message.length < 4) return showErr(err, "Viết vài dòng nội dung giúp khách sạn.");
      err.hidden = true;
      var room = U.roomById(form.room.value);
      var tour = U.tourById(form.tour.value);
      U.sendMail("Yêu cầu từ website — The Dahlia Hanoi", [
        "Họ tên: " + name, "Email: " + email, "Điện thoại: " + phone,
        "Loại: " + (form.kind.value === "tour" ? "Tour" : "Phòng"),
        "Phòng: " + (room ? room.name : "—"),
        "Nhận phòng: " + (form.checkin.value || "—"),
        "Trả phòng: " + (form.checkout.value || "—"),
        "Tour: " + (tour ? tour.name : "—"),
        "Lời nhắn: " + message
      ]);
      form.classList.add("is-success");
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
