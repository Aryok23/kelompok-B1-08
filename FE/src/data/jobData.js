"use client";
import axios from 'axios';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL 
const fetchJobData = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/jobs`); // atau ganti ke baseURL sesuai environment
    const jobs = res.data;

    // Format ulang sesuai dengan kebutuhan komponen Lowongan
    const formatted = jobs.map((job) => ({
      id: job.id,
      title: job.nama_pekerjaan,
      company: job.company,
      location: 'Remote', // Default karena tidak ada lokasi di database
      posted: new Date(job.posted).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      description: job.description
    }
  )
    }));

    return formatted;
  } catch (error) {
    console.error('Gagal mengambil data lowongan:', error);
    return [];
  }
};

export default fetchJobData;
