import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
const router = Router();
router.use("/auth", createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
}));
export default router;
//# sourceMappingURL=routes.js.map