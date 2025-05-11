import NavbarRecruiter from "@/components/navbar/NavbarRecruiter";
import Hero from "@/components/landing-company/Hero";
import Description from "@/components/landing-company/Description";
import Footer from "@/components/footer/Footer";

const page = () => {
  return (
    <div>
      <NavbarRecruiter />
      <Hero />
      <Description />
      <Footer />
    </div>
  )
}

export default page
