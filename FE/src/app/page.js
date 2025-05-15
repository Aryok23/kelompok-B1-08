import NavbarApplicant from "@/components/navbar/NavbarApplicant";
import Hero from "@/components/landing-applicant/Hero";
import Description from "@/components/landing-applicant/Description";

const page = () => {
  return (
    <div className="min-h-screen">
      <NavbarApplicant />
      <Hero />
      <Description />
    </div>
  )
}

export default page
