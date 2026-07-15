import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

interface Props {
  children: React.ReactElement
}

export default function ProtectedRoute({ children }: Props) {

  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}