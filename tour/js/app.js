(function () {
  var KEY = "dahliaTourSearch";
  var PAY_KEY = "dahliaTourPay";
  var LANG_KEY = "dahlia-lang";
  var tours = (window.TOUR_DATA && window.TOUR_DATA.tours) || [];
  var currentLang = "vi";
  try {
    if (localStorage.getItem(LANG_KEY) === "en") currentLang = "en";
  } catch (err) {}

  var DEST_LABEL = {
    "Ninh Bình": { vi: "Ninh Bình", en: "Ninh Binh" },
    "Hà Giang": { vi: "Hà Giang", en: "Ha Giang" },
    "Sapa": { vi: "Sapa", en: "Sapa" },
    "Hà Nội": { vi: "Hà Nội", en: "Hanoi" },
    "Hạ Long": { vi: "Hạ Long", en: "Ha Long" }
  };

  var COPY = {
    "lang.group": { vi: "Ngôn ngữ", en: "Language" },
    "nav.dest": { vi: "Điểm đến", en: "Destinations" },
    "nav.contact": { vi: "Liên hệ", en: "Contact" },
    "hero.h1": { vi: "Bạn muốn đi tour nào?", en: "Which tour do you want?" },
    "search.dest": { vi: "Điểm đến", en: "Destination" },
    "search.all": { vi: "Tất cả", en: "All" },
    "search.date": { vi: "Ngày đi", en: "Depart" },
    "search.guests": { vi: "Số khách", en: "Guests" },
    "search.find": { vi: "Tìm", en: "Search" },
    "empty.tours": { vi: "Không có tour cho điểm đến này.", en: "No tours for this destination." },
    "card.perGuest": { vi: "/khách", en: "/guest" },
    "card.view": { vi: "Xem tour", en: "View tour" },
    "reviews.h": { vi: "Khách đã đi", en: "Guests who went" },
    "reviews.p": { vi: "Một vài chuyến gần đây", en: "A few recent trips" },
    "rev1.meta": { vi: "Lan · Du thuyền Hạ Long · tuần trước", en: "Lan · Ha Long cruise · last week" },
    "rev1.body": { vi: "Đợi tàu ở bến Tuần Châu gần 40 phút, hướng dẫn chỉ nhắn “sắp vào bến”. Lên rồi buffet có tôm hấp bia và nem rế, jacuzzi ngoài boong thì mát thật.", en: "Waited nearly 40 minutes at Tuan Chau; the guide only texted “almost docking.” On board the buffet had beer-steamed shrimp and nem re; the deck jacuzzi was genuinely cool." },
    "rev2.meta": { vi: "Quân · Vòng Hà Giang · tháng 3/2026", en: "Quan · Ha Giang Loop · March 2026" },
    "rev2.body": { vi: "Ngày hai sương kín Mã Pí Lèng, bác tài đi số thấp chứ không cố vượt. Tối ở Đồng Văn có bát thắng dền nóng. Ba ngày khớp file họ gửi lúc đặt.", en: "Day two fog sealed Ma Pi Leng; the driver stayed in low gear instead of forcing it. Dinner in Dong Van was a hot thang den. The three days matched the file they sent when we booked." },
    "rev3.meta": { vi: "Hà · Tam Cốc & Tràng An · tháng trước", en: "Ha · Tam Coc & Trang An · last month" },
    "rev3.body": { vi: "Thuyền ra lúc 7 rưỡi, lúa hai bên còn xanh, đoạn sông đó đẹp. Vào hang thì bậc đá trơn, mình phải vịn người phía trước mới xuống hết. Cơm trưa cá kho, bình thường.", en: "Boat out at 7:30, rice still green on both sides — that stretch was lovely. Inside the cave the stone steps were slick; I had to hold the person ahead. Lunch was braised fish, ordinary." },
    "rev4.meta": { vi: "Linh · Sapa bản Cát Cát · tháng 2/2026", en: "Linh · Sapa Cat Cat · February 2026" },
    "rev4.body": { vi: "Xuống bản lúc 8 giờ, đường đá khô, mới có vài đoàn. Trưa được thịt lợn cắp nách. Xe đón lại trước nhà thờ đá lúc 15h30.", en: "Into the village at 8, dry stone path, only a few groups. Lunch was black pig. Pickup in front of the stone church at 15:30." },
    "rev5.meta": { vi: "Đức · Phố cổ Hà Nội · cuối tuần trước", en: "Duc · Hanoi Old Quarter · last weekend" },
    "rev5.body": { vi: "Sáu người đi bộ từ Hàng Bạc sang Văn Miếu, khoảng hai tiếng rưỡi cả lúc ngồi. Không ai kéo vào shop. Cuối chiều trà đá một quán ở Hàng Bông rồi giải tán.", en: "Six of us walked from Hang Bac to the Temple of Literature — about two and a half hours including sits. Nobody pulled us into shops. Late afternoon iced tea on Hang Bong, then we parted." },
    "contact.h": { vi: "Liên hệ", en: "Contact" },
    "contact.lead": { vi: "Bấm gửi để mở email tới hello@thedahliahanoi.com. Trang này không tự gửi thư.", en: "Press send to open email to hello@thedahliahanoi.com. This page does not send mail by itself." },
    "label.name": { vi: "Họ tên", en: "Full name" },
    "label.email": { vi: "Email", en: "Email" },
    "label.phone": { vi: "Số điện thoại", en: "Phone" },
    "label.message": { vi: "Nội dung", en: "Message" },
    "btn.sendMail": { vi: "Gửi email", en: "Send email" },
    "err.name": { vi: "Nhập họ tên.", en: "Enter your name." },
    "err.email": { vi: "Nhập email hợp lệ.", en: "Enter a valid email." },
    "err.message": { vi: "Nhập nội dung.", en: "Enter a message." },
    "contact.ok": { vi: "Đã mở cửa sổ email tới", en: "Opened an email draft to" },
    "mail.subject": { vi: "Liên hệ The Dahlia Tour — ", en: "The Dahlia Tour contact — " },
    "mail.name": { vi: "Họ tên: ", en: "Name: " },
    "mail.email": { vi: "Email: ", en: "Email: " },
    "mail.phone": { vi: "Số điện thoại: ", en: "Phone: " },
    "foot.dest": { vi: "Điểm đến", en: "Destinations" },
    "foot.contact": { vi: "Liên hệ", en: "Contact" },
    "foot.wa": { vi: "WhatsApp: để số khi đặt tour", en: "WhatsApp: leave your number when booking" },
    "foot.bar": { vi: "© 2026 The Dahlia Tour · Bản mẫu giới thiệu", en: "© 2026 The Dahlia Tour · Pitch sample" },
    "back.all": { vi: "Tất cả tour", en: "All tours" },
    "missing.tour": { vi: "Không có tour này.", en: "This tour is not available." },
    "missing.back": { vi: "Về trang tour", en: "Back to tours" },
    "detail.default": { vi: "mặc định", en: "default" },
    "detail.start": { vi: "Ngày đi", en: "Depart" },
    "detail.end": { vi: "Ngày kết thúc", en: "End date" },
    "svc.h": { vi: "Dịch vụ của tour", en: "Tour services" },
    "svc.in": { vi: "Đã gồm", en: "Included" },
    "svc.out": { vi: "Không gồm", en: "Not included" },
    "svc.offers": { vi: "Ưu đãi", en: "Offers" },
    "book.h": { vi: "Đặt tour", en: "Book tour" },
    "book.unit": { vi: "Giá ", en: "Price " },
    "book.name": { vi: "Tên", en: "Name" },
    "book.wa": { vi: "Số điện thoại WhatsApp", en: "WhatsApp number" },
    "book.note": { vi: "Note", en: "Note" },
    "book.code": { vi: "Mã giảm giá", en: "Promo code" },
    "book.guests": { vi: "Số khách", en: "Guests" },
    "book.total": { vi: "Tổng tiền tour", en: "Tour total" },
    "book.pay": { vi: "Thanh toán", en: "Pay" },
    "promo.ok": { vi: "Giảm 10%", en: "10% off" },
    "promo.bad": { vi: "Mã không hợp lệ", en: "Invalid code" },
    "promo.none": { vi: "Không", en: "None" },
    "promo.okLine": { vi: "DAHLIA10 · giảm 10%", en: "DAHLIA10 · 10% off" },
    "err.bookName": { vi: "Nhập tên.", en: "Enter your name." },
    "err.bookWa": { vi: "Nhập số WhatsApp.", en: "Enter a WhatsApp number." },
    "pay.missing": { vi: "Không có thông tin thanh toán.", en: "No payment details." },
    "pay.home": { vi: "Về trang chủ", en: "Back home" },
    "pay.h": { vi: "Thanh toán", en: "Payment" },
    "pay.guests": { vi: " khách", en: " guests" },
    "pay.discount": { vi: "Giảm giá: ", en: "Discount: " },
    "pay.qr": { vi: "Mã QR chuyển khoản", en: "Bank transfer QR" },
    "pay.honest": { vi: "Bản mẫu, quét QR chỉ để xem. Chưa trừ tiền thật.", en: "Sample only — scan to preview. No real charge." },
    "pay.qrFailLib": { vi: "Không tải được thư viện QR.", en: "Could not load the QR library." },
    "pay.qrFail": { vi: "Không tạo được mã QR.", en: "Could not create the QR code." },
    "title.home": { vi: "The Dahlia Tour", en: "The Dahlia Tour" },
    "title.missing": { vi: "Không có tour — The Dahlia Tour", en: "Tour unavailable — The Dahlia Tour" },
    "title.payMissing": { vi: "Không có thanh toán — The Dahlia Tour", en: "No payment — The Dahlia Tour" },
    "title.pay": { vi: "Thanh toán — The Dahlia Tour", en: "Payment — The Dahlia Tour" },
    "star.4": { vi: "4 trên 5 sao", en: "4 out of 5 stars" },
    "star.5": { vi: "5 trên 5 sao", en: "5 out of 5 stars" }
  };

  function t(key) {
    var row = COPY[key];
    if (!row) return key;
    return row[currentLang] || row.vi || key;
  }

  function field(obj, base) {
    if (!obj) return "";
    if (currentLang === "en" && obj[base + "En"] != null) return obj[base + "En"];
    return obj[base];
  }

  function destLabel(key) {
    var row = DEST_LABEL[key];
    if (!row) return key;
    return currentLang === "en" ? row.en : row.vi;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function money(n) {
    return new Intl.NumberFormat("vi-VN").format(n) + "đ";
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function toISO(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function parseISO(iso) {
    var p = String(iso || "").split("-").map(Number);
    if (p.length !== 3 || !p[0] || !p[1] || !p[2]) return null;
    var d = new Date(p[0], p[1] - 1, p[2]);
    if (d.getFullYear() !== p[0] || d.getMonth() !== p[1] - 1 || d.getDate() !== p[2]) return null;
    return d;
  }

  function addDays(iso, days) {
    var d = parseISO(iso);
    if (!d) return "";
    d.setDate(d.getDate() + days);
    return toISO(d);
  }

  function tomorrowISO() {
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    return toISO(d);
  }

  function showVN(iso) {
    var p = String(iso || "").split("-");
    if (p.length !== 3) return "";
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  function readSearch() {
    try {
      return JSON.parse(sessionStorage.getItem(KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function tlv(id, value) {
    var v = String(value);
    return id + String(v.length).padStart(2, "0") + v;
  }

  function crc16(str) {
    var crc = 0xFFFF;
    for (var i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (var b = 0; b < 8; b++) {
        if (crc & 0x8000) crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
        else crc = (crc << 1) & 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  }

  function stripVi(s) {
    return String(s || "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function transferNote(tourName, customerName) {
    var who = stripVi(customerName).toUpperCase() || "KHACH";
    if (who.length > 12) who = who.slice(0, 12).trim();
    var room = 25 - who.length - 1;
    var tour = stripVi(tourName).toUpperCase();
    if (tour.length > room) tour = tour.slice(0, Math.max(room, 0)).trim();
    var note = (tour + " " + who).trim();
    return (note || "THE DAHLIA").slice(0, 25);
  }

  function vietQr(amount, note) {
    var bank = (window.TOUR_DATA && window.TOUR_DATA.bank) || {};
    var account = String(bank.accountNumber || "226456789").replace(/\s/g, "");
    var beneficiary = tlv("00", "970422") + tlv("01", account);
    var merchant = tlv("00", "A000000727") + tlv("01", beneficiary) + tlv("02", "QRIBFTTA");
    var payload =
      tlv("00", "01") +
      tlv("01", "12") +
      tlv("38", merchant) +
      tlv("53", "704") +
      tlv("54", String(amount)) +
      tlv("58", "VN") +
      tlv("59", "CONG TY THE DAHLIA") +
      tlv("60", "HA NOI") +
      tlv("62", tlv("08", note)) +
      "6304";
    return payload + crc16(payload);
  }

  function list(items) {
    return "<ul>" + items.map(function (item) {
      return "<li>" + esc(item) + "</li>";
    }).join("") + "</ul>";
  }

  function buffetHtml(menu) {
    if (!menu) return "";
    function group(g) {
      return '<section class="buffet-group"><h3>' + esc(g.name) + "</h3><ul>" +
        g.items.map(function (item) {
          var dish = currentLang === "en" ? item.en : item.vi;
          var veg = item.veg ? '<span class="veg">' + esc(currentLang === "en" ? (item.vegEn || item.veg) : item.veg) + "</span>" : "";
          return "<li><span class=\"dish\">" + esc(dish) + "</span>" + veg + "</li>";
        }).join("") +
        "</ul></section>";
    }
    var cols = menu.columns.map(function (groups) {
      return "<div>" + groups.map(group).join("") + "</div>";
    }).join("");
    return '<section class="buffet" aria-label="' + esc(field(menu, "title")) + '">' +
      '<div class="buffet-head"><h2 class="js-reveal">' + esc(field(menu, "title")) + "</h2></div>" +
      '<div class="buffet-cols">' + cols + "</div>" +
      '<p class="buffet-note">' + esc(field(menu, "note")) + "</p>" +
      '<p class="buffet-note">' + esc(field(menu, "vegNote")) + "</p>" +
      "</section>";
  }

  function applyStaticI18n() {
    document.documentElement.lang = currentLang === "en" ? "en" : "vi";
    if (currentLang === "en") document.documentElement.setAttribute("data-lang", "en");
    else document.documentElement.removeAttribute("data-lang");

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.querySelectorAll("[data-dest-label]").forEach(function (el) {
      el.textContent = destLabel(el.getAttribute("data-dest-label"));
    });
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      var on = btn.getAttribute("data-set-lang") === currentLang;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("is-on", on);
    });
    document.querySelectorAll(".lang-switch").forEach(function (box) {
      box.setAttribute("aria-label", t("lang.group"));
    });
    document.querySelectorAll("#destination option[data-dest-label]").forEach(function (opt) {
      opt.textContent = destLabel(opt.getAttribute("data-dest-label"));
    });
    var allOpt = document.querySelector('#destination option[value=""]');
    if (allOpt) allOpt.textContent = t("search.all");
  }

  function mountLangSwitch() {
    document.querySelectorAll("header.topbar").forEach(function (bar) {
      if (bar.querySelector(".lang-switch")) return;
      var box = document.createElement("div");
      box.className = "lang-switch";
      box.setAttribute("role", "group");
      box.setAttribute("aria-label", t("lang.group"));
      box.innerHTML = '<button type="button" data-set-lang="vi">VI</button><span aria-hidden="true">|</span><button type="button" data-set-lang="en">EN</button>';
      var hotline = bar.querySelector(".hotline");
      if (hotline) hotline.insertAdjacentElement("beforebegin", box);
      else bar.appendChild(box);
    });
  }

  var repaint = function () {};

  function setLang(next) {
    currentLang = next === "en" ? "en" : "vi";
    try { localStorage.setItem(LANG_KEY, currentLang); } catch (err) {}
    applyStaticI18n();
    repaint();
  }

  function bootMotion() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var nodes = document.querySelectorAll(".js-reveal, .review-card");
    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    document.querySelectorAll(".review-card").forEach(function (el, i) {
      el.style.transitionDelay = (i * 80) + "ms";
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -24px 0px" });
    nodes.forEach(function (el) { io.observe(el); });
  }

  function bootContact() {
    var form = document.getElementById("contact-form");
    if (!form || form.dataset.bound === "1") return;
    form.dataset.bound = "1";
    var errorEl = document.getElementById("contact-error");
    var statusEl = document.getElementById("contact-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("contact-name").value.trim();
      var email = document.getElementById("contact-email").value.trim();
      var phone = document.getElementById("contact-phone").value.trim();
      var message = document.getElementById("contact-message").value.trim();
      var problems = [];
      if (!name) problems.push(t("err.name"));
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problems.push(t("err.email"));
      if (!message) problems.push(t("err.message"));
      if (problems.length) {
        errorEl.hidden = false;
        errorEl.textContent = problems.join(" ");
        statusEl.hidden = true;
        return;
      }
      var to = (window.TOUR_DATA && window.TOUR_DATA.email) || "hello@thedahliahanoi.com";
      var subject = t("mail.subject") + name;
      var body = [
        t("mail.name") + name,
        t("mail.email") + email,
        t("mail.phone") + (phone || "—"),
        "",
        message
      ].join("\n");
      var href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      errorEl.hidden = true;
      statusEl.hidden = false;
      form.dataset.mailto = href;
      statusEl.innerHTML = t("contact.ok") + ' <a id="mailto-link" href="' + esc(href) + '">hello@thedahliahanoi.com</a>.';
      var link = document.getElementById("mailto-link");
      if (link) link.click();
    });
  }

  function bootHome() {
    var grid = document.getElementById("tour-grid");
    var empty = document.getElementById("tour-empty");
    var form = document.getElementById("search");
    var destSelect = document.getElementById("destination");
    var dateInput = document.getElementById("depart");
    var guestSelect = document.getElementById("guests");
    var saved = readSearch();
    var currentDest = new URLSearchParams(window.location.search).get("dest") || "";

    if (dateInput && !dateInput.value) {
      dateInput.value = saved.date && parseISO(saved.date) ? saved.date : tomorrowISO();
    }
    if (guestSelect && saved.guests && !guestSelect.dataset.touched) {
      guestSelect.value = String(saved.guests);
    }

    function renderCards() {
      grid.innerHTML = tours.map(function (tourItem) {
        var note = field(tourItem, "priceNote") ? '<p class="fx">' + esc(field(tourItem, "priceNote")) + "</p>" : "";
        var href = "tour.html?id=" + encodeURIComponent(tourItem.id);
        return (
          '<article class="tour-card" data-destination="' + esc(tourItem.destination) + '">' +
            '<div class="card-anim">' +
              '<img src="' + esc(tourItem.image) + '" alt="' + esc(field(tourItem, "name")) + '">' +
              '<div class="card-body">' +
                '<a class="chip" href="index.html?dest=' + encodeURIComponent(tourItem.destination) + '" data-filter="' + esc(tourItem.destination) + '">' + esc(destLabel(tourItem.destination)) + "</a>" +
                "<h2>" + esc(field(tourItem, "name")) + "</h2>" +
                '<p class="dur">' + esc(field(tourItem, "durationLabel")) + "</p>" +
                '<p class="line">' + esc(field(tourItem, "cardLine")) + "</p>" +
                '<p class="price">' + esc(money(tourItem.price)) + "<span>" + esc(t("card.perGuest")) + "</span></p>" +
                note +
                '<a class="btn" href="' + href + '">' + esc(t("card.view")) + "</a>" +
              "</div>" +
            "</div>" +
          "</article>"
        );
      }).join("");
      applyFilter(currentDest);
    }

    function applyFilter(dest) {
      dest = dest || "";
      currentDest = dest;
      var shown = 0;
      grid.querySelectorAll(".tour-card").forEach(function (card) {
        var on = !dest || card.getAttribute("data-destination") === dest;
        card.hidden = !on;
        if (on) shown += 1;
      });
      if (empty) empty.hidden = shown !== 0;
      document.querySelectorAll("[data-filter]").forEach(function (el) {
        var value = el.getAttribute("data-filter");
        if (value === null) return;
        el.classList.toggle("is-on", value === dest);
      });
      if (destSelect) destSelect.value = dest;
      var url = new URL(window.location.href);
      if (dest) url.searchParams.set("dest", dest);
      else url.searchParams.delete("dest");
      history.replaceState(null, "", url.pathname + url.search);
    }

    if (!form.dataset.bound) {
      form.dataset.bound = "1";
      document.addEventListener("click", function (e) {
        var el = e.target.closest("[data-filter]");
        if (!el) return;
        e.preventDefault();
        applyFilter(el.getAttribute("data-filter") || "");
      });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var dest = destSelect.value;
        var date = dateInput.value;
        var guests = guestSelect.value;
        sessionStorage.setItem(KEY, JSON.stringify({
          destination: dest,
          date: date,
          guests: guests
        }));
        applyFilter(dest);
      });
      if (guestSelect) {
        guestSelect.addEventListener("change", function () {
          guestSelect.dataset.touched = "1";
        });
      }
    }

    document.title = t("title.home");
    renderCards();
    bootContact();
    bootMotion();
    repaint = function () {
      applyStaticI18n();
      renderCards();
    };
  }

  function bootDetail() {
    var stage = document.getElementById("stage");
    var id = new URLSearchParams(window.location.search).get("id");
    var tour = null;
    for (var i = 0; i < tours.length; i++) {
      if (tours[i].id === id) tour = tours[i];
    }

    function render() {
      if (!tour) {
        document.title = t("title.missing");
        stage.innerHTML =
          '<div class="missing"><p>' + esc(t("missing.tour")) + '</p><a class="btn" href="index.html">' + esc(t("missing.back")) + "</a></div>";
        return;
      }

      document.title = field(tour, "name") + " — The Dahlia Tour";
      var saved = readSearch();
      var start = saved.date && parseISO(saved.date) ? saved.date : tomorrowISO();
      var end = addDays(start, tour.nightsOffset);
      var guests = parseInt(saved.guests, 10);
      if (!(guests >= 1 && guests <= 8)) guests = 2;

      var guestOptions = "";
      for (var n = 1; n <= 8; n++) {
        guestOptions += '<option value="' + n + '"' + (n === guests ? " selected" : "") + ">" + n + "</option>";
      }
      var note = field(tour, "priceNote") ? '<p class="fx">' + esc(field(tour, "priceNote")) + "</p>" : "";
      var serviceNote = field(tour, "serviceNote") ? '<p class="service-note">' + esc(field(tour, "serviceNote")) + "</p>" : "";
      var desc = field(tour, "description") || [];
      var included = field(tour, "servicesIncluded") || [];
      var excluded = field(tour, "servicesExcluded") || [];
      var offers = field(tour, "offers") || [];

      stage.innerHTML =
        '<p class="back"><a href="index.html">' + esc(t("back.all")) + "</a></p>" +
        '<div class="detail">' +
          '<section class="panel">' +
            '<img class="photo" src="' + esc(tour.image) + '" alt="' + esc(field(tour, "name")) + '">' +
            '<h1 class="js-reveal">' + esc(field(tour, "name")) + "</h1>" +
            '<p class="dur">' + esc(destLabel(tour.destination)) + " · " + esc(field(tour, "durationLabel")) + "</p>" +
            '<p class="price">' + esc(money(tour.price)) + "<span>" + esc(t("card.perGuest")) + "</span></p>" +
            note +
            desc.map(function (line) { return "<p>" + esc(line) + "</p>"; }).join("") +
            '<div class="when">' +
              '<p><span>' + esc(t("detail.start")) + '</span> <strong id="date-start" data-iso="' + esc(start) + '">' + esc(showVN(start)) + '</strong> <em>' + esc(t("detail.default")) + "</em></p>" +
              '<p><span>' + esc(t("detail.end")) + '</span> <strong id="date-end" data-iso="' + esc(end) + '">' + esc(showVN(end)) + '</strong> <em>' + esc(t("detail.default")) + "</em></p>" +
            "</div>" +
          "</section>" +
          '<section class="panel svc">' +
            '<h2 class="js-reveal">' + esc(t("svc.h")) + "</h2>" +
            "<h3>" + esc(t("svc.in")) + "</h3>" +
            list(included) +
            serviceNote +
            "<h3>" + esc(t("svc.out")) + "</h3>" +
            list(excluded) +
            "<h2>" + esc(t("svc.offers")) + "</h2>" +
            list(offers) +
          "</section>" +
          '<div class="book-wrap">' +
            '<form id="book-form" class="book panel" novalidate>' +
              '<h2 class="js-reveal">' + esc(t("book.h")) + "</h2>" +
              '<p class="unit">' + esc(t("book.unit")) + esc(money(tour.price)) + t("card.perGuest") + (field(tour, "priceNote") ? " · " + esc(field(tour, "priceNote")) : "") + "</p>" +
              "<label>" + esc(t("book.name")) + '<input id="book-name" name="name" type="text" autocomplete="name" required></label>' +
              "<label>" + esc(t("book.wa")) + '<input id="book-phone" name="phone" type="tel" autocomplete="tel" required></label>' +
              "<label>" + esc(t("label.email")) + '<input id="book-email" name="email" type="email" autocomplete="email" required></label>' +
              "<label>" + esc(t("book.note")) + '<textarea id="book-note" name="note" rows="3"></textarea></label>' +
              "<label>" + esc(t("book.code")) + '<input id="book-code" name="code" type="text" autocomplete="off" spellcheck="false"></label>' +
              '<label class="guest-line">' + esc(t("book.guests")) + '<select id="book-guests" name="guests">' + guestOptions + "</select></label>" +
              '<p id="sum-math" class="math"></p>' +
              '<p id="promo-note" class="promo-note"></p>' +
              '<p class="sum" aria-live="polite"><span>' + esc(t("book.total")) + '</span> <strong id="tour-total"></strong></p>' +
              '<p id="form-error" class="form-error" role="alert" hidden></p>' +
              '<button class="btn" type="submit">' + esc(t("book.pay")) + "</button>" +
            "</form>" +
          "</div>" +
        "</div>" +
        buffetHtml(tour.buffetMenu);

      var form = document.getElementById("book-form");
      var totalEl = document.getElementById("tour-total");
      var mathEl = document.getElementById("sum-math");
      var promoEl = document.getElementById("promo-note");
      var errorEl = document.getElementById("form-error");

      function quote() {
        var count = parseInt(document.getElementById("book-guests").value, 10) || 2;
        var sub = tour.price * count;
        var code = document.getElementById("book-code").value.trim();
        var off = 0;
        var msg = "";
        var state = "none";
        if (code) {
          if (code.toUpperCase() === "DAHLIA10") {
            off = Math.round(sub * 0.1);
            msg = t("promo.ok");
            state = "ok";
          } else {
            msg = t("promo.bad");
            state = "bad";
          }
        }
        var total = sub - off;
        totalEl.textContent = money(total);
        totalEl.dataset.amount = String(total);
        mathEl.textContent = count + " × " + money(tour.price) + (off ? " − " + money(off) : "");
        promoEl.textContent = msg;
        promoEl.classList.toggle("is-bad", state === "bad");
        return { count: count, sub: sub, off: off, total: total, code: code, state: state };
      }

      form.addEventListener("input", function () {
        errorEl.hidden = true;
        quote();
      });
      form.addEventListener("change", quote);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = document.getElementById("book-name").value.trim();
        var phone = document.getElementById("book-phone").value.trim();
        var email = document.getElementById("book-email").value.trim();
        var noteText = document.getElementById("book-note").value.trim();
        var problems = [];
        if (!name) problems.push(t("err.bookName"));
        if (!phone) problems.push(t("err.bookWa"));
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problems.push(t("err.email"));
        if (problems.length) {
          errorEl.hidden = false;
          errorEl.textContent = problems.join(" ");
          return;
        }
        var q = quote();
        var discountText = t("promo.none");
        if (q.state === "ok") discountText = t("promo.okLine");
        else if (q.state === "bad") discountText = t("promo.bad");
        var payload = {
          tourName: field(tour, "name"),
          tourNameVi: tour.name,
          start: start,
          end: end,
          guests: q.count,
          customerName: name,
          whatsapp: phone,
          email: email,
          note: noteText,
          discount: discountText,
          amount: q.total
        };
        sessionStorage.setItem(PAY_KEY, JSON.stringify(payload));
        window.location.href = "pay.html";
      });

      quote();
      bootMotion();
    }

    render();
    repaint = function () {
      applyStaticI18n();
      var nameVal = document.getElementById("book-name");
      var phoneVal = document.getElementById("book-phone");
      var emailVal = document.getElementById("book-email");
      var noteVal = document.getElementById("book-note");
      var codeVal = document.getElementById("book-code");
      var guestsVal = document.getElementById("book-guests");
      var keep = {
        name: nameVal ? nameVal.value : "",
        phone: phoneVal ? phoneVal.value : "",
        email: emailVal ? emailVal.value : "",
        note: noteVal ? noteVal.value : "",
        code: codeVal ? codeVal.value : "",
        guests: guestsVal ? guestsVal.value : ""
      };
      render();
      if (document.getElementById("book-name")) {
        document.getElementById("book-name").value = keep.name;
        document.getElementById("book-phone").value = keep.phone;
        document.getElementById("book-email").value = keep.email;
        document.getElementById("book-note").value = keep.note;
        document.getElementById("book-code").value = keep.code;
        if (keep.guests) document.getElementById("book-guests").value = keep.guests;
        document.getElementById("book-form").dispatchEvent(new Event("input"));
      }
    };
  }

  function readPay() {
    try {
      return JSON.parse(sessionStorage.getItem(PAY_KEY)) || null;
    } catch (e) {
      return null;
    }
  }

  function payValid(p) {
    if (!p || typeof p !== "object") return false;
    if (!p.tourName || !p.customerName || !p.whatsapp || !p.email) return false;
    if (!parseISO(p.start) || !parseISO(p.end)) return false;
    var guests = Number(p.guests);
    if (!(guests >= 1 && guests <= 8)) return false;
    var amount = Number(p.amount);
    if (!(amount > 0) || !isFinite(amount)) return false;
    return true;
  }

  function bootPay() {
    var stage = document.getElementById("stage");

    function render() {
      var pay = readPay();
      if (!payValid(pay)) {
        document.title = t("title.payMissing");
        stage.innerHTML =
          '<div class="missing"><p>' + esc(t("pay.missing")) + '</p><a class="btn" href="index.html">' + esc(t("pay.home")) + "</a></div>";
        return;
      }

      var bank = (window.TOUR_DATA && window.TOUR_DATA.bank) || {
        name: "MB Bank",
        accountName: "Công ty The Dahlia",
        accountNumber: "226456789"
      };
      var amount = Math.round(Number(pay.amount));
      var note = transferNote(pay.tourNameVi || pay.tourName, pay.customerName);
      var payload = vietQr(amount, note);
      document.title = t("title.pay");
      stage.innerHTML =
        '<section class="pay-sheet">' +
          '<h1 class="js-reveal">' + esc(t("pay.h")) + "</h1>" +
          '<p class="pay-amount" id="pay-amount" data-vnd="' + esc(String(amount)) + '">' + esc(money(amount)) + "</p>" +
          '<p class="pay-tour">' + esc(pay.tourName) + "</p>" +
          '<p class="pay-meta">' + esc(showVN(pay.start)) + " – " + esc(showVN(pay.end)) + " · " + esc(String(pay.guests)) + esc(t("pay.guests")) + "</p>" +
          '<p class="pay-discount">' + esc(t("pay.discount")) + esc(pay.discount || t("promo.none")) + "</p>" +
          '<div class="qr-box" id="qr-box" role="img" aria-label="' + esc(t("pay.qr")) + '" data-payload="' + esc(payload) + '" data-note="' + esc(note) + '"></div>' +
          '<div class="pay-bank">' +
            "<p>" + esc(bank.name) + "</p>" +
            "<p>" + esc(bank.accountName) + "</p>" +
            "<p>" + esc(bank.accountNumber) + "</p>" +
          "</div>" +
          '<p class="pay-honest">' + esc(t("pay.honest")) + "</p>" +
          '<a class="btn" href="index.html">' + esc(t("pay.home")) + "</a>" +
        "</section>";

      var box = document.getElementById("qr-box");
      function draw(level) {
        box.innerHTML = "";
        return new QRCode(box, {
          text: payload,
          width: 192,
          height: 192,
          colorDark: "#1A1A1A",
          colorLight: "#FFFFFF",
          correctLevel: level
        });
      }
      if (typeof QRCode !== "function") {
        box.innerHTML = '<p class="form-error">' + esc(t("pay.qrFailLib")) + "</p>";
      } else {
        try {
          draw(QRCode.CorrectLevel.M);
        } catch (err) {
          try {
            draw(QRCode.CorrectLevel.L);
          } catch (err2) {
            box.innerHTML = '<p class="form-error">' + esc(t("pay.qrFail")) + "</p>";
          }
        }
        box.removeAttribute("title");
      }
      bootMotion();
    }

    render();
    repaint = function () {
      applyStaticI18n();
      render();
    };
  }

  mountLangSwitch();
  applyStaticI18n();
  document.documentElement.classList.add("i18n-ready");
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("[data-set-lang]");
    if (!btn) return;
    e.preventDefault();
    setLang(btn.getAttribute("data-set-lang"));
  });

  if (document.body.dataset.page === "home") bootHome();
  if (document.body.dataset.page === "detail") bootDetail();
  if (document.body.dataset.page === "pay") bootPay();
})();
