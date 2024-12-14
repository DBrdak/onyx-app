import { useLayoutEffect } from "react";

import { refreshAccessToken } from "@/lib/api/user";
import { useLongLivedTokenStore } from "@/store/auth/longLivedTokenStore";
import { useAuthStore } from "@/store/auth/authStore";
import { resetAllMemoryStores } from "@/store/initializeMemoryStore";
import { resetAllPersistedStores } from "@/store/resetPersistedStores";

import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { type QueryClient } from "@tanstack/react-query";

export const useApiInterceptors = (
  api: AxiosInstance,
  accessToken: string | null,
  queryClient: QueryClient,
) => {
  const longLivedToken = useLongLivedTokenStore.use.longLivedToken();
  const setLongLivedToken = useLongLivedTokenStore.use.setLongLivedToken();
  const setAccessToken = useAuthStore.use.setAccessToken();
  const setIsInitialized = useAuthStore.use.setIsInitialized();

  useLayoutEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };
        if (error.response?.status === 403 && !config._retry) {
          config._retry = true;

          if (!longLivedToken) {
            queryClient.clear();
            resetAllMemoryStores();
            resetAllPersistedStores();
            setIsInitialized(true);
            return;
          }

          try {
            const {
              accessToken: newAccessToken,
              longLivedToken: newLongLivedToken,
            } = await refreshAccessToken(longLivedToken);
            setAccessToken(newAccessToken);
            setLongLivedToken(newLongLivedToken);
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(config);
          } catch (refreshError) {
            console.error("Token refresh failed", refreshError);
            throw refreshError;
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [api, accessToken]);
};
