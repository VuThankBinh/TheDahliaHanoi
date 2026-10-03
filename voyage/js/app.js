(function () {
  var U = window.Dahlia;
  var DATA = window.TOUR_DATA || { tours: [], email: "hello@thedahliahanoi.com" };
  var tours = DATA.tours || [];
  var page = document.body.dataset.page;
  var SEARCH_KEY = "dahliaVoyageSearch";
  var PAY_KEY = "dahliaVoyagePay";

  var DEST_LABEL = {
    "Ninh Bình": { vi: "Ninh Bình", en: "Ninh Binh" },
    "Hà Giang": { vi: "Hà Giang", en: "Ha Giang" },
    "Sapa": { vi: "Sapa", en: "Sapa" },
    "Hà Nội": { vi: "Hà Nội", en: "Hanoi" },
    "Hạ Long": { vi: "Hạ Long", en: "Ha Long" }
  };

  var VO = {
    "nav.bookStay": { vi: "Đặt tour", en: "Book a tour" },
    "nav.bookTour": { vi: "Đặt tour", en: "Book a tour" },
    "nav.bookRoom": { vi: "Đặt tour", en: "Book a tour" },
    "nav.book": { vi: "Đặt tour", en: "Book a tour" },
    "label.dest": { vi: "Điểm đến", en: "Destination" },
    "search.all": { vi: "Tất cả", en: "All" },
    "btn.viewTours": { vi: "Xem tour", en: "View tours" },
    "btn.filterTours": { vi: "Xem tất cả tour", en: "See all tours" },
    "btn.bookTour": { vi: "Đặt tour", en: "Book tour" },
    "btn.pay": { vi: "Thanh toán", en: "Pay" },
    "btn.hold": { vi: "Đặt tour này", en: "Book this tour" },
    "chip.under1m": { vi: "Dưới 1.000.000đ", en: "Under 1,000,000đ" },
    "chip.mid2m": { vi: "1–2.500.000đ", en: "1–2,500,000đ" },
    "chip.over2m": { vi: "Trên 2.500.000đ", en: "Over 2,500,000đ" },
    "empty.tours": { vi: "Không có tour khớp điểm đến này.", en: "No tours for this destination." },
    "empty.toursMore": { vi: "Không có tour khớp bộ lọc này. Thử bỏ bớt điều kiện.", en: "No tour matches. Try removing a filter." },
    "hint.mailTour": { vi: "Yêu cầu được gửi về mail qua ứng dụng thư của bạn.", en: "The request opens in your mail app." },
    "footer.voyage": { vi: "The Dahlia Voyage · chỉ tour, không phòng · thông tin liên hệ dùng cho bản mẫu.", en: "The Dahlia Voyage · tours only, no rooms · contact details are for this mockup." },
    "reviews.k": { vi: "Đánh giá", en: "Reviews" },
    "reviews.h": { vi: "Khách đã đi", en: "Guests who went" },
    "reviews.p": { vi: "Một vài chuyến gần đây — chi tiết cụ thể, không lời khen chung chung.", en: "A few recent trips — specific notes, not generic praise." },
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
    "star.4": { vi: "4 trên 5 sao", en: "4 out of 5 stars" },
    "star.5": { vi: "5 trên 5 sao", en: "5 out of 5 stars" },
    "detail.start": { vi: "Ngày bắt đầu", en: "Start date" },
    "detail.end": { vi: "Ngày kết thúc", en: "End date" },
    "detail.default": { vi: "mặc định", en: "default" },
    "pay.missing": { vi: "Không có thông tin thanh toán.", en: "No payment details." },
    "pay.home": { vi: "Về trang chủ", en: "Back home" },
    "pay.h": { vi: "Thanh toán", en: "Payment" },
    "pay.guests": { vi: " khách", en: " guests" },
    "pay.discount": { vi: "Giảm giá: ", en: "Discount: " },
    "pay.qr": { vi: "Mã QR chuyển khoản", en: "Bank transfer QR" },
    "pay.honest": { vi: "Bản mẫu, quét QR chỉ để xem. Chưa trừ tiền thật.", en: "Sample only — scan to preview. No real charge." },
    "pay.qrFailLib": { vi: "Không tải được thư viện QR.", en: "Could not load the QR library." },
    "pay.qrFail": { vi: "Không tạo được mã QR.", en: "Could not create the QR code." },
    "vo.pay.title": { vi: "Thanh toán — Mixi Voyage · The Dahlia Hanoi", en: "Payment — Mixi Voyage · The Dahlia Hanoi" },
    "vo.pay.titleMissing": { vi: "Không có thanh toán — Mixi Voyage", en: "No payment — Mixi Voyage" },
    "vo.home.title": { vi: "The Dahlia Hanoi — Mixi Voyage", en: "The Dahlia Hanoi — Mixi Voyage" },
    "vo.desc": { vi: "Đặt tour Việt Nam với The Dahlia — phong cách booking travel.", en: "Book Vietnam tours with The Dahlia — travel-booking style." },
    "vo.hero.aria": { vi: "Mở đầu", en: "Opening" },
    "vo.hero.alt": { vi: "Du thuyền trên vịnh Hạ Long lúc sáng sớm", en: "A cruise on Ha Long Bay at dawn" },
    "vo.kicker": { vi: "Tour · Việt Nam", en: "Tours · Vietnam" },
    "vo.h1": { vi: "Du thuyền & tour — chọn điểm đến, giữ chỗ.", en: "Cruises & tours — pick a place, hold a seat." },
    "vo.lede": { vi: "Ninh Bình, Hà Giang, Sapa, Hà Nội, Hạ Long. Tìm ngày đi và số khách, rồi đặt tour trong vài bước.", en: "Ninh Binh, Ha Giang, Sapa, Hanoi, Ha Long. Pick a date and guests, then book in a few steps." },
    "vo.trust": { vi: "Vì sao chọn Dahlia", en: "Why Dahlia" },
    "vo.t1": { vi: "Tour nổi bật", en: "Featured tours" },
    "vo.t1p": { vi: "Năm điểm đến khắp miền Bắc.", en: "Five destinations across the North." },
    "vo.t2": { vi: "Ngày đi", en: "Trip length" },
    "vo.t2p": { vi: "Từ trong ngày đến vòng Hà Giang.", en: "From day trips to the Ha Giang loop." },
    "vo.t3": { vi: "Mã DAHLIA10", en: "Code DAHLIA10" },
    "vo.t3p": { vi: "Giảm khi đặt trên trang.", en: "A discount when you book here." },
    "vo.t4": { vi: "Xuất phát Hà Nội", en: "Depart from Hanoi" },
    "vo.t4p": { vi: "Xe đón và lịch rõ trên mỗi tour.", en: "Pickup and a clear schedule on every tour." },
    "vo.tours.k": { vi: "Tour nổi bật", en: "Featured tours" },
    "vo.tours.h": { vi: "Chọn chuyến đi", en: "Choose a trip" },
    "vo.tours.p": { vi: "Ba tour nổi bật — Hạ Long, Hà Giang, Sapa. Bấm thẻ để xem chi tiết và đặt.", en: "Three featured trips — Ha Long, Ha Giang, Sapa. Open a card to see details and book." },
    "vo.dest.k": { vi: "Theo địa danh", en: "By destination" },
    "vo.dest.p": { vi: "Ba tour nổi bật tại điểm đến này.", en: "Top three tours for this destination." },
    "vo.dest.more": { vi: "Xem tour địa danh", en: "See destination tours" },
    "vo.hero.prev": { vi: "Slide trước", en: "Previous slide" },
    "vo.hero.next": { vi: "Slide sau", en: "Next slide" },
    "vo.book.lede": { vi: "Mười lăm tour miền Bắc. Chọn một thẻ để mở form đặt — mã DAHLIA10 giảm 10%.", en: "Fifteen Northern tours. Open a card to book — code DAHLIA10 for 10% off." },
    "vo.ask.k": { vi: "Liên hệ nhanh", en: "A quick note" },
    "vo.ask.h": { vi: "Hỏi trước khi đặt tour.", en: "Ask before you book a tour." },
    "vo.ask.p": { vi: "Tour riêng tư, đổi ngày, hoặc nhóm lớn — gửi một dòng, chúng tôi mở sẵn thư tới hello@thedahliahanoi.com.", en: "A private tour, a date change, or a larger group — send a line. A draft opens to hello@thedahliahanoi.com." },
    "ph.name": { vi: "VD: Nguyễn Lan Anh", en: "e.g. Nguyen Lan Anh" },
    "ph.email": { vi: "VD: lananh@email.com", en: "e.g. lananh@email.com" },
    "ph.phone": { vi: "VD: 09xx xxx xxx", en: "e.g. 09xx xxx xxx" },
    "ph.message": { vi: "Bạn muốn hỏi gì về tour?", en: "What would you like to ask about the tour?" },
    "ph.note": { vi: "Ghi chú thêm (tuỳ chọn)", en: "Extra note (optional)" },
    "contact.badge": { vi: "Phản hồi trong ngày", en: "Reply within the day" },
    "contact.mail.title": { vi: "Email", en: "Email" },
    "contact.mail.desc": { vi: "Gửi yêu cầu đặt tour", en: "Send a tour request" },
    "contact.phone.title": { vi: "Hotline", en: "Hotline" },
    "contact.phone.desc": { vi: "Gọi trực tiếp tư vấn", en: "Call for advice" },
    "contact.wa.title": { vi: "WhatsApp", en: "WhatsApp" },
    "contact.wa.desc": { vi: "Nhắn tin nhanh", en: "Message us quickly" },
    "contact.form.k": { vi: "Form liên hệ", en: "Contact form" },
    "nav.hotline": { vi: "Hotline", en: "Hotline" },
    "contact.map.k": { vi: "Vị trí", en: "Location" },
    "contact.map.h": { vi: "18 Hàng Bông, Hoàn Kiếm, Hà Nội", en: "18 Hang Bong, Hoan Kiem, Hanoi" },
    "contact.map.p": { vi: "Văn phòng The Dahlia — mở Google Maps để chỉ đường.", en: "The Dahlia office — open Google Maps for directions." },
    "contact.map.dir": { vi: "Chỉ đường Google Maps", en: "Directions on Google Maps" },
    "contact.map.open": { vi: "Mở trên Google Maps", en: "Open in Google Maps" },
    "vo.tours.title": { vi: "Tour — Mixi Voyage · The Dahlia Hanoi", en: "Tours — Mixi Voyage · The Dahlia Hanoi" },
    "vo.tours.page": { vi: "Chọn điểm đến, giữ chỗ", en: "Pick a destination, hold a place" },
    "vo.tours.lede": { vi: "Lọc theo điểm đến và giá. Bấm một tour để xem dịch vụ và đặt chỗ.", en: "Filter by destination and price. Open a tour for services and booking." },
    "vo.book.title": { vi: "Đặt tour — Mixi Voyage · The Dahlia Hanoi", en: "Book a tour — Mixi Voyage · The Dahlia Hanoi" },
    "vo.book.h": { vi: "Chọn tour rồi giữ chỗ", en: "Choose a tour, then hold a place" },
    "vo.contact.title": { vi: "Liên hệ — Mixi Voyage · The Dahlia Hanoi", en: "Contact — Mixi Voyage · The Dahlia Hanoi" },
    "vo.contact.h": { vi: "Gửi yêu cầu đặt tour", en: "Send a tour request" },
    "vo.contact.lede": { vi: "Form mở thư tới hello@thedahliahanoi.com. Điền đủ để chúng tôi phản hồi nhanh.", en: "The form opens a letter to hello@thedahliahanoi.com. Fill it in so we can answer quickly." },
    "vo.contact.hours": { vi: "Chỉ đặt tour · mã DAHLIA10 giảm 10%", en: "Tours only · code DAHLIA10 for 10% off" },
    "vo.contact.h2": { vi: "Yêu cầu tour của bạn", en: "Your tour request" },
    "vo.contact.hint": { vi: "Chọn tour, ngày đi và số khách — rồi gửi lời nhắn.", en: "Choose a tour, date, and guests — then send a note." },
    "svc.in": { vi: "Đã gồm", en: "Included" },
    "svc.out": { vi: "Không gồm", en: "Not included" },
    "svc.offers": { vi: "Ưu đãi", en: "Offers" },
    "svc.h": { vi: "Dịch vụ của tour", en: "Tour services" },
    "book.h": { vi: "Đặt tour", en: "Book tour" },
    "book.unit": { vi: "Giá ", en: "Price " },
    "book.name": { vi: "Họ và tên", en: "Full name" },
    "book.wa": { vi: "Số WhatsApp", en: "WhatsApp number" },
    "book.note": { vi: "Ghi chú", en: "Note" },
    "book.code": { vi: "Mã giảm giá", en: "Promo code" },
    "book.guests": { vi: "Số khách", en: "Guests" },
    "book.date": { vi: "Ngày đi", en: "Depart" },
    "book.total": { vi: "Tổng tiền tour", en: "Tour total" },
    "book.email": { vi: "Email", en: "Email" },
    "promo.ok": { vi: "Giảm 10%", en: "10% off" },
    "promo.bad": { vi: "Mã không hợp lệ", en: "Invalid code" },
    "promo.okLine": { vi: "DAHLIA10 · giảm 10%", en: "DAHLIA10 · 10% off" },
    "promo.none": { vi: "Không", en: "None" },
    "err.bookName": { vi: "Vui lòng điền họ tên.", en: "Please enter your name." },
    "err.bookWa": { vi: "Nhập số WhatsApp.", en: "Enter a WhatsApp number." },
    "confirm.title": { vi: "Đã ghi nhận đặt tour", en: "Tour request recorded" },
    "confirm.body": { vi: "Bản mẫu — chưa trừ tiền thật. Thư đã được mở sẵn tới hello@thedahliahanoi.com nếu ứng dụng mail khả dụng.", en: "Sample only — no real charge. A draft opens to hello@thedahliahanoi.com if your mail app is available." },
    "confirm.back": { vi: "Xem thêm tour", en: "See more tours" },
    "mail.tourBook": { vi: "Đặt tour — The Dahlia Voyage", en: "Tour booking — The Dahlia Voyage" },
    "mail.tour": { vi: "Yêu cầu tour — The Dahlia Voyage", en: "Tour request — The Dahlia Voyage" },
    "mail.home": { vi: "Lời nhắn từ Mixi Voyage — The Dahlia", en: "A note from Mixi Voyage — The Dahlia" },
    "perGuest": { vi: "/ khách", en: "/ guest" },
    "link.see": { vi: "Xem", en: "View" },
    "link.book": { vi: "Đặt", en: "Book" },
    "back.arrow": { vi: "← Quay lại danh sách", en: "← Back to the list" },
    "price.each": { vi: "Giá mỗi khách", en: "Per guest" },
    "price.sample": { vi: "Giá minh họa.", en: "Sample rate." },
    "choose.tour": { vi: "Chọn tour", en: "Choose a tour" }
  };

  var _sharedT = U.t;
  function t(key, vars) {
    var row = VO[key];
    var s;
    if (row) s = row[U.lang()] || row.vi || key;
    else s = _sharedT(key, vars);
    if (vars && s) {
      Object.keys(vars).forEach(function (k) {
        s = s.split("{" + k + "}").join(String(vars[k]));
      });
    }
    return s;
  }
  U.t = t;

  function applyVoI18n(root) {
    var scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!VO[key] && !_sharedT) return;
      var text = t(key);
      if (el.tagName === "TITLE") document.title = text;
      else if ("value" in el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA") && el.type !== "submit") {
        /* leave values */
      } else {
        el.textContent = text;
      }
    });
    scope.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    scope.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      el.setAttribute("alt", t(el.getAttribute("data-i18n-alt")));
    });
    scope.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    scope.querySelectorAll("[data-i18n-content]").forEach(function (el) {
      el.setAttribute("content", t(el.getAttribute("data-i18n-content")));
    });
    var title = document.querySelector("title[data-i18n]");
    if (title) document.title = t(title.getAttribute("data-i18n"));
  }

  function field(obj, base) {
    if (!obj) return "";
    if (U.lang() === "en" && obj[base + "En"] != null) return obj[base + "En"];
    return obj[base];
  }

  function destLabel(key) {
    var row = DEST_LABEL[key];
    if (!row) return key;
    return U.lang() === "en" ? row.en : row.vi;
  }

  function destinations() {
    var seen = {};
    var list = [];
    tours.forEach(function (tour) {
      if (!seen[tour.destination]) {
        seen[tour.destination] = true;
        list.push(tour.destination);
      }
    });
    return list;
  }

  function tourById(id) {
    for (var i = 0; i < tours.length; i++) {
      if (tours[i].id === id) return tours[i];
    }
    return null;
  }

  function queryId() {
    var q = U.query();
    return q.get("id") || q.get("tour");
  }

  function readSearch() {
    try {
      return JSON.parse(sessionStorage.getItem(SEARCH_KEY) || "{}") || {};
    } catch (err) {
      return {};
    }
  }

  function writeSearch(obj) {
    try {
      sessionStorage.setItem(SEARCH_KEY, JSON.stringify(obj || {}));
    } catch (err) {}
  }

  function sendMail(subject, lines) {
    var email = DATA.email || "hello@thedahliahanoi.com";
    var href = "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
    var a = document.createElement("a");
    a.href = href;
    a.setAttribute("hidden", "");
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function showErr(el, key) {
    el.hidden = false;
    el.setAttribute("data-i18n", key);
    el.textContent = t(key);
  }

  function prepDates(root) {
    root.querySelectorAll('input[type="date"]').forEach(function (input) {
      if (!input.min) input.min = U.isoOffset(0);
      if (!input.value) input.value = U.isoOffset(1);
    });
  }

  function fillDestSelect(select, selected) {
    if (!select) return;
    var opts = '<option value="">' + U.escapeHtml(t("search.all")) + "</option>";
    destinations().forEach(function (d) {
      opts += '<option value="' + U.escapeHtml(d) + '"' + (selected === d ? " selected" : "") + ">" +
        U.escapeHtml(destLabel(d)) + "</option>";
    });
    select.innerHTML = opts;
    syncCustomSelect(select);
  }

  function closeAllCustomSelects(except) {
    document.querySelectorAll(".c-select.is-open, .c-date.is-open").forEach(function (wrap) {
      if (except && wrap === except) return;
      wrap.classList.remove("is-open");
      var menu = wrap.querySelector(".c-select-menu, .c-date-panel");
      var btn = wrap.querySelector(".c-select-btn, .c-date-btn");
      var label = wrap.closest("label");
      if (menu) menu.hidden = true;
      if (btn) btn.setAttribute("aria-expanded", "false");
      if (label) label.classList.remove("is-open");
    });
  }

  function formatDateDisplay(iso) {
    var d = parseISO(iso);
    if (!d) return iso || "";
    var lang = U.lang();
    if (lang === "en") {
      return String(d.getMonth() + 1).padStart(2, "0") + "/" + String(d.getDate()).padStart(2, "0") + "/" + d.getFullYear();
    }
    return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
  }

  function monthTitle(year, monthIndex) {
    var lang = U.lang();
    if (lang === "en") {
      return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][monthIndex] + " " + year;
    }
    return "Tháng " + (monthIndex + 1) + "/" + year;
  }

  function weekdayLabels() {
    return U.lang() === "en"
      ? ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
      : ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  }

  function syncCustomDate(input) {
    if (!input) return;
    var wrap = input.closest(".c-date");
    if (!wrap) {
      enhanceCustomDate(input);
      return;
    }
    var btn = wrap.querySelector(".c-date-btn");
    var valueEl = btn && btn.querySelector(".c-date-value");
    if (valueEl) valueEl.textContent = formatDateDisplay(input.value);
    renderDatePanel(wrap, input);
  }

  function renderDatePanel(wrap, input) {
    var panel = wrap.querySelector(".c-date-panel");
    if (!panel) return;
    var view = wrap._viewMonth || parseISO(input.value) || parseISO(input.min) || new Date();
    wrap._viewMonth = new Date(view.getFullYear(), view.getMonth(), 1);

    var year = wrap._viewMonth.getFullYear();
    var month = wrap._viewMonth.getMonth();
    var minD = parseISO(input.min) || null;
    var selected = parseISO(input.value);
    var firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var head =
      '<div class="c-date-head">' +
      '<button type="button" class="c-date-nav" data-nav="-1" aria-label="Previous month">‹</button>' +
      '<p class="c-date-title">' + U.escapeHtml(monthTitle(year, month)) + "</p>" +
      '<button type="button" class="c-date-nav" data-nav="1" aria-label="Next month">›</button>' +
      "</div>";

    var week = '<div class="c-date-week">' + weekdayLabels().map(function (w) {
      return '<span>' + w + "</span>";
    }).join("") + "</div>";

    var cells = "";
    var i;
    for (i = 0; i < firstDow; i++) cells += '<span class="c-date-empty"></span>';
    for (i = 1; i <= daysInMonth; i++) {
      var iso = year + "-" + String(month + 1).padStart(2, "0") + "-" + String(i).padStart(2, "0");
      var dayDate = new Date(year, month, i);
      var disabled = minD && dayDate < new Date(minD.getFullYear(), minD.getMonth(), minD.getDate());
      var isSel = selected && selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === i;
      cells +=
        '<button type="button" class="c-date-day' + (isSel ? " is-active" : "") + '"' +
        ' data-iso="' + iso + '"' +
        (disabled ? " disabled" : "") +
        ">" + i + "</button>";
    }

    panel.innerHTML = head + week + '<div class="c-date-grid">' + cells + "</div>";

    panel.querySelectorAll(".c-date-nav").forEach(function (nav) {
      nav.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var delta = Number(nav.getAttribute("data-nav") || 0);
        wrap._viewMonth = new Date(year, month + delta, 1);
        renderDatePanel(wrap, input);
      });
    });

    panel.querySelectorAll(".c-date-day:not([disabled])").forEach(function (dayBtn) {
      dayBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        input.value = dayBtn.getAttribute("data-iso");
        input.dispatchEvent(new Event("change", { bubbles: true }));
        syncCustomDate(input);
        closeAllCustomSelects();
      });
    });
  }

  function enhanceCustomDate(input) {
    if (!input || input.dataset.cDate === "1") {
      syncCustomDate(input);
      return;
    }
    input.dataset.cDate = "1";
    input.classList.add("c-select-native");
    input.setAttribute("tabindex", "-1");
    input.setAttribute("aria-hidden", "true");

    var wrap = document.createElement("div");
    wrap.className = "c-date";
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "c-date-btn c-select-btn";
    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML =
      '<span class="c-date-value c-select-value"></span>' +
      '<svg class="c-select-chevron" viewBox="0 0 14 14" aria-hidden="true">' +
      '<path d="M3.2 5.1L7 8.9l3.8-3.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>";

    var panel = document.createElement("div");
    panel.className = "c-date-panel";
    panel.hidden = true;
    panel.addEventListener("click", function (e) { e.stopPropagation(); });

    wrap.appendChild(btn);
    wrap.appendChild(panel);

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var open = !wrap.classList.contains("is-open");
      closeAllCustomSelects(open ? wrap : null);
      if (open) {
        wrap._viewMonth = parseISO(input.value) || parseISO(input.min) || new Date();
        wrap._viewMonth = new Date(wrap._viewMonth.getFullYear(), wrap._viewMonth.getMonth(), 1);
        renderDatePanel(wrap, input);
      }
      wrap.classList.toggle("is-open", open);
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      var label = wrap.closest("label");
      if (label) label.classList.toggle("is-open", open);
    });

    input.addEventListener("change", function () {
      syncCustomDate(input);
    });

    syncCustomDate(input);
  }

  function syncCustomSelect(select) {
    if (!select) return;
    var wrap = select.closest(".c-select");
    if (!wrap) {
      enhanceCustomSelect(select);
      return;
    }
    var btn = wrap.querySelector(".c-select-btn");
    var labelEl = btn && btn.querySelector(".c-select-value");
    var menu = wrap.querySelector(".c-select-menu");
    if (!btn || !labelEl || !menu) return;

    var selected = select.options[select.selectedIndex];
    labelEl.textContent = selected ? selected.textContent : "";

    menu.innerHTML = "";
    Array.prototype.forEach.call(select.options, function (opt, i) {
      var li = document.createElement("li");
      var optionBtn = document.createElement("button");
      optionBtn.type = "button";
      optionBtn.className = "c-select-option" + (opt.selected ? " is-active" : "");
      optionBtn.textContent = opt.textContent;
      optionBtn.setAttribute("role", "option");
      optionBtn.setAttribute("aria-selected", opt.selected ? "true" : "false");
      optionBtn.dataset.index = String(i);
      optionBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        select.selectedIndex = i;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        syncCustomSelect(select);
        closeAllCustomSelects();
      });
      li.appendChild(optionBtn);
      menu.appendChild(li);
    });
  }

  function enhanceCustomSelect(select) {
    if (!select || select.dataset.cSelect === "1") {
      syncCustomSelect(select);
      return;
    }
    select.dataset.cSelect = "1";
    select.classList.add("c-select-native");
    select.setAttribute("tabindex", "-1");
    select.setAttribute("aria-hidden", "true");

    var wrap = document.createElement("div");
    wrap.className = "c-select";
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "c-select-btn";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML =
      '<span class="c-select-value"></span>' +
      '<svg class="c-select-chevron" viewBox="0 0 14 14" aria-hidden="true">' +
      '<path d="M3.2 5.1L7 8.9l3.8-3.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>";

    var menu = document.createElement("ul");
    menu.className = "c-select-menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;

    wrap.appendChild(btn);
    wrap.appendChild(menu);

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var open = !wrap.classList.contains("is-open");
      closeAllCustomSelects(open ? wrap : null);
      wrap.classList.toggle("is-open", open);
      menu.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      var label = wrap.closest("label");
      if (label) label.classList.toggle("is-open", open);
    });

    select.addEventListener("change", function () {
      syncCustomSelect(select);
    });

    syncCustomSelect(select);
  }

  function enhanceSearchSelects(root) {
    var scope = root || document;
    scope.querySelectorAll(".search-fields select").forEach(enhanceCustomSelect);
    scope.querySelectorAll('.search-fields input[type="date"]').forEach(enhanceCustomDate);
  }

  if (!window.__dahliaCSelectDocBound) {
    window.__dahliaCSelectDocBound = true;
    document.addEventListener("click", function () {
      closeAllCustomSelects();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAllCustomSelects();
    });
  }

  function priceOk(tour, band) {
    if (band === "all") return true;
    if (band === "under") return tour.price < 1000000;
    if (band === "mid") return tour.price >= 1000000 && tour.price <= 2500000;
    if (band === "over") return tour.price > 2500000;
    return true;
  }

  function tourCardHtml(tour, href) {
    var note = field(tour, "priceNote")
      ? '<p class="price-note">' + U.escapeHtml(field(tour, "priceNote")) + "</p>"
      : "";
    return '<a class="v-card reveal" href="' + href + '">' +
      '<div class="media">' +
      '<span class="tag-badge">' + U.escapeHtml(destLabel(tour.destination)) + "</span>" +
      '<span class="price-badge">' + U.money(tour.price) + "</span>" +
      '<img src="' + U.escapeHtml(tour.image) + '" alt="' + U.escapeHtml(field(tour, "name")) + '" loading="lazy">' +
      "</div>" +
      '<div class="body">' +
      '<p class="meta">' + U.escapeHtml(field(tour, "durationLabel")) + "</p>" +
      "<h3>" + U.escapeHtml(field(tour, "name")) + "</h3>" +
      '<p class="desc">' + U.escapeHtml(field(tour, "cardLine")) + "</p>" +
      note +
      '<div class="foot-row"><span class="price">' + U.money(tour.price) + " <span>" + U.escapeHtml(t("perGuest")) + "</span></span>" +
      '<span class="link-more" style="min-height:36px;padding:0 12px;font-size:13px">' + U.escapeHtml(t("link.see")) + "</span></div>" +
      "</div></a>";
  }

  function listHtml(items) {
    if (!items || !items.length) return "";
    return "<ul class=\"svc-list\">" + items.map(function (line) {
      return "<li>" + U.escapeHtml(line) + "</li>";
    }).join("") + "</ul>";
  }

  var DEST_MEDIA = {
    "Ninh Bình": {
      images: [
        "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2200&q=80",
        "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=2200&q=80",
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=2200&q=80"
      ],
      video: "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4"
    },
    "Hà Giang": {
      images: [
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2200&q=80",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2200&q=80",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=80"
      ],
      video: "https://videos.pexels.com/video-files/2887463/2887463-uhd_2560_1440_24fps.mp4"
    },
    "Sapa": {
      images: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2200&q=80",
        "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=2200&q=80",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2200&q=80"
      ],
      video: "https://videos.pexels.com/video-files/1448735/1448735-uhd_2560_1440_24fps.mp4"
    },
    "Hà Nội": {
      images: [
        "https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&w=2200&q=80",
        "https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&w=2200&q=80",
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=2200&q=80"
      ],
      video: "https://videos.pexels.com/video-files/2491284/2491284-uhd_2560_1440_24fps.mp4"
    },
    "Hạ Long": {
      images: [
        "https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=2200&q=80",
        "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2200&q=80",
        "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=2200&q=80"
      ],
      video: "https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_30fps.mp4"
    }
  };

  function tourSlides(tour) {
    var name = field(tour, "name");
    var slides = [];
    if (tour.media && tour.media.length) {
      tour.media.forEach(function (item) {
        slides.push({
          type: item.type || "image",
          src: item.src,
          poster: item.poster || tour.image,
          alt: item.alt || name
        });
      });
      return slides;
    }
    var pack = DEST_MEDIA[tour.destination] || { images: [], video: "" };
    var seen = {};
    function pushImage(src) {
      if (!src || seen[src]) return;
      seen[src] = true;
      slides.push({ type: "image", src: src, alt: name });
    }
    pushImage(tour.image);
    (pack.images || []).forEach(pushImage);
    if (pack.video) {
      slides.push({
        type: "video",
        src: pack.video,
        poster: tour.image,
        alt: name
      });
    }
    return slides;
  }

  function frameHtml(slide, realIndex, opts) {
    opts = opts || {};
    var media = slide.type === "video"
      ? '<video muted playsinline loop preload="metadata" poster="' + U.escapeHtml(slide.poster || "") + '" aria-label="' + U.escapeHtml(slide.alt || "") + '">' +
        '<source src="' + U.escapeHtml(slide.src) + '" type="video/mp4"></video>'
      : '<img src="' + U.escapeHtml(slide.src) + '" alt="' + U.escapeHtml(slide.alt || "") + '"' +
        (opts.priority ? ' fetchpriority="high"' : ' loading="lazy"') + ">";
    return '<article class="film-frame' + (opts.active ? " is-active" : "") + '" data-type="' +
      U.escapeHtml(slide.type || "image") + '" data-real="' + realIndex + '">' +
      '<div class="film-frame-inner">' + media + "</div></article>";
  }

  function detailSlideshowHtml(tour) {
    var slides = tourSlides(tour);
    if (!slides.length) return "";
    // Clone đầu/cuối để vòng tròn luôn có ảnh/video 2 bên
    var trackSlides = [slides[slides.length - 1]].concat(slides, [slides[0]]);
    var realIndexes = [slides.length - 1].concat(slides.map(function (_, i) { return i; }), [0]);
    var slidesHtml = trackSlides.map(function (slide, i) {
      return frameHtml(slide, realIndexes[i], { active: i === 1, priority: i === 1 });
    }).join("");

    return '<div class="detail-show filmstrip" id="detail-slideshow" aria-roledescription="carousel" data-count="' + slides.length + '">' +
      '<div class="film-viewport">' +
      '<div class="film-track" id="film-track">' + slidesHtml + "</div>" +
      "</div>" +
      '<div class="detail-show-controls">' +
      '<button type="button" class="hero-nav detail-prev" aria-label="Slide trước">' +
      '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</button>" +
      '<div class="hero-dots detail-dots" role="tablist" aria-label="Chọn ảnh"></div>' +
      '<button type="button" class="hero-nav detail-next" aria-label="Slide sau">' +
      '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</button>" +
      "</div></div>";
  }

  function initDetailSlideshow() {
    var root = document.getElementById("detail-slideshow");
    if (!root || root.dataset.ready === "1") return;
    root.dataset.ready = "1";
    var track = root.querySelector(".film-track");
    var frames = Array.prototype.slice.call(root.querySelectorAll(".film-frame"));
    if (!track || !frames.length) return;
    var count = parseInt(root.getAttribute("data-count") || "0", 10) || Math.max(1, frames.length - 2);
    var dotsHost = root.querySelector(".detail-dots");
    var prevBtn = root.querySelector(".detail-prev");
    var nextBtn = root.querySelector(".detail-next");
    // index trên track đã clone: 1 = slide thật đầu tiên
    var pos = 1;
    var animating = false;
    var timer = null;
    var dragX = 0;
    var startX = 0;
    var dragging = false;
    var reduce = !!(U.reduce || window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    if (dotsHost) {
      dotsHost.innerHTML = "";
      for (var d = 0; d < count; d++) {
        (function (real) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "hero-dot" + (real === 0 ? " is-on" : "");
          btn.setAttribute("aria-label", "Slide " + (real + 1));
          btn.addEventListener("click", function () { goToReal(real); });
          dotsHost.appendChild(btn);
        })(d);
      }
    }

    function realIndex() {
      var frame = frames[pos];
      var r = frame ? parseInt(frame.getAttribute("data-real") || "0", 10) : 0;
      return (r + count) % count;
    }

    function stopVideos() {
      frames.forEach(function (frame) {
        var video = frame.querySelector("video");
        if (!video) return;
        video.pause();
        try { video.currentTime = 0; } catch (err) {}
      });
    }

    function playActive() {
      var frame = frames[pos];
      if (!frame) return;
      var video = frame.querySelector("video");
      if (!video) return;
      video.muted = true;
      var playPromise = video.play();
      if (playPromise && playPromise.catch) playPromise.catch(function () {});
    }

    function syncDots() {
      if (!dotsHost) return;
      var real = realIndex();
      dotsHost.querySelectorAll(".hero-dot").forEach(function (dot, i) {
        dot.classList.toggle("is-on", i === real);
      });
    }

    function setTransform(offsetPx, withTransition) {
      root.classList.toggle("is-dragging", !withTransition);
      track.style.transition = withTransition ? "" : "none";
      var drag = offsetPx || 0;
      track.style.transform =
        "translate3d(calc(-" + pos + " * (var(--film-frame) + var(--film-gap)) + var(--film-pad) + " + drag + "px), 0, 0)";
    }

    function markSides() {
      frames.forEach(function (frame, i) {
        frame.classList.toggle("is-active", i === pos);
        frame.classList.toggle("is-prev", i === pos - 1);
        frame.classList.toggle("is-next", i === pos + 1);
        frame.classList.toggle("is-side", i === pos - 1 || i === pos + 1);
      });
      syncDots();
    }

    function normalizeLoop() {
      // Nhảy im lặng khi đang đứng trên clone
      if (pos === 0) {
        pos = count;
        setTransform(0, false);
        void track.offsetWidth;
        track.style.transition = "";
      } else if (pos === count + 1) {
        pos = 1;
        setTransform(0, false);
        void track.offsetWidth;
        track.style.transition = "";
      }
      markSides();
      animating = false;
      playActive();
      schedule();
    }

    function layout(withTransition) {
      markSides();
      setTransform(0, withTransition !== false);
    }

    function go(delta) {
      if (animating || !frames.length) return;
      stopVideos();
      animating = true;
      pos += delta;
      layout(true);
      window.setTimeout(normalizeLoop, reduce ? 0 : 560);
    }

    function goToReal(real) {
      if (animating) return;
      var target = real + 1; // offset clone đầu
      if (target === pos) return;
      stopVideos();
      animating = true;
      pos = target;
      layout(true);
      window.setTimeout(normalizeLoop, reduce ? 0 : 560);
    }

    function schedule() {
      clearTimeout(timer);
      if (reduce || animating) return;
      var frame = frames[pos];
      var isVideo = frame && frame.getAttribute("data-type") === "video";
      timer = setTimeout(function () { go(1); }, isVideo ? 12000 : 5500);
    }

    if (prevBtn) prevBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      go(-1);
    });
    if (nextBtn) nextBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      go(1);
    });

    function onPointerDown(e) {
      if (animating) return;
      dragging = true;
      startX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
      dragX = 0;
      clearTimeout(timer);
      setTransform(0, false);
    }
    function onPointerMove(e) {
      if (!dragging) return;
      var x = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
      dragX = x - startX;
      setTransform(dragX, false);
    }
    function onPointerUp() {
      if (!dragging) return;
      dragging = false;
      track.style.transition = "";
      root.classList.remove("is-dragging");
      if (Math.abs(dragX) > 48) go(dragX < 0 ? 1 : -1);
      else {
        layout(true);
        schedule();
      }
      dragX = 0;
    }

    root.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    root.addEventListener("touchstart", onPointerDown, { passive: true });
    root.addEventListener("touchmove", onPointerMove, { passive: true });
    root.addEventListener("touchend", onPointerUp);
    root.addEventListener("mouseenter", function () { clearTimeout(timer); });
    root.addEventListener("mouseleave", function () {
      if (!dragging) schedule();
    });
    window.addEventListener("resize", function () { layout(false); });

    layout(false);
    playActive();
    schedule();
  }

  function parseISO(iso) {
    var p = String(iso || "").split("-").map(Number);
    if (p.length !== 3 || !p[0] || !p[1] || !p[2]) return null;
    var d = new Date(p[0], p[1] - 1, p[2]);
    if (d.getFullYear() !== p[0] || d.getMonth() !== p[1] - 1 || d.getDate() !== p[2]) return null;
    return d;
  }

  function toISO(d) {
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function addDays(iso, days) {
    var d = parseISO(iso);
    if (!d) return "";
    d.setDate(d.getDate() + (days || 0));
    return toISO(d);
  }

  function showVN(iso) {
    var p = String(iso || "").split("-");
    if (p.length !== 3) return "";
    return p[2] + "/" + p[1] + "/" + p[0];
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
    var tourPart = stripVi(tourName).toUpperCase();
    if (tourPart.length > room) tourPart = tourPart.slice(0, Math.max(room, 0)).trim();
    var note = (tourPart + " " + who).trim();
    return (note || "THE DAHLIA").slice(0, 25);
  }

  function vietQr(amount, note) {
    var bank = DATA.bank || {};
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

  function buffetHtml(menu) {
    if (!menu) return "";
    function group(g) {
      return '<section class="buffet-group"><h3>' + U.escapeHtml(g.name) + "</h3><ul>" +
        g.items.map(function (item) {
          var dish = U.lang() === "en" ? item.en : item.vi;
          var veg = item.veg
            ? '<span class="veg">' + U.escapeHtml(U.lang() === "en" ? (item.vegEn || item.veg) : item.veg) + "</span>"
            : "";
          return "<li><span class=\"dish\">" + U.escapeHtml(dish) + "</span>" + veg + "</li>";
        }).join("") +
        "</ul></section>";
    }
    var cols = (menu.columns || []).map(function (groups) {
      return "<div>" + groups.map(group).join("") + "</div>";
    }).join("");
    return '<section class="buffet" aria-label="' + U.escapeHtml(field(menu, "title")) + '">' +
      '<div class="buffet-head"><h2>' + U.escapeHtml(field(menu, "title")) + "</h2></div>" +
      '<div class="buffet-cols">' + cols + "</div>" +
      '<p class="buffet-note">' + U.escapeHtml(field(menu, "note")) + "</p>" +
      '<p class="buffet-note">' + U.escapeHtml(field(menu, "vegNote")) + "</p>" +
      "</section>";
  }

  function quoteState(tour, guests, code) {
    var count = parseInt(guests, 10) || 2;
    var sub = tour.price * count;
    var off = 0;
    var msg = "";
    var state = "none";
    var trimmed = String(code || "").trim();
    if (trimmed) {
      if (trimmed.toUpperCase() === "DAHLIA10") {
        off = Math.round(sub * 0.1);
        msg = t("promo.ok");
        state = "ok";
      } else {
        msg = t("promo.bad");
        state = "bad";
      }
    }
    return { count: count, sub: sub, off: off, total: sub - off, code: trimmed, state: state, msg: msg };
  }

  function bookingFormHtml(tour, opts) {
    opts = opts || {};
    var guests = opts.guests || 2;
    var date = opts.date || U.isoOffset(1);
    var guestOptions = "";
    for (var n = 1; n <= 8; n++) {
      guestOptions += '<option value="' + n + '"' + (n === guests ? " selected" : "") + ">" + n + "</option>";
    }
    var note = field(tour, "priceNote") ? " · " + U.escapeHtml(field(tour, "priceNote")) : "";
    return '<form class="book-form" id="book-form" novalidate>' +
      "<h2>" + U.escapeHtml(t("book.h")) + "</h2>" +
      '<p class="unit">' + U.escapeHtml(t("book.unit")) + U.money(tour.price) + U.escapeHtml(t("perGuest")) + note + "</p>" +
      "<label><span>" + U.escapeHtml(t("book.date")) + '</span><input id="book-date" name="date" type="date" value="' + U.escapeHtml(date) + '" min="' + U.isoOffset(0) + '" required></label>' +
      "<label><span>" + U.escapeHtml(t("book.name")) + '</span><input id="book-name" name="name" type="text" autocomplete="name" required></label>' +
      "<label><span>" + U.escapeHtml(t("book.wa")) + '</span><input id="book-phone" name="phone" type="tel" autocomplete="tel" required></label>' +
      "<label><span>" + U.escapeHtml(t("book.email")) + '</span><input id="book-email" name="email" type="email" autocomplete="email" required></label>' +
      "<label><span>" + U.escapeHtml(t("book.note")) + '</span><textarea id="book-note" name="note" rows="3"></textarea></label>' +
      "<label><span>" + U.escapeHtml(t("book.code")) + '</span><input id="book-code" name="code" type="text" autocomplete="off" spellcheck="false" placeholder="DAHLIA10"></label>' +
      "<label><span>" + U.escapeHtml(t("book.guests")) + '</span><select id="book-guests" name="guests">' + guestOptions + "</select></label>" +
      '<p id="sum-math" class="math"></p>' +
      '<p id="promo-note" class="promo-note"></p>' +
      '<p class="sum" aria-live="polite"><span>' + U.escapeHtml(t("book.total")) + '</span> <strong id="tour-total"></strong></p>' +
      '<p id="form-error" class="form-error" role="alert" hidden></p>' +
      '<button class="btn block" type="submit">' + U.escapeHtml(t("btn.pay")) + "</button>" +
      "</form>";
  }

  function wireBookingForm(tour) {
    var form = document.getElementById("book-form");
    if (!form) return;
    var totalEl = document.getElementById("tour-total");
    var mathEl = document.getElementById("sum-math");
    var promoEl = document.getElementById("promo-note");
    var errorEl = document.getElementById("form-error");
    var dateStart = document.getElementById("date-start");
    var dateEnd = document.getElementById("date-end");

    function syncEnd() {
      var start = document.getElementById("book-date").value || U.isoOffset(1);
      var end = addDays(start, tour.nightsOffset || 0);
      if (dateStart) {
        dateStart.dataset.iso = start;
        dateStart.textContent = showVN(start);
      }
      if (dateEnd) {
        dateEnd.dataset.iso = end;
        dateEnd.textContent = showVN(end);
      }
    }

    function quote() {
      var q = quoteState(tour, document.getElementById("book-guests").value, document.getElementById("book-code").value);
      totalEl.textContent = U.money(q.total);
      totalEl.dataset.amount = String(q.total);
      mathEl.textContent = q.count + " × " + U.money(tour.price) + (q.off ? " − " + U.money(q.off) : "");
      promoEl.textContent = q.msg;
      promoEl.classList.toggle("is-bad", q.state === "bad");
      syncEnd();
      return q;
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
      var date = document.getElementById("book-date").value;
      if (!name) return showErr(errorEl, "err.bookName");
      if (!phone || !U.isPhone(phone)) return showErr(errorEl, "err.bookWa");
      if (!U.isEmail(email)) return showErr(errorEl, "err.email");
      errorEl.hidden = true;
      var q = quote();
      var discountText = t("promo.none");
      if (q.state === "ok") discountText = t("promo.okLine");
      else if (q.state === "bad") discountText = t("promo.bad");
      var start = date || U.isoOffset(1);
      var end = addDays(start, tour.nightsOffset || 0);
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
      try {
        sessionStorage.setItem(PAY_KEY, JSON.stringify(payload));
      } catch (err) {}
      window.location.href = "pay.html";
    });
    quote();
  }

  var FEATURED_IDS = ["ha-long", "ha-giang", "sapa"];

  function featuredTours() {
    var marked = tours.filter(function (tour) { return tour.featured; });
    if (marked.length) return marked.slice(0, 3);
    return FEATURED_IDS.map(tourById).filter(Boolean).slice(0, 3);
  }

  function toursForDestination(dest) {
    return tours.filter(function (tour) { return tour.destination === dest; }).slice(0, 3);
  }

  function initHeroSlideshow() {
    var root = document.getElementById("hero-slideshow");
    if (!root || root.dataset.ready === "1") return;
    root.dataset.ready = "1";
    var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
    if (!slides.length) return;
    var hero = root.closest(".hero") || document;
    var controls = document.getElementById("hero-controls") || hero.querySelector(".hero-controls");
    var dotsHost = (controls && controls.querySelector(".hero-dots")) || document.querySelector(".hero-dots");
    var prevBtn = (controls && controls.querySelector(".hero-prev")) || document.querySelector(".hero-prev");
    var nextBtn = (controls && controls.querySelector(".hero-next")) || document.querySelector(".hero-next");
    var idx = 0;
    var timer = null;
    var reduce = !!(U.reduce || window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    if (dotsHost && !dotsHost.children.length) {
      slides.forEach(function (_, i) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "hero-dot" + (i === 0 ? " is-on" : "");
        btn.setAttribute("aria-label", "Slide " + (i + 1));
        btn.addEventListener("click", function () { go(i); });
        dotsHost.appendChild(btn);
      });
    }

    function stopVideos() {
      slides.forEach(function (slide) {
        var video = slide.querySelector("video");
        if (!video) return;
        video.pause();
        try { video.currentTime = 0; } catch (err) {}
      });
    }

    function playActive() {
      var video = slides[idx].querySelector("video");
      if (!video) return;
      video.muted = true;
      video.setAttribute("playsinline", "");
      var playPromise = video.play();
      if (playPromise && playPromise.catch) playPromise.catch(function () {});
    }

    function syncDots() {
      if (!dotsHost) return;
      dotsHost.querySelectorAll(".hero-dot").forEach(function (dot, i) {
        dot.classList.toggle("is-on", i === idx);
      });
    }

    function go(n) {
      stopVideos();
      slides[idx].classList.remove("is-active");
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add("is-active");
      syncDots();
      playActive();
      schedule();
    }

    function schedule() {
      clearTimeout(timer);
      if (reduce) return;
      var isVideo = slides[idx].getAttribute("data-type") === "video";
      timer = setTimeout(function () { go(idx + 1); }, isVideo ? 12000 : 6000);
    }

    if (prevBtn) prevBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      go(idx - 1);
    });
    if (nextBtn) nextBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      go(idx + 1);
    });

    var pauseHost = hero.querySelector ? hero : root;
    pauseHost.addEventListener("mouseenter", function () { clearTimeout(timer); });
    pauseHost.addEventListener("mouseleave", function () { schedule(); });

    playActive();
    schedule();
  }

  function upgradeLangFlags() {
    var FLAG_VI =
      '<svg class="lang-flag" viewBox="0 0 30 20" width="22" height="15" aria-hidden="true" focusable="false" shape-rendering="crispEdges">' +
      '<rect width="30" height="20" fill="#DA251D"/>' +
      '<polygon fill="#FFFF00" points="15,3.2 16.9,9 23.2,9 18.1,12.6 20,18.4 15,14.7 10,18.4 11.9,12.6 6.8,9 13.1,9"/>' +
      "</svg>";
    var FLAG_EN =
      '<svg class="lang-flag" viewBox="0 0 60 30" width="22" height="15" aria-hidden="true" focusable="false" shape-rendering="geometricPrecision">' +
      '<rect width="60" height="30" fill="#012169"/>' +
      '<path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" stroke-width="6"/>' +
      '<path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="2"/>' +
      '<path d="M30,0 V30 M0,15 H60" stroke="#FFFFFF" stroke-width="10"/>' +
      '<path d="M30,0 V30 M0,15 H60" stroke="#C8102E" stroke-width="6"/>' +
      "</svg>";

    document.querySelectorAll(".lang-switch").forEach(function (box) {
      box.classList.add("lang-switch--flags");
      box.innerHTML =
        '<button type="button" class="lang-flag-btn" data-set-lang="vi" aria-label="Tiếng Việt" title="Tiếng Việt">' + FLAG_VI + "</button>" +
        '<button type="button" class="lang-flag-btn" data-set-lang="en" aria-label="English" title="English">' + FLAG_EN + "</button>";
    });

    var lang = U.lang();
    document.querySelectorAll(".lang-switch [data-set-lang]").forEach(function (btn) {
      var on = btn.getAttribute("data-set-lang") === lang;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("is-on", on);
    });
  }

  function renderHome() {
    var bar = document.getElementById("search-form");
    var destSelect = document.getElementById("search-dest");
    var saved = readSearch();
    prepDates(bar);
    fillDestSelect(destSelect, saved.destination || "");
    if (saved.date) bar.date.value = saved.date;
    if (saved.guests) bar.guests.value = saved.guests;

    var q = U.query();
    if (q.get("dest")) destSelect.value = q.get("dest");
    if (q.get("date")) bar.date.value = q.get("date");
    if (q.get("guests")) bar.guests.value = q.get("guests");

    enhanceSearchSelects(bar);
    initHeroSlideshow();

    bar.addEventListener("submit", function (e) {
      e.preventDefault();
      writeSearch({
        destination: destSelect.value,
        date: bar.date.value,
        guests: bar.guests.value
      });
      paint();
      var dest = destSelect.value;
      var target = dest
        ? document.getElementById("dest-" + dest.replace(/\s+/g, "-").toLowerCase())
        : document.getElementById("tour");
      if (target) target.scrollIntoView({ behavior: U.reduce ? "auto" : "smooth", block: "start" });
    });

    function paint() {
      fillDestSelect(destSelect, destSelect.value);
      var dest = destSelect.value;
      var featured = featuredTours();
      var grid = document.getElementById("tour-grid");
      var empty = document.getElementById("tour-empty");
      empty.hidden = featured.length > 0;
      grid.innerHTML = featured.map(function (tour) {
        return tourCardHtml(tour, "tours.html?id=" + encodeURIComponent(tour.id));
      }).join("");
      U.bindImages(grid);
      U.initMotion(grid);

      var host = document.getElementById("dest-sections");
      if (host) {
        var dests = destinations();
        if (dest) dests = dests.filter(function (d) { return d === dest; });
        host.innerHTML = dests.map(function (d) {
          var slug = d.replace(/\s+/g, "-").toLowerCase();
          var items = toursForDestination(d);
          return '<section class="section wrap dest-block" id="dest-' + U.escapeHtml(slug) + '">' +
            '<div class="section-head"><div>' +
            '<p class="eyebrow" data-i18n="vo.dest.k">' + U.escapeHtml(t("vo.dest.k")) + "</p>" +
            "<h2>" + U.escapeHtml(destLabel(d)) + "</h2>" +
            '<p data-i18n="vo.dest.p">' + U.escapeHtml(t("vo.dest.p")) + "</p>" +
            '</div><a class="link-more" href="tours.html?dest=' + encodeURIComponent(d) + '" data-i18n="vo.dest.more">' +
            U.escapeHtml(t("vo.dest.more")) + "</a></div>" +
            '<div class="card-grid card-grid--3">' +
            items.map(function (tour) {
              return tourCardHtml(tour, "tours.html?id=" + encodeURIComponent(tour.id));
            }).join("") +
            "</div></section>";
        }).join("");
        U.bindImages(host);
        U.initMotion(host);
      }

      applyVoI18n(document);
      enhanceSearchSelects(bar);
    }

    paint();

    var form = document.getElementById("quick-form");
    if (form) {
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
        sendMail(t("mail.home"), [
          t("mail.name") + ": " + name,
          t("mail.email") + ": " + email,
          t("mail.note") + ": " + message
        ]);
        form.classList.add("is-sent");
        form.querySelector(".form-success").classList.add("is-on");
      });
    }

    U.setRepaint(paint);
  }

  function initTours() {
    var list = document.getElementById("tour-list");
    var detail = document.getElementById("tour-detail");
    var cards = document.getElementById("tour-cards");
    var empty = document.getElementById("tour-empty");
    var state = { dest: "all", price: "all" };
    var currentId = null;
    var saved = readSearch();
    var q = U.query();
    if (q.get("dest")) state.dest = q.get("dest");
    else if (saved.destination) state.dest = saved.destination;

    function buildDestChips() {
      var row = document.querySelector('.filter-row [data-group="dest"]');
      if (!row) return;
      var parent = row.parentElement;
      var allBtn = parent.querySelector('[data-value="all"]');
      parent.querySelectorAll('.chip[data-group="dest"]:not([data-value="all"])').forEach(function (c) { c.remove(); });
      destinations().forEach(function (d) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chip" + (state.dest === d ? " is-on" : "");
        btn.dataset.group = "dest";
        btn.dataset.value = d;
        btn.textContent = destLabel(d);
        parent.appendChild(btn);
      });
      if (allBtn) allBtn.classList.toggle("is-on", state.dest === "all");
    }

    function filtered() {
      return tours.filter(function (tour) {
        if (state.dest !== "all" && tour.destination !== state.dest) return false;
        return priceOk(tour, state.price);
      });
    }

    function renderCards() {
      buildDestChips();
      var items = filtered();
      empty.hidden = items.length > 0;
      cards.innerHTML = items.map(function (tour) {
        return tourCardHtml(tour, "tours.html?id=" + encodeURIComponent(tour.id));
      }).join("");
      U.bindImages(cards);
      U.initMotion(cards);
      document.querySelectorAll(".chip").forEach(function (chip) {
        var group = chip.dataset.group;
        if (!group) return;
        chip.classList.toggle("is-on", state[group] === chip.dataset.value);
      });
    }

    function openTour(id, push, silent) {
      var tour = tourById(id);
      if (!tour) return showList(false);
      currentId = id;
      if (push) history.pushState({ id: id }, "", "?id=" + encodeURIComponent(id));
      list.hidden = true;
      detail.hidden = false;
      var guests = parseInt(saved.guests || q.get("guests") || "2", 10);
      if (!(guests >= 1 && guests <= 8)) guests = 2;
      var date = saved.date || q.get("date") || U.isoOffset(1);
      var end = addDays(date, tour.nightsOffset || 0);
      var desc = field(tour, "description") || [];
      var included = field(tour, "servicesIncluded") || [];
      var excluded = field(tour, "servicesExcluded") || [];
      var offers = field(tour, "offers") || [];
      var serviceNote = field(tour, "serviceNote");
      var priceNote = field(tour, "priceNote");

      detail.innerHTML =
        '<div class="detail-stage">' +
        '<div class="wrap detail-top">' +
        '<button type="button" class="back" id="tour-back">' + U.escapeHtml(t("back.arrow")) + "</button>" +
        "</div>" +
        detailSlideshowHtml(tour) +
        '<div class="wrap detail-below">' +
        '<p class="eyebrow seq detail-kicker">' + U.escapeHtml(destLabel(tour.destination)) + " · " + U.escapeHtml(field(tour, "durationLabel")) + "</p>" +
        '<div class="detail-body">' +
        '<div class="detail-copy">' +
        '<h1 class="seq detail-title">' + U.escapeHtml(field(tour, "name")) + "</h1>" +
        '<p class="lede seq">' + U.escapeHtml(field(tour, "cardLine")) + "</p>" +
        '<p class="price-line"><strong>' + U.money(tour.price) + "</strong> <span>" + U.escapeHtml(t("perGuest")) + "</span>" +
        (priceNote ? " · " + U.escapeHtml(priceNote) : "") + "</p>" +
        desc.map(function (line) { return "<p>" + U.escapeHtml(line) + "</p>"; }).join("") +
        '<div class="when">' +
        "<p><span>" + U.escapeHtml(t("detail.start")) + '</span> <strong id="date-start" data-iso="' + U.escapeHtml(date) + '">' + U.escapeHtml(showVN(date)) + "</strong> <em>" + U.escapeHtml(t("detail.default")) + "</em></p>" +
        "<p><span>" + U.escapeHtml(t("detail.end")) + '</span> <strong id="date-end" data-iso="' + U.escapeHtml(end) + '">' + U.escapeHtml(showVN(end)) + "</strong> <em>" + U.escapeHtml(t("detail.default")) + "</em></p>" +
        "</div>" +
        "<h2>" + U.escapeHtml(t("svc.h")) + "</h2>" +
        "<h3>" + U.escapeHtml(t("svc.in")) + "</h3>" + listHtml(included) +
        (serviceNote ? '<p class="hint">' + U.escapeHtml(serviceNote) + "</p>" : "") +
        "<h3>" + U.escapeHtml(t("svc.out")) + "</h3>" + listHtml(excluded) +
        "<h3>" + U.escapeHtml(t("svc.offers")) + "</h3>" + listHtml(offers) +
        buffetHtml(tour.buffetMenu) +
        "</div>" +
        '<aside class="stay-panel book-aside">' + bookingFormHtml(tour, { guests: guests, date: date }) +
        "</aside>" +
        "</div></div></div>";

      U.bindImages(detail);
      U.initMotion(detail);
      initDetailSlideshow();
      detail.querySelector("#tour-back").addEventListener("click", function () {
        history.pushState({}, "", "tours.html");
        showList(true);
      });
      wireBookingForm(tour);
      if (!silent) window.scrollTo({ top: 0, behavior: U.reduce ? "auto" : "smooth" });
    }

    function showList(scroll) {
      currentId = null;
      detail.hidden = true;
      detail.innerHTML = "";
      list.hidden = false;
      renderCards();
      if (scroll) window.scrollTo({ top: 0, behavior: U.reduce ? "auto" : "smooth" });
    }

    document.querySelector(".filter-bar").addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      var group = chip.dataset.group;
      state[group] = chip.dataset.value;
      chip.parentElement.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-on"); });
      chip.classList.add("is-on");
      renderCards();
    });

    window.addEventListener("popstate", function () {
      var id = queryId();
      if (id) openTour(id, false);
      else showList(false);
    });

    renderCards();
    var initial = queryId();
    if (initial) openTour(initial, false);
    U.setRepaint(function () {
      applyVoI18n(document);
      if (currentId) openTour(currentId, false, true);
      else renderCards();
    });
  }

  function initBook() {
    var pick = document.getElementById("book-pick");
    var panel = document.getElementById("book-panel");
    var cards = document.getElementById("book-cards");
    var currentId = null;
    var saved = readSearch();

    function showPick() {
      currentId = null;
      pick.hidden = false;
      panel.hidden = true;
      panel.innerHTML = "";
      cards.innerHTML = tours.map(function (tour) {
        return tourCardHtml(tour, "book.html?id=" + encodeURIComponent(tour.id));
      }).join("");
      U.bindImages(cards);
      U.initMotion(cards);
      applyVoI18n(document);
    }

    function openBook(id, push, silent) {
      var tour = tourById(id);
      if (!tour) return showPick();
      currentId = id;
      if (push) history.pushState({ id: id }, "", "?id=" + encodeURIComponent(id));
      pick.hidden = true;
      panel.hidden = false;
      var guests = parseInt(saved.guests || "2", 10);
      if (!(guests >= 1 && guests <= 8)) guests = 2;
      var date = saved.date || U.isoOffset(1);
      var end = addDays(date, tour.nightsOffset || 0);
      panel.innerHTML =
        '<button type="button" class="back" id="book-back">' + U.escapeHtml(t("back.arrow")) + "</button>" +
        '<div class="book-layout">' +
        '<div class="book-summary reveal">' +
        '<div class="media book-photo"><img src="' + U.escapeHtml(tour.image) + '" alt="' + U.escapeHtml(field(tour, "name")) + '"></div>' +
        '<p class="eyebrow">' + U.escapeHtml(destLabel(tour.destination)) + "</p>" +
        "<h1>" + U.escapeHtml(field(tour, "name")) + "</h1>" +
        '<p class="meta">' + U.escapeHtml(field(tour, "durationLabel")) + "</p>" +
        "<p>" + U.escapeHtml(field(tour, "cardLine")) + "</p>" +
        '<p class="price-line"><strong>' + U.money(tour.price) + "</strong> <span>" + U.escapeHtml(t("perGuest")) + "</span></p>" +
        '<div class="when">' +
        "<p><span>" + U.escapeHtml(t("detail.start")) + '</span> <strong id="date-start" data-iso="' + U.escapeHtml(date) + '">' + U.escapeHtml(showVN(date)) + "</strong> <em>" + U.escapeHtml(t("detail.default")) + "</em></p>" +
        "<p><span>" + U.escapeHtml(t("detail.end")) + '</span> <strong id="date-end" data-iso="' + U.escapeHtml(end) + '">' + U.escapeHtml(showVN(end)) + "</strong> <em>" + U.escapeHtml(t("detail.default")) + "</em></p>" +
        "</div>" +
        '<a class="link-more" href="tours.html?id=' + encodeURIComponent(tour.id) + '">' + U.escapeHtml(t("link.see")) + "</a>" +
        "</div>" +
        '<aside class="stay-panel">' + bookingFormHtml(tour, { guests: guests, date: date }) +
        "</aside>" +
        "</div>";
      U.bindImages(panel);
      U.initMotion(panel);
      panel.querySelector("#book-back").addEventListener("click", function () {
        history.pushState({}, "", "book.html");
        showPick();
      });
      wireBookingForm(tour);
      if (!silent) window.scrollTo({ top: 0, behavior: U.reduce ? "auto" : "smooth" });
    }

    window.addEventListener("popstate", function () {
      var id = queryId();
      if (id) openBook(id, false);
      else showPick();
    });

    var initial = queryId();
    if (initial) openBook(initial, false);
    else showPick();

    U.setRepaint(function () {
      applyVoI18n(document);
      if (currentId) openBook(currentId, false, true);
      else showPick();
    });
  }

  function readPay() {
    try {
      return JSON.parse(sessionStorage.getItem(PAY_KEY)) || null;
    } catch (err) {
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

  function initPay() {
    var stage = document.getElementById("pay-stage");
    if (!stage) return;

    function render() {
      var pay = readPay();
      if (!payValid(pay)) {
        document.title = t("vo.pay.titleMissing");
        stage.innerHTML =
          '<div class="missing reveal"><p>' + U.escapeHtml(t("pay.missing")) +
          '</p><a class="btn" href="index.html">' + U.escapeHtml(t("pay.home")) + "</a></div>";
        U.initMotion(stage);
        return;
      }

      var bank = DATA.bank || {
        name: "MB Bank",
        accountName: "Công ty The Dahlia",
        accountNumber: "226456789"
      };
      var amount = Math.round(Number(pay.amount));
      var note = transferNote(pay.tourNameVi || pay.tourName, pay.customerName);
      var payload = vietQr(amount, note);
      document.title = t("vo.pay.title");
      stage.innerHTML =
        '<section class="pay-sheet reveal">' +
        "<h1>" + U.escapeHtml(t("pay.h")) + "</h1>" +
        '<p class="pay-amount">' + U.escapeHtml(U.money(amount)) + "</p>" +
        '<p class="pay-tour">' + U.escapeHtml(pay.tourName) + "</p>" +
        '<p class="pay-meta">' + U.escapeHtml(showVN(pay.start)) + " – " + U.escapeHtml(showVN(pay.end)) +
        " · " + U.escapeHtml(String(pay.guests)) + U.escapeHtml(t("pay.guests")) + "</p>" +
        '<p class="pay-discount">' + U.escapeHtml(t("pay.discount")) + U.escapeHtml(pay.discount || t("promo.none")) + "</p>" +
        '<div class="qr-box" id="qr-box" role="img" aria-label="' + U.escapeHtml(t("pay.qr")) + '"></div>' +
        '<div class="pay-bank">' +
        "<p>" + U.escapeHtml(bank.name) + "</p>" +
        "<p>" + U.escapeHtml(bank.accountName) + "</p>" +
        "<p>" + U.escapeHtml(bank.accountNumber) + "</p>" +
        "</div>" +
        '<p class="pay-honest">' + U.escapeHtml(t("pay.honest")) + "</p>" +
        '<a class="btn" href="index.html">' + U.escapeHtml(t("pay.home")) + "</a>" +
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
        box.innerHTML = '<p class="form-error">' + U.escapeHtml(t("pay.qrFailLib")) + "</p>";
      } else {
        try {
          draw(QRCode.CorrectLevel.M);
        } catch (err) {
          try {
            draw(QRCode.CorrectLevel.L);
          } catch (err2) {
            box.innerHTML = '<p class="form-error">' + U.escapeHtml(t("pay.qrFail")) + "</p>";
          }
        }
      }
      U.initMotion(stage);
    }

    render();
    U.setRepaint(function () {
      applyVoI18n(document);
      render();
    });
  }

  function initContact() {
    var form = document.getElementById("mail-form");
    var q = U.query();

    function paintSelects() {
      var tourVal = form.tour.value || q.get("id") || q.get("tour") || "";
      form.tour.innerHTML = '<option value="">' + U.escapeHtml(t("choose.tour")) + "</option>" +
        tours.map(function (item) {
          return '<option value="' + item.id + '">' + U.escapeHtml(field(item, "name")) + "</option>";
        }).join("");
      if (tourVal) form.tour.value = tourVal;
      form.querySelectorAll("select").forEach(enhanceCustomSelect);
    }

    applyVoI18n(document);
    paintSelects();
    form.date.min = U.isoOffset(0);
    if (q.get("date")) form.date.value = q.get("date");
    if (!form.date.value) form.date.value = U.isoOffset(1);
    if (q.get("guests")) form.guests.value = q.get("guests");
    enhanceCustomDate(form.date);

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
      if (message.length < 4) return showErr(err, "err.msg");
      err.hidden = true;
      var tour = tourById(form.tour.value);
      sendMail(t("mail.tour"), [
        t("mail.name") + ": " + name,
        t("mail.email") + ": " + email,
        t("mail.phone") + ": " + phone,
        t("mail.kind") + ": " + t("mail.kindTour"),
        t("mail.tourField") + ": " + (tour ? field(tour, "name") : "—"),
        t("mail.date") + ": " + (form.date.value || "—"),
        t("mail.guests") + ": " + (form.guests ? form.guests.value : "—"),
        t("mail.note") + ": " + message
      ]);
      form.classList.add("is-sent");
      form.querySelector(".form-success").classList.add("is-on");
    });

    U.setRepaint(function () {
      applyVoI18n(document);
      paintSelects();
      enhanceCustomDate(form.date);
    });
  }

  applyVoI18n(document);
  upgradeLangFlags();

  if (page === "home") renderHome();
  if (page === "tours") initTours();
  if (page === "book") initBook();
  if (page === "contact") initContact();
  if (page === "pay") initPay();

  U.initMenu();
  U.initSolidHeader();
  upgradeLangFlags();
  U.bindImages(document);
  U.initMotion();
})();
