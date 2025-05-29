from pydantic import BaseModel
from typing import List, Optional

class CandidateInput(BaseModel):
    keterampilan: str
    pengalaman_kerja: str
    background_kandidat: str

class JobInput(BaseModel):
    job_id: Optional[int] = None
    nama_pekerjaan: str
    deskripsi_pekerjaan: str

class Top5Request(BaseModel):
    kandidat_id: str
    kandidat: CandidateInput
    jobs: List[JobInput]

class SpecificJobRequest(BaseModel):
    kandidat_id: str
    job_id: int
    kandidat: CandidateInput
    job: JobInput


class ResumeParseResponse(BaseModel):
    kandidat_id: str
    ketrampilan: str
    pengalaman_kerja: str
    background_kandidat: str
