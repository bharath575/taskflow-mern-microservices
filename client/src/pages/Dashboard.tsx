import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import {
  getProjects,
  createProject,
  deleteProject,
} from "../services/projectApi";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskApi";

import socket from "../services/socket";
import toast from "react-hot-toast";
import { logout } from "../features/auth/authSlice";

/* ================= TYPES ================= */

type Project = {
  _id: string;
  name: string;
};

type Task = {
  _id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  order: number;
  description?: string;
  dueDate?: string;
};

/* ================= HELPERS ================= */

const getPriorityColor = (p: Task["priority"]) => {
  if (p === "high") return "#ef4444";
  if (p === "medium") return "#f59e0b";
  return "#22c55e";
};

/* ================= COMPONENT ================= */

export default function Dashboard() {
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const [projectName, setProjectName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [dark, setDark] = useState(false);

  /* ================= LOAD PROJECTS ================= */

  useEffect(() => {
    if (!user) return;

    (async () => {
      const res = await getProjects();
      setProjects(res.data);
      if (res.data.length) setSelectedProject(res.data[0]._id);
    })();
  }, [user]);

  /* ================= LOAD TASKS ================= */

  useEffect(() => {
    if (!selectedProject) return;

    (async () => {
      const res = await getTasks(selectedProject);
      setTasks(res.data);
      socket.emit("join-project", selectedProject);
    })();
  }, [selectedProject]);

  /* ================= SOCKET ================= */

  useEffect(() => {
    socket.on("task-created", (task: Task) =>
      setTasks((p) => [...p, task]),
    );

    socket.on("task-updated", (task: Task) =>
      setTasks((p) => p.map((t) => (t._id === task._id ? task : t))),
    );

    socket.on("task-deleted", (id: string) =>
      setTasks((p) => p.filter((t) => t._id !== id)),
    );

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  /* ================= PROJECT ================= */

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;

    const res = await createProject({ name: projectName });
    setProjects((p) => [...p, res.data]);
    setSelectedProject(res.data._id);
    setProjectName("");
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
    setProjects((p) => p.filter((x) => x._id !== id));
  };

  /* ================= TASK ================= */

  const handleCreateTask = async () => {
    if (!taskTitle.trim() || !selectedProject) return;

    await createTask({
      title: taskTitle,
      projectId: selectedProject,
      status: "todo",
      priority: "medium",
    });
    toast.success("Task created");

    setTaskTitle("");
  };

  const deleteTaskItem = async (id: string) => {
    await deleteTask(id);
    toast.error("Task deleted");
  };

  const saveTitle = async (task: Task) => {
    if (!editValue.trim()) return;

    await updateTask(task._id, { title: editValue });
    toast("Task updated");
    setEditingId(null);
  };

  /* ================= DRAG ORDER ================= */

  const handleDragEnd = async (result: DropResult) => {
    const {  destination, draggableId } = result;
    if (!destination) return;

    const updated = [...tasks];
    const index = updated.findIndex((t) => t._id === draggableId);

    const [moved] = updated.splice(index, 1);
    moved.status = destination.droppableId as Task["status"];

    updated.splice(destination.index, 0, moved);

    const reordered = updated.map((t, i) => ({ ...t, order: i }));
    setTasks(reordered);

    await Promise.all(
      reordered.map((t) =>
        updateTask(t._id, { status: t.status, order: t.order }),
      ),
    );
     toast.success("Task moved");
  };

  /* ================= AUTH ================= */

  if (!user) return <Navigate to="/login" />;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const columns: Record<Task["status"], Task[]> = {
    todo: tasks
      .filter((t) => t.status === "todo")
      .sort((a, b) => a.order - b.order),

    "in-progress": tasks
      .filter((t) => t.status === "in-progress")
      .sort((a, b) => a.order - b.order),

    done: tasks
      .filter((t) => t.status === "done")
      .sort((a, b) => a.order - b.order),
  };

   return (
     <div
       style={{
         ...styles.wrapper,
         background: dark ? "#111827" : "#f6f7fb",
         color: dark ? "white" : "black",
       }}
     >
       {/* ================= SIDEBAR ================= */}

       <aside style={styles.sidebar}>
         <h2 style={styles.logo}>TaskFlow</h2>

         <button style={styles.themeBtn} onClick={() => setDark(!dark)}>
           {dark ? "☀️" : "🌙"}
         </button>

         <div style={styles.userRow}>
           <span>👋 {user.name}</span>

           <button style={styles.logoutBtn} onClick={handleLogout}>
             🚪 Logout
           </button>
         </div>

         {/* PROJECT LIST */}
         {projects.map((p) => (
           <div
             key={p._id}
             onClick={() => setSelectedProject(p._id)}
             style={{
               ...styles.projectItem,
               cursor: "pointer",
               background:
                 selectedProject === p._id ? "#6366f1" : "transparent",
               color: selectedProject === p._id ? "white" : "black",
             }}
           >
             {p.name}

             <button
               style={styles.deleteDanger}
               onClick={(e) => {
                 e.stopPropagation();
                 handleDeleteProject(p._id);
               }}
             >
               🗑️
             </button>
           </div>
         ))}

         <div style={styles.inputRow}>
           <input
             style={styles.input}
             placeholder="New project"
             value={projectName}
             onChange={(e) => setProjectName(e.target.value)}
           />

           <button style={styles.addBtn} onClick={handleCreateProject}>
             +
           </button>
         </div>
       </aside>

       {/* ================= MAIN ================= */}

       <main style={styles.main}>
         {/* ADD TASK */}
         <div style={styles.inputRow}>
           <input
             style={styles.input}
             placeholder="Add new task..."
             value={taskTitle}
             onChange={(e) => setTaskTitle(e.target.value)}
           />

           <button style={styles.addBtn} onClick={handleCreateTask}>
             Add
           </button>
         </div>

         <DragDropContext onDragEnd={handleDragEnd}>
           <div style={styles.board}>
             {(Object.keys(columns) as Task["status"][]).map((status) => (
               <Droppable key={status} droppableId={status}>
                 {(provided) => (
                   <div
                     ref={provided.innerRef}
                     {...provided.droppableProps}
                     style={styles.column}
                   >
                     <h3>{status.toUpperCase()}</h3>

                     {columns[status].map((t, index) => (
                       <Draggable key={t._id} draggableId={t._id} index={index}>
                         {(provided) => (
                           <div
                             ref={provided.innerRef}
                             {...provided.draggableProps}
                             {...provided.dragHandleProps}
                             style={{
                               ...styles.taskCard,
                               ...provided.draggableProps.style,
                               cursor: "pointer",
                             }}
                             onClick={() => {
                               setSelectedTask(t);
                               setDescription(t.description || "");
                               setDueDate(t.dueDate || "");
                             }}
                           >
                             {/* TITLE */}
                             {editingId === t._id ? (
                               <input
                                 autoFocus
                                 value={editValue}
                                 onChange={(e) => setEditValue(e.target.value)}
                                 onBlur={() => saveTitle(t)}
                                 onKeyDown={(e) =>
                                   e.key === "Enter" && saveTitle(t)
                                 }
                                 style={styles.editInput}
                               />
                             ) : (
                               <span
                                 onDoubleClick={(e) => {
                                   e.stopPropagation();
                                   setEditingId(t._id);
                                   setEditValue(t.title);
                                 }}
                               >
                                 {t.title}
                               </span>
                             )}

                             {/* PRIORITY */}
                             <select
                               value={t.priority}
                               onClick={(e) => e.stopPropagation()}
                               onChange={(e) =>
                                 updateTask(t._id, {
                                   priority: e.target.value,
                                 })
                               }
                               style={{
                                 ...styles.badge,
                                 background: getPriorityColor(t.priority),
                               }}
                             >
                               <option value="low">Low</option>
                               <option value="medium">Medium</option>
                               <option value="high">High</option>
                             </select>

                             {/* DELETE */}
                             <button
                               style={styles.deleteDanger}
                               onClick={(e) => {
                                 e.stopPropagation();
                                 deleteTaskItem(t._id);
                               }}
                             >
                               🗑️
                             </button>
                           </div>
                         )}
                       </Draggable>
                     ))}

                     {provided.placeholder}
                   </div>
                 )}
               </Droppable>
             ))}
           </div>
         </DragDropContext>

         {/* ================= TASK MODAL ================= */}

         {selectedTask && (
           <div
             style={styles.modalOverlay}
             onClick={() => setSelectedTask(null)}
           >
             <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
               <h3>{selectedTask.title}</h3>

               <textarea
                 style={styles.textarea}
                 placeholder="Description"
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
               />

               <input
                 type="date"
                 value={dueDate}
                 onChange={(e) => setDueDate(e.target.value)}
               />

               <button
                 onClick={async () => {
                   await updateTask(selectedTask._id, {
                     description,
                     dueDate,
                   });

                   setSelectedTask(null);
                 }}
               >
                 Save
               </button>
             </div>
           </div>
         )}
       </main>
     </div>
   );


}
/* ================= STYLES ================= */

const styles: Record<string, React.CSSProperties> = {
  wrapper: { display: "flex", minHeight: "100vh" },

  sidebar: {
    width: 260,
    background: "white",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  logo: { fontWeight: 800 },

  main: { flex: 1, padding: 40 },

  inputRow: { display: "flex", gap: 8, marginBottom: 20 },

  input: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  addBtn: {
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "0 14px",
  },

  board: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
  },

  column: {
    background: "rgba(0,0,0,0.03)",
    padding: 10,
    borderRadius: 10,
    minHeight: 400,
  },

  taskCard: {
    background: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  badge: {
    fontSize: 11,
    color: "white",
    padding: "2px 6px",
    borderRadius: 6,
  },

  deleteDanger: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#ef4444",
  },

  themeBtn: { background: "transparent", border: "none", cursor: "pointer" },

  editInput: {
    flex: 1,
    borderRadius: 6,
    border: "1px solid #ddd",
  },

  userRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoutBtn: {
    border: "none",
    background: "#ef4444",
    color: "white",
    borderRadius: 8,
    padding: "4px 8px",
  },

  projectItem: {
    padding: 6,
    borderRadius: 6,
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    width: 350,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  textarea: {
    minHeight: 100,
    borderRadius: 8,
    border: "1px solid #ddd",
    padding: 8,
  },
};


