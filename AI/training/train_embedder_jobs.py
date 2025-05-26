import pandas as pd
import torch
import json
from sentence_transformers import SentenceTransformer


INPUT_CSV = "../data/job_title_des.csv"
OUTPUT_EMBED = "../data/job_embeddings.pt"
OUTPUT_LABELS = "../data/job_labels.json"


model = SentenceTransformer("all-MiniLM-L6-v2")


df = pd.read_csv(INPUT_CSV)
texts = (df["Job Title"] + " - " + df["Job Description"]).tolist()
labels = df["Job Title"].tolist()  # atau df.to_dict(orient="records") untuk full metadata


embeddings = model.encode(texts, convert_to_tensor=True)


torch.save(embeddings, OUTPUT_EMBED)
with open(OUTPUT_LABELS, "w", encoding="utf-8") as f:
    json.dump(labels, f, indent=2)

print(f"✅ Embedding job selesai. Total: {len(texts)}")
