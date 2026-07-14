import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import Tasks from "./pages/Tasks"
import About from "./pages/About"
import Settings from "./pages/Settings"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import ProtectedRoute from "./components/ProtectedRoutes"
import Register from "./pages/Register"

// Separate Header sub-component so we can use the useNavigate() hook inside it safely
function MainNavigation() {
  // Read local storage to see if a user state exists
  const userString = localStorage.getItem("user")
  const user = userString ? JSON.parse(userString) : null

  const handleLogout = async () => {
    try {
      // 1. Tell backend to wipe out the HttpOnly cookie container
      await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        credentials: "include" // Necessary to pass the cookie along to clear it
      })
    } catch (err) {
      console.error("Backend logout cleanup failed", err)
    } finally {
      // 2. Clear frontend state completely regardless of network speed
      localStorage.removeItem("user")
      localStorage.removeItem("accessToken")

      // hard refresh 
      window.location.href = "/login"
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
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}
    >
      <h2 style={{ margin: 0 }}>Task Tracker</h2>

      <nav style={{ display: "flex", gap: "25px", alignItems: "center" }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/about">About</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/profile">Profile</Link>

        {/*mart Navigation Check */}

        {user ? (
          <a
            href="#logout"
            onClick={(e) => {
              e.preventDefault() // Prevents the browser from reloading or jumping the page
              handleLogout()
            }}
            style={{
              color: "#000000",
              textDecoration: "none",
              cursor: "pointer"
            }}
          >
            Logout
          </a>
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
      {/* Moved Header inside BrowserRouter so useNavigate hooks find Context */}
      <MainNavigation />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App