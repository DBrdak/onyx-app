import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
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
  login: (email: string, password: string) => Promise<void>;
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
  const [isInitialized, setIsInitialized] = useState(false);
  const accessTokenRef = useRef<string | null>(null);
  const queryClient = useQueryClient();

  const { mutateAsync: refreshToken } = useRefreshTokenMutation();
  const { mutateAsync: performLogin } = useLoginMutation();
  const { data: user, refetch: refetchUser } = useGetUserData();

  useApiInterceptors(budgetApi, () => accessTokenRef.current);
  useApiInterceptors(userApi, () => accessTokenRef.current);

  const updateUserData = useCallback(
    async (newAccessToken: string) => {
      accessTokenRef.current = newAccessToken;
      await refetchUser();
    },
    [refetchUser],
  );

  const updateStateTokens = (
    newAccessToken: string,
    newLongLivedToken: string,
  ) => {
    setAccessToken(newAccessToken);
    localStorage.setItem("longLivedToken", newLongLivedToken);
  };

  const clearAuthData = useCallback(() => {
    setIsInitialized(true);
    localStorage.removeItem("longLivedToken");
    accessTokenRef.current = null;
    setAccessToken(null);
    queryClient.clear();
  }, [queryClient]);

  const logout = useCallback(async () => {
    await userApi.put("/user/logout");
    clearAuthData();
  }, [clearAuthData]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        const { accessToken, longLivedToken } = await performLogin({
          email,
          password,
        });
        await updateUserData(accessToken);
        updateStateTokens(accessToken, longLivedToken);
      } catch (error) {
        console.error("Login failed:", getErrorMessage(error));
        throw error;
      }
    },
    [performLogin, updateUserData],
  );

  useEffect(() => {
    const initializeAuth = async () => {
      const longLivedToken = localStorage.getItem("longLivedToken");
      if (longLivedToken) {
        try {
          const { accessToken, longLivedToken: newLongLivedToken } =
            await refreshToken(longLivedToken);
          await updateUserData(accessToken);
          updateStateTokens(accessToken, newLongLivedToken);
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
  }, [refreshToken, logout, clearAuthData, updateUserData]);

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
    [accessToken, user, isInitialized],
  );

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};
