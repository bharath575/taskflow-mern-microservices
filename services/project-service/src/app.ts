import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import projectRoutes from "./routes/project.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/projects", projectRoutes);

app.get("/", (_, res) => {
  res.send("Project service healthy 🚀");
});

export default app;
