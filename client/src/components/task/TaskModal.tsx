import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { clearSelectedTask, updateTask } from "../../features/tasks/taskSlice";
import { useState, useEffect } from "react";

import {
  fetchComments,
  addComment,
} from "../../features/comments/commentSlice";


export default function TaskModal() {
  const dispatch = useDispatch();

  const task = useSelector((s: RootState) => s.tasks.selectedTask);

  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const comments = useSelector((s: RootState) => s.comments.list);
  const [text, setText] = useState("");


  useEffect(() => {
    if (!task) return;

    setDescription(task.description || "");
    setDueDate(task.dueDate || "");
  }, [task]);

  if (!task) return null;

  const save = () => {
    dispatch(
      updateTask({
        id: task._id,
        data: {
          description,
          dueDate,
        },
      }) as any,
    );

    dispatch(clearSelectedTask());
  };

  return (
    <div
      className="
        fixed inset-0
        bg-black/40
        flex items-center justify-center
        z-50
      "
      onClick={() => dispatch(clearSelectedTask())}
    >
      <div
        className="
          bg-white
          w-[420px]
          p-6
          rounded-xl
          shadow-xl
          flex flex-col gap-4
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* TITLE */}
        <h2 className="text-lg font-semibold">{task.title}</h2>

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="
            border
            rounded
            p-2
            h-28
            text-sm
          "
        />

        {/* DUE DATE */}
        <div>
          <label className="text-xs text-gray-500">Due Date</label>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border rounded p-2 w-full mt-1"
          />
        </div>

        {/* COMMENTS */}
        <div className="mt-2">
          <h4 className="text-sm font-semibold mb-2">Comments</h4>

          <div className="max-h-32 overflow-y-auto space-y-1 mb-2">
            {comments.map((c) => (
              <div
                key={c._id}
                className="bg-gray-100 rounded px-2 py-1 text-xs"
              >
                {c.text}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add comment..."
              className="flex-1 border rounded px-2 text-sm"
            />

            <button
              onClick={() => {
                if (!text.trim()) return;
                dispatch(addComment({ taskId: task._id,projectId: task.projectId, text }) as any);
                setText("");
              }}
              className="bg-indigo-600 text-white px-3 rounded text-sm"
            >
              Send
            </button>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => dispatch(clearSelectedTask())}
            className="px-3 py-1 text-sm border rounded"
          >
            Cancel
          </button>

          <button
            onClick={save}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
