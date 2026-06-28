import { useState } from "react";

type TaskFormProps = {
  onAdd: (title: string) => void;
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    onAdd(input);
    setInput("");
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
      <button onClick={handleAdd} className="add-btn">
        + Add Task
      </button>
    </div>
  );
}