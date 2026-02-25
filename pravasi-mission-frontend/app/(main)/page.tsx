// import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Commitment from "@/components/Commitment";
import Stats from "@/components/Stats";
import Schemes from "@/components/Schemes";
import Projects from "@/components/Projects";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <main className="relative">

      <div className="fixed top-4 right-4 z-50">
        
      </div>
      {/* <Navbar /> ith ivde avshyam ila cuz ella page ilum varan we r using layout.tsx*/}
      {/* app/layout.tsx automatically renders across all pages like landing, signup, and login without repeating code. */}
      <Hero/>
      <Commitment/>
      <Stats/>
      <Schemes/>
      <Projects/>
      <CTA/>
      <FAQ/>
      <Footer/>
    </main>
  );
}
