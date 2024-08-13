import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api/user";

export const useLoginMutation = (
  setAccessToken: (value: string | null) => void,
) =>
  useMutation({
    mutationKey: ["login"],
    mutationFn: (variables: { email: string; password: string }) =>
      login(variables),
    onSuccess: (newTokens) => {
      const { accessToken, longLivedToken } = newTokens;
      localStorage.setItem("longLivedToken", longLivedToken);
      setAccessToken(accessToken);
    },
    onError: (error: Error) => {
      console.error("Login failed:", error);
      setAccessToken(null);
    },
  });
