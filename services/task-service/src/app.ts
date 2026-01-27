import express from "express";
import cors from 'cors';
import connectDB from "./config/db.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/tasks", taskRoutes);

app.get("/", (_, res) => {
  res.send("Task service healthy 🚀");
});

export default app;
