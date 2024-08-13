import { Dispatch, SetStateAction, useLayoutEffect } from "react";
import { AxiosInstance } from "axios";
import { useRefreshTokenMutation } from "./mutations/useRefreshTokenMutation";

export const useApiInterceptors = (
  api: AxiosInstance,
  accessToken: string | null,
  setAccessToken: Dispatch<SetStateAction<string | null>>,
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>,
  setIsRefreshingToken: Dispatch<React.SetStateAction<boolean>>,
) => {
  const { mutateAsync: refreshToken } = useRefreshTokenMutation(setAccessToken);

  useLayoutEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const longLivedToken = localStorage.getItem("longLivedToken");
            if (!longLivedToken) throw new Error("No refresh token available");
            setIsRefreshingToken(true);
            const newTokens = await refreshToken(longLivedToken);
            setAccessToken(newTokens.accessToken);
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            setIsRefreshingToken(false);
            return api(originalRequest);
          } catch (refreshError) {
            setAccessToken(null);
            setIsAuthenticated(false);
            setIsRefreshingToken(false);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [
    accessToken,
    refreshToken,
    api,
    setAccessToken,
    setIsAuthenticated,
    setIsRefreshingToken,
  ]);
};
