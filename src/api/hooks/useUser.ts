import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { getUser } from "../user";

export function useUser() {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: getUser,
  });
}
