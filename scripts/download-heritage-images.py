# Crawl Heritage Vietnam Travel and download images matching Voyage data paths.
import re, json, os, time, urllib.request, urllib.error
from pathlib import Path
from html import unescape

ROOT = Path(r"e:\CongViec\Job2\1.TheDahliaHaNoi")
OUT = ROOT / "voyage" / "img"
BASE = "https://heritagevietnamtravel.com"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

PAGES = [
    "/",
    "/gallery.html",
    "/hanoi-daily-tour.html",
    "/halong-bay-1-day-tour.html",
    "/ninh-binh-tours.html",
    "/ninh-binh-tours/one-day-tours.html",
    "/ninh-binh-tours/2-day-1-night-tours.html",
    "/our-transportation.html",
    "/ninh-binh-tours/hoa-lu-tam-coc-trang-an-mua-cave-full-day-tour.html",
    "/ninh-binh-tours/hoa-lu-tam-coc-trang-an-full-day-tour.html",
    "/ninh-binh-tours/bai-dinh-trang-an-mua-cave-full-day-tour.html",
    "/ninh-binh-tours/bai-dinh-trang-an-full-day-tour.html",
    "/ninh-binh-tours/tam-coc-bich-dong-thung-nham.html",
    "/ninh-binh-tours/discover-the-ninh-binh-ancient-capital.html",
    "/ninh-binh-tours/discover-ancient-capital-pagoda-of-ninh-binh.html",
    "/ninh-binh-tours/discover-ancient-capital-cuc-phuong-national-park.html",
    "/ninh-binh-tours/discover-ancient-capital-halong-bay-luxury-day-cruise.html",
    "/travel-guide/best-time-to-visit-ninh-binh-seasons-of-natural-splendor.html",
    "/travel-guide/ninh-binh-where-nature-and-history-converge-geography-and-location.html",
    "/travel-guide/ninh-binh-s-natural-wonders-a-symphony-of-spectacular-landscapes.html",
]

# Map remote URL keywords / page context -> local relative path under voyage/img
# Prefer explicit overrides for key assets used in shared/data.js
TARGET_MAP = [
    # banners / hero posters
    (r"Banner/home", "destinations/ha-long/bay-overview.jpg"),
    (r"Banner/home5", "destinations/ninh-binh/tam-coc-boat.jpg"),
    (r"Banner/home6", "destinations/hanoi/tran-quoc-pagoda.jpg"),
    (r"Banner/homee-new", "destinations/ha-long/bay-overview.jpg"),
]

KEYWORD_RULES = [
    # Ha Long
    (["halong", "ha-long", "ha_long", "titop", "titov", "sung-sot", "sung sot", "luon", "tuan-chau", "cruise", "junk"], "ha-long"),
    # Ninh Binh
    (["ninh", "tam-coc", "tam coc", "trang-an", "trang an", "hoa-lu", "hoa lu", "bai-dinh", "bai dinh", "mua", "cuc-phuong", "cuc phuong", "thung-nham", "bich-dong", "bich dong"], "ninh-binh"),
    # Hanoi
    (["hanoi", "ha-noi", "tran-quoc", "van-mieu", "literature", "incense", "quang-phu", "old-quarter", "hoa-lo"], "hanoi"),
    # venues / fleet / food
    (["limousine", "dcar", "shuttle", "transport", "bus"], "fleet"),
    (["buffet", "food", "seafood", "cuisine", "mesdames", "lunch", "dinner"], "food"),
    (["garden", "jacuzzi", "sundeck", "deck", "cabin", "restaurant", "venue"], "venues"),
    (["kayak", "sampan", "bike", "cycl", "climb", "sunset"], "experiences"),
]

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": BASE + "/"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read()

def abs_url(u):
    u = unescape(u.strip().strip("'\""))
    if not u or u.startswith("data:"):
        return None
    if u.startswith("//"):
        return "https:" + u
    if u.startswith("/"):
        return BASE + u
    if u.startswith("http"):
        return u
    return BASE + "/" + u.lstrip("./")

def extract_images(html):
    found = set()
    patterns = [
        r'(?:src|data-src|data-lazy-src|data-original|href)=["\']([^"\']+\.(?:jpg|jpeg|png|webp)(?:\?[^"\']*)?)["\']',
        r'url\((["\']?)([^)"\']+\.(?:jpg|jpeg|png|webp)(?:\?[^)"\']*)?)\1\)',
        r'background-image:\s*url\(["\']?([^)"\']+)["\']?\)',
    ]
    for pat in patterns:
        for m in re.finditer(pat, html, re.I):
            g = m.group(m.lastindex)
            u = abs_url(g)
            if u and any(x in u.lower() for x in (".jpg", ".jpeg", ".png", ".webp")):
                if "logo" in u.lower() and "upload" not in u.lower():
                    continue
                if any(skip in u.lower() for skip in ("en.png", "vn.png", "vi.png", "icon", "favicon", "payment.png")):
                    continue
                found.add(u.split("?")[0])
    return found

def score_path(url, page):
    u = url.lower()
    p = page.lower()
    # local folder guess
    folder = "tours"
    for keys, fold in KEYWORD_RULES:
        if any(k in u or k in p for k in keys):
            folder = fold
            break
    name = re.sub(r"[^a-z0-9]+", "-", Path(urllib.request.url2pathname(url.split("/")[-1])).stem.lower()).strip("-")
    if not name:
        name = "image"
    if folder == "ha-long":
        return f"destinations/ha-long/{name}.jpg"
    if folder == "ninh-binh":
        return f"destinations/ninh-binh/{name}.jpg"
    if folder == "hanoi":
        return f"destinations/hanoi/{name}.jpg"
    return f"{folder}/{name}.jpg"

def force_map(url):
    for pat, dest in TARGET_MAP:
        if re.search(pat, url, re.I):
            return dest
    return None

def download(url, dest: Path):
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        data = fetch(url)
        if len(data) < 5000:
            return False, "too-small"
        dest.write_bytes(data)
        return True, len(data)
    except Exception as e:
        return False, str(e)

def main():
    all_imgs = {}  # url -> set(pages)
    for path in PAGES:
        url = BASE + path
        print("PAGE", url)
        try:
            html = fetch(url).decode("utf-8", "ignore")
        except Exception as e:
            print("  fail", e)
            continue
        imgs = extract_images(html)
        print("  images", len(imgs))
        for img in imgs:
            all_imgs.setdefault(img, set()).add(path)
        # discover more tour links
        for m in re.finditer(r'href=["\']([^"\']+\.html)["\']', html, re.I):
            href = m.group(1)
            if any(x in href.lower() for x in ("halong", "ha-long", "ninh", "hanoi", "gallery", "transport", "cruise", "luxury", "signature")):
                full = abs_url(href)
                if full and full.startswith(BASE):
                    rel = full.replace(BASE, "")
                    if rel not in PAGES and rel.count("/") <= 3:
                        PAGES.append(rel)
        time.sleep(0.25)

    # Deduplicate by filename stem, prefer larger later
    plan = []
    used_local = set()
    for url, pages in sorted(all_imgs.items()):
        local = force_map(url) or score_path(url, " ".join(pages))
        # avoid overwriting distinct files with same forced name from different sources — allow force map overwrite
        if local in used_local and not force_map(url):
            stem = Path(local).stem
            parent = Path(local).parent
            i = 2
            while f"{parent}/{stem}-{i}.jpg".replace("\\", "/") in used_local:
                i += 1
            local = f"{parent}/{stem}-{i}.jpg".replace("\\", "/")
        used_local.add(local)
        plan.append((url, local, sorted(pages)[0]))

    manifest = []
    ok = 0
    for url, local, page in plan:
        dest = OUT / local
        # Skip tiny icon-like paths
        if any(x in url.lower() for x in ("money-back", "best-price", "customizable", "/icons/")):
            continue
        success, info = download(url, dest)
        status = "ok" if success else "fail"
        if success:
            ok += 1
        print(status, info, "->", local)
        manifest.append({"url": url, "local": "img/" + local.replace("\\", "/"), "page": page, "status": status, "info": info})
        time.sleep(0.15)

    man_path = OUT / "heritage-download-manifest.json"
    man_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print("DONE", ok, "/", len(manifest), "manifest", man_path)

if __name__ == "__main__":
    main()
