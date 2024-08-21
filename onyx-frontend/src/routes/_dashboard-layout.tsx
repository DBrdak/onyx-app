import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard-layout")({
  beforeLoad: ({ context: { auth } }) => {
    if (!auth.accessToken && !auth.isLoading) {
      throw redirect({
        to: "/login",
      });
    }
  },
});
