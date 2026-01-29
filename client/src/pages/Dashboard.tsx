// import { useSelector } from "react-redux";
// import type { RootState } from "../app/store";
// import { Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   type DropResult,
// } from "@hello-pangea/dnd";





// import {
//   getProjects,
//   createProject,
//   deleteProject,
// } from "../services/projectApi";

// import {
//   getTasks,
//   createTask,
//   updateTask,
//   deleteTask,
// } from "../services/taskApi";
// import socket from "../services/socket";
// import toast from "react-hot-toast";

// /* ================= TYPES ================= */

// type Project = {
//   _id: string;
//   name: string;
// };

// type Task = {
//   _id: string;
//   title: string;
//   completed: boolean;

//   // ✅ added
//   status: "todo" | "in-progress" | "done";
//   priority: "low" | "medium" | "high";
// };

// /* ================= COMPONENT ================= */

// export default function Dashboard() {
//   const user = useSelector((state: RootState) => state.auth.user);

//   const [projects, setProjects] = useState<Project[]>([]);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [selectedProject, setSelectedProject] = useState<string | null>(null);

//   const [projectName, setProjectName] = useState("");
//   const [taskTitle, setTaskTitle] = useState("");

//   /* ================= LOADERS ================= */

//   useEffect(() => {
//     if (!user) return;

//     (async () => {
//       const res = await getProjects();
//       setProjects(res.data);

//       if (res.data.length) setSelectedProject(res.data[0]._id);
//     })();
//   }, [user]);

//   useEffect(() => {
//     if (!selectedProject) return;

//     (async () => {
//       const res = await getTasks(selectedProject);
//       setTasks(res.data);

//       // ✅ ADDED THIS LINE (join socket room)
//       socket.emit("join-project", selectedProject);
//     })();
//   }, [selectedProject]);

//   useEffect(() => {
//     socket.on("task-created", (task) => {
//       setTasks((prev) => [...prev, task]);
//       toast.success("Task created");
//     });

//     socket.on("task-updated", (task) => {
//       setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
//       toast("Task updated");
//     });

//     socket.on("task-deleted", (id) => {
//       setTasks((prev) => prev.filter((t) => t._id !== id));
//       toast.error("Task deleted");
//     });

//     return () => {
//       socket.off("task-created");
//       socket.off("task-updated");
//       socket.off("task-deleted");
//     };
//   }, []);


//   /* ================= PROJECT ================= */

//   const handleCreateProject = async () => {
//     if (!projectName.trim()) return;

//     const res = await createProject({ name: projectName });

//     setProjects((p) => [...p, res.data]);
//     setSelectedProject(res.data._id);
//     setProjectName("");
//   };

//   const handleDeleteProject = async (id: string) => {
//     await deleteProject(id);
//     setProjects((p) => p.filter((x) => x._id !== id));
//     if (selectedProject === id) setSelectedProject(null);
//   };

//   /* ================= TASK ================= */

//   const handleCreateTask = async () => {
//     if (!taskTitle.trim() || !selectedProject) return;

//     const res = await createTask({
//       title: taskTitle,
//       projectId: selectedProject,
//       status: "todo",
//       priority: "medium",
//     });

//     setTasks((t) => [...t, res.data]);
//     setTaskTitle("");
//   };

  

//   const deleteTaskItem = async (id: string) => {
//     await deleteTask(id);
//     setTasks((t) => t.filter((x) => x._id !== id));
//   };

//   /* ================= AUTH ================= */

//   if (!user) return <Navigate to="/login" />;

//   const columns: Record<Task["status"], Task[]> = {
//     todo: tasks.filter((t) => t.status === "todo"),
//     "in-progress": tasks.filter((t) => t.status === "in-progress"),
//     done: tasks.filter((t) => t.status === "done"),
//   };
//   const handleDragEnd = async (result: DropResult) => {
//     const { destination, draggableId } = result;

//     if (!destination) return;

//     const newStatus = destination.droppableId as Task["status"];

//     const task = tasks.find((t) => t._id === draggableId);
//     if (!task || task.status === newStatus) return;

//     await updateTask(task._id, { status: newStatus });

//     setTasks((prev) =>
//       prev.map((t) =>
//         t._id === draggableId ? { ...t, status: newStatus } : t,
//       ),
//     );
//   };

//   /* ================= UI ================= */

//   return (
//     <div style={styles.wrapper}>
//       {/* ===== SIDEBAR ===== */}
//       <aside style={styles.sidebar}>
//         <h2 style={styles.logo}>TaskFlow</h2>
//         <div style={styles.user}>👋 {user.name}</div>

//         <div style={styles.sectionTitle}>Projects</div>

//         <div style={styles.projectList}>
//           {projects.map((p) => (
//             <div
//               key={p._id}
//               onClick={() => setSelectedProject(p._id)}
//               style={{
//                 ...styles.projectItem,
//                 background:
//                   selectedProject === p._id ? "#eef2ff" : "transparent",
//               }}
//             >
//               <span>{p.name}</span>

//               {/* 🔥 red trash */}
//               <button
//                 style={styles.deleteDanger}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleDeleteProject(p._id);
//                 }}
//               >
//                 🗑️
//               </button>
//             </div>
//           ))}
//         </div>

//         <div style={styles.inputRow}>
//           <input
//             style={styles.input}
//             placeholder="New project"
//             value={projectName}
//             onChange={(e) => setProjectName(e.target.value)}
//           />
//           <button style={styles.addBtn} onClick={handleCreateProject}>
//             +
//           </button>
//         </div>
//       </aside>

//       {/* ===== MAIN ===== */}
//       <main style={styles.main}>
//         {!selectedProject && (
//           <div style={styles.empty}>Select a project 👈</div>
//         )}

//         {selectedProject && (
//           <>
//             <h2 style={styles.header}>Tasks</h2>

//             <div style={styles.inputRow}>
//               <input
//                 style={styles.input}
//                 placeholder="Add new task..."
//                 value={taskTitle}
//                 onChange={(e) => setTaskTitle(e.target.value)}
//               />
//               <button style={styles.addBtn} onClick={handleCreateTask}>
//                 Add
//               </button>
//             </div>

//             {/* ===== TASKS ===== */}
//             <DragDropContext onDragEnd={handleDragEnd}>
//               <div style={styles.board}>
//                 {["todo", "in-progress", "done"].map((status) => (
//                   <Droppable droppableId={status} key={status}>
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.droppableProps}
//                         style={styles.column}
//                       >
//                         <h3 style={styles.columnTitle}>
//                           {status.toUpperCase()}
//                         </h3>

//                         {columns[status as keyof typeof columns].map(
//                           (t, index) => (
//                             <Draggable
//                               key={t._id}
//                               draggableId={t._id}
//                               index={index}
//                             >
//                               {(provided) => (
//                                 <div
//                                   ref={provided.innerRef}
//                                   {...provided.draggableProps}
//                                   {...provided.dragHandleProps}
//                                   style={{
//                                     ...styles.taskCard,
//                                     ...provided.draggableProps.style,
//                                     transform:
//                                       provided.draggableProps.style?.transform,
//                                   }}
//                                 >
//                                   <div style={{ fontWeight: 600 }}>
//                                     {t.title}
//                                   </div>

//                                   <button
//                                     style={styles.deleteDanger}
//                                     onClick={() => deleteTaskItem(t._id)}
//                                   >
//                                     🗑️
//                                   </button>
//                                 </div>
//                               )}
//                             </Draggable>
//                           ),
//                         )}

//                         {provided.placeholder}
//                       </div>
//                     )}
//                   </Droppable>
//                 ))}
//               </div>
//             </DragDropContext>
//           </>
//         )}
//       </main>
//     </div>
//   );
// }

// /* ================= BADGE HELPERS ================= */





// /* ================= STYLES ================= */

// const styles: { [key: string]: React.CSSProperties } = {
//   wrapper: {
//     display: "flex",
//     height: "100vh",
//     fontFamily: "system-ui, sans-serif",
//     background: "#f6f7fb",
//   },

//   sidebar: {
//     width: 260,
//     background: "white",
//     padding: 20,
//     borderRight: "1px solid #eee",
//     display: "flex",
//     flexDirection: "column",
//   },

//   logo: { fontWeight: 800, fontSize: 20, marginBottom: 20 },

//   user: { fontSize: 14, marginBottom: 20, color: "#666" },

//   sectionTitle: {
//     fontSize: 12,
//     fontWeight: 600,
//     marginBottom: 8,
//     color: "#888",
//   },

//   projectList: { flex: 1, overflowY: "auto" },

//   projectItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: 10,
//     borderRadius: 8,
//     cursor: "pointer",
//     marginBottom: 6,
//   },

//   main: { flex: 1, padding: 40 },

//   header: { marginBottom: 20 },

//   inputRow: { display: "flex", gap: 8, marginBottom: 20 },

//   input: {
//     flex: 1,
//     padding: 10,
//     borderRadius: 8,
//     border: "1px solid #ddd",
//   },

//   addBtn: {
//     padding: "0 16px",
//     borderRadius: 8,
//     border: "none",
//     background: "#6366f1",
//     color: "white",
//     cursor: "pointer",
//   },

//   taskList: { display: "flex", flexDirection: "column", gap: 10 },

//   taskCard: {
//     background: "white",
//     padding: 14,
//     borderRadius: 12,
//     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",

//     transition: "all 0.18s ease",
//     cursor: "grab",
//   },

//   taskCardHover: {
//     transform: "translateY(-3px)",
//     boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
//   },

//   taskText: { cursor: "pointer", fontWeight: 600 },

//   badgeRow: { display: "flex", gap: 8, marginTop: 6 },

//   deleteDanger: {
//     border: "none",
//     background: "transparent",
//     cursor: "pointer",
//     fontSize: 18,
//     color: "#ef4444",
//   },
//   board: {
//     display: "grid",
//     gridTemplateColumns: "repeat(3, 1fr)",
//     gap: 20,
//     alignItems: "start",
//   },

//   column: {
//     background: "#b5b7bf",
//     padding: 12,
//     borderRadius: 12,
//   },

//   columnTitle: {
//     fontSize: 14,
//     fontWeight: 700,
//     marginBottom: 12,
//   },

//   empty: { textAlign: "center", marginTop: 80, color: "#999" },
// };



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
  completed: boolean;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
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

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const [projectName, setProjectName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");

  /* ✨ NEW STATES */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [dark, setDark] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================= LOADERS ================= */

  useEffect(() => {
    if (!user) return;

    (async () => {
      const res = await getProjects();
      setProjects(res.data);

      if (res.data.length) setSelectedProject(res.data[0]._id);
    })();
  }, [user]);

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
    socket.on("task-created", (task: Task) => {
      setTasks((prev) => [...prev, task]);
      toast.success("Task created");
    });

    socket.on("task-updated", (task: Task) => {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
      toast("Task updated");
    });

    socket.on("task-deleted", (id: string) => {
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.error("Task deleted");
    });

    return () => {
      socket.off("task-created");
      socket.off("task-updated");
      socket.off("task-deleted");
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

    
    setTaskTitle("");
  };

  const deleteTaskItem = async (id: string) => {
    await deleteTask(id);
    
  };

  /* ✨ EDIT TITLE */
  const saveTitle = async (task: Task) => {
    if (!editValue.trim()) return setEditingId(null);

    await updateTask(task._id, { title: editValue });

    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id ? { ...t, title: editValue } : t,
      ),
    );

    setEditingId(null);
  };

  /* ================= DRAG ================= */

  const columns: Record<Task["status"], Task[]> = {
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    const newStatus = destination.droppableId as Task["status"];

    const task = tasks.find((t) => t._id === draggableId);
    if (!task || task.status === newStatus) return;

    await updateTask(task._id, { status: newStatus });

  };

  /* ================= AUTH ================= */

  if (!user) return <Navigate to="/login" />;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  /* ================= UI ================= */

  return (
    <div
      style={{
        ...styles.wrapper,
        background: dark ? "#111827" : "#f6f7fb",
        color: dark ? "white" : "black",
      }}
    >
      {/* ===== SIDEBAR ===== */}
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

        {projects.map((p) => (
          <div
            key={p._id}
            style={styles.projectItem}
            onClick={() => setSelectedProject(p._id)}
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

      {/* ===== MAIN ===== */}
      <main style={styles.main}>
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
              <Droppable droppableId={status} key={status}>
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
                            }}
                          >
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
                              <div
                                onDoubleClick={() => {
                                  setEditingId(t._id);
                                  setEditValue(t.title);
                                }}
                              >
                                {t.title}
                              </div>
                            )}

                            <span
                              style={{
                                ...styles.badge,
                                background: getPriorityColor(t.priority),
                              }}
                            >
                              {t.priority}
                            </span>

                            <button
                              style={styles.deleteDanger}
                              onClick={() => deleteTaskItem(t._id)}
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
      </main>
    </div>
  );
}

/* ================= STYLES ================= */

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
  },

  sidebar: {
    width: 260,
    background: "white",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  logo: { fontWeight: 800 },

  main: { flex: 1, padding: 40, background: "#f6f7fb" },

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
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
    transition: "0.2s",
    cursor: "grab",
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

  themeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },

  editInput: {
    flex: 1,
    borderRadius: 6,
    border: "1px solid #ddd",
  },
  userRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    fontSize: 14,
    color: "#666",
  },

  logoutBtn: {
    border: "none",
    background: "#ef4444",
    color: "white",
    borderRadius: 8,
    padding: "4px 8px",
    fontSize: 12,
    cursor: "pointer",
  },
};

