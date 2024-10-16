import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard-layout")({
  beforeLoad: ({ context: { accessToken }, location }) => {
    if (!accessToken) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
