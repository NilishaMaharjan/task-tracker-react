import { Link } from "react-router-dom"
import { useTaskContext } from "../hooks/useTaskContext"

export default function Dashboard() {
  console.log("Dashboard Rendered")

  const { tasks } = useTaskContext()

  const completed = tasks.filter(t => t.completed).length
  const pending = tasks.length - completed

  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completed / tasks.length) * 100)

  return (
    <div className="app-wrapper">
      <div className="app-container">

        <div className="app-header">
          <h1 className="app-title">Dashboard</h1>

          <p className="app-subtitle">
            Welcome back!! Here's your productivity overview.
          </p>
        </div>

        <div className="dashboard-stats">

          <div className="dashboard-card">
            <div className="dashboard-number">
              {tasks.length}
            </div>

            <div className="dashboard-label">
              Total Tasks
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-number completed">
              {completed}
            </div>

            <div className="dashboard-label">
              Completed
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-number pending">
              {pending}
            </div>

            <div className="dashboard-label">
              Pending
            </div>
          </div>

        </div>

        <div className="dashboard-progress-section">
          <div className="dashboard-progress-text">
            Progress: {progress}% completed
          </div>

          <div className="progress-bar-wrap">
            <div
              className="progress-bar"
              style={{
                width: `${progress}%`
              }}
            />
          </div>
        </div>

        <div className="dashboard-action">
          <Link
            to="/tasks"
            className="dashboard-btn"
          >
             Open Task Manager
          </Link>
        </div>

      </div>
    </div>
  )
}