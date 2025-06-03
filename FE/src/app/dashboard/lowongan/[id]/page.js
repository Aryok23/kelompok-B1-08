import React from 'react';
import DetailLoker from '@/components/dashboard-applicant/lowongan/detail/page';
import Navbar from '@/components/dashboard-applicant/navbar/Navbar';

const Page = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <DetailLoker />
    </div>
  );
};

export default Page;
