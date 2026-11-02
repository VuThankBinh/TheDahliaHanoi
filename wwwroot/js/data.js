/**
 * Deprecated shim — dữ liệu nằm ở ../shared/data.js (window.TOUR_DATA).
 * Giữ file để URL cache cũ không 404; không sửa tour/slideshow ở đây.
 */
if (!window.TOUR_DATA) {
  console.warn("[voyage] Load ../shared/data.js before app.js — TOUR_DATA is missing.");
  window.TOUR_DATA = { tours: [], destinations: {}, hero: { slides: [] } };
}
