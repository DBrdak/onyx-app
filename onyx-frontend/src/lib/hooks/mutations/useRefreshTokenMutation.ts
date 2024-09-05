import { useMutation } from "@tanstack/react-query";
import { refreshAccessToken } from "@/lib/api/user";

export const useRefreshTokenMutation = () => {
  return useMutation({
    mutationKey: ["refreshAccessToken"],
    mutationFn: (longLivedToken: string) => refreshAccessToken(longLivedToken),
    onError: () => {
      localStorage.removeItem("longLivedToken");
    },
  });
};
