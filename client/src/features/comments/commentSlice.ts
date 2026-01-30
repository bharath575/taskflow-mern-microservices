import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../services/commentApi";

export const fetchComments = createAsyncThunk(
  "comments/fetch",
  async (taskId: string) => {
    const res = await api.getComments(taskId);
    return res.data;
  },
);

export const addComment = createAsyncThunk(
  "comments/add",
  async (data: { taskId: string;projectId:string, text: string }) => {
    const res = await api.createComment(data);
    return res.data;
  },
);

const slice = createSlice({
  name: "comments",
  initialState: {
    list: [] as any[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.list = action.payload;
    });

    builder.addCase(addComment.fulfilled, (state, action) => {
      state.list.push(action.payload);
    });
  },
});

export default slice.reducer;
