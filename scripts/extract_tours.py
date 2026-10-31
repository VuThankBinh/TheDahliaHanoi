#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
extract_tours.py
Scans ./raw_docs (Hanoi City Tour & Sapa Tour documents and images)
Extracts structured bilingual tour information
Outputs tours.json conforming to shared/data.js schema
Strictly isolates photos by folder:
  - Hanoi Craft Village tours -> raw_docs/.../Tour Làng nghề (Ảnh Hoạt Động + Menu)
  - Hanoi Traditional tours   -> raw_docs/.../Tour truyền thống (Ảnh Hoạt Động + Set Menu)
  - Sapa tours                -> sapa-placeholder.jpg
Extracts & formats complete pricing, add-ons, surcharges, and child policies.
"""

import os
import glob
import re
import json
import shutil
import docx
import sys

# Ensure UTF-8 output on Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DOCS = os.path.join(ROOT_DIR, "raw_docs")
VOYAGE_DIR = os.path.join(ROOT_DIR, "voyage")
OUTPUT_JSON = os.path.join(ROOT_DIR, "tours.json")

# Helpers
def clean_str(s):
    if not s:
        return ""
    s = s.replace("\xa0", " ").strip()
    s = re.sub(r"\s+", " ", s)
    return s.strip()

def strip_bullet(s):
    s = clean_str(s)
    s = re.sub(r"^[•\-\*–—\d\.\)]+\s*", "", s)
    return s.strip()

# -------------------------------------------------------------
# Copy images and prepare media assets with strict folder isolation
# -------------------------------------------------------------
def setup_images():
    craft_src = os.path.join(RAW_DOCS, "6. Hà Nội City Tour", "Tour Làng nghề", "Ảnh Hoạt Động")
    craft_menu_src = os.path.join(RAW_DOCS, "6. Hà Nội City Tour", "Tour Làng nghề", "Menu", "Set Menu.jpg")
    trad_src = os.path.join(RAW_DOCS, "6. Hà Nội City Tour", "Tour truyền thống", "Ảnh Hoạt Động")
    trad_menu_src = os.path.join(RAW_DOCS, "6. Hà Nội City Tour", "Tour truyền thống", "Set Menu", "Set Menu.jpg")

    craft_dest = os.path.join(VOYAGE_DIR, "img", "tours", "hanoi-craft")
    trad_dest = os.path.join(VOYAGE_DIR, "img", "tours", "hanoi-traditional")
    os.makedirs(craft_dest, exist_ok=True)
    os.makedirs(trad_dest, exist_ok=True)

    # 1. Hanoi Craft images (Strictly from Tour Làng nghề)
    craft_images = []
    if os.path.exists(craft_src):
        for img in sorted(os.listdir(craft_src)):
            if img.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                s_path = os.path.join(craft_src, img)
                d_path = os.path.join(craft_dest, img)
                if not os.path.exists(d_path) or os.path.getsize(d_path) != os.path.getsize(s_path):
                    shutil.copy2(s_path, d_path)
                craft_images.append(f"img/tours/hanoi-craft/{img}")

    if os.path.exists(craft_menu_src):
        d_path = os.path.join(craft_dest, "set-menu.jpg")
        if not os.path.exists(d_path) or os.path.getsize(d_path) != os.path.getsize(craft_menu_src):
            shutil.copy2(craft_menu_src, d_path)

    # 2. Hanoi Traditional images (Strictly from Tour truyền thống)
    trad_images = []
    if os.path.exists(trad_src):
        for img in sorted(os.listdir(trad_src)):
            if img.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                s_path = os.path.join(trad_src, img)
                d_path = os.path.join(trad_dest, img)
                if not os.path.exists(d_path) or os.path.getsize(d_path) != os.path.getsize(s_path):
                    shutil.copy2(s_path, d_path)
                trad_images.append(f"img/tours/hanoi-traditional/{img}")

    if os.path.exists(trad_menu_src):
        d_path = os.path.join(trad_dest, "set-menu.jpg")
        if not os.path.exists(d_path) or os.path.getsize(d_path) != os.path.getsize(trad_menu_src):
            shutil.copy2(trad_menu_src, d_path)

    # 3. Sapa placeholder image
    sapa_placeholder = os.path.join(VOYAGE_DIR, "img", "tours", "sapa-placeholder.jpg")
    if not os.path.exists(sapa_placeholder):
        sample_img = os.path.join(VOYAGE_DIR, "img", "destinations", "ninh-binh", "hoa-lu.jpg")
        if os.path.exists(sample_img):
            shutil.copy2(sample_img, sapa_placeholder)

    return craft_images, trad_images

# -------------------------------------------------------------
# Parser for Hanoi Craft Villages
# -------------------------------------------------------------
def parse_hanoi_craft_doc(docx_path):
    if not os.path.exists(docx_path):
        return {}
    doc = docx.Document(docx_path)
    raw_paras = [p.text.strip() for p in doc.paragraphs if p.text.strip()]

    data = {
        "title": raw_paras[0] if raw_paras else "",
        "duration": "",
        "pickup": "",
        "intro": [],
        "highlights": [],
        "itinerary": [],
        "included": [],
        "excluded": [],
        "notes": []
    }

    mode = None
    curr_step = None

    time_pattern = re.compile(r"^(\d{1,2}[:h]\d{2}(?:\s*(?:AM|PM))?(?:\s*[-–]\s*\d{1,2}[:h]\d{2}(?:\s*(?:AM|PM))?)?)\s*[-–|:]\s*(.*)$", re.I)

    for p in raw_paras:
        up = p.upper().strip()
        if (up.startswith("THỜI LƯỢNG:") or up.startswith("DURATION:")) and len(p) < 60:
            data["duration"] = p.split(":", 1)[1].strip()
            continue
        if (up.startswith("ĐIỂM ĐÓN") or up.startswith("DEPARTURE & RETURN:") or up.startswith("PICKUP")) and len(p) < 80:
            data["pickup"] = p.split(":", 1)[1].strip()
            continue
        if (up == "GIỚI THIỆU" or up.startswith("GIỚI THIỆU:") or up == "INTRODUCTION" or up.startswith("INTRODUCTION:")) and len(p) < 30:
            mode = "intro"
            continue
        if (up == "ĐIỂM NỔI BẬT" or up.startswith("ĐIỂM NỔI BẬT:") or up == "TOUR HIGHLIGHTS" or up.startswith("TOUR HIGHLIGHTS:")) and len(p) < 30:
            mode = "highlights"
            continue
        if (up.startswith("LỊCH TRÌNH") or up.startswith("HALF-DAY") or up.startswith("ITINERARY") or up.startswith("SCHEDULE")) and len(p) < 40:
            mode = "itinerary"
            continue
        if (up.startswith("BAO GỒM") or up.startswith("INCLUSION") or up.startswith("INCLUDED")) and ("KHÔNG" not in up and "EXCLUDE" not in up) and len(p) < 30:
            if curr_step:
                data["itinerary"].append(curr_step)
                curr_step = None
            mode = "included"
            continue
        if (up.startswith("KHÔNG BAO GỒM") or up.startswith("EXCLUSION") or up.startswith("EXCLUDED")) and len(p) < 30:
            mode = "excluded"
            continue
        if (up.startswith("LƯU Ý") or up.startswith("NOTE") or up.startswith("HOLIDAY SURCHARGE") or up.startswith("PHỤ THU NGÀY LỄ")) and len(p) < 50:
            mode = "notes"
            continue

        lines = p.split("\n")
        first_line = lines[0].strip()
        m = time_pattern.match(first_line)

        if m:
            mode = "itinerary"
            if curr_step:
                data["itinerary"].append(curr_step)
            curr_step = {
                "time": m.group(1).replace("h", ":").strip(),
                "title": m.group(2).strip(),
                "text": " ".join([clean_str(l) for l in lines[1:] if clean_str(l)])
            }
        elif mode == "intro":
            data["intro"].append(clean_str(p))
        elif mode == "highlights":
            for b in p.split("\n"):
                s = strip_bullet(b)
                if s: data["highlights"].append(s)
        elif mode == "itinerary":
            if curr_step:
                curr_step["text"] = (curr_step["text"] + " " + clean_str(p)).strip() if curr_step["text"] else clean_str(p)
        elif mode == "included":
            for b in p.split("\n"):
                s = strip_bullet(b)
                if s and not s.upper().startswith("BAO GỒM") and not s.upper().startswith("INCLUSION"):
                    data["included"].append(s)
        elif mode == "excluded":
            for b in p.split("\n"):
                s = strip_bullet(b)
                if s and not s.upper().startswith("KHÔNG BAO GỒM") and not s.upper().startswith("EXCLUSION"):
                    if "100.000" in s or "150.000" in s or "100,000" in s or "150,000" in s or "surcharge" in s.lower() or "phụ thu" in s.lower():
                        data["notes"].append(s)
                    else:
                        data["excluded"].append(s)
        elif mode == "notes":
            for b in p.split("\n"):
                s = strip_bullet(b)
                if s: data["notes"].append(s)

    if curr_step:
        data["itinerary"].append(curr_step)

    return data

def clean_trad_title(t, is_en=False):
    if not is_en:
        t = re.sub(r'^(Điểm đến đầu tiên,?\s*|Điểm đến tiếp theo,?\s*|Sau đó\s*|Tiếp tục\s*|HDV và xe sẽ đưa quý khách\s*|HDV sẽ đưa quý khách\s*|Xe và HDV đưa quý khách\s*|Quý khách\s*)', '', t, flags=re.I).strip()
        if re.match(r'^(thăm quan|tham quan)', t, re.I):
            t = re.sub(r'^(thăm quan|tham quan)\s*', 'Tham quan ', t, flags=re.I)
    else:
        t = re.sub(r'^(Our\s+(?:Tour\s+guide|Bus|driver)\s+(?:and\s+our\s+Bus\s+)?(?:take\s+you|pick\s+up|will\s+pick\s+you\s+up)\s+|Continue\s+to\s+|Keep\s+going\s+to\s+|We\s+will\s+)', '', t, flags=re.I).strip()
    sentences = t.split('.')
    first = sentences[0].strip()
    if len(first) > 50:
        parts = re.split(r'[,;–-]', first)
        if parts and len(parts[0].strip()) > 8:
            first = parts[0].strip()
    return first[:50]

# -------------------------------------------------------------
# Parser for Hanoi Traditional Tours
# -------------------------------------------------------------
def parse_hanoi_traditional_doc(docx_path, is_en=False):
    if not os.path.exists(docx_path):
        return {}
    doc = docx.Document(docx_path)
    paras = [clean_str(p.text) for p in doc.paragraphs if clean_str(p.text)]

    data = {
        "title": paras[0] if paras else "",
        "intro": [],
        "itinerary": [],
        "included": [],
        "excluded": [],
        "notes": []
    }

    mode = "intro"
    curr_step = None

    time_pattern = re.compile(r"^(\d{1,2}[:h]\d{2}(?:\s*[-–]\s*\d{1,2}[:h]\d{2})?)\s*[:|–-]\s*(.*)$", re.I)

    for p in paras[1:]:
        up = p.upper()
        if ("LỊCH TRÌNH" in up or "ITINERARY" in up or "SCHEDULE" in up) and len(p) < 30:
            mode = "itinerary"
            continue
        if any(up.startswith(k) for k in ["KHÔNG BAO GỒM", "EXCLUSION", "EXCLUDED", "EXCLUDE"]) and len(p) < 40:
            mode = "excluded"
            continue
        if any(up.startswith(k) for k in ["BAO GỒM", "INCLUSION", "INCLUDED", "INCLUDE"]) and ("KHÔNG" not in up and "EXCLUDE" not in up and "NOT" not in up) and len(p) < 40:
            if curr_step:
                data["itinerary"].append(curr_step)
                curr_step = None
            mode = "included"
            continue
        if up.startswith("LƯU Ý ĐẶC BIỆT") or up.startswith("SPECIAL NOTES") or up.startswith("SPECIAL NOTE:") or up == "SPECIAL NOTES":
            mode = "notes"
            continue

        if mode == "intro":
            m = time_pattern.match(p)
            if m:
                mode = "itinerary"
                raw_title = m.group(2).strip()
                curr_step = {
                    "time": m.group(1).replace("h", ":"),
                    "title": clean_trad_title(raw_title, is_en=is_en),
                    "text": raw_title
                }
            else:
                data["intro"].append(p)
        elif mode == "itinerary":
            m = time_pattern.match(p)
            if m:
                if curr_step:
                    data["itinerary"].append(curr_step)
                raw_title = m.group(2).strip()
                curr_step = {
                    "time": m.group(1).replace("h", ":"),
                    "title": clean_trad_title(raw_title, is_en=is_en),
                    "text": raw_title
                }
            elif curr_step:
                curr_step["text"] = (curr_step["text"] + " " + p).strip() if curr_step["text"] else p
            else:
                pass
        elif mode == "included":
            for b in p.split("\n"):
                s = strip_bullet(b)
                if s and not s.upper().startswith("BAO GỒM") and not s.upper().startswith("INCLUDED"):
                    data["included"].append(s)
        elif mode == "excluded":
            for b in p.split("\n"):
                s = strip_bullet(b)
                if s and not s.upper().startswith("KHÔNG BAO GỒM") and not s.upper().startswith("EXCLUDED"):
                    data["excluded"].append(s)
        elif mode == "notes":
            for b in p.split("\n"):
                s = strip_bullet(b)
                if s and not s.upper().startswith("LƯU Ý ĐẶC BIỆT") and not s.upper().startswith("SPECIAL NOTES"):
                    data["notes"].append(s)

    if curr_step:
        data["itinerary"].append(curr_step)

    return data

# -------------------------------------------------------------
# Parser for Sapa Standard Docx
# -------------------------------------------------------------
def parse_sapa_standard_doc(docx_path):
    if not os.path.exists(docx_path):
        return {}
    doc = docx.Document(docx_path)
    paras = [clean_str(p.text) for p in doc.paragraphs if clean_str(p.text)]

    data = {
        "title": "",
        "duration": "",
        "departure": "",
        "intro": [],
        "itinerary": [],
        "included": [],
        "excluded": [],
        "notes": []
    }

    mode = None
    for p in paras:
        up = p.upper()
        if "CHƯƠNG TRÌNH DU LỊCH:" in up or "TOURISM PROGRAM:" in up:
            data["title"] = p.split(":", 1)[1].strip()
            continue
        if ("THỜI GIAN:" in up or "TIME:" in up) and not data["duration"]:
            data["duration"] = p.split(":", 1)[1].strip()
            continue
        if ("KHỞI HÀNH:" in up or "DEPARTURE:" in up) and not data["departure"]:
            data["departure"] = p.split(":", 1)[1].strip()
            continue

        is_bullet = p.startswith("-") or p.startswith("•") or p.startswith("*") or p.startswith("–")
        if not is_bullet and any(k in up for k in ["GIÁ TOUR KHÔNG BAO GỒM", "KHÔNG BAO GỒM:", "NOT INCLUDE", "NOT INCLUDED", "EXCLUDE:", "EXCLUSIONS", "EXCLUDE"]):
            mode = "excluded"
            continue
        if not is_bullet and any(k in up for k in ["GIÁ BAO GỒM", "RATES INCLUDE", "INCLUDE:", "INCLUSIONS", "INCLUDED", "PRICE INCLUDE"]):
            mode = "included"
            continue
        if not is_bullet and any(k in up for k in ["GIÁ TOUR DÀNH CHO TRẺ EM", "PRICE FOR CHILDREN", "LƯU Ý:", "NOTE:"]):
            mode = "notes"
            continue

        if mode == "included":
            for b in p.split("\n"):
                s = strip_bullet(b)
                if s and not any(s.upper().startswith(x) for x in ["GIÁ BAO GỒM", "INCLUDE", "RATES INCLUDE"]):
                    data["included"].append(s)
        elif mode == "excluded":
            for b in p.split("\n"):
                s = strip_bullet(b)
                if s and not any(s.upper().startswith(x) for x in ["GIÁ TOUR KHÔNG", "EXCLUDE", "TOUR PRICE DOES NOT"]):
                    data["excluded"].append(s)
        elif mode == "notes":
            for b in p.split("\n"):
                s = strip_bullet(b)
                if s: data["notes"].append(s)
        elif mode is None and not any(k in up for k in ["KÍNH GỬI", "DEAR:", "WE ARE PLEASED"]):
            data["intro"].append(p)

    # Itinerary from tables
    current_day = ""
    for t in doc.tables:
        for r in t.rows:
            cells = [clean_str(c.text) for c in r.cells]
            if not cells or not any(cells):
                continue
            first, last = cells[0], cells[-1]
            if not first and not last:
                continue
            if "SCHEDULE" in first.upper() or "LỊCH TRÌNH" in first.upper():
                continue
            if first == last or any(k in first.upper() for k in ["DAY", "NGÀY"]):
                current_day = first.split(":")[0].strip() if ":" in first else first[:7].strip()
                continue

            time_str = first
            text_str = last
            day_prefix = current_day.replace("NGÀY 0", "Ngày ").replace("NGÀY ", "Ngày ").replace("DAY 0", "Day ").replace("DAY ", "Day ")
            display_time = f"{day_prefix} · {time_str}" if day_prefix else time_str

            title = ""
            sentences = [s.strip() for s in text_str.split(".") if s.strip()]
            if sentences:
                candidate = sentences[0]
                candidate = re.sub(r"^(Xe của\s+Công ty\s+sẽ\s+|Xe\s+đón\s+Qúy\s+khách\s+|Driver\s+will\s+pick\s+you\s+up\s+|Tour\s+guide\s+and\s+driver\s+pick\s+you\s+up\s+)", "", candidate, flags=re.I).strip()
                if len(candidate) > 55:
                    candidate = candidate[:52] + "…"
                title = candidate
            else:
                title = time_str

            data["itinerary"].append({
                "time": display_time,
                "title": title,
                "text": text_str
            })

    return data

# -------------------------------------------------------------
# Parser for Sapa Motorbike Tours (Paragraph-based)
# -------------------------------------------------------------
def parse_sapa_motorbike_doc(docx_path):
    if not os.path.exists(docx_path):
        return {}
    doc = docx.Document(docx_path)
    paras = [p.text.strip() for p in doc.paragraphs if p.text.strip()]

    data = {
        "title": clean_str(paras[0]) if paras else "",
        "duration": "",
        "intro": [],
        "itinerary": [],
        "included": [],
        "excluded": [],
        "notes": []
    }

    mode = "itinerary"
    current_day = ""
    curr_step = None

    time_pattern = re.compile(r"^(\d{1,2}[:h]\d{2}(?:\s*[-–]\s*\d{1,2}[:h]\d{2})?)\s*[:|–-]?\s*(.*)$", re.I)

    for p in paras:
        up = p.upper()
        if "TOUR SAPA" in up or "TOUR  SAPA" in up:
            data["title"] = clean_str(p)
            continue
        if "( MOTORBIKE" in up or "( 1 DAY BY MOTORBIKE" in up:
            data["intro"].append(clean_str(p))
            continue
        if up.startswith("DAY") or up.startswith("NIGHT"):
            if curr_step:
                data["itinerary"].append(curr_step)
                curr_step = None
            current_day = p.split(":")[0].strip() if ":" in p else p[:8].strip()
            continue

        # Process paragraph line by line
        lines = p.split("\n")
        for line in lines:
            line_str = clean_str(line)
            if not line_str:
                continue
            line_up = line_str.upper()

            if line_up.startswith("INCLUDE:") or line_up == "INCLUDE" or line_up.startswith("RATES INCLUDE"):
                if curr_step:
                    data["itinerary"].append(curr_step)
                    curr_step = None
                mode = "included"
                continue
            elif line_up.startswith("EXCLUDE:") or line_up == "EXCLUDE":
                if curr_step:
                    data["itinerary"].append(curr_step)
                    curr_step = None
                mode = "excluded"
                continue
            elif line_up.startswith("PRICE FOR CHILDREN:") or line_up.startswith("NOTE:"):
                mode = "notes"
                continue

            if mode == "itinerary":
                m = time_pattern.match(line_str)
                if m:
                    if curr_step:
                        data["itinerary"].append(curr_step)
                    time_val = m.group(1).replace("h", ":")
                    desc_val = m.group(2).strip()
                    day_prefix = current_day.replace("DAY 0", "Day ").replace("DAY ", "Day ").replace("NIGHT ", "Night ")
                    display_time = f"{day_prefix} · {time_val}" if day_prefix else time_val
                    curr_step = {
                        "time": display_time,
                        "title": desc_val[:45] if desc_val else time_val,
                        "text": desc_val
                    }
                elif curr_step:
                    curr_step["text"] = (curr_step["text"] + " " + line_str).strip()
            elif mode == "included":
                s = strip_bullet(line_str)
                if s and not s.upper().startswith("INCLUDE"):
                    data["included"].append(s)
            elif mode == "excluded":
                s = strip_bullet(line_str)
                if s and not s.upper().startswith("EXCLUDE"):
                    data["excluded"].append(s)
            elif mode == "notes":
                s = strip_bullet(line_str)
                if s:
                    data["notes"].append(s)

    if curr_step:
        data["itinerary"].append(curr_step)

    return data

# -------------------------------------------------------------
# Main builder function
# -------------------------------------------------------------
def build_all_tours():
    craft_imgs, trad_imgs = setup_images()
    sapa_ph = "img/tours/sapa-placeholder.jpg"

    tours = []

    # Common Child Policy for Hanoi
    hanoi_child_policy = [
        {"name": "Trẻ em dưới 5 tuổi", "nameEn": "Children under 5 years", "desc": "Miễn phí (ngồi chung ghế với bố mẹ; bố mẹ tự lo các chi phí phát sinh nếu có)", "descEn": "Free of charge (sharing seat with parents; parents cover personal expenses)"},
        {"name": "Trẻ em 5–8 tuổi", "nameEn": "Children 5–8 years", "desc": "Tính 75% giá tour (suất ăn riêng, chỗ ngồi riêng trên xe)", "descEn": "75% of tour rate (separate meal and private seat on coach)"},
        {"name": "Trẻ em từ 9 tuổi trở lên", "nameEn": "Children 9+ years", "desc": "Tính 100% như người lớn", "descEn": "Charged as adults (100%)"}
    ]

    # Common Sapa Child Policy
    sapa_child_policy = [
        {"name": "Trẻ em 1–4 tuổi", "nameEn": "Children 1–4 years", "desc": "Miễn phí (ngủ chung giường bố mẹ; 02 người lớn kèm 01 trẻ miễn phí, từ trẻ thứ 2 tính 75%)", "descEn": "Free (sharing bed with parents; 2 adults accompanied by 1 child; 2nd child charged 75%)"},
        {"name": "Trẻ em 5–8 tuổi", "nameEn": "Children 5–8 years", "desc": "Tính 75% giá tour (ăn suất riêng, ghế xe riêng, ngủ chung giường bố mẹ)", "descEn": "75% of tour price (separate meal, seat on bus, sharing bed with parents)"},
        {"name": "Trẻ em từ 9 tuổi trở lên", "nameEn": "Children 9+ years", "desc": "Tính 100% tiêu chuẩn người lớn", "descEn": "Charged as adults (100%)"}
    ]

    # =========================================================
    # 1. HANOI CRAFT VILLAGE TOURS (STRICTLY FROM Tour Làng nghề)
    # =========================================================
    
    # 1.1 Hanoi Craft - Full Day
    doc_vn = os.path.join(RAW_DOCS, "6. Hà Nội City Tour", "Tour Làng nghề", "Chương trình tour", "Tour HN City & Làng Nghề - 1 Ngày", "HN CITY TOUR & LÀNG NGHỀ 1 NGÀY(TIẾNG VIỆT).docx")
    doc_en = os.path.join(RAW_DOCS, "6. Hà Nội City Tour", "Tour Làng nghề", "Chương trình tour", "Tour HN City & Làng Nghề - 1 Ngày", "HN CITY TOUR & LÀNG NGHỀ 1 NGÀY(TIẾNG ANH).docx")
    p_vn = parse_hanoi_craft_doc(doc_vn)
    p_en = parse_hanoi_craft_doc(doc_en)

    tours.append({
        "id": "ha-noi-city-craft-1d",
        "destination": "ha-noi",
        "featured": True,
        "stars": 5,
        "name": p_vn.get("title") or "Hanoi City Tour Truyền Thống & Làng Hương - Làng Nón 1 Ngày",
        "nameEn": p_en.get("title") or "Full-Day Hanoi Cultural & Traditional Craft Villages Tour",
        "durationLabel": "1 ngày",
        "durationLabelEn": "1 day",
        "nightsOffset": 0,
        "price": 2128000,
        "priceNote": "$86 Dcar · Private từ $125/2",
        "priceNoteEn": "$86 Dcar · Private from $125/2",
        "image": craft_imgs[0] if craft_imgs else "img/tours/hanoi-craft/S1.jpg",
        "media": [{"type": "image", "src": img, "alt": "Làng nghề thủ công Hà Nội", "altEn": "Hanoi craft village tour"} for img in craft_imgs],
        "cardLine": "Hành trình kết hợp di sản văn hóa Hà Nội và hai làng nghề nổi tiếng: làng hương Quảng Phú Cầu rực rỡ và làng nón Chuông truyền thống, trải nghiệm tự làm nón lá.",
        "cardLineEn": "A full-day journey combining Hanoi cultural highlights with two famous craft villages: vibrant Quang Phu Cau incense village and traditional Chuong conical hat making.",
        "description": p_vn.get("intro") or ["Khám phá nét đẹp văn hóa của Hà Nội trong hành trình trọn ngày kết hợp danh thắng lịch sử với làng nghề truyền thống."],
        "descriptionEn": p_en.get("intro") or ["Discover the cultural heart of Hanoi on a full-day journey combining historic landmarks with countryside craftsmanship."],
        "itinerary": p_vn.get("itinerary") or [],
        "itineraryEn": p_en.get("itinerary") or [],
        "servicesIncluded": p_vn.get("included") or [],
        "servicesIncludedEn": p_en.get("included") or [],
        "servicesExcluded": p_vn.get("excluded") or [],
        "servicesExcludedEn": p_en.get("excluded") or [],
        "serviceNote": " ".join(p_vn.get("notes", [])) or "Phụ thu ngày lễ 100.000 VNĐ/khách; Tết Nguyên đán 150.000 VNĐ/khách.",
        "serviceNoteEn": " ".join(p_en.get("notes", [])) or "Holiday surcharge 100,000 VND/guest; Lunar New Year 150,000 VND/guest.",
        "offers": ["Làng hương Quảng Phú Cầu", "Làng nón Chuông & tự làm nón", "Bữa trưa đặc sản Việt Nam"],
        "offersEn": ["Quang Phu Cau Incense Village", "Chuong Conical Hat Village & workshop", "Authentic Vietnamese Lunch"],
        "pricingTable": {
            "baseRate": "2.128.000đ / khách ($86 Dcar Limousine)",
            "baseRateEn": "2,128,000 VND / guest ($86 Dcar Limousine)",
            "options": [
                {"name": "Trải nghiệm tự làm và trang trí nón lá mang về", "nameEn": "Hands-on conical hat making workshop", "price": "Đã bao gồm", "priceEn": "Included"},
                {"name": "Xe Dcar Limousine nhóm nhỏ đời mới đưa đón", "nameEn": "Small-group Dcar Limousine round-trip", "price": "Đã bao gồm", "priceEn": "Included"}
            ],
            "surcharges": [
                {"name": "Phụ thu ngày lễ (30/4, 1/5, 2/9, 31/12, 1/1)", "nameEn": "Holiday surcharge (Apr 30, May 1, Sep 2, Dec 31, Jan 1)", "price": "100.000đ / khách", "priceEn": "100,000 VND / guest"},
                {"name": "Phụ thu dịp Tết Nguyên Đán", "nameEn": "Lunar New Year surcharge", "price": "150.000đ / khách", "priceEn": "150,000 VND / guest"}
            ],
            "childPolicy": hanoi_child_policy
        },
        "menuGallery": {
            "title": "Thực đơn trưa",
            "titleEn": "Set lunch menu",
            "images": [{"src": "img/tours/hanoi-craft/set-menu.jpg", "alt": "Set menu bữa trưa làng nghề", "altEn": "Craft tour lunch set menu"}]
        }
    })

    # 1.2 Hanoi Craft - Half Day Morning
    doc_vn = os.path.join(RAW_DOCS, "6. Hà Nội City Tour", "Tour Làng nghề", "Chương trình tour", "Tour Làng Nghề - Nửa Ngày", "TOUR LÀNG NGHỀ NỬA NGÀY(BUỔI SÁNG)-TIẾNG VIỆT.docx")
    doc_en = os.path.join(RAW_DOCS, "6. Hà Nội City Tour", "Tour Làng nghề", "Chương trình tour", "Tour Làng Nghề - Nửa Ngày", "TOUR LÀNG NGHỀ NỬA NGÀY(BUỔI SÁNG)-TIẾNG ANH.docx")
    p_vn = parse_hanoi_craft_doc(doc_vn)
    p_en = parse_hanoi_craft_doc(doc_en)

    tours.append({
        "id": "ha-noi-craft-half-morning",
        "destination": "ha-noi",
        "featured": False,
        "stars": 5,
        "name": p_vn.get("title") or "Tour Nửa Ngày Buổi Sáng: Làng Hương Quảng Phú Cầu & Làng Nón Chuông",
        "nameEn": p_en.get("title") or "Morning Half Day Tour: Quang Phu Cau Incense Village & Chuong Conical Hat Village",
        "durationLabel": "Nửa ngày",
        "durationLabelEn": "Half day",
        "nightsOffset": 0,
        "price": 1590000,
        "priceNote": "$65 Dcar · Nửa ngày",
        "priceNoteEn": "$65 Dcar · Half day",
        "image": "img/tours/hanoi-craft/S2.jpg" if "img/tours/hanoi-craft/S2.jpg" in craft_imgs else (craft_imgs[1] if len(craft_imgs) > 1 else craft_imgs[0]),
        "media": [{"type": "image", "src": img, "alt": "Làng nghề Hà Nội buổi sáng", "altEn": "Hanoi morning craft tour"} for img in craft_imgs],
        "cardLine": "Khám phá sắc đỏ rực rỡ của làng hương Quảng Phú Cầu và nghệ thuật chằm nón tại làng Chuông trong buổi sáng mát lành.",
        "cardLineEn": "Explore the vibrant colors of Quang Phu Cau incense village and conical hat crafting at Chuong village in the morning.",
        "description": p_vn.get("intro") or ["Tour nửa ngày buổi sáng đưa quý khách đến với hai làng nghề tiêu biểu vùng ngoại ô thủ đô."],
        "descriptionEn": p_en.get("intro") or ["Morning half-day tour taking you to two iconic craft villages outside Hanoi."],
        "itinerary": p_vn.get("itinerary") or [],
        "itineraryEn": p_en.get("itinerary") or [],
        "servicesIncluded": p_vn.get("included") or [],
        "servicesIncludedEn": p_en.get("included") or [],
        "servicesExcluded": p_vn.get("excluded") or [],
        "servicesExcludedEn": p_en.get("excluded") or [],
        "serviceNote": " ".join(p_vn.get("notes", [])) or "Tour nửa ngày không bao gồm ăn trưa. Phụ thu ngày lễ 100.000 VNĐ/khách.",
        "serviceNoteEn": " ".join(p_en.get("notes", [])) or "Half-day tour does not include lunch. Holiday surcharge 100,000 VND/guest.",
        "offers": ["Chụp ảnh check-in rực rỡ", "Tự tay làm nón lá truyền thống", "Xe đưa đón khách sạn phố cổ"],
        "offersEn": ["Vibrant photography spots", "Hands-on conical hat workshop", "Old Quarter hotel transfer"],
        "pricingTable": {
            "baseRate": "1.590.000đ / khách ($65 Dcar Limousine)",
            "baseRateEn": "1,590,000 VND / guest ($65 Dcar Limousine)",
            "options": [],
            "surcharges": [
                {"name": "Phụ thu ngày lễ (30/4, 1/5, 2/9, 31/12, 1/1)", "nameEn": "Holiday surcharge", "price": "100.000đ / khách", "priceEn": "100,000 VND / guest"},
                {"name": "Phụ thu dịp Tết Nguyên Đán", "nameEn": "Lunar New Year surcharge", "price": "150.000đ / khách", "priceEn": "150,000 VND / guest"}
            ],
            "childPolicy": hanoi_child_policy
        }
    })

    # 1.3 Hanoi Craft - Half Day Afternoon
    doc_vn = os.path.join(RAW_DOCS, "6. Hà Nội City Tour", "Tour Làng nghề", "Chương trình tour", "Tour Làng Nghề - Nửa Ngày", "TOUR LÀNG NGHỀ NỬA NGÀY(BUỔI CHIỀU)-TIẾNG VIỆT.docx")
    doc_en = os.path.join(RAW_DOCS, "6. Hà Nội City Tour", "Tour Làng nghề", "Chương trình tour", "Tour Làng Nghề - Nửa Ngày", "TOUR LÀNG NGHỀ NỬA NGÀY (BUỔI CHIỀU)-TIẾNG ANH.docx")
    p_vn = parse_hanoi_craft_doc(doc_vn)
    p_en = parse_hanoi_craft_doc(doc_en)

    tours.append({
        "id": "ha-noi-craft-half-afternoon",
        "destination": "ha-noi",
        "featured": False,
        "stars": 5,
        "name": p_vn.get("title") or "Tour Nửa Ngày Buổi Chiều: Làng Hương Quảng Phú Cầu & Làng Nón Chuông",
        "nameEn": p_en.get("title") or "Afternoon Half Day Tour: Quang Phu Cau Incense Village & Chuong Conical Hat Village",
        "durationLabel": "Nửa ngày",
        "durationLabelEn": "Half day",
        "nightsOffset": 0,
        "price": 1590000,
        "priceNote": "$65 Dcar · Nửa ngày",
        "priceNoteEn": "$65 Dcar · Half day",
        "image": "img/tours/hanoi-craft/S3.jpg" if "img/tours/hanoi-craft/S3.jpg" in craft_imgs else (craft_imgs[2] if len(craft_imgs) > 2 else craft_imgs[0]),
        "media": [{"type": "image", "src": img, "alt": "Làng nghề Hà Nội buổi chiều", "altEn": "Hanoi afternoon craft tour"} for img in craft_imgs],
        "cardLine": "Khởi hành buổi chiều tham quan xưởng hương Quảng Phú Cầu và làng nón Chuông, lưu giữ những khung hình tuyệt đẹp lúc hoàng hôn.",
        "cardLineEn": "Afternoon departure to Quang Phu Cau incense village and Chuong conical hat village with beautiful sunset photo ops.",
        "description": p_vn.get("intro") or ["Trải nghiệm buổi chiều thư thái tìm hiểu làng nghề truyền thống lâu đời của miền Bắc."],
        "descriptionEn": p_en.get("intro") or ["Relaxing afternoon journey discovering centuries-old traditional crafts."],
        "itinerary": p_vn.get("itinerary") or [],
        "itineraryEn": p_en.get("itinerary") or [],
        "servicesIncluded": p_vn.get("included") or [],
        "servicesIncludedEn": p_en.get("included") or [],
        "servicesExcluded": p_vn.get("excluded") or [],
        "servicesExcludedEn": p_en.get("excluded") or [],
        "serviceNote": " ".join(p_vn.get("notes", [])) or "Tour nửa ngày chiều đón khách từ 12:00. Phụ thu ngày lễ 100.000 VNĐ/khách.",
        "serviceNoteEn": " ".join(p_en.get("notes", [])) or "Afternoon tour starts around 12:00. Holiday surcharge 100,000 VND/guest.",
        "offers": ["Check-in xưởng hương hoàng hôn", "Nghệ nhân làng nón hướng dẫn", "Hướng dẫn viên song ngữ"],
        "offersEn": ["Incense workshop sunset photos", "Master hat artisan guidance", "Bilingual tour guide"],
        "pricingTable": {
            "baseRate": "1.590.000đ / khách ($65 Dcar Limousine)",
            "baseRateEn": "1,590,000 VND / guest ($65 Dcar Limousine)",
            "options": [],
            "surcharges": [
                {"name": "Phụ thu ngày lễ (30/4, 1/5, 2/9, 31/12, 1/1)", "nameEn": "Holiday surcharge", "price": "100.000đ / khách", "priceEn": "100,000 VND / guest"},
                {"name": "Phụ thu dịp Tết Nguyên Đán", "nameEn": "Lunar New Year surcharge", "price": "150.000đ / khách", "priceEn": "150,000 VND / guest"}
            ],
            "childPolicy": hanoi_child_policy
        }
    })

    # =========================================================
    # 2. HANOI TRADITIONAL TOURS (STRICTLY FROM Tour truyền thống)
    # =========================================================

    # 2.1 Hanoi Traditional - Full Day
    doc_vn = os.path.join(RAW_DOCS, "6. Hà Nội City Tour", "Tour truyền thống", "Chương Trình Tour", "Tiếng Việt", "1 Ngày-HN City Tour.docx")
    doc_en = os.path.join(RAW_DOCS, "6. Hà Nội City Tour", "Tour truyền thống", "Chương Trình Tour", "Tiếng Anh", "Full Day-HN City Tour.docx")
    p_vn = parse_hanoi_traditional_doc(doc_vn, is_en=False)
    p_en = parse_hanoi_traditional_doc(doc_en, is_en=True)

    tours.append({
        "id": "ha-noi-traditional-1d",
        "destination": "ha-noi",
        "featured": True,
        "stars": 5,
        "name": p_vn.get("title") or "Chương Trình Tour Thăm Quan Hà Nội 1 Ngày",
        "nameEn": p_en.get("title") or "Full Day Hanoi City Tour",
        "durationLabel": "1 ngày",
        "durationLabelEn": "1 day",
        "nightsOffset": 0,
        "price": 1881000,
        "priceNote": "$76 limousine · $86 Dcar",
        "priceNoteEn": "$76 limousine · $86 Dcar",
        "image": "img/tours/hanoi-traditional/Activities_1.jpg" if "img/tours/hanoi-traditional/Activities_1.jpg" in trad_imgs else (trad_imgs[0] if trad_imgs else "img/tours/ha-noi.jpg"),
        "media": [{"type": "image", "src": img, "alt": "Hà Nội City Tour truyền thống", "altEn": "Hanoi traditional city tour"} for img in trad_imgs],
        "cardLine": "Hành trình trọn vẹn khám phá thủ đô nghìn năm văn hiến: Lăng Bác, Chùa Một Cột, Bảo tàng Dân tộc học, Chùa Trấn Quốc, Văn Miếu Quốc Tử Giám và Nhà tù Hỏa Lò.",
        "cardLineEn": "A classic comprehensive capital discovery: Ho Chi Minh Mausoleum, One Pillar Pagoda, Museum of Ethnology, Tran Quoc Pagoda, Temple of Literature, and Hoa Lo Prison.",
        "description": p_vn.get("intro") or ["Khám phá những di tích lịch sử và văn hóa tiêu biểu nhất của thủ đô Hà Nội."],
        "descriptionEn": p_en.get("intro") or ["Explore the most iconic historical and cultural landmarks of Hanoi."],
        "itinerary": p_vn.get("itinerary") or [],
        "itineraryEn": p_en.get("itinerary") or [],
        "servicesIncluded": p_vn.get("included") or [],
        "servicesIncludedEn": p_en.get("included") or [],
        "servicesExcluded": p_vn.get("excluded") or [],
        "servicesExcludedEn": p_en.get("excluded") or [],
        "serviceNote": " ".join(p_vn.get("notes", [])) or "Lăng Bác đóng cửa thứ 2 và thứ 6, bảo tàng Dân tộc học đóng cửa thứ 2 (thay bằng Bảo tàng Phụ Nữ).",
        "serviceNoteEn": " ".join(p_en.get("notes", [])) or "Mausoleum closed Mondays & Fridays; Ethnology museum closed Mondays (replaced by Women's Museum).",
        "offers": ["Ăn trưa đặc sản tại nhà hàng", "Vé tham quan trọn gói các điểm", "Tùy chọn xích lô & múa rối nước"],
        "offersEn": ["Local lunch at restaurant", "All monument admission tickets", "Optional cyclo & water puppet show"],
        "pricingTable": {
            "baseRate": "1.881.000đ / khách ($76 Limousine · $86 Dcar)",
            "baseRateEn": "1,881,000 VND / guest ($76 Limousine · $86 Dcar)",
            "options": [
                {"name": "Lựa chọn 1: Thăm quan phố cổ Hà Nội bằng Xích lô 45 phút", "nameEn": "Option 1: Cyclo 45 minutes around Hanoi Old Quarter", "price": "+100.000đ / $5", "priceEn": "+100,000 VND / $5"},
                {"name": "Lựa chọn 2: Xem biểu diễn Múa Rối Nước Thăng Long 50 phút", "nameEn": "Option 2: Water Puppet Show 50 minutes", "price": "+100.000đ / $5", "priceEn": "+100,000 VND / $5"},
                {"name": "Lựa chọn 3: Combo Xích lô 45p & Múa Rối Nước 50p", "nameEn": "Option 3: Combo Cyclo 45m & Water Puppet Show 50m", "price": "+200.000đ / $10", "priceEn": "+200,000 VND / $10"},
                {"name": "Không dùng bữa trưa theo tour (đón khách lúc 13h30)", "nameEn": "Without lunch deduction (pickup at hotel at 13:30)", "price": "-100.000đ / -$5", "priceEn": "-100,000 VND / -$5"}
            ],
            "surcharges": [
                {"name": "Phụ thu ngày lễ (30/4, 1/5, 2/9, 31/12, 1/1)", "nameEn": "Holiday surcharge", "price": "100.000đ / khách", "priceEn": "100,000 VND / guest"},
                {"name": "Phụ thu dịp Tết Nguyên Đán", "nameEn": "Lunar New Year surcharge", "price": "150.000đ / khách", "priceEn": "150,000 VND / guest"}
            ],
            "childPolicy": hanoi_child_policy
        },
        "menuGallery": {
            "title": "Thực đơn bữa trưa",
            "titleEn": "Lunch set menu",
            "images": [{"src": "img/tours/hanoi-traditional/set-menu.jpg", "alt": "Thực đơn nhà hàng", "altEn": "Restaurant set menu"}]
        }
    })

    # 2.2 Hanoi Traditional - Half Day Morning
    doc_vn = os.path.join(RAW_DOCS, "6. Hà Nội City Tour", "Tour truyền thống", "Chương Trình Tour", "Tiếng Việt", "Buổi Sáng-HN City Tour.docx")
    doc_en = os.path.join(RAW_DOCS, "6. Hà Nội City Tour", "Tour truyền thống", "Chương Trình Tour", "Tiếng Anh", "Morning-HN City Tour.docx")
    p_vn = parse_hanoi_traditional_doc(doc_vn, is_en=False)
    p_en = parse_hanoi_traditional_doc(doc_en, is_en=True)

    tours.append({
        "id": "ha-noi-traditional-half-morning",
        "destination": "ha-noi",
        "featured": False,
        "stars": 5,
        "name": p_vn.get("title") or "Hà Nội City Tour Nửa Ngày Buổi Sáng",
        "nameEn": p_en.get("title") or "Morning Half Day Hanoi City Tour",
        "durationLabel": "Buổi sáng",
        "durationLabelEn": "Morning",
        "nightsOffset": 0,
        "price": 1460000,
        "priceNote": "$59 limousine · $69 Dcar",
        "priceNoteEn": "$59 limousine · $69 Dcar",
        "image": "img/tours/hanoi-traditional/Activities_2.jpg" if "img/tours/hanoi-traditional/Activities_2.jpg" in trad_imgs else (trad_imgs[1] if len(trad_imgs) > 1 else trad_imgs[0]),
        "media": [{"type": "image", "src": img, "alt": "Hà Nội sáng truyền thống", "altEn": "Hanoi morning traditional tour"} for img in trad_imgs],
        "cardLine": "Tour buổi sáng khám phá quần thể Lăng Bác, Chùa Một Cột, Bảo tàng Dân tộc học hoặc Nhà tù Hỏa Lò cùng bữa trưa tại nhà hàng.",
        "cardLineEn": "Morning tour visiting Ho Chi Minh Mausoleum complex, One Pillar Pagoda, Museum of Ethnology, and lunch at restaurant.",
        "description": p_vn.get("intro") or ["Hành trình buổi sáng gọn gàng, súc tích dành cho du khách có ít thời gian."],
        "descriptionEn": p_en.get("intro") or ["A concise morning itinerary ideal for travelers with limited time in Hanoi."],
        "itinerary": p_vn.get("itinerary") or [],
        "itineraryEn": p_en.get("itinerary") or [],
        "servicesIncluded": p_vn.get("included") or [],
        "servicesIncludedEn": p_en.get("included") or [],
        "servicesExcluded": p_vn.get("excluded") or [],
        "servicesExcludedEn": p_en.get("excluded") or [],
        "serviceNote": " ".join(p_vn.get("notes", [])) or "Trang phục lịch sự kín vai và đầu gối khi viếng Lăng Bác và chùa.",
        "serviceNoteEn": " ".join(p_en.get("notes", [])) or "Modest attire required (shoulders and knees covered) at temples and mausoleum.",
        "offers": ["Lăng Bác & Chùa Một Cột", "Bảo tàng Dân tộc học", "Bữa trưa đặc sản tại nhà hàng"],
        "offersEn": ["Mausoleum & One Pillar Pagoda", "Museum of Ethnology", "Local restaurant lunch"],
        "pricingTable": {
            "baseRate": "1.460.000đ / khách ($59 Limousine · $69 Dcar)",
            "baseRateEn": "1,460,000 VND / guest ($59 Limousine · $69 Dcar)",
            "options": [
                {"name": "Không dùng bữa trưa (trả về khách sạn sau khi kết thúc tham quan)", "nameEn": "Without lunch deduction (drop-off after sightseeing)", "price": "-100.000đ / -$5", "priceEn": "-100,000 VND / -$5"}
            ],
            "surcharges": [
                {"name": "Phụ thu ngày lễ (30/4, 1/5, 2/9, 31/12, 1/1)", "nameEn": "Holiday surcharge", "price": "100.000đ / khách", "priceEn": "100,000 VND / guest"},
                {"name": "Phụ thu dịp Tết Nguyên Đán", "nameEn": "Lunar New Year surcharge", "price": "150.000đ / khách", "priceEn": "150,000 VND / guest"}
            ],
            "childPolicy": hanoi_child_policy
        },
        "menuGallery": {
            "title": "Thực đơn bữa trưa",
            "titleEn": "Lunch set menu",
            "images": [{"src": "img/tours/hanoi-traditional/set-menu.jpg", "alt": "Thực đơn nhà hàng", "altEn": "Restaurant set menu"}]
        }
    })

    # 2.3 Hanoi Traditional - Half Day Afternoon
    doc_vn = os.path.join(RAW_DOCS, "6. Hà Nội City Tour", "Tour truyền thống", "Chương Trình Tour", "Tiếng Việt", "Buổi Chiều-HN City Tour.docx")
    doc_en = os.path.join(RAW_DOCS, "6. Hà Nội City Tour", "Tour truyền thống", "Chương Trình Tour", "Tiếng Anh", "Afternoon-HN City Tour.docx")
    p_vn = parse_hanoi_traditional_doc(doc_vn, is_en=False)
    p_en = parse_hanoi_traditional_doc(doc_en, is_en=True)

    tours.append({
        "id": "ha-noi-traditional-half-afternoon",
        "destination": "ha-noi",
        "featured": False,
        "stars": 5,
        "name": p_vn.get("title") or "Hà Nội City Tour Nửa Ngày Buổi Chiều",
        "nameEn": p_en.get("title") or "Afternoon Half Day Hanoi City Tour",
        "durationLabel": "Buổi chiều",
        "durationLabelEn": "Afternoon",
        "nightsOffset": 0,
        "price": 1460000,
        "priceNote": "$59 limousine · $69 Dcar",
        "priceNoteEn": "$59 limousine · $69 Dcar",
        "image": "img/tours/hanoi-traditional/Activities_3.jpg" if "img/tours/hanoi-traditional/Activities_3.jpg" in trad_imgs else (trad_imgs[2] if len(trad_imgs) > 2 else trad_imgs[0]),
        "media": [{"type": "image", "src": img, "alt": "Hà Nội chiều truyền thống", "altEn": "Hanoi afternoon traditional tour"} for img in trad_imgs],
        "cardLine": "Tour buổi chiều tham quan Chùa Trấn Quốc bên Hồ Tây, Văn Miếu Quốc Tử Giám và Di tích Nhà tù Hỏa Lò lịch sử.",
        "cardLineEn": "Afternoon tour featuring Tran Quoc Pagoda by West Lake, Temple of Literature, and historic Hoa Lo Prison.",
        "description": p_vn.get("intro") or ["Trải nghiệm buổi chiều đậm chất văn hóa và lịch sử thủ đô."],
        "descriptionEn": p_en.get("intro") or ["Immerse yourself in Hanoi's cultural and historical heritage in the afternoon."],
        "itinerary": p_vn.get("itinerary") or [],
        "itineraryEn": p_en.get("itinerary") or [],
        "servicesIncluded": p_vn.get("included") or [],
        "servicesIncludedEn": p_en.get("included") or [],
        "servicesExcluded": p_vn.get("excluded") or [],
        "servicesExcludedEn": p_en.get("excluded") or [],
        "serviceNote": " ".join(p_vn.get("notes", [])) or "Kết thúc tour lúc 16:30 tại khách sạn phố cổ. Có tùy chọn xích lô và múa rối nước.",
        "serviceNoteEn": " ".join(p_en.get("notes", [])) or "Concludes around 16:30 with Old Quarter hotel drop-off. Optional cyclo and puppet show available.",
        "offers": ["Chùa Trấn Quốc Hồ Tây", "Văn Miếu Quốc Tử Giám", "Di tích Nhà tù Hỏa Lò"],
        "offersEn": ["Tran Quoc Pagoda", "Temple of Literature", "Historic Hoa Lo Prison"],
        "pricingTable": {
            "baseRate": "1.460.000đ / khách ($59 Limousine · $69 Dcar)",
            "baseRateEn": "1,460,000 VND / guest ($59 Limousine · $69 Dcar)",
            "options": [
                {"name": "Lựa chọn 1: Thăm quan phố cổ bằng Xích lô 45 phút", "nameEn": "Option 1: Cyclo 45 minutes around Old Quarter", "price": "+100.000đ / $5", "priceEn": "+100,000 VND / $5"},
                {"name": "Lựa chọn 2: Biểu diễn múa rối nước 50 phút", "nameEn": "Option 2: Water Puppet Show 50 minutes", "price": "+100.000đ / $5", "priceEn": "+100,000 VND / $5"},
                {"name": "Lựa chọn 3: Combo Xích lô 45p & Múa Rối Nước 50p", "nameEn": "Option 3: Combo Cyclo & Water Puppet Show", "price": "+200.000đ / $10", "priceEn": "+200,000 VND / $10"},
                {"name": "Không dùng bữa trưa (xe đón tại khách sạn 13h30)", "nameEn": "Without lunch deduction (pickup at 13:30)", "price": "-100.000đ / -$5", "priceEn": "-100,000 VND / -$5"}
            ],
            "surcharges": [
                {"name": "Phụ thu ngày lễ (30/4, 1/5, 2/9, 31/12, 1/1)", "nameEn": "Holiday surcharge", "price": "100.000đ / khách", "priceEn": "100,000 VND / guest"},
                {"name": "Phụ thu dịp Tết Nguyên Đán", "nameEn": "Lunar New Year surcharge", "price": "150.000đ / khách", "priceEn": "150,000 VND / guest"}
            ],
            "childPolicy": hanoi_child_policy
        },
        "menuGallery": {
            "title": "Thực đơn bữa trưa",
            "titleEn": "Lunch set menu",
            "images": [{"src": "img/tours/hanoi-traditional/set-menu.jpg", "alt": "Thực đơn nhà hàng", "altEn": "Restaurant set menu"}]
        }
    })

    # =========================================================
    # 3. SAPA STANDARD TOURS
    # =========================================================
    sapa_pairs = [
        # (id, name_vi, name_en, dur_vi, dur_en, nights, vn_file, en_file, price, p_note_vi, p_note_en, card_vi, card_en, offers_vi, offers_en)
        (
            "sapa-bac-ha-2d1n",
            "Tour Sa Pa – Chợ Phiên Bắc Hà 2N1Đ (Khách Sạn)",
            "Sapa – Bac Ha Market Tour 2 Days 1 Night (Hotel)",
            "2 ngày 1 đêm", "2 days 1 night", 1,
            "CHƯƠNG TRÌNH SAPA - BẮC HÀ 2 NGÀY 1 ĐÊM (KHỞI HÀNH THỨ 7).docx",
            "SAPA - BAC HA MARKET 2 DAYS 1 NIGHT (HOTEL).docx",
            2450000, "Từ $99 khách sạn · Thứ 7", "From $99 hotel · Saturday",
            "Khám phá bản Cát Cát thơ mộng và trải nghiệm không gian văn hóa rực rỡ sắc màu tại chợ phiên Bắc Hà họp vào chủ nhật hàng tuần.",
            "Explore picturesque Cat Cat village and experience the vibrant colors of Bac Ha Sunday market.",
            ["Chợ phiên Bắc Hà", "Bản Cát Cát", "Xe giường nằm khứ hồi"],
            ["Bac Ha Sunday Market", "Cat Cat Village", "Round-trip sleeper bus"]
        ),
        (
            "sapa-bac-ha-3d2n",
            "Tour Sa Pa – Núi Hàm Rồng – Chợ Phiên Bắc Hà 3N2Đ (Khách Sạn)",
            "Sapa – Ham Rong Mountain – Bac Ha Market 3 Days 2 Nights (Hotel)",
            "3 ngày 2 đêm", "3 days 2 nights", 2,
            "CHƯƠNG TRÌNH SAPA - BẮC HÀ 3 NGÀY 2 ĐÊM (KHỞI HÀNH THỨ 6).docx",
            "SAPA - BAC HA MARKET 3 DAYS 2 NIGHTS (HOTEL).docx",
            3550000, "Từ $143 khách sạn · Thứ 6", "From $143 hotel · Friday",
            "Hành trình 3 ngày trọn vẹn: trekking bản Cát Cát, ngắm hoa tại núi Hàm Rồng, cáp treo Fansipan và phiên chợ vùng cao Bắc Hà.",
            "Complete 3-day journey: Cat Cat trekking, Ham Rong mountain garden, Fansipan cable car, and famous Bac Ha ethnic market.",
            ["Chợ Bắc Hà", "Núi Hàm Rồng & Cát Cát", "2 đêm khách sạn Sa Pa"],
            ["Bac Ha Market", "Ham Rong & Cat Cat", "2 nights Sapa hotel"]
        ),
        (
            "sapa-catcat-fansipan-2d1n",
            "Tour Sa Pa – Bản Cát Cát – Cáp Treo Fansipan 2N1Đ (Khách Sạn)",
            "Sapa – Cat Cat Village – Fansipan Peak 2 Days 1 Night (Hotel)",
            "2 ngày 1 đêm", "2 days 1 night", 1,
            "CHƯƠNG TRÌNH SAPA - CÁT CÁT - FANSIPAN 2 NGÀY 1 ĐÊM (KHÁCH SẠN).docx",
            "SAPA 2 DAYS 1 NIGHT (HOTEL ) - CAT CAT - FANSIPAN.docx",
            2450000, "Từ $99 trọn gói Fansipan", "From $99 all-inclusive Fansipan",
            "Chinh phục Nóc nhà Đông Dương Fansipan hùng vĩ bằng cáp treo và tàu Mường Hoa, hòa mình vào bản làng Cát Cát của người H'Mông.",
            "Conquer the Roof of Indochina via Fansipan cable car and Muong Hoa train, combined with H'mong culture in Cat Cat village.",
            ["Vé cáp treo Fansipan", "Tàu hỏa Mường Hoa", "Khách sạn trung tâm Sa Pa"],
            ["Fansipan Cable Car", "Muong Hoa Mountain Train", "Central Sapa hotel"]
        ),
        (
            "sapa-catcat-hamrong-2d1n",
            "Tour Sa Pa – Bản Cát Cát – Núi Hàm Rồng 2N1Đ (Khách Sạn)",
            "Sapa – Cat Cat Village – Ham Rong Mountain 2 Days 1 Night (Hotel)",
            "2 ngày 1 đêm", "2 days 1 night", 1,
            "CHƯƠNG TRÌNH SAPA 2 NGÀY 1 ĐÊM (KHÁCH SẠN).docx",
            "SAPA 2 DAYS 1 NIGHT (HOTEL ) - CAT CAT - LAO CHAI TA VAN.docx",
            2250000, "Từ $90 Cát Cát – Hàm Rồng", "From $90 Cat Cat – Ham Rong",
            "Tour Sa Pa truyền thống 2N1Đ nhẹ nhàng, tham quan thác Cát Cát và ngắm nhìn toàn cảnh thị trấn Sa Pa từ đài quan sát núi Hàm Rồng.",
            "Classic leisure 2D1N tour: Cat Cat waterfall and panoramic Sapa town views from Ham Rong mountain observatory.",
            ["Núi Hàm Rồng", "Bản Cát Cát", "Phù hợp gia đình"],
            ["Ham Rong Mountain", "Cat Cat Village", "Family friendly"]
        ),
        (
            "sapa-homestay-2d1n",
            "Tour Sa Pa Ngủ Bản 2N1Đ Homestay (Ý Linh Hồ – Lao Chải – Tả Van)",
            "Sapa Homestay Trekking Tour 2 Days 1 Night (Y Linh Ho – Lao Chai – Ta Van)",
            "2 ngày 1 đêm", "2 days 1 night", 1,
            "CHƯƠNG TRÌNH SAPA 2 NGÀY 1 ĐÊM NGỦ BẢN (HOMESTAY).docx",
            "SAPA 2 DAYS 1 NIGHT (HOMESTAY ).docx",
            2150000, "Từ $86 homestay bản Tả Van", "From $86 Ta Van homestay",
            "Trekking qua thung lũng Mường Hoa, ngắm ruộng bậc thang ngoạn mục và trải nghiệm nghỉ đêm ấm cúng tại homestay bản Giáy Tả Van.",
            "Trek through Muong Hoa valley with breathtaking terraced rice fields and enjoy an authentic overnight homestay in Ta Van.",
            ["Trekking Mường Hoa", "Nghỉ đêm bản Tả Van", "Ẩm thực người Giáy"],
            ["Muong Hoa Valley Trek", "Ta Van Homestay Stay", "Giay traditional cuisine"]
        ),
        (
            "sapa-hotel-2d2n",
            "Tour Sa Pa 2N2Đ Xe Giường Nằm (Khách Sạn Cát Cát – Hàm Rồng)",
            "Sapa 2 Days 2 Nights Sleeper Bus Tour (Cat Cat – Ham Rong Hotel)",
            "2 ngày 2 đêm", "2 days 2 nights", 2,
            "CHƯƠNG TRÌNH SAPA 2 NGÀY 2 ĐÊM (KHÁCH SẠN).docx",
            "SAPA 2 DAYS 2 NIGHTS (HOTEL ) - CAT CAT - LAO CHAI TA VAN.docx",
            2650000, "Từ $107 xe giường nằm đêm", "From $107 night sleeper bus",
            "Tiết kiệm tối đa thời gian với xe giường nằm đêm từ Hà Nội, có trọn vẹn 2 ngày khám phá bản Cát Cát và đỉnh Hàm Rồng.",
            "Maximize your travel time with night sleeper bus from Hanoi and 2 full days discovering Cat Cat and Ham Rong.",
            ["Khởi hành đêm từ Hà Nội", "2 ngày trọn vẹn tại Sa Pa", "Khách sạn trung tâm"],
            ["Night bus from Hanoi", "2 full days in Sapa", "Central hotel stay"]
        ),
        (
            "sapa-homestay-2d2n",
            "Tour Sa Pa Ngủ Bản 2N2Đ Xe Giường Nằm (Homestay Tả Van)",
            "Sapa Homestay Trekking 2 Days 2 Nights Sleeper Bus (Ta Van Village)",
            "2 ngày 2 đêm", "2 days 2 nights", 2,
            "CHƯƠNG TRÌNH SAPA 2 NGÀY 2 ĐÊM NGỦ BẢN (HOMESTAY).docx",
            "SAPA 2 DAYS 2 NIGHT (HOMESTAY ).docx",
            2550000, "Từ $103 xe giường nằm đêm", "From $103 night sleeper bus",
            "Khởi hành đêm từ Hà Nội, trekking sâu vào các bản Ý Linh Hồ, Lao Chải, Tả Van, Giàng Tả Chải và nghỉ đêm tại homestay.",
            "Overnight sleeper bus from Hanoi followed by deep trekking across Y Linh Ho, Lao Chai, Ta Van, and Giang Ta Chai.",
            ["Trekking bản làng nguyên sơ", "Nấu ăn cùng gia chủ", "Ngắm suối Mường Hoa"],
            ["Deep village trekking", "Cooking with locals", "Muong Hoa stream view"]
        ),
        (
            "sapa-homestay-fansipan-2d2n",
            "Tour Sa Pa 2N2Đ Homestay Ngủ Bản Kết Hợp Cáp Treo Fansipan",
            "Sapa 2 Days 2 Nights Homestay & Fansipan Peak Tour",
            "2 ngày 2 đêm", "2 days 2 nights", 2,
            "CHƯƠNG TRÌNH SAPA 2 NGÀY 2 ĐÊM NGỦ BẢN (HOMESTAY).docx",
            "SAPA 2 DAYS 2 NIGHTS (HOMESTAY ) - FANSIPAN.docx",
            2950000, "Từ $119 homestay + Fansipan", "From $119 homestay + Fansipan",
            "Sự kết hợp hoàn hảo giữa trải nghiệm văn hóa bản địa mộc mạc tại homestay và kỳ quan cáp treo Fansipan hiện đại.",
            "The perfect combo of rustic ethnic homestay immersion and modern Fansipan cable car marvel.",
            ["Chinh phục đỉnh Fansipan", "Nghỉ homestay bản Tả Van", "Trekking suối thác"],
            ["Conquer Fansipan Summit", "Ta Van Village Homestay", "Waterfalls & Stream Trek"]
        ),
        (
            "sapa-hotel-fansipan-2d2n",
            "Tour Sa Pa 2N2Đ Khách Sạn – Cát Cát – Lao Chải Tả Van – Fansipan",
            "Sapa 2 Days 2 Nights Hotel – Fansipan – Cat Cat – Lao Chai Ta Van",
            "2 ngày 2 đêm", "2 days 2 nights", 2,
            "CHƯƠNG TRÌNH SAPA 2 NGÀY 2 ĐÊM (KHÁCH SẠN).docx",
            "SAPA 2 DAYS 2 NIGHTS (HOTEL ) - FANSIPAN - CAT CAT - LAO CHAI TA VAN.docx",
            3150000, "Từ $127 trọn gói Fansipan", "From $127 all-inclusive Fansipan",
            "Chuyến đi trọn gói cao cấp tại khách sạn Sa Pa: chinh phục đỉnh Fansipan hùng vĩ, tham quan bản Cát Cát và thung lũng Lao Chải Tả Van.",
            "A premium all-inclusive Sapa hotel getaway: Fansipan summit ascent, Cat Cat culture, and Lao Chai Ta Van valley vistas.",
            ["Fansipan trọn gói", "Thung lũng ruộng bậc thang", "Khách sạn tiện nghi"],
            ["All-inclusive Fansipan", "Terraced valley views", "Comfortable hotel"]
        ),
        (
            "sapa-hotel-3d2n",
            "Tour Sa Pa 3N2Đ Khách Sạn (Cát Cát – Núi Hàm Rồng)",
            "Sapa 3 Days 2 Nights Hotel Tour (Cat Cat – Ham Rong)",
            "3 ngày 2 đêm", "3 days 2 nights", 2,
            "CHƯƠNG TRÌNH SAPA 3 NGÀY 2 ĐÊM (KHÁCH SẠN).docx",
            "SAPA 3 DAYS 2 NIGHTS (HOTEL).docx",
            3250000, "Từ $131 khách sạn 3N2Đ", "From $131 hotel 3D2N",
            "Kỳ nghỉ 3 ngày thư thái tại thị trấn sương mờ Sa Pa: khám phá vườn lan Hàm Rồng, bản Cát Cát và thời gian tự do mua sắm đặc sản.",
            "A leisurely 3-day holiday in misty Sapa: orchid garden on Ham Rong, Cat Cat village, and free time for local delicacies.",
            ["Lịch trình thư giãn", "2 đêm khách sạn Sa Pa", "Tự do khám phá phố núi"],
            ["Relaxed pace", "2 hotel nights in Sapa", "Free time in town"]
        ),
        (
            "sapa-catcat-hamrong-fansipan-3d2n",
            "Tour Sa Pa 3N2Đ Khách Sạn – Cát Cát – Hàm Rồng – Cáp Treo Fansipan",
            "Sapa 3 Days 2 Nights Hotel – Cat Cat – Ham Rong – Fansipan Peak",
            "3 ngày 2 đêm", "3 days 2 nights", 2,
            "CHƯƠNG TRÌNH SAPA 3 NGÀY 2 ĐÊM (KHÁCH SẠN) - CÁT CÁT - HÀM RỒNG - FANSIPAN.docx",
            "SAPA 3 DAYS 2 NIGHTS (HOTEL).docx",
            3650000, "Từ $147 trọn gói Fansipan", "From $147 all-inclusive Fansipan",
            "Chương trình tour Sa Pa đầy đủ và được yêu thích nhất: Cát Cát, Hàm Rồng, vé tàu Mường Hoa và cáp treo lên đỉnh Fansipan 3.143m.",
            "The most sought-after full Sapa itinerary: Cat Cat, Ham Rong, Muong Hoa mountain train, and Fansipan summit cable car (3,143m).",
            ["Trọn gói Fansipan & tàu Mường Hoa", "Vườn hoa Hàm Rồng", "Khách sạn chất lượng"],
            ["Fansipan & Muong Hoa train included", "Ham Rong flower garden", "Quality hotel"]
        ),
        (
            "sapa-hotel-homestay-3d2n",
            "Tour Sa Pa 3N2Đ Trải Nghiệm (01 Đêm Khách Sạn + 01 Đêm Homestay Bản)",
            "Sapa 3 Days 2 Nights Combo (01 Night Hotel + 01 Night Homestay)",
            "3 ngày 2 đêm", "3 days 2 nights", 2,
            "CHƯƠNG TRÌNH SAPA 3N2D (01 ĐÊM KS + 01 ĐÊM HOMESTAY).docx",
            "SAPA 3 DAYS 2 NIGHTS (01 NIGHT HOTEL - 01 NIGHT HOMESTAY ).docx",
            3350000, "Từ $135 combo KS + bản", "From $135 combo hotel + homestay",
            "Combo trải nghiệm tuyệt vời: đêm 1 tiện nghi tại khách sạn trung tâm Sa Pa, đêm 2 ngủ bản Tả Van giữa khung cảnh ruộng bậc thang yên bình.",
            "The ultimate combo: first night in comfortable town hotel, second night at a serene village homestay in Ta Van.",
            ["1 đêm khách sạn + 1 đêm homestay", "Bản Cát Cát & Tả Van", "Giao lưu văn hóa bản địa"],
            ["1 night hotel + 1 night homestay", "Cat Cat & Ta Van", "Cultural interaction"]
        ),
        (
            "sapa-hotel-3d3n",
            "Tour Sa Pa 3N3Đ Xe Giường Nằm (Khách Sạn Hàm Rồng – Fansipan – Cát Cát)",
            "Sapa 3 Days 3 Nights Sleeper Bus (Ham Rong – Fansipan – Cat Cat Hotel)",
            "3 ngày 3 đêm", "3 days 3 nights", 3,
            "CHƯƠNG TRÌNH SAPA 3 NGÀY 3 ĐÊM (KHÁCH SẠN).docx",
            "SAPA 3 DAYS 3 NIGHTS (HOTEL).docx",
            3850000, "Từ $155 xe giường nằm 3N3Đ", "From $155 sleeper bus 3D3N",
            "Chuyến hành trình 3 ngày 3 đêm trọn gói: xe giường nằm đêm khứ hồi Hà Nội, 2 đêm khách sạn Sa Pa, khám phá Hàm Rồng, Fansipan và Cát Cát.",
            "3 days 3 nights package: round-trip night sleeper bus from Hanoi, 2 hotel nights, exploring Ham Rong, Fansipan, and Cat Cat.",
            ["Khứ hồi xe giường nằm", "Chinh phục đỉnh Fansipan", "Lịch trình trọn vẹn"],
            ["Round-trip night sleeper", "Fansipan summit", "Comprehensive itinerary"]
        ),
        (
            "sapa-hotel-homestay-3d3n",
            "Tour Sa Pa 3N3Đ (01 Đêm Khách Sạn + 01 Đêm Bản Tả Van + Xe Giường Nằm)",
            "Sapa 3 Days 3 Nights (01 Night Hotel + 01 Night Homestay + Sleeper Bus)",
            "3 ngày 3 đêm", "3 days 3 nights", 3,
            "CHƯƠNG TRÌNH SAPA 3N2D (01 ĐÊM KS + 01 ĐÊM HOMESTAY).docx",
            "SAPA 3 DAYS 3 NIGHTS (01 NIGHT HOTEL - 01 NIGHT HOMESTAY ).docx",
            3650000, "Từ $147 combo 3N3Đ", "From $147 combo 3D3N",
            "Tour Sa Pa 3N3Đ kết hợp ngủ khách sạn và ngủ bản: di chuyển xe giường nằm, tham quan Cát Cát, trekking Lao Chải – Tả Van – Giàng Tả Chải.",
            "3D3N combined hotel & village homestay: sleeper bus transfer, Cat Cat village, trekking through Lao Chai – Ta Van – Giang Ta Chai.",
            ["Xe giường nằm đêm", "1 đêm KS + 1 đêm bản", "Trekking suối Mường Hoa"],
            ["Night sleeper bus", "1 night hotel + 1 night homestay", "Muong Hoa valley trekking"]
        ),
        (
            "sapa-trekking-1d",
            "Tour Sa Pa Trekking 1 Ngày (Ý Linh Hồ – Lao Chải – Tả Van)",
            "Sapa 1-Day Trekking Tour (Y Linh Ho – Lao Chai – Ta Van)",
            "1 ngày", "1 day", 0,
            "CHƯƠNG TRÌNH SAPA TREKKING 1 NGÀY.docx",
            "SAPA TREKKING 1 DAY.docx",
            1250000, "$50 trọn gói trekking", "$50 all-inclusive trek",
            "Hành trình trekking 10km tuyệt đẹp qua thung lũng Mường Hoa, tiếp xúc với đồng bào dân tộc H'Mông Đen và Giáy, ăn trưa tại bản.",
            "A scenic 10km day trek through breathtaking Muong Hoa valley, meeting Black H'mong and Giay ethnic communities.",
            ["Trekking 10km phong cảnh đẹp", "Bữa trưa tại bản", "Hướng dẫn viên bản địa"],
            ["Scenic 10km day trek", "Local village lunch", "Native local guide"]
        ),
    ]

    for item in sapa_pairs:
        tid, n_vi, n_en, dur_vi, dur_en, noff, f_vi, f_en, sprice, p_note_vi, p_note_en, card_vi, card_en, off_vi, off_en = item
        p_vi_path = os.path.join(RAW_DOCS, "sapa may", "CHƯƠNG TRÌNH TIẾNG VIỆT", f_vi)
        p_en_path = os.path.join(RAW_DOCS, "sapa may", "CHƯƠNG TRÌNH TIẾNG ANH", f_en)
        std_vi = parse_sapa_standard_doc(p_vi_path)
        std_en = parse_sapa_standard_doc(p_en_path)

        tours.append({
            "id": tid,
            "destination": "sapa",
            "featured": False,
            "stars": 5,
            "name": n_vi,
            "nameEn": n_en,
            "durationLabel": dur_vi,
            "durationLabelEn": dur_en,
            "nightsOffset": noff,
            "price": 0,
            "priceNote": "Liên hệ",
            "priceNoteEn": "Contact",
            "image": sapa_ph,
            "media": [
                {
                    "type": "image",
                    "src": sapa_ph,
                    "alt": f"{n_vi} - The Dahlia Hanoi",
                    "altEn": f"{n_en} - The Dahlia Hanoi"
                }
            ],
            "cardLine": card_vi,
            "cardLineEn": card_en,
            "description": std_vi.get("intro") or [card_vi],
            "descriptionEn": std_en.get("intro") or [card_en],
            "itinerary": std_vi.get("itinerary") or [],
            "itineraryEn": std_en.get("itinerary") or [],
            "servicesIncluded": std_vi.get("included") or [],
            "servicesIncludedEn": std_en.get("included") or [],
            "servicesExcluded": std_vi.get("excluded") or [],
            "servicesExcludedEn": std_en.get("excluded") or [],
            "serviceNote": " ".join(std_vi.get("notes", [])) or "Giá tour áp dụng ngày thường, không áp dụng lễ Tết.",
            "serviceNoteEn": " ".join(std_en.get("notes", [])) or "Tour rates apply on regular days; surcharges apply on public holidays.",
            "offers": off_vi,
            "offersEn": off_en,
            "pricingTable": {
                "baseRate": "Báo giá theo tiêu chuẩn lưu trú (Khách sạn 2*–5* hoặc Homestay)",
                "baseRateEn": "Custom quote based on accommodation tier (2*–5* Hotel or Homestay)",
                "options": [
                    {"name": "Vé cáp treo Fansipan & Tàu hỏa Mường Hoa", "nameEn": "Fansipan cable car & Muong Hoa mountain train", "price": "Theo lịch trình tour", "priceEn": "Per itinerary"}
                ],
                "surcharges": [
                    {"name": "Phụ thu di chuyển đi bản bằng ô tô hoặc xe máy (2 chiều)", "nameEn": "Car/Motorbike transfer surcharge to villages (round trip)", "price": "150.000đ / khách", "priceEn": "150,000 VND / guest"},
                    {"name": "Cuối tuần phụ thu tour ở khách sạn 4, 5 sao", "nameEn": "Weekend surcharge for 4-star and 5-star hotels", "price": "100.000đ / khách", "priceEn": "100,000 VND / guest"},
                    {"name": "Thuế VAT", "nameEn": "Value Added Tax (VAT)", "price": "+10%", "priceEn": "+10%"}
                ],
                "childPolicy": sapa_child_policy
            }
        })

    # =========================================================
    # 4. SAPA MOTORBIKE TOURS
    # =========================================================
    moto_items = [
        (
            "sapa-motorbike-trekking-2d1n",
            "Tour Sa Pa 2N1Đ Xe Máy & Trekking Bản Làng (Homestay)",
            "Sapa 2 Days 1 Night by Motorbike and Trekking (Homestay)",
            "2 ngày 1 đêm", "2 days 1 night", 1,
            "SAPA 2 DAYS 1 NIGHT BY MOTORBIKE AND TREKKING (HOMESTAY).docx",
            2850000, "Từ $115 xe máy + trek", "From $115 bike + trek",
            "Khám phá Sa Pa độc đáo: 1 ngày phượt xe máy qua đèo Ô Quy Hồ, bản Khoang, Tả Phìn và 1 ngày trekking ruộng bậc thang Mường Hoa.",
            "Unique Sapa adventure: 1 day motorbike ride through O Quy Ho pass, Ban Khoang, Ta Phin, and 1 day trekking in Muong Hoa valley.",
            ["1 ngày xe máy + 1 ngày trekking", "Đèo Ô Quy Hồ & Tả Phìn", "Homestay bản Tả Van"],
            ["1 day bike + 1 day trek", "O Quy Ho Pass & Ta Phin", "Ta Van Village Homestay"]
        ),
        (
            "sapa-motorbike-2d1n",
            "Tour Sa Pa 2N1Đ Phượt Xe Máy Khám Phá Các Bản (Homestay)",
            "Sapa 2 Days 1 Night Motorbike Tour Across Villages (Homestay)",
            "2 ngày 1 đêm", "2 days 1 night", 1,
            "SAPA 2 DAYS 1 NIGHT MORORBIKE TOUR (HOMESTAY).docx",
            2950000, "Từ $119 phượt xe máy", "From $119 motorbike tour",
            "Trọn vẹn 2 ngày khám phá các bản làng người H'Mông, Dao Đỏ, Tày, Giáy bằng xe máy có tài xế địa phương dày dặn kinh nghiệm.",
            "Two full days exploring H'mong, Red Dao, Tay, and Giay villages on motorbikes with experienced local riders.",
            ["Xe máy kèm tài xế bản địa", "Đi qua hơn 10 bản làng", "Lớp học nấu ăn homestay"],
            ["Motorbike with local rider", "10+ mountain villages", "Homestay cooking class"]
        ),
        (
            "sapa-motorbike-trekking-2d2n",
            "Tour Sa Pa 2N2Đ Xe Giường Nằm – Xe Máy & Trekking (Homestay)",
            "Sapa 2 Days 2 Nights Sleeper Bus – Motorbike & Trekking (Homestay)",
            "2 ngày 2 đêm", "2 days 2 nights", 2,
            "SAPA 2 DAYS 2 NIGHTS BY MOTOBIKE AND TREKKING (HOMESTAY).docx",
            3250000, "Từ $131 xe giường nằm", "From $131 sleeper bus",
            "Xe giường nằm đêm xuất phát từ Hà Nội, kết hợp 1 ngày phượt xe máy ngắm đại ngàn Tây Bắc và 1 ngày trekking suối Mường Hoa.",
            "Night sleeper bus from Hanoi, combining a 1-day scenic Northwest motorbike ride and a 1-day trek along Muong Hoa stream.",
            ["Xe giường nằm khứ hồi", "1 ngày xe máy + 1 ngày trekking", "Nghỉ homestay ấm cúng"],
            ["Round-trip sleeper bus", "1 day motorbike + 1 day trek", "Cozy village homestay"]
        ),
        (
            "sapa-motorbike-2d2n",
            "Tour Sa Pa 2N2Đ Xe Giường Nằm – Phượt Xe Máy Các Bản Làng (Homestay)",
            "Sapa 2 Days 2 Nights Sleeper Bus – Motorbike Village Adventure (Homestay)",
            "2 ngày 2 đêm", "2 days 2 nights", 2,
            "SAPA 2 DAYS 2 NIGHTS MORTOBIKE TOUR (HOMESTAY).docx",
            3350000, "Từ $135 xe giường nằm", "From $135 sleeper bus",
            "Khởi hành xe giường nằm từ Hà Nội, trải nghiệm 2 ngày cưỡi xe máy uốn lượn qua Bản Hồ, Nậm Toóng, Nậm Sài, Nậm Cang sâu trong núi.",
            "Overnight sleeper bus from Hanoi followed by 2 thrilling days motoring through deep valleys of Ban Ho, Nam Toong, Nam Sai, and Nam Cang.",
            ["Xe giường nằm đêm", "Phượt xe máy vùng sâu Tây Bắc", "Nghỉ đêm homestay Tả Van"],
            ["Night sleeper bus", "Deep Northwest motorbike ride", "Ta Van homestay stay"]
        )
    ]

    for m_item in moto_items:
        tid, n_vi, n_en, dur_vi, dur_en, noff, f_en, mprice, p_note_vi, p_note_en, card_vi, card_en, off_vi, off_en = m_item
        p_en_path = os.path.join(RAW_DOCS, "sapa may", "CHƯƠNG TRÌNH XE MÁY", f_en)
        moto_data = parse_sapa_motorbike_doc(p_en_path)

        itinerary_vi = []
        for step in moto_data.get("itinerary", []):
            time_vi = step["time"].replace("Day ", "Ngày ").replace("Night ", "Đêm ")
            title_vi = step["title"]
            text_vi = step["text"]
            if "pick you up" in text_vi.lower():
                title_vi = "Đón khách khởi hành"
            elif "arrive" in text_vi.lower():
                title_vi = "Đến Sa Pa"
            elif "lunch" in text_vi.lower():
                title_vi = "Ăn trưa tại nhà hàng"
            elif "breakfast" in text_vi.lower():
                title_vi = "Ăn sáng tại homestay"
            elif "dinner" in text_vi.lower():
                title_vi = "Ăn tối & nghỉ ngơi"
            elif "cooking" in text_vi.lower():
                title_vi = "Lớp học nấu ăn cùng gia chủ"
            elif "bus back to hanoi" in text_vi.lower():
                title_vi = "Lên xe trở về Hà Nội"
            itinerary_vi.append({
                "time": time_vi,
                "title": title_vi,
                "text": text_vi
            })

        tours.append({
            "id": tid,
            "destination": "sapa",
            "featured": False,
            "stars": 5,
            "name": n_vi,
            "nameEn": n_en,
            "durationLabel": dur_vi,
            "durationLabelEn": dur_en,
            "nightsOffset": noff,
            "price": 0,
            "priceNote": "Liên hệ",
            "priceNoteEn": "Contact",
            "image": sapa_ph,
            "media": [
                {
                    "type": "image",
                    "src": sapa_ph,
                    "alt": f"{n_vi} - The Dahlia Hanoi",
                    "altEn": f"{n_en} - The Dahlia Hanoi"
                }
            ],
            "cardLine": card_vi,
            "cardLineEn": card_en,
            "description": [card_vi],
            "descriptionEn": moto_data.get("intro") or [card_en],
            "itinerary": itinerary_vi,
            "itineraryEn": moto_data.get("itinerary") or [],
            "servicesIncluded": [
                "Xe đưa đón khứ hồi Hà Nội – Sa Pa",
                "01 hoặc 02 đêm nghỉ tại homestay bản Tả Van",
                "Xe máy và tài xế bản địa suốt hành trình",
                "Hướng dẫn viên tiếng Anh/Việt nhiệt tình",
                "Các bữa ăn theo chương trình",
                "Vé thắng cảnh các bản làng"
            ],
            "servicesIncludedEn": moto_data.get("included") or [],
            "servicesExcluded": [
                "Thuế VAT (+10%)",
                "Bảo hiểm du lịch",
                "Đồ uống trong các bữa ăn",
                "Chi tiêu cá nhân và tiền tip"
            ],
            "servicesExcludedEn": moto_data.get("excluded") or [],
            "serviceNote": "Chính sách trẻ em: Dưới 5 tuổi miễn phí (ngủ chung bố mẹ); 5-8 tuổi tính 75% giá; từ 9 tuổi tính như người lớn.",
            "serviceNoteEn": " ".join(moto_data.get("notes", [])) or "Children under 5 free; 5-8 years old 75%; 9+ charged as adult.",
            "offers": off_vi,
            "offersEn": off_en,
            "pricingTable": {
                "baseRate": "Báo giá trọn gói xe máy & homestay theo số lượng khách",
                "baseRateEn": "All-inclusive motorbike & homestay quote based on group size",
                "options": [
                    {"name": "Xe máy và tài xế bản địa suốt hành trình", "nameEn": "Motorbike with local rider throughout the tour", "price": "Đã bao gồm", "priceEn": "Included"},
                    {"name": "Trải nghiệm lớp nấu ăn truyền thống tại homestay", "nameEn": "Traditional homestay cooking class experience", "price": "Đã bao gồm", "priceEn": "Included"}
                ],
                "surcharges": [
                    {"name": "Thuế VAT", "nameEn": "Value Added Tax (VAT)", "price": "+10%", "priceEn": "+10%"}
                ],
                "childPolicy": sapa_child_policy
            }
        })

    return tours

def main():
    print("=" * 60)
    print("Starting Tour Extraction from ./raw_docs...")
    print("=" * 60)

    tours = build_all_tours()

    output_data = {
        "generatedAt": "2026-10-31",
        "totalTours": len(tours),
        "destinationsCovered": ["ha-noi", "sapa"],
        "tours": tours
    }

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"\n[SUCCESS] Extracted {len(tours)} tours successfully!")
    print(f"Output saved to: {OUTPUT_JSON}")
    print("\nSummary of extracted tours:")
    for idx, t in enumerate(tours):
        print(f" {idx+1:02d}. [{t['destination'].upper()}] {t['id']} | {t['name'][:36]}... | {t['price']:,}đ | {t['priceNote']}")

if __name__ == "__main__":
    main()
