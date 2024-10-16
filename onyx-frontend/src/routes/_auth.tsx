import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context: { accessToken } }) => {
    if (accessToken) {
      throw redirect({
        to: "/budget",
      });
    }
  },
});
