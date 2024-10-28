import { Suspense, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";

import GlobalLoadingError from "@/components/GlobalLoadingError";
import DefaultLoadingSpinner from "@/components/DefaultLoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";

import { useAccessToken, useIsInitialized } from "@/store/auth/authStore";
import { useAuthInitialization } from "@/lib/hooks/auth/useAuthIntialization";
import { useApiInterceptors } from "@/lib/hooks/useApiInterceptors";
import { budgetApi, userApi } from "@/lib/axios";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  context: { queryClient, accessToken: null },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: () => <GlobalLoadingError />,
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<DefaultLoadingSpinner />}>
          <RouterWithAuth />
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

const RouterWithAuth: React.FC = () => {
  useAuthInitialization();

  const accessToken = useAccessToken();
  const isInitialized = useIsInitialized();

  useApiInterceptors(budgetApi, accessToken);
  useApiInterceptors(userApi, accessToken);

  const routerContext = useMemo(
    () => ({
      queryClient,
      accessToken,
    }),
    [accessToken],
  );

  if (!isInitialized) {
    return <DefaultLoadingSpinner />;
  }

  return <RouterProvider router={router} context={routerContext} />;
};
