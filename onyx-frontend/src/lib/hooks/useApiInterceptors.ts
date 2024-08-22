import { useLayoutEffect } from "react";
import { AxiosInstance } from "axios";

export const useApiInterceptors = (
  api: AxiosInstance,
  accessToken: string | null,
) => {
  useLayoutEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });
    return () => api.interceptors.request.eject(requestInterceptor);
  }, [accessToken]);
};
