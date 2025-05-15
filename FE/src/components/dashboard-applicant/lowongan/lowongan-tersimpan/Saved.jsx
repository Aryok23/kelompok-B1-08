import React from 'react';
import Lowongan from '@/components/dashboard-applicant/lowongan/lowongan-card/Lowongan';
import jobData from '@/data/jobSave';

const Saved = () => {
  const savedData = jobData.slice(0, 2); // ambil 2 data tersimpan

  return (
    <div className="mb-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <img src="/saved.png" alt="bookmark" className="w-[30px] h-[30px]" />
        <h1 className="text-3xl font-bold font-outfit text-[#05192D]">Lowongan Tersimpan</h1>
      </div>

      {/* List */}
      <div className="space-y-4 w-[450px]">
        {savedData.map((item) => (
          <Lowongan
            key={item.id}
            id={item.id}
            title={item.title}
            company={item.company}
            location={item.location}
            posted={item.posted}
            iconType="saved" // Menampilkan ikon biru
          />
        ))}
      </div>

      {/* Link Lihat semua */}
      <div className="mt-4 *:text-right font-outfit">
      <a
        href="/dashboard/aktivitas?tab=saved"
        className="text-[18px] text-[#05192D] underline flex items-center justify-end gap-1"
      >
        Lihat semua
      </a>
      </div>
    </div>
  );
};

export default Saved;
