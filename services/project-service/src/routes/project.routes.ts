import { Router } from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.post("/", createProject);
router.get("/", getProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
