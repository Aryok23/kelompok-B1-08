"use client";

import React, { useState } from 'react';
import Lowongan from '@/components/dashboard-applicant/lowongan/lowongan-card/Lowongan';
import jobData from '@/data/jobData';
import Image from 'next/image';

const Foryou = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(jobData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = jobData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="min-h-[1350px] w-[600px] pt-[150px] pb-[150px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="relative w-[40px] h-[40px]">
        <Image 
          src="/image-search-lowongan.png" 
          alt="search" 
          fill 
          className="object-contain" 
        />
        </div>
        <h1 className="text-4xl font-bold font-outfit text-[#05192D]">Lowongan untuk Kamu</h1>
      </div>

      {/* Daftar Lowongan */}
      <div className="space-y-4 font-roboto">
        {currentData.map((item) => (
          <Lowongan
            key={item.id}
            id={item.id}
            title={item.title}
            company={item.company}
            location={item.location}
            posted={item.posted}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 font-roboto">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded text-sm font-medium disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Halaman {currentPage} dari {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded text-sm font-medium disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Foryou;

