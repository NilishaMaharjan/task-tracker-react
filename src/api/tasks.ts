import api from "./axios"
import type { Task, Priority } from "../types/task"

const TASKS_URL = "/tasks"

// GET
export async function fetchTasks() {
  console.log("Fetching tasks...")

  const { data } = await api.get<Task[]>("/tasks")

  console.log("Tasks received:", data)

  return data
}

// CREATE
export async function createTask(
  title: string,
  priority: Priority
): Promise<Task> {
  const { data } = await api.post<Task>(TASKS_URL, {
    title,
    priority,
  })

  return data
}

// UPDATE
export async function updateTask(
  id: string,
  updates: Partial<Task>
): Promise<Task> {
  const { data } = await api.put<Task>(
    `${TASKS_URL}/${id}`,
    updates
  )

  return data
}

// DELETE
export async function deleteTask(id: string): Promise<void> {
  await api.delete(`${TASKS_URL}/${id}`)
}