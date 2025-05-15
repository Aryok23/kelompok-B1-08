"use client"

import React from 'react'
import Image from "next/image";
import { useRouter } from "next/navigation";

const description = () => {
  const router = useRouter();
  return (
    <div className="bg-[#F7F7FC] h-[1045px] px-[180px] pt-[70px]">
      <div className="flex flex-col gap-y-[65px]">
        <div className="flex flex-row gap-x-[130px] justify-center">
          <div className="flex flex-col w-[615px] h-[327px] gap-y-[30px]">
            <div className="text-[#05192D] font-bold font-outfit text-5xl leading-[60px]">
              Temukan Pekerjaan Sesuai Keahlian Kamu
            </div>
            <div className="text-[#05192D] font-roboto text-xl">
              Info Loker memastikan keahlian dan pengalaman kerjamu dipertimbangkan karena AI resume parser kami mencocokkan isi resume kamu dengan deskripsi pekerjaan secara kontekstual.
            </div>
            <button 
              className="bg-[#03FE62] font-outfit font-semibold text-xl text-[#05192D] w-[175px] h-[50px] rounded-[10px] hover:bg-[#03EF62] transition-all duration-300 ease-in-out"
              onClick={() => router.push("/login")}>
              Cari Lowongan
            </button>
          </div>
          <div className="bg-[#D9D9D9] w-[435px] h-[327px] rounded-[10px]">

          </div>
        </div>
        <div className="bg-[#D9D9D9] h-[4px]">

        </div>
        <div className="flex flex-col gap-y-[90px]">
          <div className="flex font-bold font-outfit text-[#05192D] text-4xl justify-center">
            Lamar Pekerjaan dengan Mudah
          </div>
          <div className="flex flex-row justify-center gap-x-[25px]">
            <div className="relative w-[320px] h-[259px]">
              <Image src="/yellow.png" alt="step1" fill className="rounded-md object-cover" />
              <div className="absolute inset-0 flex flex-col justify-center items-center gap-y-[15px]">
                <div className="font-roboto font-semibold text-[#05192D] text-2xl text-center w-[152px]">
                  Pilih Lowongan
                </div>
                <div className="font-roboto text-xl text-[#05192D] text-center w-[265px]">
                  Telusuri berbagai lowongan yang tersedia
                </div>
              </div>
            </div>
            <div className="relative w-[320px] h-[259px]">
              <Image src="/pink.png" alt="step2" fill className="rounded-md object-cover" />
              <div className="absolute inset-0 flex flex-col justify-center items-center gap-y-[15px]">
                <div className="font-roboto font-semibold text-[#05192D] text-2xl text-center w-[162px]">
                  Unggah Resume
                </div>
                <div className="font-roboto text-[#05192D] text-xl text-center w-[265px]">
                  Unggah resume terbaikmu dan sistem akan memahami isi resume-mu
                </div>
              </div>
            </div>
            <div className="relative w-[320px] h-[259px]">
              <Image src="/blue.png" alt="step3" fill className="rounded-md object-cover" />
              <div className="absolute inset-0 flex flex-col justify-center items-center gap-y-[15px]">
                <div className="font-roboto font-semibold text-[#05192D] text-2xl text-center w-[182px]">
                  Jawab Pertanyaan
                </div>
                <div className="font-roboto text-[#05192D] text-xl text-center w-[265px]">
                  Jawab pertanyaan dari rekruiter 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default description
