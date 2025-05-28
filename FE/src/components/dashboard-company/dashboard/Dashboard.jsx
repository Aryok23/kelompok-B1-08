"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  Send,
  Trash2,
  PlusCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { jobList, statusColor } from "@/data/loker"; // Import data dari file data.js

const ITEMS_PER_PAGE = 3;

const Dashboard = () => {

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(jobList.length / ITEMS_PER_PAGE);
  const router = useRouter();

  const paginatedJobs = jobList.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  
  // Fungsi untuk navigasi ke halaman daftar pelamar
  const viewApplicants = (jobId) => {
    router.push(`/company/dashboard/job-applicants`);
  };

  return (
    <div className="p-6 font-outfit max-w-5xl mx-auto pt-[100px]">
      {/* Header Welcome */}
      <div className="border p-6 rounded-lg mb-6 bg-white">
        <h2 className="text-2xl font-bold text-[#05192D] mb-1">
          Selamat datang, PT Maju Jaya
        </h2>
        <p className="text-gray-600">
          Temukan kandidat karyawan terbaik Anda bersama Info Loker! Mulai dengan membuat lowongan!
        </p>
        <Button 
          className="mt-4 bg-green-500 hover:bg-green-600"
          onClick={() => router.push("/company/dashboard/new")}>
          Buat Lowongan
        </Button>
      </div>

      {/* Dashboard Title */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-3xl font-semibold text-[#05192D] flex items-center gap-2">
          Dashboard
        </h3>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full table-fixed">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="p-4 w-2/5">Lowongan</th>
              <th className="p-4">Status</th>
              <th className="p-4">Jumlah Pelamar</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedJobs.map((job) => (
              <tr 
                key={job.id} 
                className="border-t text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                onClick={() => viewApplicants(job.id)}
              >
                <td className="p-4">
                  <div className="font-semibold text-[#05192D]">{job.title}</div>
                  <div className="text-sm text-gray-500">{job.location}</div>
                </td>
                <td className="p-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[job.status]}`}>
                    {job.status}
                  </span>
                </td>
                <td className="p-4">{job.applicants}</td>
                <td className="p-4">{job.date}</td>
                <td className="p-4 text-center flex items-center justify-center gap-3">
                  <Send size={18} className="text-gray-500 cursor-pointer hover:text-blue-500" 
                       onClick={(e) => {
                         e.stopPropagation();
                         // Logika untuk mengirim lowongan
                       }} 
                  />
                  <Trash2 size={18} className="text-gray-500 cursor-pointer hover:text-red-500" 
                         onClick={(e) => {
                           e.stopPropagation();
                           // Logika untuk menghapus lowongan
                         }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
        <div className="flex items-center gap-5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </Button>
          <span className="text-sm text-gray-600">
            Halaman {page} dari {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
