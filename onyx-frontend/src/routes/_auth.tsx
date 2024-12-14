import { getAccessToken } from "@/store/auth/authStore";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      throw redirect({
        to: "/budget",
      });
    }
  },
});
