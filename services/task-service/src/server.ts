import server from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5004;

server.listen(PORT, () => {
  console.log(`🚀 Task Service running with sockets on ${PORT}`);
});
