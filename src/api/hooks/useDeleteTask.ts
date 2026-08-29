import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { deleteTask } from "../tasks";

/**
 * 사용 예:
 *   const { mutate, isPending } = useDeleteTask();
 *   mutate(id, { onSuccess: () => navigate("/task") });
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: (_data, id) => {
      // 목록 캐시를 무효화해서 다음 방문 시 최신 상태로 다시 fetch되게 함
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.removeQueries({ queryKey: queryKeys.taskDetail(id) });
    },
  });
}
