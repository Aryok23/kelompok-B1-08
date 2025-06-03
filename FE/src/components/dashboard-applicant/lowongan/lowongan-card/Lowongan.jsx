import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const Lowongan = ({ id, title, company, location, posted }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/dashboard/lowongan/${id}`);
  };
  const renderIcon = () => {
    if (iconType === 'saved') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18l-7-4-7 4V3z" />
        </svg>
      );
    } else if (iconType === 'bookmark') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
        </svg>
      );
    }
    return null;
  };
  

  return (
    <div 
     onClick={handleClick}
    className="border border-gray-300 rounded-lg p-4 w-full flex justify-between items-start">
      <div>
        <Link
        href={`/dashboard/lowongan/${id-1}`}
        className="text-[#05192D] font-bold text-[24px] relative hover:underline transition-all duration-300"
        >
          {title}
        </Link>
        <p className="text-[#05192D] mt-1 text-[20px]">{company}</p>
        <p className="text-[#05192D] mt-1 text-[16px]">{location}</p>
        <p className="text-gray-400 text-[8px]] mt-3">{posted}</p>
      </div>
      <div className="flex flex-col items-end justify-between h-full">
        <div className="w-[80px] h-[80px] bg-gray-200 rounded-sm" />
        <button className="mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Lowongan;
