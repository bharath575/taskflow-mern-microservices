import type { Request, Response } from "express";
import Project from "../models/Project.model.js";

export const createProject = async (req: Request, res: Response) => {
  const project = await Project.create(req.body);
  res.status(201).json(project);
};

export const getProjects = async (req: Request, res: Response) => {
  const projects = await Project.find();
  res.json(projects);
};

export const updateProject = async (req: Request, res: Response) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(project);
};

export const deleteProject = async (req: Request, res: Response) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
