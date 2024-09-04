import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/api/user";

export const useGetUserData = (accessToken: string | null) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: !!accessToken,
    staleTime: Infinity,
  });
};
