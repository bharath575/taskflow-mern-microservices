import express from "express";
import cors from 'cors';
import connectDB from './config/db.js'
import authRoutes from "./routes/auth.routes.js"
const app = express();

app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/v1/auth", authRoutes);

app.get("/", (_, res) => {
  res.send("Auth service healthy 🚀");
});


export default app;