import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { Task } from "../../types/task";

/* ================= TYPES ================= */



interface TasksState {
  list: Task[];
  selectedTask: Task | null;
}

const initialState: TasksState = {
  list: [],
  selectedTask: null,
};

/* ================= ASYNC ================= */

export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async (projectId: string) => {
    const res = await api.get(`/tasks?projectId=${projectId}`);
    return res.data as Task[];
  },
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (data: Partial<Task>) => {
    const res = await api.post("/tasks", data);
    return res.data as Task;
  },
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, data }: { id: string; data: Partial<Task> }) => {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data as Task;
  },
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id: string) => {
    await api.delete(`/tasks/${id}`);
    return id;
  },
);

/* ================= SLICE ================= */



const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    selectTask: (state, action: PayloadAction<Task>) => {
      state.selectedTask = action.payload;
    },

    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },

    reorderLocal: (state, action: PayloadAction<Task[]>) => {
      state.list = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.list = action.payload;
      })

      .addCase(createTask.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.list.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.payload);
      });
  },
});

/* ================= EXPORTS ================= */

export const { selectTask, clearSelectedTask, reorderLocal } = slice.actions;

export default slice.reducer;
