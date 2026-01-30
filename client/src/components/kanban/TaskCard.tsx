import { useDispatch } from "react-redux";
import { selectTask, updateTask } from "../../features/tasks/taskSlice";
import type { AppDispatch } from "../../app/store";
import type { Task } from "../../types/task";

type Props = {
  task: Task;
  onClick: () => void;
};

const priorityColor: Record<Task["priority"], string> = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

export default function TaskCard({ task, onClick }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div
      onClick={() => {
        dispatch(selectTask(task)); // open modal
        onClick?.();
      }}
      className="
        bg-white
        p-3
        rounded-lg
        shadow
        mb-2
        cursor-pointer
        hover:shadow-lg
        transition
        border
      "
    >
      {/* ===== TITLE ===== */}
      <div className="font-medium text-sm">{task.title}</div>

      {/* ===== DUE DATE ===== */}
      {task.dueDate && (
        <div className="text-xs text-gray-500 mt-1">
          📅 {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}

      {/* ===== PRIORITY SELECT (single only) ===== */}
      <select
        value={task.priority}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) =>
          dispatch(
            updateTask({
              id: task._id,
              data: {
                priority: e.target.value as Task["priority"], // ✅ typed
              },
            }),
          )
        }
        className={`
          mt-2 text-xs px-2 py-1 rounded text-white
          ${priorityColor[task.priority]}
        `}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
}
