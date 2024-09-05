import { useEffect } from "react";
import { AxiosInstance } from "axios";

export const useApiInterceptors = (
  api: AxiosInstance,
  accessToken: () => string | null,
) => {
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      const token = accessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [api]);
};
