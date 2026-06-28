import { createContext, useContext } from "react"
import { useTasks } from "../hooks/useTasks"
import type { Task } from "../types/task"

// error state, and all the action functions."
interface TaskContextType {
  tasks: Task[]
  loading: boolean
  error: string | null
  editingId: number | null
  addTask: (title: string) => Promise<void>
  deleteTask: (id: number) => Promise<void>
  toggleComplete: (id: number) => Promise<void>
  startEdit: (id: number) => void
  saveEdit: (id: number, newTitle: string) => Promise<void>
  cancelEdit: () => void
}

// null is the default but is wrapped in the 
// TaskProvider below, so null is never actually used.
const TaskContext = createContext<TaskContextType | null>(null)


export function TaskProvider({ children }: { children: React.ReactNode }) {
  // useTasks() runs once here and puts everything inside the wrapper 
  const taskData = useTasks()

  return (
    <TaskContext.Provider value={taskData}>
      {children}
    </TaskContext.Provider>
  )
}

// Instead of calling useContext(TaskContext) everywhere,
// we wrap it in a nice custom hook: useTaskContext()
// Any component that wants tasks just calls this one line.
export function useTaskContext(): TaskContextType {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTaskContext must be used inside TaskProvider")
  }

  return context
}