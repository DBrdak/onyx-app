import { createContext, useCallback, useEffect, useState } from "react";

import { useLoginMutation } from "@/lib/hooks/mutations/useLoginMutation";
import { useRefreshTokenMutation } from "@/lib/hooks/mutations/useRefreshTokenMutation";
import { getErrorMessage } from "@/lib/utils";
import { useApiInterceptors } from "@/lib/hooks/useApiInterceptors";
import { budgetApi, userApi } from "@/lib/axios";

export interface Auth {
  login: (email: string, password: string) => Promise<boolean>;
  accessToken: string | null;
  isLoggingIn: boolean;
  isRefreshingToken: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<{ auth: Auth } | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isRefreshingToken, setIsRefreshingToken] = useState<boolean>(true);

  const { mutateAsync: refreshToken } = useRefreshTokenMutation(setAccessToken);

  const { mutateAsync: performLogin, isPending: isLoggingIn } =
    useLoginMutation(setAccessToken);

  useEffect(() => {
    const initializeAuth = async () => {
      const longLivedToken = localStorage.getItem("longLivedToken");
      if (longLivedToken) {
        try {
          await refreshToken(longLivedToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token refresh failed:", getErrorMessage(error));
          setIsAuthenticated(false);
        }
      }
      setIsRefreshingToken(false);
    };

    initializeAuth();
  }, []);

  useApiInterceptors(
    budgetApi,
    accessToken,
    setAccessToken,
    setIsAuthenticated,
    setIsRefreshingToken,
  );

  useApiInterceptors(
    userApi,
    accessToken,
    setAccessToken,
    setIsAuthenticated,
    setIsRefreshingToken,
  );

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        await performLogin({ email, password });
        return new Promise<boolean>((resolve) => {
          setAccessToken((token) => {
            if (token) {
              setIsAuthenticated(true);
              resolve(true);
            } else {
              resolve(false);
            }
            return token;
          });
        });
      } catch (error) {
        console.error("Login failed:", getErrorMessage(error));
        setIsAuthenticated(false);
        throw new Error(getErrorMessage(error));
      }
    },
    [performLogin],
  );

  if (isRefreshingToken) {
    return <div>Loading...</div>; // or a custom loading component
  }

  return (
    <AuthContext.Provider
      value={{
        auth: {
          accessToken,
          login,
          isLoggingIn,
          isRefreshingToken,
          isAuthenticated,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
