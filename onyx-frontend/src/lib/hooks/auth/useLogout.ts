import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { userApi } from "@/lib/axios";
import { useAuthStore } from "@/store/auth/authStore";
import { resetAllMemoryStores } from "@/store/initializeMemoryStore";
import { resetAllPersistedStores } from "@/store/resetPersistedStores";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const setIsInitialized = useAuthStore.use.setIsInitialized();

  const logout = useCallback(async () => {
    await userApi.put("/user/logout");
    queryClient.clear();
    resetAllMemoryStores();
    resetAllPersistedStores();
    setIsInitialized(true);
  }, [queryClient, setIsInitialized]);

  return logout;
};
