import { Router } from "express";
import {  login, register } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post(
  "/login",
  (req, res, next) => {
    console.log("👉 LOGIN ROUTE HIT");
    next();
  },
  login,
);


export default router;
