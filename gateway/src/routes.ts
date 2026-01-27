import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import verifyToken from "./middleware/auth.middleware.js";
const router = Router();

router.use(
  "/api/v1/auth",
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
  }),
);
router.use(
  "/api/v1/projects",verifyToken,
  createProxyMiddleware({
    target: "http://localhost:5003",
    changeOrigin: true,
  }),
);

router.use(
  "/api/v1/tasks",verifyToken,
  createProxyMiddleware({
    target: "http://localhost:5004",
    changeOrigin: true,
  }),
);

export default router;
