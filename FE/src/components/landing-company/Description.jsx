"use client"

import React from 'react'
import Image from "next/image";
import { useRouter } from "next/navigation";

const description = () => {
  const router = useRouter();
  return (
    <div className="bg-[#F7F7FC] h-[2945px] px-[180px] pt-[70px]">
      <div className="flex flex-col gap-y-[65px]">
        <div className="flex flex-row gap-x-[130px] justify-center">
          <div className="flex flex-col w-[615px] h-[327px] gap-y-[30px]">
            <div className="text-[#05192D] font-bold font-outfit text-5xl leading-[60px]">
              Proses Rekrutmen Jadi Lebih Mudah
            </div>
            <div className="text-[#05192D] font-roboto text-xl">
              InfoLoker membantu perusahaan Anda menemukan kandidat terbaik tanpa harus meninjau ratusan resume secara manual dalam proses rekrutmen dengan teknologi Resume Parser AI
            </div>
            <button 
              className="bg-[#03FE62] font-outfit font-semibold text-xl text-[#05192D] w-[285px] h-[50px] rounded-[10px] hover:bg-[#03EF62] transition-all duration-300 ease-in-out"
              onClick={() => router.push("/company/register")}
              >
              Daftarkan Perusahaan Anda
            </button>
          </div>
          <div className="bg-[#D9D9D9] w-[435px] h-[327px] rounded-[10px]">

          </div>
        </div>
        <div className="bg-[#D9D9D9] h-[3.5px]">

        </div>
        <div className="flex flex-col gap-y-[70px]">
          <div className="flex font-bold font-outfit text-[#05192D] text-4xl justify-center">
            Dapatkan Kandidat Terbaik dengan Mudah
          </div>
          <div className="flex flex-row justify-center gap-x-[20px]">
            <div className="relative w-[255px] h-[384px]">
              <Image src="/langkahCompany1.png" alt="step1" fill className="rounded-md object-cover" />
              <div className="absolute inset-0 flex flex-col justify-center items-center gap-y-[15px] mt-[130px]">
                <div className="font-roboto font-semibold text-2xl text-center w-[200px]">
                  Buat Lowongan Pekerjaan
                </div>
                <div className="font-roboto text-xl text-center w-[200px]">
                  Buat lowongan pekerjaan dan definisikan kriteria kandidat
                </div>
              </div>
            </div>
            <div className="relative w-[255px] h-[384px]">
              <Image src="/langkahCompany2.png" alt="step2" fill className="rounded-md object-cover" />
              <div className="absolute inset-0 flex flex-col justify-center items-center gap-y-[15px] mt-[80px]">
                <div className="font-roboto font-semibold text-2xl text-center w-[162px]">
                  Kandidat Melamar
                </div>
                <div className="font-roboto text-xl text-center w-[195px]">
                  Kandidat mengunggah resume
                </div>
              </div>
            </div>
            <div className="relative w-[255px] h-[384px]">
              <Image src="/langkahCompany3.png" alt="step3" fill className="rounded-md object-cover" />
              <div className="absolute inset-0 flex flex-col justify-center items-center gap-y-[15px] mt-[130px]">
                <div className="font-roboto font-semibold text-2xl text-center w-[152px]">
                  Resume Parsing
                </div>
                <div className="font-roboto text-xl text-center w-[205px]">
                  AI membaca, mengekstrak, dan memberi skor pada tiap resume
                </div>
              </div>
            </div><div className="relative w-[255px] h-[384px]">
              <Image src="/langkahCompany4.png" alt="step4" fill className="rounded-md object-cover" />
              <div className="absolute inset-0 flex flex-col justify-center items-center gap-y-[15px] mt-[130px]">
                <div className="font-roboto font-semibold text-2xl text-center w-[182px]">
                  Terima Rekomendasi
                </div>
                <div className="font-roboto text-xl text-center w-[200px]">
                  Dapatkan daftar kandidat paling relevan berdasarkan skor kecocokan.
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button 
              className="bg-[#03FE62] font-outfit font-semibold text-xl text-[#05192D] w-[185px] h-[50px] rounded-[10px] hover:bg-[#03EF62] transition-all duration-300 ease-in-out"
              onClick={() => router.push("/company/login")}>
              Buat Lowongan
            </button>
          </div>       
        </div>
        <div className="bg-[#D9D9D9] h-[3.5px]">

        </div> 
      </div>
      <div className="flex flex-col gap-y-[70px] mt-[80px]">
        <div className="flex font-bold font-outfit text-[#05192D] text-4xl justify-center">
          Kenapa Harus Info Loker?
        </div>
        <div className="flex flex-col h-[1086px] -mx-[180px]">
          <div className="flex flex-row justify-center items-center h-[362px] bg-[#FCCE0D] px-[188px] gap-x-[111px] font-roboto">
            <div className="w-[435px] h-[232px] bg-[#D9D9D9] rounded-[10px]">

            </div>
            <div className="flex flex-col gap-y-[30px] w-[534px]">
              <div className="font-semibold text-[35px] leading-[40px]">
                Lihat Hasil Parsing Resume Setiap Kandidat
              </div>
              <div className="font-regular text-[23px]">
                Info Loker menyediakan hasil parsing setiap resume kandidat yang dapat dilihat oleh rekruiter
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center h-[362px] bg-[#FF80B4] px-[188px] gap-x-[111px] font-roboto">
            <div className="flex flex-col gap-y-[30px] w-[534px]">
              <div className="font-semibold text-[35px] leading-[40px]">
                Skor Kecocokan berdasarkan Relevansi, Bukan Keyword
              </div>
              <div className="font-regular text-[23px]">
                Info Loker menilai kesesuaian kandidat berdasarkan konteks pengalaman dan keahlian, bukan sekadar pencocokan kata.
              </div>
            </div>
            <div className="w-[435px] h-[232px] bg-[#D9D9D9] rounded-[10px]">

            </div>
          </div>
          <div className="flex flex-row justify-center items-center h-[362px] bg-[#5EB1FF] px-[188px] gap-x-[111px] font-roboto">
            <div className="w-[435px] h-[232px] bg-[#D9D9D9] rounded-[10px]">

            </div>
            <div className="flex flex-col gap-y-[30px] w-[534px]">
              <div className="font-semibold text-[35px] leading-[40px]">
                Dapatkan Rekomendasi Kandidat
              </div>
              <div className="font-regular text-[23px]">
                Info Loker mempermudah proses penyaringan resume dengan memberikan Anda rekomendasi kandidat secara otomatis untuk setiap lowongan berdasarkan skor kecocokan tertinggi
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col h-[222px] gap-y-[21px] justify-center items-center border-[#B3B3B3] border-[2px] rounded-[10px] shadow-[0_0.52vw_1.56vw_0_rgba(0,0,0,0.15)]">
          <div className="flex font-bold font-outfit text-[#05192D] text-4xl justify-center">
            Mulai Proses Rekrutmen dengan Info Loker
          </div>
          <div className="flex justify-center items-center">
            <button 
              className="bg-[#03FE62] font-outfit font-semibold text-xl text-[#05192D] w-[185px] h-[50px] rounded-[10px] hover:bg-[#03EF62] transition-all duration-300 ease-in-out"
              onClick={() => router.push("/company/login")}>
              Buat Lowongan
            </button>
          </div>  
        </div>
      </div>
    </div>
  )
}

export default description
