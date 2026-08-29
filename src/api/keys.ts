export const queryKeys = {
  user: ["user"] as const,
  dashboard: ["dashboard"] as const,
  tasks: ["tasks"] as const,
  taskDetail: (id: string) => ["taskDetail", id] as const,
};
