import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";

import GlobalLoadingError from "@/components/GlobalLoadingError";

import DefaultNotFoundComponent from "@/components/DefaultNotFoundComponent";

import { useApiInterceptors } from "@/lib/hooks/useApiInterceptors";
import { budgetApi, userApi } from "@/lib/axios";
import { useAuthStore } from "@/store/auth/authStore";
import { useAuthInitialization } from "./lib/hooks/auth/useAuthIntialization";
import DefaultLoadingSpinner from "./components/DefaultLoadingSpinner";

const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: () => <GlobalLoadingError />,
  defaultNotFoundComponent: () => <DefaultNotFoundComponent />,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  useAuthInitialization();

  const accessToken = useAuthStore.use.accessToken();
  const isInitialized = useAuthStore.use.isInitialized();

  useApiInterceptors(budgetApi, accessToken, queryClient);
  useApiInterceptors(userApi, accessToken, queryClient);

  if (!isInitialized) return <DefaultLoadingSpinner />;

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
