import type { Request, Response } from "express";
import Comment from "../models/Comment.model.js";
import { getIO } from "../socketServer.js";

/* ================= GET COMMENTS ================= */
export const getComments = async (req: Request, res: Response) => {
  try {
    const taskId = String(req.query.taskId || "");

    if (!taskId) {
      return res.status(400).json({ message: "taskId required" });
    }

    const comments = await Comment.find({ taskId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

/* ================= CREATE COMMENT ================= */
export const createComment = async (req: any, res: Response) => {
  try {
    const { taskId, text, projectId } = req.body;

    const comment = await Comment.create({
      taskId,
      projectId, // ✅ important for rooms
      text,
      userId: req.user.id, // from JWT middleware
    });

    const io = getIO();

    /* ================= REALTIME ================= */

    // ✅ 1️⃣ update comments in same project (live chat feel)
    io.to(projectId.toString()).emit("comment-added", comment);

    // ✅ 2️⃣ global notification
    io.emit("notification", {
      type: "comment",
      message: "💬 New comment added",
      taskId,
      projectId,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({
      message: "Create comment failed",
      error: err,
    });
  }
};
