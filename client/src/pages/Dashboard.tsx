import Sidebar from "../components/layout/Sidebar";
import KanbanBoard from "../components/kanban/KanbanBoard";
import TaskModal from "../components/task/TaskModal";

import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

import { getSocket } from "../services/socket";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function Dashboard() {
  /* ================= REDUX STATE ================= */

  const selectedTask = useSelector(
    (state: RootState) => state.tasks.selectedTask,
  );

  // ✅ THIS WAS MISSING (root cause of crash)
  const projectId = useSelector(
    (state: RootState) => state.projects.selectedId,
  );

  /* ================= SOCKET ================= */
 useEffect(() => {
   if (!projectId) return;

   const socket = getSocket();

   /* join once */
   socket.emit("join-project", projectId);

   const onUpdated = () => toast("Task updated", { id: "task-updated" });

   const onCreated = () =>
     toast.success("New task created", { id: "task-created" });

   const onDeleted = () => toast.error("Task deleted", { id: "task-deleted" });

   const onComment = () => toast("New comment 💬", { id: "task-comment" });

   /* clean old listeners first */
   socket.off("task-created", onCreated);
   socket.off("task-updated", onUpdated);
   socket.off("task-deleted", onDeleted);
   socket.off("comment-created", onComment);

   /* add listeners */
   socket.on("task-created", onCreated);
   socket.on("task-updated", onUpdated);
   socket.on("task-deleted", onDeleted);
   socket.on("comment-created", onComment);

   /* cleanup */
   return () => {
     socket.emit("leave-project", projectId);

     socket.off("task-created", onCreated);
     socket.off("task-updated", onUpdated);
     socket.off("task-deleted", onDeleted);
     socket.off("comment-created", onComment);
   };
 }, [projectId]);

  /* ================= UI ================= */

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <KanbanBoard />

      {selectedTask && <TaskModal />}
    </div>
  );
}
