const { writeCatalogue } = require("./catalogue-io");
const fs = require("fs");
const path = require("path");
const catalogue = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "shared", "catalogue.json"), "utf8"));

function tour(id) {
  const t = catalogue.tours.find((x) => x.id === id);
  if (!t) throw new Error("missing " + id);
  return t;
}

const full = tour("ha-noi-traditional-1d");
full.nameEn = "Hanoi Sightseeing Full-Day Tour";
full.itinerary.forEach((step) => {
  if (step.time === "12:15-12:30") step.time = "12:30–12:45";
  if (step.time === "12:30" && /Trấn Quốc/.test(step.title)) step.time = "13:30";
});
const pickupEn = full.itineraryEn[0];
const mausoleumEn = full.itineraryEn[1];
const museumEn = full.itineraryEn[2];
full.itineraryEn = [
  { time: "07:50–08:30", title: "Pick-up", text: pickupEn.text },
  { time: "08:45", title: "Visit Ho Chi Minh Complex", text: mausoleumEn.text },
  {
    time: "10:15",
    title: "Visit Vietnam Ethnology Museum",
    text: "Visit Vietnam Ethnology Museum to learn about the culture of 54 ethnic groups in Vietnam. The museum is closed on Mondays, so the group visits the Vietnamese Women’s Museum instead."
  },
  {
    time: "12:30–12:45",
    title: "Lunch",
    text: "Have lunch at the restaurant and try Vietnamese cuisine. Vegetarian food is available."
  },
  {
    time: "13:30",
    title: "Visit Tran Quoc Pagoda",
    text: "Visit Tran Quoc Pagoda on Golden Fish Island in West Lake. It is the oldest pagoda in Hanoi, built in the 6th century."
  },
  {
    time: "14:30",
    title: "Visit the Temple of Literature",
    text: "Continue to the Temple of Literature, Vietnam’s first university, founded in 1070. It is one of the main sights in Hanoi."
  },
  {
    time: "15:30",
    title: "Visit Hoa Lo Prison",
    text: "Visit Hoa Lo Prison, built by the French from 1886 to 1901, when Vietnam was part of French Indochina. The French called it Maison Centrale. Once known as “a hell on earth”, it is now a museum of the resistance against the French."
  },
  {
    time: "16:30",
    title: "Return to the hotel",
    text: "The bus returns to the hotel and the programme ends. Optional, with a supplement: a 45-minute cyclo ride around the Old Quarter after Hoa Lo (USD 5/person), a 50-minute water puppet show (USD 5/person, recommended at 16:10 or 17:20), or both (USD 10/person, puppet show at 17:20 or 18:30)."
  }
];
full.serviceNoteEn = "Ho Chi Minh Mausoleum is closed on Mondays and Fridays. You can still photograph it from outside and visit the stilt house, fish pond and One Pillar Pagoda. The mausoleum is also closed for maintenance from 15 June to 15 August; those surrounding sites stay open. On Mondays the Ethnology Museum is closed and the group visits the Vietnamese Women’s Museum. Dress so that shoulders and knees are covered at temples, pagodas and the mausoleum. Bring cash, a phone or camera, a raincoat or umbrella, and sunscreen. The order can change with the weather.";

const morning = tour("ha-noi-traditional-half-morning");
morning.nameEn = "Hanoi Sightseeing Half-Day Tour (Morning)";
morning.itineraryEn = [
  morning.itineraryEn[0],
  { time: "08:45", title: "Visit Ho Chi Minh Complex", text: morning.itineraryEn[1].text },
  {
    time: "10:15",
    title: "Visit Vietnam Ethnology Museum",
    text: "Visit Vietnam Ethnology Museum to learn about the culture of 54 ethnic groups in Vietnam. The museum is closed on Mondays, so the group visits the Vietnamese Women’s Museum instead."
  },
  {
    time: "12:30–12:45",
    title: "Lunch",
    text: "Have lunch at the restaurant and try Vietnamese cuisine. Vegetarian food is available."
  },
  {
    time: "13:30–13:45",
    title: "Return to the hotel",
    text: "The bus returns to the hotel and the half-day programme ends. If you skip lunch, USD 5 is deducted per person and the drop-off is after the museum."
  }
];
morning.serviceNoteEn = "Ho Chi Minh Mausoleum is closed on Mondays and Fridays. You can still photograph it from outside and visit the surrounding complex. On Mondays the Ethnology Museum is closed and the group visits the Vietnamese Women’s Museum. Dress so that shoulders and knees are covered at temples, pagodas and the mausoleum. Bring cash, a phone or camera, a raincoat or umbrella, and sunscreen. The order can change with the weather.";

const afternoon = tour("ha-noi-traditional-half-afternoon");
afternoon.nameEn = "Hanoi Sightseeing Half-Day Tour (Afternoon)";

const grand = tour("ha-long-cozy-bay-grand-2d1n");
grand.itineraryEn = [
  { time: "DAY 1", title: "Hanoi – Ha Long Bay – Titov Island – Luon Cave (lunch/dinner)", text: "Day 1: Hanoi – Ha Long Bay – Titov Island – Luon Cave (lunch/dinner)." },
  { time: "07:45–08:30", title: "Pick-up", text: "A Cozy Bay Grand guide picks you up at your hotel in Hanoi Old Quarter or at the Opera House. Depart for Ha Long at 08:45 on the expressway. Short break around 10:15 for 20–30 minutes." },
  { time: "11:45–12:00", title: "Tuan Chau check-in", text: "Arrive at Tuan Chau pier and check in at the Cozy Bay Grand lounge." },
  { time: "12:30", title: "Welcome aboard", text: "Welcome drink, cruise briefing and cabin check-in." },
  { time: "13:00", title: "Buffet lunch", text: "Buffet lunch while the cruise moves through the limestone bay. Afternoon activities follow." },
  { time: "14:30", title: "Titov Island", text: "Hike to the summit for a bay view, or swim from the sandy beach." },
  { time: "16:00", title: "Luon Cave", text: "Bamboo boat or kayak through Luon Cave, on green water between limestone walls." },
  { time: "17:30", title: "Return to the cruise", text: "Back on board. Time on the sundeck for the sunset." },
  { time: "17:30–18:30", title: "Happy hour", text: "Buy 2 drinks, get 1 free." },
  { time: "18:00", title: "Sunset party and cooking class", text: "Wine, fruit and a cooking class. The chef shows how to make Vietnamese fresh spring rolls, which you then eat." },
  { time: "19:00", title: "Dinner", text: "Set dinner in the restaurant, with the bay lit at night." },
  { time: "20:30", title: "After dinner", text: "Quiet time on deck. Included: the “Steps of Heritage” costume show and photos, night squid fishing, karaoke and board games. Paid extras: massage and drinks at the sky bar. Music stops after 22:30. Overnight on Cozy Bay Grand." },
  { time: "DAY 2", title: "Ha Long Bay – Sung Sot Cave – Hanoi (breakfast/lunch)", text: "Day 2: Ha Long Bay – Sung Sot Cave – Hanoi (breakfast/lunch)." },
  { time: "06:00", title: "Sunrise", text: "Wake for sunrise over the bay." },
  { time: "06:15", title: "Tai chi", text: "A short tai chi session on deck." },
  { time: "06:45", title: "Breakfast", text: "Morning tea or coffee and a buffet breakfast." },
  { time: "07:40", title: "Sung Sot Cave", text: "Visit Sung Sot, the largest and best-known cave on the bay, with its stalactites." },
  { time: "09:00", title: "Back on board", text: "Return to the cruise, rest and pack." },
  { time: "10:00", title: "Check-out", text: "Leave luggage outside the cabin and return the key at reception. Staff move the bags to the lounge." },
  { time: "10:30", title: "Early lunch", text: "Early buffet lunch on board." },
  { time: "11:45", title: "Disembark at Tuan Chau", text: "The cruise docks at Tuan Chau. Farewell to the crew." },
  { time: "12:15", title: "Return to Hanoi", text: "Expressway back to Hanoi. Break around 14:30 for 20–30 minutes. About 16:00, drop-off at the Old Quarter hotel. End of the trip." }
];

const lion = tour("ha-long-sea-lion-premium-1d");
lion.itineraryEn = lion.itineraryEn.filter((step) => step.time !== "07:07");

const nbDay = tour("ninh-binh-hoalu-tamcoc-mua-1d");
if (!nbDay.itineraryEn.some((step) => step.time === "9h15")) {
  const at = nbDay.itineraryEn.findIndex((step) => String(step.time).indexOf("10h15") === 0);
  nbDay.itineraryEn.splice(at < 0 ? 1 : at, 0, {
    time: "9h15",
    title: "Short break",
    text: "A 20-minute rest stop."
  });
}

function append(id, steps) {
  const t = tour(id);
  const have = new Set((t.itinerary || []).map((s) => s.time + "|" + s.title));
  steps.forEach((step) => {
    const key = step.time + "|" + step.title;
    if (!have.has(key)) t.itinerary.push(step);
  });
}

append("ninh-binh-hoalu-tamcoc-mua-baidinh-trangan-2d1n", [
  { time: "13h00 – 13h30", title: "Tham quan Tam Cốc", text: "Đi thuyền Tam Cốc khoảng 1,5 giờ. Lúa, sông, hang và mây trời — cảnh thường được gọi là vịnh Hạ Long trên cạn." },
  { time: "16h00", title: "Hang Múa", text: "Lên xe đến Hang Múa. Đi bộ gần 500 bậc lên đỉnh núi Ngọa Long, nhìn xuống Tam Cốc." },
  { time: "17h00", title: "Về khách sạn / bungalow", text: "Xe đưa về khách sạn hoặc bungalow." },
  { time: "17h30", title: "Nhận phòng", text: "Làm thủ tục nhận phòng." },
  { time: "19h00 - 19h30", title: "Ăn tối", text: "Ăn tối tại khách sạn, bungalow hoặc nhà hàng gần đó. Ngày 2: Chùa Bái Đính – thuyền Tràng An – Hà Nội (ăn sáng, ăn trưa)." },
  { time: "7h30", title: "Ăn sáng", text: "Ăn sáng tại khách sạn hoặc bungalow, rồi sẵn sàng khởi hành." },
  { time: "9h30 – 9h45", title: "Xe đón", text: "Xe đón tại khách sạn hoặc bungalow và nhập đoàn tại Nhà hàng Cozy Vietnam." },
  { time: "10h30", title: "Chùa Bái Đính", text: "Tham quan chùa Bái Đính, ngôi chùa lớn ở Đông Nam Á, với tượng La Hán đá, chuông đồng và tượng Phật lớn." },
  { time: "12h30", title: "Ăn trưa buffet", text: "Ăn trưa buffet tại Nhà hàng Cozy Vietnam, nhìn ra sông núi Ninh Bình. Có món chay." },
  { time: "13h30 - 13h45", title: "Tràng An", text: "Thuyền Tràng An khoảng 1,5 giờ, di sản UNESCO, hệ thống hang xuyên núi." },
  { time: "16h00", title: "Lên xe về Hà Nội", text: "Lên xe trở về Hà Nội." },
  { time: "18h00 – 18h30", title: "Trả khách", text: "Về tới Hà Nội, trả khách tại khách sạn. Kết thúc chương trình." }
]);

append("ninh-binh-halong-2d1n", [
  { time: "13h00 – 13h30", title: "Tam Cốc hoặc Tràng An", text: "Lựa chọn 1: thuyền Tam Cốc khoảng 1,5 giờ, lúa và hang — cảnh thường gọi là vịnh Hạ Long trên cạn. Lựa chọn 2: thuyền Tràng An khoảng 1,5 giờ, di sản UNESCO, hệ thống hang xuyên núi." },
  { time: "16h00", title: "Hang Múa", text: "Lên xe đến Hang Múa. Đi bộ gần 500 bậc lên đỉnh núi Ngọa Long, nhìn xuống Tam Cốc." },
  { time: "17h00", title: "Về khách sạn / bungalow", text: "Xe đưa về khách sạn hoặc bungalow." },
  { time: "17h30", title: "Nhận phòng", text: "Làm thủ tục nhận phòng." },
  { time: "19h00 - 19h30", title: "Ăn tối", text: "Ăn tối tại khách sạn, bungalow hoặc nhà hàng gần đó." },
  { time: "NGÀY 2", title: "Ninh Bình – Vịnh Hạ Long – Hang Sửng Sốt – kayak – đảo Titop – Hà Nội (ăn sáng/trưa)", text: "Ngày 2: Ninh Bình – vịnh Hạ Long – Hang Sửng Sốt – kayak – đảo Titop – Hà Nội. Ăn sáng tại bungalow. Xe đưa, không có hướng dẫn đi cùng trên xe." },
  { time: "7h00", title: "Đi Hạ Long", text: "Xe shuttle hoặc limousine đón tại Ninh Bình, đi Hạ Long theo đường cao tốc, qua cánh đồng." },
  { time: "11h45- 12h00", title: "Cảng Tuần Châu", text: "Đến cảng Tuần Châu, lên du thuyền Cozy Bay Premium, ăn trưa buffet. Hành trình khoảng 5–6 giờ theo tuyến 2." },
  { time: "14h00", title: "Hang Sửng Sốt", text: "Tham quan Hang Sửng Sốt, nhũ đá và măng đá nhiều hình dạng." },
  { time: "15h00", title: "Hang Luồn", text: "Kayak hoặc thuyền nan trong Hang Luồn." },
  { time: "16h00", title: "Đảo Titop", text: "Bãi biển Titop và leo đỉnh để nhìn toàn vịnh." },
  { time: "17h00", title: "Tiệc hoàng hôn", text: "Về tàu, tiệc hoàng hôn trên boong: trà, bánh, nhạc." },
  { time: "18h00-18h30", title: "Về Hà Nội", text: "Rời cảng, xe về Hà Nội theo cao tốc, dừng nghỉ 20–30 phút." },
  { time: "21h00", title: "Trả khách", text: "Về tới Hà Nội, trả khách tại khách sạn. Kết thúc chương trình." }
]);

const combo = tour("ninh-binh-halong-2d1n");
combo.itineraryEn.forEach((step) => {
  if (!step.title && step.time === "13h00 – 13h30") step.title = "Tam Coc or Trang An";
});

const tropical = tour("ha-long-lan-ha-tropical-cruise-1d");
if (tropical.itinerary.length > 1 && tropical.itinerary[0].time === tropical.itinerary[1].time && tropical.itinerary[0].text === tropical.itinerary[1].text) {
  tropical.itinerary.splice(1, 1);
}

writeCatalogue(catalogue);
const check = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "shared", "catalogue.json"), "utf8"));
["ha-noi-traditional-1d", "ha-noi-traditional-half-morning", "ha-long-cozy-bay-grand-2d1n", "ha-long-sea-lion-premium-1d", "ninh-binh-hoalu-tamcoc-mua-1d", "ninh-binh-hoalu-tamcoc-mua-baidinh-trangan-2d1n", "ninh-binh-halong-2d1n", "ha-long-lan-ha-tropical-cruise-1d"].forEach((id) => {
  const t = check.tours.find((x) => x.id === id);
  console.log(id, "vi", t.itinerary.length, "en", t.itineraryEn.length, "|", t.nameEn);
});
