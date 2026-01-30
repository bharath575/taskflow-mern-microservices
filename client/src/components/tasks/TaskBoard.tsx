import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/taskApi";

import TaskCard from "./TaskCard";

/* ========= types ========= */

type Task = {
  _id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  order?: number;
};

/* ========= component ========= */

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  const columns: Task["status"][] = ["todo", "in-progress", "done"];

  /* ========= load ========= */

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getTasks("");
    setTasks(res.data);
  };

  /* ========= create ========= */

  const add = async () => {
    if (!title.trim()) return;

    await createTask({
      title,
      status: "todo",
      priority: "medium",
      order: tasks.length,
    });

    setTitle("");
    load();
  };

  /* ========= delete ========= */

  const remove = async (id: string) => {
    await deleteTask(id);
    load();
  };

  /* ========= drag logic ========= */

  const onDragEnd = async (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const updated = [...tasks];

    // remove dragged
    const index = updated.findIndex((t) => t._id === draggableId);
    const [moved] = updated.splice(index, 1);

    // change column
    moved.status = destination.droppableId as Task["status"];

    // insert at new position
    updated.splice(destination.index, 0, moved);

    // recompute order
    const ordered = updated.map((t, i) => ({ ...t, order: i }));

    // optimistic UI
    setTasks(ordered);

    // persist
    await Promise.all(
      ordered.map((t) =>
        updateTask(t._id, {
          status: t.status,
          order: t.order,
        }),
      ),
    );
  };

  /* ========= UI ========= */

  return (
    <main className="flex-1 p-6 overflow-auto">
      {/* add task */}
      <div className="flex gap-2 mb-4">
        <input
          className="border rounded px-2 flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add task..."
        />
        <button onClick={add} className="bg-indigo-600 text-white px-4 rounded">
          Add
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {columns.map((col) => (
            <Droppable key={col} droppableId={col}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 rounded p-3 min-h-[400px]"
                >
                  <h3 className="font-semibold mb-3 capitalize">
                    {col.replace("-", " ")}
                  </h3>

                  {tasks
                    .filter((t) => t.status === col)
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard
                              task={task}
                              onDelete={() => remove(task._id)}
                              onUpdate={updateTask}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </main>
  );
}
