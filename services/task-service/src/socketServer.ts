import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Task socket connected:", socket.id);

    /* ✅ JOIN PROJECT ROOM */
    socket.on("join-project", (projectId: string) => {
      socket.join(projectId);
      console.log(`📦 Joined project room: ${projectId}`);
    });

    /* optional: leave room when switching */
    socket.on("leave-project", (projectId: string) => {
      socket.leave(projectId);
      console.log(`📤 Left project room: ${projectId}`);
    });

    io.on("connection", (socket) => {
      console.log("🟢 CONNECTED:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Task socket disconnected:", socket.id);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};
