import { useQuery } from "@tanstack/react-query";
import { ApiError } from "../client";
import { queryKeys } from "../keys";
import { getTaskDetail } from "../tasks";

export function useTaskDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.taskDetail(id),
    queryFn: () => getTaskDetail(id),
    enabled: Boolean(id),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) return false;
      return failureCount < 2;
    },
  });
}
