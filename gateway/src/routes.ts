import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

router.use(
  "/api/v1/auth",
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
  }),
);
router.use(
  "/api/v1/projects",
  createProxyMiddleware({
    target: "http://localhost:5003",
    changeOrigin: true,
  }),
);

router.use(
  "/api/v1/tasks",
  createProxyMiddleware({
    target: "http://localhost:5004",
    changeOrigin: true,
  }),
);

export default router;
