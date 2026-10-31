#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
generate_all_tours.py
Extracts ALL 37 authoritative tours from raw_docs:
  - 6 Hanoi City Tours (3 Craft + 3 Traditional)
  - 19 Sapa Tours (15 Standard + 4 Motorbike)
  - 4 Ha Long – Lan Ha Cruise Tours (1 Overnight + 3 Day Cruises)
  - 8 Ninh Binh Tours (6 1-Day + 2 2-Day)
All with isolated images, menus, pricing tables ("Liên hệ"), and child policies.
"""

import os
import re
import json
import docx
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DOCS = os.path.join(ROOT_DIR, "raw_docs")
OUTPUT_JSON = os.path.join(ROOT_DIR, "tours.json")

def clean_str(s):
    if not s:
        return ""
    s = s.replace("\xa0", " ").strip()
    s = re.sub(r"\s+", " ", s)
    return s.strip()

def strip_bullet(s):
    s = clean_str(s)
    s = re.sub(r"^[•\-\*–—\d\.\)\✔\✅\❌]+\s*", "", s)
    return s.strip()

def parse_docx_sections(path):
    if not os.path.exists(path):
        return {"title": "", "intro": [], "itinerary": [], "included": [], "excluded": [], "notes": []}
    try:
        d = docx.Document(path)
    except Exception:
        return {"title": "", "intro": [], "itinerary": [], "included": [], "excluded": [], "notes": []}
    paras = [clean_str(p.text) for p in d.paragraphs if clean_str(p.text)]
    
    data = {
        "title": paras[0] if paras else "",
        "intro": [],
        "itinerary": [],
        "included": [],
        "excluded": [],
        "notes": []
    }
    
    time_re = re.compile(r"^(\d{1,2}[:h\.]\d{2}(?:\s*(?:AM|PM))?(?:\s*[-–]\s*\d{1,2}[:h\.]\d{2}(?:\s*(?:AM|PM))?)?)\s*[-–|:]\s*(.*)$", re.I)
    
    mode = "intro"
    curr_step = None
    
    for p in paras:
        up = p.upper()
        if "ĐIỂM NỔI BẬT" in up or "TOUR HIGHLIGHTS" in up or "HIGHLIGHTS" in up:
            mode = "intro"
            continue
        if ("LỊCH TRÌNH" in up or "ITINERARY" in up or "CHƯƠNG TRÌNH CHI TIẾT" in up or "SCHEDULE" in up) and len(p) < 60:
            mode = "itinerary"
            continue
        if ("BAO GỒM" in up or "INCLUDED" in up or "INCLUSION" in up) and ("KHÔNG" not in up and "EXCLUDE" not in up) and len(p) < 60:
            if curr_step:
                data["itinerary"].append(curr_step)
                curr_step = None
            mode = "included"
            continue
        if ("KHÔNG BAO GỒM" in up or "EXCLUDED" in up or "EXCLUSION" in up) and len(p) < 60:
            if curr_step:
                data["itinerary"].append(curr_step)
                curr_step = None
            mode = "excluded"
            continue
        if ("CHÍNH SÁCH" in up or "POLICY" in up or "LƯU Ý" in up or "NOTE" in up or "MANG THEO" in up or "PHỤ THU" in up) and len(p) < 60:
            if curr_step:
                data["itinerary"].append(curr_step)
                curr_step = None
            mode = "notes"
            continue
            
        if mode == "intro":
            if not p.startswith("CHƯƠNG TRÌNH") and not p.startswith("Tour ") and len(p) > 20:
                data["intro"].append(p)
        elif mode == "itinerary":
            m = time_re.match(p)
            if m:
                if curr_step:
                    data["itinerary"].append(curr_step)
                t_str = m.group(1).strip()
                rest = m.group(2).strip()
                title = rest
                text = rest
                if "|" in rest:
                    parts = rest.split("|", 1)
                    title = parts[0].strip()
                    text = parts[1].strip() if len(parts) > 1 and parts[1].strip() else title
                curr_step = {"time": t_str, "title": title, "text": text}
            elif p.startswith("NGÀY ") or p.startswith("DAY ") or p.startswith("ĐÊM ") or p.startswith("NIGHT "):
                if curr_step:
                    data["itinerary"].append(curr_step)
                curr_step = {"time": p, "title": p, "text": p}
            elif curr_step:
                curr_step["text"] += " " + p
        elif mode == "included":
            b = strip_bullet(p)
            if b and len(b) > 2:
                data["included"].append(b)
        elif mode == "excluded":
            b = strip_bullet(p)
            if b and len(b) > 2:
                data["excluded"].append(b)
        elif mode == "notes":
            b = strip_bullet(p)
            if b and len(b) > 2:
                data["notes"].append(b)
                
    if curr_step:
        data["itinerary"].append(curr_step)
        
    return data

# Load existing Hanoi and Sapa tours from extract_tours.py
from extract_tours import build_all_tours as extract_base_hanoi_sapa

def build_all_37_tours():
    print("1. Extracting Hanoi and Sapa tours (25 tours)...")
    base_tours = extract_base_hanoi_sapa()
    hanoi_sapa = base_tours[:25] # 6 Hanoi + 19 Sapa
    print(f"Extracted {len(hanoi_sapa)} Hanoi and Sapa tours.")
    
    all_tours = list(hanoi_sapa)
    
    # Common Child Policies
    halong_child_policy = [
        {"name": "Trẻ em 0–4 tuổi", "nameEn": "Children 0–4 years", "desc": "Miễn phí (tối đa 1 trẻ đi kèm 2 người lớn; từ trẻ thứ 2 tính 50%)", "descEn": "Free (max 1 child accompanied by 2 adults; 2nd child charged 50%)"},
        {"name": "Trẻ em 5–8 tuổi", "nameEn": "Children 5–8 years", "desc": "Tính 75% giá tour (ăn suất riêng, dịch vụ như người lớn)", "descEn": "75% of tour price (separate meal, full adult services)"},
        {"name": "Trẻ em từ 9 tuổi trở lên", "nameEn": "Children 9+ years", "desc": "Tính 100% tiêu chuẩn người lớn", "descEn": "Charged 100% as adult"}
    ]
    
    ninhbinh_child_policy = [
        {"name": "Trẻ em 1–4 tuổi", "nameEn": "Children 1–4 years", "desc": "Miễn phí (ngồi chung ghế với bố mẹ; phụ thu ghế riêng nếu yêu cầu)", "descEn": "Free (sharing seat with parents; surcharge if separate seat requested)"},
        {"name": "Trẻ em 5–8 tuổi", "nameEn": "Children 5–8 years", "desc": "Tính 75% giá tour (áp dụng cho 1 trẻ; trẻ thứ 2 tính 100%)", "descEn": "75% of adult price (applies to 1st child; 2nd child charged 100%)"},
        {"name": "Trẻ em từ 9 tuổi trở lên", "nameEn": "Children 9+ years", "desc": "Tính 100% tiêu chuẩn người lớn", "descEn": "Charged 100% as adult"}
    ]

    # =========================================================
    # 2. HA LONG & LAN HA CRUISE TOURS (4 TOURS)
    # =========================================================
    print("2. Extracting Ha Long & Lan Ha Cruise tours (4 tours)...")
    
    # 2.1 Cozy Bay Grand 4* - 2D1N Overnight
    cbg_vi = os.path.join(RAW_DOCS, "1. Hạ Long Tàu Ngủ", "Cozy Bay Grand - 4 Sao", "Chương Trình Tour", "2D1N COZY BAY GRAND Tiếng Việt.docx")
    cbg_en = os.path.join(RAW_DOCS, "1. Hạ Long Tàu Ngủ", "Cozy Bay Grand - 4 Sao", "Chương Trình Tour", "2D1N COZY BAY GRAND English.docx")
    p_cbg_vi = parse_docx_sections(cbg_vi)
    p_cbg_en = parse_docx_sections(cbg_en)
    
    all_tours.append({
        "id": "ha-long-cozy-bay-grand-2d1n",
        "destination": "ha-long",
        "featured": True,
        "stars": 4,
        "name": "Du Thuyền 4★ Cozy Bay Grand – Ngủ Đêm Vịnh Hạ Long 2N1Đ",
        "nameEn": "Cozy Bay Grand 4★ Cruise – Halong Bay Overnight 2 Days 1 Night",
        "durationLabel": "2 ngày 1 đêm",
        "durationLabelEn": "2 days 1 night",
        "nightsOffset": 1,
        "price": 0,
        "priceNote": "Liên hệ",
        "priceNoteEn": "Contact",
        "image": "img/tours/halong-cozy-bay-grand/overview-sundeck/Overview_0.JPG",
        "media": [
            {"type": "image", "src": "img/tours/halong-cozy-bay-grand/overview-sundeck/Overview_0.JPG", "alt": "Du thuyền Cozy Bay Grand 4 sao", "altEn": "Cozy Bay Grand 4-star Cruise"},
            {"type": "image", "src": "img/tours/halong-cozy-bay-grand/overview-sundeck/Sundeck_1.jpg", "alt": "Sundeck ngắm hoàng hôn vịnh Hạ Long", "altEn": "Sundeck sunset view Halong Bay"},
            {"type": "image", "src": "img/tours/halong-cozy-bay-grand/cabin-2nd-floordeluxe-double-balcony/Double_T2_Balcony_1.jpg", "alt": "Cabin Deluxe Balcony có ban công riêng", "altEn": "Deluxe Balcony private cabin"},
            {"type": "image", "src": "img/tours/halong-cozy-bay-grand/cabin-2nd-floorpremium-double-or-twin-terrace/Premium_Terrace_1.jpg", "alt": "Cabin Premium Terrace sân hiên rộng", "altEn": "Premium Terrace spacious cabin"},
            {"type": "image", "src": "img/tours/halong-cozy-bay-grand/restaurant/Restaurant_1.jpg", "alt": "Nhà hàng sang trọng trên du thuyền", "altEn": "Cruise dining restaurant"},
            {"type": "image", "src": "img/tours/halong-cozy-bay-grand/activities/Cooking_Class_2.JPG", "alt": "Lớp học làm nem cuốn truyền thống", "altEn": "Traditional cooking class"},
            {"type": "image", "src": "img/tours/halong-cozy-bay-grand/activities/Taichi_2.JPG", "alt": "Thái Cực Quyền đón bình minh trên sundeck", "altEn": "Morning Taichi on sundeck"}
        ],
        "cardLine": "Trải nghiệm kỳ nghỉ 2N1Đ đẳng cấp trên du thuyền Cozy Bay Grand 4 sao: phòng nghỉ sang trọng ngắm vịnh, buffet hải sản, kayak Hang Luồn, đảo Titov, lớp học nấu ăn và câu mực đêm.",
        "cardLineEn": "A memorable 2D1N overnight voyage on Cozy Bay Grand 4-star cruise: luxury bay-view cabins, seafood buffet, Luon Cave kayaking, Titov Island, cooking class, and night squid fishing.",
        "description": p_cbg_vi.get("intro") or ["Trải nghiệm vẻ đẹp của Vịnh Hạ Long trên du thuyền Cozy Bay Grand 4★, nơi thiết kế tinh tế hòa quyện cùng dịch vụ chu đáo."],
        "descriptionEn": p_cbg_en.get("intro") or ["Experience the beauty of Ha Long Bay aboard Cozy Bay Grand 4★, where elegant design blends with attentive hospitality."],
        "itinerary": p_cbg_vi.get("itinerary") or [],
        "itineraryEn": p_cbg_en.get("itinerary") or [],
        "servicesIncluded": p_cbg_vi.get("included") or [
            "Xe đời mới đưa đón khứ hồi Hà Nội – Hạ Long – Hà Nội",
            "01 đêm phòng nghỉ cao cấp trên du thuyền Cozy Bay Grand 4★",
            "Vé thắng cảnh: Hang Sửng Sốt, Đảo Titov, Hang Luồn",
            "Các bữa ăn trọn gói: 2 bữa buffet trưa + 1 bữa tối + 1 buffet sáng",
            "Chèo thuyền kayak hoặc đò nan & dụng cụ câu mực đêm",
            "Lớp học nấu ăn & tiệc trà chiều hoàng hôn trên sundeck",
            "Tập Thái Cực Quyền (Taichi) đón bình minh trên vịnh",
            "Hướng dẫn viên tiếng Anh/Việt suốt tuyến"
        ],
        "servicesIncludedEn": p_cbg_en.get("included") or [],
        "servicesExcluded": p_cbg_vi.get("excluded") or [
            "Đồ uống trên tàu",
            "Tiền tip cho hướng dẫn viên, lái xe và thủy thủ đoàn",
            "Chi phí cá nhân và dịch vụ spa",
            "Phụ thu các ngày lễ, Tết theo quy định"
        ],
        "servicesExcludedEn": p_cbg_en.get("excluded") or [],
        "serviceNote": "Có thực đơn món Ấn Độ (Indian Menu) và thực đơn ăn chay (Vegetarian Menu) miễn phí khi đăng ký trước.",
        "serviceNoteEn": "Indian Menu and Vegetarian Menu available complimentary upon advance request.",
        "offers": ["Phòng ngủ sang trọng ngắm vịnh", "Buffet hải sản + Menu Ấn Độ", "Chèo Kayak & Câu mực đêm"],
        "offersEn": ["Panoramic bay-view cabins", "Seafood buffet & Indian menu", "Kayaking & night squid fishing"],
        "pricingTable": {
            "baseRate": "Báo giá theo hạng Cabin (Deluxe T1, Balcony T2, Terrace)",
            "baseRateEn": "Custom quote based on Cabin tier (Deluxe, Balcony, Terrace)",
            "options": [
                {"name": "Hạng phòng Deluxe Double / Twin (Tầng 1)", "nameEn": "Deluxe Double / Twin Cabin (1st Floor)", "price": "Tiêu chuẩn", "priceEn": "Standard"},
                {"name": "Hạng phòng Deluxe Balcony (Tầng 2 có ban công riêng)", "nameEn": "Deluxe Balcony Cabin (2nd Floor private balcony)", "price": "Theo yêu cầu", "priceEn": "On request"},
                {"name": "Hạng phòng Premium Terrace (Tầng 2 sân hiên ngắm vịnh)", "nameEn": "Premium Terrace Cabin (2nd Floor private terrace)", "price": "Theo yêu cầu", "priceEn": "On request"},
                {"name": "Lựa chọn thực đơn Ấn Độ / Ăn chay", "nameEn": "Indian Set Menu or Vegetarian option", "price": "Miễn phí chọn trước", "priceEn": "Free upon request"}
            ],
            "surcharges": [
                {"name": "Phụ thu đêm Giáng sinh (24/12) & Đón năm mới (31/12)", "nameEn": "Christmas Eve (Dec 24) & New Year's Eve (Dec 31) surcharge", "price": "400.000đ / khách", "priceEn": "400,000 VND / guest"},
                {"name": "Phụ thu dịp Tết Nguyên Đán", "nameEn": "Lunar New Year surcharge", "price": "300.000đ / khách", "priceEn": "300,000 VND / guest"},
                {"name": "Phụ thu ngày lễ (30/4, 1/5, 2/9)", "nameEn": "National holidays (Apr 30, May 1, Sep 2)", "price": "200.000đ / khách", "priceEn": "200,000 VND / guest"}
            ],
            "childPolicy": [
                {"name": "Trẻ em 1–4 tuổi", "nameEn": "Children 1–4 years", "desc": "Miễn phí (ngủ chung bố mẹ; tối đa 1 trẻ/2 người lớn; trẻ thứ 2 tính 50%)", "descEn": "Free (sharing bed with parents; max 1 child/2 adults; 2nd child charged 50%)"},
                {"name": "Trẻ em 5–8 tuổi", "nameEn": "Children 5–8 years", "desc": "Tính 75% giá người lớn (ngủ chung bố mẹ, hưởng tiêu chuẩn ăn riêng)", "descEn": "75% of adult fare (sharing bed with parents, separate meal)"},
                {"name": "Trẻ em từ 9 tuổi trở lên", "nameEn": "Children 9+ years", "desc": "Tính 100% tiêu chuẩn người lớn", "descEn": "Charged 100% as adult"}
            ]
        }
    })

    # 2.2 Cozy Bay Premium 5* - 1D Day Cruise
    cbp_vi = os.path.join(RAW_DOCS, "2. Hạ Long 1 Ngày", "Cozy Bay Premium", "Chương Trình Tour", "Cozy Bay Premium - Tiếng Việt.docx")
    cbp_en = os.path.join(RAW_DOCS, "2. Hạ Long 1 Ngày", "Cozy Bay Premium", "Chương Trình Tour", "Cozy Bay Premium -Tiếng Anh.docx")
    p_cbp_vi = parse_docx_sections(cbp_vi)
    p_cbp_en = parse_docx_sections(cbp_en)

    all_tours.append({
        "id": "ha-long-cozy-bay-premium-1d",
        "destination": "ha-long",
        "featured": True,
        "stars": 5,
        "name": "Du Thuyền 5★ Cozy Bay Premium – Vịnh Hạ Long Tuyến 2 (1 Ngày)",
        "nameEn": "Cozy Bay Premium 5★ Cruise – Halong Bay Route 2 (1 Day)",
        "durationLabel": "1 ngày",
        "durationLabelEn": "1 day",
        "nightsOffset": 0,
        "price": 0,
        "priceNote": "Liên hệ",
        "priceNoteEn": "Contact",
        "image": "img/tours/halong-cozy-bay-premium/anh-tau/Over_View_1.jpg",
        "media": [
            {"type": "image", "src": "img/tours/halong-cozy-bay-premium/anh-tau/Over_View_1.jpg", "alt": "Siêu du thuyền Cozy Bay Premium 5 sao", "altEn": "Cozy Bay Premium 5-star yacht"},
            {"type": "image", "src": "img/tours/halong-cozy-bay-premium/anh-tau/Over_View_3.jpg", "alt": "Sundeck tiệc hoàng hôn lãng mạn", "altEn": "Sundeck sunset party"},
            {"type": "image", "src": "img/tours/halong-cozy-bay-premium/anh-tau/Over_View_6.jpg", "alt": "Nhà hàng buffet sang trọng trên tàu", "altEn": "Luxury dining restaurant"},
            {"type": "image", "src": "img/tours/halong-cozy-bay-premium/buffet-lunch/HALONG_DAYTRIP_menu.jpg", "alt": "Thực đơn Buffet hải sản Hạ Long", "altEn": "Halong seafood buffet menu"},
            {"type": "image", "src": "img/tours/halong-cozy-bay-premium/indian-set-menu/Indian_Set_Menu.jpg", "alt": "Thực đơn món Ấn Độ riêng biệt", "altEn": "Authentic Indian set menu"}
        ],
        "video": "img/tours/halong-cozy-bay-premium/video/Cozy_Bay_Cruise_45mb.mp4",
        "cardLine": "Hành trình 1 ngày trên siêu du thuyền Cozy Bay Premium 5 sao: khám phá Hang Sửng Sốt, chèo kayak Hang Luồn, tắm biển đảo Titov, buffet hải sản và tiệc hoàng hôn trên sundeck.",
        "cardLineEn": "A full-day luxury experience aboard the 5-star Cozy Bay Premium Cruise: explore Sung Sot Cave, kayak Luon Cave, Titov Island beach, seafood buffet, and sunset party.",
        "description": p_cbp_vi.get("intro") or ["Từ trên cao nhìn xuống, Vịnh Hạ Long như một bức tranh khổng lồ vô cùng sống động."],
        "descriptionEn": p_cbp_en.get("intro") or ["Admire Halong Bay from our luxury 5-star day cruiser featuring gourmet dining and scenic cave excursions."],
        "itinerary": p_cbp_vi.get("itinerary") or [],
        "itineraryEn": p_cbp_en.get("itinerary") or [],
        "servicesIncluded": p_cbp_vi.get("included") or [
            "Xe đưa đón khứ hồi Hà Nội – Hạ Long",
            "Vé tham quan Hang Sửng Sốt, Đảo Titov, Hang Luồn",
            "Hướng dẫn viên tiếng Anh/Việt nhiệt tình",
            "Bữa trưa Buffet hải sản hoặc Thực đơn kiểu Ấn Độ",
            "Tiệc hoàng hôn Sunset Party (trà, bánh ngọt, trái cây)",
            "Chèo kayak hoặc đi thuyền nan Hang Luồn",
            "01 chai nước khoáng/người trên xe"
        ],
        "servicesIncludedEn": p_cbp_en.get("included") or [],
        "servicesExcluded": p_cbp_vi.get("excluded") or [
            "Thuế VAT (+10%)",
            "Đồ uống trong bữa ăn và tại quầy bar",
            "Tiền tip cho hướng dẫn viên, lái xe và thủy thủ đoàn",
            "Chi phí cá nhân và phụ thu lễ Tết"
        ],
        "servicesExcludedEn": p_cbp_en.get("excluded") or [],
        "serviceNote": "Khách lựa chọn thực đơn Ấn Độ (Indian Set Menu) vui lòng thông báo trước khi khởi hành.",
        "serviceNoteEn": "Guests selecting the Indian Set Menu please inform in advance before departure.",
        "offers": ["Hang Sửng Sốt & Đảo Titov", "Buffet hải sản + Thực đơn Ấn", "Tiệc hoàng hôn Sunset Party"],
        "offersEn": ["Sung Sot Cave & Titov Island", "Seafood buffet & Indian menu", "Sundeck Sunset Party"],
        "pricingTable": {
            "baseRate": "Báo giá trọn gói du thuyền 5 sao & xe đưa đón",
            "baseRateEn": "All-inclusive quote with 5-star cruise & transfer",
            "options": [
                {"name": "Nâng cấp xe đưa đón Thaco Limousine cao cấp", "nameEn": "Upgrade to Thaco Limousine transfer", "price": "+100.000đ / khách", "priceEn": "+100,000 VND / guest"},
                {"name": "Lựa chọn thực đơn Ấn Độ (Indian Set Menu)", "nameEn": "Indian Set Menu meal option", "price": "Miễn phí đăng ký trước", "priceEn": "Complimentary on request"}
            ],
            "surcharges": [
                {"name": "Ghế riêng cho trẻ 0–4 tuổi trên xe Limousine", "nameEn": "Separate seat for child 0–4 on Limousine", "price": "300.000đ / trẻ", "priceEn": "300,000 VND / child"},
                {"name": "Ghế riêng cho trẻ 0–4 tuổi trên xe Shuttle Bus", "nameEn": "Separate seat for child 0–4 on Shuttle Bus", "price": "200.000đ / trẻ", "priceEn": "200,000 VND / child"},
                {"name": "Phụ thu ngày lễ / Tết", "nameEn": "Public holiday / Tet surcharge", "price": "100.000đ / khách", "priceEn": "100,000 VND / guest"}
            ],
            "childPolicy": halong_child_policy
        }
    })

    # 2.3 Sea Lion Premium 5* - 1D Day Cruise
    slp_vi = os.path.join(RAW_DOCS, "2. Hạ Long 1 Ngày", "Sea Lion Premium", "Chương Trình Tour", "Tiếng Việt - Sea Lion Premium Cruise.docx")
    slp_en = os.path.join(RAW_DOCS, "2. Hạ Long 1 Ngày", "Sea Lion Premium", "Chương Trình Tour", "Tiếng Anh - Sea Lion Premium Cruise.docx")
    p_slp_vi = parse_docx_sections(slp_vi)
    p_slp_en = parse_docx_sections(slp_en)

    all_tours.append({
        "id": "ha-long-sea-lion-premium-1d",
        "destination": "ha-long",
        "featured": False,
        "stars": 5,
        "name": "Du Thuyền 5★ Sea Lion Premium – Vịnh Hạ Long Tuyến 2 (1 Ngày)",
        "nameEn": "Sea Lion Premium 5★ Cruise – Halong Bay Classic Route 2 (1 Day)",
        "durationLabel": "1 ngày",
        "durationLabelEn": "1 day",
        "nightsOffset": 0,
        "price": 0,
        "priceNote": "Liên hệ",
        "priceNoteEn": "Contact",
        "image": "img/tours/halong-sea-lion-premium/anh-tau/Over_View_1.jpg",
        "media": [
            {"type": "image", "src": "img/tours/halong-sea-lion-premium/anh-tau/Over_View_1.jpg", "alt": "Du thuyền Sea Lion Premium 5 sao", "altEn": "Sea Lion Premium 5-star yacht"},
            {"type": "image", "src": "img/tours/halong-sea-lion-premium/anh-tau/Over_View_.jpg", "alt": "Toàn cảnh du thuyền Sea Lion trên vịnh", "altEn": "Panoramic Sea Lion cruise view"},
            {"type": "image", "src": "img/tours/halong-sea-lion-premium/buffet-lunch/HALONG_DAYTRIP_menu.jpg", "alt": "Thực đơn buffet trưa trên tàu", "altEn": "Buffet lunch onboard menu"},
            {"type": "image", "src": "img/tours/halong-sea-lion-premium/indian-set-menu/Indian_Set_Menu.jpg", "alt": "Thực đơn món Ấn Độ tiêu chuẩn", "altEn": "Indian set menu"}
        ],
        "cardLine": "Hành trình 1 ngày cùng du thuyền Sea Lion Premium 5 sao qua các danh thắng kỳ vĩ nhất vịnh Hạ Long: hang Sửng Sốt kỳ ảo, chèo thuyền Hang Luồn, bơi lội đảo Titov.",
        "cardLineEn": "A full-day 5-star voyage on Sea Lion Premium Cruise through Halong's top landmarks: magical Sung Sot Cave, Luon Cave kayaking, and Titov Island swimming.",
        "description": p_slp_vi.get("intro") or ["Chiêm ngưỡng trọn vẹn vịnh Hạ Long trên du thuyền sang trọng Sea Lion Premium."],
        "descriptionEn": p_slp_en.get("intro") or ["Explore the wonders of Halong Bay aboard the elegant Sea Lion Premium Cruise."],
        "itinerary": p_slp_vi.get("itinerary") or [],
        "itineraryEn": p_slp_en.get("itinerary") or [],
        "servicesIncluded": p_slp_vi.get("included") or [
            "Xe đưa đón khứ hồi Hà Nội – Hạ Long",
            "Vé tham quan trọn gói các điểm theo tuyến 2",
            "Bữa trưa Buffet hải sản / Thực đơn Ấn Độ",
            "Chèo thuyền kayak hoặc đò nan Hang Luồn",
            "Tiệc trà hoàng hôn Sunset Party trên sundeck",
            "Hướng dẫn viên chuyên nghiệp suốt hành trình"
        ],
        "servicesIncludedEn": p_slp_en.get("included") or [],
        "servicesExcluded": p_slp_vi.get("excluded") or [
            "Thuế VAT", "Đồ uống", "Tiền tip và chi phí cá nhân", "Phụ thu ngày lễ"
        ],
        "servicesExcludedEn": p_slp_en.get("excluded") or [],
        "serviceNote": "Hỗ trợ đoàn khách có nhu cầu ẩm thực chay, Halal hoặc Ấn Độ.",
        "serviceNoteEn": "Vegetarian, Halal and Indian meal options supported upon booking.",
        "offers": ["Hang Sửng Sốt & Hang Luồn", "Bữa trưa buffet hải sản phong phú", "Đảo Titov & ngắm toàn cảnh"],
        "offersEn": ["Sung Sot Cave & Luon Cave", "Abundant seafood buffet", "Titov Island panoramic view"],
        "pricingTable": {
            "baseRate": "Báo giá trọn gói du thuyền 5 sao & xe đưa đón",
            "baseRateEn": "All-inclusive quote with 5-star cruise & transfer",
            "options": [
                {"name": "Nâng cấp xe đưa đón Thaco Limousine cao cấp", "nameEn": "Upgrade to Thaco Limousine transfer", "price": "+100.000đ / khách", "priceEn": "+100,000 VND / guest"}
            ],
            "surcharges": [
                {"name": "Phụ thu ngày lễ / Tết", "nameEn": "Holiday / Tet surcharge", "price": "100.000đ / khách", "priceEn": "100,000 VND / guest"}
            ],
            "childPolicy": halong_child_policy
        }
    })

    # 2.4 Tropical Cruise 5* - Lan Ha & Cat Ba (7 Hours)
    tc_vi = os.path.join(RAW_DOCS, "3. Lan Hạ 1 Ngày", "Tropical Cruise", "Chương Trình Tour", "Tiếng Việt - Tropical Cruise.docx")
    tc_en = os.path.join(RAW_DOCS, "3. Lan Hạ 1 Ngày", "Tropical Cruise", "Chương Trình Tour", "Tiếng Anh - Tropical Cruise.docx")
    p_tc_vi = parse_docx_sections(tc_vi)
    p_tc_en = parse_docx_sections(tc_en)

    all_tours.append({
        "id": "ha-long-lan-ha-tropical-cruise-1d",
        "destination": "ha-long",
        "featured": True,
        "stars": 5,
        "name": "Du Thuyền 5★ Tropical Cruise – Vịnh Lan Hạ & Đảo Cát Bà (7 Tiếng)",
        "nameEn": "Tropical Cruise 5★ – Lan Ha Bay & Cat Ba Island Odyssey (7 Hours)",
        "durationLabel": "1 ngày (7 tiếng)",
        "durationLabelEn": "1 day (7 hours)",
        "nightsOffset": 0,
        "price": 0,
        "priceNote": "Liên hệ",
        "priceNoteEn": "Contact",
        "image": "img/tours/lanha-tropical-cruise/anh/Tropical_-_00.jpg",
        "media": [
            {"type": "image", "src": "img/tours/lanha-tropical-cruise/anh/Tropical_-_00.jpg", "alt": "Du thuyền Tropical Cruise 5 sao trên vịnh Lan Hạ", "altEn": "5-star Tropical Cruise in Lan Ha Bay"},
            {"type": "image", "src": "img/tours/lanha-tropical-cruise/anh/Tropical_-_04_.jpg", "alt": "Bể sục Jacuzzi và máng trượt nước ngoài trời", "altEn": "Onboard Jacuzzi and water slide"},
            {"type": "image", "src": "img/tours/lanha-tropical-cruise/anh/Tropical_-_07.jpg", "alt": "Chèo kayak giữa làn nước xanh biếc Lan Hạ", "altEn": "Kayaking in turquoise Lan Ha waters"},
            {"type": "image", "src": "img/tours/lanha-tropical-cruise/anh/Tropical_-_12.jpg", "alt": "Xe điện xuyên rừng quốc gia Cát Bà", "altEn": "Electric cart in Cat Ba national park"},
            {"type": "image", "src": "img/tours/lanha-tropical-cruise/buffet-lunch/TROPICAL_DAYTRIP_menu_.jpg", "alt": "Thực đơn Buffet hải sản Cát Bà", "altEn": "Cat Ba seafood buffet menu"},
            {"type": "image", "src": "img/tours/lanha-tropical-cruise/indian-set-menu/Indian_Set_Menu.jpg", "alt": "Thực đơn món Ấn Độ riêng", "altEn": "Dedicated Indian set menu"}
        ],
        "video": "img/tours/lanha-tropical-cruise/video/TROPICAL_CRUISE_2.mp4",
        "cardLine": "Chuyến hải trình 7 tiếng độc bản trên vịnh Lan Hạ và đảo Cát Bà: đi xe điện xuyên rừng quốc gia, khám phá Động Trung Trang, bể sục Jacuzzi, máng trượt nước và kayak giữa biển xanh.",
        "cardLineEn": "An exclusive 7-hour odyssey across Lan Ha Bay and Cat Ba Island: electric jungle cart, Trung Trang Cave, onboard Jacuzzi, water slide, and ocean kayaking.",
        "description": p_tc_vi.get("intro") or ["Hành trình ĐỘC BẢN tham quan Vịnh Lan Hạ - Đảo Cát Bà 1 Ngày – 7 tiếng trên du thuyền 5 sao Tropical Cruise."],
        "descriptionEn": p_tc_en.get("intro") or ["An exclusive 7-hour luxury cruise discovering pristine Lan Ha Bay and lush Cat Ba Island."],
        "itinerary": p_tc_vi.get("itinerary") or [],
        "itineraryEn": p_tc_en.get("itinerary") or [],
        "servicesIncluded": p_tc_vi.get("included") or [
            "Xe Thaco Limousine đưa đón khứ hồi cao tốc Hà Nội – Tuần Châu",
            "7 tiếng du ngoạn trên du thuyền 5 sao Tropical Cruise",
            "Xe điện xuyên rừng tham quan Động Trung Trang & Vườn Quốc Gia Cát Bà",
            "Bữa trưa Buffet thượng hạng / Set Menu Ấn Độ",
            "Trải nghiệm máng trượt nước, bể sục Jacuzzi và bể phao bơi trên biển",
            "Chèo xuồng Kayak ngắm vịnh Lan Hạ hoang sơ",
            "Tiệc trà chiều hoàng hôn Sunset Party cùng âm nhạc",
            "Vé thắng cảnh trọn gói & HDV tiếng Anh/Việt"
        ],
        "servicesIncludedEn": p_tc_en.get("included") or [],
        "servicesExcluded": p_tc_vi.get("excluded") or [
            "Thuế VAT", "Đồ uống tại quầy bar và trong bữa ăn", "Chi phí cá nhân", "Phụ thu ngày lễ"
        ],
        "servicesExcludedEn": p_tc_en.get("excluded") or [],
        "serviceNote": "Quý khách nên chuẩn bị đồ bơi, kem chống nắng và kính râm để tận hưởng máng trượt nước và bể Jacuzzi.",
        "serviceNoteEn": "Swimwear, sunglasses and sunscreen recommended to enjoy onboard Jacuzzi and water slide.",
        "offers": ["Xe điện xuyên rừng & Động Trung Trang", "Bể Jacuzzi & Cầu trượt nước", "Buffet trưa & Menu Ấn Độ"],
        "offersEn": ["Jungle cart & Trung Trang Cave", "Jacuzzi & Water Slide", "Lunch buffet & Indian menu"],
        "pricingTable": {
            "baseRate": "Báo giá trọn gói du thuyền 5 sao & xe điện Cát Bà",
            "baseRateEn": "All-inclusive quote for 5-star cruise & Cat Ba island transfer",
            "options": [
                {"name": "Trải nghiệm máng trượt nước & Bể sục Jacuzzi ngoài trời", "nameEn": "Water slide & outdoor Jacuzzi experience", "price": "Đã bao gồm", "priceEn": "Included"},
                {"name": "Xe điện xuyên rừng quốc gia Cát Bà", "nameEn": "Electric cart ride through Cat Ba National Park", "price": "Đã bao gồm", "priceEn": "Included"},
                {"name": "Lựa chọn thực đơn Ấn Độ (Indian Set Menu)", "nameEn": "Indian Set Menu meal option", "price": "Miễn phí đăng ký trước", "priceEn": "Complimentary on request"}
            ],
            "surcharges": [
                {"name": "Phụ thu các ngày lễ / Tết", "nameEn": "Public holiday / Tet surcharge", "price": "100.000đ / khách", "priceEn": "100,000 VND / guest"}
            ],
            "childPolicy": [
                {"name": "Trẻ em 0–5 tuổi", "nameEn": "Children 0–5 years", "desc": "Miễn phí (tối đa 1 trẻ đi kèm 2 người lớn; từ trẻ thứ 2 tính 50%)", "descEn": "Free (max 1 child with 2 adults; 2nd child charged 50%)"},
                {"name": "Trẻ em từ 6 tuổi trở lên", "nameEn": "Children 6+ years", "desc": "Tính 100% tiêu chuẩn người lớn", "descEn": "Charged 100% as adult"}
            ]
        }
    })

    # =========================================================
    # 3. NINH BINH TOURS (8 TOURS)
    # =========================================================
    print("3. Extracting Ninh Binh tours (8 tours)...")
    nb_defs = [
        (
            "ninh-binh-hoalu-tamcoc-mua-1d",
            "Tour Ninh Bình 1 Ngày: Hoa Lư – Tam Cốc – Hang Múa",
            "Ninh Binh Day Tour: Hoa Lu – Tam Coc – Mua Cave",
            "1 ngày", "1 day", 0, True,
            "1. HOA LƯ - TAM CỐC - HANG MÚA.docx",
            "1. HOALU-TAM COC-MUA CAVE DAY TRIP.docx",
            "img/destinations/ninh-binh/tam-coc-boat.jpg",
            "Khám phá cố đô Hoa Lư nghìn năm lịch sử, ngồi thuyền nan xuôi dòng sông Ngô Đồng qua Tam Cốc và chinh phục 500 bậc đá đỉnh Hang Múa ngắm toàn cảnh thung lũng lúa.",
            "Explore historic Hoa Lu ancient capital, take a peaceful Tam Coc sampan boat ride, and conquer 500 stone steps to Mua Cave summit for panoramic valley views.",
            ["Đỉnh Hang Múa ngoạn mục", "Đi thuyền nan Tam Cốc", "Cố đô Hoa Lư lịch sử"],
            ["Breathtaking Mua Cave", "Tam Coc sampan boat ride", "Historic Hoa Lu Capital"]
        ),
        (
            "ninh-binh-hoalu-trangan-mua-1d",
            "Tour Ninh Bình 1 Ngày: Hoa Lư – Tràng An – Hang Múa",
            "Ninh Binh Day Tour: Hoa Lu – Trang An – Mua Cave",
            "1 ngày", "1 day", 0, True,
            "2. HOA LƯ - TRÀNG AN - HANG MÚA.docx",
            "2. HOALU-TRANG AN -MUA CAVE DAY TRIP.docx",
            "img/destinations/ninh-binh/trang-an-boat.jpg",
            "Hành trình khám phá di sản thế giới Tràng An bằng thuyền nan luồn qua các hang động kỳ ảo, thăm đền vua Đinh - Tiền Lê tại Hoa Lư và ngắm nhìn hoàng hôn trên đỉnh Hang Múa.",
            "Discover UNESCO World Heritage Trang An by sampan boat through magical river caves, visit King Dinh-Le temples at Hoa Lu, and catch the sunset on Mua Cave peak.",
            ["Quần thể di sản Tràng An", "Cố đô Hoa Lư", "Đỉnh Hang Múa check-in"],
            ["UNESCO Trang An caves", "Hoa Lu Ancient Temples", "Mua Cave summit viewpoint"]
        ),
        (
            "ninh-binh-hoalu-tamcoc-1d",
            "Tour Ninh Bình 1 Ngày: Cố Đô Hoa Lư – Đạp Xe & Đi Thuyền Tam Cốc",
            "Ninh Binh Day Tour: Hoa Lu Ancient Capital – Cycling & Tam Coc Boat",
            "1 ngày", "1 day", 0, False,
            "3. HOA LƯ-TAM CỐC 1 NGÀY.docx",
            "3. HOALU-TAM COC- CYCLING DAY TRIP.docx",
            "img/tours/ninh-binh/xe-ap/Cozy-NinhBinh-01.jpg",
            "Chuyến đi nhẹ nhàng thư thái: viếng cố đô Hoa Lư, thưởng thức buffet đặc sản và thong dong đạp xe xuyên qua những ngôi làng cổ kính dưới chân núi đá vôi Tam Cốc.",
            "A relaxing cultural day: visit Hoa Lu capital, savor local buffet cuisine, and leisurely cycle through picturesque villages beneath Tam Coc's limestone karsts.",
            ["Đi thuyền Tam Cốc", "Thong dong đạp xe làng quê", "Buffet đặc sản Ninh Bình"],
            ["Tam Coc boat ride", "Countryside cycling", "Authentic buffet lunch"]
        ),
        (
            "ninh-binh-hoalu-trangan-1d",
            "Tour Ninh Bình 1 Ngày: Cố Đô Hoa Lư – Đi Thuyền Di Sản Tràng An",
            "Ninh Binh Day Tour: Hoa Lu Ancient Capital – Trang An Boat Trip",
            "1 ngày", "1 day", 0, False,
            "4. HOA LƯ-TRÀNG AN 1 NGÀY.docx",
            "4. HOALU-TRANG AN - CYCLING DAY TRIP.docx",
            "img/destinations/ninh-binh/hoa-lu.jpg",
            "Hành trình trọn vẹn khám phá vùng đất địa linh nhân kiệt: thăm đền thờ hai vị vua triều Đinh - Lê và ngồi thuyền khám phá 4 hang động kỳ vĩ tại quần thể Tràng An.",
            "Complete heritage journey: visit historic Dinh-Le dynastic temples and embark on a scenic sampan boat expedition through Trang An's subterranean river caves.",
            ["Du thuyền di sản Tràng An", "Đền Vua Đinh - Vua Lê", "Ăn trưa buffet phong phú"],
            ["Trang An heritage boat", "King Dinh & Le Temples", "Generous buffet lunch"]
        ),
        (
            "ninh-binh-baidinh-trangan-1d",
            "Tour Ninh Bình 1 Ngày: Đại Tượng Phật Chùa Bái Đính – Di Sản Tràng An",
            "Ninh Binh Day Tour: Bai Dinh Pagoda – Trang An Ecotourism",
            "1 ngày", "1 day", 0, False,
            "5. BÁI ĐÍNH-TRÀNG AN 1 NGÀY.docx",
            "5. BAI DINH-TRANG AN DAY TRIP.docx",
            "img/tours/ninh-binh-bai-dinh.jpg",
            "Chiêm bái ngôi chùa Bái Đính giữ nhiều kỷ lục nhất Đông Nam Á và du ngoạn bằng thuyền nan khám phá hệ thống hang động nước ngầm lung linh tại Tràng An.",
            "Visit Southeast Asia's most record-holding Buddhist complex at Bai Dinh and cruise through the tranquil emerald waterways of Trang An.",
            ["Chùa Bái Đính đồ sộ", "Thuyền nan hang động Tràng An", "Xe điện Bái Đính 2 chiều"],
            ["Monumental Bai Dinh Pagoda", "Trang An Cave sampan", "Round-trip electric cart"]
        ),
        (
            "ninh-binh-baidinh-trangan-mua-1d",
            "Tour Ninh Bình 1 Ngày: Bái Đính – Tràng An – Chinh Phục Hang Múa",
            "Ninh Binh Day Tour: Bai Dinh Pagoda – Trang An – Mua Cave Summit",
            "1 ngày", "1 day", 0, False,
            "6. BÁI ĐÍNH-TRÀNG AN-HANG MÚA 1 NGÀY.docx",
            "6. BAI DINH-TRAN GAN-MUA CAVE DAY TRIP.docx",
            "img/destinations/ninh-binh/mua-cave-peak.jpg",
            "Hành trình kết hợp tam giác danh thắng hàng đầu Ninh Bình: viếng quần thể tâm linh Bái Đính, đi thuyền xuyên lòng hang Tràng An và leo 500 bậc đá lên Vạn Lý Trường Thành thu nhỏ.",
            "The quintessential Ninh Binh trifecta: spiritual wonders at Bai Dinh, subterranean boat voyage through Trang An, and breathtaking dragon-ridge hike atop Mua Cave.",
            ["Đại tự Bái Đính", "Di sản Tràng An", "Đỉnh Ngọa Long Hang Múa"],
            ["Grand Bai Dinh Pagoda", "Trang An Grottoes", "Dragon Ridge Mua Cave"]
        ),
        (
            "ninh-binh-hoalu-tamcoc-mua-baidinh-trangan-2d1n",
            "Tour Ninh Bình Trọn Vẹn 2N1Đ: Hoa Lư – Tam Cốc – Múa – Bái Đính – Tràng An",
            "Complete Ninh Binh 2D1N: Hoa Lu – Tam Coc – Mua Cave – Bai Dinh – Trang An",
            "2 ngày 1 đêm", "2 days 1 night", 1, True,
            "7. HOA LƯ-TAM CỐC- HANG MÚA-BÁI ĐÍNH-TRÀNG AN 2 NGÀY.docx",
            "7. HOA LU-TAM COC-BAI DINH-TRANG AN- MUA CAVE.docx",
            "img/destinations/ninh-binh/trang-an-cave.jpg",
            "Tour 2 ngày 1 đêm lưu trú khách sạn/bungalow thơ mộng, trải nghiệm đầy đủ tất cả danh lam thắng cảnh bậc nhất Ninh Bình: Tam Cốc, Tràng An, Hang Múa, Bái Đính và Hoa Lư.",
            "A comprehensive 2D1N getaway with charming bungalow/hotel stay, covering every hallmark wonder of Ninh Binh: Tam Coc, Trang An, Mua Cave, Bai Dinh, and Hoa Lu.",
            ["Đủ 5 điểm danh thắng lớn", "Nghỉ đêm Bungalow/Khách sạn", "Đạp xe ngắm hoàng hôn"],
            ["All 5 top landmarks", "Cozy Bungalow/Hotel night", "Sunset countryside ride"]
        ),
        (
            "ninh-binh-halong-2d1n",
            "Tour Liên Tuyến 2N1Đ: Ninh Bình (Hoa Lư – Tam Cốc / Tràng An) – Vịnh Hạ Long",
            "2D1N Combo Tour: Ninh Binh (Hoa Lu – Tam Coc / Trang An) & Halong Bay Cruise",
            "2 ngày 1 đêm", "2 days 1 night", 1, True,
            "8. HOA LƯ-TAM CỐC_ TRÀNG AN-VỊNH HẠ LONG 2 NGÀY.docx",
            "8. HOA LU -TRANG AN - TAM COC-MUA CAVE - HALONG BAY.docx",
            "img/destinations/ninh-binh/tam-coc-rice.jpg",
            "Chuyến đi kết hợp hoàn hảo hai di sản hàng đầu miền Bắc: 1 ngày khám phá cố đô và hang động Ninh Bình, 1 ngày du ngoạn vịnh Hạ Long kỳ quan thế giới.",
            "A seamless 2-day dual-heritage combination: day 1 amidst ancient capitals and karst rivers in Ninh Binh, followed by day 2 cruising Halong Bay's wonder seascape.",
            ["Kết hợp Ninh Bình & Hạ Long", "1 đêm khách sạn tiện nghi", "Xe đưa đón khứ hồi trọn gói"],
            ["Dual Heritage combo", "Comfortable hotel stay", "Seamless transfers included"]
        )
    ]

    for nb_item in nb_defs:
        tid, n_vi, n_en, dur_vi, dur_en, noff, is_feat, f_vi, f_en, img_main, card_vi, card_en, off_vi, off_en = nb_item
        sub_folder = "1 NGÀY TIẾNG VIỆT" if noff == 0 else "2 NGÀY TIẾNG VIỆT"
        sub_folder_en = "1 NGÀY TIẾNG ANH" if noff == 0 else "2 NGÀY TIẾNG ANH"
        
        p_vi_path = os.path.join(RAW_DOCS, "4. Ninh Bình Tours", "Chương Trình Tour", sub_folder, f_vi)
        p_en_path = os.path.join(RAW_DOCS, "4. Ninh Bình Tours", "Chương Trình Tour", sub_folder_en, f_en)
        
        doc_vi = parse_docx_sections(p_vi_path)
        doc_en = parse_docx_sections(p_en_path)
        
        all_tours.append({
            "id": tid,
            "destination": "ninh-binh",
            "featured": is_feat,
            "stars": 5,
            "name": n_vi,
            "nameEn": n_en,
            "durationLabel": dur_vi,
            "durationLabelEn": dur_en,
            "nightsOffset": noff,
            "price": 0,
            "priceNote": "Liên hệ",
            "priceNoteEn": "Contact",
            "image": img_main,
            "media": [
                {"type": "image", "src": img_main, "alt": f"{n_vi} - The Dahlia Hanoi", "altEn": f"{n_en} - The Dahlia Hanoi"},
                {"type": "image", "src": "img/tours/ninh-binh/xe-ap/Cozy-NinhBinh-01.jpg", "alt": "Đạp xe ngắm cảnh đồng lúa làng quê", "altEn": "Scenic countryside cycling tour"},
                {"type": "image", "src": "img/tours/ninh-binh/nha-hangnha-hang-buffet-t3/Cozy-NinhBinh-03.jpg", "alt": "Nhà hàng Buffet đặc sản Ninh Bình", "altEn": "Local specialty buffet restaurant"},
                {"type": "image", "src": "img/tours/ninh-binh/nha-hang-buffet-an/Indian_Buffet_Menu.jpg", "alt": "Thực đơn Buffet Ấn Độ phong phú", "altEn": "Rich Indian buffet menu"},
                {"type": "image", "src": "img/tours/ninh-binh/menu-halal/Halal_Food_01.jpg", "alt": "Thực đơn món Halal có chứng chỉ", "altEn": "Halal certified food options"},
                {"type": "image", "src": "img/fleet/limousine-bus/Thaco_Limousine_2.jpg", "alt": "Xe Thaco Limousine đưa đón cao cấp", "altEn": "Premium Thaco Limousine transfer"}
            ],
            "cardLine": card_vi,
            "cardLineEn": card_en,
            "description": doc_vi.get("intro") or [card_vi],
            "descriptionEn": doc_en.get("intro") or [card_en],
            "itinerary": doc_vi.get("itinerary") or [],
            "itineraryEn": doc_en.get("itinerary") or [],
            "servicesIncluded": doc_vi.get("included") or [
                "Xe chất lượng cao đưa đón khứ hồi Hà Nội – Ninh Bình",
                "Vé tham quan và vé đi thuyền nan theo chương trình",
                "Bữa trưa Buffet đặc sản tại nhà hàng (có tùy chọn Halal / Món Ấn)",
                "Hoạt động đạp xe khám phá đường làng ngõ xóm",
                "Hướng dẫn viên tiếng Anh/Việt nhiệt tình chu đáo",
                "Miễn phí sử dụng áo mưa và nón lá truyền thống",
                "Nước khoáng đóng chai trên xe"
            ],
            "servicesIncludedEn": doc_en.get("included") or [],
            "servicesExcluded": doc_vi.get("excluded") or [
                "Thuế VAT (+10%)",
                "Đồ uống trong bữa ăn",
                "Tiền boa cho hướng dẫn viên, lái xe và người chèo đò",
                "Chi phí cá nhân và phụ thu ngày lễ"
            ],
            "servicesExcludedEn": doc_en.get("excluded") or [],
            "serviceNote": "Có thực đơn Halal (kèm chứng chỉ chính thức) và thực đơn Buffet Ấn Độ cho khách có yêu cầu.",
            "serviceNoteEn": "Certified Halal menu and Indian buffet options available on request.",
            "offers": off_vi,
            "offersEn": off_en,
            "pricingTable": {
                "baseRate": "Báo giá trọn gói xe đưa đón & vé tham quan",
                "baseRateEn": "All-inclusive quote with transfers & admission tickets",
                "options": [
                    {"name": "Nâng cấp xe Thaco Limousine cao cấp (17–22 chỗ)", "nameEn": "Upgrade to Thaco Limousine (17–22 seats)", "price": "+250.000đ / khách", "priceEn": "+250,000 VND / guest"},
                    {"name": "Nâng cấp xe Luxury D-Car VIP thương gia", "nameEn": "Upgrade to Luxury D-Car VIP", "price": "+350.000đ / khách", "priceEn": "+350,000 VND / guest"},
                    {"name": "Lựa chọn thực đơn Halal (Có chứng chỉ) hoặc Món Ấn", "nameEn": "Certified Halal Menu or Indian Buffet meal option", "price": "Đăng ký khi đặt tour", "priceEn": "Available on request"},
                    {"name": "Hoạt động đạp xe xuyên làng quê", "nameEn": "Village cycling experience", "price": "Miễn phí", "priceEn": "Included"}
                ],
                "surcharges": [
                    {"name": "Ghế riêng cho trẻ 1–4 tuổi trên xe Luxury D-Car", "nameEn": "Separate seat for child 1–4 on Luxury D-Car", "price": "350.000đ / ghế", "priceEn": "350,000 VND / seat"},
                    {"name": "Ghế riêng cho trẻ 1–4 tuổi trên xe Thaco Limousine", "nameEn": "Separate seat for child 1–4 on Thaco Limousine", "price": "250.000đ / ghế", "priceEn": "250,000 VND / seat"},
                    {"name": "Ghế riêng cho trẻ 1–4 tuổi trên xe thường", "nameEn": "Separate seat for child 1–4 on Standard bus", "price": "150.000đ / ghế", "priceEn": "150,000 VND / seat"},
                    {"name": "Phụ thu ngày lễ / Tết", "nameEn": "Public holiday / Tet surcharge", "price": "100.000đ / khách", "priceEn": "100,000 VND / guest"}
                ],
                "childPolicy": ninhbinh_child_policy
            }
        })

    print(f"\n[SUMMARY] Total extracted tours: {len(all_tours)}")
    dest_counts = {}
    for t in all_tours:
        dest_counts[t["destination"]] = dest_counts.get(t["destination"], 0) + 1
    print("Breakdown by destination:", dest_counts)
    
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump({"tours": all_tours}, f, ensure_ascii=False, indent=2)
    print(f"[SUCCESS] Saved {len(all_tours)} tours to {OUTPUT_JSON}")
    return all_tours

if __name__ == "__main__":
    build_all_37_tours()
