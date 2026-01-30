import { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../../features/comments/commentSlice";

export default function CommentInput({
  taskId,
  projectId,
}: {
  taskId: string;
  projectId: string;
}) {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const submit = () => {
    if (!text.trim()) return;

    dispatch(
      addComment({
        taskId,
        projectId,
        text,
      }) as any,
    );

    setText("");
  };

  return (
    <div className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 flex-1 rounded"
        placeholder="Write comment..."
      />
      <button
        onClick={submit}
        className="bg-indigo-500 text-white px-3 rounded"
      >
        Send
      </button>
    </div>
  );
}
