import React, {Suspense} from 'react'
import Aktivitas from '@/components/dashboard-applicant/lowongan/aktivitas/Aktivitas'
import Navbar from '@/components/dashboard-applicant/navbar/Navbar'

const page = () => {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Aktivitas />
      </Suspense>
    </div>
  )
}

export default page
