type Props = {
  task: any;
  onDelete: () => void;
  onUpdate: any;
};

export default function TaskCard({ task, onDelete, onUpdate }: Props) {
  return (
    <div className="bg-white p-3 rounded shadow mb-2 flex justify-between items-center">
      <span>{task.title}</span>

      <select
        value={task.priority}
        onChange={(e) => onUpdate(task._id, { priority: e.target.value })}
        className="text-xs border rounded"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button onClick={onDelete}>🗑️</button>
    </div>
  );
}
