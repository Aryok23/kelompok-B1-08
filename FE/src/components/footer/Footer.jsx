import React from 'react'
import Link from "next/link"
import Image from 'next/image'

export default function Footer() {
  return (
    <div className="flex flex-row items-center gap-x-[105px] bg-gradient-to-r from-[#03FE62] to-[#5EB1FF] h-[316px] px-[200px] text-[#05192D]">
      <div className="relative w-[315px] h-[137px]">
        <Image src="/logoloker.png" alt="Google logo" fill className="object-contain" />
      </div>
      <div className="flex flex-row gap-x-[105px]">
        <div className="flex flex-col gap-y-[28px]">
          <div className="font-outfit font-semibold text-xl">
            Solutions for Recruiter
          </div>
          <div className="flex flex-col gap-y-[9px] font-roboto text-lg">
            <Link
              href="/company"
              className="relative hover:underline transition-all duration-300">
              Buat Lowongan
            </Link>
            <Link
              href="/company"
              className="relative hover:underline transition-all duration-300">
              Kelola Lowongan
            </Link>
            <Link
              href="/company"
              className="relative hover:underline transition-all duration-300">
              Rekomendasi Kandidat
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-y-[28px]">
          <div className="font-outfit font-semibold text-xl">
            Solutions for Candidate
          </div>
          <div className="flex flex-col gap-y-[9px] font-roboto text-lg">
            <Link
              href="/"
              className="relative hover:underline transition-all duration-300">
              Unggah Resume
            </Link>
            <Link
              href="/"
              className="relative hover:underline transition-all duration-300">
              Kelola Resume
            </Link>
            <Link
              href="/"
              className="relative hover:underline transition-all duration-300">
              Skor Resume
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-y-[28px]">
          <div className="font-outfit font-semibold text-xl">
            About
          </div>
          <div className="flex flex-col gap-y-[9px] font-roboto text-lg">
            <Link
              href="/"
              className="relative hover:underline transition-all duration-300">
              Team
            </Link>
            <Link
              href="/"
              className="relative hover:underline transition-all duration-300">
              Contact us
            </Link>
          </div>
        </div>
        </div>
    </div>
  )
}
