import { Router } from "express";
import verifyToken from "../middleware/auth.middleware.js";
import {
  getComments,
  createComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.get("/:taskId", verifyToken, getComments);
router.post("/", verifyToken, createComment);

export default router;
