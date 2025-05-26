import json
import random

INPUT_JSON = "../data/resume_texts.json"
OUTPUT_JSONL = "../data/manual_labeling_data.jsonl"
MAX_SAMPLES = 200  # jumlah maksimum paragraf yang akan diekspor untuk labeling

# Baca file JSON
with open(INPUT_JSON, "r", encoding="utf-8") as f:
    resume_data = json.load(f)

# Ambil semua paragraf
all_paragraphs = []
for resume in resume_data:
    for paragraph in resume.get("paragraphs", []):
        all_paragraphs.append({
            "text": paragraph.strip(),
            "label": ""  # untuk kamu isi: pengalaman_kerja, keterampilan, background_kandidat
        })

# Acak dan ambil sampel
random.seed(42)
sampled_paragraphs = random.sample(all_paragraphs, min(MAX_SAMPLES, len(all_paragraphs)))

# Simpan dalam format JSONL
with open(OUTPUT_JSONL, "w", encoding="utf-8") as f:
    for entry in sampled_paragraphs:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

print(f"✅ Selesai. File untuk anotasi manual disimpan di: {OUTPUT_JSONL}")
