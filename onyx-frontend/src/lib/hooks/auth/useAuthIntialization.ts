import { useEffect } from "react";

import { getAuthInitializationData } from "@/lib/api/user";
import { useAuthStore } from "@/store/auth/authStore";
import { useLongLivedTokenStore } from "@/store/auth/longLivedTokenStore";

export const useAuthInitialization = () => {
  const { setAccessToken, setUser, reset, setIsInitialized } = useAuthStore();
  const { setLongLivedToken, longLivedToken } = useLongLivedTokenStore();

  useEffect(() => {
    if (!longLivedToken) {
      return reset();
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
      }
    };

    initAuth();
  }, []);
};
