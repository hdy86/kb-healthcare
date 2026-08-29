import { apiFetch } from "./client";
import type {
  TaskListResponse,
  TaskDetailResponse,
  DeleteTaskResponse,
  DashboardResponse,
} from "./types";

export const getTasks = (page: number) => apiFetch<TaskListResponse>(`/api/task?page=${page}`);

export const getTaskDetail = (id: string) => apiFetch<TaskDetailResponse>(`/api/task/${id}`);

export const deleteTask = (id: string) =>
  apiFetch<DeleteTaskResponse>(`/api/task/${id}`, { method: "DELETE" });

export const getDashboard = () => apiFetch<DashboardResponse>("/api/dashboard");
