import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

router.use(
  "/auth",
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
  }),
);
router.use(
  "/projects",
  createProxyMiddleware({
    target: "http://localhost:5003",
    changeOrigin: true,
  }),
);

export default router;
