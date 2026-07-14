import { Navigate } from "react-router-dom"

interface Props {
  children: React.ReactElement 
}

export default function ProtectedRoute({ children }: Props) {

  const token = localStorage.getItem("accessToken")

  if (!token) {
    // If no token exists, cleanly redirect straight back to login
    return <Navigate to="/login" replace />
  }

  return children
}