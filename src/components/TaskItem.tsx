import { useState } from "react";
import type { Task } from "../types/task";

type TaskItemProps = {
  task: Task;
  isEditing: boolean;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onStartEdit: (id: number) => void;
  onSaveEdit: (id: number, newTitle: string) => void;
  onCancelEdit: () => void;
}

export function TaskItem({
  task,
  isEditing,
  onDelete,
  onToggle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
}: TaskItemProps) {
  const [editValue, setEditValue] = useState(task.title);

  if (isEditing) {
    return (
      <li className="task-item editing">
        <input
          type="text"
          value={editValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") onSaveEdit(task.id, editValue);
            if (e.key === "Escape") onCancelEdit();
          }}
          className="edit-input"
          autoFocus
        />
        <div className="edit-actions">
          <button onClick={() => onSaveEdit(task.id, editValue)} className="save-btn">
            Save
          </button>
          <button onClick={onCancelEdit} className="cancel-btn">
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={`task-item ${task.completed ? "completed" : ""}`}>
      <label className="checkbox-wrapper">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="checkbox-input"
        />
        <span className="checkbox-custom">
          {task.completed && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
      </label>

      <span className={`task-title ${task.completed ? "task-done" : ""}`}>
        {task.title}
      </span>

      <div className="task-actions">
        <button
          onClick={() => onStartEdit(task.id)}
          className="icon-btn edit-icon-btn"
          title="Edit task"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="icon-btn delete-icon-btn"
          title="Delete task"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    </li>
  );
}