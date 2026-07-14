import type { Task } from "../types/task"
import { TaskItem } from "./TaskItem"

interface TaskListProps {
  tasks: Task[]
  editingId: string | null
  onDelete: (id: string) => void
  onToggle: (id: string) => void
  onStartEdit: (id: string) => void
  onSaveEdit: (id: string, newTitle: string) => Promise<void>
  onCancelEdit: () => void
}

export function TaskList({ 
  tasks, 
  editingId, 
  onDelete, 
  onToggle, 
  onStartEdit, 
  onSaveEdit, 
  onCancelEdit 
}: TaskListProps) {
  return (
    <ul className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task._id}
          task={task}
          isEditing={editingId === task._id}
          onDelete={onDelete}
          onToggle={onToggle}
          onStartEdit={onStartEdit}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
        />
      ))}
    </ul>
  )
}