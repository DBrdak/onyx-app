import Navbar from "@/components/home/Navbar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({
    context: {
      auth: { user },
    },
  }) => {
    if (user) {
      throw redirect({
        to: "/budget",
      });
    }
  },
  component: () => (
    <div className="mx-auto min-h-screen max-w-[1440px]">
      <Navbar />
      <div className="pt-20">
        <Outlet />
      </div>
    </div>
  ),
});
