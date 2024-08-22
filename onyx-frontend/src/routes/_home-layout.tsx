import { createFileRoute, Outlet } from "@tanstack/react-router";
import Navbar from "@/components/home/Navbar";

export const Route = createFileRoute("/_home-layout")({
  component: () => (
    <div className="mx-auto max-w-[1440px] bg-background">
      <Navbar />
      <Outlet />
    </div>
  ),
});
