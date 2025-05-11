import NavbarApplicant from "@/components/navbar/NavbarApplicant";
import Hero from "@/components/landing-applicant/Hero";
import Description from "@/components/landing-applicant/Description";
import Footer from "@/components/footer/Footer";

const page = () => {
  return (
    <div className="min-h-screen">
      <NavbarApplicant />
      <Hero />
      <Description />
      <Footer />
    </div>
  )
}

export default page
