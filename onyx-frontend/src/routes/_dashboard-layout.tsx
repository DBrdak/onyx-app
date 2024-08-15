import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard-layout")({
  beforeLoad: ({ context: { auth } }) => {
    if (!auth.accessToken && !auth.isLoading) {
      console.log(auth);
      throw redirect({
        to: "/login",
      });
    }
  },
});
