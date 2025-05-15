"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Dynamic import for the RichTextEditor to ensure it only loads on client-side
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-100 animate-pulse rounded-md"></div>
});

const NewLoker = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    jobTitle: "",
    province: "",
    city: "",
    jobType: "",
    salaryType: "",
    salaryMin: "",
    salaryMax: "",
    qualifications: "",
    responsibilities: "",
    facilities: "",
  });

  const router = useRouter();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-[100px] pb-10 font-outfit">
      <h1 className="text-3xl font-bold text-[#05192D] mb-10">Buat Lowongan</h1>

      {/* Stepper */}
      <div className="flex items-center mb-12">
        <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-blue-600' : 'text-gray-500'} font-medium`}>
          <div className={`w-5 h-5 rounded-full ${currentStep === 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          Identitas Lowongan
        </div>
        <div className="flex-1 h-px bg-gray-300 mx-2"></div>
        <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-blue-600' : 'text-gray-500'} font-medium`}>
          <div className={`w-5 h-5 rounded-full ${currentStep === 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          Deskripsi Pekerjaan
        </div>
      </div>

      <form className="space-y-6">
        {currentStep === 1 ? (
          <>
            <div>
              <Label>Nama Pekerjaan</Label>
              <Input
                placeholder="Masukkan nama pekerjaan (Contoh: Data Scientist)"
                value={form.jobTitle}
                onChange={(e) => handleChange("jobTitle", e.target.value)}
              />
            </div>

            <div>
              <Label>Lokasi</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <Select onValueChange={(val) => handleChange("province", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jakarta">Jakarta</SelectItem>
                    <SelectItem value="Jawa Barat">Jawa Barat</SelectItem>
                    <SelectItem value="DIY">DIY</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={(val) => handleChange("city", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sleman">Sleman</SelectItem>
                    <SelectItem value="Jakarta Timur">Jakarta Timur</SelectItem>
                    <SelectItem value="Bandung">Bandung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Tipe Pekerjaan</Label>
              <Select onValueChange={(val) => handleChange("jobType", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe pekerjaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-Time">Full-Time</SelectItem>
                  <SelectItem value="Part-Time">Part-Time</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tipe Pembayaran Gaji</Label>
              <Select onValueChange={(val) => handleChange("salaryType", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe pembayaran gaji" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bulanan">Per Bulan</SelectItem>
                  <SelectItem value="Mingguan">Per Minggu</SelectItem>
                  <SelectItem value="Harian">Per Hari</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Nominal Gaji</Label>
              <p className="text-sm text-gray-500 mb-2">
                Jika nominal gaji sudah pasti maka masukkan nominal yang sama untuk gaji minimal dan maksimal.
              </p>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">Rp</span>
                <Input
                  placeholder="Masukkan nominal gaji minimal"
                  type="number"
                  className="w-full"
                  value={form.salaryMin}
                  onChange={(e) => handleChange("salaryMin", e.target.value)}
                />
                <span>-</span>
                <Input
                  placeholder="Masukkan nominal gaji maksimal"
                  type="number"
                  className="w-full"
                  value={form.salaryMax}
                  onChange={(e) => handleChange("salaryMax", e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-4">
            <Button 
                type="button" 
                variant="outline"
                onClick={() => router.back()}
              >
                Kembali
              </Button>
              <div className="flex gap-3">
                <Button type="button" variant="outline">
                  Simpan Draft
                </Button>
                <Button 
                  type="button" 
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={handleNextStep}
                >
                  Selanjutnya
                </Button>
              </div>        
            </div>
          </>
        ) : (
          <>
            <div>
              <Label className="mb-2 block">Kualifikasi</Label>
              <RichTextEditor
                value={form.qualifications}
                onChange={(value) => handleChange("qualifications", value)}
                placeholder="Tuliskan kualifikasi pekerjaan"
              />
            </div>

            <div>
              <Label className="mb-2 block">Tanggung Jawab</Label>
              <RichTextEditor
                value={form.responsibilities}
                onChange={(value) => handleChange("responsibilities", value)}
                placeholder="Tuliskan tanggung jawab pekerjaan"
              />
            </div>

            <div>
              <Label className="mb-2 block">Fasilitas</Label>
              <RichTextEditor
                value={form.facilities}
                onChange={(value) => handleChange("facilities", value)}
                placeholder="Tuliskan fasilitas perusahaan"
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={handlePrevStep}
              >
                Kembali
              </Button>
              <div className="flex gap-3">
                <Button type="button" variant="outline">
                  Simpan Draft
                </Button>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                  Unggah
                </Button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default NewLoker;
