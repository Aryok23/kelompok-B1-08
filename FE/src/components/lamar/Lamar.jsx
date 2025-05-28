"use client";

import { useState } from "react";
import { Upload, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Lamar() {
  const [resume, setResume] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      alert("Hanya file PDF yang diperbolehkan.");
      return;
    }
    setResume(file);
  };

  const handleRemoveFile = () => {
    setResume(null);
  };

  const handleEditProfile = () => {
    router.push("/profile/edit-profile");
    //router.push("/profile/edit-profile?from=lamar");
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resume) {
      alert("Silakan unggah resume terlebih dahulu.");
      return;
    }
    if (!isAgreed) {
      alert("Silakan setujui Kebijakan Privasi terlebih dahulu.");
      return;
    }
    alert("Lamaran berhasil dikirim!");
  };

  return (
    <div className="max-w-3xl mx-auto pt-[110px] px-4 pb-24">
      {/* <p className="text-sm text-gray-400 mb-6">
        Lowongan / Deskripsi / <span className="text-black font-medium">Kirim Lamaran</span>
      </p> */}

      <h1 className="text-lg font-semibold mb-6">Data Pelamar</h1>
    
      <div className="border rounded-lg p-4 mb-6 mt-4 max-w-md w-full">
        <h2 className="font-semibold text-gray-800 mb-2">Fahrin Ulya</h2>
        <p className="text-sm text-gray-600">📍 Kabupaten Sleman, DIY</p>
        <p className="text-sm text-gray-600">📞 +62 85727577715</p>
        <p className="text-sm text-gray-600">✉️ fahrinulya@gmail.com</p>
        <Button onClick={handleEditProfile} variant="outline" className="mt-3 text-green-500 border-green-500 hover:bg-green-50">
          Edit
        </Button>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-6">Resume</h2>
        <p className="text-sm text-gray-500 mb-2">Unggah resume kamu dalam format file PDF</p>

        {!resume ? (
          <label className="inline-flex items-center gap-2 border border-green-500 px-6 py-2 rounded-lg text-green-500 cursor-pointer hover:bg-green-50 transition-colors">
            <Upload size={14} />
            <span>Unggah</span>
            <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
          </label>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={resume.name}
              className="border px-3 py-1 rounded w-full text-sm"
            />
            <Upload size={20} className="text-green-600" />
            <Trash2
              size={20}
              className="text-red-500 cursor-pointer"
              onClick={handleRemoveFile}
            />
          </div>
        )}
      </div>

      <div className="flex items-start mb-6 text-xs">
        <input
          type="checkbox"
          id="agree"
          className="mr-2 mt-1"
          checked={isAgreed}
          onChange={(e) => setIsAgreed(e.target.checked)}
        />
        <label htmlFor="agree" className="cursor-pointer">
          Dengan mengirim lamaran, Anda setuju dengan{" "}
          <a href="#" className="underline">
            Kebijakan Privasi
          </a>{" "}
          kami
        </label>
      </div>

      <Button
        onClick={handleSubmit}
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white mb-20 transition-colors"
      >
        <Send size={16} />
        Kirim Lamaran
      </Button>
    </div>
  );
}
