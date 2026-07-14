import { useTasks } from "../hooks/useTasks"
import { TaskContext } from "./task-context"

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const taskData = useTasks()

  return (
    <TaskContext.Provider value={taskData}>
      {children}
    </TaskContext.Provider>
  )
}
