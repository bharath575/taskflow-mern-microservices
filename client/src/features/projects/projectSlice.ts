import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type  {  PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";

/* ================= TYPES ================= */

export type Project = {
  _id: string;
  name: string;
};

type ProjectState = {
  list: Project[]; // ✅ REQUIRED
  selectedId: string | null;
  loading: boolean;
};

/* ================= THUNKS ================= */

export const fetchProjects = createAsyncThunk<Project[]>(
  "projects/fetch",
  async () => {
    const res = await api.get("/projects");
    return res.data;
  },
);

export const createProject = createAsyncThunk<Project, { name: string }>(
  "projects/create",
  async (data) => {
    const res = await api.post("/projects", data);
    return res.data;
  },
);

export const deleteProject = createAsyncThunk<string, string>(
  "projects/delete",
  async (id) => {
    await api.delete(`/projects/${id}`);
    return id;
  },
);

/* ================= STATE ================= */

const initialState: ProjectState = {
  list: [], // ✅ IMPORTANT
  selectedId: localStorage.getItem("selectedProjectId"), // ✅ restore,
  loading: false,
};

/* ================= SLICE ================= */

const slice = createSlice({
  name: "projects",
  initialState,

  reducers: {
    /* SELECT PROJECT */
    setSelectedProject: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
      localStorage.setItem("selectedProjectId", action.payload);
    },
  },

  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchProjects.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;

        // auto select first project
        if (!s.selectedId && a.payload.length) {
          s.selectedId = a.payload[0]._id;
        }
      })

      /* CREATE */
      .addCase(createProject.fulfilled, (s, a) => {
        s.list.push(a.payload);
        s.selectedId = a.payload._id; // auto select new project
      })

      /* DELETE */
      .addCase(deleteProject.fulfilled, (s, a) => {
        s.list = s.list.filter((p) => p._id !== a.payload);

        // reset selection if deleted
        if (s.selectedId === a.payload) {
          s.selectedId = s.list.length ? s.list[0]._id : null;
        }
      });
  },
});

/* ================= EXPORTS ================= */

export const { setSelectedProject } = slice.actions;

export default slice.reducer;
