# -*- coding: utf-8 -*-
"""Replace text buffetMenu blocks with menuGallery image slots."""
from pathlib import Path
import re

path = Path(r"e:\CongViec\Job2\1.TheDahliaHaNoi\shared\data.js")
text = path.read_text(encoding="utf-8")

# Seed maps by tour id — used when we know which tour we're in
SEEDS = {
    "ha-long": {
        "title": "Thực đơn buffet",
        "titleEn": "Buffet menu",
        "images": [
            ("img/food/halong-seafood-buffet.jpg", "Buffet hải sản", "Seafood buffet"),
            ("img/food/halong-seafood-buffet-alt.jpg", "Buffet trên tàu", "Onboard buffet"),
            ("img/venues/cruise-restaurant.jpg", "Nhà hàng trên tàu", "Cruise restaurant"),
            ("img/venues/cruise-restaurant-signature.jpg", "Không gian nhà hàng", "Restaurant space"),
            ("img/destinations/ha-long/restaurant-1.jpg", "Bàn tiệc buffet", "Buffet table"),
            ("img/destinations/ha-long/restaurant-2.jpg", "Món chính", "Main dishes"),
        ],
    },
    "ha-long-signature": {
        "title": "Thực đơn Signature",
        "titleEn": "Signature menu",
        "images": [
            ("img/food/indian-set.jpg", "Set Ấn Độ", "Indian set"),
            ("img/food/halong-seafood-buffet.jpg", "Buffet Signature", "Signature buffet"),
            ("img/venues/cruise-restaurant-signature.jpg", "Nhà hàng Signature", "Signature restaurant"),
            ("img/destinations/ha-long/restaurant-4.jpg", "Món nóng", "Hot dishes"),
            ("img/destinations/ha-long/restaurant-5.jpg", "Món tráng miệng", "Dessert"),
        ],
    },
    "ha-noi": {
        "title": "Set lunch Mesdames Linh",
        "titleEn": "Mesdames Linh set lunch",
        "images": [
            ("img/venues/mesdames-linh.jpg", "Mesdames Linh", "Mesdames Linh"),
            ("img/venues/mesdames-linh-cozy.jpg", "Không gian ấm cúng", "Cozy dining"),
            ("img/food/hanoi-bun-cha.jpg", "Món Hà Nội", "Hanoi dishes"),
            ("img/food/hanoi-spring-rolls.jpg", "Nem / cuốn", "Spring rolls"),
        ],
    },
    "ha-noi-incense": {
        "title": "Set lunch Mesdames Linh",
        "titleEn": "Mesdames Linh set lunch",
        "images": [
            ("img/venues/mesdames-linh.jpg", "Mesdames Linh", "Mesdames Linh"),
            ("img/food/hanoi-spring-rolls.jpg", "Món trưa", "Lunch dishes"),
            ("img/food/hanoi-bun-cha.jpg", "Đặc sản Hà Nội", "Hanoi specialties"),
        ],
    },
}


def find_tour_id_before(text, pos):
    chunk = text[max(0, pos - 2500) : pos]
    ids = re.findall(r'id:\s*"([^"]+)"', chunk)
    return ids[-1] if ids else None


def format_gallery(seed):
    lines = [
        "      menuGallery: {",
        f'        title: "{seed["title"]}",',
        f'        titleEn: "{seed["titleEn"]}",',
        "        images: [",
    ]
    for src, alt, alt_en in seed["images"]:
        lines.append(
            f'          {{ src: "{src}", alt: "{alt}", altEn: "{alt_en}" }},'
        )
    lines.append("        ]")
    lines.append("      }")
    return "\n".join(lines)


def default_gallery(tour_id):
    # Empty slots ready for user images in img/menus/<id>-N.jpg
    return (
        "      menuGallery: {\n"
        '        title: "Thực đơn",\n'
        '        titleEn: "Menu",\n'
        "        images: [\n"
        f'          {{ src: "img/menus/{tour_id}-1.jpg", alt: "Thực đơn 1", altEn: "Menu 1" }},\n'
        f'          {{ src: "img/menus/{tour_id}-2.jpg", alt: "Thực đơn 2", altEn: "Menu 2" }},\n'
        f'          {{ src: "img/menus/{tour_id}-3.jpg", alt: "Thực đơn 3", altEn: "Menu 3" }}\n'
        "        ]\n"
        "      }"
    )


# Remove buffetMenu: { ... } by brace matching
out = []
i = 0
replaced = 0
while True:
    m = re.search(r"\n\s*buffetMenu:\s*\{", text[i:])
    if not m:
        out.append(text[i:])
        break
    start = i + m.start()
    brace_start = i + m.end() - 1  # position of {
    out.append(text[i:start])
    depth = 0
    j = brace_start
    while j < len(text):
        ch = text[j]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                j += 1
                break
        j += 1
    # skip trailing comma if present
    end = j
    if end < len(text) and text[end] == ",":
        end += 1
    tour_id = find_tour_id_before(text, start)
    seed = SEEDS.get(tour_id)
    block = format_gallery(seed) if seed else default_gallery(tour_id or "tour")
    # keep comma after block
    out.append("\n" + block + ",")
    replaced += 1
    i = end

new_text = "".join(out)
path.write_text(new_text, encoding="utf-8")
print("replaced buffetMenu -> menuGallery:", replaced)

# ensure menus folder exists
menus = Path(r"e:\CongViec\Job2\1.TheDahliaHaNoi\voyage\img\menus")
menus.mkdir(parents=True, exist_ok=True)
(menus / "README.txt").write_text(
    "Dat anh thuc don tai day, dat ten theo data.js (vd: ha-long-1.jpg, ninh-binh-1.jpg).\n",
    encoding="utf-8",
)
print("created", menus)
