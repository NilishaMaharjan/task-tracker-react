import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom"

import { useQueryClient } from "@tanstack/react-query"

import Dashboard from "./pages/Dashboard"
import Tasks from "./pages/Tasks"
import About from "./pages/About"
import Settings from "./pages/Settings"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Register from "./pages/Register"

import ProtectedRoute from "./components/ProtectedRoutes"
import { useAuth } from "./hooks/useAuth"

function MainNavigation() {
  const { user, logout } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (err) {
      console.error("Backend logout cleanup failed", err)
    } finally {
      // Clear React auth state
      logout()

      // Clear TanStack Query cache
      queryClient.clear()

      // Redirect to login
      navigate("/login", { replace: true })
    }
  }

  return (
    <header
      style={{
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <h2 style={{ margin: 0 }}>Task Tracker</h2>

      <nav
        style={{
          display: "flex",
          gap: "25px",
          alignItems: "center",
        }}
      >
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/about">About</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/profile">Profile</Link>

        {user ? (
          <button
            onClick={handleLogout}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              font: "inherit",
              color: "#000",
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  )
}

function App() {
  console.log("App Mounted")

  return (
    <BrowserRouter>
      <MainNavigation />

      <Routes>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App