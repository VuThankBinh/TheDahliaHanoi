# -*- coding: utf-8 -*-
"""Restore nav header in HTML + CSS; keep buffet removed from detail via app.js."""
import re
import subprocess
from pathlib import Path

ROOT = Path(r"e:\CongViec\Job2\1.TheDahliaHaNoi")
VOYAGE = ROOT / "voyage"


def git_show(path: str) -> str:
    return subprocess.check_output(
        ["git", "show", f"HEAD:{path}"],
        cwd=ROOT,
        text=True,
        encoding="utf-8",
        errors="replace",
    )


# --- Restore CSS nav block from HEAD ---
css_path = VOYAGE / "css" / "style.css"
css_now = css_path.read_text(encoding="utf-8")
css_old = git_show("voyage/css/style.css")

def extract_between(text, start, end):
    i = text.find(start)
    j = text.find(end)
    if i < 0 or j < 0 or j <= i:
        raise RuntimeError(f"markers missing: {start!r} .. {end!r}")
    return text[i:j], i, j

old_nav, _, _ = extract_between(css_old, "/* —— Nav —— */", "/* —— Layout —— */")
_, i, j = extract_between(css_now, "/* —— Nav —— */", "/* —— Layout —— */")
css_now = css_now[:i] + old_nav + css_now[j:]

# Restore mobile header overrides that we changed
# Replace our new mobile header block with HEAD's if present
# Safer: pull the @media 720 block header-related lines from HEAD by replacing known current block
new_mobile = """  .site-header {
    padding: 8px 12px;
    gap: 8px;
    grid-template-columns: auto minmax(0, 1fr) auto;
  }
  img.logo { max-height: 44px; }
  img.logo-partner { max-height: 32px; }
  .brand-lockup { gap: 6px; padding: 3px 6px; }
  .brand-lockup .brand-divider { height: 24px; }
  .footer-logo img.logo { max-height: 44px; }
  .footer-logo img.logo-partner { max-height: 32px; }
  .header-banner { height: 40px; border-radius: 10px; }
  .cta-nav { display: none; }
  .header-actions { gap: 6px; }
  .hotline-nav {
    padding: 6px 10px;
    gap: 8px;
  }
  .hotline-label { display: none; }
  .hotline-nav strong { font-size: 12px; }
"""

old_mobile = """  .site-header { padding: 8px 12px; gap: 8px; }
  img.logo { max-height: 44px; }
  img.logo-partner { max-height: 32px; }
  .brand-lockup { gap: 6px; padding: 3px 6px; }
  .brand-lockup .brand-divider { height: 24px; }
  .footer-logo img.logo { max-height: 44px; }
  .footer-logo img.logo-partner { max-height: 32px; }
  .desktop-nav, .cta-nav { display: none; }
  .hotline-nav {
    margin-left: auto;
    padding: 6px 10px;
    gap: 8px;
  }
  .hotline-label { display: none; }
  .hotline-nav strong { font-size: 12px; }
  .nav-toggle { display: inline-flex; margin-left: 8px; }
"""

# Prefer restoring HEAD mobile snippet if our altered one is present
if new_mobile in css_now:
    css_now = css_now.replace(new_mobile, old_mobile)
    if "  .page-home .site-header:not(.is-solid) .desktop-nav { display: none; }\n" not in css_now:
        css_now = css_now.replace(
            "  .contact-form-card { padding: 22px; }\n}",
            "  .contact-form-card { padding: 22px; }\n  .page-home .site-header:not(.is-solid) .desktop-nav { display: none; }\n}",
        )

# Remove obsolete header-banner rules if any leftover outside nav (shouldn't be after restore)
css_path.write_text(css_now, encoding="utf-8")
print("css nav restored")

# --- Restore HTML headers from HEAD (header + mobile-menu) ---
header_pat_new = re.compile(
    r"  <header class=\"site-header[^>]*>[\s\S]*?</header>\s*",
    re.M,
)
# Also remove orphan header-banner style remnants - not needed

for name in ["index.html", "tours.html", "book.html", "contact.html", "pay.html"]:
    rel = f"voyage/{name}"
    old = git_show(rel)
    # extract header + mobile-menu from old
    m = re.search(
        r"(  <header class=\"site-header[\s\S]*?</header>\s*"
        r"(?:  <div class=\"mobile-menu\"[\s\S]*?</div>\s*)?)",
        old,
    )
    if not m:
        print("FAIL extract", name)
        continue
    restored_header = m.group(1)
    path = VOYAGE / name
    cur = path.read_text(encoding="utf-8")
    # replace current header (with or without following blank lines)
    cur2, n = re.subn(
        r"  <header class=\"site-header[\s\S]*?</header>\s*",
        restored_header,
        cur,
        count=1,
    )
    if n != 1:
        print("FAIL replace header", name, n)
        continue
    # bump cache
    cur2 = re.sub(r"css/style\.css\?v=\d+", "css/style.css?v=43", cur2)
    cur2 = re.sub(r"js/app\.js\?v=\d+", "js/app.js?v=43", cur2)
    path.write_text(cur2, encoding="utf-8")
    print("html header restored", name)

print("done")
