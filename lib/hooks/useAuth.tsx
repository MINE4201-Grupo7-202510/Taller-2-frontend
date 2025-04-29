"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/lib/types"
import { mockUsers } from "@/lib/mocks"
import { delay } from "@/lib/utils"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: Error | null
  login: (userId: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al cargar
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        const storedUserId = localStorage.getItem("userId")
        if (storedUserId) {
          // Simular delay de red
          await delay(800)

          // Buscar el usuario en los mocks
          const foundUser = mockUsers.find((u) => u.user_id === storedUserId)
          if (foundUser) {
            setUser(foundUser)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error desconocido"))
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (userId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simular delay de red
      await delay(1000)

      // Buscar un usuario por ID exacto
      const foundUser = mockUsers.find((u) => u.user_id === userId)

      if (!foundUser) {
        throw new Error("Usuario no encontrado")
      }

      // Guardar en localStorage
      localStorage.setItem("userId", foundUser.user_id)
      setUser(foundUser)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error desconocido"))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("userId")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
