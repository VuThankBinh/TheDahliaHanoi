/**
 * Máy chủ local: trang Web The Dahlia (wwwroot) + API ghi đè catalogue + Quản trị admin.
 * Chỉ lắng nghe 127.0.0.1. Chạy: npm start
 */
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { writeCatalogue, ROOT } = require("./tools/catalogue-io");

const PORT = Number(process.env.PORT) || 4173;
const HOST = process.env.HOST || "127.0.0.1";
const root = path.resolve(ROOT);
const WWWROOT = path.join(root, "wwwroot");
const MAX_CATALOGUE = 8 * 1024 * 1024;
const MAX_UPLOAD = 12 * 1024 * 1024;
const MAX_IMAGE = 8 * 1024 * 1024;
const IMG_ROOT = path.join(WWWROOT, "img");
const FOLDER_RE = /^(tours|venues|food|fleet|experiences|destinations\/[a-z0-9][a-z0-9-]{0,80}|menus\/[a-z0-9][a-z0-9-]{0,80})$/;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8"
};

function send(res, status, body, headers) {
  res.writeHead(status, Object.assign({ "Cache-Control": "no-cache" }, headers || {}));
  res.end(body);
}

function readBody(req, limit) {
  return new Promise(function (resolve, reject) {
    const chunks = [];
    let size = 0;
    let settled = false;
    function done(err, buf) {
      if (settled) return;
      settled = true;
      if (err) reject(err);
      else resolve(buf);
    }
    req.on("data", function (chunk) {
      size += chunk.length;
      if (size > limit) {
        req.destroy();
        done(new Error("File quá lớn."));
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", function () { done(null, Buffer.concat(chunks)); });
    req.on("error", function (err) { done(err); });
  });
}

function safeFolder(folder) {
  const norm = String(folder || "").replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  return FOLDER_RE.test(norm) ? norm : "";
}

function safeImageName(filename) {
  const base = path.basename(String(filename || "image"));
  const ext = path.extname(base).toLowerCase() === ".jpeg" ? ".jpg" : path.extname(base).toLowerCase();
  if (![".jpg", ".png", ".webp", ".gif"].includes(ext)) return null;
  const stem = base.slice(0, base.length - path.extname(base).length)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "image";
  return { stem: stem, ext: ext === ".jpeg" ? ".jpg" : ext };
}

function looksLikeImage(buf, ext) {
  if (buf.length < 12) return false;
  if (ext === ".jpg") return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  if (ext === ".png") return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  if (ext === ".gif") return buf.slice(0, 4).toString("ascii") === "GIF8";
  if (ext === ".webp") return buf.slice(0, 4).toString("ascii") === "RIFF" && buf.slice(8, 12).toString("ascii") === "WEBP";
  return false;
}

function saveImage(payload) {
  const folder = safeFolder(payload && payload.folder);
  if (!folder) {
    return { errors: ["Thư mục không đúng mẫu: img/tours, img/destinations/…, img/venues, img/food, img/fleet, img/experiences, img/menus/…"] };
  }
  const named = safeImageName(payload && payload.filename);
  if (!named) return { errors: ["Chỉ nhận ảnh jpg, png, webp hoặc gif."] };
  const buf = Buffer.from(String((payload && payload.data) || "").replace(/\s/g, ""), "base64");
  if (!buf.length || buf.length > MAX_IMAGE) return { errors: ["Ảnh rỗng hoặc lớn hơn 8MB."] };
  if (!looksLikeImage(buf, named.ext)) return { errors: ["Nội dung file không phải ảnh."] };
  const dir = path.resolve(IMG_ROOT, ...folder.split("/"));
  const relDir = path.relative(IMG_ROOT, dir);
  if (relDir.startsWith("..") || path.isAbsolute(relDir)) return { errors: ["Đường dẫn không hợp lệ."] };
  fs.mkdirSync(dir, { recursive: true });
  let filename = named.stem + named.ext;
  let n = 2;
  while (fs.existsSync(path.join(dir, filename))) {
    filename = named.stem + "-" + n + named.ext;
    n += 1;
  }
  fs.writeFileSync(path.join(dir, filename), buf);
  return { src: "img/" + folder + "/" + filename };
}

function resolveFile(urlPath) {
  let rel = decodeURIComponent(urlPath.split("?")[0]);
  if (rel === "/" || rel === "") rel = "/index.html";
  if (rel.endsWith("/")) rel += "index.html";

  // Backward-compatibility: rewrite legacy /voyage/... to /...
  if (rel.startsWith("/voyage/")) {
    rel = rel.substring(7);
  }

  // 1. Check in WWWROOT first
  const fileInWww = path.resolve(WWWROOT, "." + rel);
  const fromWww = path.relative(WWWROOT, fileInWww);
  if (!fromWww.startsWith("..") && !path.isAbsolute(fromWww) && fs.existsSync(fileInWww)) {
    return fileInWww;
  }

  // 2. Check in ROOT for /admin/, etc.
  const fileInRoot = path.resolve(root, "." + rel);
  const fromRoot = path.relative(root, fileInRoot);
  if (!fromRoot.startsWith("..") && !path.isAbsolute(fromRoot) && fs.existsSync(fileInRoot)) {
    return fileInRoot;
  }

  return null;
}

function forwardToFormSubmit(booking, targetEmail) {
  return new Promise(function (resolve) {
    const payload = JSON.stringify({
      _subject: "[ĐẶT TOUR MỚI] " + (booking.tourName || "Tour") + " - Khách: " + (booking.name || "") + " (" + (booking.totalGuests || booking.guests || 2) + " khách)",
      _replyto: booking.email || "",
      _captcha: "false",
      _template: "table",
      "1. Họ và tên khách (Guest Name)": booking.name,
      "2. Số điện thoại / WhatsApp": booking.phone,
      "3. Email liên hệ": booking.email,
      "4. Tour đã chọn": booking.tourName,
      "5. Ngày khởi hành": booking.date,
      "6. Số người lớn (Adults)": booking.adults || 2,
      "7. Số trẻ em (Children)": booking.children || 0,
      "8. Tổng số người tham gia": booking.totalGuests || booking.guests || 2,
      "9. Ghi chú của khách": booking.note || "(Không có)",
      "10. Báo giá tạm tính": booking.totalStr || "Liên hệ",
      "11. Thời gian gửi": new Date().toLocaleString("vi-VN"),
      "--- MẪU EMAIL PHẢN HỒI GỬI KHÁCH ---": booking.replyTemplate || ""
    });

    const req = https.request("https://formsubmit.co/ajax/" + encodeURIComponent(targetEmail), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "https://thedahliahanoi.com",
        "Referer": "https://thedahliahanoi.com/",
        "Content-Length": Buffer.byteLength(payload)
      }
    }, function (res) {
      let data = "";
      res.on("data", function (chunk) { data += chunk; });
      res.on("end", function () {
        try {
          const parsed = JSON.parse(data);
          console.log("[Email Dispatch] Sent to", targetEmail, "-> Status:", res.statusCode, parsed);
          resolve(parsed);
        } catch (e) {
          console.log("[Email Dispatch] Raw response:", data);
          resolve({ ok: res.statusCode === 200 });
        }
      });
    });

    req.on("error", function (err) {
      console.error("[Email Dispatch] Error forwarding to FormSubmit:", err.message);
      resolve({ ok: false, error: err.message });
    });

    req.write(payload);
    req.end();
  });
}

const server = http.createServer(function (req, res) {
  const url = new URL(req.url, "http://127.0.0.1");

  if (url.pathname === "/api/catalogue" && req.method === "PUT") {
    readBody(req, MAX_CATALOGUE).then(function (raw) {
      try {
        const data = JSON.parse(raw.toString("utf8"));
        writeCatalogue(data);
        send(res, 200, JSON.stringify({ ok: true }), {
          "Content-Type": "application/json; charset=utf-8"
        });
      } catch (err) {
        send(res, 400, JSON.stringify({ ok: false, errors: err.errors || [err.message] }), {
          "Content-Type": "application/json; charset=utf-8"
        });
      }
    }).catch(function (err) {
      send(res, 413, JSON.stringify({ ok: false, errors: [err.message || "Không đọc được dữ liệu."] }), {
        "Content-Type": "application/json; charset=utf-8"
      });
    });
    return;
  }

  if (url.pathname === "/api/upload" && req.method === "POST") {
    readBody(req, MAX_UPLOAD).then(function (raw) {
      let payload;
      try {
        payload = JSON.parse(raw.toString("utf8"));
      } catch (err) {
        send(res, 400, JSON.stringify({ ok: false, errors: ["JSON tải ảnh không hợp lệ."] }), {
          "Content-Type": "application/json; charset=utf-8"
        });
        return;
      }
      const saved = saveImage(payload);
      if (saved.errors) {
        send(res, 400, JSON.stringify({ ok: false, errors: saved.errors }), {
          "Content-Type": "application/json; charset=utf-8"
        });
        return;
      }
      send(res, 200, JSON.stringify({ ok: true, src: saved.src }), {
        "Content-Type": "application/json; charset=utf-8"
      });
    }).catch(function (err) {
      send(res, 413, JSON.stringify({ ok: false, errors: [err.message || "Không đọc được ảnh."] }), {
        "Content-Type": "application/json; charset=utf-8"
      });
    });
    return;
  }

  if (url.pathname === "/api/book" && req.method === "POST") {
    readBody(req, 1024 * 1024).then(function (raw) {
      try {
        const payload = JSON.parse(raw.toString("utf8"));
        payload.id = "BK-" + Date.now();
        payload.receivedAt = new Date().toISOString();
        
        // Save to shared/bookings.json
        const bookingFiles = [
          path.join(root, "shared", "bookings.json"),
          path.join(WWWROOT, "shared", "bookings.json")
        ];
        
        bookingFiles.forEach(function (bookingFile) {
          try {
            const dir = path.dirname(bookingFile);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            let list = [];
            if (fs.existsSync(bookingFile)) {
              try { list = JSON.parse(fs.readFileSync(bookingFile, "utf8")); } catch (e) {}
            }
            list.unshift(payload);
            fs.writeFileSync(bookingFile, JSON.stringify(list.slice(0, 500), null, 2), "utf8");
          } catch (e) {}
        });

        // Determine destination email from catalogue
        let targetEmail = "linhfromhanam03@gmail.com";
        try {
          const cat = JSON.parse(fs.readFileSync(path.join(root, "shared", "catalogue.json"), "utf8"));
          if (cat.site && cat.site.email) targetEmail = cat.site.email;
        } catch (e) {}

        // Forward email directly with verified origin
        forwardToFormSubmit(payload, targetEmail).then(function (result) {
          console.log("[Booking Dispatch Result]:", result);
        });

        send(res, 200, JSON.stringify({ ok: true, id: payload.id }), {
          "Content-Type": "application/json; charset=utf-8"
        });
      } catch (err) {
        send(res, 400, JSON.stringify({ ok: false, error: err.message }), {
          "Content-Type": "application/json; charset=utf-8"
        });
      }
    }).catch(function (err) {
      send(res, 413, JSON.stringify({ ok: false, error: err.message }), {
        "Content-Type": "application/json; charset=utf-8"
      });
    });
    return;
  }

  if (url.pathname === "/api/catalogue" && req.method === "GET") {
    fs.readFile(path.join(root, "shared", "catalogue.json"), function (err, data) {
      if (err) return send(res, 404, "Not found");
      send(res, 200, data, { "Content-Type": "application/json; charset=utf-8" });
    });
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "Method not allowed");
    return;
  }

  const file = resolveFile(url.pathname);
  if (!file) return send(res, 403, "Forbidden");
  fs.readFile(file, function (err, data) {
    if (err) return send(res, 404, "Not found");
    const ext = path.extname(file).toLowerCase();
    send(res, 200, req.method === "HEAD" ? undefined : data, {
      "Content-Type": MIME[ext] || "application/octet-stream"
    });
  });
});

server.on("error", function (err) {
  if (err.code === "EADDRINUSE") {
    console.error("\n[LỖI] Cổng " + PORT + " đang bị một server cũ chiếm dụng!");
    console.error("Cách giải phóng cổng trên PowerShell:");
    console.error("  Stop-Process -Id (Get-NetTCPConnection -LocalPort " + PORT + ").OwningProcess -Force");
    console.error("Hoặc chạy cổng khác: $env:PORT=4174; npm start\n");
    process.exit(1);
  } else {
    throw err;
  }
});

server.listen(PORT, HOST, function () {
  const shown = HOST === "0.0.0.0" || HOST === "::" ? "127.0.0.1" : HOST;
  console.log("Trang chủ: http://" + shown + ":" + PORT + "/");
  console.log("Quản trị:  http://" + shown + ":" + PORT + "/admin/");
});
