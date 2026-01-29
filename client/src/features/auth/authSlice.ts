import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/* ================= LOGIN ================= */

export const login = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }) => {
    const res = await api.post("/auth/login", data);

    // ✅ persist both
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    return res.data.user;
  },
);

/* ================= REGISTER ================= */

export const register = createAsyncThunk(
  "auth/register",
  async (data: { name: string; email: string; password: string }) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },
);

/* ================= SLICE ================= */

const slice = createSlice({
  name: "auth",

  // ✅ AUTO RESTORE ON REFRESH
  initialState: {
    user: JSON.parse(localStorage.getItem("user") || "null"),
  },

  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },

  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { logout } = slice.actions;

export default slice.reducer;
