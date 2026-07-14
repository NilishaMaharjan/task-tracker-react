import { useState, useEffect } from "react"
import axios from "axios"
import api from "../api/axios"
import type { Task, FetchState, Priority } from "../types/task"

const TASKS_URL = "/tasks"

function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? err.message ?? fallback
  }
  return err instanceof Error ? err.message : fallback
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])

  const [fetchState, setFetchState] = useState<FetchState>({
    loading: true,
    error: null
  })
  // CHANGED: editingId tracks a MongoDB string ID now
  const [editingId, setEditingId] = useState<string | null>(null)


  useEffect(() => {
    async function loadTasks() {
      try {
        setFetchState({ loading: true, error: null })

        const { data } = await api.get<Task[]>(TASKS_URL)

        setTasks(data)
        setFetchState({ loading: false, error: null })

      } catch (err) {
        const message = getErrorMessage(err, "Unknown error")
        setFetchState({ loading: false, error: message })
      }
    }

    loadTasks()
  }, [])


  // CREATE: ADD TASK
  const addTask = async (
    title: string,
    priority: Priority
  ) => {
    if (!title.trim()) return

    try {
      const { data: created } = await api.post<Task>(TASKS_URL, {
        title: title.trim(),
        priority,
      })

      setTasks(prev => [...prev, created])

    } catch (err) {
      const message = getErrorMessage(err, "Failed to add task")
      setFetchState(prev => ({ ...prev, error: message }))
    }
  }


  // DELETE: REMOVE TASK (CHANGED: id type is now string, filter tracks _id)
  const deleteTask = async (id: string) => {
    try {
      await api.delete(`${TASKS_URL}/${id}`)

      // CHANGED: Match against task._id
      setTasks(prev => prev.filter(task => task._id !== id))

    } catch (err) {
      const message = getErrorMessage(err, "Failed to delete task")
      setFetchState(prev => ({ ...prev, error: message }))
    }
  }


  // UPDATE: TOGGLE COMPLETION STATE (CHANGED: id type is string, maps via _id)
  const updateTask = async (
    id: string,
    updates: Partial<Task>
  ): Promise<Task | undefined> => {
    const task = tasks.find(t => t._id === id)

    if (!task) return

    try {
      const { data: updated } = await api.put<Task>(
        `${TASKS_URL}/${id}`,
        {
          title: updates.title ?? task.title,
          completed: updates.completed ?? task.completed,
          priority: updates.priority ?? task.priority,
        }
      )

      setTasks(prev =>
        prev.map(t =>
          t._id === id ? updated : t
        )
      )

      return updated
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to update task"
      )

      setFetchState(prev => ({
        ...prev,
        error: message,
      }))

      return undefined
    }
  }

  const toggleComplete = async (id: string) => {
    const task = tasks.find(t => t._id === id)

    if (!task) return

    await updateTask(id, {
      completed: !task.completed,
    })
  }

  // Update Edit States (CHANGED: id type is string)
  const startEdit = (id: string) => setEditingId(id)
  const cancelEdit = () => setEditingId(null)

  const saveEdit = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) return

    await updateTask(id, {
      title: newTitle.trim(),
    })

    setEditingId(null)
  }

  return {
    tasks,
    loading: fetchState.loading,
    error: fetchState.error,
    editingId,
    addTask,
    deleteTask,
    toggleComplete,
    startEdit,
    saveEdit,
    cancelEdit,
  }
}