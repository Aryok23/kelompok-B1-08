"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Menutup dropdown saat klik di luar area dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-center items-center fixed w-full h-[72px] bg-white font-outfit z-50 border-b-2 px-6">
      <div 
        className="relative w-[129px] h-[31px] cursor-pointer"
        onClick={() => router.push("/company/dashboard")}>
        <Image src="/logonavbar.png" alt="logo_navbar" fill className="object-contain" />
      </div>

      {/* Search */}
      <div className="mx-[172px] w-[435px]">
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-[40px] px-4 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* User Profile Section */}
      <div className="flex items-center gap-x-3 relative" ref={dropdownRef}>
        <div className="text-[18px]">Hi, PT Maju Jaya</div>

        {/* Button with profile & arrow */}
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-1"
        >
          <div className="w-[40px] h-[40px] relative">
            <Image
              src="/profile.png"
              alt="profile"
              fill
              className="object-contain rounded-full"
            />
          </div>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute top-[60px] right-0 bg-white border rounded shadow-md w-[150px] py-2 z-50">
            <Link href="/company/dashboard/profile">
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</div>
            </Link>
            {/* <Link href="/aktivitas">
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Aktivitas</div>
            </Link> */}
            <button 
              className="w-full text-left text-red-600 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => router.push("/company")}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
