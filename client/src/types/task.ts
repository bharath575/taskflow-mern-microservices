export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  _id: string;
  title: string;
  projectId: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  order: number;
  description?: string;
  dueDate?: string;
}
