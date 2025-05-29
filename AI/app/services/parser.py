from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification
import os
import json
import nltk
import easyocr
import numpy as np
from pdf2image import convert_from_bytes

from nltk.tokenize import sent_tokenize

# === 1. Load Model & Tokenizer ===
MODEL_DIR = "../AI/model_resume_parser_final"  # Ganti path sesuai model kamu

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForTokenClassification.from_pretrained(MODEL_DIR)
ocr_reader = None
ner_pipeline = pipeline(
    "token-classification",
    model=model,
    tokenizer=tokenizer,
    aggregation_strategy="simple"
)
def get_ocr_reader():
    global ocr_reader
    if ocr_reader is None:
        print("Initializing EasyOCR reader...")
        ocr_reader = easyocr.Reader(['en', 'id'], gpu=False)  # English + Indonesian
        print("EasyOCR reader initialized")
    return ocr_reader

def extract_text_with_easyocr(pdf_contents):
    """
    Extract text from PDF using EasyOCR
    """
    try:
        # Convert PDF to images
        print("Converting PDF to images...")
        images = convert_from_bytes(pdf_contents)
        print(f"Converted to {len(images)} images")
        
        # Get OCR reader
        reader = get_ocr_reader()
        
        full_text = ""
        for i, image in enumerate(images):
            print(f"Processing page {i+1}/{len(images)} with OCR...")
            
            # Convert PIL image to numpy array
            img_array = np.array(image)
            
            # Extract text using EasyOCR
            results = reader.readtext(img_array)
            
            # Combine all detected text
            page_text = ""
            for detection in results:
                # detection format: [bbox, text, confidence]
                text = detection[1]
                confidence = detection[2]
                
                # Only include text with confidence > 0.5
                if confidence > 0.5:
                    page_text += text + " "
            
            full_text += page_text + "\n"
            print(f"Page {i+1} OCR text length: {len(page_text)}")
        
        return full_text.strip()
        
    except Exception as e:
        print(f"EasyOCR error: {str(e)}")
        raise Exception(f"OCR processing failed: {str(e)}")
        
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