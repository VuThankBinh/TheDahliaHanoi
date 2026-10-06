from pathlib import Path
import re

p = Path(r"e:\CongViec\Job2\1.TheDahliaHaNoi\shared\data.js")
t = p.read_text(encoding="utf-8")
before = t.count("DAHLIA10")
# Remove promo offer entries (with leading comma preferred)
t = re.sub(r',\s*"Mã DAHLIA10 giảm 10%"', "", t)
t = re.sub(r',\s*"Code DAHLIA10 for 10% off"', "", t)
# If it was the only item (unlikely), also clear solo
t = re.sub(r'"Mã DAHLIA10 giảm 10%"\s*,?\s*', "", t)
t = re.sub(r'"Code DAHLIA10 for 10% off"\s*,?\s*', "", t)
after = t.count("DAHLIA10")
p.write_text(t, encoding="utf-8")
print(f"DAHLIA10 before={before} after={after}")
