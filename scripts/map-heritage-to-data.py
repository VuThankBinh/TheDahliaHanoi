# Map downloaded Heritage assets onto the exact paths referenced by shared/data.js
import json, shutil, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(r"e:\CongViec\Job2\1.TheDahliaHaNoi")
IMG = ROOT / "voyage" / "img"
MAN = IMG / "heritage-download-manifest.json"
BASE = "https://heritagevietnamtravel.com"
UA = "Mozilla/5.0"

manifest = json.loads(MAN.read_text(encoding="utf-8"))
ok = [m for m in manifest if m["status"] == "ok"]

# Build lookup by remote path fragment
by_remote = {}
for m in ok:
    by_remote[m["url"]] = IMG / m["local"].replace("img/", "")

def find_local(*parts):
    """Find first download whose URL/page/local contains all parts (case-insensitive)."""
    parts = [p.lower() for p in parts]
    for m in ok:
        blob = " ".join([m.get("url", ""), m.get("page", ""), m.get("local", "")]).lower()
        blob = blob.replace("ninhbinh", "ninh-binh")
        if all(p in blob for p in parts):
            p = IMG / m["local"].replace("img/", "")
            if p.exists() and p.stat().st_size > 20000:
                return p
    return None

def download_encoded(url, dest: Path):
    dest.parent.mkdir(parents=True, exist_ok=True)
    # encode spaces in path
    parsed = urllib.parse.urlsplit(url)
    path = urllib.parse.quote(parsed.path)
    enc = urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, path, parsed.query, parsed.fragment))
    req = urllib.request.Request(enc, headers={"User-Agent": UA, "Referer": BASE + "/"})
    with urllib.request.urlopen(req, timeout=40) as r:
        data = r.read()
    if len(data) < 5000:
        raise RuntimeError("too small")
    dest.write_bytes(data)
    return len(data)

# Explicit mapping: data.js path -> search tokens in remote URL OR direct remote URL
MAP = {
    # Ha Long destinations
    "destinations/ha-long/bay-overview.jpg": [("gallery-halong", "overview-1"), ("banner", "homee-new"), ("banner", "home")],
    "destinations/ha-long/titov-beach.jpg": [("gallery-halong", "act-2"), ("gallery-halong", "4"), ("gallery-halong", "act-1")],
    "destinations/ha-long/sung-sot-cave.jpg": [("gallery-halong", "act-3"), ("gallery-halong", "act-4")],
    "destinations/ha-long/luon-cave.jpg": [("gallery-halong", "act-5"), ("gallery-halong", "act-6")],
    "destinations/ha-long/tuan-chau-port.jpg": [("gallery-halong", "overview-2"), ("gallery-halong", "overview-3")],
    "destinations/ha-long/kissing-rocks.jpg": [("gallery-halong", "overview-4"), ("gallery-halong", "overview-5")],

    # Ninh Binh
    "destinations/ninh-binh/tam-coc-boat.jpg": [("tamcoc",), ("tam-coc",), ("ninh-binh", "1")],
    "destinations/ninh-binh/tam-coc-rice.jpg": [("tamcoc", "bichdong"), ("ninh-binh", "2")],
    "destinations/ninh-binh/trang-an-boat.jpg": [("trang",), ("ninh-binh", "3")],
    "destinations/ninh-binh/trang-an-cave.jpg": [("ninh-binh", "4")],
    "destinations/ninh-binh/hoa-lu.jpg": [("hoalu",), ("hoa-lu",), ("ninh-binh", "5")],
    "destinations/ninh-binh/mua-cave-peak.jpg": [("mua",), ("ninh-binh", "6")],
    "destinations/ninh-binh/mua-cave-steps.jpg": [("ninh-binh", "7")],
    "destinations/ninh-binh/bich-dong.jpg": [("bich",), ("ninh-binh", "8")],
    "destinations/ninh-binh/thung-nham.jpg": [("thung",), ("ninh-binh", "9")],
    "destinations/ninh-binh/cuc-phuong.jpg": [("cuc",), ("ninh-binh", "1-5")],
    "destinations/ninh-binh/thai-vi.jpg": [("ninh-binh", "2-5")],

    # Hanoi
    "destinations/hanoi/tran-quoc-pagoda.jpg": [("hanoi", "1"), ("banner", "home6")],
    "destinations/hanoi/temple-of-literature.jpg": [("hanoi", "2")],
    "destinations/hanoi/old-quarter.jpg": [("hanoi", "3")],
    "destinations/hanoi/incense-village.jpg": [("incense",), ("hanoi", "4")],
    "destinations/hanoi/incense-aerial.jpg": [("hanoi", "5")],
    "destinations/hanoi/ho-chi-minh-mausoleum.jpg": [("hanoi", "6")],
    "destinations/hanoi/one-pillar-pagoda.jpg": [("hanoi", "1-2")],
    "destinations/hanoi/hoa-lo-prison.jpg": [("hanoi", "2-2")],

    # Venues / cruise
    "venues/cruise-exterior.jpg": [("gallery-halong", "1"), ("heritage-luxury",), ("overview-1",)],
    "venues/cruise-sundeck.jpg": [("sundeck-1",), ("sundeck",)],
    "venues/cruise-jacuzzi.jpg": [("gallery-halong", "act-6"), ("sundeck-2",)],
    "venues/cruise-restaurant.jpg": [("restaurant-1",), ("restaurant",)],
    "venues/cruise-lounge.jpg": [("sofa1",), ("sofa",)],
    "venues/heritage-garden.jpg": [("ninh-binh", "3-4"), ("garden",)],
    "venues/heritage-garden-pool.jpg": [("ninh-binh", "4-4")],
    "venues/heritage-garden-restaurant.jpg": [("ninh-binh", "5-4")],
    "venues/mesdames-linh.jpg": [("hanoi", "3-2"), ("hanoi", "4")],
    "venues/mesdames-linh-cozy.jpg": [("hanoi", "4-2")],

    # Fleet
    "fleet/limousine-mid.jpg": [("car-1",), ("fleet", "1")],
    "fleet/dcar-limousine.jpg": [("car-2",), ("fleet", "2")],
    "fleet/shuttle-bus.jpg": [("car-3",), ("fleet", "3"), ("ttransportation",)],

    # Food / experiences
    "food/halong-seafood-buffet.jpg": [("restaurant-2",), ("restaurant-3",)],
    "food/ninh-binh-goat.jpg": [("ninh-binh", "6-4")],
    "food/ninh-binh-com-chay.jpg": [("ninh-binh", "7-4")],
    "food/hanoi-bun-cha.jpg": [("hanoi", "5")],
    "food/hanoi-spring-rolls.jpg": [("hanoi", "6")],
    "food/indian-set.jpg": [("restaurant-4",)],
    "experiences/kayak.jpg": [("act-5",), ("act-4",)],
    "experiences/sampan-rowing.jpg": [("act-1",)],
    "experiences/sunset-party.jpg": [("sundeck-3",), ("sundeck-4",)],
    "experiences/cycling-village.jpg": [("ninh-binh", "8-4")],
    "experiences/mua-climbing.jpg": [("ninh-binh", "7")],

    # Tour covers — use strong destination/gallery images
    "tours/ha-long.jpg": [("gallery-halong", "1"), ("overview-1",)],
    "tours/ha-long-signature.jpg": [("gallery-halong", "2"), ("sundeck-1",)],
    "tours/ninh-binh.jpg": [("ninh-binh", "1"), ("tamcoc",)],
    "tours/ninh-binh-tam-coc.jpg": [("tamcoc",), ("ninh-binh", "2")],
    "tours/ninh-binh-bai-dinh.jpg": [("ninh-binh", "3")],
    "tours/ninh-binh-bai-dinh-trang-an.jpg": [("ninh-binh", "4")],
    "tours/ninh-binh-2d1n.jpg": [("ninh-binh", "5")],
    "tours/ninh-binh-2d1n-pagoda.jpg": [("ninh-binh", "6")],
    "tours/ninh-binh-2d1n-cuc-phuong.jpg": [("ninh-binh", "1-5"), ("ninh-binh", "7")],
    "tours/ninh-binh-2d1n-halong.jpg": [("gallery-halong", "3"), ("ninh-binh", "8")],
    "tours/ninh-binh-thung-nham.jpg": [("ninh-binh", "9"), ("thung",)],
    "tours/ninh-binh-incense.jpg": [("hanoi", "4"), ("incense",)],
    "tours/ha-noi.jpg": [("hanoi", "1")],
    "tours/ha-noi-half.jpg": [("hanoi", "2")],
    "tours/ha-noi-incense.jpg": [("hanoi", "4"), ("hanoi", "5")],
}

# Retry space URLs from Signature cruise
RETRY = [
    ("/UploadFile/Heritage-Signature-Cruise/RESTAURANT-1ST FLOOR/a1.jpg", "venues/cruise-restaurant-signature.jpg"),
    ("/UploadFile/Heritage-Signature-Cruise/RESTAURANT-1ST FLOOR/a3.jpg", "food/halong-seafood-buffet-alt.jpg"),
    ("/UploadFile/Heritage-Signature-Cruise/RESTAURANT-2ND FLOOR/a10.jpg", "venues/cruise-lounge-signature.jpg"),
]

copied = 0
missing = []
for dest_rel, trials in MAP.items():
    dest = IMG / dest_rel
    src = None
    for tokens in trials:
        src = find_local(*tokens)
        if src:
            break
    if not src:
        missing.append(dest_rel)
        continue
    if src.resolve() == dest.resolve():
        print("keep", dest_rel)
        continue
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)
    copied += 1
    print("map", src.name, "->", dest_rel)

for remote, local in RETRY:
    dest = IMG / local
    try:
        n = download_encoded(BASE + remote, dest)
        print("retry ok", n, local)
    except Exception as e:
        print("retry fail", local, e)

# Also save a curated heritage folder index
index = {
    "copied": copied,
    "missing": missing,
    "note": "Images downloaded from heritagevietnamtravel.com and mapped onto data.js paths."
}
(IMG / "heritage-map-report.json").write_text(json.dumps(index, indent=2), encoding="utf-8")
print("DONE copied", copied, "missing", len(missing))
if missing:
    print("MISSING:")
    for m in missing:
        print(" ", m)
