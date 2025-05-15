import React from 'react'
import Navbar from '@/components/dashboard-company/navbar/Navbar'
import NewLoker from '@/components/dashboard-company/lowongan/new-loker/NewLoker'

const page = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <NewLoker />
    </div>
  )
}

export default page
