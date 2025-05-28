"use client"

import React from 'react'

import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-[550px] bg-[#5EB1FF] pt-[72px]">
      <div className="flex flex-row gap-x-[12px]">
        <div className="bg-[#D9D9D9] w-[435px] h-[338px] rounded-[10px]">

        </div>
        <div className="flex flex-col w-[615px] h-[338px] bg-[#FFFFFF] justify-center px-[35px] gap-y-[12px] rounded-[10px]">
          <div className="font-semibold text-[#05192D] text-4xl font-outfit">
            Wujudkan Karier Impianmu Sekarang
          </div>
          <div className="mt-[8px] font-semibold text-[#05192D] text-xl font-outfit">
            Masukkan Email
          </div>
          <div className="flex flex-row gap-x-[12px]">
            <input 
              className="border-[1px] border-[#B3B3B3] rounded-[5px] w-[425px] font-roboto text-[#05192D] text-xl focus:outline-none pl-[11px] pr-[11px]"  
              placeholder="Email" 
            />
            <button 
              className="font-outfit text-xl font-semibold bg-[#03FE62] text-[#05192D] h-[45px] w-[100px] rounded-[5px] hover:bg-[#03EF62] transition-all duration-300 ease-in-out"
              onClick={() => router.push("/register")}>
              Daftar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
