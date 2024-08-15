import {
  createContext,
  useCallback,
  useEffect,
  useState,
  useTransition,
  useMemo,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLoginMutation } from "@/lib/hooks/mutations/useLoginMutation";
import { useRefreshTokenMutation } from "@/lib/hooks/mutations/useRefreshTokenMutation";
import { getErrorMessage } from "@/lib/utils";
import { useApiInterceptors } from "@/lib/hooks/useApiInterceptors";
import { budgetApi, userApi } from "@/lib/axios";
import { useGetUserData } from "@/lib/hooks/useGetUserData";
import { User } from "@/lib/validation/user";

export interface Auth {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  accessToken: string | null;
  user: User | undefined;
  isInitialized: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<{ auth: Auth } | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isPending, startTransition] = useTransition();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationComplete, setInitializationComplete] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync: refreshToken, isPending: isRefreshingToken } =
    useRefreshTokenMutation((token) => {
      startTransition(() => {
        setAccessToken(token);
      });
    });

  const { mutateAsync: performLogin, isPending: isLoggingIn } =
    useLoginMutation((token) => {
      startTransition(() => {
        setAccessToken(token);
      });
    });

  const { data: user, isLoading: isLoadingUser } = useGetUserData(accessToken);

  useApiInterceptors(budgetApi, accessToken);
  useApiInterceptors(userApi, accessToken);

  const logout = useCallback(() => {
    startTransition(() => {
      setAccessToken(null);
      localStorage.removeItem("longLivedToken");
      queryClient.clear();
      setInitializationComplete(false);
      setIsInitialized(true);
    });
  }, [queryClient]);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        await performLogin({ email, password });

        return true;
      } catch (error) {
        console.error("Login failed:", getErrorMessage(error));
        return false;
      }
    },
    [performLogin],
  );

  useEffect(() => {
    const initializeAuth = async () => {
      const longLivedToken = localStorage.getItem("longLivedToken");
      if (longLivedToken) {
        try {
          await refreshToken(longLivedToken);
          startTransition(() => {
            setInitializationComplete(true);
          });
        } catch (error) {
          console.error("Token refresh failed:", getErrorMessage(error));
          logout();
        }
      } else {
        logout();
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (
      initializationComplete &&
      (accessToken === null || (accessToken && user))
    ) {
      startTransition(() => {
        setIsInitialized(true);
      });
    }
  }, [accessToken, user, initializationComplete]);

  const authValue = useMemo(
    () => ({
      auth: {
        accessToken,
        login,
        logout,
        user,
        isInitialized,
        isLoading:
          isRefreshingToken || isLoggingIn || isLoadingUser || isPending,
      },
    }),
    [
      isInitialized,
      accessToken,
      login,
      logout,
      user,
      isRefreshingToken,
      isLoggingIn,
      isLoadingUser,
      isPending,
    ],
  );

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};
