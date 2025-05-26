from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import json
import os
import nltk
nltk.download('punkt')

from nltk.tokenize import sent_tokenize

# === 1. Load Model & Label Map ===
MODEL_DIR = "../AI/model_parser"  # Ganti sesuai path model kamu

# Load label map
with open(os.path.join(MODEL_DIR, "label_map.json")) as f:
    label_map = json.load(f)
    id_to_label = {v: k for k, v in label_map.items()}  # Misal: {0: "background_kandidat", 1: "keterampilan", ...}

# Load pipeline klasifikasi
clf_pipeline = pipeline("text-classification", model=MODEL_DIR, tokenizer=MODEL_DIR)

# === 2. Fungsi Parsing Resume ===
def parse_resume_text(resume_text: str, kandidat_id: str = ""):
    # Pisah teks menjadi kalimat
    sentences = sent_tokenize(resume_text)

    # Siapkan struktur kosong
    parsed = {
        "kandidat_id": kandidat_id,
        "ketrampilan": [],
        "pengalaman_kerja": [],
        "background_kandidat": []
    }

    # Klasifikasikan tiap kalimat
    for sentence in sentences:
        result = clf_pipeline(sentence, truncation=True)[0]
        label_id = int(result["label"].replace("LABEL_", ""))
        label_str = id_to_label[label_id].lower()

        print(f"[DEBUG] Kalimat: {sentence}")
        print(f"[DEBUG] Label: {label_str}, Score: {result['score']:.2f}")

        if "keterampilan" in label_str:
            parsed["ketrampilan"].append(sentence)
        elif "pengalaman" in label_str:
            parsed["pengalaman_kerja"].append(sentence)
        elif "pendidikan" in label_str or "background_kandidat" in label_str:
            parsed["background_kandidat"].append(sentence)

    # Gabungkan kalimat jadi 1 string per bagian
    return {
        "kandidat_id": kandidat_id,
        "ketrampilan": " ".join(parsed["ketrampilan"]),
        "pengalaman_kerja": " ".join(parsed["pengalaman_kerja"]),
        "background_kandidat": " ".join(parsed["background_kandidat"]),
    }
