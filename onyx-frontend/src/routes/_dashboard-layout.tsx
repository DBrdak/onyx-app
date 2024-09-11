import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard-layout")({
  beforeLoad: ({ context: { auth }, location }) => {
    if (!auth.accessToken) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
