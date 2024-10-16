import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth/authStore";
import { useLongLivedTokenStore } from "@/store/auth/longLivedTokenStore";
import { userApi } from "@/lib/axios";

export const useLogout = () => {
  const { reset } = useAuthStore();
  const { removeLongLivedToken } = useLongLivedTokenStore();
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    await userApi.put("/user/logout");
    reset();
    removeLongLivedToken();
    queryClient.clear();
  }, [queryClient, removeLongLivedToken, reset]);

  return logout;
};
