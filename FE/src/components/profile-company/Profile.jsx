"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();

  const handleEdit = () => {
    router.push("profile/edit-profile");
    //router.push("profile/edit-profile?from=profile");
  };

  return (
    <main className="max-w-3xl mx-auto pt-[100px] px-4 pb-24">
      {/* <p className="text-sm text-gray-400 mb-8">
        Lowongan / Deskripsi / <span className="text-black font-medium">Profile</span>
      </p> */}

      <h1 className="text-lg font-semibold mb-8">Data Pelamar</h1>

      <div className="border rounded-lg p-4 mb-6 mt-4 max-w-md w-full">
        <h2 className="font-semibold text-gray-800 mb-2">PT. Maju Mundur</h2>
        <p className="text-sm text-gray-600">📍 Kabupaten Sleman, DIY</p>
        <p className="text-sm text-gray-600">📞 +62 85727577715</p>
        <p className="text-sm text-gray-600">✉️ majumundur@gmail.com</p>
        <Button
          onClick={handleEdit}
          variant="outline"
          className="mt-3 text-green-500 border-green-500 hover:bg-green-50"
        >
          Edit
        </Button>
      </div>
    </main>
  );
}
