# Voyage images

Local photo library for The Dahlia Voyage (stock photos for layout; replace with Heritage official assets when available).

## Data source

**Edit content in `shared/data.js` only** (`window.TOUR_DATA`):

| Field | Fills |
|-------|--------|
| `destinations[id]` | Destination pages / filters — use id: `ha-long`, `ninh-binh`, `ha-noi` |
| `tours[].id` | Tour detail URL: `tours.html?id=ha-long` |
| `tours[].destination` | Must match a `destinations` id |
| `hero.slides` | Homepage banner |
| `tours[].media` | Tour detail slideshow |
| `tours[].image` | Tour card cover |

Examples: `tours.html?id=ha-long-signature` · `tours.html?dest=ninh-binh`

## Folders

| Folder | Content |
|--------|---------|
| `tours/` | Cover image per tour card (`{tour-id}.jpg`) |
| `destinations/hanoi/` | Attractions: Trấn Quốc, Văn Miếu, Hỏa Lò, làng hương… |
| `destinations/ninh-binh/` | Hoa Lư, Tam Cốc, Tràng An, Hang Múa, Thung Nham, Cúc Phương… |
| `destinations/ha-long/` | Bay overview, caves, Titov, Tuần Châu port |
| `venues/` | Cruise decks, jacuzzi, Heritage Garden, Mesdames Linh |
| `experiences/` | Sampan, kayak, cycling, climbing, sunset party |
| `fleet/` | Dcar, limousine, shuttle |
| `food/` | Ninh Bình specialties, cruise buffet, Hanoi set menu |

Image paths in `shared/data.js` are relative to `voyage/*.html` (e.g. `img/tours/ha-long.jpg`).
