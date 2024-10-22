import { useCallback } from "react";
import { getUser, login } from "@/lib/api/user";
import { useSetAccessToken, useSetUser } from "@/store/auth/authStore";
import { useSetLongLivedToken } from "@/store/auth/longLivedTokenStore";
import { getErrorMessage } from "@/lib/utils";

export const useLogin = () => {
  const setAccessToken = useSetAccessToken();
  const setUser = useSetUser();
  const setLongLivedToken = useSetLongLivedToken();

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
