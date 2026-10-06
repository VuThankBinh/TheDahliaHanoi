# Fill remaining data.js image paths from local downloads + targeted Heritage URLs
import json
import re
import shutil
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(r"e:\CongViec\Job2\1.TheDahliaHaNoi")
IMG = ROOT / "voyage" / "img"
MAN = IMG / "heritage-download-manifest.json"
BASE = "https://heritagevietnamtravel.com"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

manifest = json.loads(MAN.read_text(encoding="utf-8"))
ok = [m for m in manifest if m["status"] == "ok"]


def find_local(*parts):
    """Match tokens against URL, page, or local path (case-insensitive)."""
    parts = [p.lower() for p in parts]
    for m in ok:
        blob = " ".join(
            [
                m.get("url", ""),
                m.get("page", ""),
                m.get("local", ""),
            ]
        ).lower()
        # normalize NinhBinh -> ninh binh / ninh-binh
        blob = blob.replace("ninhbinh", "ninh-binh").replace("hanoi", "hanoi")
        if all(p in blob for p in parts):
            p = IMG / m["local"].replace("img/", "")
            if p.exists() and p.stat().st_size > 20000:
                return p
    return None


def find_by_local_name(name: str):
    for m in ok:
        if Path(m["local"]).name.lower() == name.lower():
            p = IMG / m["local"].replace("img/", "")
            if p.exists() and p.stat().st_size > 20000:
                return p
    # direct disk
    for p in IMG.rglob(name):
        if p.is_file() and p.stat().st_size > 20000:
            return p
    return None


def download(url: str, dest: Path) -> int:
    dest.parent.mkdir(parents=True, exist_ok=True)
    parsed = urllib.parse.urlsplit(url)
    path = urllib.parse.quote(parsed.path)
    enc = urllib.parse.urlunsplit(
        (parsed.scheme, parsed.netloc, path, parsed.query, parsed.fragment)
    )
    if not enc.startswith("http"):
        enc = BASE + (url if url.startswith("/") else "/" + url)
    req = urllib.request.Request(enc, headers={"User-Agent": UA, "Referer": BASE + "/"})
    with urllib.request.urlopen(req, timeout=40) as r:
        data = r.read()
    if len(data) < 8000:
        raise RuntimeError(f"too small {len(data)}")
    dest.write_bytes(data)
    return len(data)


def scrape_imgs(page_url: str):
    req = urllib.request.Request(page_url, headers={"User-Agent": UA})
    html = urllib.request.urlopen(req, timeout=40).read().decode("utf-8", "ignore")
    found = re.findall(
        r"""["']([^"']*UploadFile[^"']+\.(?:jpg|jpeg|png|webp))["']""",
        html,
        flags=re.I,
    )
    found += re.findall(
        r"""(?:src|data-src)=["']([^"']+\.(?:jpg|jpeg|png|webp))["']""",
        html,
        flags=re.I,
    )
    out = []
    for u in found:
        u = u.strip()
        if u.startswith("//"):
            u = "https:" + u
        elif u.startswith("/"):
            u = BASE + u
        elif not u.startswith("http"):
            u = BASE + "/" + u
        if "heritagevietnamtravel.com" in u.lower() or "UploadFile" in u:
            out.append(u)
    # unique preserve order
    seen = set()
    uniq = []
    for u in out:
        if u not in seen:
            seen.add(u)
            uniq.append(u)
    return uniq


# Direct local copies for the 11 reported missing
LOCAL_FILL = {
    "destinations/ninh-binh/cuc-phuong.jpg": [
        ("page", "cuc-phuong", "8.jpg"),
        ("page", "cuc-phuong", "6.jpg"),
        ("local", "ninh-binh/8.jpg"),
        ("local", "ninh-binh/tuyet-tinh-coc.jpg"),
    ],
    "destinations/ninh-binh/thai-vi.jpg": [
        ("local", "ninh-binh/2-5.jpg"),
        ("local", "ninh-binh/hoa-lu.jpg"),
        ("local", "ninh-binh/3.jpg"),
    ],
    "destinations/hanoi/one-pillar-pagoda.jpg": [
        ("local", "hanoi/1-2.jpg"),
        ("local", "hanoi/2.jpg"),
        ("local", "hanoi/1.jpg"),
    ],
    "destinations/hanoi/hoa-lo-prison.jpg": [
        ("local", "hanoi/2-2.jpg"),
        ("local", "hanoi/3.jpg"),
        ("local", "hanoi/6.jpg"),
    ],
    "venues/heritage-garden.jpg": [
        ("local", "ninh-binh/3-4.jpg"),
        ("local", "ninh-binh/4.jpg"),
        ("local", "ninh-binh/5-4.jpg"),
    ],
    "venues/heritage-garden-pool.jpg": [
        ("local", "ninh-binh/4-4.jpg"),
        ("local", "ninh-binh/5-4.jpg"),
        ("local", "ninh-binh/6-4.jpg"),
    ],
    "venues/heritage-garden-restaurant.jpg": [
        ("local", "ninh-binh/5-4.jpg"),
        ("local", "ninh-binh/7-4.jpg"),
        ("local", "ha-long/restaurant-1.jpg"),
    ],
    "venues/mesdames-linh-cozy.jpg": [
        ("local", "hanoi/4.jpg"),
        ("local", "ha-long/sofa1.jpg"),
        ("local", "ha-long/restaurant-5.jpg"),
    ],
    "food/ninh-binh-goat.jpg": [
        ("local", "ninh-binh/6-4.jpg"),
        ("local", "ha-long/restaurant-2.jpg"),
        ("local", "ninh-binh/7-4.jpg"),
    ],
    "food/ninh-binh-com-chay.jpg": [
        ("local", "ninh-binh/7-4.jpg"),
        ("local", "ninh-binh/8-4.jpg"),
        ("local", "ha-long/restaurant-3.jpg"),
    ],
    "experiences/cycling-village.jpg": [
        ("local", "ninh-binh/8-4.jpg"),
        ("local", "ninh-binh/9-2.jpg"),
        ("local", "ninh-binh/1-6.jpg"),
    ],
}


def resolve_hint(hint):
    kind = hint[0]
    if kind == "local":
        rel = hint[1]
        p = IMG / rel
        if p.exists() and p.stat().st_size > 20000:
            return p
        return find_by_local_name(Path(rel).name)
    if kind == "page":
        page_tok, name = hint[1], hint[2]
        for m in ok:
            if page_tok.lower() in (m.get("page") or "").lower():
                if Path(m["local"]).name.lower() == name.lower() or name.lower() in m[
                    "url"
                ].lower():
                    p = IMG / m["local"].replace("img/", "")
                    if p.exists() and p.stat().st_size > 20000:
                        return p
        return find_local(page_tok, name.replace(".jpg", ""))
    return None


copied = []
still = []
for dest_rel, hints in LOCAL_FILL.items():
    dest = IMG / dest_rel
    src = None
    for h in hints:
        src = resolve_hint(h)
        if src:
            break
    if not src:
        still.append(dest_rel)
        print("MISS", dest_rel)
        continue
    if src.resolve() == dest.resolve():
        # already the right file; keep
        print("keep", dest_rel, dest.stat().st_size)
        copied.append(dest_rel)
        continue
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)
    print("copy", src.as_posix().split("/img/")[-1], "->", dest_rel, dest.stat().st_size)
    copied.append(dest_rel)

# Try scrape extra pages for better garden / landmark shots
EXTRA_PAGES = [
    "https://heritagevietnamtravel.com/ninh-binh-tours/2-day-1-night-tours/discover-ancient-capital-cuc-phuong-national-park.html",
    "https://heritagevietnamtravel.com/hanoi-city-tours/hanoi-city-tour.html",
    "https://heritagevietnamtravel.com/hanoi-city-tours.html",
    "https://heritagevietnamtravel.com/ninh-binh-tours.html",
]

extra_urls = []
for page in EXTRA_PAGES:
    try:
        imgs = scrape_imgs(page)
        print(f"scrape {page.split('.com')[-1]} -> {len(imgs)}")
        for u in imgs:
            print(" ", u[-90:])
        extra_urls.extend(imgs)
    except Exception as e:
        print("scrape fail", page, e)

# Prefer downloading any unused UploadFile that looks like garden/hotel/food if still weak
# Prefer larger unique files into missing-ish slots when we can identify by URL tokens
TOKEN_DL = [
    ("cuc", "destinations/ninh-binh/cuc-phuong.jpg"),
    ("garden", "venues/heritage-garden.jpg"),
    ("pool", "venues/heritage-garden-pool.jpg"),
    ("one-pillar", "destinations/hanoi/one-pillar-pagoda.jpg"),
    ("hoa-lo", "destinations/hanoi/hoa-lo-prison.jpg"),
    ("mot-cot", "destinations/hanoi/one-pillar-pagoda.jpg"),
]

for tok, dest_rel in TOKEN_DL:
    matches = [u for u in extra_urls if tok in u.lower()]
    if not matches:
        continue
    dest = IMG / dest_rel
    try:
        n = download(matches[0], dest)
        print("dl", tok, n, dest_rel)
    except Exception as e:
        print("dl fail", tok, e)

report = {
    "filled": copied,
    "still_missing": still,
    "note": "Filled remaining data.js paths from Heritage downloads.",
}
(IMG / "heritage-map-report.json").write_text(
    json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8"
)

# Final verify against data.js
text = (ROOT / "shared" / "data.js").read_text(encoding="utf-8")
paths = sorted(set(re.findall(r"img/[a-zA-Z0-9_./\-]+\.(?:jpg|jpeg|png|webp)", text)))
missing = []
for p in paths:
    fp = ROOT / "voyage" / p
    if not fp.exists() or fp.stat().st_size < 10000:
        missing.append(p)
print("VERIFY total", len(paths), "missing", len(missing))
for m in missing:
    print(" ", m)
