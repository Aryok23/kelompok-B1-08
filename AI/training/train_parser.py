import os
import pandas as pd
import json
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from datasets import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
    DataCollatorWithPadding
)
import torch
import numpy as np
from evaluate import load

# 1. Load dataset
df = pd.read_csv("resume_training_data.csv")

# 2. Encode label
label_encoder = LabelEncoder()
df["label_encoded"] = label_encoder.fit_transform(df["label"])

# 3. Split data
train_df, eval_df = train_test_split(df[["text", "label_encoded"]], test_size=0.1, random_state=42)

# 4. Convert to HuggingFace Dataset
train_dataset = Dataset.from_pandas(train_df.rename(columns={"label_encoded": "label"}))
eval_dataset = Dataset.from_pandas(eval_df.rename(columns={"label_encoded": "label"}))

# 5. Load tokenizer
checkpoint = "bert-base-multilingual-cased"
tokenizer = AutoTokenizer.from_pretrained(checkpoint)

# 6. Tokenization function
def tokenize_function(examples):
    return tokenizer(examples["text"], truncation=True)

train_dataset = train_dataset.map(tokenize_function, batched=True)
eval_dataset = eval_dataset.map(tokenize_function, batched=True)

# 7. Load model
model = AutoModelForSequenceClassification.from_pretrained(
    checkpoint,
    num_labels=len(label_encoder.classes_)
)

# 8. Data collator (handle padding dynamically)
data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

# 9. Metrics
accuracy_metric = load("accuracy")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    return accuracy_metric.compute(predictions=predictions, references=labels)

# 10. Training arguments
training_args = TrainingArguments(
    output_dir="/content/drive/MyDrive/model_resume_parser2",
    do_train=True,
    do_eval=True,  # Tetap bisa evaluasi walau tidak otomatis setiap epoch
    save_strategy="no",
    learning_rate=4e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    seed=42,
)


# 11. Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=tokenizer,
    data_collator=data_collator,
    compute_metrics=compute_metrics,
)

# 12. Train
trainer.train()
# Tentukan path output ke Google Drive
output_dir = "/content/drive/MyDrive/model_resume_parser2"

# Buat folder jika belum ada
os.makedirs(output_dir, exist_ok=True)

# Simpan model dan tokenizer
trainer.save_model(output_dir)
tokenizer.save_pretrained(output_dir)

# Simpan label map (konversi int64 ke int)
label_map = {
    label: int(encoded)
    for label, encoded in zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_))
}
with open(os.path.join(output_dir, "label_map.json"), "w") as f:
    json.dump(label_map, f)

