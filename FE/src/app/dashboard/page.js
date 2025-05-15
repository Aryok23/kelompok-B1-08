import React from 'react'
import Navbar from "@/components/dashboard-applicant/navbar/Navbar"
import Foryou from "@/components/dashboard-applicant/lowongan/lowongan-foryou/Foryou"
import Sent from '@/components/dashboard-applicant/lowongan/lowongan-terkirim/Sent'
import Saved from '@/components/dashboard-applicant/lowongan/lowongan-tersimpan/Saved'

const page = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-row px-[200px] justify-between">
        <Foryou />
        <div className="flex flex-col">
          <Sent />
          <Saved />
        </div>
      </div>
    </div>
  )
}

export default page
