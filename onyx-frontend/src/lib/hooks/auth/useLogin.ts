import { useCallback } from "react";
import { getUser, login } from "@/lib/api/user";

import { getErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/store/auth/authStore";
import { useLongLivedTokenStore } from "@/store/auth/longLivedTokenStore";

export const useLogin = () => {
  const setAccessToken = useAuthStore.use.setAccessToken();
  const setUser = useAuthStore.use.setUser();
  const setLongLivedToken = useLongLivedTokenStore.use.setLongLivedToken();

  const performLogin = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        const { accessToken, longLivedToken } = await login({
          email,
          password,
        });
        const user = await getUser(accessToken);
        setAccessToken(accessToken);
        setUser(user);
        setLongLivedToken(longLivedToken);
      } catch (error) {
        console.error("Login failed:", getErrorMessage(error));
        throw error;
      }
    },
    [setAccessToken, setUser, setLongLivedToken],
  );

  return performLogin;
};
