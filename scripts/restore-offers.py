# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(r"e:\CongViec\Job2\1.TheDahliaHaNoi\shared\data.js")
t = p.read_text(encoding="utf-8")

repls = [
    (
        'offers: ["Về sớm hơn (không Hang Múa)"]',
        'offers: ["Về sớm hơn (không Hang Múa)", "Buffet/set lunch Heritage Garden"]',
    ),
    (
        'offersEn: ["Earlier return (no Mua Cave)"]',
        'offersEn: ["Earlier return (no Mua Cave)", "Buffet/set lunch at Heritage Garden"]',
    ),
    (
        'offers: ["Xe điện Bái Đính đã gồm"]',
        'offers: ["Xe điện Bái Đính đã gồm", "Buffet/set lunch Heritage Garden"]',
    ),
    (
        'offersEn: ["Bai Dinh electric car included"]',
        'offersEn: ["Bai Dinh electric car included", "Buffet/set lunch at Heritage Garden"]',
    ),
    (
        'offers: ["Nghỉ tại Trang An Heritage Garden"]',
        'offers: ["Nghỉ tại Trang An Heritage Garden", "Hồ bơi mùa hè"]',
    ),
    (
        'offersEn: ["Stay at Trang An Heritage Garden"]',
        'offersEn: ["Stay at Trang An Heritage Garden", "Summer swimming pool"]',
    ),
    (
        'offers: ["Không leo Hang Múa"]',
        'offers: ["Không leo Hang Múa", "Buffet trưa Heritage Garden"]',
    ),
    (
        'offersEn: ["No Mua Cave climb"]',
        'offersEn: ["No Mua Cave climb", "Buffet lunch at Heritage Garden"]',
    ),
    (
        'offers: ["Thung Nham + Bích Động"]',
        'offers: ["Thung Nham + Bích Động", "Nghỉ đêm Heritage Garden"]',
    ),
    (
        'offersEn: ["Thung Nham + Bich Dong"]',
        'offersEn: ["Thung Nham + Bich Dong", "Overnight at Heritage Garden"]',
    ),
    (
        'offers: ["Cúc Phương + cố đô"]',
        'offers: ["Cúc Phương + cố đô", "Nghỉ đêm Heritage Garden"]',
    ),
    (
        'offersEn: ["Cuc Phuong + ancient capital"]',
        'offersEn: ["Cuc Phuong + ancient capital", "Overnight at Heritage Garden"]',
    ),
    (
        'offers: ["Ninh Bình + Hạ Long một đặt chỗ"]',
        'offers: ["Ninh Bình + Hạ Long một đặt chỗ", "Limousine xuyên suốt"]',
    ),
    (
        'offersEn: ["Ninh Binh + Ha Long in one booking"]',
        'offersEn: ["Ninh Binh + Ha Long in one booking", "Limousine throughout"]',
    ),
    (
        'offers: ["Tour riêng tư"]',
        'offers: ["Tour riêng tư", "Lịch trình linh hoạt"]',
    ),
    (
        'offersEn: ["Private tour"]',
        'offersEn: ["Private tour", "Flexible itinerary"]',
    ),
    (
        'offers: ["Làng hương + Ninh Bình"]',
        'offers: ["Làng hương + Ninh Bình", "Tour private"]',
    ),
    (
        'offersEn: ["Incense village + Ninh Binh"]',
        'offersEn: ["Incense village + Ninh Binh", "Private tour"]',
    ),
    (
        'offers: ["Sáng hoặc chiều"]',
        'offers: ["Sáng hoặc chiều", "Limousine hoặc Dcar"]',
    ),
    (
        'offersEn: ["Morning or afternoon"]',
        'offersEn: ["Morning or afternoon", "Limousine or Dcar"]',
    ),
    (
        'offers: ["Buffet đã gồm trong giá", "Welcome drink"]',
        'offers: ["Buffet đã gồm trong giá", "Welcome drink", "Limousine khứ hồi Hà Nội"]',
    ),
    (
        'offersEn: ["Buffet included in the price", "Welcome drink"]',
        'offersEn: ["Buffet included in the price", "Welcome drink", "Round-trip limousine from Hanoi"]',
    ),
    (
        'offers: ["Tàu Signature 5 sao", "Có set menu Ấn Độ"]',
        'offers: ["Tàu Signature 5 sao", "Có set menu Ấn Độ", "Jacuzzi bốn mùa"]',
    ),
    (
        'offersEn: ["Signature 5-star cruise", "Indian set menus available"]',
        'offersEn: ["Signature 5-star cruise", "Indian set menus available", "Four-season jacuzzi"]',
    ),
    (
        'offers: ["Nón lá & áo mưa miễn phí", "Buffet hoặc set menu"]',
        'offers: ["Nón lá & áo mưa miễn phí", "Buffet hoặc set menu", "Limousine nhóm"]',
    ),
    (
        'offersEn: ["Free hat & raincoat", "Buffet or set menu"]',
        'offersEn: ["Free hat & raincoat", "Buffet or set menu", "Group limousine"]',
    ),
    (
        'offers: ["Set lunch Mesdames Linh đã gồm", "Private & group"]',
        'offers: ["Set lunch Mesdames Linh đã gồm", "Private & group", "Limousine hoặc Dcar"]',
    ),
    (
        'offersEn: ["Mesdames Linh set lunch included", "Private & group"]',
        'offersEn: ["Mesdames Linh set lunch included", "Private & group", "Limousine or Dcar"]',
    ),
    (
        'offers: ["Làng hương + city tour", "Lunch Mesdames Linh"]',
        'offers: ["Làng hương + city tour", "Lunch Mesdames Linh", "Dcar nhóm nhỏ"]',
    ),
    (
        'offersEn: ["Incense village + city tour", "Mesdames Linh lunch"]',
        'offersEn: ["Incense village + city tour", "Mesdames Linh lunch", "Small-group Dcar"]',
    ),
]

n = 0
for a, b in repls:
    if a in t:
        t = t.replace(a, b, 1)
        n += 1
    else:
        print("MISS", a[:70])

p.write_text(t, encoding="utf-8")
print("replaced", n)
assert "DAHLIA10" not in t
