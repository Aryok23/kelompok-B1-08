'use client';
import React from 'react';
import Lowongan from '@/components/dashboard-applicant/lowongan/lowongan-card/Lowongan';
import jobData from '@/data/jobSent';
import Image from 'next/image';

const Sent = () => {
  const sentData = jobData.slice(0, 2); // ambil 2 lamaran contoh

  return (
    <div className="mb-10 pt-[160px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-[30px] h-[30px]" >
          <Image 
            src="/sent.png" 
            alt="search" 
            fill 
            className="object-contain" 
          />
        </div>
        <h1 className="text-3xl font-bold font-outfit text-[#05192D]">Lamaran Terkirim</h1>
      </div>

      {/* List */}
      <div className="space-y-4 w-[450px]">
        {sentData.map((item) => (
          <Lowongan
            key={item.id}
            id={item.id}
            title={item.title}
            company={item.company}
            location={item.location}
            posted={item.posted}
            iconType="none" // Tidak perlu bookmark
          />
        ))}
      </div>

      {/* Link Lihat semua */}
      <div className="mt-4 text-right font-outfit">
      <a
        href="/dashboard/aktivitas?tab=sent"
        className="text-[18px] text-[#05192D] underline flex items-center justify-end gap-1"
      >
        Lihat semua
      </a>
      </div>
    </div>
  );
};

export default Sent;
