import type { TaskItem, TaskStatus } from "../api/types";

interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  memo: string;
}

export const MOCK_USER: MockUser = {
  id: "user-001",
  email: "test@example.com",
  password: "test1234", // 영문+숫자, 8~24자 조건 충족
  name: "테스트 사용자",
  memo: "MSW로 생성된 목업 유저입니다.",
};

function generateTasks(count: number): TaskItem[] {
  return Array.from({ length: count }, (_, i) => {
    const idx = i + 1;
    const status: TaskStatus = idx % 3 === 0 ? "DONE" : "TODO";
    return {
      id: String(idx),
      title: `할 일 ${idx}`,
      memo: `${idx}번째 할 일에 대한 메모입니다.`,
      status,
    };
  });
}

// 총 87개 정도로 넉넉하게 만들어 무한 스크롤/가상 스크롤 테스트에 사용
export const TASKS: TaskItem[] = generateTasks(87);

export function getDashboardCounts() {
  const numOfTask = TASKS.length;
  const numOfDoneTask = TASKS.filter((t) => t.status === "DONE").length;
  const numOfRestTask = numOfTask - numOfDoneTask;
  return { numOfTask, numOfRestTask, numOfDoneTask };
}

export function findTaskById(id: string) {
  return TASKS.find((t) => t.id === id);
}

export function deleteTaskById(id: string) {
  const idx = TASKS.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  TASKS.splice(idx, 1);
  return true;
}
