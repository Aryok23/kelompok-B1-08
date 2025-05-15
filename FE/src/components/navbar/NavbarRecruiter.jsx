"use client"

import { useRouter } from "next/navigation";
import Image from "next/image";

const NavbarRecruiter = () => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center fixed w-full h-[72px] bg-white font-outfit z-50 border-b-[1.5px] border-gray-300">
      <div className="flex flex-row gap-x-[700px]">
        <div 
          className="relative w-[129px] h-[31px] cursor-pointer"
          onClick={() => router.push("/")}>
          <Image src="/logonavbar.png" alt="logo_navbar" fill className="object-contain" />
        </div>
        <div className="flex flex-row gap-x-[35px] text-lg">
          <div
            className="flex justify-center items-center text-[#05192D] cursor-pointer hover:underline"
            onClick={() =>  router.push("/company/register")}
          >
            Sign Up
          </div>
          <div 
            className="flex justify-center items-center text-[#05192D] cursor-pointer hover:underline"
            onClick={() =>  router.push("/company/login")}
          >
            Login
          </div>
          <div 
            className="flex justify-center items-center text-[#05192D] cursor-pointer hover:bg-[#03FE62] transition-all duration-200 border-[2px] border-[#03FE62] rounded-[10px] px-[10px] h-[38px]"
            onClick={() =>  router.push("/")}
          >
            Cari Lowongan
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavbarRecruiter
