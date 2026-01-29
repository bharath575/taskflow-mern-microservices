import api from "./api";

export const getProjects = () => api.get("/projects");

export const createProject = (data: { name: string }) =>
  api.post("/projects", data);

export const updateProject = (id: string, data: { name: string }) =>
  api.put(`/projects/${id}`, data);

export const deleteProject = (id: string) => api.delete(`/projects/${id}`);
