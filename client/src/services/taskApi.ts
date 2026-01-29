import api from "./api";

export const getTasks = (projectId: string) =>
  api.get(`/tasks?projectId=${projectId}`);

export const createTask = (data: any) => api.post("/tasks", data);

export const updateTask = (id: string, data: any) =>
  api.put(`/tasks/${id}`, data);

export const deleteTask = (id: string) => api.delete(`/tasks/${id}`);
