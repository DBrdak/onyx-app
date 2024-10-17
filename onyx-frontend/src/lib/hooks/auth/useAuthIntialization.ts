import { useEffect } from "react";

import { getAuthInitializationData } from "@/lib/api/user";
import {
  useLongLivedToken,
  useSetLongLivedToken,
} from "@/store/auth/longLivedTokenStore";
import {
  useReset,
  useSetAccessToken,
  useSetIsInitialized,
  useSetUser,
} from "@/store/auth/authStore";

export const useAuthInitialization = () => {
  const longLivedToken = useLongLivedToken();
  const reset = useReset();
  const setAccessToken = useSetAccessToken();
  const setUser = useSetUser();
  const setLongLivedToken = useSetLongLivedToken();
  const setIsInitialized = useSetIsInitialized();

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
