import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { getTasks } from "../tasks";

export function useTasks() {
  return useInfiniteQuery({
    queryKey: queryKeys.tasks,
    queryFn: ({ pageParam }) => getTasks(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.hasNext ? allPages.length + 1 : undefined),
  });
}
