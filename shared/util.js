(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function money(n) {
    return new Intl.NumberFormat("vi-VN").format(n) + "đ";
  }

  function isoOffset(days) {
    var t = new Date();
    t.setHours(12, 0, 0, 0);
    t.setDate(t.getDate() + days);
    var m = String(t.getMonth() + 1).padStart(2, "0");
    var d = String(t.getDate()).padStart(2, "0");
    return t.getFullYear() + "-" + m + "-" + d;
  }

  function nights(a, b) {
    if (!a || !b) return 0;
    var as = a.split("-").map(Number);
    var bs = b.split("-").map(Number);
    var ms = new Date(bs[0], bs[1] - 1, bs[2]) - new Date(as[0], as[1] - 1, as[2]);
    return Math.round(ms / 86400000);
  }

  function formatDate(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    return p[2] + "." + p[1] + "." + p[0];
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function isPhone(v) {
    return String(v).replace(/\D/g, "").length >= 8;
  }

  function query() {
    return new URLSearchParams(window.location.search);
  }

  function roomById(id) {
    return window.DAHLIA.rooms.find(function (r) { return r.id === id; }) || null;
  }

  function tourById(id) {
    return window.DAHLIA.tours.find(function (t) { return t.id === id; }) || null;
  }

  function sendMail(subject, lines) {
    var email = window.DAHLIA.hotel.email;
    var href = "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
    var a = document.createElement("a");
    a.href = href;
    a.setAttribute("hidden", "");
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  var LANG_KEY = "dahlia-lang";
  var currentLang = "vi";
  try {
    if (localStorage.getItem(LANG_KEY) === "en") currentLang = "en";
  } catch (err) {}

  var COPY = {
    "skip": { vi: "Đến nội dung", en: "Skip to content" },
    "nav.main": { vi: "Chính", en: "Main" },
    "nav.footer": { vi: "Chân trang", en: "Footer" },
    "nav.rooms": { vi: "Phòng", en: "Rooms" },
    "nav.tours": { vi: "Tour", en: "Tours" },
    "nav.book": { vi: "Book", en: "Book" },
    "nav.bookRoom": { vi: "Book phòng", en: "Book a room" },
    "nav.contact": { vi: "Liên hệ", en: "Contact" },
    "nav.home": { vi: "Trang chủ", en: "Home" },
    "nav.bookStay": { vi: "Đặt phòng", en: "Book a stay" },
    "menu.open": { vi: "Mở menu", en: "Open menu" },
    "menu.close": { vi: "Đóng menu", en: "Close menu" },
    "lang.group": { vi: "Ngôn ngữ", en: "Language" },
    "footer.line": { vi: "Đến một nơi mới. Sống một trải nghiệm khác.", en: "A flower house in the Old Quarter. Quiet, young, and unhurried." },
    "footer.samples": { vi: "Xem mẫu khác", en: "See other samples" },
    "footer.ed": { vi: "Mẫu Editorial · thông tin liên hệ dùng cho bản mẫu.", en: "Editorial sample · contact details are for this mockup." },
    "footer.at": { vi: "Mẫu Soft Atelier · thông tin liên hệ dùng cho bản mẫu.", en: "Soft Atelier sample · contact details are for this mockup." },
    "footer.noir": { vi: "Mẫu Noir & Clay · thông tin liên hệ dùng cho bản mẫu.", en: "Noir & Clay sample · contact details are for this mockup." },
    "footer.voyage": { vi: "Mẫu Mixi Voyage · thông tin liên hệ dùng cho bản mẫu.", en: "Mixi Voyage sample · contact details are for this mockup." },
    "label.name": { vi: "Họ và tên", en: "Full name" },
    "label.email": { vi: "Email", en: "Email" },
    "label.phone": { vi: "Số điện thoại", en: "Phone" },
    "label.message": { vi: "Lời nhắn", en: "Message" },
    "label.checkin": { vi: "Nhận phòng", en: "Check-in" },
    "label.checkout": { vi: "Trả phòng", en: "Check-out" },
    "label.guests": { vi: "Số khách", en: "Guests" },
    "label.guestShort": { vi: "Khách", en: "Guests" },
    "label.room": { vi: "Phòng", en: "Room" },
    "label.tour": { vi: "Tour", en: "Tour" },
    "label.kind": { vi: "Loại yêu cầu", en: "Request" },
    "label.roomOf": { vi: "Phòng quan tâm", en: "Room" },
    "label.tourOf": { vi: "Tour quan tâm", en: "Tour" },
    "label.tourDate": { vi: "Ngày đi tour", en: "Tour date" },
    "label.date": { vi: "Ngày đi", en: "Date" },
    "label.depart": { vi: "Xuất phát", en: "Departs" },
    "label.place": { vi: "Địa điểm", en: "Where" },
    "label.duration": { vi: "Thời lượng", en: "Length" },
    "label.type": { vi: "Loại", en: "Type" },
    "label.price": { vi: "Giá", en: "Price" },
    "btn.send": { vi: "Gửi yêu cầu", en: "Send request" },
    "btn.bookRoom": { vi: "Book phòng", en: "Book a room" },
    "btn.viewTours": { vi: "Xem tour", en: "View tours" },
    "btn.viewRooms": { vi: "Xem phòng trống", en: "See rooms" },
    "btn.filterDate": { vi: "Lọc theo ngày này", en: "Filter this date" },
    "btn.findRoom": { vi: "Tìm phòng", en: "Find a room" },
    "btn.allRooms": { vi: "Xem tất cả phòng", en: "All rooms" },
    "btn.filterTours": { vi: "Lọc & đặt tour", en: "Filter and book" },
    "btn.hold": { vi: "Gửi yêu cầu giữ chỗ", en: "Request a hold" },
    "btn.next": { vi: "Tiếp tục", en: "Continue" },
    "success.title": { vi: "Đã nhận yêu cầu", en: "Request received" },
    "success.short": { vi: "Thư đã được mở sẵn tới hello@thedahliahanoi.com. Nếu cửa sổ thư không hiện, gửi trực tiếp tới địa chỉ này.", en: "A draft is ready for hello@thedahliahanoi.com. If your mail app doesn’t open, write to that address directly." },
    "success.long": { vi: "Đã nhận yêu cầu. Thư đã được mở sẵn tới hello@thedahliahanoi.com — hãy bấm gửi trong ứng dụng mail. Nếu cửa sổ thư không hiện, gửi trực tiếp tới địa chỉ này hoặc gọi +84 24 0000 0000.", en: "Request received. A draft is ready for hello@thedahliahanoi.com — press send in your mail app. If it doesn’t open, write to that address or call +84 24 0000 0000." },
    "success.mail": { vi: "Thư đã được mở sẵn tới hello@thedahliahanoi.com — hãy bấm gửi trong ứng dụng mail. Nếu cửa sổ thư không hiện, gửi trực tiếp tới địa chỉ này hoặc gọi +84 24 0000 0000.", en: "A draft is ready for hello@thedahliahanoi.com — press send in your mail app. If it doesn’t open, write to that address or call +84 24 0000 0000." },
    "success.call": { vi: "Thư đã được mở sẵn tới hello@thedahliahanoi.com. Nếu cửa sổ thư không hiện, gửi trực tiếp tới địa chỉ này hoặc gọi +84 24 0000 0000.", en: "A draft is ready for hello@thedahliahanoi.com. If your mail app doesn’t open, write to that address or call +84 24 0000 0000." },
    "success.plain": { vi: "Thư đã được mở sẵn tới hello@thedahliahanoi.com. Nếu cửa sổ thư không hiện, gửi trực tiếp tới địa chỉ này.", en: "A draft is ready for hello@thedahliahanoi.com. If your mail app doesn’t open, write to that address directly." },
    "guest.1": { vi: "1 khách", en: "1 guest" },
    "guest.2": { vi: "2 khách", en: "2 guests" },
    "guest.3": { vi: "3 khách", en: "3 guests" },
    "guest.4": { vi: "4 khách", en: "4 guests" },
    "guest.6": { vi: "6 khách", en: "6 guests" },
    "chip.all": { vi: "Tất cả", en: "All" },
    "chip.half": { vi: "Nửa ngày", en: "Half day" },
    "chip.full": { vi: "Cả ngày", en: "Full day" },
    "chip.walk": { vi: "Đi bộ", en: "Walking" },
    "chip.food": { vi: "Ẩm thực", en: "Food" },
    "chip.out": { vi: "Ngoài thành", en: "Out of town" },
    "chip.people": { vi: "Số người", en: "Guests" },
    "chip.day": { vi: "Ngày", en: "Day" },
    "chip.kind": { vi: "Loại tour", en: "Type" },
    "chip.anySession": { vi: "Mọi buổi", en: "Any time" },
    "chip.morning": { vi: "Sáng", en: "Morning" },
    "chip.afternoon": { vi: "Chiều", en: "Afternoon" },
    "chip.anyPrice": { vi: "Mọi giá", en: "Any price" },
    "chip.under": { vi: "Dưới 500.000đ", en: "Under 500,000đ" },
    "chip.mid": { vi: "500.000–1.000.000đ", en: "500,000–1,000,000đ" },
    "chip.over": { vi: "Trên 1.000.000đ", en: "Over 1,000,000đ" },
    "chip.private": { vi: "Riêng tư", en: "Private" },
    "chip.anyKind": { vi: "Mọi loại", en: "All types" },
    "chip.anyCount": { vi: "Mọi số", en: "Any size" },
    "chip.filter": { vi: "Lọc tour", en: "Filter tours" },
    "chip.session": { vi: "Buổi", en: "Time of day" },
    "empty.tours": { vi: "Không có tour khớp bộ lọc này.", en: "No tour matches these filters." },
    "empty.toursMore": { vi: "Không có tour khớp bộ lọc này. Thử bỏ bớt điều kiện.", en: "No tour matches. Try removing a filter." },
    "choice.room": { vi: "Đặt phòng", en: "Book a room" },
    "choice.tour": { vi: "Đặt tour", en: "Book a tour" },
    "hint.mail": { vi: "Yêu cầu được gửi về mail khách sạn.", en: "Your request opens in your mail app, addressed to the hotel." },
    "hint.mailLong": { vi: "Yêu cầu được gửi về mail khách sạn qua ứng dụng thư của bạn.", en: "The request opens in your mail app, addressed to the hotel." },
    "opt.room": { vi: "Phòng", en: "Room" },
    "opt.tour": { vi: "Tour", en: "Tour" },
    "err.name": { vi: "Vui lòng điền họ tên.", en: "Please enter your name." },
    "err.email": { vi: "Email chưa đúng định dạng.", en: "That email doesn’t look right." },
    "err.msg": { vi: "Viết vài dòng nội dung giúp khách sạn.", en: "Write a short note for the hotel." },
    "err.phone": { vi: "Số điện thoại cần ít nhất 8 chữ số.", en: "The phone number needs at least 8 digits." },
    "err.kind": { vi: "Chọn loại yêu cầu: phòng hoặc tour.", en: "Choose a room or a tour." },
    "err.dates": { vi: "Chọn ngày trả phòng sau ngày nhận.", en: "Check-out must be after check-in." },
    "err.room": { vi: "Chọn một phòng trước.", en: "Choose a room first." },
    "err.noRoom": { vi: "Chưa có phòng vừa số khách này. Căn hộ Hoa Đất nhận tối đa 4 khách.", en: "No room fits this many guests. Hoa Đất sleeps up to 4." },
    "err.noRoomShort": { vi: "Chưa có phòng vừa số khách.", en: "No room fits this many guests." },
    "err.noRoomPeople": { vi: "Chưa có phòng vừa số khách. Căn hộ Hoa Đất nhận tối đa 4 người.", en: "No room fits this many guests. Hoa Đất sleeps up to 4." },
    "err.back": { vi: "Quay lại để chọn ngày và phòng.", en: "Go back to choose dates and a room." },
    "perNight": { vi: "/ đêm", en: "/ night" },
    "perGuest": { vi: "/ khách", en: "/ guest" },
    "viewBook": { vi: "Xem và đặt", en: "View and book" },
    "viewBookArrow": { vi: "Xem và đặt →", en: "View and book →" },
    "back.list": { vi: "Quay lại danh sách", en: "Back to the list" },
    "back.arrow": { vi: "← Quay lại danh sách", en: "← Back to the list" },
    "itin": { vi: "Hành trình", en: "Itinerary" },
    "price.note": { vi: "Giá minh hoạ, khách sạn xác nhận sau khi nhận yêu cầu.", en: "Sample rate. The hotel confirms after your request." },
    "price.sample": { vi: "Giá minh họa.", en: "Sample rate." },
    "price.each": { vi: "Giá mỗi khách", en: "Per guest" },
    "price.one": { vi: "Mỗi khách", en: "Per guest" },
    "estimate": { vi: "Tạm tính", en: "Estimate" },
    "pick.hint": { vi: "Chọn một phòng để xem tạm tính.", en: "Choose a room to see the total." },
    "choose.room": { vi: "Chọn phòng", en: "Choose a room" },
    "choose.tour": { vi: "Chọn tour", en: "Choose a tour" },
    "book.this": { vi: "Book phòng", en: "Book this room" },
    "see.tour": { vi: "Xem tour", en: "View tour" },
    "link.book": { vi: "Book", en: "Book" },
    "link.see": { vi: "Xem", en: "View" },
    "day.full": { vi: "Cả ngày", en: "Full day" },
    "day.half": { vi: "Nửa ngày", en: "Half day" },
    "session.morning": { vi: "Sáng", en: "Morning" },
    "session.afternoon": { vi: "Chiều", en: "Afternoon" },
    "session.full": { vi: "Cả ngày", en: "Full day" },
    "kind.food": { vi: "Ẩm thực", en: "Food" },
    "kind.out": { vi: "Ngoài thành", en: "Out of town" },
    "kind.walk": { vi: "Đi bộ", en: "Walking" },
    "noir.private": { vi: "Riêng tư", en: "Private" },
    "noir.full": { vi: "Cả ngày", en: "Full day" },
    "noir.half": { vi: "Nửa ngày", en: "Half day" },
    "mail.home": { vi: "Lời nhắn từ trang chủ — The Dahlia Hanoi", en: "A note from the homepage — The Dahlia Hanoi" },
    "mail.room": { vi: "Yêu cầu phòng — The Dahlia Hanoi", en: "Room request — The Dahlia Hanoi" },
    "mail.tour": { vi: "Yêu cầu tour — The Dahlia Hanoi", en: "Tour request — The Dahlia Hanoi" },
    "mail.web": { vi: "Yêu cầu từ website — The Dahlia Hanoi", en: "Website request — The Dahlia Hanoi" },
    "mail.name": { vi: "Họ tên", en: "Name" },
    "mail.email": { vi: "Email", en: "Email" },
    "mail.phone": { vi: "Điện thoại", en: "Phone" },
    "mail.kind": { vi: "Loại", en: "Type" },
    "mail.roomField": { vi: "Phòng", en: "Room" },
    "mail.in": { vi: "Nhận phòng", en: "Check-in" },
    "mail.out": { vi: "Trả phòng", en: "Check-out" },
    "mail.tourField": { vi: "Tour", en: "Tour" },
    "mail.date": { vi: "Ngày tour", en: "Tour date" },
    "mail.when": { vi: "Ngày đi", en: "Date" },
    "mail.note": { vi: "Lời nhắn", en: "Note" },
    "mail.nights": { vi: "Số đêm", en: "Nights" },
    "mail.guests": { vi: "Số khách", en: "Guests" },
    "mail.total": { vi: "Tạm tính", en: "Estimate" },
    "mail.kindRoom": { vi: "Phòng", en: "Room" },
    "mail.kindTour": { vi: "Tour", en: "Tour" },
    "mail.bookRoom": { vi: "Đặt phòng", en: "Room booking" },
    "mail.bookTour": { vi: "Đặt tour", en: "Tour booking" },
    "step.dates": { vi: "Ngày", en: "Dates" },
    "step.rooms": { vi: "Phòng", en: "Room" },
    "step.confirm": { vi: "Xác nhận", en: "Confirm" },
    "step.stay": { vi: "Ngày ở", en: "Your dates" },
    "step.open": { vi: "Phòng còn chỗ", en: "Rooms that fit" },
    "step.done": { vi: "Xác nhận", en: "Confirm" },
    "ed.home.title": { vi: "The Dahlia Hanoi — Editorial", en: "The Dahlia Hanoi — Editorial" },
    "ed.hero.aria": { vi: "Ảnh mở đầu", en: "Opening photograph" },
    "ed.hero.alt": { vi: "Thành phố lúc hoàng hôn, mây tím và ánh đèn trên các toà nhà", en: "The city at dusk, violet cloud and lights across the buildings" },
    "ed.kicker": { vi: "Hoàn Kiếm, Hà Nội", en: "Hoan Kiem, Hanoi" },
    "ed.h1": { vi: "Một nhà nhỏ, có hoa, đủ yên.", en: "A small house, with flowers, quiet enough." },
    "ed.lede": { vi: "Khách sạn và căn hộ trẻ giữa phố cổ. Check-in 14:00, check-out 12:00 — ở ít phòng, để mỗi buổi sáng đều chậm.", en: "A young hotel and apartment house in the Old Quarter. Check-in 14:00, check-out 12:00 — few rooms, so every morning can stay slow." },
    "ed.stats": { vi: "Thông tin nhanh", en: "At a glance" },
    "ed.stat.rooms": { vi: "phòng và căn hộ", en: "rooms and apartments" },
    "ed.stat.tours": { vi: "tour cùng hướng dẫn", en: "guided tours" },
    "ed.stat.in": { vi: "giờ nhận phòng", en: "check-in" },
    "ed.h2": { vi: "Trẻ, có hoa, và giữ nhịp chậm của Hà Nội.", en: "Young, full of flowers, and on Hanoi’s slower clock." },
    "ed.p1": { vi: "Chúng tôi không làm nhà đông phòng. Mỗi sáng chỉ vài bàn, vài bình thược dược, và cửa sổ mở vừa đủ để nghe phố mà không bị phố chiếm.", en: "This is not a house of many rooms. A few tables each morning, a few vases of dahlias, and windows open just enough to hear the street." },
    "ed.p2": { vi: "18 Hàng Bông, vài phút đi bộ ra Hồ Hoàn Kiếm. Địa chỉ này dùng cho bản mẫu.", en: "18 Hang Bong, a few minutes’ walk to Hoan Kiem Lake. This address is for the sample." },
    "ed.flower.alt": { vi: "Hoa thược dược cánh lớp, tông kem và nâu", en: "Layered dahlia petals, cream and brown" },
    "ed.flower.cap": { vi: "Thược dược trong nhà, đổi mỗi vài ngày.", en: "Dahlias in the house, changed every few days." },
    "ed.rooms.h": { vi: "Bốn nơi ở", en: "Four places to stay" },
    "ed.tours.h": { vi: "Đi gần, về sớm", en: "Out nearby, home early" },
    "ed.write.h": { vi: "Viết một dòng cho nhà.", en: "Write a line to the house." },
    "ed.write.p": { vi: "Yêu cầu đầy đủ nằm ở trang thư. Ở đây chỉ cần tên, email và điều bạn đang nghĩ.", en: "The full request lives on the letter page. Here, just your name, email, and what you’re thinking." },
    "ed.tours.title": { vi: "Tour — The Dahlia Hanoi", en: "Tours — The Dahlia Hanoi" },
    "ed.tours.page": { vi: "Chọn một buổi đi.", en: "Choose an outing." },
    "ed.tours.lede": { vi: "Bốn hành trình xuất phát từ nhà. Lọc theo ngày, số người và loại tour.", en: "Four outings that start at the house. Filter by length, group size, and type." },
    "ed.book.title": { vi: "Book phòng — The Dahlia Hanoi", en: "Book a room — The Dahlia Hanoi" },
    "ed.book.kicker": { vi: "Book phòng", en: "Book a room" },
    "ed.book.h": { vi: "Chọn ngày, rồi chọn phòng.", en: "Choose the dates, then the room." },
    "ed.book.lede": { vi: "Nhận phòng 14:00 · Trả phòng 12:00. Giá minh hoạ theo đêm, chưa phải thanh toán.", en: "Check-in 14:00 · Check-out 12:00. A sample rate per night — not a payment." },
    "ed.contact.title": { vi: "Liên hệ — The Dahlia Hanoi", en: "Contact — The Dahlia Hanoi" },
    "ed.contact.kicker": { vi: "Thư", en: "A letter" },
    "ed.contact.h": { vi: "Gửi yêu cầu", en: "Send a request" },
    "ed.contact.lede": { vi: "Một thư tới hello@thedahliahanoi.com. Không thanh toán trên trang này.", en: "A letter to hello@thedahliahanoi.com. Nothing is paid on this page." },
    "at.home.title": { vi: "The Dahlia Hanoi — Soft Atelier", en: "The Dahlia Hanoi — Soft Atelier" },
    "at.hero.alt": { vi: "Phòng ngủ boutique với ga trắng và ánh sáng ấm", en: "A boutique bedroom, white linen and warm light" },
    "at.tabs": { vi: "Tìm phòng hoặc tour", en: "Find a room or a tour" },
    "at.kicker": { vi: "Hoàn Kiếm", en: "Hoan Kiem" },
    "at.h1": { vi: "Ở chậm, đặt nhanh.", en: "Stay slow. Book quickly." },
    "at.lede": { vi: "The Dahlia Hanoi — nhà hoa giữa phố cổ. Check-in 14:00, check-out 12:00. Chọn ngày ngay trên thẻ này.", en: "The Dahlia Hanoi — a flower house in the Old Quarter. Check-in 14:00, check-out 12:00. Pick your dates on this card." },
    "at.notes": { vi: "Ba điều về nhà", en: "Three things about the house" },
    "at.n1": { vi: "Yên", en: "Quiet" },
    "at.n1p": { vi: "Ít phòng, cửa sổ mở vừa đủ.", en: "Few rooms, windows open just enough." },
    "at.n2": { vi: "Hoa", en: "Flowers" },
    "at.n2p": { vi: "Thược dược tươi trên bàn mỗi sáng.", en: "Fresh dahlias on the table each morning." },
    "at.n3": { vi: "Gần hồ", en: "Near the lake" },
    "at.n3p": { vi: "Vài phút đi bộ ra Hồ Hoàn Kiếm.", en: "A few minutes’ walk to Hoan Kiem Lake." },
    "at.rooms": { vi: "Phòng và căn hộ", en: "Rooms and apartments" },
    "at.tours": { vi: "Tour trong ngày", en: "Day tours" },
    "at.tours.title": { vi: "Tour — Soft Atelier", en: "Tours — Soft Atelier" },
    "at.tours.h": { vi: "Tour xuất phát từ nhà", en: "Tours that leave from the house" },
    "at.tours.lede": { vi: "Chọn buổi và mức giá. Bấm một tour để xem giờ giấc.", en: "Choose a time of day and a price. Open a tour to see the hours." },
    "at.book.title": { vi: "Book phòng — Soft Atelier", en: "Book a room — Soft Atelier" },
    "at.book.h": { vi: "Giữ một phòng", en: "Hold a room" },
    "at.book.lede": { vi: "Nhận phòng 14:00 · Trả phòng 12:00. Chọn phòng, tên và email hiện ngay bên dưới.", en: "Check-in 14:00 · Check-out 12:00. Choose a room — name and email appear just below." },
    "at.contact.title": { vi: "Liên hệ — Soft Atelier", en: "Contact — Soft Atelier" },
    "at.contact.h": { vi: "Gửi yêu cầu", en: "Send a request" },
    "at.contact.lede": { vi: "Chọn đặt phòng hoặc đặt tour. Phần còn lại đổi theo lựa chọn đó.", en: "Choose a room or a tour. The rest of the form follows." },
    "no.home.title": { vi: "The Dahlia Hanoi — Noir & Clay", en: "The Dahlia Hanoi — Noir & Clay" },
    "no.hero.alt": { vi: "Phố cổ Hà Nội, nhà ống và nhịp sống ban ngày", en: "Hanoi’s Old Quarter, tube houses and the daytime street" },
    "no.h1": { vi: "Yên giữa Hà Nội.", en: "Quiet, in the middle of Hanoi." },
    "no.lede": { vi: "Nhà hoa, ít phòng, giữa Hoàn Kiếm. Check-in 14:00, check-out 12:00.", en: "A flower house, few rooms, in Hoan Kiem. Check-in 14:00, check-out 12:00." },
    "no.checkin": { vi: "Giờ nhận phòng", en: "Check-in" },
    "no.blurb": { vi: "The Dahlia Hanoi là một nhà nhỏ: trẻ, có hoa, và đủ yên để nghe thành phố từ xa. Bốn phòng, bốn tour, một địa chỉ mẫu trên Hàng Bông.", en: "The Dahlia Hanoi is a small house: young, full of flowers, and quiet enough to hear the city from a distance. Four rooms, four tours, one sample address on Hang Bong." },
    "no.rooms": { vi: "Catalog nơi ở", en: "Where you stay" },
    "no.tours": { vi: "Đi trong ngày", en: "Out for the day" },
    "no.addr": { vi: "Hoàn Kiếm, Hà Nội. Thư tới hello@thedahliahanoi.com · điện thoại +84 24 0000 0000.", en: "Hoan Kiem, Hanoi. Write to hello@thedahliahanoi.com · or call +84 24 0000 0000." },
    "no.tours.title": { vi: "Tour — Noir & Clay", en: "Tours — Noir & Clay" },
    "no.tours.h": { vi: "Bốn lối đi", en: "Four ways out" },
    "no.book.title": { vi: "Book phòng — Noir & Clay", en: "Book a room — Noir & Clay" },
    "no.book.kicker": { vi: "Book phòng", en: "Book a room" },
    "no.book.h": { vi: "Ba bước, một yêu cầu.", en: "Three steps, one request." },
    "no.book.lede": { vi: "Nhận phòng 14:00 · Trả phòng 12:00. Giá cập nhật theo số đêm.", en: "Check-in 14:00 · Check-out 12:00. The rate follows the number of nights." },
    "no.contact.title": { vi: "Liên hệ — Noir & Clay", en: "Contact — Noir & Clay" },
    "no.contact.kicker": { vi: "Thư", en: "A letter" },
    "no.contact.h": { vi: "Gửi yêu cầu", en: "Send a request" },
    "vo.home.title": { vi: "The Dahlia Hanoi — Mixi Voyage", en: "The Dahlia Hanoi — Mixi Voyage" },
    "vo.desc": { vi: "Đặt phòng và tour tại The Dahlia Hanoi — phong cách booking travel.", en: "Book a room or a tour at The Dahlia Hanoi — in a travel-booking style." },
    "vo.hero.aria": { vi: "Mở đầu", en: "Opening" },
    "vo.hero.alt": { vi: "Sảnh khách sạn sáng với ánh đèn ấm và nội thất gỗ", en: "A bright hotel lobby, warm lamps and wood" },
    "vo.kicker": { vi: "Hoàn Kiếm · Hà Nội", en: "Hoan Kiem · Hanoi" },
    "vo.h1": { vi: "Đặt phòng. Chọn tour. Ở chậm giữa phố cổ.", en: "Book a room. Choose a tour. Stay slow in the Old Quarter." },
    "vo.lede": { vi: "The Dahlia Hanoi — Hotel & Apartment. Check-in 14:00, check-out 12:00. Tìm ngày trống rồi giữ chỗ trong vài bước.", en: "The Dahlia Hanoi — Hotel & Apartment. Check-in 14:00, check-out 12:00. Find open dates, then hold a place in a few steps." },
    "vo.tabs": { vi: "Phòng hoặc tour", en: "Room or tour" },
    "vo.trust": { vi: "Vì sao chọn Dahlia", en: "Why Dahlia" },
    "vo.t1": { vi: "Phòng & căn hộ", en: "Rooms & apartments" },
    "vo.t1p": { vi: "Ít phòng, mỗi sáng đủ chậm.", en: "Few rooms, so the morning can stay slow." },
    "vo.t2": { vi: "Tour ngày", en: "Day tours" },
    "vo.t2p": { vi: "Đi gần nhà, về trước tối.", en: "Out nearby, home before evening." },
    "vo.t3": { vi: "Nhận phòng", en: "Check-in" },
    "vo.t3p": { vi: "Trả phòng 12:00 mỗi ngày.", en: "Check-out is 12:00." },
    "vo.t4": { vi: "Gần Hồ Hoàn Kiếm", en: "Near Hoan Kiem Lake" },
    "vo.t4p": { vi: "18 Hàng Bông, vài phút đi bộ.", en: "18 Hang Bong, a few minutes on foot." },
    "vo.rooms.k": { vi: "Phòng nổi bật", en: "Featured rooms" },
    "vo.rooms.h": { vi: "Chọn nơi ở", en: "Choose where you stay" },
    "vo.rooms.p": { vi: "Giá minh họa theo đêm. Chọn ngày trên thanh tìm để giữ chỗ.", en: "Sample rates per night. Pick dates in the search bar to hold a room." },
    "vo.tours.k": { vi: "Tour nổi bật", en: "Featured tours" },
    "vo.tours.h": { vi: "Đi cùng nhà", en: "Out with the house" },
    "vo.tours.p": { vi: "Cuộn ngang để xem tour — từ bình minh hồ đến Ninh Bình một ngày.", en: "Scroll sideways — from dawn at the lake to a day in Ninh Binh." },
    "vo.ask.k": { vi: "Liên hệ nhanh", en: "A quick note" },
    "vo.ask.h": { vi: "Viết cho nhà trước khi đặt.", en: "Write to the house before you book." },
    "vo.ask.p": { vi: "Cần phòng dài ngày, tour riêng tư, hoặc hỏi giờ nhận sớm — gửi một dòng, chúng tôi mở sẵn thư tới hello@thedahliahanoi.com.", en: "A longer stay, a private tour, or an early check-in — send a line. A draft opens to hello@thedahliahanoi.com." },
    "ph.think": { vi: "Bạn đang nghĩ gì?", en: "What’s on your mind?" },
    "vo.tours.title": { vi: "Tour — Mixi Voyage · The Dahlia Hanoi", en: "Tours — Mixi Voyage · The Dahlia Hanoi" },
    "vo.tours.page": { vi: "Lọc và giữ chỗ", en: "Filter and hold a place" },
    "vo.tours.lede": { vi: "Chọn thời lượng, loại trải nghiệm và mức giá. Bấm một tour để xem hành trình chi tiết.", en: "Choose the length, the kind of day, and a price. Open a tour for the full route." },
    "vo.book.title": { vi: "Book phòng — Mixi Voyage · The Dahlia Hanoi", en: "Book a room — Mixi Voyage · The Dahlia Hanoi" },
    "vo.book.kicker": { vi: "Book phòng", en: "Book a room" },
    "vo.book.h": { vi: "Chọn ngày, chọn phòng, xem tạm tính", en: "Dates, a room, then the total" },
    "vo.book.lede": { vi: "Nhận phòng 14:00 · Trả phòng 12:00. Giá minh họa theo đêm — gửi yêu cầu, chưa thanh toán online.", en: "Check-in 14:00 · Check-out 12:00. A sample rate per night — send a request, no payment online." },
    "vo.stay": { vi: "Lịch lưu trú", en: "Your stay" },
    "vo.contact.title": { vi: "Liên hệ — Mixi Voyage · The Dahlia Hanoi", en: "Contact — Mixi Voyage · The Dahlia Hanoi" },
    "vo.contact.h": { vi: "Gửi yêu cầu đặt chỗ", en: "Send a booking request" },
    "vo.contact.lede": { vi: "Form mở thư tới hello@thedahliahanoi.com. Điền đủ để nhà phản hồi nhanh.", en: "The form opens a letter to hello@thedahliahanoi.com. Fill it in so the house can answer quickly." },
    "vo.contact.hours": { vi: "Nhận phòng 14:00 · Trả phòng 12:00", en: "Check-in 14:00 · Check-out 12:00" },
    "vo.contact.h2": { vi: "Yêu cầu của bạn", en: "Your request" },
    "vo.contact.hint": { vi: "Chọn đặt phòng hoặc đặt tour — phần còn lại đổi theo lựa chọn.", en: "Choose a room or a tour — the rest of the form follows." },
    "ch.title": { vi: "The Dahlia Hanoi — Chọn hướng thiết kế", en: "The Dahlia Hanoi — Choose a direction" },
    "ch.desc": { vi: "Bốn hướng khách sạn và một mẫu web bán tour cho The Dahlia.", en: "Four hotel directions and one tour-shop sample for The Dahlia." },
    "ch.h1": { vi: "Chọn một nhịp cho nhà hoa.", en: "Choose a rhythm for the flower house." },
    "ch.lede": { vi: "Bốn cách kể cùng một khách sạn. Cùng phòng, cùng tour, cùng lời mời — khác bố cục, để chọn hướng trước khi làm bản chính. Mẫu thứ năm chỉ là web bán tour.", en: "Four ways to tell the same hotel. Same rooms, same tours, same invitation — different layouts, so you can choose a direction before the real site. The fifth sample is a tour shop only." },
    "ch.grid": { vi: "Năm mẫu thiết kế", en: "Five design samples" },
    "ch.ed.p": { vi: "Tạp chí. Ảnh full-bleed, khoảng trắng rộng, đường kẻ mảnh. Logo và câu chữ nằm dưới ảnh, không đè mặt người.", en: "A magazine. Full-bleed photos, wide margins, hairline rules. The logo and the words sit under the picture." },
    "ch.ed.go": { vi: "Mở mẫu Editorial", en: "Open Editorial" },
    "ch.at.p": { vi: "Ấm, bo tròn, đặt nhanh. Thẻ tìm phòng luôn hiện — chọn ngày là thấy phòng.", en: "Warm, rounded, quick to book. The search card stays in view — pick the dates and the rooms appear." },
    "ch.at.go": { vi: "Mở mẫu Atelier", en: "Open Atelier" },
    "ch.no.p": { vi: "Nền kem, khối nâu đậm. Ảnh một bên, chữ kem một bên. Catalog rõ, tương phản mạnh.", en: "Cream ground, deep brown blocks. A photo on one side, cream type on the other. A clear catalog, strong contrast." },
    "ch.no.go": { vi: "Mở mẫu Noir", en: "Open Noir" },
    "ch.vo.tag": { vi: "Phong cách Mixivivu / Booking travel", en: "Mixivivu / booking-travel style" },
    "ch.vo.p": { vi: "Hero cảnh quan + thanh tìm đa trường đè dưới ảnh. Thẻ giá, rail tour, trust strip — cảm giác đặt chỗ sản phẩm, vẫn giữ palette Dahlia.", en: "A landscape hero and a multi-field search bar over the photo. Price cards, a tour rail, a trust strip — the feel of booking a trip, still in the Dahlia palette." },
    "ch.vo.go": { vi: "Mở mẫu Voyage", en: "Open Voyage" },
    "ch.sale.h": { vi: "Web bán tour", en: "Tour shop" },
    "ch.sale.tag": { vi: "Mixivivu · trắng nâu", en: "Mixivivu · white and brown" },
    "ch.sale.p": { vi: "Web bán tour kiểu Mixivivu: lưới thẻ, lọc điểm đến, đặt chỗ. Trắng nâu, không phòng.", en: "A Mixivivu-style tour shop: a card grid, destination filters, booking. White and brown, no rooms." },
    "ch.sale.go": { vi: "Mở web bán tour", en: "Open the tour shop" },
    "ch.foot": { vi: "Thông tin liên hệ trên các mẫu là dữ liệu trình bày: hello@thedahliahanoi.com · +84 24 0000 0000 · 18 Hàng Bông, Hoàn Kiếm.", en: "Contact details on these samples are placeholder data: hello@thedahliahanoi.com · +84 24 0000 0000 · 18 Hang Bong, Hoan Kiem." },
    "ch.dates": { vi: "Nhận phòng · Trả phòng · Khách", en: "Check-in · Check-out · Guests" },
    "ch.hero": { vi: "Đặt phòng · Chọn tour", en: "Book a room · Choose a tour" },
    "ch.in": { vi: "Nhận", en: "In" },
    "ch.out": { vi: "Trả", en: "Out" },
    "ch.find": { vi: "Tìm", en: "Search" }
  };

  function lang() { return currentLang; }

  function t(key, vars) {
    var row = COPY[key];
    var s = row ? (row[currentLang] || row.vi || key) : key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split("{" + k + "}").join(String(vars[k]));
      });
    }
    return s;
  }

  function tx(item, key) {
    if (!item) return "";
    if (currentLang === "en" && item.en && item.en[key] != null && item.en[key] !== "") return item.en[key];
    return item[key] == null ? "" : item[key];
  }

  function txAt(item, key, index, sub) {
    var base = item && item[key] && item[key][index];
    var fallback = base ? (sub ? base[sub] : base) : "";
    if (currentLang === "en" && item && item.en && item.en[key] && item.en[key][index]) {
      var node = item.en[key][index];
      if (sub) return node[sub] != null ? node[sub] : fallback;
      return node != null ? node : fallback;
    }
    return fallback == null ? "" : fallback;
  }

  function guestsLabel(n) {
    n = Number(n);
    if (currentLang === "en") return n + (n === 1 ? " guest" : " guests");
    return n + " khách";
  }

  function maxGuests(n) {
    n = Number(n);
    if (currentLang === "en") return "up to " + n + (n === 1 ? " guest" : " guests");
    return "tối đa " + n + " khách";
  }

  function stayLine(nights, guests) {
    nights = Number(nights);
    if (currentLang === "en") {
      return nights + (nights === 1 ? " night" : " nights") + " · " + guestsLabel(guests);
    }
    return nights + " đêm · " + guestsLabel(guests);
  }

  function holdingLine(name, nights, guests) {
    if (currentLang === "en") return "Holding " + name + " · " + stayLine(nights, guests);
    return "Đang giữ chỗ " + name + " · " + stayLine(nights, guests);
  }

  function setText(el, text) {
    var node = null;
    var i;
    for (i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === 3 && /\S/.test(el.childNodes[i].textContent)) {
        node = el.childNodes[i];
        break;
      }
    }
    if (!node) {
      if (!el.children.length) el.textContent = text;
      return;
    }
    var after = node.nextSibling;
    var hasElement = false;
    while (after) {
      if (after.nodeType === 1) { hasElement = true; break; }
      after = after.nextSibling;
    }
    node.textContent = hasElement ? text + " " : text;
  }

  function applyI18n(root) {
    var scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach(function (el) {
      setText(el, t(el.getAttribute("data-i18n")));
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

  function makeSwitch() {
    var box = document.createElement("div");
    box.className = "lang-switch";
    box.setAttribute("role", "group");
    box.setAttribute("data-i18n-aria", "lang.group");
    box.innerHTML =
      '<button type="button" class="lang-flag" data-set-lang="vi" aria-label="Tiếng Việt">' +
        '<svg class="lang-flag-svg" viewBox="0 0 30 20" width="34" height="24" aria-hidden="true" focusable="false">' +
          '<rect width="30" height="20" fill="#CE1126"/>' +
          '<polygon points="15,3.2 16.7,8.6 22.4,8.6 17.8,11.9 19.5,17.3 15,14 10.5,17.3 12.2,11.9 7.6,8.6 13.3,8.6" fill="#FFCD00"/>' +
        "</svg>" +
      "</button>" +
      '<button type="button" class="lang-flag" data-set-lang="en" aria-label="English">' +
        '<svg class="lang-flag-svg" viewBox="0 0 60 40" width="34" height="24" aria-hidden="true" focusable="false">' +
          '<rect width="60" height="40" fill="#012169"/>' +
          '<path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" stroke-width="8"/>' +
          '<path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" stroke-width="4"/>' +
          '<path d="M30,0 V40 M0,20 H60" stroke="#fff" stroke-width="12"/>' +
          '<path d="M30,0 V40 M0,20 H60" stroke="#C8102E" stroke-width="7"/>' +
        "</svg>" +
      "</button>";
    return box;
  }

  function mountSwitches() {
    document.querySelectorAll(".site-header").forEach(function (header) {
      if (header.querySelector(".header-end")) return;
      var end = document.createElement("div");
      end.className = "header-end";
      var nav = header.querySelector(".desktop-nav");
      var pill = header.querySelector(".book-pill") || header.querySelector(".cta-nav");
      var toggle = header.querySelector(".nav-toggle");
      if (nav) end.appendChild(nav);
      if (pill) end.appendChild(pill);
      end.appendChild(makeSwitch());
      if (toggle) end.appendChild(toggle);
      header.appendChild(end);
    });
    document.querySelectorAll(".mobile-menu").forEach(function (menu) {
      if (menu.querySelector(".lang-switch")) return;
      var sw = makeSwitch();
      var closeBtn = menu.querySelector(".menu-close");
      if (closeBtn) closeBtn.insertAdjacentElement("afterend", sw);
      else menu.insertBefore(sw, menu.firstChild);
    });
  }

  function syncSwitches() {
    document.documentElement.lang = currentLang === "en" ? "en" : "vi";
    if (currentLang === "en") document.documentElement.setAttribute("data-lang", "en");
    else document.documentElement.removeAttribute("data-lang");
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      var on = btn.getAttribute("data-set-lang") === currentLang;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("is-on", on);
    });
    document.querySelectorAll(".lang-switch").forEach(function (box) {
      box.setAttribute("aria-label", t("lang.group"));
    });
  }

  var repaintFn = function () {};
  function setRepaint(fn) { repaintFn = fn || function () {}; }

  function setLang(next) {
    currentLang = next === "en" ? "en" : "vi";
    try { localStorage.setItem(LANG_KEY, currentLang); } catch (err) {}
    syncSwitches();
    applyI18n(document);
    repaintFn();
  }

  function initI18n() {
    // Root chooser only picks a sample — no language control or translation there.
    if (document.querySelector("main.chooser")) {
      document.documentElement.lang = "vi";
      document.documentElement.removeAttribute("data-lang");
      document.documentElement.classList.add("i18n-ready");
      return;
    }
    mountSwitches();
    syncSwitches();
    applyI18n(document);
    document.documentElement.classList.add("i18n-ready");
    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest("[data-set-lang]");
      if (!btn) return;
      e.preventDefault();
      setLang(btn.getAttribute("data-set-lang"));
    });
  }

  function successText() { return t("success.long"); }

  function bindImages(root) {
    (root || document).querySelectorAll("img:not(.logo)").forEach(function (img) {
      if (img.dataset.bound) return;
      img.dataset.bound = "1";
      img.addEventListener("error", function () { img.remove(); });
    });
  }

  function knockOutLogo(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    var image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var d = image.data;
    var bg = 217;
    for (var i = 0; i < d.length; i += 4) {
      var r = d[i];
      var g = d[i + 1];
      var b = d[i + 2];
      var avg = (r + g + b) / 3;
      var spread = Math.max(r, g, b) - Math.min(r, g, b);
      var alpha;
      if (spread < 18 && avg > 200) alpha = 0;
      else {
        alpha = 1 - avg / bg;
        if (alpha < 0) alpha = 0;
        if (alpha > 1) alpha = 1;
      }
      d[i] = 0;
      d[i + 1] = 0;
      d[i + 2] = 0;
      d[i + 3] = Math.round(alpha * 255);
    }
    ctx.putImageData(image, 0, 0);
    return canvas.toDataURL("image/png");
  }

  function prepareLogos() {
    document.querySelectorAll("img.logo").forEach(function (img) {
      function apply() {
        if (img.dataset.cut === "1") {
          img.classList.add("is-ready");
          return;
        }
        try {
          if (!img.naturalWidth) throw new Error("empty");
          var url = knockOutLogo(img);
          img.dataset.cut = "1";
          img.addEventListener("load", function () { img.classList.add("is-ready"); });
          img.src = url;
        } catch (err) {
          img.classList.add("is-ready");
        }
      }
      if (img.complete) apply();
      else img.addEventListener("load", apply);
      img.addEventListener("error", function () { img.classList.add("is-ready"); });
    });
  }

  function initMenu() {
    var btn = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".mobile-menu");
    if (!btn || !menu) return;
    function close() {
      menu.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
      document.body.classList.remove("menu-open");
    }
    function open() {
      menu.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      menu.setAttribute("aria-hidden", "false");
      document.body.classList.add("menu-open");
    }
    btn.addEventListener("click", function () {
      if (menu.classList.contains("is-open")) close();
      else open();
    });
    menu.querySelectorAll("a, .menu-close").forEach(function (el) {
      el.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  function initMotion(root) {
    var scope = root || document;
    var seq = scope.querySelectorAll(".seq:not([data-watched])");
    var heroes = scope.querySelectorAll(".rise-hero:not([data-watched])");
    var reveals = scope.querySelectorAll(".reveal:not([data-watched])");
    function mark(el) { el.classList.add("in"); }
    heroes.forEach(function (el) {
      el.dataset.watched = "1";
      mark(el);
    });
    seq.forEach(function (el, i) {
      el.dataset.watched = "1";
      if (!reduce) el.style.transitionDelay = (80 + i * 100) + "ms";
      window.requestAnimationFrame(function () { mark(el); });
    });
    if (reduce || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) {
        el.dataset.watched = "1";
        mark(el);
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        mark(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) {
      el.dataset.watched = "1";
      io.observe(el);
    });
  }

  function initSolidHeader() {
    var header = document.querySelector(".site-header");
    if (!header || !document.body.classList.contains("page-home")) return;
    function onScroll() {
      header.classList.toggle("is-solid", window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function peopleOk(tour, value) {
    if (!value || value === "all") return true;
    return tour.maxPeople >= Number(value);
  }

  function priceOk(tour, value) {
    if (!value || value === "all") return true;
    if (value === "under") return tour.price < 500000;
    if (value === "mid") return tour.price >= 500000 && tour.price <= 1000000;
    if (value === "over") return tour.price > 1000000;
    return true;
  }

  function labelDay(code) {
    return code === "ca-ngay" ? t("day.full") : t("day.half");
  }
  function labelSession(code) {
    if (code === "sang") return t("session.morning");
    if (code === "chieu") return t("session.afternoon");
    return t("session.full");
  }
  function labelKind(code) {
    if (code === "am-thuc") return t("kind.food");
    if (code === "ngoai-thanh") return t("kind.out");
    return t("kind.walk");
  }
  function labelNoir(code) {
    if (code === "rieng-tu") return t("noir.private");
    if (code === "ca-ngay") return t("noir.full");
    return t("noir.half");
  }

  window.Dahlia = {
    reduce: reduce,
    money: money,
    isoOffset: isoOffset,
    nights: nights,
    formatDate: formatDate,
    escapeHtml: escapeHtml,
    isEmail: isEmail,
    isPhone: isPhone,
    query: query,
    roomById: roomById,
    tourById: tourById,
    sendMail: sendMail,
    successText: successText,
    bindImages: bindImages,
    prepareLogos: prepareLogos,
    initMenu: initMenu,
    initMotion: initMotion,
    initSolidHeader: initSolidHeader,
    peopleOk: peopleOk,
    priceOk: priceOk,
    labelDay: labelDay,
    labelSession: labelSession,
    labelKind: labelKind,
    labelNoir: labelNoir,
    lang: lang,
    t: t,
    tx: tx,
    txAt: txAt,
    guestsLabel: guestsLabel,
    maxGuests: maxGuests,
    stayLine: stayLine,
    holdingLine: holdingLine,
    applyI18n: applyI18n,
    setLang: setLang,
    setRepaint: setRepaint
  };

  prepareLogos();
  initI18n();
})();
