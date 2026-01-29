import express from "express";
import cors from "cors";
import http from "http";

import connectDB from "./config/db.js";
import taskRoutes from "./routes/task.routes.js";
import { initSocket } from "./socketServer.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

/* routes */
app.use("/", taskRoutes);

app.get("/health", (_, res) => {
  res.send("Task service healthy 🚀");
});

/* ===== SOCKET + SERVER ===== */
const server = http.createServer(app);
initSocket(server);

export default server;
