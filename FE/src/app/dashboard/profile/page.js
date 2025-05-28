import React from "react";
import Profile from "@/components/profile-applicant/Profile";
import Navbar from "@/components/dashboard-applicant/navbar/Navbar";

const page = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Profile />
    </div>
  );
};

export default page;
