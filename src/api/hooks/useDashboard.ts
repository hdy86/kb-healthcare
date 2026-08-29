import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { getDashboard } from "../tasks";

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: getDashboard,
  });
}
