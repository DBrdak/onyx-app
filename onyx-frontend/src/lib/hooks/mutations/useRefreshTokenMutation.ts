import { useMutation } from "@tanstack/react-query";
import { refreshAccessToken } from "@/lib/api/user";

export const useRefreshTokenMutation = (
  setAccessToken: (value: string | null) => void,
) =>
  useMutation({
    mutationKey: ["refreshAccessToken"],
    mutationFn: (longLivedToken: string) => refreshAccessToken(longLivedToken),
    onSuccess: (newTokens) => {
      const { accessToken, longLivedToken } = newTokens;
      localStorage.setItem("longLivedToken", longLivedToken);
      setAccessToken(accessToken);
    },
    onError: () => {
      localStorage.removeItem("longLivedToken");
      setAccessToken(null);
    },
  });
