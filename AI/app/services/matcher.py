from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

def build_profile_text(kandidat):
    # Sesuaikan nama field dengan schema: keterampilan, pengalaman_kerja, background_kandidat
    return f"{kandidat.keterampilan}. {kandidat.pengalaman_kerja}. {kandidat.background_kandidat}"

def match_top_5_jobs(kandidat, jobs):
    profile_text = build_profile_text(kandidat)
    kandidat_vec = model.encode(profile_text, convert_to_tensor=True)

    # Sesuaikan nama field job: nama_pekerjaan, deskripsi_pekerjaan
    job_texts = [f"{job.nama_pekerjaan} - {job.deskripsi_pekerjaan}" for job in jobs]
    job_vecs = model.encode(job_texts, convert_to_tensor=True)

    similarities = util.pytorch_cos_sim(kandidat_vec, job_vecs)[0]
    top_results = similarities.topk(k=min(5, len(jobs)))

    return [
        {
            "nama_pekerjaan": jobs[idx].nama_pekerjaan,
            "similarity": round(score.item(), 4)
        }
        for score, idx in zip(top_results.values, top_results.indices)
    ]

def match_to_specific_job(kandidat, job):
    profile_text = build_profile_text(kandidat)
    kandidat_vec = model.encode(profile_text, convert_to_tensor=True)

    job_text = f"{job.nama_pekerjaan} - {job.deskripsi_pekerjaan}"
    job_vec = model.encode(job_text, convert_to_tensor=True)

    return util.pytorch_cos_sim(kandidat_vec, job_vec).item()
