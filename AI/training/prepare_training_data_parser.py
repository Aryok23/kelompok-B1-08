import json
import csv

# Load labeled data
with open("../data/resume_texts_labeled.json", "r", encoding="utf-8") as f:
    resume_data = json.load(f)

# Label valid untuk pelatihan
valid_labels = {"pengalaman_kerja", "keterampilan", "background_kandidat"}

# Ekstrak ke list
training_data = []

for resume in resume_data:
    for p in resume.get("paragraphs_labeled", []):
        text = p.get("text", "").strip()
        label = p.get("predicted_label", "").strip()
        if text and label in valid_labels:
            training_data.append((text, label))

print(f"✅ Total data yang diekstrak untuk training: {len(training_data)}")

# Simpan ke CSV
with open("../data/resume_training_data.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["text", "label"])
    writer.writerows(training_data)

print("📁 Data training berhasil disimpan di 'resume_training_data.csv'")
