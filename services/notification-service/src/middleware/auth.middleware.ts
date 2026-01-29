import dotenv from 'dotenv';
dotenv.config();
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log("\n==============================");
  console.log("🔐 verifyToken MIDDLEWARE HIT");
  console.log("👉 Method:", req.method);
  console.log("👉 URL:", req.originalUrl);
  console.log("👉 Path:", req.path);

  const header = req.headers.authorization;

  console.log("👉 Raw Authorization header:", header);

  // ❌ no header
  if (!header) {
    console.log("❌ No Authorization header found");
    console.log("==============================\n");
    return res.status(401).json({ message: "No token provided" });
  }

  // Expect: Bearer <token>
  const parts = header.split(" ");

  console.log("👉 Header parts:", parts);
  console.log("👉 Parts length:", parts.length);

  if (parts.length !== 2) {
    console.log("❌ Bad header format. Parts count:", parts.length);
    console.log("==============================\n");
    return res
      .status(401)
      .json({ message: "Invalid auth format. Expected: Bearer <token>" });
  }

  if (parts[0] !== "Bearer") {
    console.log("❌ Bad header scheme. Expected 'Bearer', got:", parts[0]);
    console.log("==============================\n");
    return res
      .status(401)
      .json({ message: "Invalid auth scheme. Expected: Bearer <token>" });
  }

  const token = parts[1];

  // ✅ FIX: Check if token exists
  if (!token) {
    console.log("❌ Token is empty");
    console.log("==============================\n");
    return res.status(401).json({ message: "Token is empty" });
  }

  console.log("👉 Extracted token:", token.substring(0, 20) + "...");
  console.log("👉 Token length:", token.length);

  // ✅ Check JWT_SECRET before using it
  const jwtSecret = process.env.JWT_SECRET;

  console.log("👉 JWT_SECRET exists:", !!jwtSecret);
  console.log("👉 JWT_SECRET length:", jwtSecret?.length || 0);

  if (!jwtSecret) {
    console.log("❌ CRITICAL: JWT_SECRET is not defined in environment");
    console.log("==============================\n");
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    // ✅ Now TypeScript knows both token and jwtSecret are strings
    const decoded = jwt.verify(token, jwtSecret);

    console.log("✅ Token verified successfully");
    console.log("👉 Decoded payload:", JSON.stringify(decoded, null, 2));

    req.user = decoded;

    console.log("✅ User attached to request:", req.user);
    console.log("==============================\n");

    next();
  } catch (err: any) {
    console.log("❌ JWT VERIFY FAILED");
    console.log("👉 Error name:", err.name);
    console.log("👉 Error message:", err.message);

    if (err.name === "TokenExpiredError") {
      console.log("👉 Token expired at:", err.expiredAt);
      console.log("==============================\n");
      return res.status(401).json({ message: "Token expired" });
    }

    if (err.name === "JsonWebTokenError") {
      console.log("👉 JWT malformed or invalid");
      console.log("==============================\n");
      return res.status(401).json({ message: "Invalid token" });
    }

    console.log("==============================\n");
    return res.status(401).json({ message: "Token verification failed" });
  }
};

export default verifyToken;
