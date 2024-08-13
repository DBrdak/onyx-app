import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "@/components/ui/toaster";
import { Auth } from "@/contexts/AuthContext";

interface RouterContext {
  queryClient: QueryClient;
  auth: Auth;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </>
  ),
});
