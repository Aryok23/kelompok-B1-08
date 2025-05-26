import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib

# Path ke file JSONL hasil anotasi manual
INPUT_JSONL = "../data/manual_labeling_data.jsonl"
MODEL_PATH = "../data/paragraph_segmenter.pkl"

# Load JSONL
data = []
with open(INPUT_JSONL, "r", encoding="utf-8") as f:
    for line in f:
        row = json.loads(line)
        if row["label"]:  # hanya yang ada label
            data.append(row)

df = pd.DataFrame(data)

# Split data
X_train, X_test, y_train, y_test = train_test_split(df["text"], df["label"], test_size=0.2, random_state=42, stratify=df["label"])

# TF-IDF + Logistic Regression
pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(lowercase=True, stop_words="english")),
    ("clf", LogisticRegression(max_iter=1000, class_weight="balanced"))
])

# Train model
pipeline.fit(X_train, y_train)

# Simpan model
joblib.dump(pipeline, MODEL_PATH)
print("✅ Model trained and saved.")

# Load model
pipeline = joblib.load(MODEL_PATH)

# Load semua resume
with open("../data/resume_texts.json", "r", encoding="utf-8") as f:
    resume_data = json.load(f)

# Prediksi label semua paragraf
for resume in resume_data:
    labeled_paragraphs = []
    for paragraph in resume.get("paragraphs", []):
        text = paragraph.strip()
        if text:
            pred = pipeline.predict([text])[0]
            labeled_paragraphs.append({
                "text": text,
                "predicted_label": pred
            })
    resume["paragraphs_labeled"] = labeled_paragraphs

# Simpan ke file baru
with open("../data/resume_texts_labeled.json", "w", encoding="utf-8") as f:
    json.dump(resume_data, f, indent=2, ensure_ascii=False)

print("✅ Semua paragraf berhasil dilabel otomatis.")
