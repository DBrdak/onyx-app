import { createFileRoute } from "@tanstack/react-router";

import Hero from "@/components/home/Hero";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Cta from "@/components/home/Cta";
import Services from "@/components/home/Services";

export const Route = createFileRoute("/_home-layout")({
  component: () => (
    <div className="max-w-1440px lg:max-w-1440px h-auto mx-auto overflow-hidden bg-background md:w-full xl:w-1440px">
      <Navbar />
      <Hero />
      <Services />
      <Cta />
      <Footer />
    </div>
  ),
});
