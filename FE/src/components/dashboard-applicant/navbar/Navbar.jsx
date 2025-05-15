"use client"

import React from 'react'
import Image from 'next/image'

const Navbar = () => {
  return (
    <div className="flex justify-center items-center fixed w-full h-[72px] bg-white font-outfit z-50 border-b-2 px-6">
      <div className="text-[#05192D] text-[20px] font-semibold">
        Logo
      </div>
      <div className="mx-[172px] w-[435px]">
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-[40px] px-4 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex flex-row items-center gap-x-[10px]">
        <div className="text-[18px]">Hi, user</div>
        <button>
          <div className="w-[40px] h-[40px] relative">
            <Image src="/profile.png" alt="profile" fill className="object-contain rounded-full" />
          </div>
        </button>     
      </div>
    </div>

  )
}

export default Navbar
