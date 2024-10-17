import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useReset } from "@/store/auth/authStore";
import { useRemoveLongLivedToken } from "@/store/auth/longLivedTokenStore";
import { userApi } from "@/lib/axios";

export const useLogout = () => {
  const reset = useReset();
  const removeLongLivedToken = useRemoveLongLivedToken();
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    await userApi.put("/user/logout");
    reset();
    removeLongLivedToken();
    queryClient.clear();
  }, [queryClient, removeLongLivedToken, reset]);

  return logout;
};
