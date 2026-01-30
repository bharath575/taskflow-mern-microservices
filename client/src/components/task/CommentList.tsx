import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

export default function CommentList() {
  const comments = useSelector((s: RootState) => s.comments.list);

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {comments.map((c) => (
        <div key={c._id} className="text-sm bg-gray-100 p-2 rounded">
          {c.text}
        </div>
      ))}
    </div>
  );
}
