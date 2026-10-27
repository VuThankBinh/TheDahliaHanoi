/**
 * Máy chủ local: trang Voyage + API ghi đè catalogue.
 * Chỉ lắng nghe 127.0.0.1. Chạy: npm start
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { writeCatalogue, ROOT } = require("./tools/catalogue-io");

const PORT = Number(process.env.PORT) || 4173;
const HOST = "127.0.0.1";
const root = path.resolve(ROOT);
const MAX_BODY = 8 * 1024 * 1024;

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

function resolveFile(urlPath) {
  let rel = decodeURIComponent(urlPath.split("?")[0]);
  if (rel === "/") rel = "/index.html";
  if (rel.endsWith("/")) rel += "index.html";
  const file = path.resolve(root, "." + rel);
  const fromRoot = path.relative(root, file);
  if (fromRoot.startsWith("..") || path.isAbsolute(fromRoot)) return null;
  return file;
}

const server = http.createServer(function (req, res) {
  const url = new URL(req.url, "http://127.0.0.1");

  if (url.pathname === "/api/catalogue" && req.method === "PUT") {
    const chunks = [];
    let size = 0;
    req.on("data", function (chunk) {
      size += chunk.length;
      if (size > MAX_BODY) {
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", function () {
      try {
        const data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        writeCatalogue(data);
        send(res, 200, JSON.stringify({ ok: true }), {
          "Content-Type": "application/json; charset=utf-8"
        });
      } catch (err) {
        send(res, 400, JSON.stringify({ ok: false, errors: err.errors || [err.message] }), {
          "Content-Type": "application/json; charset=utf-8"
        });
      }
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

server.listen(PORT, HOST, function () {
  console.log("Quản trị: http://" + HOST + ":" + PORT + "/admin/");
  console.log("Trang tour: http://" + HOST + ":" + PORT + "/voyage/");
});
