import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/projects/projectSlice";
import taskReducer from "../features/tasks/taskSlice";
import commentReducer from "../features/comments/commentSlice"



export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    comments: commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
