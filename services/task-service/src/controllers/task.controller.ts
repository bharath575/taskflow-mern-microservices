// import type { Request, Response } from "express";
// import Task from "../models/Task.model.js";
// import socket from "../socketClient.js";

// /* ================= CREATE ================= */
// export const createTask = async (req: Request, res: Response) => {
//   try {
//     const task = await Task.create(req.body);

//     socket.emit("task-created", task);

//     res.status(201).json(task);
//   } catch (err) {
//     res.status(500).json({ message: "Create failed", error: err });
//   }
// };

// /* ================= GET TASKS BY PROJECT ================= */
// export const getTasks = async (req: Request, res: Response) => {
//   try {
//     const { projectId } = req.query;

//     if (!projectId) {
//       return res.status(400).json({ message: "projectId required" });
//     }

//     // ✅ FIXED HERE
//     const tasks = await Task.find({ projectId });

//     res.json(tasks);
//   } catch (err) {
//     res.status(500).json({ message: "Fetch failed", error: err });
//   }
// };

// /* ================= UPDATE ================= */
// export const updateTask = async (req: Request, res: Response) => {
//   try {
//     const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });

//     socket.emit("task-updated", task);

//     res.json(task);
//   } catch (err) {
//     res.status(500).json({ message: "Update failed", error: err });
//   }
// };

// /* ================= DELETE ================= */
// export const deleteTask = async (req: Request, res: Response) => {
//   try {
//     await Task.findByIdAndDelete(req.params.id);

//     socket.emit("task-deleted", req.params.id);

//     res.json({ message: "Deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Delete failed", error: err });
//   }
// };


import type { Request, Response } from "express";
import Task from "../models/Task.model.js";
import { getIO } from "../socketServer.js"; // ✅ FIXED

/* ================= CREATE ================= */
export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.create(req.body);

    // ✅ emit from server
    getIO().to(task.projectId.toString()).emit("task-created", task);

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Create failed", error: err });
  }
};

/* ================= GET TASKS BY PROJECT ================= */
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: "projectId required" });
    }

    const tasks = await Task.find({ projectId });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err });
  }
};

/* ================= UPDATE ================= */
export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (task) {
      // ✅ emit updated task
      getIO().to(task.projectId.toString()).emit("task-updated", task);
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
};

/* ================= DELETE ================= */
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (task) {
      getIO().to(task.projectId.toString()).emit("task-deleted", task._id);
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err });
  }
};

