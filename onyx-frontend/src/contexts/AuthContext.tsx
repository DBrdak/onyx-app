import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
  startTransition,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLoginMutation } from "@/lib/hooks/mutations/useLoginMutation";
import { useRefreshTokenMutation } from "@/lib/hooks/mutations/useRefreshTokenMutation";
import { getErrorMessage } from "@/lib/utils";
import { useApiInterceptors } from "@/lib/hooks/useApiInterceptors";
import { budgetApi, userApi } from "@/lib/axios";
import { useGetUserData } from "@/lib/hooks/useGetUserData";
import { type User } from "@/lib/validation/user";

export interface Auth {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  accessToken: string | null;
  user: User | undefined;
  isInitialized: boolean;
}

export const AuthContext = createContext<{ auth: Auth } | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const accessTokenRef = useRef<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: refreshToken } = useRefreshTokenMutation();
  const { mutateAsync: performLogin } = useLoginMutation();
  const { data: user, refetch: refetchUser } = useGetUserData();

  const updateAccessToken = useCallback((newToken: string | null) => {
    setAccessToken(newToken);
    accessTokenRef.current = newToken;
  }, []);

  useApiInterceptors(budgetApi, () => accessTokenRef.current);
  useApiInterceptors(userApi, () => accessTokenRef.current);

  const setAuthData = useCallback(
    async (newAccessToken: string, newLongLivedToken: string) => {
      updateAccessToken(newAccessToken);
      localStorage.setItem("longLivedToken", newLongLivedToken);
      await refetchUser();
    },
    [updateAccessToken, refetchUser],
  );

  const clearAuthData = useCallback(() => {
    updateAccessToken(null);
    localStorage.removeItem("longLivedToken");
    setIsInitialized(true);
    queryClient.clear();
  }, [queryClient, updateAccessToken]);

  const logout = useCallback(async () => {
    await userApi.put("/user/logout");
    startTransition(() => {
      clearAuthData();
    });
  }, [clearAuthData]);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const { accessToken, longLivedToken } = await performLogin({
          email,
          password,
        });
        await setAuthData(accessToken, longLivedToken);
        return true;
      } catch (error) {
        console.error("Login failed:", getErrorMessage(error));
        throw error;
      }
    },
    [performLogin, setAuthData],
  );

  useEffect(() => {
    const initializeAuth = async () => {
      const longLivedToken = localStorage.getItem("longLivedToken");
      if (longLivedToken) {
        try {
          const { accessToken, longLivedToken: newLongLivedToken } =
            await refreshToken(longLivedToken);
          await setAuthData(accessToken, newLongLivedToken);
        } catch (error) {
          console.error("Token refresh failed:", getErrorMessage(error));
          logout();
        }
      } else {
        clearAuthData();
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, [refreshToken, setAuthData, logout, clearAuthData]);

  const authValue = useMemo(
    () => ({
      auth: {
        accessToken,
        login,
        logout,
        user,
        isInitialized,
      },
    }),
    [isInitialized, accessToken, login, logout, user],
  );

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};
