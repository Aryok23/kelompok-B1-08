"use client"

import { signIn } from "next-auth/react"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from "next/navigation"
import axios from 'axios'
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL 
const Login = () => {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password
      })

      const token = response.data.token
      localStorage.setItem("token", token)
      router.push("/dashboard")
    } catch (error) {
      alert("Login gagal: " + (error.response?.data || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setLoading(true)
    signIn("google")
  }

  return (
    <div className="mb-[100px]">
      <div
        className="relative w-[129px] h-[31px] cursor-pointer ml-[50px] mt-[30px]"
        onClick={() => router.push("/")}
      >
        <Image src="/logonavbar.png" alt="logo_navbar" fill className="object-contain" />
      </div>

      <div className="flex flex-col items-center mt-[100px]">
        <div>
          <div className="flex flex-row justify-end items-end mb-[10px]">
            <Link className="font-outfit underline text-[20px]" href="/company">
              Anda mencari karyawan?
            </Link>
          </div>

          <div className="flex flex-col justify-center items-center w-[615px] h-[606px] border-[2px] border-[#D9D9D9] rounded-[10px]">
            <div className="font-semibold font-outfit text-[40px]">
              Masuk ke Akun Kamu!
            </div>

            <div className="flex flex-col gap-y-[8px]">
              <div className="font-semibold font-outfit text-[20px]">
                Email
              </div>
              <input
                className="border-[2px] border-[#B3B3B3] rounded-[5px] w-[525px] h-[50px] font-roboto text-[#05192D] text-[20px] focus:outline-none pl-[11px] pr-[11px]"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="flex items-center justify-center bg-[#03FE62] border-[2px] border-[#B3B3B3] rounded-[5px] w-[525px] h-[50px] font-semibold font-outfit text-[#05192D] text-[20px] mt-[24px] disabled:opacity-50"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Memproses..." : "Login"}
            </button>

            <div className="text-[20px] font-roboto mt-[24px]">
              atau
            </div>

            <button
              className="flex items-center justify-center pl-4 gap-3 border-[2px] border-[#B3B3B3] rounded-[5px] w-[525px] h-[50px] font-semibold font-outfit text-[#05192D] text-[20px] mt-[24px] disabled:opacity-50"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <div className="w-[24px] h-[24px] relative">
                <Image src="/logo_google.png" alt="Google logo" fill className="object-contain" />
              </div>
              <span>{loading ? "Mengalihkan..." : "Lanjutkan dengan Google"}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center w-[615px] h-[66px] border-[2px] border-[#D9D9D9] rounded-[10px] font-outfit text-[20px] mt-[24px]">
          <span>Belum memiliki akun?&nbsp;</span>
          <Link href="/register" className="underline text-blue-600 hover:text-blue-800">
            Daftar
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
