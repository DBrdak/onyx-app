import { createFileRoute, redirect } from "@tanstack/react-router";

import { getAccessToken, getIsInitialized } from "@/store/auth/authStore";

export const Route = createFileRoute("/_dashboard-layout")({
  beforeLoad: ({ location }) => {
    const accessToken = getAccessToken();
    const isInitialized = getIsInitialized();
    if (!accessToken && isInitialized) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
