"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // <- ini hook Next.js App Router
import Lowongan from '@/components/dashboard-applicant/lowongan/lowongan-card/Lowongan';
import jobSave from '@/data/jobSave';
import jobSent from '@/data/jobSent';
import Image from 'next/image';

const Aktivitas = () => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState('saved');

  useEffect(() => {
    if (tabParam === 'sent' || tabParam === 'saved') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const savedData = jobSave.slice(0, 2);
  const sentData = jobSent.slice(0, 2);

  return (
    <div className="pt-[120px] pb-[100px] px-4 min-h-screen max-w-2xl mx-auto font-roboto">
      <h1 className="text-3xl font-bold text-[#05192D] mb-6">Aktivitas</h1>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-8">
        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-2 flex items-center gap-2 border-b-2 ${
            activeTab === 'saved' ? 'border-[#05192D] text-[#05192D]' : 'border-transparent text-gray-400'
          } font-medium`}
        >
          <div className="relative w-[30px] h-[30px]" >
                    <Image 
                      src="/saved.png" 
                      alt="search" 
                      fill 
                      className="object-contain" 
                    />
                  </div>
          Tersimpan
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`pb-2 flex items-center gap-2 border-b-2 ${
            activeTab === 'sent' ? 'border-[#05192D] text-[#05192D]' : 'border-transparent text-gray-400'
          } font-medium`}
        >
         <div className="relative w-[30px] h-[30px]" >
                   <Image 
                     src="/sent.png" 
                     alt="search" 
                     fill 
                     className="object-contain" 
                   />
                 </div>
          Lamaran
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4 w-[640px]">
        {activeTab === 'saved' &&
          savedData.map((item) => (
            <Lowongan
              key={item.id}
              id={item.id}
              title={item.title}
              company={item.company}
              location={item.location}
              posted={item.posted}
              iconType="saved"
            />
          ))}

        {activeTab === 'sent' &&
          sentData.map((item) => (
            <Lowongan
              key={item.id}
              id={item.id}
              title={item.title}
              company={item.company}
              location={item.location}
              posted={item.posted}
              iconType="none"
            />
          ))}
      </div>
    </div>
  );
};

export default Aktivitas;
