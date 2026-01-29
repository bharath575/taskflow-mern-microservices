import express from "express";
import cors from 'cors';
import connectDB from './config/db.js'
import authRoutes from "./routes/auth.routes.js"
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("🔥 AUTH SERVICE RECEIVED:", req.method, req.url);
  next();
});




connectDB();

app.use("/", authRoutes);

app.get("/health", (_, res) => {
  res.send("Auth service healthy 🚀");
});


export default app;