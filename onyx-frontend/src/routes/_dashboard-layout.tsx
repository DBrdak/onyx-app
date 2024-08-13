import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard-layout")({
  beforeLoad: ({ context: { auth } }) => {
    console.log(auth);
    if (!auth.isAuthenticated && !auth.isRefreshingToken) {
      throw redirect({
        to: "/login",
      });
    }
  },
});
