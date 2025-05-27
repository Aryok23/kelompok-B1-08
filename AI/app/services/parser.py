from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification
import os
import json
import nltk
nltk.download('punkt')
from nltk.tokenize import sent_tokenize

# === 1. Load Model & Tokenizer ===
MODEL_DIR = "../AI/model_resume"  # Ganti path sesuai model kamu

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForTokenClassification.from_pretrained(MODEL_DIR)

ner_pipeline = pipeline(
    "token-classification",
    model=model,
    tokenizer=tokenizer,
    aggregation_strategy="simple"
)

# === 2. Parsing Resume per Kalimat ===
def parse_resume_text(resume_text: str, kandidat_id: str = ""):
    sentences = sent_tokenize(resume_text)

    parsed = {
        "ketrampilan": [],
        "pengalaman_kerja": [],
        "background_kandidat": []
    }

    for sentence in sentences:
        ner_results = ner_pipeline(sentence)
        for entity in ner_results:
            label = entity["entity_group"].lower()
            value = sentence[entity["start"]:entity["end"]].strip()

            if "keterampilan" in label:
                parsed["ketrampilan"].append(value)
            elif "pengalaman" in label:
                parsed["pengalaman_kerja"].append(value)
            elif "background" in label or "pendidikan" in label:
                parsed["background_kandidat"].append(value)

    parsed["ketrampilan"] = ", ".join(parsed["ketrampilan"])
    parsed["pengalaman_kerja"] = ", ".join(parsed["pengalaman_kerja"])
    parsed["background_kandidat"] = ", ".join(parsed["background_kandidat"])
    return parsed

