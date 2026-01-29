import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import verifyToken from "./middleware/auth.middleware.js";

const router = Router();

router.use((req, res, next) => {
  console.log("🌍 GATEWAY RECEIVED:", req.method, req.url);
  next();
});
router.use(
  "/auth",
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
    
    
  }),
);

router.use(
  "/projects",
  verifyToken,
  createProxyMiddleware({
    target: "http://localhost:5003",
    changeOrigin: true,
  }),
);

router.use(
  "/tasks",
  verifyToken,
  createProxyMiddleware({
    target: "http://localhost:5004",
    changeOrigin: true,
  }),
);

export default router;
