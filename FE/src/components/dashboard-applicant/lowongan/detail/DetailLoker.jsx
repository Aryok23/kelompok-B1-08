'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import jobData from '@/data/jobData';
import Image from 'next/image';

const DetailLoker = () => {
  const { id } = useParams();
  const job = jobData[parseInt(id)];

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
            <div className="flex items-center gap-2">
              <div className="w-[20px] h-[20px] relative">
                <Image src="/clock.png" alt="lokasi" fill className="object-contain" />
              </div>
              <span className="text-[16px]">{job.jobType}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[20px] h-[20px] relative">
                <Image src="/money.png" alt="lokasi" fill className="object-contain" />
              </div>
              <span className="text-[16px]">{job.salary}</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-3">
            Lowongan dibuat {job.posted}
          </p>

          <div className="flex gap-4 mt-6">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg">
              Lamar
            </button>
            <button className="border border-green-500 text-green-500 font-semibold px-6 py-2 rounded-lg hover:bg-green-50">
              Simpan
            </button>
          </div>
        </div>

        <div className="w-[120px] h-[120px] bg-gray-200 rounded-sm" />
      </div>

      {/* Kualifikasi */}
      {job.qualifications && (
        <div className="mb-6 font-roboto">
          <h3 className="text-[22px] font-bold mb-3 text-[#05192D]">Kualifikasi</h3>
          <ul className="text-[18px] list-disc list-inside text-[#05192D] leading-relaxed">
            {job.qualifications.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tanggung Jawab */}
      {job.responsibilities && (
        <div className="mb-6 font-roboto">
          <h3 className="text-[22px] font-bold mb-3 text-[#05192D]">Tanggung Jawab</h3>
          <ul className="text-[18px] list-disc list-inside text-[#05192D] leading-relaxed">
            {job.responsibilities.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Fasilitas */}
      {job.benefits && (
        <div className="mb-6 font-roboto">
          <h3 className="text-[22px] font-bold mb-3 text-[#05192D]">Fasilitas</h3>
          <ul className="text-[18px] list-disc list-inside text-[#05192D] leading-relaxed">
            {job.benefits.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DetailLoker;
