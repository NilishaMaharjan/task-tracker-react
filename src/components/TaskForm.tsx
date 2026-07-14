import { useState } from "react";
import type { Priority } from "../types/task";

type TaskFormProps = {
  onAdd: (
    title: string,
    priority: Priority
  ) => void;
};

export function TaskForm({ onAdd }: TaskFormProps) {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<
  Priority
>("medium");

  const handleAdd = () => {
    onAdd(input, priority);
    setInput("");
    setPriority("medium");
  };

  return (
    <div className="task-form">
      <input
        type="text"
        value={input}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") handleAdd();
        }}
        placeholder="Enter the task."
        className="task-input"
      />

      <select
      value={priority}
      onChange={(e) =>
        setPriority(e.target.value as Priority)
      }
    >
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
    
      <button onClick={handleAdd} className="add-btn">
        + Add Task
      </button>
    </div>
  );
}