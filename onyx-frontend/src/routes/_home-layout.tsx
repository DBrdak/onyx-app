import { createFileRoute, Outlet } from "@tanstack/react-router";
import Navbar from "@/components/home/Navbar";

export const Route = createFileRoute("/_home-layout")({
  component: () => (
    <div className="max-w-1440px lg:max-w-1440px mx-auto h-auto overflow-hidden bg-background md:w-full xl:w-1440px">
      <Navbar />
      <Outlet />
    </div>
  ),
});
