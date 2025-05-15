import React from 'react'
import Navbar from '@/components/dashboard-company/navbar/Navbar'
import Dashboard from '@/components/dashboard-company/dashboard/Dashboard'

const page = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Dashboard />
    </div>
  )
}

export default page
