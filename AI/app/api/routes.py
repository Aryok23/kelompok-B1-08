from fastapi import APIRouter
from app.model.schemas import Top5Request, SpecificJobRequest
from app.services.matcher import match_top_5_jobs, match_to_specific_job
from app.services.parser import parse_resume_text
from app.model.schemas import ResumeParseRequest, ResumeParseResponse

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

@router.post("/parse/resume", response_model=ResumeParseResponse)
def parse_resume(req: ResumeParseRequest):
    parsed = parse_resume_text(req.resume_text)
    print(parsed) 
    return {
        "kandidat_id": req.kandidat_id,
        **parsed
    }