import { useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import KanbanBoard from "../components/kanban/KanbanBoard";
import TaskModal from "../components/task/TaskModal";
import NotificationPanel from "../components/notifications/NotificationPanel";

/* ================= COMPONENT ================= */

export default function Dashboard() {
  /* 
    Dashboard ONLY owns:
    - selected task (modal control)
    - layout
    NOTHING else
  */

  const [selectedTask, setSelectedTask] = useState<any>(null);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ===== SIDEBAR ===== */}
      <Sidebar />

      {/* ===== KANBAN ===== */}
      <KanbanBoard onTaskClick={setSelectedTask} />

      {/* ===== NOTIFICATIONS ===== */}
      <NotificationPanel />

      {/* ===== TASK MODAL ===== */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
