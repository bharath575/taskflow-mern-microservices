import http from "http";
import app from "./app.js";
import { initSocket } from "./socket.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5004;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`✅ Notification Service running on ${PORT}`);
});
