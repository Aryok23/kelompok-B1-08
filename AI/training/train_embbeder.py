import json
import torch
from sentence_transformers import SentenceTransformer
import os


INPUT_JSON = "../data/resume_texts.json"
EMBEDDING_OUTPUT = "../data/resume_embeddings.pt"
LABELS_OUTPUT = "../data/resume_labels.json"


with open(INPUT_JSON, "r", encoding="utf-8") as f:
    resumes = json.load(f)

texts = [r["text"] for r in resumes]
labels = [r["label"] for r in resumes]


model = SentenceTransformer("all-MiniLM-L6-v2")


embeddings = model.encode(texts, convert_to_tensor=True)


torch.save(embeddings, EMBEDDING_OUTPUT)
with open(LABELS_OUTPUT, "w", encoding="utf-8") as f:
    json.dump(labels, f, indent=2)

print(f"✅ Embedding selesai. Total resume: {len(resumes)}")
print(f"📁 Saved to: {EMBEDDING_OUTPUT} and {LABELS_OUTPUT}")
