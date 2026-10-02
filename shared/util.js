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

  var successText = "Đã nhận yêu cầu. Thư đã được mở sẵn tới hello@thedahliahanoi.com — hãy bấm gửi trong ứng dụng mail. Nếu cửa sổ thư không hiện, gửi trực tiếp tới địa chỉ này hoặc gọi +84 24 0000 0000.";

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
    return code === "ca-ngay" ? "Cả ngày" : "Nửa ngày";
  }
  function labelSession(code) {
    if (code === "sang") return "Sáng";
    if (code === "chieu") return "Chiều";
    return "Cả ngày";
  }
  function labelKind(code) {
    if (code === "am-thuc") return "Ẩm thực";
    if (code === "ngoai-thanh") return "Ngoài thành";
    return "Đi bộ";
  }
  function labelNoir(code) {
    if (code === "rieng-tu") return "Riêng tư";
    if (code === "ca-ngay") return "Cả ngày";
    return "Nửa ngày";
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
    labelNoir: labelNoir
  };

  prepareLogos();
})();
