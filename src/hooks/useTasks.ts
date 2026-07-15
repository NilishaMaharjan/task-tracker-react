import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Task, Priority } from "../types/task"
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/tasks"
import { useAuth } from "./useAuth"

export function useTasks() {
  const queryClient = useQueryClient()

  const [editingId, setEditingId] =
    useState<string | null>(null)


  // GET tasks 
  const { user } = useAuth()

  const userId = user?.id

  console.log("useTasks rendered")
  console.log("Current user:", user)
  console.log("Current userId:", userId)

  const {
    data: tasks = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["tasks", userId],
    queryFn: fetchTasks,
    enabled: !!userId,
  })


  // CREATE task
  const createMutation = useMutation({
    mutationFn: ({
      title,
      priority,
    }: {
      title: string
      priority: Priority
    }) => createTask(title, priority),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", userId],
      })
    },
  })

  // UPDATE task
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<Task>
    }) => updateTask(id, updates),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", userId],
      })
    },
  })

  // DELETE task
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      deleteTask(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", userId],
      })
    },
  })


  // PUBLIC FUNCTION
  const addTask = async (
    title: string,
    priority: Priority
  ) => {
    if (!title.trim()) return

    await createMutation.mutateAsync({
      title: title.trim(),
      priority,
    })
  }

  const removeTask = async (id: string) => {
    await deleteMutation.mutateAsync(id)
  }

  const toggleComplete = async (
    id: string
  ) => {
    const task = tasks.find(
      t => t._id === id
    )

    if (!task) return

    await updateMutation.mutateAsync({
      id,
      updates: {
        completed: !task.completed,
      },
    })
  }

  const saveEdit = async (
    id: string,
    newTitle: string
  ) => {
    if (!newTitle.trim()) return

    await updateMutation.mutateAsync({
      id,
      updates: {
        title: newTitle.trim(),
      },
    })

    setEditingId(null)
  }

  const startEdit = (id: string) =>
    setEditingId(id)

  const cancelEdit = () =>
    setEditingId(null)

  return {
    tasks,
    loading,

    error:
      error instanceof Error
        ? error.message
        : null,
    editingId,
    addTask,
    deleteTask: removeTask,
    toggleComplete,
    saveEdit,
    startEdit,
    cancelEdit,
  }
}