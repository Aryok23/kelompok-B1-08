"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

const DetailLoker = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Hardcoded Job Data
  const jobData = {
    title: "Frontend Developer",
    location: "Jakarta, Indonesia",
    type: "Full-time",
    salary: "Rp 10.000.000 - Rp 15.000.000",
  };

  // Hardcoded Applicants
  const applicants = [
    {
      id: 1,
      name: "Budi Santoso",
      experience: "3 tahun di Tokopedia",
      skills: "React, Next.js, Tailwind",
      background: "S1 Informatika UGM",
      score: 85,
    },
    {
      id: 2,
      name: "Siti Aminah",
      experience: "2 tahun di Gojek",
      skills: "Vue, Nuxt, CSS",
      background: "S1 Sistem Informasi UI",
      score: 78,
    },
    {
      id: 3,
      name: "Andi Wijaya",
      experience: "4 tahun di Traveloka",
      skills: "Angular, TypeScript",
      background: "S1 Teknik Komputer ITB",
      score: 90,
    },
    // Tambah pelamar lainnya jika perlu
  ];


  // Pagination logic
  const totalApplicants = applicants.length;
  const totalPages = Math.ceil(totalApplicants / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalApplicants);
  const currentApplicants = applicants.slice(startIndex, endIndex);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const goToPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-6 font-outfit max-w-5xl mx-auto pt-[100px]">
      {/* Header */}
      <div className="flex items-center mb-6 gap-4">
        <button
          onClick={() => router.push("/company/dashboard")}
          className="flex items-center"
        >
          <ArrowLeft size={20} />
          <span className="ml-1">Kembali</span>
        </button>
        <h1 className="text-2xl font-bold text-[#05192D] ml-[300px]">Daftar Pelamar</h1>
      </div>

      {/* Job Info */}
      <div className="border p-6 rounded-lg mb-6 bg-white flex justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#05192D] mb-1">
            {jobData.title}
          </h2>
          <div className="flex flex-col gap-1 text-gray-600">
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{jobData.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🕒</span>
              <span>{jobData.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💰</span>
              <span>{jobData.salary}</span>
            </div>
          </div>
        </div>
        <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Kandidat Terbaik Header */}
      <div className="flex items-center mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-[#05192D]">Kandidat Terbaik</h3>
        </div>
      </div>

      {/* Table */}
      {totalApplicants > 0 ? (
        <div className="bg-white border rounded-lg overflow-hidden mb-6">
          <table className="min-w-full table-fixed">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="p-4 w-16">No</th>
              <th className="p-4">Kandidat</th>
              <th className="p-4">Pengalaman Kerja</th>
              <th className="p-4">Keterampilan</th>
              <th className="p-4">Latar Belakang</th>
              <th className="p-4 text-center">Skor</th> {/* Kolom skor */}
              <th className="p-4 text-center">Resume</th>
            </tr>
          </thead>

          <tbody>
            {currentApplicants.map((applicant, index) => (
              <tr key={applicant.id} className="border-t text-sm text-gray-700">
                <td className="p-4">{startIndex + index + 1}</td>
                <td className="p-4 font-medium">{applicant.name}</td>
                <td className="p-4">{applicant.experience}</td>
                <td className="p-4">{applicant.skills}</td>
                <td className="p-4">{applicant.background}</td>
                <td className="p-4 text-center font-semibold text-blue-600">{applicant.score}</td> {/* Nilai skor */}
                <td className="p-4 flex justify-center">
                  <button className="text-red-500 hover:text-red-700">
                    <FileText size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          </table>
        </div>
      ) : (
        <div className="bg-white border rounded-lg p-8 text-center mb-6">
          <p className="text-gray-500">Belum ada pelamar untuk lowongan ini.</p>
        </div>
      )}

      {/* Pagination */}
      {totalApplicants > 0 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={goToPrev}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-8 h-8 rounded-md flex items-center justify-center ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={goToNext}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailLoker;
