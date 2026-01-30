import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import { useEffect, useState } from "react";
import type { Task } from "../../types/task";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
  fetchTasks,
  reorderLocal,
  updateTask,
  selectTask,
  createTask,
} from "../../features/tasks/taskSlice";

import TaskCard from "./TaskCard";

const columns: Task["status"][] = ["todo", "in-progress", "done"];

export default function KanbanBoard() {
  const dispatch = useAppDispatch();

  const { list } = useAppSelector((s) => s.tasks);
  const projectId = useAppSelector((s) => s.projects.selectedId);

  const [title, setTitle] = useState("");

  /* ================= LOAD ================= */
  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchTasks(projectId));
  }, [projectId, dispatch]);

  /* ================= CREATE ================= */
  const handleCreateTask = () => {
    if (!title.trim() || !projectId) return;

    dispatch(
      createTask({
        title,
        projectId,
        status: "todo",
        priority: "medium",
        order: list.length,
      }),
    );

    setTitle("");
  };

  /* ================= DRAG ================= */
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    const newStatus = result.destination.droppableId as Task["status"];

    /* clone FULL list safely */
    const updated = [...list];

    const moved = { ...updated[sourceIndex] };

    /* remove */
    updated.splice(sourceIndex, 1);

    /* insert with new status */
    updated.splice(destIndex, 0, {
      ...moved,
      status: newStatus,
    });

    /* re-order */
    const ordered = updated.map((t, i) => ({
      ...t,
      order: i,
    }));

    /* instant UI */
    dispatch(reorderLocal(ordered));

    /* persist */
    ordered.forEach((t) =>
      dispatch(
        updateTask({
          id: t._id,
          data: {
            status: t.status,
            order: t.order,
          },
        }),
      ),
    );
  };

  /* ================= UI ================= */
  return (
    <div className="flex flex-1 flex-col p-6">
      {/* ADD BAR */}
      <div className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add new task..."
          className="flex-1 border rounded px-3 py-2 bg-white"
        />

        <button
          onClick={handleCreateTask}
          className="bg-indigo-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-1 gap-4 overflow-x-auto">
          {columns.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-1 min-w-[280px] bg-gray-100 rounded-xl p-3"
                >
                  <h3 className="font-semibold mb-3 capitalize">{status}</h3>

                  {list
                    .filter((t) => t.status === status)
                    .sort((a, b) => a.order - b.order)
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
                              onClick={() => dispatch(selectTask(task))}
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
    </div>
  );
}
