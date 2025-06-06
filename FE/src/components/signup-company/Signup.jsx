"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from "next/navigation"
import axios from 'axios' 

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const Signup = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSignup = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/register`, {
        email,
        password,
        role_users: "recruiter", // otomatis sebagai kandidat
      })

      setSuccess("Pendaftaran berhasil! Silakan cek email untuk verifikasi.")
      setTimeout(() => router.push("/login"), 2000)
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || "Terjadi kesalahan saat mendaftar."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-[100px]">
      <div 
        className="relative w-[129px] h-[31px] cursor-pointer ml-[50px] mt-[30px]"
        onClick={() => router.push("/company")}>
        <Image src="/logonavbar.png" alt="logo_navbar" fill className="object-contain" />
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
            <button 
              className="flex items-center justify-center bg-[#03FE62] border-[2px] border-[#B3B3B3] rounded-[5px] w-[525px] h-[50px] font-semibold font-outfit text-[#05192D] text-[20px] mt-[24px]"
              onClick={() => router.push("/company/login")}>
              Daftar
            </button>           
          </div>
        </div>
        <div className="flex items-center justify-center w-[615px] h-[66px] border-[2px] border-[#D9D9D9] rounded-[10px] font-outfit text-[20px] mt-[24px]">
          <span>Sudah memiliki akun?&nbsp;</span>
          <Link href="/company/login" className="underline text-blue-600 hover:text-blue-800">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
