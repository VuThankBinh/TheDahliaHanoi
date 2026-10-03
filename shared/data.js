(function () {
  function photo(id, w) {
    return "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=" + (w || 1600) + "&q=80";
  }

  window.DAHLIA = {
    hotel: {
      name: "The Dahlia Hanoi",
      email: "hello@thedahliahanoi.com",
      phone: "+84 24 0000 0000",
      phoneHref: "tel:+842400000000",
      address: "18 Hàng Bông, Hoàn Kiếm, Hà Nội",
      checkIn: "14:00",
      checkOut: "12:00",
      line: "Nhà hoa giữa phố cổ. Yên, trẻ, và đủ chậm.",
      blurb:
        "The Dahlia Hanoi là một nhà nhỏ giữa Hoàn Kiếm: trẻ, có hoa, và đủ yên để nghe thành phố từ xa. Linen, gỗ ấm, và thược dược tươi trong mỗi phòng.",
      images: {
        editorialHero: photo("photo-1509030450996-dd1a26dda07a", 2200),
        editorialHeroAlt: "Hồ Hoàn Kiếm và tháp Rùa lúc sớm, Hà Nội",
        atelierHero: photo("photo-1618773928121-c32242e63f39", 1800),
        atelierHeroAlt: "Phòng ngủ boutique với ga trắng và ánh sáng ấm",
        noirHero: photo("photo-1555921015-5532091f6026", 2000),
        noirHeroAlt: "Phố cổ Hà Nội, nhà ống và nhịp sống ban ngày",
        voyageHero: photo("photo-1566073771259-6a8506099945", 2200),
        voyageHeroAlt: "Sảnh khách sạn sáng với ánh đèn ấm và nội thất gỗ",
        flower: photo("photo-1596438459194-f275f413d6ff", 1400),
        flowerAlt: "Hoa thược dược cánh lớp, tông kem và nâu",
        breakfast: photo("photo-1496417263034-38ec4f0b665a", 1400),
        street: photo("photo-1555921015-5532091f6026", 1400)
      }
    },
    rooms: [
      {
        id: "suong-mai",
        name: "Phòng Sương Mai",
        size: "28 m²",
        guests: 2,
        price: 1450000,
        desc: "Phòng ngủ ấm nhìn xuống phố nhỏ. Ga linen, một ghế đọc và bình thược dược thay mỗi sáng.",
        image: "../shared/img/1790904199487_2068778228521866811_7299980965333341376_8729a8345828249c829f501576fbd73f.jpg",
        alt: "Phòng ngủ sàn gỗ, giường thấp, tranh hoa đào và rèm xám",
        en: {
          desc: "A warm room over a quiet lane. Linen sheets, a reading chair, and fresh dahlias each morning.",
          alt: "Wood floor, a low bed, peach-blossom art, and grey curtains"
        }
      },
      {
        id: "studio-hoan-kiem",
        name: "Studio Hoàn Kiếm",
        size: "35 m²",
        guests: 2,
        price: 1980000,
        desc: "Studio gọn với bếp nhỏ và bàn gỗ cạnh cửa sổ. Hợp kỳ nghỉ vừa ở vừa làm, vài phút đi bộ ra hồ.",
        image: "../shared/img/1790904199484_2068778228521866811_7299980965333341376_05bb9e143bb044eb959665a6e44ff858.jpg",
        alt: "Góc bàn gỗ, tủ áo và tivi trong phòng sàn gỗ",
        en: {
          desc: "A compact studio with a small kitchen and a wood desk by the window. Easy for a stay that mixes rest and work, a short walk from the lake.",
          alt: "A wood desk, wardrobe, and television in a timber-floored room"
        }
      },
      {
        id: "dahlia-suite",
        name: "Dahlia Suite",
        size: "42 m²",
        guests: 2,
        price: 2850000,
        desc: "Suite yên nhất trong nhà: bồn tắm đá, rèm voan và một góc ngồi chiều. Ánh sáng được giữ mềm.",
        image: "../shared/img/1790904199490_2068778228521866811_7299980965333341376_779d11915ee9741d11bf85c7ddaecb78.jpg",
        alt: "Phòng giấy dán hoa mộc lan, giường gỗ đen, gối xanh và ghế chạm",
        en: {
          desc: "The quietest suite in the house: a stone bath, sheer curtains, and a seat for late afternoon. The light stays soft.",
          alt: "Magnolia wallpaper, a black wood bed, green pillows, and a carved chair"
        }
      },
      {
        id: "hoa-dat",
        name: "Căn hộ Hoa Đất",
        size: "58 m²",
        guests: 4,
        price: 3200000,
        desc: "Một phòng ngủ tách biệt, sofa giường và bếp đủ dùng. Dành cho gia đình nhỏ hoặc những tuần ở chậm.",
        image: "../shared/img/1790904199489_2068778228521866811_7299980965333341376_bfe90f8cb0284bfd31acd7d6c1e1c8cc.jpg",
        alt: "Ghế gỗ chạm, đèn bàn và bình hoa hồng trong phòng giấy dán hoa",
        en: {
          desc: "A separate bedroom, a sofa bed, and a kitchen that covers a real stay. For a small family, or a slow week in the city.",
          alt: "A carved wood chair, a table lamp, and a vase of roses against floral wallpaper"
        }
      }
    ],
    tours: [
      {
        id: "binh-minh",
        name: "Bình minh Hồ Hoàn Kiếm",
        day: "nua-ngay",
        session: "sang",
        kind: "di-bo",
        noir: "nua-ngay",
        duration: "2 giờ",
        price: 380000,
        maxPeople: 6,
        summary: "Vòng hồ khi Hà Nội còn mỏng người, rồi một ly cà phê trứng trước khi phố đông.",
        image: photo("photo-1509030450996-dd1a26dda07a", 1400),
        alt: "Mặt hồ Hoàn Kiếm phẳng lặng lúc bình minh",
        includes: "Hướng dẫn viên · Cà phê trứng",
        gallery: [
          { src: photo("photo-1509030450996-dd1a26dda07a", 1400), alt: "Hồ Hoàn Kiếm và kiến trúc ven hồ" },
          { src: photo("photo-1496417263034-38ec4f0b665a", 1400), alt: "Bàn cà phê sáng với ánh nắng ấm" }
        ],
        itinerary: [
          { time: "05:15", title: "Gặp tại sảnh", text: "Đi bộ ra khỏi 18 Hàng Bông, phố còn ít xe." },
          { time: "05:40", title: "Vòng hồ", text: "Một vòng chậm quanh Hồ Hoàn Kiếm, dừng ở những khoảng cây yên." },
          { time: "06:10", title: "Đền Ngọc Sơn", text: "Nhìn cầu Thê Húc từ ngoài, nghe một đoạn kể ngắn." },
          { time: "06:40", title: "Cà phê trứng", text: "Ngồi một quán nhỏ gần hồ, rồi về nhà trước giờ phố mở." }
        ],
        en: {
          name: "Dawn at Hoan Kiem Lake",
          duration: "2 hours",
          summary: "A loop of the lake while Hanoi is still quiet, then egg coffee before the streets fill.",
          includes: "Guide · Egg coffee",
          alt: "Still water on Hoan Kiem Lake at dawn",
          gallery: [
            { alt: "Hoan Kiem Lake and the buildings along the shore" },
            { alt: "A morning coffee table in warm light" }
          ],
          itinerary: [
            { title: "Meet in the lobby", text: "A short walk from 18 Hang Bong, while the street is still empty." },
            { title: "Around the lake", text: "A slow loop of Hoan Kiem, pausing where the trees are quiet." },
            { title: "Ngoc Son Temple", text: "The Huc Bridge from the outside, and a short story." },
            { title: "Egg coffee", text: "A small café by the lake, then home before the quarter opens." }
          ]
        }
      },
      {
        id: "pho-co-dem",
        name: "Đêm phố cổ",
        day: "nua-ngay",
        session: "chieu",
        kind: "di-bo",
        noir: "nua-ngay",
        duration: "2,5 giờ",
        price: 450000,
        maxPeople: 8,
        summary: "Đi bộ ngõ tắt, biển hiệu cũ và một chỗ ngồi uống trà khi đèn phố vừa bật.",
        image: photo("photo-1583417319070-4a69db38a482", 1400),
        alt: "Đèn lồng ấm trên phố về đêm",
        includes: "Hướng dẫn viên · Trà hoặc cà phê",
        gallery: [
          { src: photo("photo-1583417319070-4a69db38a482", 1400), alt: "Phố đèn lồng buổi tối" },
          { src: photo("photo-1555921015-5532091f6026", 1400), alt: "Nhà ống và phố cổ Hà Nội" }
        ],
        itinerary: [
          { time: "18:30", title: "Xuất phát", text: "Gặp tại sảnh The Dahlia, đi bộ ra Hàng Bông." },
          { time: "19:00", title: "Ngõ hàng", text: "Hàng Đào, Hàng Bạc — biển cũ, cửa gỗ, nhịp chiều tắt." },
          { time: "19:40", title: "Một ngôi nhà", text: "Dừng trước một mặt tiền cổ, kể chuyện phố mà không vào ồn ào." },
          { time: "20:15", title: "Trà sen", text: "Ngồi uống ấm, kết thúc trong vòng mười phút đi bộ về nhà." }
        ],
        en: {
          name: "Old Quarter at night",
          duration: "2.5 hours",
          summary: "Side lanes, old shop signs, and a seat for tea as the street lights come on.",
          includes: "Guide · Tea or coffee",
          alt: "Warm lanterns on an evening street",
          gallery: [
            { alt: "A lantern street at night" },
            { alt: "Tube houses in Hanoi’s Old Quarter" }
          ],
          itinerary: [
            { title: "Set off", text: "Meet in The Dahlia lobby and walk out to Hang Bong." },
            { title: "The lanes", text: "Hang Dao, Hang Bac — old signs, wood doors, the day closing down." },
            { title: "One house", text: "A pause at an old facade. A story of the street, without stepping into the noise." },
            { title: "Lotus tea", text: "A warm cup, then a ten-minute walk home." }
          ]
        }
      },
      {
        id: "am-thuc",
        name: "Ẩm thực đường phố",
        day: "nua-ngay",
        session: "chieu",
        kind: "am-thuc",
        noir: "rieng-tu",
        duration: "3 giờ",
        price: 520000,
        maxPeople: 4,
        summary: "Nhóm nhỏ, tối đa bốn khách. Bốn điểm ăn gần nhà — đủ no, không chạy tour.",
        image: photo("photo-1582878826629-29b7ad1cdc43", 1400),
        alt: "Bát phở nóng và rau thơm",
        includes: "Hướng dẫn riêng · Bốn món · Nước",
        gallery: [
          { src: photo("photo-1582878826629-29b7ad1cdc43", 1400), alt: "Phở Hà Nội trong bát sứ" },
          { src: photo("photo-1504674900247-0877df9cc836", 1400), alt: "Món ăn bày trên bàn gỗ" }
        ],
        itinerary: [
          { time: "17:00", title: "Gặp nhóm nhỏ", text: "Chỉ nhận tối đa bốn khách, xuất phát từ sảnh." },
          { time: "17:20", title: "Bún chả", text: "Một quán than hoa trong ngõ, ngồi thấp, ăn chậm." },
          { time: "18:10", title: "Nem và nước mía", text: "Đi bộ sang điểm thứ hai, không vội đổi món." },
          { time: "18:50", title: "Chè hoặc cà phê", text: "Kết bằng vị ngọt nhẹ, về khách sạn trước 20:00." }
        ],
        en: {
          name: "Street food",
          duration: "3 hours",
          summary: "A small group, four guests at most. Four stops near the hotel — enough to eat well, not a rushed tour.",
          includes: "Private guide · Four dishes · Drinks",
          alt: "A hot bowl of pho and fresh herbs",
          gallery: [
            { alt: "Hanoi pho in a porcelain bowl" },
            { alt: "Dishes laid out on a wood table" }
          ],
          itinerary: [
            { title: "A small group", text: "Four guests only, leaving from the lobby." },
            { title: "Bun cha", text: "A charcoal-grill spot in a lane. Low seats, unhurried." },
            { title: "Rolls and sugarcane", text: "A short walk to the second stop. No rush to change plates." },
            { title: "Sweet soup or coffee", text: "A light sweet finish, back at the hotel before 20:00." }
          ]
        }
      },
      {
        id: "ninh-binh",
        name: "Ninh Bình một ngày",
        day: "ca-ngay",
        session: "ca-ngay",
        kind: "ngoai-thanh",
        noir: "ca-ngay",
        duration: "10 giờ",
        price: 1650000,
        maxPeople: 6,
        summary: "Xe riêng ra Tam Cốc, thuyền giữa lúa và núi, cơm trưa, về Hà Nội trước tối.",
        image: photo("photo-1528183429752-a97d0bf99b5a", 1600),
        alt: "Thuyền trên sông Tam Cốc, núi đá Ninh Bình",
        includes: "Xe riêng · Thuyền · Cơm trưa · Nước",
        gallery: [
          { src: photo("photo-1528183429752-a97d0bf99b5a", 1600), alt: "Thuyền và núi đá ở Tam Cốc" },
          { src: photo("photo-1559592413-7cec4d0cae2b", 1600), alt: "Cánh đồng và núi đá Ninh Bình" }
        ],
        itinerary: [
          { time: "07:00", title: "Xe đón", text: "Xe riêng đón tại sảnh. Có nước và một ổ bánh cho đường dài." },
          { time: "09:30", title: "Tam Cốc", text: "Thuyền khoảng một giờ rưỡi giữa lúa, theo mùa." },
          { time: "12:00", title: "Cơm quê", text: "Bữa trưa ở một nhà hàng nhỏ, món địa phương, chỗ ngồi thoáng." },
          { time: "14:00", title: "Hoa Lư", text: "Hoặc một điểm yên hơn nếu ngày đông. Không nhồi thêm điểm chụp." },
          { time: "16:30", title: "Về Hà Nội", text: "Lên xe, về tới The Dahlia khoảng 18:30–19:00." }
        ],
        en: {
          name: "A day in Ninh Binh",
          duration: "10 hours",
          summary: "A private car to Tam Coc, a boat between rice and limestone, lunch, and Hanoi again before evening.",
          includes: "Private car · Boat · Lunch · Water",
          alt: "A boat on the Tam Coc river, with Ninh Binh limestone",
          gallery: [
            { alt: "A boat and limestone cliffs at Tam Coc" },
            { alt: "Rice fields and karst in Ninh Binh" }
          ],
          itinerary: [
            { title: "Pickup", text: "A private car at the lobby, with water and a bun for the road." },
            { title: "Tam Coc", text: "About ninety minutes on the water, through the rice, as the season allows." },
            { title: "Country lunch", text: "A small restaurant, local dishes, an easy table." },
            { title: "Hoa Lu", text: "Or a quieter stop if the day is crowded. No extra photo stops piled on." },
            { title: "Back to Hanoi", text: "On the road, at The Dahlia around 18:30–19:00." }
          ]
        }
      }
    ]
  };
})();
