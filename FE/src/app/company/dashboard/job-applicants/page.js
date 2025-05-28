import React from 'react';
import Navbar from '@/components/dashboard-company/navbar/Navbar'
import DetailLoker from '@/components/dashboard-company/dashboard/detail/DetailLoker';

const Page = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <DetailLoker />
    </div>
  );
};

export default Page;
