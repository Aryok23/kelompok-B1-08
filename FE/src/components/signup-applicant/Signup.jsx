"use client"
import { signIn } from "next-auth/react"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from "next/navigation"
import axios from 'axios' // ✅ Import axios

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
        role_users: "kandidat", // otomatis sebagai kandidat
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
        onClick={() => router.push("/")}>
        <Image src="/logonavbar.png" alt="logo_navbar" fill className="object-contain" />
      </div>
      <div className="flex flex-col items-center mt-[100px]">
        <div>
          <div className="flex flex-row justify-end items-end mb-[10px]">
            <Link className="font-outfit underline text-[20px]" href="/company">
              Anda mencari karyawan?
            </Link>
          </div>
          <div className="flex flex-col justify-center items-center w-[615px] h-auto border-[2px] border-[#D9D9D9] rounded-[10px] p-[30px]">
            <div className="font-semibold font-outfit text-[40px] mb-[16px]">
              Sign Up
            </div>
            {error && <div className="text-red-600 font-roboto text-[16px] mb-2">{error}</div>}
            {success && <div className="text-green-600 font-roboto text-[16px] mb-2">{success}</div>}
            <div className="flex flex-col gap-y-[8px] w-full">
              <label className="font-semibold font-outfit text-[20px]">Email</label>
              <input 
                className="border-[2px] border-[#B3B3B3] rounded-[5px] h-[50px] font-roboto text-[#05192D] text-[20px] focus:outline-none px-[11px]"  
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-[8px] w-full mt-[12px]">
              <label className="font-semibold font-outfit text-[20px]">Password</label>
              <input 
                type="password"
                className="border-[2px] border-[#B3B3B3] rounded-[5px] h-[50px] font-roboto text-[#05192D] text-[20px] focus:outline-none px-[11px]"  
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              className="flex items-center justify-center bg-[#03FE62] border-[2px] border-[#B3B3B3] rounded-[5px] w-full h-[50px] font-semibold font-outfit text-[#05192D] text-[20px] mt-[24px] disabled:opacity-50"
              onClick={handleSignup}
              disabled={loading}>
              {loading ? "Mendaftarkan..." : "Daftar"}
            </button>
            <div className="text-[20px] font-roboto mt-[24px]">atau</div>
            <button 
              className="flex items-center justify-center pl-4 gap-3 border-[2px] border-[#B3B3B3] rounded-[5px] w-full h-[50px] font-semibold font-outfit text-[#05192D] text-[20px] mt-[24px]"
              onClick={() => signIn("google")}>
              <div className="w-[24px] h-[24px] relative">
                <Image src="/logo_google.png" alt="Google logo" fill className="object-contain" />
              </div>
              <span>Lanjutkan dengan Google</span>
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
