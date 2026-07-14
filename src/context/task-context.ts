import { createContext } from "react"
import { useTasks } from "../hooks/useTasks"

export type TaskContextType = ReturnType<typeof useTasks>

export const TaskContext = createContext<TaskContextType | null>(null)