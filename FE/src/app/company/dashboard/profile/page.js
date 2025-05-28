import React from "react";
import Profile from "@/components/profile-company/Profile";
import Navbar from "@/components/dashboard-company/navbar/Navbar";

const page = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Profile />
    </div>
  );
};

export default page;
