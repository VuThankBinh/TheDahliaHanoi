/**
 * Turn tour photos into JPEG.
 * PNG and JPEG sources under wwwroot/img become .jpg, resized for the web.
 * Logo files live in wwwroot/assets and are left alone.
 * Docker runs this on build and again when the container starts, so a new
 * photo dropped into the mounted img folder is converted too.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const REPO = path.join(__dirname, "..");
const IMG_ROOT = path.join(REPO, "wwwroot", "img");
const PHOTO_EDGE = 1920;
const MENU_EDGE = 2400;
const PHOTO_QUALITY = 76;
const MENU_QUALITY = 82;
const MAX_KEEP = 800 * 1024;
const TEXT_EXT = new Set([".json", ".js", ".html", ".css", ".md", ".svg"]);

function walk(dir, out, test) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      walk(full, out, test);
    } else if (test(full, entry.name)) out.push(full);
  }
  return out;
}

function isMenu(file) {
  const rel = file.replace(/\\/g, "/").toLowerCase();
  return rel.includes("/menus/") || rel.includes("menu");
}

function webPath(file) {
  return path.relative(path.join(REPO, "wwwroot"), file).split(path.sep).join("/");
}

let textFiles = null;
function texts() {
  if (textFiles) return textFiles;
  textFiles = [];
  ["shared", "wwwroot", "admin"].forEach(function (name) {
    walk(path.join(REPO, name), textFiles, function (full) {
      if (full.startsWith(IMG_ROOT)) return false;
      return TEXT_EXT.has(path.extname(full).toLowerCase());
    });
  });
  return textFiles;
}

function rewriteRefs(fromPath, toPath) {
  if (!fromPath || fromPath === toPath) return;
  texts().forEach(function (file) {
    const raw = fs.readFileSync(file, "utf8");
    if (!raw.includes(fromPath)) return;
    fs.writeFileSync(file, raw.split(fromPath).join(toPath));
  });
}

function jpegDest(file) {
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  if (ext.toLowerCase() === ".jpg") return file;
  let dest = path.join(path.dirname(file), base + ".jpg");
  let n = 2;
  while (fs.existsSync(dest) && path.resolve(dest) !== path.resolve(file)) {
    dest = path.join(path.dirname(file), base + "-" + n + ".jpg");
    n += 1;
  }
  return dest;
}

function replaceWith(file, dest, output) {
  const tmp = dest + ".tmp-jpg";
  fs.writeFileSync(tmp, output);
  if (path.resolve(dest) === path.resolve(file)) fs.unlinkSync(file);
  fs.renameSync(tmp, dest);
  if (path.resolve(dest) !== path.resolve(file) && fs.existsSync(file)) fs.unlinkSync(file);
  rewriteRefs(webPath(file), webPath(dest));
}

async function convertOne(file) {
  const ext = path.extname(file).toLowerCase();
  const isJpeg = ext === ".jpg" || ext === ".jpeg";
  const input = fs.readFileSync(file);
  const menu = isMenu(file);
  const edge = menu ? MENU_EDGE : PHOTO_EDGE;
  const meta = await sharp(input, { failOn: "none" }).metadata();
  const long = Math.max(meta.width || 0, meta.height || 0);
  const dest = jpegDest(file);
  const sameFile = path.resolve(dest) === path.resolve(file);

  if (isJpeg && sameFile && long <= edge && input.length <= MAX_KEEP) {
    return { before: input.length, after: input.length, changed: false };
  }
  if (isJpeg && !sameFile && long <= edge && input.length <= MAX_KEEP) {
    fs.renameSync(file, dest);
    rewriteRefs(webPath(file), webPath(dest));
    return { before: input.length, after: input.length, changed: true, note: "renamed" };
  }

  let pipeline = sharp(input, { failOn: "none" }).rotate();
  if (!isJpeg || meta.hasAlpha) pipeline = pipeline.flatten({ background: "#ffffff" });
  const output = await pipeline
    .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: menu ? MENU_QUALITY : PHOTO_QUALITY, mozjpeg: true, progressive: true })
    .toBuffer();

  if (isJpeg && sameFile && output.length >= input.length) {
    return { before: input.length, after: input.length, changed: false };
  }

  replaceWith(file, dest, output);
  return { before: input.length, after: output.length, changed: true };
}

async function main() {
  const files = walk(IMG_ROOT, [], function (full, name) {
    return /\.(jpe?g|png)$/i.test(name) && !name.endsWith(".tmp-jpg");
  });
  let before = 0;
  let after = 0;
  let changed = 0;
  for (const file of files) {
    try {
      const result = await convertOne(file);
      before += result.before;
      after += result.after;
      if (!result.changed) continue;
      changed += 1;
      console.log(
        webPath(file) +
          "  " +
          (result.before / 1024).toFixed(0) +
          " KB -> " +
          (result.after / 1024).toFixed(0) +
          " KB" +
          (result.note ? " (" + result.note + ")" : "")
      );
    } catch (err) {
      console.error(webPath(file) + ": " + err.message);
    }
  }
  console.log(
    "Images: " +
      changed +
      "/" +
      files.length +
      " converted. " +
      (before / 1024 / 1024).toFixed(1) +
      " MB -> " +
      (after / 1024 / 1024).toFixed(1) +
      " MB"
  );
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
