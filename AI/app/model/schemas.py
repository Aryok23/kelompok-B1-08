from pydantic import BaseModel
from typing import List, Optional


class KandidatData(BaseModel):
    pengalaman_kerja: str
    keterampilan: str
    background_kandidat: str

class JobData(BaseModel):
    nama_pekerjaan: str
    deskripsi_pekerjaan: str

class SpecificJobRequest(BaseModel):
    kandidat_id: int
    job_id: int
    kandidat: KandidatData
    job: JobData




class ResumeParseResponse(BaseModel):
    kandidat_id: str
    ketrampilan: str
    pengalaman_kerja: str
    background_kandidat: str
