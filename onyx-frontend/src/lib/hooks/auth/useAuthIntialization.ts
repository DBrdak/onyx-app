import { useEffect } from "react";

import { getAuthInitializationData } from "@/lib/api/user";
import { useAuthStore } from "@/store/auth/authStore";
import { useLongLivedTokenStore } from "@/store/auth/longLivedTokenStore";

export const useAuthInitialization = () => {
  const longLivedToken = useLongLivedTokenStore.use.longLivedToken();
  const setLongLivedToken = useLongLivedTokenStore.use.setLongLivedToken();

  const reset = useAuthStore.use.reset();
  const setIsInitialized = useAuthStore.use.setIsInitialized();
  const setAccessToken = useAuthStore.use.setAccessToken();
  const setUser = useAuthStore.use.setUser();

  useEffect(() => {
    if (!longLivedToken) {
      reset();
      setIsInitialized(true);
      return;
    }

    const initAuth = async () => {
      try {
        const {
          accessToken,
          longLivedToken: newLongLivedToken,
          user,
        } = await getAuthInitializationData(longLivedToken);
        setAccessToken(accessToken);
        setUser(user);
        setLongLivedToken(newLongLivedToken);
        setIsInitialized(true);
      } catch (error) {
        console.error("Initialization failed:", error);
        reset();
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);
};
