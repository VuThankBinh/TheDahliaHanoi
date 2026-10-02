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
        alt: "Phòng ngủ sàn gỗ, giường thấp, tranh hoa đào và rèm xám"
      },
      {
        id: "studio-hoan-kiem",
        name: "Studio Hoàn Kiếm",
        size: "35 m²",
        guests: 2,
        price: 1980000,
        desc: "Studio gọn với bếp nhỏ và bàn gỗ cạnh cửa sổ. Hợp kỳ nghỉ vừa ở vừa làm, vài phút đi bộ ra hồ.",
        image: "../shared/img/1790904199484_2068778228521866811_7299980965333341376_05bb9e143bb044eb959665a6e44ff858.jpg",
        alt: "Góc bàn gỗ, tủ áo và tivi trong phòng sàn gỗ"
      },
      {
        id: "dahlia-suite",
        name: "Dahlia Suite",
        size: "42 m²",
        guests: 2,
        price: 2850000,
        desc: "Suite yên nhất trong nhà: bồn tắm đá, rèm voan và một góc ngồi chiều. Ánh sáng được giữ mềm.",
        image: "../shared/img/1790904199490_2068778228521866811_7299980965333341376_779d11915ee9741d11bf85c7ddaecb78.jpg",
        alt: "Phòng giấy dán hoa mộc lan, giường gỗ đen, gối xanh và ghế chạm"
      },
      {
        id: "hoa-dat",
        name: "Căn hộ Hoa Đất",
        size: "58 m²",
        guests: 4,
        price: 3200000,
        desc: "Một phòng ngủ tách biệt, sofa giường và bếp đủ dùng. Dành cho gia đình nhỏ hoặc những tuần ở chậm.",
        image: "../shared/img/1790904199489_2068778228521866811_7299980965333341376_bfe90f8cb0284bfd31acd7d6c1e1c8cc.jpg",
        alt: "Ghế gỗ chạm, đèn bàn và bình hoa hồng trong phòng giấy dán hoa"
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
        ]
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
        ]
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
        ]
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
        ]
      }
    ]
  };
})();
