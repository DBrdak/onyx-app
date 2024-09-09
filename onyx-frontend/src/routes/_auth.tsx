import { createFileRoute, redirect } from "@tanstack/react-router";

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
});
