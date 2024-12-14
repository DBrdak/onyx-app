import { useEffect } from "react";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import DefaultLoadingSpinner from "@/components/DefaultLoadingSpinner";
import RouteLoadingError from "@/components/RouteLoadingError";

import { loginWithGoogle } from "@/lib/api/user";
import { useLongLivedTokenStore } from "@/store/auth/longLivedTokenStore";
import { useAuthStore } from "@/store/auth/authStore";

export const Route = createLazyFileRoute("/_auth/login/google")({
  component: GoogleLogin,
});

function GoogleLogin() {
  const { code } = Route.useSearch();
  const navigate = useNavigate();

  const setLongLivedToken = useLongLivedTokenStore.use.setLongLivedToken();
  const setAccessToken = useAuthStore.use.setAccessToken();
  const setUser = useAuthStore.use.setUser();
  const setIsInitialized = useAuthStore.use.setIsInitialized();

  const { data, error, isPending } = useQuery({
    queryKey: ["userGoogle"],
    queryFn: () => loginWithGoogle(code),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!data) return;

    const updateAndNavigate = async () => {
      const { authorizationToken, ...user } = data;

      setLongLivedToken(authorizationToken.longLivedToken);
      setAccessToken(authorizationToken.accessToken);
      setUser(user);
      setIsInitialized(true);
      await new Promise((resolve) => setTimeout(() => resolve, 0));
      await navigate({ from: "/login/google", to: "/budget" });
    };

    updateAndNavigate();
  }, [
    data,
    navigate,
    setLongLivedToken,
    setAccessToken,
    setUser,
    setIsInitialized,
  ]);

  if (isPending || !data) return <DefaultLoadingSpinner />;
  if (error)
    return (
      <RouteLoadingError
        reset={() => navigate({ from: "/login/google", to: "/login" })}
      />
    );

  return null;
}
