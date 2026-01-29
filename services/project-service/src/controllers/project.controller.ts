import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import Project from "../models/Project.model.js";

// ✅ CREATE
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    console.log("📦 CREATE PROJECT HIT");
    console.log("👉 req.user:", req.user);

    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      userId: req.user?.id, // 🔥 CRITICAL FIX
    });

    res.status(201).json(project);
  } catch (err) {
    console.error("❌ CREATE PROJECT ERROR:", err);
    res.status(500).json({ message: "Create failed" });
  }
};

// ✅ GET (only user's projects)
export const getProjects = async (req: AuthRequest, res: Response) => {
  const projects = await Project.find({
    userId: req.user?.id, // 🔥 FILTER BY USER
  });

  res.json(projects);
};

// ✅ UPDATE (only own project)
export const updateProject = async (req: AuthRequest, res: Response) => {
  const project = await Project.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user?.id,
    },
    req.body,
    { new: true },
  );

  res.json(project);
};

// ✅ DELETE (only own project)
export const deleteProject = async (req: AuthRequest, res: Response) => {
  await Project.findOneAndDelete({
    _id: req.params.id,
    userId: req.user?.id,
  });

  res.json({ message: "Deleted" });
};
