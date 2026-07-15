import { useState } from "react"
import { AuthContext, type User } from "./AuthContext"

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user")

    return storedUser
      ? JSON.parse(storedUser)
      : null
  })

  const login = (
    user: User,
    accessToken: string
  ) => {
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    )

    localStorage.setItem(
      "accessToken",
      accessToken
    )

    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("accessToken")

    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}