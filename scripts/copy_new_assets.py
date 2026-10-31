import os
import shutil
import re
import unicodedata

def slugify(text):
    # Normalize unicode to ASCII where possible or remove spaces/special chars
    t = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    t = re.sub(r'[^\w\s-]', '', t).strip().lower()
    return re.sub(r'[-\s]+', '-', t)

ROOT = "raw_docs"
DEST_BASE = os.path.join("voyage", "img", "tours")
FLEET_BASE = os.path.join("voyage", "img", "fleet")

os.makedirs(DEST_BASE, exist_ok=True)
os.makedirs(FLEET_BASE, exist_ok=True)

# 1. Cozy Bay Grand
src_cbg = os.path.join(ROOT, "1. Hạ Long Tàu Ngủ", "Cozy Bay Grand - 4 Sao")
dst_cbg = os.path.join(DEST_BASE, "halong-cozy-bay-grand")
os.makedirs(dst_cbg, exist_ok=True)

print("Copying Cozy Bay Grand...")
cbg_count = 0
for r, dirs, files in os.walk(src_cbg):
    rel = os.path.relpath(r, src_cbg)
    for f in files:
        if f.lower().endswith(('.jpg', '.jpeg', '.png', '.pdf')):
            rel_folder = slugify(rel) if rel != '.' else ''
            target_dir = os.path.join(dst_cbg, rel_folder) if rel_folder else dst_cbg
            os.makedirs(target_dir, exist_ok=True)
            clean_f = re.sub(r'[^\w\.\-]', '_', f)
            shutil.copy2(os.path.join(r, f), os.path.join(target_dir, clean_f))
            cbg_count += 1
print(f"Cozy Bay Grand: copied {cbg_count} files to {dst_cbg}")

# 2. Cozy Bay Premium & Sea Lion Premium
src_hl1 = os.path.join(ROOT, "2. Hạ Long 1 Ngày")
dst_cbp = os.path.join(DEST_BASE, "halong-cozy-bay-premium")
dst_slp = os.path.join(DEST_BASE, "halong-sea-lion-premium")
os.makedirs(dst_cbp, exist_ok=True)
os.makedirs(dst_slp, exist_ok=True)

print("Copying Cozy Bay Premium & Sea Lion...")
for brand, dst in [("Cozy Bay Premium", dst_cbp), ("Sea Lion Premium", dst_slp)]:
    b_src = os.path.join(src_hl1, brand)
    b_cnt = 0
    for r, dirs, files in os.walk(b_src):
        rel = os.path.relpath(r, b_src)
        for f in files:
            if f.lower().endswith(('.jpg', '.jpeg', '.png', '.mp4')):
                rel_folder = slugify(rel) if rel != '.' else ''
                target_dir = os.path.join(dst, rel_folder) if rel_folder else dst
                os.makedirs(target_dir, exist_ok=True)
                clean_f = re.sub(r'[^\w\.\-]', '_', f)
                shutil.copy2(os.path.join(r, f), os.path.join(target_dir, clean_f))
                b_cnt += 1
    print(f"{brand}: copied {b_cnt} files to {dst}")

# 3. Tropical Cruise (Lan Hạ)
src_lh = os.path.join(ROOT, "3. Lan Hạ 1 Ngày", "Tropical Cruise")
dst_lh = os.path.join(DEST_BASE, "lanha-tropical-cruise")
os.makedirs(dst_lh, exist_ok=True)
print("Copying Tropical Cruise...")
lh_cnt = 0
for r, dirs, files in os.walk(src_lh):
    rel = os.path.relpath(r, src_lh)
    for f in files:
        if f.lower().endswith(('.jpg', '.jpeg', '.png', '.mp4')):
            rel_folder = slugify(rel) if rel != '.' else ''
            target_dir = os.path.join(dst_lh, rel_folder) if rel_folder else dst_lh
            os.makedirs(target_dir, exist_ok=True)
            clean_f = re.sub(r'[^\w\.\-]', '_', f)
            shutil.copy2(os.path.join(r, f), os.path.join(target_dir, clean_f))
            lh_cnt += 1
print(f"Tropical Cruise: copied {lh_cnt} files to {dst_lh}")

# 4. Ninh Bình
src_nb = os.path.join(ROOT, "4. Ninh Bình Tours")
dst_nb = os.path.join(DEST_BASE, "ninh-binh")
os.makedirs(dst_nb, exist_ok=True)
print("Copying Ninh Binh...")
nb_cnt = 0
for r, dirs, files in os.walk(src_nb):
    # skip Chuong Trinh Tour folder when copying images
    if "Chương Trình Tour" in r:
        continue
    rel = os.path.relpath(r, src_nb)
    for f in files:
        if f.lower().endswith(('.jpg', '.jpeg', '.png', '.pdf')):
            rel_folder = slugify(rel) if rel != '.' else ''
            target_dir = os.path.join(dst_nb, rel_folder) if rel_folder else dst_nb
            os.makedirs(target_dir, exist_ok=True)
            clean_f = re.sub(r'[^\w\.\-]', '_', f)
            shutil.copy2(os.path.join(r, f), os.path.join(target_dir, clean_f))
            nb_cnt += 1
print(f"Ninh Binh: copied {nb_cnt} files to {dst_nb}")

# 5. Fleet (Các Loại Xe)
src_fleet = os.path.join(ROOT, "5. Các Loại Xe")
print("Copying Fleet...")
fl_cnt = 0
for r, dirs, files in os.walk(src_fleet):
    rel = os.path.relpath(r, src_fleet)
    for f in files:
        if f.lower().endswith(('.jpg', '.jpeg', '.png')):
            rel_folder = slugify(rel) if rel != '.' else ''
            target_dir = os.path.join(FLEET_BASE, rel_folder) if rel_folder else FLEET_BASE
            os.makedirs(target_dir, exist_ok=True)
            clean_f = re.sub(r'[^\w\.\-]', '_', f)
            shutil.copy2(os.path.join(r, f), os.path.join(target_dir, clean_f))
            fl_cnt += 1
print(f"Fleet: copied {fl_cnt} files to {FLEET_BASE}")

print("\nALL ASSETS COPIED SUCCESSFULLY!")

