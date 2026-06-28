import { useState, useEffect } from "react"
import type { Task, FetchState } from "../types/task"

//The URL of fake backend
const API_URL = "http://localhost:3001/tasks"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])

  const [fetchState, setFetchState] = useState<FetchState>({
    loading: true, 
    error: null
  })

  // editingId — tracks which task ID is currently being modified by the user in the UI
  const [editingId, setEditingId] = useState<number | null>(null)


  useEffect(() => {
    async function loadTasks() {
      try {
        setFetchState({ loading: true, error: null })

        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`)
        }

        const data: Task[] = await response.json()

        //Update state to populate data and turn off the loading screen
        setTasks(data)
        setFetchState({ loading: false, error: null })

      } catch (err) {
        // Catches true network failures or manual exceptions thrown above
        const message = err instanceof Error ? err.message : "Unknown error"
        setFetchState({ loading: false, error: message })
      }
    }

    // Fire the async operation immediately on component mount
    loadTasks()
  }, []) 


  //CREATE: ADD TASK 
  const addTask = async (title: string) => {
    if (title.trim() === "") return

    const newTask = {
      title: title.trim(),
      completed: false
      // Note: No id is sent. json-server automatically increments and generates it on the server-side.
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json" // Informs the server it needs to parse incoming JSON payload
        },
        body: JSON.stringify(newTask) // Converts the JS object to a string format for transmission
      })

      if (!response.ok) throw new Error(`Failed to add: ${response.status}`)

      // The server returns the newly saved task complete with its fresh ID
      const created: Task = await response.json()

      // Optimistic/Local state update: cleanly appends the fresh record using the functional state pattern
      setTasks(prev => [...prev, created])

    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add task"
      setFetchState(prev => ({ ...prev, error: message }))
    }
  }


  //DELETE: REMOVE TASK (DELETE)
  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error(`Failed to delete: ${response.status}`)

      // Filter out the dropped item from local memory to avoid needing a secondary full-page refetch
      setTasks(prev => prev.filter(task => task.id !== id))

    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete task"
      setFetchState(prev => ({ ...prev, error: message }))
    }
  }


  //UPDATE: TOGGLE COMPLETION STATE (PUT)
  const toggleComplete = async (id: number) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, completed: !task.completed })
      })

      if (!response.ok) throw new Error(`Failed to update: ${response.status}`)

      const updated: Task = await response.json()

      // Map through local state and swap out the stale object with the new one confirmed by the server
      setTasks(prev => prev.map(t => t.id === id ? updated : t))

    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update task"
      setFetchState(prev => ({ ...prev, error: message }))
    }
  }

 //Update 
  const startEdit = (id: number) => setEditingId(id)
  const cancelEdit = () => setEditingId(null)

  const saveEdit = async (id: number, newTitle: string) => {
    if (newTitle.trim() === "") return

    const task = tasks.find(t => t.id === id)
    if (!task) return

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, title: newTitle.trim() })
      })

      if (!response.ok) throw new Error(`Failed to save: ${response.status}`)

      const updated: Task = await response.json()
      setTasks(prev => prev.map(t => t.id === id ? updated : t))
      setEditingId(null) 

    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save edit"
      setFetchState(prev => ({ ...prev, error: message }))
    }
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