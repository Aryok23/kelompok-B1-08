"use client"

import React from 'react'
import Link from 'next/link'

const Signup = () => {
  return (
    <div className="mb-[100px]">
      <div>
        logo
      </div>
      <div className="flex flex-col items-center mt-[100px]">
        <div>
          <div className="flex flex-row justify-end items-end mb-[10px]">
            <Link
              className="font-outfit underline text-[20px]"
              href="/">
              Anda mencari pekerjaan?
            </Link>
          </div>   
          <div className="flex flex-col justify-center items-center w-[615px] h-[506px] border-[2px] border-[#D9D9D9] rounded-[10px]">
            <div className="font-semibold font-outfit text-[40px]">
              Sign Up
            </div>
            <div className="flex flex-col gap-y-[8px]">
              <div className="font-semibold font-outfit text-[20px]"> 
                Email
              </div>
              <input 
                className="border-[2px] border-[#B3B3B3] rounded-[5px] w-[525px] h-[50px] font-roboto text-[#05192D] text-[20px] focus:outline-none pl-[11px] pr-[11px]"  
                placeholder="Email" 
              />
            </div>
            <div className="flex flex-col gap-y-[8px] mt-[12px]">
              <div className="font-semibold font-outfit text-[20px]"> 
                Password
              </div>
              <input 
                type="password"
                className="border-[2px] border-[#B3B3B3] rounded-[5px] w-[525px] h-[50px] font-roboto text-[#05192D] text-[20px] focus:outline-none pl-[11px] pr-[11px]"  
                placeholder="Password" 
              />
            </div>
            <button className="flex items-center justify-center bg-[#03FE62] border-[2px] border-[#B3B3B3] rounded-[5px] w-[525px] h-[50px] font-semibold font-outfit text-[#05192D] text-[20px] mt-[24px]">
              Daftar
            </button>           
          </div>
        </div>
        <div className="flex items-center justify-center w-[615px] h-[66px] border-[2px] border-[#D9D9D9] rounded-[10px] font-outfit text-[20px] mt-[24px]">
          <span>Sudah memiliki akun?&nbsp;</span>
          <Link href="/login" className="underline text-blue-600 hover:text-blue-800">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
