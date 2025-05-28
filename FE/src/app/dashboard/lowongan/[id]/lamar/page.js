import React from "react";
import Lamar from "@/components/lamar/Lamar";
import Navbar from "@/components/dashboard-applicant/navbar/Navbar";

const page = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Lamar />
    </div>
  );
};

export default page;
