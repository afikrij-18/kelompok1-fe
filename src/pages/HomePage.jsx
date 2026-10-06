import Navbar from "../components/ui/Navbar";
import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import WhyUs from "../components/home/WhyUs";
import BookingSteps from "../components/home/BookingSteps";
import Tracking from "../components/home/Tracking";
import Testimonials from "../components/home/Testimonial";
import FinalCTA from "../components/home/FinalCTA";
import Footer from "../components/ui/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5faff] text-[#001e2c] antialiased">
      <Navbar />
      <Hero />
      <Services />
      <WhyUs />
      <BookingSteps />
      <Tracking />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}
