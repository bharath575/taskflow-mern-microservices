import type { Request, Response } from "express";
import Task from "../models/Task.model.js";
import socket from "../socketClient.js";
export const createTask = async (req: Request, res: Response) => {
  const task = await Task.create(req.body);
  socket.emit("task-created", task);
  res.status(201).json(task);
};

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await Task.findById({ projectId: req.query.projectId });
  res.json(tasks);
};

export const updateTask = async (req: Request, res: Response) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  socket.emit("task-updated", task);
  res.json(task);
};

export const deleteTask = async (req: Request, res: Response) => {
  await Task.findByIdAndDelete(req.params.id);
  socket.emit("task-deleted", req.params.id);
  res.json({ message: "Deleted" });
};
