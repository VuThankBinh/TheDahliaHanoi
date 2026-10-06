/**
 * Nguồn dữ liệu chính cho Voyage (slideshow, điểm đến, tour, form…).
 * Sửa file này rồi hard-refresh — app đọc từ window.TOUR_DATA.
 *
 * Đường dẫn ảnh: tương đối trang voyage/*.html → dùng "img/..."
 *
 * Cấu trúc nhanh:
 * - hero.slides          → banner trang chủ
 * - destinations[id]     → điểm đến theo id (ha-long, ninh-binh, ha-noi): name, title, media, video
 * - tours[].id           → mở chi tiết: tours.html?id=...
 * - tours[].destination  → id điểm đến (khớp destinations[id])
 * - tours[].media        → slideshow trang chi tiết
 * - tours[].image        → ảnh thẻ card
 * URL: tours.html?id=ha-long | tours.html?dest=ninh-binh
 */
window.TOUR_DATA = {
  email: "hello@thedahliahanoi.com",
  phone: "+84 24 0000 0000",
  partner: {
    name: "Heritage Vietnam Travel",
    hotline: "0879 818 386",
    hotlineHref: "tel:+84879818386",
    website: "https://heritagevietnamtravel.com",
    address: "186 Hồng Tiến, Bồ Đề, Long Biên, Hà Nội"
  },
  bank: {
    name: "MB Bank",
    accountName: "Công ty The Dahlia",
    accountNumber: "226456789",
    note: "Bản mẫu, chưa thanh toán thật",
    noteEn: "Sample only — not a real payment"
  },

  /* Banner trang chủ — mỗi phần tử: type image|video, src (hoặc sources[]), poster?, alt?, altEn?, place? */
  hero: {
    interval: 10000,
    slides: [
      {
        type: "video",
        place: "ha-long",
        poster: "img/destinations/ha-long/tuan-chau-port.jpg",
        alt: "Highlight Hạ Long",
        altEn: "Ha Long highlight",
        sources: [
          "img/video/2169880-hd_1280_720_30fps.mp4"
        ]
      },
      {
        type: "video",
        place: "ninh-binh",
        poster: "img/destinations/ninh-binh/hoa-lu.jpg",
        alt: "Highlight Ninh Bình",
        altEn: "Ninh Binh highlight",
        sources: [
          "img/video/3571264-hd_1280_720_30fps.mp4"
        ]
      },
      {
        type: "video",
        place: "ha-noi",
        poster: "img/destinations/hanoi/tran-quoc-pagoda.jpg",
        alt: "Highlight Hà Nội",
        altEn: "Hanoi highlight",
        sources: [
          "img/video/16092120_2560_1440_30fps.mp4"
        ]
      }
    ]
  },

  destinations: {
    "ha-long": {
      id: "ha-long",
      name: "Hạ Long",
      nameEn: "Ha Long",
      title: "Vịnh Hạ Long",
      titleEn: "Ha Long Bay",
      lead: "Di sản UNESCO — du thuyền Heritage Luxury và Signature trong ngày từ Hà Nội.",
      leadEn: "UNESCO heritage — Heritage Luxury and Signature day cruises from Hanoi.",
      video: "https://videos.pexels.com/video-files/30391309/13024349_3840_2160_60fps.mp4",
      media: [
        { type: "image", src: "img/destinations/ha-long/bay-overview.jpg", alt: "Toàn cảnh vịnh Hạ Long", altEn: "Ha Long Bay overview" },
        { type: "image", src: "img/venues/cruise-exterior.jpg", alt: "Du thuyền Heritage", altEn: "Heritage cruise" },
        { type: "image", src: "img/destinations/ha-long/titov-beach.jpg", alt: "Bãi tắm đảo Titov", altEn: "Titov Island beach" },
        { type: "image", src: "img/venues/cruise-sundeck.jpg", alt: "Sundeck tiệc hoàng hôn", altEn: "Sunset party sundeck" },
        { type: "image", src: "img/destinations/ha-long/tuan-chau-port.jpg", alt: "Cảng Tuần Châu", altEn: "Tuan Chau port" }
      ]
    },
    "ninh-binh": {
      id: "ninh-binh",
      name: "Ninh Bình",
      nameEn: "Ninh Binh",
      title: "Ninh Bình Heritage Premium",
      titleEn: "Ninh Binh Heritage Premium",
      lead: "Mười tour: Hoa Lư, Bái Đính, Tam Cốc / Tràng An, Hang Múa, 2N1Đ Heritage Garden, Cúc Phương, combo Hạ Long và tour private.",
      leadEn: "Ten tours: Hoa Lu, Bai Dinh, Tam Coc / Trang An, Mua Cave, 2D1N Heritage Garden, Cuc Phuong, Ha Long combo, and private days.",
      video: "https://videos.pexels.com/video-files/30574776/13092696_3840_2160_60fps.mp4",
      media: [
        { type: "image", src: "img/destinations/ninh-binh/tam-coc-boat.jpg", alt: "Thuyền Tam Cốc", altEn: "Tam Coc boat" },
        { type: "image", src: "img/destinations/ninh-binh/trang-an-boat.jpg", alt: "Thuyền Tràng An", altEn: "Trang An boat" },
        { type: "image", src: "img/destinations/ninh-binh/mua-cave-peak.jpg", alt: "Đỉnh Hang Múa", altEn: "Mua Cave peak" },
        { type: "image", src: "img/venues/heritage-garden.jpg", alt: "Heritage Garden", altEn: "Heritage Garden" },
        { type: "image", src: "img/destinations/ninh-binh/hoa-lu.jpg", alt: "Cố đô Hoa Lư", altEn: "Hoa Lu ancient capital" }
      ]
    },
    "ha-noi": {
      id: "ha-noi",
      name: "Hà Nội",
      nameEn: "Hanoi",
      title: "Hanoi Heritage Premium Daily Tour",
      titleEn: "Hanoi Heritage Premium Daily Tour",
      lead: "Thủ đô hơn 1.000 năm — City Tour, làng hương Quang Phú Cầu và set lunch Mesdames Linh Cuisine.",
      leadEn: "A capital of 1,000+ years — City Tour, Quang Phu Cau incense village, and Mesdames Linh Cuisine set lunch.",
      video: "https://videos.pexels.com/video-files/2491284/2491284-uhd_2560_1440_24fps.mp4",
      media: [
        { type: "image", src: "img/destinations/hanoi/tran-quoc-pagoda.jpg", alt: "Chùa Trấn Quốc", altEn: "Tran Quoc Pagoda" },
        { type: "image", src: "img/destinations/hanoi/temple-of-literature.jpg", alt: "Văn Miếu", altEn: "Temple of Literature" },
        { type: "image", src: "img/destinations/hanoi/old-quarter.jpg", alt: "Phố cổ Hà Nội", altEn: "Hanoi Old Quarter" },
        { type: "image", src: "img/destinations/hanoi/incense-village.jpg", alt: "Làng hương Quang Phú Cầu", altEn: "Quang Phu Cau incense village" },
        { type: "image", src: "img/venues/mesdames-linh.jpg", alt: "Mesdames Linh Cuisine", altEn: "Mesdames Linh Cuisine" }
      ]
    }
  },
  tours: [
    /* —— Hạ Long —— */
    {
      id: "ha-long",
      destination: "ha-long",
      featured: true,
      stars: 5,
      name: "Heritage Luxury Day Cruise",
      nameEn: "Heritage Luxury Day Cruise",
      durationLabel: "1 ngày",
      durationLabelEn: "1 day",
      nightsOffset: 0,
      price: 2450000,
      priceNote: "$99/khách",
      priceNoteEn: "$99/guest",
      image: "img/tours/ha-long.jpg",
      media: [
        { type: "image", src: "img/venues/cruise-exterior.jpg", alt: "Du thuyền Heritage trên vịnh Hạ Long", altEn: "Heritage cruise on Ha Long Bay" },
        { type: "image", src: "img/destinations/ha-long/bay-overview.jpg", alt: "Toàn cảnh vịnh Hạ Long", altEn: "Ha Long Bay overview" },
        { type: "image", src: "img/destinations/ha-long/sung-sot-cave.jpg", alt: "Hang Sửng Sốt", altEn: "Surprising Cave" },
        { type: "image", src: "img/destinations/ha-long/luon-cave.jpg", alt: "Hang Luồn", altEn: "Luon Cave" },
        { type: "image", src: "img/destinations/ha-long/titov-beach.jpg", alt: "Bãi tắm đảo Titov", altEn: "Titov Island beach" },
        { type: "image", src: "img/venues/cruise-sundeck.jpg", alt: "Sundeck tiệc hoàng hôn", altEn: "Sunset party sundeck" },
        { type: "image", src: "img/venues/cruise-jacuzzi.jpg", alt: "Jacuzzi ngoài trời trên tàu", altEn: "Onboard outdoor jacuzzi" },
        { type: "image", src: "img/food/halong-seafood-buffet.jpg", alt: "Buffet hải sản trên tàu", altEn: "Seafood buffet on board" },
        { type: "image", src: "img/fleet/limousine-mid.jpg", alt: "Limousine đưa đón Hà Nội", altEn: "Limousine transfer from Hanoi" },
      ],
      cardLine: "Du thuyền một ngày Heritage Luxury trên vịnh Hạ Long. Buffet trưa, hang Sửng Sốt, kayak hang Luồn, đảo Titop và tiệc hoàng hôn trên sundeck. Limousine khứ hồi Hà Nội, hướng dẫn tiếng Anh. Giá 2.450.000đ/khách — $99/khách.",
      cardLineEn: "A Heritage Luxury day cruise on Ha Long Bay. Lunch buffet, Surprising Cave, kayak at Luon Cave, Titop Island, and a sunset party on the sundeck. Round-trip limousine from Hanoi and an English-speaking guide. 2,450,000đ per guest — $99/guest.",
      description: [
        "Tàu Heritage Luxury Day Cruise — capacity 99 khách, 3 boong, jacuzzi và sundeck.",
        "Lịch trình: Sửng Sốt → hang Luồn → Titov, tiệc hoàng hôn trên đường về Tuần Châu.",
        "Đón khách phố cổ Hà Nội buổi sáng, trả khách tối cùng ngày."
      ],
      descriptionEn: [
        "Heritage Luxury Day Cruise — 99 guests, 3 decks, jacuzzi and sundeck.",
        "Route: Surprising Cave → Luon Cave → Titov, then a sunset party back to Tuan Chau.",
        "Pickup in Hanoi Old Quarter in the morning, drop-off the same evening."
      ],
      itinerary: [
        { time: "07:45–08:30", title: "Đón khách — limousine", text: "Hướng dẫn và tài xế đón tại khách sạn phố cổ Hà Nội, lên limousine đi Hạ Long." },
        { time: "10:30–10:45", title: "Nghỉ ngắn", text: "Dừng 20–25 phút dọc đường để ra xe, vệ sinh hoặc ăn nhẹ." },
        { time: "11:30–11:45", title: "Lên tàu Heritage", text: "Đón tại cảng quốc tế Tuần Châu, check-in, welcome drink." },
        { time: "12:00–13:15", title: "Buffet trên tàu", text: "Buffet hải sản Hạ Long. Tàu đi qua Hòn Chó Đá, Đỉnh Hương, Hòn Gà Chọi…" },
        { time: "13:30–14:15", title: "Hang Sửng Sốt", text: "Tham quan hang Sửng Sốt — một trong những hang lớn và đẹp nhất vịnh." },
        { time: "14:30–15:15", title: "Hang Luồn", text: "Kayak hoặc thuyền tre do người địa phương chèo vào hang Luồn." },
        { time: "15:30–16:30", title: "Đảo Titov", text: "Lên đỉnh ngắm toàn cảnh vịnh, bơi biển Titov, hoặc thư giãn jacuzzi trên tàu." },
        { time: "16:45", title: "Tiệc hoàng hôn", text: "Trà, nước ép, trái cây, bánh trên sundeck khi tàu về Tuần Châu." },
        { time: "17:45–18:00", title: "Xuống tàu — limousine", text: "Lên limousine về Hà Nội." },
        { time: "20:30–20:45", title: "Trả khách", text: "Đưa về khách sạn phố cổ Hà Nội." }
      ],
      itineraryEn: [
        { time: "07:45–08:30", title: "Hotel pickup — limousine", text: "Guide and driver pick you up at your Old Quarter hotel for the transfer to Ha Long." },
        { time: "10:30–10:45", title: "Short break", text: "A 20–25 minute stop to stretch, use facilities, or grab a snack." },
        { time: "11:30–11:45", title: "Welcome aboard", text: "Check-in at Tuan Chau International Port and enjoy a welcome drink." },
        { time: "12:00–13:15", title: "Lunch on board", text: "Seafood buffet while cruising past Stone Dog, Incense Burner, and Kissing Rocks." },
        { time: "13:30–14:15", title: "Surprising Cave", text: "Visit Sung Sot Cave — one of the largest and most beautiful caves in the bay." },
        { time: "14:30–15:15", title: "Luon Cave", text: "Kayak or take a bamboo boat rowed by locals into Luon Cave." },
        { time: "15:30–16:30", title: "Titov Island", text: "Climb for panoramic views, swim at Titov beach, or use the onboard jacuzzi." },
        { time: "16:45", title: "Sunset party", text: "Tea, juice, fruit, and cake on the sundeck as the cruise returns to Tuan Chau." },
        { time: "17:45–18:00", title: "Disembark — limousine", text: "Board the limousine back to Hanoi." },
        { time: "20:30–20:45", title: "Hotel drop-off", text: "Drop-off at your hotel in Hanoi Old Quarter." }
      ],
      servicesIncluded: [
        "Buffet trưa trên tàu",
        "Nước lọc miễn phí trong bữa trưa",
        "Welcome drink",
        "Tham quan hang Sửng Sốt",
        "Kayak hoặc thuyền tre hang Luồn",
        "Bơi và leo đảo Titov",
        "Jacuzzi và khăn",
        "Tiệc hoàng hôn: trà, nước ép, trái cây, bánh",
        "Vé thắng cảnh và phí vào cửa",
        "Hướng dẫn viên tiếng Anh",
        "Limousine khứ hồi 19 & 22 chỗ",
        "2 chai nước khoáng/khách trên limousine"
      ],
      servicesIncludedEn: [
        "Buffet lunch on boat",
        "Complimentary filtered water at lunch",
        "Welcome drink",
        "Surprising Cave visit",
        "Kayak or bamboo boat at Luon Cave",
        "Swim and hike on Titov Island",
        "Jacuzzi and towel",
        "Sunset party: tea, juice, fresh fruit & cakes",
        "Entrance and sightseeing fees",
        "English-speaking guide",
        "Round-trip limousine, 19 & 22 seats",
        "2 mineral waters per guest on the limousine"
      ],
      servicesExcluded: ["VAT", "Đồ uống không nêu ở phần bao gồm", "Tip và chi tiêu cá nhân", "Dịch vụ không ghi trong mục bao gồm", "Phụ thu ngày lễ / Tết: 15 USD/khách"],
      servicesExcludedEn: ["VAT", "Beverages not listed as included", "Tips and personal expenses", "Anything not listed as included", "Public holiday / Tet surcharge: 15 USD/guest"],
      serviceNote: "Buffet trưa trên tàu, món Việt và Âu. Thực đơn có thể đổi theo mùa.",
      serviceNoteEn: "Lunch buffet on board — Vietnamese and Western. Menu may change by season.",
      offers: ["Buffet đã gồm trong giá", "Welcome drink", "Limousine khứ hồi Hà Nội"],
      offersEn: ["Buffet included in the price", "Welcome drink", "Round-trip limousine from Hanoi"],
      buffetMenu: {
        title: "Thực đơn buffet",
        titleEn: "Buffet menu",
        columns: [
          [
            {
              name: "Starter",
              items: [
                { vi: "Súp hải sản", en: "Seafood soup" },
                { vi: "Súp bí ngô kem", en: "Pumpkin cream soup", veg: "Chay", vegEn: "Veg" }
              ]
            },
            {
              name: "Salad & cold",
              items: [
                { vi: "Salad sứa trộn xoài xanh", en: "Salad mixed jellyfish with green mango" },
                { vi: "Salad rau trộn xốt Mayonnaise", en: "Salad mixed vegetables with mayonnaise", veg: "Chay", vegEn: "Veg" },
                { vi: "Nem tươi cuốn (chay + mặn)", en: "Fresh spring rolls", veg: "Chay + mặn", vegEn: "Veg + non-veg" },
                { vi: "Cơm cuộn thập cẩm (chay + mặn)", en: "Seaweed rice roll", veg: "Chay + mặn", vegEn: "Veg + non-veg" },
                { vi: "Khoai tây chiên lắc phô mai", en: "French fries", veg: "Chay", vegEn: "Veg" },
                { vi: "Cà ri rau củ chay", en: "Vegetables in curry sauce", veg: "Chay", vegEn: "Veg" },
                { vi: "Bánh mì cắt lát", en: "Sliced bread", veg: "Chay", vegEn: "Veg" },
                { vi: "Xúc xích bỏ lò", en: "Fried sausage" }
              ]
            }
          ],
          [
            {
              name: "Hot station",
              items: [
                { vi: "Nem rế Hạ Long", en: "Halong spring roll" },
                { vi: "Bò xào ớt chuông", en: "Stir-fried beef with bell pepper" },
                { vi: "Ức gà sốt cà ri", en: "Chicken breast in curry sauce" },
                { vi: "Tôm biển hấp bia tươi", en: "Steamed shrimp with beer" },
                { vi: "Cá sốt ngũ vị", en: "Steamed fish sweet and sour sauce" },
                { vi: "Mực xào ngũ sắc", en: "Stir-fried squid with vegetables" },
                { vi: "Mì xào thập cẩm chay", en: "Stir-fried noodles mixed vegetable", veg: "Chay", vegEn: "Veg" },
                { vi: "Rau cải thìa xào nấm hương", en: "Stir-fried bok choy with mushroom", veg: "Chay", vegEn: "Veg" },
                { vi: "Bánh bao hấp", en: "Steamed dumplings", veg: "Chay", vegEn: "Veg" },
                { vi: "Cơm tám thơm hảo hạng", en: "Steamed rice", veg: "Chay", vegEn: "Veg" },
                { vi: "Đậu sốt cà chua hoặc chiên mắm tiêu", en: "Tofu in sauce", veg: "Chay", vegEn: "Veg" }
              ]
            }
          ],
          [
            {
              name: "Dessert",
              items: [
                { vi: "Bánh ngọt", en: "Cake" },
                { vi: "Chè đậu xanh hoa cau", en: "Green beans sweet gruel", veg: "Chay", vegEn: "Veg" },
                { vi: "Dứa", en: "Pineapple", veg: "Chay", vegEn: "Veg" },
                { vi: "Thanh long", en: "Dragon fruit", veg: "Chay", vegEn: "Veg" },
                { vi: "Dưa hấu", en: "Watermelon", veg: "Chay", vegEn: "Veg" }
              ]
            },
            {
              name: "Sunset party",
              items: [
                { vi: "Bánh ngọt", en: "Cake" },
                { vi: "Thanh long, dưa hấu, dưa vàng", en: "Seasonal fruits" },
                { vi: "Nước chanh leo", en: "Passion fruit" },
                { vi: "Trà chanh sả", en: "Lemon tea" }
              ]
            }
          ]
        ],
        note: "Thực đơn có thể thay đổi mà không báo trước, tùy mùa, thời tiết hoặc yêu cầu khác.",
        noteEn: "The menu may change without notice, depending on season, weather, or other needs.",
        vegNote: "(*) Món chay · Vegetarian dishes",
        vegNoteEn: "(*) Vegetarian dishes"
      }
    },
    {
      id: "ha-long-signature",
      destination: "ha-long",
      featured: true,
      stars: 5,
      name: "Heritage Signature Day Cruise",
      nameEn: "Heritage Signature Day Cruise",
      durationLabel: "1 ngày",
      durationLabelEn: "1 day",
      nightsOffset: 0,
      price: 2945000,
      priceNote: "$119 limousine · $109 shuttle",
      priceNoteEn: "$119 limousine · $109 shuttle",
      image: "img/tours/ha-long-signature.jpg",
      media: [
        { type: "image", src: "img/venues/cruise-exterior.jpg", alt: "Du thuyền Signature trên vịnh", altEn: "Signature cruise on the bay" },
        { type: "image", src: "img/venues/cruise-restaurant.jpg", alt: "Nhà hàng kính tràn viền trên tàu", altEn: "Glass-walled cruise restaurant" },
        { type: "image", src: "img/venues/cruise-lounge.jpg", alt: "Sofa Lounge trên tàu", altEn: "Cruise sofa lounge" },
        { type: "image", src: "img/venues/cruise-sundeck.jpg", alt: "Sundeck & cổng check-in", altEn: "Sundeck and check-in gate" },
        { type: "image", src: "img/venues/cruise-jacuzzi.jpg", alt: "Jacuzzi bốn mùa", altEn: "Four-season jacuzzi" },
        { type: "image", src: "img/destinations/ha-long/kissing-rocks.jpg", alt: "Hòn Gà Chọi trên vịnh", altEn: "Kissing Rocks on the bay" },
        { type: "image", src: "img/food/indian-set.jpg", alt: "Set menu Ấn Độ trên tàu", altEn: "Indian set menu on board" },
        { type: "image", src: "img/experiences/sunset-party.jpg", alt: "Sunset Party trên sundeck", altEn: "Sunset party on the sundeck" },
      ],
      cardLine: "Du thuyền 5 sao Heritage Signature (ra mắt 2026): 168 khách, buffet hoặc set Ấn Độ, jacuzzi bốn mùa và bar sundeck. Lịch hang Luồn, Sửng Sốt, Titov và tiệc hoàng hôn. Limousine 19–22 chỗ $119 hoặc shuttle 30 chỗ $109.",
      cardLineEn: "Heritage Signature 5-star day cruise (launched 2026): 168 guests, buffet or Indian set menus, four-season jacuzzi, and sundeck bar. Luon Cave, Surprising Cave, Titov, and sunset party. Limousine 19–22 seats $119 or shuttle bus 30 seats $109.",
      description: [
        "Tàu thép Heritage Signature — dài 50m, 3 boong, sức chứa 168 khách.",
        "Buffet hoặc set menu chay / không chay kiểu Ấn (từ 2 khách).",
        "Cùng tuyến vịnh như Luxury Day Cruise, dịch vụ và không gian rộng hơn."
      ],
      descriptionEn: [
        "Steel cruise Heritage Signature — 50m, 3 decks, 168 guests.",
        "Buffet or Indian vegetarian / non-vegetarian set menus (from 2 guests).",
        "Same bay highlights as the Luxury Day Cruise, with a larger luxury layout."
      ],
      itinerary: [
        { time: "07:45–08:30", title: "Đón khách — limousine / shuttle", text: "Đón tại khách sạn phố cổ Hà Nội bằng limousine hoặc xe shuttle." },
        { time: "10:30–10:45", title: "Nghỉ ngắn", text: "Dừng 20–25 phút dọc đường." },
        { time: "11:30–11:45", title: "Lên tàu Signature", text: "Check-in cảng Tuần Châu, welcome drink." },
        { time: "12:00–13:15", title: "Buffet / set menu trên tàu", text: "Bữa trưa trên tàu khi đi qua các điểm đá nổi tiếng trên vịnh." },
        { time: "13:30–14:15", title: "Hang Luồn", text: "Kayak hoặc thuyền tre khám phá hang Luồn." },
        { time: "14:30–15:15", title: "Hang Sửng Sốt", text: "Tham quan hang Sửng Sốt cùng hướng dẫn viên." },
        { time: "15:30–16:30", title: "Đảo Titov", text: "Bơi, leo núi Titov, hoặc jacuzzi trên tàu." },
        { time: "16:45", title: "Tiệc hoàng hôn", text: "Trà, nước ép, trái cây, bánh (và bánh phồng tôm) trên sundeck." },
        { time: "17:45–18:00", title: "Xuống tàu", text: "Limousine / shuttle về Hà Nội." },
        { time: "20:30–20:45", title: "Trả khách", text: "Đưa về khách sạn phố cổ Hà Nội." }
      ],
      itineraryEn: [
        { time: "07:45–08:30", title: "Pickup — limousine / shuttle", text: "Pickup at your Old Quarter hotel by limousine or shuttle bus." },
        { time: "10:30–10:45", title: "Short break", text: "A 20–25 minute stop on the way." },
        { time: "11:30–11:45", title: "Welcome aboard Signature", text: "Check-in at Tuan Chau Port and a welcome drink." },
        { time: "12:00–13:15", title: "Lunch on board", text: "Buffet or set menu while cruising the bay’s landmark rocks." },
        { time: "13:30–14:15", title: "Luon Cave", text: "Kayak or bamboo boat into Luon Cave." },
        { time: "14:30–15:15", title: "Surprising Cave", text: "Guided visit to Sung Sot Cave." },
        { time: "15:30–16:30", title: "Titov Island", text: "Swim, climb Titov, or use the onboard jacuzzi." },
        { time: "16:45", title: "Sunset party", text: "Tea, juice, fruit, cake, and prawn crackers on the sundeck." },
        { time: "17:45–18:00", title: "Disembark", text: "Limousine or shuttle back to Hanoi." },
        { time: "20:30–20:45", title: "Hotel drop-off", text: "Drop-off at your Old Quarter hotel." }
      ],
      servicesIncluded: [
        "Buffet trưa trên tàu (hoặc set menu Ấn Độ)",
        "Nước lọc miễn phí trong bữa trưa",
        "Welcome drink",
        "Tham quan hang Sửng Sốt",
        "Kayak hoặc thuyền tre hang Luồn",
        "Bơi và leo đảo Titov",
        "Jacuzzi và khăn",
        "Tiệc hoàng hôn: trà, nước ép, trái cây, bánh",
        "Vé thắng cảnh",
        "Hướng dẫn viên tiếng Anh",
        "Limousine 19–22 chỗ hoặc shuttle 30 chỗ khứ hồi",
        "2 chai nước khoáng/khách trên xe"
      ],
      servicesIncludedEn: [
        "Buffet lunch on boat (or Indian set menu)",
        "Complimentary filtered water at lunch",
        "Welcome drink",
        "Surprising Cave visit",
        "Kayak or bamboo boat at Luon Cave",
        "Swim and hike on Titov Island",
        "Jacuzzi and towel",
        "Sunset party: tea, juice, fruit & cakes",
        "Entrance and sightseeing fees",
        "English-speaking guide",
        "Round-trip limousine (19–22) or shuttle bus (30)",
        "2 mineral waters per guest on the coach"
      ],
      servicesExcluded: ["VAT", "Đồ uống không nêu ở phần bao gồm", "Tip và chi tiêu cá nhân", "Phụ thu ngày lễ / Tết: 15 USD/khách"],
      servicesExcludedEn: ["VAT", "Beverages not listed as included", "Tips and personal expenses", "Public holiday / Tet surcharge: 15 USD/guest"],
      serviceNote: "Giá hiển thị theo limousine nhóm 19–22 khách ($119). Shuttle 30 khách: $109.",
      serviceNoteEn: "Listed price is limousine group 19–22 ($119). Shuttle bus 30 guests: $109.",
      offers: ["Tàu Signature 5 sao", "Có set menu Ấn Độ", "Jacuzzi bốn mùa"],
      offersEn: ["Signature 5-star cruise", "Indian set menus available", "Four-season jacuzzi"],
      buffetMenu: {
        title: "Thực đơn buffet Signature",
        titleEn: "Signature buffet menu",
        columns: [
          [
            {
              name: "Starter",
              items: [
                { vi: "Súp hải sản", en: "Seafood soup" },
                { vi: "Súp bí ngô kem", en: "Pumpkin cream soup", veg: "Chay", vegEn: "Veg" }
              ]
            },
            {
              name: "Salad & cold",
              items: [
                { vi: "Salad sứa trộn xoài xanh", en: "Salad mixed jellyfish with green mango" },
                { vi: "Salad rau trộn xốt Mayonnaise", en: "Salad mixed vegetables with mayonnaise", veg: "Chay", vegEn: "Veg" },
                { vi: "Salad nui trộn củ quả", en: "Macaroni salad with vegetables", veg: "Chay", vegEn: "Veg" },
                { vi: "Nem tươi cuốn (chay + mặn)", en: "Fresh spring rolls", veg: "Chay + mặn", vegEn: "Veg + non-veg" },
                { vi: "Cơm cuộn thập cẩm", en: "Seaweed rice roll", veg: "Chay + mặn", vegEn: "Veg + non-veg" },
                { vi: "Khoai tây chiên lắc phô mai", en: "French fries", veg: "Chay", vegEn: "Veg" },
                { vi: "Bánh mì cắt lát", en: "Sliced bread", veg: "Chay", vegEn: "Veg" }
              ]
            }
          ],
          [
            {
              name: "Hot station",
              items: [
                { vi: "Hàu nướng mỡ hành Hạ Long", en: "Halong grilled oyster with scallion oil" },
                { vi: "Bò hầm sốt vang", en: "Stew beef with wine sauce" },
                { vi: "Gà xào nấm", en: "Stir-fried chicken with mushrooms" },
                { vi: "Tôm biển hấp bia tươi", en: "Steamed shrimp with beer" },
                { vi: "Cá sốt ngũ vị", en: "Steamed fish sweet and sour" },
                { vi: "Chả mực Halong", en: "Halong squid cake" },
                { vi: "Mực xào ngũ sắc", en: "Stir-fried squid with vegetables" },
                { vi: "Mì xào thập cẩm chay", en: "Stir-fried noodles mixed vegetable", veg: "Chay", vegEn: "Veg" },
                { vi: "Rau cải thìa xào nấm hương", en: "Stir-fried bok choy with mushroom", veg: "Chay", vegEn: "Veg" },
                { vi: "Cơm tám thơm", en: "Steamed rice", veg: "Chay", vegEn: "Veg" }
              ]
            }
          ],
          [
            {
              name: "Dessert & sunset",
              items: [
                { vi: "Bánh ngọt", en: "Cake" },
                { vi: "Chè đậu xanh hoa cau", en: "Green beans sweet gruel", veg: "Chay", vegEn: "Veg" },
                { vi: "Trái cây theo mùa", en: "Seasonal fruits", veg: "Chay", vegEn: "Veg" },
                { vi: "Bánh phồng tôm", en: "Vietnamese prawn crackers" },
                { vi: "Nước chanh leo", en: "Passion fruit" },
                { vi: "Trà chanh sả", en: "Lemon tea" }
              ]
            }
          ]
        ],
        note: "Thực đơn có thể thay đổi mà không báo trước, tùy mùa hoặc thời tiết.",
        noteEn: "Menu may change without notice depending on season or weather.",
        vegNote: "(*) Món chay · Vegetarian dishes",
        vegNoteEn: "(*) Vegetarian dishes"
      }
    },

    /* —— Ninh Bình —— */
    {
      id: "ninh-binh",
      destination: "ninh-binh",
      featured: true,
      stars: 5,
      name: "Hoa Lư – Tam Cốc/Tràng An – Hang Múa",
      nameEn: "Hoa Lu – Tam Coc/Trang An – Mua Cave",
      durationLabel: "1 ngày",
      durationLabelEn: "1 day",
      nightsOffset: 0,
      price: 1955000,
      priceNote: "$79 limousine · $99 Dcar · $69 shuttle",
      priceNoteEn: "$79 limousine · $99 Dcar · $69 shuttle",
      image: "img/tours/ninh-binh.jpg",
      media: [
        { type: "image", src: "img/destinations/ninh-binh/hoa-lu.jpg", alt: "Cố đô Hoa Lư", altEn: "Hoa Lu ancient capital" },
        { type: "image", src: "img/destinations/ninh-binh/tam-coc-boat.jpg", alt: "Thuyền Tam Cốc sông Ngô Đồng", altEn: "Tam Coc boat on Ngo Dong River" },
        { type: "image", src: "img/destinations/ninh-binh/tam-coc-rice.jpg", alt: "Cánh đồng lúa Tam Cốc", altEn: "Tam Coc rice fields" },
        { type: "image", src: "img/destinations/ninh-binh/mua-cave-peak.jpg", alt: "Đỉnh Hang Múa nhìn thung lũng", altEn: "Mua Cave peak over the valley" },
        { type: "image", src: "img/destinations/ninh-binh/mua-cave-steps.jpg", alt: "500 bậc đá Hang Múa", altEn: "500 stone steps at Mua Cave" },
        { type: "image", src: "img/venues/heritage-garden.jpg", alt: "Trang An Heritage Garden", altEn: "Trang An Heritage Garden" },
        { type: "image", src: "img/experiences/cycling-village.jpg", alt: "Đạp xe làng quê Ninh Bình", altEn: "Cycling through Ninh Binh villages" },
        { type: "image", src: "img/food/ninh-binh-goat.jpg", alt: "Đặc sản Ninh Bình", altEn: "Ninh Binh specialties" },
      ],
      cardLine: "Tour Ninh Bình Heritage Premium cả ngày: cố đô Hoa Lư, đạp xe 30 phút hoặc thư giãn tại Trang An Heritage Garden, thuyền Tam Cốc hoặc Tràng An, leo Hang Múa. Buffet/set lunch đặc sản. Limousine nhóm $79/khách.",
      cardLineEn: "Full-day Ninh Binh Heritage Premium: Hoa Lu ancient capital, 30-minute cycling or relax at Trang An Heritage Garden, boat at Tam Coc or Trang An, climb Mua Cave. Local specialty lunch. Limousine group from $79/guest.",
      description: [
        "Chọn thuyền Tam Cốc (Hạ Long trên cạn) hoặc Tràng An UNESCO.",
        "Ăn trưa tại Trang An Heritage Garden — có lựa chọn chay.",
        "Nón lá và áo mưa miễn phí trong chuyến."
      ],
      descriptionEn: [
        "Choose a Tam Coc boat (“Ha Long on land”) or UNESCO Trang An.",
        "Lunch at Trang An Heritage Garden — vegetarian option available.",
        "Free conical hat and raincoat during the trip."
      ],
      itinerary: [
        { time: "07:15–08:00", title: "Đón khách Hà Nội", text: "Hướng dẫn và tài xế đón tại khách sạn phố cổ, đi Ninh Bình." },
        { time: "09:15", title: "Nghỉ ngắn", text: "Dừng 15–20 phút dọc đường." },
        { time: "10:30", title: "Cố đô Hoa Lư", text: "Tham quan đền thờ Vua Đinh và Vua Lê, lịch sử triều Đinh – Lê – Lý." },
        { time: "11:15–11:45", title: "Đạp xe / thư giãn", text: "Đạp xe 30 phút quanh làng, hoặc nghỉ nhà hàng ngắm hồ, thác, thung lũng. Mùa hè có hồ bơi." },
        { time: "12:00", title: "Ăn trưa", text: "Đặc sản Ninh Bình tại khu riêng Trang An Heritage Garden." },
        { time: "13:15–13:30", title: "Thuyền Tam Cốc hoặc Tràng An", text: "Khoảng 1,5 giờ trên sông — hang động và cánh đồng lúa / hệ thống hang Tràng An." },
        { time: "15:30", title: "Hang Múa", text: "Leo khoảng 500 bậc lên đỉnh Núi Ngọa Long, nhìn xuống Tam Cốc." },
        { time: "16:30–17:00", title: "Về Hà Nội", text: "Lên xe về phố cổ." },
        { time: "19:00–19:30", title: "Trả khách", text: "Đưa về khách sạn phố cổ Hà Nội." }
      ],
      itineraryEn: [
        { time: "07:15–08:00", title: "Hanoi pickup", text: "Guide and driver pick you up at your Old Quarter hotel for Ninh Binh." },
        { time: "09:15", title: "Short break", text: "A 15–20 minute stop on the way." },
        { time: "10:30", title: "Hoa Lu ancient capital", text: "Visit the temples of Kings Dinh and Le; history under the Dinh, Le, and Ly dynasties." },
        { time: "11:15–11:45", title: "Cycling / relax", text: "30 minutes of cycling through local life, or stay at the restaurant with lake and valley views. Pool in summer." },
        { time: "12:00", title: "Lunch", text: "Local specialties in the private area of Trang An Heritage Garden." },
        { time: "13:15–13:30", title: "Tam Coc or Trang An boat", text: "About 1.5 hours on the water — caves and paddies, or the Trang An tunnel system." },
        { time: "15:30", title: "Mua Cave", text: "Climb about 500 steps to Ngoa Long peak overlooking Tam Coc." },
        { time: "16:30–17:00", title: "Return to Hanoi", text: "Transfer back to the Old Quarter." },
        { time: "19:00–19:30", title: "Hotel drop-off", text: "Drop-off at your Old Quarter hotel." }
      ],
      servicesIncluded: [
        "Bữa trưa đặc sản địa phương",
        "Hoạt động đạp xe (tuỳ chọn)",
        "Vé vào cửa & thuyền chung Tam Cốc (2–3 khách/thuyền) hoặc Tràng An (4 khách/thuyền)",
        "Xe limousine / shuttle Hà Nội – Ninh Bình – Hà Nội",
        "Hướng dẫn viên tiếng Anh",
        "Wifi miễn phí, 01 chai nước/chiều trên xe",
        "Nón lá & áo mưa miễn phí trong chuyến"
      ],
      servicesIncludedEn: [
        "Lunch with local specialties",
        "Optional bicycle activity",
        "Entrance & sharing boat — Tam Coc 2–3/pax boat or Trang An 4/pax boat",
        "Hanoi – Ninh Binh – Hanoi limousine / shuttle",
        "English-speaking guide",
        "Free Wi‑Fi, 1 mineral water each way on the coach",
        "Free conical hat & raincoat during the trip"
      ],
      servicesExcluded: ["VAT", "Đồ uống", "Tip hướng dẫn & tài xế", "Chi tiêu cá nhân", "Phụ thu Tết: 15 USD/khách"],
      servicesExcludedEn: ["VAT", "Beverages", "Tips for guide & driver", "Personal expenses", "Tet surcharge: 15 USD/guest"],
      serviceNote: "Giá hiển thị theo limousine nhóm 19–22 ($79, buffet). Dcar 7–9 khách: $99 set menu. Shuttle 26–30: $69.",
      serviceNoteEn: "Listed price is limousine group 19–22 ($79, buffet). Dcar 7–9: $99 set menu. Shuttle 26–30: $69.",
      offers: ["Nón lá & áo mưa miễn phí", "Buffet hoặc set menu", "Limousine nhóm"],
      offersEn: ["Free hat & raincoat", "Buffet or set menu", "Group limousine"]
    },
    {
      id: "ninh-binh-tam-coc",
      destination: "ninh-binh",
      featured: false,
      stars: 5,
      name: "Hoa Lư – Tam Cốc/Tràng An",
      nameEn: "Hoa Lu – Tam Coc/Trang An",
      durationLabel: "1 ngày",
      durationLabelEn: "1 day",
      nightsOffset: 0,
      price: 1807000,
      priceNote: "$73 limousine · $93 Dcar · $63 shuttle",
      priceNoteEn: "$73 limousine · $93 Dcar · $63 shuttle",
      image: "img/tours/ninh-binh-tam-coc.jpg",
      media: [
        { type: "image", src: "img/destinations/ninh-binh/hoa-lu.jpg", alt: "Đền vua Đinh – Lê Hoa Lư", altEn: "Hoa Lu royal temples" },
        { type: "image", src: "img/destinations/ninh-binh/tam-coc-boat.jpg", alt: "Thuyền nan Tam Cốc", altEn: "Tam Coc sampan" },
        { type: "image", src: "img/destinations/ninh-binh/trang-an-boat.jpg", alt: "Thuyền Tràng An", altEn: "Trang An boat" },
        { type: "image", src: "img/venues/heritage-garden-restaurant.jpg", alt: "Nhà hàng Heritage Garden", altEn: "Heritage Garden restaurant" },
        { type: "image", src: "img/experiences/cycling-village.jpg", alt: "Đạp xe quanh làng", altEn: "Village cycling" },
        { type: "image", src: "img/fleet/limousine-mid.jpg", alt: "Xe limousine Hà Nội – Ninh Bình", altEn: "Limousine Hanoi – Ninh Binh" },
      ],
      cardLine: "Cùng khung Hoa Lư và thuyền Tam Cốc hoặc Tràng An, không leo Hang Múa — về Hà Nội sớm hơn. Đạp xe, buffet/set lunch tại Trang An Heritage Garden. Limousine $73/khách.",
      cardLineEn: "Same Hoa Lu and Tam Coc or Trang An boat day, without Mua Cave — earlier return to Hanoi. Cycling and lunch at Trang An Heritage Garden. Limousine from $73/guest.",
      description: [
        "Phù hợp ai muốn thuyền và cố đô mà không leo 500 bậc Hang Múa.",
        "Về khách sạn khoảng 18:30–19:00.",
        "Chọn Tam Cốc hoặc Tràng An theo lịch đoàn."
      ],
      descriptionEn: [
        "For guests who want the boat and ancient capital without climbing Mua Cave.",
        "Back at the hotel around 18:30–19:00.",
        "Tam Coc or Trang An depending on the group plan."
      ],
      itinerary: [
        { time: "07:15–08:00", title: "Đón khách", text: "Đón tại phố cổ Hà Nội đi Ninh Bình." },
        { time: "09:15", title: "Nghỉ ngắn", text: "Dừng 15–20 phút." },
        { time: "10:30", title: "Hoa Lư", text: "Đền Vua Đinh và Vua Lê." },
        { time: "11:15–11:45", title: "Đạp xe / thư giãn", text: "30 phút đạp xe hoặc nghỉ tại Heritage Garden." },
        { time: "12:00", title: "Ăn trưa", text: "Đặc sản tại Trang An Heritage Garden." },
        { time: "13:15–13:30", title: "Thuyền", text: "1,5 giờ Tam Cốc hoặc Tràng An." },
        { time: "16:00–16:30", title: "Về Hà Nội", text: "Không đi Hang Múa — về sớm hơn." },
        { time: "18:30–19:00", title: "Trả khách", text: "Khách sạn phố cổ Hà Nội." }
      ],
      itineraryEn: [
        { time: "07:15–08:00", title: "Pickup", text: "Pickup in Hanoi Old Quarter for Ninh Binh." },
        { time: "09:15", title: "Short break", text: "15–20 minutes on the way." },
        { time: "10:30", title: "Hoa Lu", text: "Temples of Kings Dinh and Le." },
        { time: "11:15–11:45", title: "Cycling / relax", text: "30 minutes cycling or rest at Heritage Garden." },
        { time: "12:00", title: "Lunch", text: "Local specialties at Trang An Heritage Garden." },
        { time: "13:15–13:30", title: "Boat", text: "1.5 hours at Tam Coc or Trang An." },
        { time: "16:00–16:30", title: "Return", text: "No Mua Cave — earlier return to Hanoi." },
        { time: "18:30–19:00", title: "Drop-off", text: "Old Quarter hotel." }
      ],
      servicesIncluded: [
        "Bữa trưa đặc sản",
        "Hoạt động đạp xe (tuỳ chọn)",
        "Vé & thuyền chung Tam Cốc / Tràng An",
        "Xe khứ hồi Hà Nội – Ninh Bình",
        "Hướng dẫn viên tiếng Anh",
        "Wifi, nước suối trên xe",
        "Nón lá & áo mưa miễn phí"
      ],
      servicesIncludedEn: [
        "Lunch with local specialties",
        "Optional bicycle activity",
        "Entrance & sharing boat Tam Coc / Trang An",
        "Round-trip Hanoi – Ninh Binh transfer",
        "English-speaking guide",
        "Wi‑Fi and bottled water on the coach",
        "Free conical hat & raincoat"
      ],
      servicesExcluded: ["VAT", "Đồ uống", "Tip", "Chi tiêu cá nhân", "Phụ thu Tết: 15 USD/khách"],
      servicesExcludedEn: ["VAT", "Beverages", "Tips", "Personal expenses", "Tet surcharge: 15 USD/guest"],
      offers: ["Về sớm hơn (không Hang Múa)", "Buffet/set lunch Heritage Garden"],
      offersEn: ["Earlier return (no Mua Cave)", "Buffet/set lunch at Heritage Garden"]
    },
    {
      id: "ninh-binh-bai-dinh",
      destination: "ninh-binh",
      featured: false,
      stars: 5,
      name: "Bái Đính – Tràng An – Hang Múa",
      nameEn: "Bai Dinh – Trang An – Mua Cave",
      durationLabel: "1 ngày",
      durationLabelEn: "1 day",
      nightsOffset: 0,
      price: 2054000,
      priceNote: "$83 limousine · $73 shuttle",
      priceNoteEn: "$83 limousine · $73 shuttle",
      image: "img/tours/ninh-binh-bai-dinh.jpg",
      media: [
        { type: "image", src: "img/destinations/ninh-binh/bich-dong.jpg", alt: "Quần thể chùa núi Ninh Bình", altEn: "Mountain pagoda complex" },
        { type: "image", src: "img/destinations/ninh-binh/trang-an-boat.jpg", alt: "Thuyền Tràng An xuyên hang", altEn: "Trang An cave boat" },
        { type: "image", src: "img/destinations/ninh-binh/trang-an-cave.jpg", alt: "Hang động Tràng An", altEn: "Trang An caves" },
        { type: "image", src: "img/destinations/ninh-binh/mua-cave-peak.jpg", alt: "Toàn cảnh từ Hang Múa", altEn: "Panorama from Mua Cave" },
        { type: "image", src: "img/venues/heritage-garden.jpg", alt: "Trang An Heritage Garden", altEn: "Trang An Heritage Garden" },
        { type: "image", src: "img/food/ninh-binh-com-chay.jpg", alt: "Cơm cháy & đặc sản", altEn: "Scorched rice and local dishes" },
      ],
      cardLine: "Chùa Bái Đính với xe điện hai chiều, thuyền Tràng An UNESCO và leo Hang Múa. Ăn trưa đặc sản tại Trang An Heritage Garden. Limousine $83/khách.",
      cardLineEn: "Bai Dinh Pagoda with round-trip electric car, UNESCO Trang An boat, and Mua Cave climb. Specialty lunch at Trang An Heritage Garden. Limousine from $83/guest.",
      description: [
        "Bái Đính: 500 tượng La Hán đá, chuông đồng lớn, tượng Quan Âm.",
        "Thuyền Tràng An khoảng 1,5 giờ qua hệ thống hang.",
        "Xe điện hai chiều trong khuôn viên Bái Đính đã gồm."
      ],
      descriptionEn: [
        "Bai Dinh: 500 stone Arhat statues, great bronze bells, Goddess of Mercy statue.",
        "About 1.5 hours on the Trang An boat through the cave system.",
        "Round-trip electric car inside Bai Dinh included."
      ],
      itinerary: [
        { time: "07:15–08:00", title: "Đón khách", text: "Đón phố cổ Hà Nội đi Ninh Bình." },
        { time: "09:15", title: "Nghỉ ngắn", text: "Dừng 15–20 phút." },
        { time: "10:30", title: "Chùa Bái Đính", text: "Tham quan quần thể chùa; xe điện hai chiều trong khuôn viên." },
        { time: "12:00", title: "Ăn trưa", text: "Đặc sản tại Trang An Heritage Garden." },
        { time: "13:15–13:30", title: "Tràng An", text: "1,5 giờ thuyền qua hang động UNESCO." },
        { time: "15:30", title: "Hang Múa", text: "Leo 500 bậc ngắm toàn cảnh." },
        { time: "17:00", title: "Về Hà Nội", text: "Lên xe về phố cổ." },
        { time: "19:00–19:30", title: "Trả khách", text: "Khách sạn phố cổ." }
      ],
      itineraryEn: [
        { time: "07:15–08:00", title: "Pickup", text: "Pickup in Hanoi Old Quarter." },
        { time: "09:15", title: "Short break", text: "15–20 minutes on the way." },
        { time: "10:30", title: "Bai Dinh Pagoda", text: "Explore the complex; round-trip electric car on site." },
        { time: "12:00", title: "Lunch", text: "Specialties at Trang An Heritage Garden." },
        { time: "13:15–13:30", title: "Trang An", text: "1.5-hour UNESCO boat through the caves." },
        { time: "15:30", title: "Mua Cave", text: "Climb 500 steps for the view." },
        { time: "17:00", title: "Return", text: "Transfer back to Hanoi." },
        { time: "19:00–19:30", title: "Drop-off", text: "Old Quarter hotel." }
      ],
      servicesIncluded: [
        "Bữa trưa đặc sản",
        "Xe điện hai chiều tại Bái Đính",
        "Vé & thuyền chung Tràng An",
        "Xe khứ hồi Hà Nội – Ninh Bình",
        "Hướng dẫn viên tiếng Anh",
        "Wifi & nước suối trên xe",
        "Nón lá & áo mưa miễn phí"
      ],
      servicesIncludedEn: [
        "Lunch with local specialties",
        "Round-trip electric car at Bai Dinh",
        "Entrance & sharing boat at Trang An",
        "Round-trip Hanoi – Ninh Binh",
        "English-speaking guide",
        "Wi‑Fi & bottled water on the coach",
        "Free conical hat & raincoat"
      ],
      servicesExcluded: ["VAT", "Đồ uống", "Tip", "Chi tiêu cá nhân", "Phụ thu Tết: 15 USD/khách"],
      servicesExcludedEn: ["VAT", "Beverages", "Tips", "Personal expenses", "Tet surcharge: 15 USD/guest"],
      offers: ["Xe điện Bái Đính đã gồm", "Buffet/set lunch Heritage Garden"],
      offersEn: ["Bai Dinh electric car included", "Buffet/set lunch at Heritage Garden"]
    },
    {
      id: "ninh-binh-2d1n",
      destination: "ninh-binh",
      featured: false,
      stars: 5,
      name: "Khám phá cố đô Ninh Bình 2N1Đ",
      nameEn: "Discover Ninh Binh ancient capital 2D1N",
      durationLabel: "2 ngày 1 đêm",
      durationLabelEn: "2 days 1 night",
      nightsOffset: 1,
      price: 4184000,
      priceNote: "$169 limousine từ 2 khách",
      priceNoteEn: "$169 limousine from 2 guests",
      image: "img/tours/ninh-binh-2d1n.jpg",
      media: [
        { type: "image", src: "img/venues/heritage-garden.jpg", alt: "Khu nghỉ Trang An Heritage Garden", altEn: "Trang An Heritage Garden stay" },
        { type: "image", src: "img/venues/heritage-garden-pool.jpg", alt: "Bể bơi mùa hè Heritage Garden", altEn: "Heritage Garden summer pool" },
        { type: "image", src: "img/destinations/ninh-binh/trang-an-boat.jpg", alt: "Thuyền Tràng An", altEn: "Trang An boat" },
        { type: "image", src: "img/destinations/ninh-binh/hoa-lu.jpg", alt: "Cố đô Hoa Lư ngày 2", altEn: "Hoa Lu on day 2" },
        { type: "image", src: "img/destinations/ninh-binh/tam-coc-boat.jpg", alt: "Tam Cốc ngày 2", altEn: "Tam Coc on day 2" },
        { type: "image", src: "img/destinations/ninh-binh/mua-cave-steps.jpg", alt: "Leo Hang Múa", altEn: "Climbing Mua Cave" },
        { type: "image", src: "img/food/ninh-binh-goat.jpg", alt: "Buffet đặc sản Ninh Bình", altEn: "Ninh Binh specialty buffet" },
      ],
      cardLine: "Hai ngày một đêm tại Trang An Heritage Garden: ngày 1 Bái Đính – Tràng An, nghỉ đêm và hồ bơi; ngày 2 Hoa Lư – đạp xe – Tam Cốc – Hang Múa. Limousine từ $169/khách (2 khách trở lên).",
      cardLineEn: "Two days one night at Trang An Heritage Garden: day 1 Bai Dinh – Trang An, overnight with pool; day 2 Hoa Lu – cycling – Tam Coc – Mua Cave. Limousine from $169/guest (from 2 guests).",
      description: [
        "Nghỉ 1 đêm tại Trang An Heritage Garden (2–3 khách/phòng).",
        "Gồm 2 buffet trưa, 1 set tối, 1 bữa sáng.",
        "Phụ thu phòng đơn: 15 USD/phòng."
      ],
      descriptionEn: [
        "1 night at Trang An Heritage Garden (2–3 guests/room).",
        "Includes 2 buffet lunches, 1 set dinner, 1 breakfast.",
        "Single supplement: 15 USD/room."
      ],
      itinerary: [
        { time: "Ngày 1 · 07:30–08:00", title: "Đón khách", text: "Đón Hà Nội đi Ninh Bình." },
        { time: "Ngày 1 · 10:30", title: "Bái Đính", text: "Tham quan chùa Bái Đính." },
        { time: "Ngày 1 · 12:15", title: "Ăn trưa", text: "Buffet tại Trang An Heritage." },
        { time: "Ngày 1 · 13:30", title: "Tràng An", text: "Thuyền 1,5 giờ." },
        { time: "Ngày 1 · 16:00", title: "Check-in", text: "Về Heritage Garden, hồ bơi mùa hè, ăn tối, nghỉ đêm." },
        { time: "Ngày 2 · 07:30", title: "Ăn sáng", text: "Buffet sáng, check-out." },
        { time: "Ngày 2 · 10:30", title: "Hoa Lư", text: "Cố đô và đền Vua Đinh – Lê." },
        { time: "Ngày 2 · 11:15", title: "Đạp xe", text: "30 phút đạp xe quanh làng." },
        { time: "Ngày 2 · 12:00", title: "Ăn trưa", text: "Buffet tại Heritage Garden." },
        { time: "Ngày 2 · 13:15", title: "Tam Cốc", text: "Thuyền 1,5 giờ trên sông Ngô Đồng." },
        { time: "Ngày 2 · 15:30", title: "Hang Múa", text: "Leo 500 bậc." },
        { time: "Ngày 2 · 17:00", title: "Về Hà Nội", text: "Trả khách khoảng 19:30–19:45." }
      ],
      itineraryEn: [
        { time: "Day 1 · 07:30–08:00", title: "Pickup", text: "Hanoi to Ninh Binh." },
        { time: "Day 1 · 10:30", title: "Bai Dinh", text: "Visit Bai Dinh Pagoda." },
        { time: "Day 1 · 12:15", title: "Lunch", text: "Buffet at Trang An Heritage." },
        { time: "Day 1 · 13:30", title: "Trang An", text: "1.5-hour boat." },
        { time: "Day 1 · 16:00", title: "Check-in", text: "Heritage Garden, summer pool, dinner, overnight." },
        { time: "Day 2 · 07:30", title: "Breakfast", text: "Breakfast then check-out." },
        { time: "Day 2 · 10:30", title: "Hoa Lu", text: "Ancient capital and royal temples." },
        { time: "Day 2 · 11:15", title: "Cycling", text: "30 minutes through local life." },
        { time: "Day 2 · 12:00", title: "Lunch", text: "Buffet at Heritage Garden." },
        { time: "Day 2 · 13:15", title: "Tam Coc", text: "1.5 hours on the Ngo Dong River." },
        { time: "Day 2 · 15:30", title: "Mua Cave", text: "Climb 500 steps." },
        { time: "Day 2 · 17:00", title: "Return", text: "Drop-off around 19:30–19:45." }
      ],
      servicesIncluded: [
        "2 buffet trưa; 1 set menu tối; 1 bữa sáng",
        "1 đêm Trang An Heritage Garden (2–3 khách/phòng)",
        "Đạp xe (tuỳ chọn)",
        "Xe điện hai chiều Bái Đính",
        "Vé & thuyền Tam Cốc / Tràng An",
        "Limousine / shuttle khứ hồi Hà Nội",
        "Hướng dẫn tiếng Anh",
        "Wifi, nước suối, nón lá & áo mưa"
      ],
      servicesIncludedEn: [
        "2 buffet lunches; 1 set dinner; 1 breakfast",
        "1 night at Trang An Heritage Garden (2–3/room)",
        "Optional bicycle activity",
        "Round-trip electric car at Bai Dinh",
        "Entrance & boat Tam Coc / Trang An",
        "Round-trip limousine / shuttle from Hanoi",
        "English-speaking guide",
        "Wi‑Fi, water, conical hat & raincoat"
      ],
      servicesExcluded: ["VAT", "Đồ uống", "Tip", "Chi tiêu cá nhân", "Phụ thu phòng đơn 15 USD", "Phụ thu Tết: 15 USD/khách/đêm"],
      servicesExcludedEn: ["VAT", "Beverages", "Tips", "Personal expenses", "Single supplement 15 USD", "Tet surcharge: 15 USD/guest/night"],
      offers: ["Nghỉ tại Trang An Heritage Garden", "Hồ bơi mùa hè"],
      offersEn: ["Stay at Trang An Heritage Garden", "Summer swimming pool"]
    },
    {
      id: "ninh-binh-bai-dinh-trang-an",
      destination: "ninh-binh",
      featured: false,
      stars: 5,
      name: "Bái Đính – Tràng An",
      nameEn: "Bai Dinh – Trang An",
      durationLabel: "1 ngày",
      durationLabelEn: "1 day",
      nightsOffset: 0,
      price: 1881000,
      priceNote: "$76 limousine · $66 shuttle",
      priceNoteEn: "$76 limousine · $66 shuttle",
      image: "img/tours/ninh-binh-bai-dinh-trang-an.jpg",
      media: [
        { type: "image", src: "img/destinations/ninh-binh/bich-dong.jpg", alt: "Chùa Bái Đính / quần thể chùa", altEn: "Bai Dinh / pagoda complex" },
        { type: "image", src: "img/destinations/ninh-binh/trang-an-boat.jpg", alt: "Thuyền Tràng An", altEn: "Trang An boat" },
        { type: "image", src: "img/destinations/ninh-binh/trang-an-cave.jpg", alt: "Hang xuyên thủy Tràng An", altEn: "Trang An water caves" },
        { type: "image", src: "img/venues/heritage-garden-restaurant.jpg", alt: "Buffet Heritage Garden", altEn: "Heritage Garden buffet" },
        { type: "image", src: "img/fleet/shuttle-bus.jpg", alt: "Shuttle bus đưa đón", altEn: "Shuttle bus transfer" },
      ],
      cardLine: "Chùa Bái Đính (xe điện hai chiều) và thuyền Tràng An UNESCO — không leo Hang Múa, về Hà Nội sớm hơn. Buffet trưa tại Trang An Heritage Garden. Limousine $76/khách.",
      cardLineEn: "Bai Dinh Pagoda (round-trip electric car) and UNESCO Trang An boat — no Mua Cave climb, earlier return to Hanoi. Buffet lunch at Trang An Heritage Garden. Limousine from $76/guest.",
      description: [
        "Bái Đính: tượng La Hán đá, chuông đồng lớn, tượng Quan Âm.",
        "Thuyền Tràng An khoảng 1,5 giờ qua hệ thống hang.",
        "Không gồm Hang Múa — lịch nhẹ hơn tour đủ ba điểm."
      ],
      descriptionEn: [
        "Bai Dinh: stone Arhats, great bronze bells, Goddess of Mercy.",
        "About 1.5 hours on the Trang An boat through the caves.",
        "No Mua Cave — a lighter day than the three-stop version."
      ],
      itinerary: [
        { time: "07:30–08:00", title: "Đón khách", text: "Đón phố cổ Hà Nội đi Ninh Bình." },
        { time: "09:15", title: "Nghỉ ngắn", text: "Dừng 15–20 phút." },
        { time: "10:30", title: "Chùa Bái Đính", text: "Tham quan quần thể; xe điện hai chiều trong khuôn viên." },
        { time: "12:00", title: "Ăn trưa", text: "Buffet đặc sản tại Trang An Heritage Garden." },
        { time: "13:30", title: "Tràng An", text: "1,5 giờ thuyền UNESCO." },
        { time: "16:00–16:30", title: "Về Hà Nội", text: "Không đi Hang Múa." },
        { time: "18:30–19:00", title: "Trả khách", text: "Khách sạn phố cổ." }
      ],
      itineraryEn: [
        { time: "07:30–08:00", title: "Pickup", text: "Pickup in Hanoi Old Quarter." },
        { time: "09:15", title: "Short break", text: "15–20 minutes on the way." },
        { time: "10:30", title: "Bai Dinh Pagoda", text: "Explore the complex; round-trip electric car on site." },
        { time: "12:00", title: "Lunch", text: "Buffet at Trang An Heritage Garden." },
        { time: "13:30", title: "Trang An", text: "1.5-hour UNESCO boat." },
        { time: "16:00–16:30", title: "Return", text: "No Mua Cave — earlier return." },
        { time: "18:30–19:00", title: "Drop-off", text: "Old Quarter hotel." }
      ],
      servicesIncluded: [
        "Buffet trưa đặc sản",
        "Xe điện hai chiều tại Bái Đính",
        "Vé & thuyền chung Tràng An",
        "Xe khứ hồi Hà Nội – Ninh Bình",
        "Hướng dẫn viên tiếng Anh",
        "Wifi & nước suối trên xe",
        "Nón lá & áo mưa miễn phí"
      ],
      servicesIncludedEn: [
        "Buffet lunch with local specialties",
        "Round-trip electric car at Bai Dinh",
        "Entrance & sharing boat at Trang An",
        "Round-trip Hanoi – Ninh Binh",
        "English-speaking guide",
        "Wi‑Fi & bottled water on the coach",
        "Free conical hat & raincoat"
      ],
      servicesExcluded: ["VAT", "Đồ uống", "Tip", "Chi tiêu cá nhân", "Phụ thu Tết: 15 USD/khách"],
      servicesExcludedEn: ["VAT", "Beverages", "Tips", "Personal expenses", "Tet surcharge: 15 USD/guest"],
      offers: ["Không leo Hang Múa", "Buffet trưa Heritage Garden"],
      offersEn: ["No Mua Cave climb", "Buffet lunch at Heritage Garden"]
    },
    {
      id: "ninh-binh-2d1n-pagoda",
      destination: "ninh-binh",
      featured: false,
      stars: 5,
      name: "Cố đô & chùa Ninh Bình 2N1Đ",
      nameEn: "Ancient capital & pagodas 2D1N",
      durationLabel: "2 ngày 1 đêm",
      durationLabelEn: "2 days 1 night",
      nightsOffset: 1,
      price: 4677000,
      priceNote: "$189 limousine từ 2 khách",
      priceNoteEn: "$189 limousine from 2 guests",
      image: "img/tours/ninh-binh-2d1n-pagoda.jpg",
      media: [
        { type: "image", src: "img/destinations/ninh-binh/hoa-lu.jpg", alt: "Hoa Lư ngày 1", altEn: "Hoa Lu day 1" },
        { type: "image", src: "img/destinations/ninh-binh/bich-dong.jpg", alt: "Chùa Bích Động", altEn: "Bich Dong Pagoda" },
        { type: "image", src: "img/destinations/ninh-binh/thai-vi.jpg", alt: "Đền Thái Vi", altEn: "Thai Vi Temple" },
        { type: "image", src: "img/destinations/ninh-binh/thung-nham.jpg", alt: "Vườn chim Thung Nham", altEn: "Thung Nham bird valley" },
        { type: "image", src: "img/destinations/ninh-binh/mua-cave-peak.jpg", alt: "Hang Múa", altEn: "Mua Cave" },
        { type: "image", src: "img/venues/heritage-garden-pool.jpg", alt: "Nghỉ đêm Heritage Garden", altEn: "Overnight at Heritage Garden" },
      ],
      cardLine: "Ngày 1: Hoa Lư – thuyền Tam Cốc/Tràng An – Hang Múa, nghỉ Trang An Heritage Garden. Ngày 2: đền Thái Vi, chùa Bích Động, thung chim Thung Nham. Limousine từ $189/khách.",
      cardLineEn: "Day 1: Hoa Lu – Tam Coc/Trang An boat – Mua Cave, overnight at Trang An Heritage Garden. Day 2: Thai Vi temple, Bich Dong pagoda, Thung Nham bird valley. Limousine from $189/guest.",
      description: [
        "Đêm tại Trang An Heritage Garden (2–3 khách/phòng).",
        "Ngày 2 có thuyền Thung Nham (10–12 khách/thuyền).",
        "Phụ thu phòng đơn: 15 USD/phòng."
      ],
      descriptionEn: [
        "Overnight at Trang An Heritage Garden (2–3 guests/room).",
        "Day 2 includes Thung Nham boat (10–12 guests/boat).",
        "Single supplement: 15 USD/room."
      ],
      itinerary: [
        { time: "Ngày 1 · sáng", title: "Hoa Lư & đạp xe", text: "Cố đô Hoa Lư, đạp xe 30 phút hoặc thư giãn tại Heritage Garden." },
        { time: "Ngày 1 · trưa", title: "Buffet & thuyền", text: "Buffet trưa, rồi Tam Cốc hoặc Tràng An khoảng 1,5 giờ." },
        { time: "Ngày 1 · chiều", title: "Hang Múa & check-in", text: "Leo Hang Múa, về Heritage Garden, ăn tối, nghỉ đêm." },
        { time: "Ngày 2 · sáng", title: "Thái Vi & Bích Động", text: "Đền Thái Vi triều Trần và chùa Bích Động ba tầng." },
        { time: "Ngày 2 · trưa", title: "Ăn trưa", text: "Set menu tại Heritage Garden." },
        { time: "Ngày 2 · chiều", title: "Thung Nham", text: "Thuyền hang Bụt và thung chim — hàng nghìn chim, khoảng 40 loài." },
        { time: "Ngày 2 · tối", title: "Về Hà Nội", text: "Trả khách khoảng 19:30–19:45." }
      ],
      itineraryEn: [
        { time: "Day 1 · morning", title: "Hoa Lu & cycling", text: "Ancient capital and 30 minutes cycling or rest at Heritage Garden." },
        { time: "Day 1 · midday", title: "Buffet & boat", text: "Buffet lunch, then Tam Coc or Trang An for about 1.5 hours." },
        { time: "Day 1 · afternoon", title: "Mua Cave & check-in", text: "Climb Mua Cave, return to Heritage Garden for dinner and overnight." },
        { time: "Day 2 · morning", title: "Thai Vi & Bich Dong", text: "Tran-dynasty Thai Vi temple and three-level Bich Dong pagoda." },
        { time: "Day 2 · midday", title: "Lunch", text: "Set menu at Heritage Garden." },
        { time: "Day 2 · afternoon", title: "Thung Nham", text: "Buddhist Cave sampan and bird valley — thousands of birds, ~40 species." },
        { time: "Day 2 · evening", title: "Return", text: "Drop-off around 19:30–19:45." }
      ],
      servicesIncluded: [
        "1 buffet trưa; 1 set tối + 1 set trưa; 1 bữa sáng",
        "1 đêm Trang An Heritage Garden (2–3 khách/phòng)",
        "Đạp xe (tuỳ chọn)",
        "Vé & thuyền Tam Cốc / Tràng An",
        "Thuyền chung Thung Nham (10–12 khách/thuyền)",
        "Xe limousine / shuttle khứ hồi + minivan nội tuyến",
        "Hướng dẫn tiếng Anh",
        "Wifi, nước suối, nón lá & áo mưa"
      ],
      servicesIncludedEn: [
        "1 buffet lunch; 1 set dinner + 1 set lunch; 1 breakfast",
        "1 night at Trang An Heritage Garden (2–3/room)",
        "Optional bicycle activity",
        "Entrance & boat Tam Coc / Trang An",
        "Sharing boat at Thung Nham (10–12/boat)",
        "Round-trip limousine / shuttle + local minivan",
        "English-speaking guide",
        "Wi‑Fi, water, conical hat & raincoat"
      ],
      servicesExcluded: ["VAT", "Đồ uống", "Tip", "Chi tiêu cá nhân", "Phụ thu phòng đơn 15 USD", "Phụ thu Tết: 15 USD/khách/đêm"],
      servicesExcludedEn: ["VAT", "Beverages", "Tips", "Personal expenses", "Single supplement 15 USD", "Tet surcharge: 15 USD/guest/night"],
      serviceNote: "Limousine từ 2 khách: $189. Shuttle: $179. 1 khách limousine: $229.",
      serviceNoteEn: "Limousine from 2 guests: $189. Shuttle: $179. Solo limousine: $229.",
      offers: ["Thung Nham + Bích Động", "Nghỉ đêm Heritage Garden"],
      offersEn: ["Thung Nham + Bich Dong", "Overnight at Heritage Garden"]
    },
    {
      id: "ninh-binh-2d1n-cuc-phuong",
      destination: "ninh-binh",
      featured: false,
      stars: 5,
      name: "Cố đô & Cúc Phương 2N1Đ",
      nameEn: "Ancient capital & Cuc Phuong 2D1N",
      durationLabel: "2 ngày 1 đêm",
      durationLabelEn: "2 days 1 night",
      nightsOffset: 1,
      price: 4826000,
      priceNote: "$195 limousine từ 2 khách",
      priceNoteEn: "$195 limousine from 2 guests",
      image: "img/tours/ninh-binh-2d1n-cuc-phuong.jpg",
      media: [
        { type: "image", src: "img/destinations/ninh-binh/cuc-phuong.jpg", alt: "Vườn quốc gia Cúc Phương", altEn: "Cuc Phuong National Park" },
        { type: "image", src: "img/destinations/ninh-binh/hoa-lu.jpg", alt: "Cố đô Hoa Lư", altEn: "Hoa Lu ancient capital" },
        { type: "image", src: "img/destinations/ninh-binh/tam-coc-boat.jpg", alt: "Thuyền Tam Cốc", altEn: "Tam Coc boat" },
        { type: "image", src: "img/destinations/ninh-binh/mua-cave-steps.jpg", alt: "Hang Múa", altEn: "Mua Cave" },
        { type: "image", src: "img/venues/heritage-garden.jpg", alt: "Heritage Garden", altEn: "Heritage Garden" },
        { type: "image", src: "img/experiences/mua-climbing.jpg", alt: "Trekking rừng nguyên sinh", altEn: "Primary forest trekking" },
      ],
      cardLine: "Ngày 1: Hoa Lư – thuyền – Hang Múa, nghỉ Heritage Garden. Ngày 2: Vườn quốc gia Cúc Phương — trung tâm cứu hộ linh trưởng & rùa, cây nghìn năm, hang người tiền sử. Limousine từ $195/khách.",
      cardLineEn: "Day 1: Hoa Lu – boat – Mua Cave, overnight Heritage Garden. Day 2: Cuc Phuong National Park — primate & turtle rescue centers, thousand-year trees, prehistoric cave. Limousine from $195/guest.",
      description: [
        "Ngày 2 trekking nhẹ trong rừng nguyên sinh Cúc Phương.",
        "Nên mang mũ, giày, kem chống nắng và thuốc chống côn trùng.",
        "Phụ thu phòng đơn: 15 USD/phòng."
      ],
      descriptionEn: [
        "Day 2 is a light trek in Cuc Phuong primary forest.",
        "Bring a hat, shoes, sunscreen, and insect spray.",
        "Single supplement: 15 USD/room."
      ],
      itinerary: [
        { time: "Ngày 1", title: "Hoa Lư – thuyền – Hang Múa", text: "Giống lịch cố đô: Hoa Lư, đạp xe, buffet, Tam Cốc/Tràng An, Hang Múa, check-in Heritage Garden." },
        { time: "Ngày 2 · 08:30", title: "Đi Cúc Phương", text: "Minivan vào Vườn quốc gia Cúc Phương." },
        { time: "Ngày 2 · 09:15", title: "Trung tâm cứu hộ", text: "Endangered Primate Rescue Center và Turtle Conservation Center." },
        { time: "Ngày 2 · 11:00", title: "Vào lõi rừng", text: "Khoảng 20 km qua rừng nguyên sinh tới trung tâm vườn." },
        { time: "Ngày 2 · 12:00", title: "Ăn trưa", text: "Bữa trưa đặc sản tại trung tâm vườn." },
        { time: "Ngày 2 · 13:00", title: "Trekking", text: "Cây nghìn năm, cây cổ thụ và Hang Người Tiền Sử." },
        { time: "Ngày 2 · 17:00", title: "Về Hà Nội", text: "Trả khách khoảng 19:30–19:45." }
      ],
      itineraryEn: [
        { time: "Day 1", title: "Hoa Lu – boat – Mua Cave", text: "Ancient-capital day: Hoa Lu, cycling, buffet, Tam Coc/Trang An, Mua Cave, check-in at Heritage Garden." },
        { time: "Day 2 · 08:30", title: "To Cuc Phuong", text: "Minivan to Cuc Phuong National Park." },
        { time: "Day 2 · 09:15", title: "Rescue centers", text: "Endangered Primate Rescue Center and Turtle Conservation Center." },
        { time: "Day 2 · 11:00", title: "Into the forest", text: "About 20 km through primary forest to the park center." },
        { time: "Day 2 · 12:00", title: "Lunch", text: "Local lunch at the park center." },
        { time: "Day 2 · 13:00", title: "Trekking", text: "Thousand-year trees, ancient trees, and the Cave of Prehistoric Man." },
        { time: "Day 2 · 17:00", title: "Return", text: "Drop-off around 19:30–19:45." }
      ],
      servicesIncluded: [
        "1 buffet trưa; 1 set tối + 1 set trưa; 1 bữa sáng",
        "1 đêm Trang An Heritage Garden (2–3 khách/phòng)",
        "Đạp xe (tuỳ chọn)",
        "Vé & thuyền Tam Cốc / Tràng An",
        "Xe limousine / shuttle khứ hồi + minivan Cúc Phương",
        "Hướng dẫn tiếng Anh",
        "Wifi, nước suối, nón lá & áo mưa"
      ],
      servicesIncludedEn: [
        "1 buffet lunch; 1 set dinner + 1 set lunch; 1 breakfast",
        "1 night at Trang An Heritage Garden (2–3/room)",
        "Optional bicycle activity",
        "Entrance & boat Tam Coc / Trang An",
        "Round-trip limousine / shuttle + Cuc Phuong minivan",
        "English-speaking guide",
        "Wi‑Fi, water, conical hat & raincoat"
      ],
      servicesExcluded: ["VAT", "Đồ uống", "Tip", "Chi tiêu cá nhân", "Phụ thu phòng đơn 15 USD", "Phụ thu Tết: 15 USD/khách/đêm"],
      servicesExcludedEn: ["VAT", "Beverages", "Tips", "Personal expenses", "Single supplement 15 USD", "Tet surcharge: 15 USD/guest/night"],
      serviceNote: "Limousine từ 2 khách: $195. Shuttle: $185. 1 khách limousine: $239.",
      serviceNoteEn: "Limousine from 2 guests: $195. Shuttle: $185. Solo limousine: $239.",
      offers: ["Cúc Phương + cố đô", "Nghỉ đêm Heritage Garden"],
      offersEn: ["Cuc Phuong + ancient capital", "Overnight at Heritage Garden"]
    },
    {
      id: "ninh-binh-2d1n-halong",
      destination: "ninh-binh",
      featured: false,
      stars: 5,
      name: "Ninh Bình & Hạ Long Luxury 2N1Đ",
      nameEn: "Ninh Binh & Ha Long Luxury 2D1N",
      durationLabel: "2 ngày 1 đêm",
      durationLabelEn: "2 days 1 night",
      nightsOffset: 1,
      price: 4925000,
      priceNote: "$199 limousine từ 2 khách",
      priceNoteEn: "$199 limousine from 2 guests",
      image: "img/tours/ninh-binh-2d1n-halong.jpg",
      media: [
        { type: "image", src: "img/destinations/ninh-binh/tam-coc-boat.jpg", alt: "Ngày 1 Ninh Bình – thuyền", altEn: "Day 1 Ninh Binh boat" },
        { type: "image", src: "img/venues/heritage-garden.jpg", alt: "Nghỉ Heritage Garden", altEn: "Heritage Garden overnight" },
        { type: "image", src: "img/venues/cruise-exterior.jpg", alt: "Ngày 2 du thuyền Hạ Long", altEn: "Day 2 Ha Long cruise" },
        { type: "image", src: "img/destinations/ha-long/sung-sot-cave.jpg", alt: "Hang Sửng Sốt", altEn: "Surprising Cave" },
        { type: "image", src: "img/experiences/kayak.jpg", alt: "Kayak hang Luồn", altEn: "Kayak at Luon Cave" },
        { type: "image", src: "img/experiences/sunset-party.jpg", alt: "Tiệc hoàng hôn trên vịnh", altEn: "Sunset party on the bay" },
      ],
      cardLine: "Ngày 1 Ninh Bình: Hoa Lư – thuyền – Hang Múa, nghỉ Heritage Garden. Ngày 2 du thuyền Heritage Luxury trên vịnh Hạ Long (buffet, Sửng Sốt, Luồn, Titov, tiệc hoàng hôn), về Hà Nội tối. Từ $199/khách.",
      cardLineEn: "Day 1 Ninh Binh: Hoa Lu – boat – Mua Cave, overnight Heritage Garden. Day 2 Heritage Luxury day cruise on Ha Long Bay (buffet, Surprising Cave, Luon, Titov, sunset party), back to Hanoi at night. From $199/guest.",
      description: [
        "Kết hợp cố đô Ninh Bình và du thuyền Hạ Long một ngày.",
        "Ngày 2 khởi hành sớm từ Heritage Garden sang Tuần Châu (~3,5–4 giờ).",
        "Phụ thu phòng đơn: 15 USD/phòng."
      ],
      descriptionEn: [
        "Combines Ninh Binh’s ancient capital with a Ha Long day cruise.",
        "Day 2 early transfer from Heritage Garden to Tuan Chau (~3.5–4 hours).",
        "Single supplement: 15 USD/room."
      ],
      itinerary: [
        { time: "Ngày 1", title: "Ninh Bình Heritage", text: "Hoa Lư, đạp xe, buffet, Tam Cốc/Tràng An, Hang Múa, check-in và ăn tối tại Heritage Garden." },
        { time: "Ngày 2 · 06:15", title: "Check-out", text: "Ăn sáng nhẹ, lên xe đi Hạ Long." },
        { time: "Ngày 2 · 11:15", title: "Lên tàu Luxury", text: "Cảng Tuần Châu, welcome drink." },
        { time: "Ngày 2 · 12:00", title: "Buffet & vịnh", text: "Buffet trên tàu, hang Sửng Sốt, kayak hang Luồn, đảo Titov, tiệc hoàng hôn." },
        { time: "Ngày 2 · 17:45", title: "Về Hà Nội", text: "Limousine từ Tuần Châu; trả khách khoảng 20:30–20:45." }
      ],
      itineraryEn: [
        { time: "Day 1", title: "Ninh Binh Heritage", text: "Hoa Lu, cycling, buffet, Tam Coc/Trang An, Mua Cave, check-in and dinner at Heritage Garden." },
        { time: "Day 2 · 06:15", title: "Check-out", text: "Light breakfast, transfer to Ha Long." },
        { time: "Day 2 · 11:15", title: "Board Luxury cruise", text: "Tuan Chau Port and welcome drink." },
        { time: "Day 2 · 12:00", title: "Buffet & bay", text: "Buffet, Surprising Cave, Luon kayak, Titov, sunset party." },
        { time: "Day 2 · 17:45", title: "Back to Hanoi", text: "Limousine from Tuan Chau; drop-off around 20:30–20:45." }
      ],
      servicesIncluded: [
        "Ngày 1: buffet trưa, set tối, bữa sáng; 1 đêm Heritage Garden",
        "Đạp xe, vé & thuyền Tam Cốc / Tràng An",
        "Limousine Hà Nội – Ninh Bình",
        "Ngày 2: du thuyền Luxury 6 giờ, buffet trên tàu, welcome drink",
        "Hang Sửng Sốt, kayak/thuyền tre hang Luồn, Titov, jacuzzi, tiệc hoàng hôn",
        "Vé thắng cảnh Hạ Long",
        "Hướng dẫn tiếng Anh",
        "Limousine Tuần Châu – Hà Nội"
      ],
      servicesIncludedEn: [
        "Day 1: buffet lunch, set dinner, breakfast; 1 night Heritage Garden",
        "Cycling, entrance & boat Tam Coc / Trang An",
        "Limousine Hanoi – Ninh Binh",
        "Day 2: 6-hour Luxury cruise, buffet on board, welcome drink",
        "Surprising Cave, Luon kayak/bamboo boat, Titov, jacuzzi, sunset party",
        "Ha Long sightseeing fees",
        "English-speaking guide",
        "Limousine Tuan Chau – Hanoi"
      ],
      servicesExcluded: ["VAT", "Đồ uống", "Tip", "Chi tiêu cá nhân", "Phụ thu phòng đơn 15 USD", "Phụ thu Tết: 15 USD/khách/đêm"],
      servicesExcludedEn: ["VAT", "Beverages", "Tips", "Personal expenses", "Single supplement 15 USD", "Tet surcharge: 15 USD/guest/night"],
      serviceNote: "Limousine từ 2 khách: $199. 1 khách: $219.",
      serviceNoteEn: "Limousine from 2 guests: $199. Solo: $219.",
      offers: ["Ninh Bình + Hạ Long một đặt chỗ", "Limousine xuyên suốt"],
      offersEn: ["Ninh Binh + Ha Long in one booking", "Limousine throughout"]
    },
    {
      id: "ninh-binh-thung-nham",
      destination: "ninh-binh",
      featured: false,
      stars: 5,
      name: "Tam Cốc – Bích Động – Thung Nham (Private)",
      nameEn: "Tam Coc – Bich Dong – Thung Nham (Private)",
      durationLabel: "1 ngày · private",
      durationLabelEn: "1 day · private",
      nightsOffset: 0,
      price: 3588000,
      priceNote: "Private từ $145/2 khách",
      priceNoteEn: "Private from $145/2 guests",
      image: "img/tours/ninh-binh-thung-nham.jpg",
      media: [
        { type: "image", src: "img/destinations/ninh-binh/tam-coc-boat.jpg", alt: "Thuyền Tam Cốc buổi sáng", altEn: "Morning Tam Coc boat" },
        { type: "image", src: "img/destinations/ninh-binh/bich-dong.jpg", alt: "Chùa Bích Động", altEn: "Bich Dong Pagoda" },
        { type: "image", src: "img/destinations/ninh-binh/thung-nham.jpg", alt: "Thung Nham – thung chim", altEn: "Thung Nham bird valley" },
        { type: "image", src: "img/experiences/sampan-rowing.jpg", alt: "Thuyền nan khám phá hang", altEn: "Sampan exploring caves" },
        { type: "image", src: "img/venues/heritage-garden-restaurant.jpg", alt: "Set lunch Heritage Garden", altEn: "Heritage Garden set lunch" },
        { type: "image", src: "img/fleet/dcar-limousine.jpg", alt: "Xe private Dcar", altEn: "Private Dcar transfer" },
      ],
      cardLine: "Tour riêng: thuyền Tam Cốc buổi sáng, đạp xe, set lunch Heritage Garden, chùa Bích Động và thung chim Thung Nham chiều. Giá private từ $145/khách (2 khách).",
      cardLineEn: "Private day: morning Tam Coc boat, cycling, Heritage Garden set lunch, Bich Dong pagoda and Thung Nham bird valley in the afternoon. Private from $145/guest (2 guests).",
      description: [
        "Chỉ mở dạng private — xe và hướng dẫn riêng.",
        "Thung Nham: hang Bụt ~500m và thung chim chiều tối.",
        "Set menu trưa (có lựa chọn chay)."
      ],
      descriptionEn: [
        "Private only — dedicated car and guide.",
        "Thung Nham: Buddhist Cave ~500m and afternoon bird valley.",
        "Set-menu lunch (vegetarian option available)."
      ],
      itinerary: [
        { time: "07:30–07:45", title: "Đón khách", text: "Xe riêng đón phố cổ Hà Nội." },
        { time: "09:00", title: "Nghỉ ngắn", text: "Dừng 15–20 phút." },
        { time: "09:30", title: "Tam Cốc", text: "1,5 giờ thuyền sông Ngô Đồng, hang Cá / hang Hai / hang Ba." },
        { time: "11:00–11:30", title: "Đạp xe / thư giãn", text: "30 phút đạp xe hoặc nghỉ Heritage Garden." },
        { time: "12:00", title: "Ăn trưa", text: "Set menu tại Trang An Heritage Garden." },
        { time: "13:00", title: "Bích Động", text: "Chùa ba tầng dựng theo chữ 三 trên núi." },
        { time: "14:00", title: "Thung Nham", text: "Thuyền hang Bụt và thung chim." },
        { time: "17:00", title: "Về Hà Nội", text: "Trả khách khoảng 19:00–19:30." }
      ],
      itineraryEn: [
        { time: "07:30–07:45", title: "Pickup", text: "Private car from Hanoi Old Quarter." },
        { time: "09:00", title: "Short break", text: "15–20 minutes on the way." },
        { time: "09:30", title: "Tam Coc", text: "1.5 hours on the Ngo Dong River through Hang Ca, Hang Hai, Hang Ba." },
        { time: "11:00–11:30", title: "Cycling / relax", text: "30 minutes cycling or rest at Heritage Garden." },
        { time: "12:00", title: "Lunch", text: "Set menu at Trang An Heritage Garden." },
        { time: "13:00", title: "Bich Dong", text: "Three-level mountain pagoda." },
        { time: "14:00", title: "Thung Nham", text: "Buddhist Cave sampan and bird valley." },
        { time: "17:00", title: "Return", text: "Drop-off around 19:00–19:30." }
      ],
      servicesIncluded: [
        "Set menu trưa đặc sản",
        "Đạp xe (tuỳ chọn)",
        "Vé & thuyền Tam Cốc (2–3 khách/thuyền)",
        "Thuyền chung Thung Nham (10–12 khách/thuyền)",
        "Xe private khứ hồi Hà Nội – Ninh Bình",
        "Hướng dẫn viên tiếng Anh",
        "Wifi, nước suối, nón lá & áo mưa"
      ],
      servicesIncludedEn: [
        "Set-menu lunch with local specialties",
        "Optional bicycle activity",
        "Entrance & Tam Coc boat (2–3/boat)",
        "Sharing boat at Thung Nham (10–12/boat)",
        "Private round-trip Hanoi – Ninh Binh",
        "English-speaking guide",
        "Wi‑Fi, water, conical hat & raincoat"
      ],
      servicesExcluded: ["VAT", "Đồ uống", "Tip", "Chi tiêu cá nhân", "Phụ thu Tết: 15 USD/khách"],
      servicesExcludedEn: ["VAT", "Beverages", "Tips", "Personal expenses", "Tet surcharge: 15 USD/guest"],
      serviceNote: "Private: $145/2 khách · $129/3 · $119/4 · từ $109/5–8 · Dcar cao hơn.",
      serviceNoteEn: "Private: $145/2 guests · $129/3 · $119/4 · from $109/5–8 · Dcar higher.",
      offers: ["Tour riêng tư", "Lịch trình linh hoạt"],
      offersEn: ["Private tour", "Flexible itinerary"]
    },
    {
      id: "ninh-binh-incense",
      destination: "ninh-binh",
      featured: false,
      stars: 5,
      name: "Làng hương & Ninh Bình (Private)",
      nameEn: "Incense village & Ninh Binh (Private)",
      durationLabel: "1 ngày · private",
      durationLabelEn: "1 day · private",
      nightsOffset: 0,
      price: 3687000,
      priceNote: "Private từ $149/2 khách",
      priceNoteEn: "Private from $149/2 guests",
      image: "img/tours/ninh-binh-incense.jpg",
      media: [
        { type: "image", src: "img/destinations/hanoi/incense-village.jpg", alt: "Làng hương Quang Phú Cầu", altEn: "Quang Phu Cau incense village" },
        { type: "image", src: "img/destinations/hanoi/incense-aerial.jpg", alt: "Góc check-in bó hương từ trên cao", altEn: "Aerial incense check-in view" },
        { type: "image", src: "img/destinations/ninh-binh/tam-coc-boat.jpg", alt: "Thuyền Tam Cốc / Tràng An", altEn: "Tam Coc / Trang An boat" },
        { type: "image", src: "img/destinations/ninh-binh/mua-cave-peak.jpg", alt: "Hang Múa chiều", altEn: "Afternoon Mua Cave" },
        { type: "image", src: "img/venues/heritage-garden.jpg", alt: "Ăn trưa Heritage Garden", altEn: "Lunch at Heritage Garden" },
        { type: "image", src: "img/fleet/dcar-limousine.jpg", alt: "Xe private cả ngày", altEn: "Full-day private car" },
      ],
      cardLine: "Sáng làng hương Quang Phú Cầu, trưa Heritage Garden, chiều thuyền Tam Cốc/Tràng An và Hang Múa. Tour private từ $149/khách (2 khách).",
      cardLineEn: "Morning Quang Phu Cau incense village, Heritage Garden lunch, afternoon Tam Coc/Trang An boat and Mua Cave. Private from $149/guest (2 guests).",
      description: [
        "Kết hợp làng nghề hương hơn 100 năm với thắng cảnh Ninh Bình.",
        "Chọn thuyền Tam Cốc hoặc Tràng An theo lịch.",
        "Set menu trưa tại Trang An Heritage Garden."
      ],
      descriptionEn: [
        "Combines a 100-year incense craft village with Ninh Binh highlights.",
        "Tam Coc or Trang An boat depending on the plan.",
        "Set-menu lunch at Trang An Heritage Garden."
      ],
      itinerary: [
        { time: "07:30–07:45", title: "Đón khách", text: "Đón phố cổ Hà Nội." },
        { time: "08:00", title: "Đi Quang Phú Cầu", text: "Làng hương hơn 100 năm." },
        { time: "09:30", title: "Tham quan làng", text: "Xem nhuộm và bó hương thủ công, mua quà lưu niệm." },
        { time: "10:30", title: "Sang Ninh Bình", text: "Xe private tiếp tục hành trình." },
        { time: "12:00", title: "Ăn trưa", text: "Set menu tại Heritage Garden." },
        { time: "13:15–13:30", title: "Thuyền", text: "1,5 giờ Tam Cốc hoặc Tràng An." },
        { time: "15:30", title: "Hang Múa", text: "Leo khoảng 500 bậc." },
        { time: "16:30–17:00", title: "Về Hà Nội", text: "Trả khách khoảng 19:00–19:30." }
      ],
      itineraryEn: [
        { time: "07:30–07:45", title: "Pickup", text: "Pickup in Hanoi Old Quarter." },
        { time: "08:00", title: "To Quang Phu Cau", text: "Incense village with over 100 years of craft." },
        { time: "09:30", title: "Village visit", text: "Watch dyeing and bundling; take souvenirs." },
        { time: "10:30", title: "To Ninh Binh", text: "Continue by private car." },
        { time: "12:00", title: "Lunch", text: "Set menu at Heritage Garden." },
        { time: "13:15–13:30", title: "Boat", text: "1.5 hours at Tam Coc or Trang An." },
        { time: "15:30", title: "Mua Cave", text: "Climb about 500 steps." },
        { time: "16:30–17:00", title: "Return", text: "Drop-off around 19:00–19:30." }
      ],
      servicesIncluded: [
        "Set menu trưa đặc sản",
        "Vé & thuyền Tam Cốc / Tràng An",
        "Xe private khứ hồi",
        "Hướng dẫn viên tiếng Anh",
        "Wifi, nước suối, nón lá & áo mưa"
      ],
      servicesIncludedEn: [
        "Set-menu lunch with local specialties",
        "Entrance & boat Tam Coc / Trang An",
        "Private round-trip transfer",
        "English-speaking guide",
        "Wi‑Fi, water, conical hat & raincoat"
      ],
      servicesExcluded: ["VAT", "Đồ uống", "Tip", "Chi tiêu cá nhân", "Phụ thu Tết: 15 USD/khách"],
      servicesExcludedEn: ["VAT", "Beverages", "Tips", "Personal expenses", "Tet surcharge: 15 USD/guest"],
      serviceNote: "Private: $149/2 khách · $139/3 · $125/4 · từ $119/5–6 · Dcar cao hơn.",
      serviceNoteEn: "Private: $149/2 guests · $139/3 · $125/4 · from $119/5–6 · Dcar higher.",
      offers: ["Làng hương + Ninh Bình", "Tour private"],
      offersEn: ["Incense village + Ninh Binh", "Private tour"]
    },

    /* —— Hà Nội —— */
    {
      id: "ha-noi",
      destination: "ha-noi",
      featured: false,
      stars: 5,
      name: "Hà Nội City Tour cả ngày",
      nameEn: "Hanoi City Tour full day",
      durationLabel: "1 ngày",
      durationLabelEn: "1 day",
      nightsOffset: 0,
      price: 1881000,
      priceNote: "$76 limousine · $86 Dcar",
      priceNoteEn: "$76 limousine · $86 Dcar",
      image: "img/tours/ha-noi.jpg",
      media: [
        { type: "image", src: "img/destinations/hanoi/tran-quoc-pagoda.jpg", alt: "Chùa Trấn Quốc", altEn: "Tran Quoc Pagoda" },
        { type: "image", src: "img/destinations/hanoi/ho-chi-minh-mausoleum.jpg", alt: "Khu di tích Chủ tịch Hồ Chí Minh", altEn: "Ho Chi Minh complex" },
        { type: "image", src: "img/destinations/hanoi/one-pillar-pagoda.jpg", alt: "Chùa Một Cột", altEn: "One Pillar Pagoda" },
        { type: "image", src: "img/destinations/hanoi/temple-of-literature.jpg", alt: "Văn Miếu – Quốc Tử Giám", altEn: "Temple of Literature" },
        { type: "image", src: "img/destinations/hanoi/hoa-lo-prison.jpg", alt: "Nhà tù Hỏa Lò", altEn: "Hoa Lo Prison" },
        { type: "image", src: "img/venues/mesdames-linh.jpg", alt: "Mesdames Linh Cuisine", altEn: "Mesdames Linh Cuisine" },
        { type: "image", src: "img/food/hanoi-bun-cha.jpg", alt: "Set menu Hà Nội", altEn: "Hanoi set menu" },
        { type: "image", src: "img/fleet/limousine-mid.jpg", alt: "Limousine nội thành", altEn: "Inner-city limousine" }
      ],
      cardLine: "Tour 1 Hanoi Heritage Premium: Trấn Quốc, Lăng Bác & nhà sàn, Một Cột, Bảo tàng Dân tộc học, set lunch Mesdames Linh, Văn Miếu và Hỏa Lò. Limousine nhóm $76 · Dcar $86. Private từ $119/2 khách.",
      cardLineEn: "Tour 1 Hanoi Heritage Premium: Tran Quoc, Ho Chi Minh complex & stilt house, One Pillar, Ethnology Museum, Mesdames Linh set lunch, Temple of Literature and Hoa Lo. Group limousine $76 · Dcar $86. Private from $119/2 guests.",
      description: [
        "Mesdames Linh Cuisine — fusion cổ điển & hiện đại; set Việt truyền thống là món nên thử.",
        "Thứ Hai Bảo tàng Dân tộc học đóng cửa — thay bằng Bảo tàng Phụ nữ.",
        "Lăng Bác đóng thứ Hai, thứ Sáu và khoảng 15/6–15/8 (bảo trì); vẫn chụp ảnh và tham quan quanh khu vực.",
        "Mặc kín từ vai đến gối khi vào lăng, chùa, đền. Cuối tuần xe trả gần phố đi bộ.",
        "Không gồm lunch: trừ 10 USD/khách."
      ],
      descriptionEn: [
        "Mesdames Linh Cuisine — classic–modern fusion; traditional Hanoi dishes are the must-try.",
        "On Mondays the Ethnology Museum is closed — Women’s Museum instead.",
        "Ho Chi Minh Mausoleum closed Mondays, Fridays, and ~15 Jun–15 Aug for maintenance; photos and grounds still possible.",
        "Dress modestly (shoulders to knees) at the mausoleum, temples, and pagodas. On weekends drop-off is near the walking street.",
        "Without lunch: minus 10 USD/guest."
      ],
      itinerary: [
        { time: "07:45–08:15", title: "Đón khách", text: "Hướng dẫn và tài xế đón tại khách sạn khu phố cổ Hà Nội." },
        { time: "08:30", title: "Chùa Trấn Quốc", text: "Ngôi chùa cổ nhất Hà Nội, khởi dựng thế kỷ 6 dưới thời Lý Nam Đế." },
        { time: "09:15", title: "Khu di tích Chủ tịch Hồ Chí Minh", text: "Lăng Bác (khi mở cửa), nhà sàn nơi Bác sống và làm việc 1954–1969, chùa Một Cột thờ Quan Âm." },
        { time: "11:00", title: "Bảo tàng Dân tộc học", text: "54 dân tộc Việt Nam. Thứ Hai: Bảo tàng Phụ nữ thay thế." },
        { time: "12:30–12:45", title: "Ăn trưa Mesdames Linh", text: "Set menu Việt tại nhà hàng sang trọng Mesdames Linh Cuisine." },
        { time: "13:45–14:00", title: "Văn Miếu – Quốc Tử Giám", text: "Trường đại học quốc gia đầu tiên của Việt Nam, dựng năm 1070 dưới Lý Thánh Tông." },
        { time: "15:00", title: "Nhà tù Hỏa Lò", text: "“Maison Centrale” thời Pháp (1886–1901); sau dùng cho tù binh Mỹ thời chiến tranh Việt Nam." },
        { time: "16:00–16:30", title: "Kết thúc", text: "Đưa về khách sạn phố cổ Hà Nội." }
      ],
      itineraryEn: [
        { time: "07:45–08:15", title: "Pickup", text: "Guide and driver pick you up at your Old Quarter hotel." },
        { time: "08:30", title: "Tran Quoc Pagoda", text: "Hanoi’s oldest pagoda, originally 6th century under Emperor Ly Nam De." },
        { time: "09:15", title: "Ho Chi Minh Complex", text: "Mausoleum (when open), the stilt house (1954–1969), and One Pillar Pagoda dedicated to the Goddess of Mercy." },
        { time: "11:00", title: "Ethnology Museum", text: "Vietnam’s 54 ethnic groups. Mondays: Women’s Museum instead." },
        { time: "12:30–12:45", title: "Lunch at Mesdames Linh", text: "Vietnamese set menu at the luxury restaurant Mesdames Linh Cuisine." },
        { time: "13:45–14:00", title: "Temple of Literature", text: "Vietnam’s first national university, founded in 1070 under Emperor Ly Thanh Tong." },
        { time: "15:00", title: "Hoa Lo Prison", text: "French “Maison Centrale” (1886–1901); later held U.S. POWs during the Vietnam War." },
        { time: "16:00–16:30", title: "End", text: "Drop-off at your Old Quarter hotel." }
      ],
      servicesIncluded: [
        "Set menu trưa Việt tại Mesdames Linh Cuisine",
        "Vé vào cửa & thắng cảnh",
        "Xe limousine (19–20 chỗ) hoặc Dcar (9 chỗ)",
        "Hướng dẫn viên tiếng Anh",
        "Wifi miễn phí, 01 chai nước khoáng/chiều trên limousine"
      ],
      servicesIncludedEn: [
        "Vietnamese set-menu lunch at Mesdames Linh Cuisine",
        "Entrance & sightseeing fees",
        "Limousine (19–20 seats) or Dcar (9 seats)",
        "English-speaking guide",
        "Free Wi‑Fi, 1 mineral water each way on the limousine"
      ],
      servicesExcluded: [
        "VAT",
        "Đồ uống trong bữa trưa",
        "Tip hướng dẫn & tài xế",
        "Chi tiêu cá nhân",
        "Dịch vụ không ghi trong mục bao gồm",
        "Phụ thu Tết: 15 USD/khách (30, mùng 1–3)"
      ],
      servicesExcludedEn: [
        "VAT",
        "Beverages at lunch",
        "Tips for guide & driver",
        "Personal expenses",
        "Anything not listed as included",
        "Tet surcharge: 15 USD/guest (30th, 1st–3rd)"
      ],
      serviceNote: "Nhóm: limousine $76 · Dcar $86. Private sedan/CUV/van từ $119/2 khách · Dcar private từ $135/2 khách. Không lunch: −$10. Trẻ 1–4 tuổi: miễn phí 1 em đi cùng 2 người lớn (chung ghế); em thứ 2 và trẻ 5–8 tuổi: 75%; từ 9 tuổi: 100%.",
      serviceNoteEn: "Group: limousine $76 · Dcar $86. Private sedan/CUV/van from $119/2 guests · private Dcar from $135/2 guests. No lunch: −$10. Child 1–4: 1st free with 2 adults (shared seat); 2nd child and ages 5–8: 75%; 9+: 100%.",
      offers: ["Set lunch Mesdames Linh đã gồm", "Private & group", "Limousine hoặc Dcar"],
      offersEn: ["Mesdames Linh set lunch included", "Private & group", "Limousine or Dcar"],
      buffetMenu: {
        title: "Set menu trưa Mesdames Linh",
        titleEn: "Mesdames Linh set-menu lunch",
        columns: [
          [
            {
              name: "Set mặn (Lunch)",
              items: [
                { vi: "Mesdames Linh Cuisine Welcome", en: "Mesdames Linh Cuisine Welcome" },
                { vi: "Xúp nấm rừng Sapa", en: "Sapa wild mushroom soup" },
                { vi: "Xa lát đu đủ xanh song vị", en: "Green papaya salad with dual flavors" },
                { vi: "Nem rán Hà Nội", en: "Hanoi fried spring rolls" },
                { vi: "Cải chíp om nấm đông cô", en: "Braised bok choy with shiitake" },
                { vi: "Tôm chiên hoàng bào", en: "Deep-fried sea tiger prawns with taro" },
                { vi: "Gà nướng hạt mắc khén Tây Bắc", en: "Northwest grilled chicken with mac khen" },
                { vi: "Bò xào ngũ sắc", en: "Stir-fried five-color beef" },
                { vi: "Cơm tám hấp lá thơm", en: "Fragrant steamed rice with aromatic leaves" },
                { vi: "Trái cây theo mùa", en: "Fresh seasonal fruit" }
              ]
            }
          ],
          [
            {
              name: "Set chay (Lunch)",
              items: [
                { vi: "Mesdames Linh Cuisine Welcome", en: "Mesdames Linh Cuisine Welcome", veg: "Chay", vegEn: "Veg" },
                { vi: "Xúp nấm rừng Sapa", en: "Sapa wild mushroom soup", veg: "Chay", vegEn: "Veg" },
                { vi: "Xa lát đu đủ xanh song vị", en: "Green papaya salad with dual flavors", veg: "Chay", vegEn: "Veg" },
                { vi: "Nem chay", en: "Vegetarian spring rolls", veg: "Chay", vegEn: "Veg" },
                { vi: "Cải chíp om nấm đông cô", en: "Braised bok choy with shiitake", veg: "Chay", vegEn: "Veg" },
                { vi: "Nấm chiên tempura", en: "Tempura mushrooms", veg: "Chay", vegEn: "Veg" },
                { vi: "Cà tím om + rau thơm", en: "Braised eggplant with fresh herbs", veg: "Chay", vegEn: "Veg" },
                { vi: "Đậu phụ hầm rau củ", en: "Vietnamese tofu in tomato sauce", veg: "Chay", vegEn: "Veg" },
                { vi: "Cơm tám hấp lá thơm", en: "Fragrant steamed rice with aromatic leaves", veg: "Chay", vegEn: "Veg" },
                { vi: "Trái cây theo mùa", en: "Fresh seasonal fruit", veg: "Chay", vegEn: "Veg" }
              ]
            }
          ],
          [
            {
              name: "Set tối (đặt thêm)",
              items: [
                { vi: "Set 1: Bún chả Hà Nội…", en: "Set 1: Hanoi bun cha…" },
                { vi: "Set 2: Sườn BBQ & cơm rang cá hồi", en: "Set 2: BBQ ribs & salmon fried rice" },
                { vi: "Set 3: Bò lá lốt & phở gà", en: "Set 3: Lolot beef & chicken pho" },
                { vi: "Set 4: Chả cá Hà Nội & bò lúc lắc", en: "Set 4: Hanoi grilled fish & shaken beef" },
                { vi: "Set 5 chay: Nem chay & phở xốt me", en: "Set 5 veg: Spring rolls & tamarind pho", veg: "Chay", vegEn: "Veg" },
                { vi: "420.000đ/khách · chưa VAT 10%", en: "420,000 VND/pax · excl. 10% VAT" }
              ]
            }
          ]
        ],
        note: "Set lunch tour đã gồm trong giá. Set Lunch & Dinner đặt thêm tại tour desk: 420.000đ/khách, chưa gồm 10% VAT. Thực đơn có thể đổi theo mùa.",
        noteEn: "Tour set lunch is included. Extra Lunch & Dinner sets via tour desk: 420,000 VND/pax, excl. 10% VAT. Menu may change by season.",
        vegNote: "(*) Có set chay · Vegetarian set available",
        vegNoteEn: "(*) Vegetarian set available"
      }
    },
    {
      id: "ha-noi-half",
      destination: "ha-noi",
      featured: false,
      stars: 5,
      name: "Hà Nội City Tour nửa ngày",
      nameEn: "Hanoi City Tour half day",
      durationLabel: "Nửa ngày",
      durationLabelEn: "Half day",
      nightsOffset: 0,
      price: 1460000,
      priceNote: "$59 limousine · $69 Dcar",
      priceNoteEn: "$59 limousine · $69 Dcar",
      image: "img/tours/ha-noi-half.jpg",
      media: [
        { type: "image", src: "img/destinations/hanoi/old-quarter.jpg", alt: "Phố cổ Hà Nội", altEn: "Hanoi Old Quarter" },
        { type: "image", src: "img/destinations/hanoi/temple-of-literature.jpg", alt: "Văn Miếu", altEn: "Temple of Literature" },
        { type: "image", src: "img/destinations/hanoi/tran-quoc-pagoda.jpg", alt: "Chùa Trấn Quốc / hồ", altEn: "Tran Quoc / lake" },
        { type: "image", src: "img/destinations/hanoi/hoa-lo-prison.jpg", alt: "Hỏa Lò", altEn: "Hoa Lo" },
        { type: "image", src: "img/fleet/dcar-limousine.jpg", alt: "Dcar nhóm nhỏ", altEn: "Small-group Dcar" }
      ],
      cardLine: "Tour 1 nửa ngày — chọn buổi sáng hoặc chiều. Limousine $59 · Dcar $69. Có thể thêm set Mesdames Linh (+/- theo lịch). Không lunch mặc định trừ 10$ so với full day có lunch.",
      cardLineEn: "Tour 1 half day — morning or afternoon. Limousine $59 · Dcar $69. Mesdames Linh set can be added. Default without lunch (full day without lunch is −$10).",
      description: [
        "Khách chọn buổi sáng hoặc buổi chiều.",
        "Điểm chính theo khung giờ mở cửa: Trấn Quốc / Lăng Bác / Văn Miếu / Hỏa Lò…",
        "Mặc kín khi vào lăng và chùa. Lăng Bác đóng T2, T6 và 15/6–15/8."
      ],
      descriptionEn: [
        "Guests choose morning or afternoon.",
        "Key stops follow opening hours: Tran Quoc / Mausoleum / Temple of Literature / Hoa Lo…",
        "Dress modestly at the mausoleum and pagodas. Mausoleum closed Mon, Fri, and 15 Jun–15 Aug."
      ],
      itinerary: [
        { time: "Theo lịch", title: "Đón khách", text: "Đón tại khách sạn phố cổ — khung sáng hoặc chiều." },
        { time: "Theo lịch", title: "Điểm tham quan", text: "Các điểm City Tour rút gọn theo giờ mở cửa (Trấn Quốc, khu di tích Bác, Văn Miếu, Hỏa Lò…)." },
        { time: "Tuỳ chọn", title: "Ăn Mesdames Linh", text: "Có thể đặt set lunch/dinner 420.000đ/khách tại tour desk (chưa VAT 10%)." },
        { time: "Kết thúc", title: "Trả khách", text: "Đưa về khách sạn phố cổ." }
      ],
      itineraryEn: [
        { time: "Per schedule", title: "Pickup", text: "Pickup at your Old Quarter hotel — morning or afternoon slot." },
        { time: "Per schedule", title: "Highlights", text: "Shortened City Tour stops by opening hours (Tran Quoc, Ho Chi Minh complex, Temple of Literature, Hoa Lo…)." },
        { time: "Optional", title: "Mesdames Linh meal", text: "Set lunch/dinner 420,000 VND/pax via tour desk (excl. 10% VAT)." },
        { time: "End", title: "Drop-off", text: "Back to your Old Quarter hotel." }
      ],
      servicesIncluded: [
        "Vé thắng cảnh trong chương trình",
        "Xe limousine hoặc Dcar",
        "Hướng dẫn viên tiếng Anh",
        "Wifi & 01 chai nước/chiều trên xe"
      ],
      servicesIncludedEn: [
        "Program entrance fees",
        "Limousine or Dcar transfer",
        "English-speaking guide",
        "Wi‑Fi & 1 mineral water each way on the coach"
      ],
      servicesExcluded: ["VAT", "Bữa trưa (trừ khi đặt thêm)", "Tip", "Chi tiêu cá nhân", "Phụ thu Tết: 15 USD/khách"],
      servicesExcludedEn: ["VAT", "Lunch (unless added)", "Tips", "Personal expenses", "Tet surcharge: 15 USD/guest"],
      serviceNote: "Group half day: limousine $59 · Dcar $69. Trẻ em: 1–4 tuổi miễn phí 1 em/2 người lớn; 5–8 tuổi 75%; từ 9 tuổi 100%.",
      serviceNoteEn: "Group half day: limousine $59 · Dcar $69. Children: ages 1–4 first child free with 2 adults; 5–8: 75%; 9+: 100%.",
      offers: ["Sáng hoặc chiều", "Limousine hoặc Dcar"],
      offersEn: ["Morning or afternoon", "Limousine or Dcar"]
    },
    {
      id: "ha-noi-incense",
      destination: "ha-noi",
      featured: false,
      stars: 5,
      name: "Làng hương Quang Phú Cầu & Hà Nội",
      nameEn: "Incense craft village & Hanoi City",
      durationLabel: "1 ngày",
      durationLabelEn: "1 day",
      nightsOffset: 0,
      price: 2128000,
      priceNote: "$86 Dcar · Private từ $125/2",
      priceNoteEn: "$86 Dcar · Private from $125/2",
      image: "img/tours/ha-noi-incense.jpg",
      media: [
        { type: "image", src: "img/destinations/hanoi/incense-village.jpg", alt: "Làng hương – nón lá & chân hương đỏ", altEn: "Incense village – hats and red sticks" },
        { type: "image", src: "img/destinations/hanoi/incense-aerial.jpg", alt: "Góc chụp từ trên cao", altEn: "High-angle check-in shot" },
        { type: "image", src: "img/venues/mesdames-linh-cozy.jpg", alt: "Mesdames Linh ấm cúng", altEn: "Cozy Mesdames Linh dining" },
        { type: "image", src: "img/destinations/hanoi/temple-of-literature.jpg", alt: "Văn Miếu chiều", altEn: "Temple of Literature afternoon" },
        { type: "image", src: "img/destinations/hanoi/hoa-lo-prison.jpg", alt: "Nhà tù Hỏa Lò", altEn: "Hoa Lo Prison" },
        { type: "image", src: "img/food/hanoi-spring-rolls.jpg", alt: "Nem rán / món Hà Nội", altEn: "Hanoi spring rolls" }
      ],
      cardLine: "Tour 2: sáng làng hương Quang Phú Cầu (hơn 100 năm), trưa Mesdames Linh, chiều Văn Miếu và Hỏa Lò. Chỉ Dcar nhóm nhỏ $86 — không limousine 19–20 chỗ. Private từ $125/2 khách.",
      cardLineEn: "Tour 2: morning Quang Phu Cau incense village (100+ years), Mesdames Linh lunch, afternoon Temple of Literature and Hoa Lo. Small-group Dcar only $86 — no 19–20 limousine. Private from $125/2 guests.",
      description: [
        "Làng hương thủ công: nhuộm que, bó hương nhiều màu, gặp gia đình thợ, mua quà tại chỗ.",
        "Group chỉ mở Dcar 7–9 chỗ ($86). Limousine 19–20 chỗ: N/A.",
        "Private: sedan/CUV/van từ $125/2 khách · Dcar private từ $139/2 khách.",
        "Set lunch Mesdames Linh đã gồm. Mặc kín khi vào đền chùa."
      ],
      descriptionEn: [
        "Artisan incense village: dyeing sticks, colorful bundles, meet a craft family, buy souvenirs on site.",
        "Group runs on Dcar 7–9 seats only ($86). Limousine 19–20 seats: N/A.",
        "Private: sedan/CUV/van from $125/2 guests · private Dcar from $139/2 guests.",
        "Mesdames Linh set lunch included. Dress modestly at temples."
      ],
      itinerary: [
        { time: "07:45–08:15", title: "Đón khách", text: "Đón tại khách sạn phố cổ Hà Nội." },
        { time: "08:30", title: "Đi Quang Phú Cầu", text: "Làng hương sản xuất hơn 100 năm." },
        { time: "10:00", title: "Tham quan làng", text: "Đi bộ xem làm hương thủ công, gia đình nhuộm que, bó hương màu; mua quà lưu niệm." },
        { time: "11:00", title: "Về nội thành", text: "Lên Dcar về Hà Nội." },
        { time: "12:30", title: "Ăn trưa Mesdames Linh", text: "Set menu Việt tại Mesdames Linh Cuisine." },
        { time: "13:45–14:00", title: "Văn Miếu – Quốc Tử Giám", text: "Đại học quốc gia đầu tiên (1070)." },
        { time: "15:00", title: "Nhà tù Hỏa Lò", text: "“Maison Centrale” — lịch sử tù chính trị và tù binh." },
        { time: "16:00–16:30", title: "Kết thúc", text: "Trả khách phố cổ Hà Nội." }
      ],
      itineraryEn: [
        { time: "07:45–08:15", title: "Pickup", text: "Pickup at your Old Quarter hotel." },
        { time: "08:30", title: "To Quang Phu Cau", text: "Incense village producing for over 100 years." },
        { time: "10:00", title: "Village visit", text: "Walk the artisan process, meet a dyeing family, colorful bundles, souvenirs." },
        { time: "11:00", title: "Back to the city", text: "Dcar return to Hanoi." },
        { time: "12:30", title: "Lunch at Mesdames Linh", text: "Vietnamese set menu at Mesdames Linh Cuisine." },
        { time: "13:45–14:00", title: "Temple of Literature", text: "Vietnam’s first national university (1070)." },
        { time: "15:00", title: "Hoa Lo Prison", text: "“Maison Centrale” — political prisoners and later POW history." },
        { time: "16:00–16:30", title: "End", text: "Old Quarter hotel drop-off." }
      ],
      servicesIncluded: [
        "Set menu trưa tại Mesdames Linh Cuisine",
        "Vé vào cửa & thắng cảnh",
        "Xe Dcar limousine nhóm nhỏ (7–9 chỗ)",
        "Hướng dẫn viên tiếng Anh",
        "Wifi miễn phí, 01 chai nước/chiều trên xe"
      ],
      servicesIncludedEn: [
        "Set-menu lunch at Mesdames Linh Cuisine",
        "Entrance & sightseeing fees",
        "Small-group Dcar limousine (7–9 seats)",
        "English-speaking guide",
        "Free Wi‑Fi, 1 mineral water each way on the coach"
      ],
      servicesExcluded: [
        "VAT",
        "Đồ uống trong bữa trưa",
        "Tip hướng dẫn & tài xế",
        "Chi tiêu cá nhân",
        "Dịch vụ không ghi trong mục bao gồm",
        "Phụ thu Tết: 15 USD/khách (30, mùng 1–3)"
      ],
      servicesExcludedEn: [
        "VAT",
        "Beverages at lunch",
        "Tips for guide & driver",
        "Personal expenses",
        "Anything not listed as included",
        "Tet surcharge: 15 USD/guest (30th, 1st–3rd)"
      ],
      serviceNote: "Group Dcar $86. Private: $125/2 · $109/3 · $105/4 · $99/5–6 · $95/7–8 · $80/9–10 · $75/11–12. Dcar private: $139/2 · $119/3 · $109/4 · $105/5–6 · $99/7–8 · $86/9. Trẻ em theo chính sách brochure.",
      serviceNoteEn: "Group Dcar $86. Private: $125/2 · $109/3 · $105/4 · $99/5–6 · $95/7–8 · $80/9–10 · $75/11–12. Private Dcar: $139/2 · $119/3 · $109/4 · $105/5–6 · $99/7–8 · $86/9. Children per brochure policy.",
      offers: ["Làng hương + city tour", "Lunch Mesdames Linh", "Dcar nhóm nhỏ"],
      offersEn: ["Incense village + city tour", "Mesdames Linh lunch", "Small-group Dcar"],
      buffetMenu: {
        title: "Set menu trưa Mesdames Linh",
        titleEn: "Mesdames Linh set-menu lunch",
        columns: [
          [
            {
              name: "Set mặn",
              items: [
                { vi: "Welcome Mesdames Linh", en: "Mesdames Linh Welcome" },
                { vi: "Xúp nấm rừng Sapa", en: "Sapa wild mushroom soup" },
                { vi: "Xa lát đu đủ xanh song vị", en: "Green papaya dual-flavor salad" },
                { vi: "Nem rán Hà Nội", en: "Hanoi fried spring rolls" },
                { vi: "Tôm chiên hoàng bào", en: "Tiger prawns with taro" },
                { vi: "Gà nướng mắc khén", en: "Mac-khen grilled chicken" },
                { vi: "Bò xào ngũ sắc", en: "Five-color stir-fried beef" },
                { vi: "Cơm tám hấp lá thơm", en: "Fragrant steamed rice" },
                { vi: "Trái cây theo mùa", en: "Seasonal fruit" }
              ]
            }
          ],
          [
            {
              name: "Set chay",
              items: [
                { vi: "Nem chay", en: "Vegetarian spring rolls", veg: "Chay", vegEn: "Veg" },
                { vi: "Nấm chiên tempura", en: "Tempura mushrooms", veg: "Chay", vegEn: "Veg" },
                { vi: "Cà tím om rau thơm", en: "Braised eggplant with herbs", veg: "Chay", vegEn: "Veg" },
                { vi: "Đậu phụ hầm rau củ", en: "Tofu with vegetables", veg: "Chay", vegEn: "Veg" },
                { vi: "Cơm tám hấp lá thơm", en: "Fragrant steamed rice", veg: "Chay", vegEn: "Veg" }
              ]
            }
          ]
        ],
        note: "Set lunch đã gồm trong giá tour. Đặt set tối thêm: 420.000đ/khách (chưa VAT 10%) tại tour desk.",
        noteEn: "Set lunch included in the tour price. Extra dinner sets: 420,000 VND/pax (excl. 10% VAT) at the tour desk.",
        vegNote: "(*) Set chay có sẵn · Vegetarian set available",
        vegNoteEn: "(*) Vegetarian set available"
      }
    }
  ]
};

/* Tương thích util.js / trang mẫu cũ — Voyage chỉ dùng TOUR_DATA ở trên */
window.DAHLIA = window.DAHLIA || {
  hotel: {
    name: "The Dahlia Hanoi",
    email: window.TOUR_DATA.email,
    phone: window.TOUR_DATA.phone,
    phoneHref: "tel:+842400000000",
    address: "18 Hàng Bông, Hoàn Kiếm, Hà Nội",
    line: "Đến một nơi mới. Sống một trải nghiệm khác."
  },
  rooms: [],
  tours: []
};
