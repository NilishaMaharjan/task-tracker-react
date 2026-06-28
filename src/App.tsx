import { useState, useMemo } from "react"
import { useTaskContext } from "./context/TaskContext"
import { TaskForm } from "./components/TaskForm"
import { TaskItem } from "./components/TaskItem"
import { LoadingState } from "./components/LoadingState"
import { ErrorState } from "./components/ErrorState"
import "./App.css"

type Filter = "all" | "active" | "completed"

function App() {
  const {
    tasks,
    loading,
    error,
    editingId,
    addTask,
    deleteTask,
    toggleComplete,
    startEdit,
    saveEdit,
    cancelEdit,
  } = useTaskContext()  

  const [filter, setFilter] = useState<Filter>("all")


  const filteredTasks = useMemo(() =>
    tasks.filter(task => {
      if (filter === "active") return !task.completed
      if (filter === "completed") return task.completed
      return true
    }), [tasks, filter])

  const completedCount = useMemo(() =>
    tasks.filter(t => t.completed).length,
  [tasks])

  const remaining = tasks.length - completedCount

 
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />

 
  return (
    <div className="app-wrapper">
      <div className="app-container">

        <div className="app-header">
          <h1 className="app-title">My Tasks</h1>
          <p className="app-subtitle">
            {remaining} remaining · {completedCount} done
          </p>
        </div>

        <TaskForm onAdd={addTask} />

        <div className="filter-bar">
          {(["all", "active", "completed"] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-btn ${filter === f ? "filter-active" : ""}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>
              {filter === "completed"
                ? "No completed tasks yet."
                : "Nothing to do — add a task above!"}
            </p>
          </div>
        ) : (
          <ul className="task-list">
            {filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                isEditing={editingId === task.id}
                onDelete={deleteTask}
                onToggle={toggleComplete}
                onStartEdit={startEdit}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
              />
            ))}
          </ul>
        )}

        {tasks.length > 0 && completedCount > 0 && (
          <div className="progress-bar-wrap">
            <div
              className="progress-bar"
              style={{ width: `${Math.round((completedCount / tasks.length) * 100)}%` }}
            />
          </div>
        )}

      </div>
    </div>
  )
}

export default App