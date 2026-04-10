import Home from "@/components/sections/Home/Home";
import Services from "@/components/sections/Services/Services";
import Projects from "@/components/sections/Projects/Projects";
import About from "@/components/sections/About/About";
import Pricing from "@/components/sections/Pricing/Pricing";
import Testimonials from "@/components/sections/Testimonials/Testimonials";
import Contact from "@/components/sections/Contact/Contact";

export default function HomePage() {
  return (
    <>
      <Home />
      <Services />
      <Projects />
      <About />
      <Pricing />
      <Testimonials />
      <Contact />
    </>
  );
}
