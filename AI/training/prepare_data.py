import os
import pdfplumber
import json

# Path
RESUME_DIR = "../data/Resume"
OUTPUT_JSON = "../data/resume_texts_paragraph.json"

# Simpan hasil ekstraksi
resume_data = []

# Loop semua PDF dalam subfolder (label = nama folder)
for label_folder in os.listdir(RESUME_DIR):
    label_path = os.path.join(RESUME_DIR, label_folder)
    if os.path.isdir(label_path):
        for filename in os.listdir(label_path):
            if filename.endswith(".pdf"):
                pdf_path = os.path.join(label_path, filename)
                try:
                    with pdfplumber.open(pdf_path) as pdf:
                        # Gabungkan semua teks dari halaman
                        text = "\n".join([page.extract_text() or "" for page in pdf.pages])
                        
                        # Normalisasi newline (hapus ganda)
                        text = text.replace('\r\n', '\n').replace('\r', '\n')
                        text = "\n".join([line.strip() for line in text.split('\n') if line.strip()])  # hapus spasi kosong

                        # Bagi ke dalam paragraf (berdasarkan newline tunggal)
                        paragraphs = [p.strip() for p in text.split('\n') if p.strip()]

                        resume_data.append({
                            "file": filename,
                            "label": label_folder,
                            "text": text,
                            "paragraphs": paragraphs  # << ini tambahan penting untuk segmentasi
                        })
                except Exception as e:
                    print(f"Gagal ekstrak {pdf_path}: {e}")

# Simpan ke JSON
with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(resume_data, f, ensure_ascii=False, indent=2)

print(f"✅ Ekstraksi selesai, total resume: {len(resume_data)}")
