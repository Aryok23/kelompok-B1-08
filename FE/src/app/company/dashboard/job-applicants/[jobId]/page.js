import React from 'react'
import DetailLoker from '@/components/dashboard-applicant/lowongan/detail/DetailLoker'

const page = ({params}) => {
  return (
    <div className="min-h-screen">
      <DetailLoker params={params} />
    </div>
  )
}

export default page
