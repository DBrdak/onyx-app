import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/api/user";

export const useGetUserData = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: false,
    staleTime: Infinity,
  });
};
