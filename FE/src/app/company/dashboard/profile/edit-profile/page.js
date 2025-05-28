import React from "react";
import EditProfile from "@/components/profile-company/EditProfile";
import Navbar from "@/components/dashboard-company/navbar/Navbar";

const page = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <EditProfile />
    </div>
  );
};

export default page;
