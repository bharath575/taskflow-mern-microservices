import api from "./api";

export const getComments = (taskId: string) => api.get(`/comments/${taskId}`);

export const createComment = (data: { taskId: string; text: string }) =>
  api.post("/comments", data);
