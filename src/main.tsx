import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

import { TaskProvider } from "./context/TaskContext"
import App from "./App"
import "./index.css"
import { AuthProvider } from "./context/AuthProvider"

// Create one QueryClient for the entire application
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)