from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.model.schemas import Top5Request, SpecificJobRequest
from app.services.matcher import match_top_5_jobs, match_to_specific_job
from app.services.parser import parse_resume_text, extract_text_with_easyocr
from app.model.schemas import  ResumeParseResponse
import pdfplumber
import io
from typing import Optional
router = APIRouter()

@router.post("/top-5")
def get_top_5_matches(req: Top5Request):
    results = match_top_5_jobs(req.kandidat, req.jobs)
    return {
        "kandidat_id": req.kandidat_id,
        "matches": results
    }

@router.post("/specific-job")
def get_specific_job_match(req: SpecificJobRequest):
    score = match_to_specific_job(req.kandidat, req.job)
    return {
        "kandidat_id": req.kandidat_id,
        "job_id": req.job_id,
        "nama_pekerjaan": req.job.nama_pekerjaan,
        "similarity_score": round(score, 4)
    }

import logging

@router.post("/parse/resume", response_model=ResumeParseResponse)
async def parse_resume_file(
    kandidat_id: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Parse resume PDF file with fallback to OCR
    """
    print(f"Received file: {file.filename}, content_type: {file.content_type}")
    print(f"Kandidat ID: {kandidat_id}")
    
    # Validasi file
    if not file.filename or not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File harus berupa PDF.")
    
    # Validasi content type (lebih fleksibel)
    allowed_content_types = ["application/pdf", "application/octet-stream", None]
    if file.content_type not in allowed_content_types:
        raise HTTPException(status_code=400, detail=f"Content type tidak valid: {file.content_type}")
    
    try:
        contents = await file.read()
        print(f"File size: {len(contents)} bytes")
        
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="File PDF kosong.")
        
        resume_text = ""
        
        # Step 1: Coba extract text dengan pdfplumber dulu (untuk PDF text-based)
        print("Trying pdfplumber text extraction...")
        try:
            with pdfplumber.open(io.BytesIO(contents)) as pdf:
                print(f"PDF pages: {len(pdf.pages)}")
                for i, page in enumerate(pdf.pages):
                    page_text = page.extract_text() or ""
                    resume_text += page_text + "\n"
                    print(f"Page {i+1} text length: {len(page_text)}")
        except Exception as e:
            print(f"pdfplumber error: {e}")
        
        print(f"Total extracted text length: {len(resume_text.strip())}")
        
        # Step 2: Jika text extraction gagal atau hasilnya terlalu sedikit, gunakan OCR
        if len(resume_text.strip()) < 50:  # Threshold minimum text
            print("Text extraction insufficient, using EasyOCR...")
            try:
                resume_text = extract_text_with_easyocr(contents)
                print(f"Total OCR text length: {len(resume_text.strip())}")
                
            except Exception as ocr_error:
                print(f"OCR error: {ocr_error}")
                raise HTTPException(
                    status_code=500, 
                    detail=f"Gagal membaca PDF dengan OCR: {str(ocr_error)}"
                )
        
        # Step 3: Validasi final hasil ekstraksi
        if len(resume_text.strip()) < 20:
            raise HTTPException(
                status_code=400, 
                detail="Tidak dapat mengekstrak teks yang cukup dari PDF. Pastikan PDF berisi teks yang dapat dibaca."
            )
        
        print(f"Successfully extracted {len(resume_text)} characters")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"PDF processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Gagal memproses file PDF: {str(e)}")
    
    # Step 4: Parse extracted text
    try:
        print("Starting text parsing with NER...")
        parsed = parse_resume_text(resume_text, kandidat_id)
        print(f"Parsing completed: {parsed}")
        
        return {
            "kandidat_id": kandidat_id,
            **parsed
        }
        
    except Exception as e:
        print(f"Parsing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Gagal memproses resume: {str(e)}")