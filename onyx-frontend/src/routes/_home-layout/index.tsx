import { createFileRoute } from "@tanstack/react-router";
import Pricing from "@/components/home/Pricing";
import About from "@/components/home/About";
import LatestNews from "@/components/home/LatestNews";
import Services from "@/components/home/Services";
import Cta from "@/components/home/Cta";
import Hero from "@/components/home/Hero";
import Footer from "@/components/home/Footer";

export const Route = createFileRoute("/_home-layout/")({
  component: () => (
    <div className="max-w-1440px lg:max-w-1440px mx-auto h-auto overflow-hidden bg-background md:w-full xl:w-1440px">
      <Hero />
      <Services />
      <About />
      <Cta />
      <LatestNews />
      <Pricing />
      <Footer />
    </div>
  ),
});
