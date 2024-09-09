import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api/user";

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (variables: { email: string; password: string }) =>
      login(variables),
    onError: (error: Error) => {
      console.error("Login failed:", error);
    },
  });
};
