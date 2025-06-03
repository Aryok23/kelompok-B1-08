'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const DetailLoker = () => {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobById = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/jobs/${id}`);
        const jobData = res.data;

        const formattedJob = {
          id: jobData.id,
          title: jobData.nama_pekerjaan,
          company: jobData.company,
          location: 'Remote', // Default sementara
          posted: new Date(jobData.posted).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          description: jobData.description,
        };

        setJob(formattedJob);
      } catch (error) {
        console.error('Gagal mengambil detail lowongan:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJobById();
  }, [id]);

  if (loading) return <p>Memuat data...</p>;
  if (!job) return <p>Lowongan tidak ditemukan.</p>;

  return (
    <div className="px-[300px] pt-[130px] pb-[150px]">
      {/* Header */}
      <div className="border border-gray-300 rounded-lg p-6 flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[#05192D] font-bold font-outfit text-[30px]">{job.title}</h2>
          <p className="text-[#05192D] font-outfit text-[24px] mt-1">{job.company}</p>
          <div className="flex flex-col gap-4 mt-4 text-sm text-[#05192D]">
            <div className="flex items-center gap-2">
              <div className="w-[20px] h-[20px] relative">
                <Image src="/location.png" alt="lokasi" fill className="object-contain" />
              </div>
              <span className="text-[16px]">{job.location}</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-3">
            Lowongan dibuat {job.posted}
          </p>

          <div className="flex gap-4 mt-6">
            <button 
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg" 
              onClick={() => router.push(`/dashboard/lamar`)}>
              Lamar
            </button>
            <button className="border border-green-500 text-green-500 font-semibold px-6 py-2 rounded-lg hover:bg-green-50">
              Simpan
            </button>
          </div>
        </div>

        <div className="w-[120px] h-[120px] bg-gray-200 rounded-sm" />
      </div>

      {/* Deskripsi */}
      {job.description && (
        <div className="mb-6 font-roboto">
          <h3 className="text-[22px] font-bold mb-3 text-[#05192D]">Deskripsi Pekerjaan</h3>
          <p className="text-[18px] text-[#05192D] leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default DetailLoker;
