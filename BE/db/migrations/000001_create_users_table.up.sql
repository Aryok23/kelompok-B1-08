CREATE TABLE Users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     nama TEXT NOT NULL,
     email TEXT UNIQUE NOT NULL,
     password_hash TEXT, -- Nullable for OAuth users
     oauth_provider TEXT DEFAULT 'local', -- Values: 'github', 'google', 'local'
     oauth_id TEXT UNIQUE, -- Stores OAuth user ID if applicable
    role_users TEXT CHECK (role_users IN ('kandidat', 'recruiter')) NOT NULL, 
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
 );
 
CREATE TABLE Kandidat (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    nama_depan VARCHAR(100),
    nama_belakang VARCHAR(100),
    umur INT,
    tanggal_lahir DATE,
    gender VARCHAR(20),
    bidang_pekerjaan VARCHAR(255)
);

CREATE TABLE Recruiter (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    perusahaan VARCHAR(255)
);

CREATE TABLE CV (
    id SERIAL PRIMARY KEY,
    kandidat_id INT REFERENCES Kandidat(id) ON DELETE CASCADE,
    tanggal_unggah TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Parsed_Resume (
    id SERIAL PRIMARY KEY,
    cv_id INT REFERENCES CV(id) ON DELETE CASCADE,
    pengalaman_kerja TEXT,
    keterampilan TEXT,
    background_kandidat TEXT
);

CREATE TABLE Jobs (
    id SERIAL PRIMARY KEY,
    recruiter_id INT REFERENCES Recruiter(id) ON DELETE CASCADE,
    nama_pekerjaan VARCHAR(255),
    deskripsi_pekerjaan TEXT,
    tanggal_posting TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Applications (
    id SERIAL PRIMARY KEY,
    kandidat_id INT REFERENCES Kandidat(id) ON DELETE CASCADE,
    job_id INT REFERENCES Jobs(id) ON DELETE CASCADE,
    tanggal_apply TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Matching (
    id SERIAL PRIMARY KEY,
    parsed_resume_id INT REFERENCES Parsed_Resume(id) ON DELETE CASCADE,
    job_id INT REFERENCES Jobs(id) ON DELETE CASCADE,
    skor_relevansi FLOAT
);
