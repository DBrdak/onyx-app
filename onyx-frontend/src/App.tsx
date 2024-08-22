import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuthContext } from "./lib/hooks/useAuthContext";
import { useMemo } from "react";
import DefaultLoadingSpinner from "./components/DefaultLoadingSpinner";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  context: { queryClient, auth: undefined! },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterWithAuth />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;

const RouterWithAuth = () => {
  const { auth } = useAuthContext();
  const routerContext = useMemo(() => ({ queryClient, auth }), [auth]);

  if (!auth.isInitialized) {
    return <DefaultLoadingSpinner />;
  }

  return <RouterProvider router={router} context={routerContext} />;
};
