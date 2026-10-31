import os

APP_JS_PATH = os.path.join("voyage", "js", "app.js")

with open(APP_JS_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# Normalize newlines
is_crlf = "\r\n" in content
norm_content = content.replace("\r\n", "\n")

target1 = """  function tourCardHtml(tour, href) {
    var note = field(tour, "priceNote")
      ? '<p class="price-note">' + U.escapeHtml(field(tour, "priceNote")) + "</p>"
      : "";
    var line = field(tour, "cardLine");
    var stars = starsHtml(tour);
    var priceBadge = tour.price > 0
      ? '<span class="price-badge">' + U.money(tour.price) + "</span>"
      : '<span class="price-badge">' + U.escapeHtml(field(tour, "priceNote") || t("contact")) + "</span>";
    var priceFoot = tour.price > 0
      ? '<span class="price">' + U.money(tour.price) + " <span>" + U.escapeHtml(t("perGuest")) + "</span></span>"
      : '<span class="price">' + U.escapeHtml(field(tour, "priceNote") || t("contact")) + "</span>";"""

repl1 = """  function tourCardHtml(tour, href) {
    var isContact = !tour.price || tour.price <= 0;
    var noteText = field(tour, "priceNote");
    var note = (!isContact && noteText)
      ? '<p class="price-note">' + U.escapeHtml(noteText) + "</p>"
      : "";
    var line = field(tour, "cardLine");
    var stars = starsHtml(tour);
    var contactLabel = noteText || t("contact");
    var priceBadge = !isContact
      ? '<span class="price-badge">' + U.money(tour.price) + "</span>"
      : '<span class="price-badge">' + U.escapeHtml(contactLabel) + "</span>";
    var priceFoot = !isContact
      ? '<span class="price">' + U.money(tour.price) + " <span>" + U.escapeHtml(t("perGuest")) + "</span></span>"
      : '<span class="price">' + U.escapeHtml(contactLabel) + "</span>";"""

target2 = """        '<p class="price-line"><strong>' + U.money(tour.price) + "</strong> <span>" + U.escapeHtml(t("perGuest")) + "</span></p>" +"""

repl2 = """        '<p class="price-line">' +
        (tour.price > 0
          ? '<strong>' + U.money(tour.price) + "</strong> <span>" + U.escapeHtml(t("perGuest")) + "</span>"
          : '<strong>' + U.escapeHtml(field(tour, "priceNote") || t("contact")) + "</strong>") +
        "</p>" +"""

if target1 in norm_content:
    norm_content = norm_content.replace(target1, repl1, 1)
    print("target1 replaced successfully.")
else:
    print("WARNING: target1 not found.")

if target2 in norm_content:
    norm_content = norm_content.replace(target2, repl2, 1)
    print("target2 replaced successfully.")
else:
    print("WARNING: target2 not found.")

final_content = norm_content.replace("\n", "\r\n") if is_crlf else norm_content
with open(APP_JS_PATH, "w", encoding="utf-8") as f:
    f.write(final_content)

print("Saved updated voyage/js/app.js")

