"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function EditProfile() {
  const [firstName, setFirstName] = useState("Fahrin");
  const [lastName, setLastName] = useState("Ulya");
  const [address, setAddress] = useState("Kabupaten Sleman, DIY");
  const [phone, setPhone] = useState("8123456789");


  const router = useRouter();
  // const searchParams = useSearchParams();
  // const from = searchParams.get("from") || "profile";

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profil berhasil diperbarui!");
    router.back(); 
    //router.push(from === "lamar" ? "/lamar" : "/profile");
  };

  return (
    <main className="max-w-2xl mx-auto mt-10 px-4 pb-24">
      <h1 className="text-xl font-semibold mb-6">Edit Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="border rounded-lg p-6 bg-white shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nama Depan</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Nama Belakang</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Alamat</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Nomor Telepon</label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">+62</span>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <Button 
          type="submit" 
          className="bg-green-400 hover:bg-green-500 text-black"
          >
            Simpan
          </Button>
        </div>
      </form>
    </main>
  );
}
