import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

export default function Login() {
  const { login } = useAuth()
  const queryClient = useQueryClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      // Clear out old error messages immediately when the button is clicked!
      setError("")

      const response = await fetch(
        "http://localhost:5001/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.message)
        return
      }

      login(data.user, data.accessToken)

      // Clear any cached tasks from the previous user
      await queryClient.resetQueries({
        queryKey: ["tasks"],
      })

      // Now go to dashboard
      navigate("/dashboard")
    } catch {
      setError("Server connection failed")
    }
  }

  return (
    <div className="app-wrapper">
      <div className="app-container">

        <div className="app-header">
          <h1 className="app-title">Login</h1>
          <p className="app-subtitle">
            Sign in to continue
          </p>
        </div>

        <div className="task-form" style={{
          flexDirection: "column",
          gap: "15px"
        }}>

          <input
            className="task-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            className="task-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {error && (
            <p style={{
              color: "red",
              fontSize: "14px"
            }}>
              {error}
            </p>
          )}

          <button
            className="add-btn"
            onClick={handleLogin}
          >
            Login
          </button>

          <p style={{ marginTop: "15px", textAlign: "center", fontSize: "14px", color: "#666" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#007BFF", textDecoration: "none", fontWeight: "bold" }}>
              Sign up here
            </Link>
          </p>

        </div>

      </div>
    </div>
  )
}