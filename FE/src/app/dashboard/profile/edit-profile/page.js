import React from "react";
import EditProfile from "@/components/profile-applicant/EditProfile";
import Navbar from "@/components/dashboard-applicant/navbar/Navbar";

const page = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <EditProfile />
    </div>
  );
};

export default page;
