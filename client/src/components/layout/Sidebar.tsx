import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";

import {
  fetchProjects,
  createProject,
  deleteProject,
  setSelectedProject,
} from "../../features/projects/projectSlice";

import { logout } from "../../features/auth/authSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  const { list, selectedId } = useSelector((s: RootState) => s.projects);
  const user = useSelector((s: RootState) => s.auth.user);

  const [name, setName] = useState("");

  /* ========= LOAD ========= */
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // ✅ MUST redirect
  };

  /* ========= CREATE ========= */
  const handleCreate = () => {
    if (!name.trim()) return;

    dispatch(createProject({ name }));
    setName("");
  };

  /* ========= DELETE ========= */
  const handleDelete = (id: string) => {
    dispatch(deleteProject(id));
  };

  return (
    <aside className="w-64 bg-white border-r flex flex-col p-4 gap-4">
      <h2 className="text-xl font-bold">TaskFlow</h2>

      <div className="text-sm">👋 {user?.name}</div>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white rounded p-2"
      >
        Logout
      </button>

      {/* Projects */}
      <div className="flex flex-col gap-2 mt-4">
        {list.map((p) => (
          <div
            key={p._id}
            onClick={() => dispatch(setSelectedProject(p._id))}
            className={`
              flex justify-between items-center p-2 rounded cursor-pointer
              ${selectedId === p._id ? "bg-indigo-600 text-white" : "hover:bg-gray-100"}
            `}
          >
            <span>{p.name}</span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(p._id);
              }}
              className="text-red-500"
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      {/* Add project */}
      <div className="flex gap-2 mt-auto">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New project"
          className="flex-1 border rounded px-2"
        />
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-3 rounded"
        >
          +
        </button>
      </div>
    </aside>
  );
}
