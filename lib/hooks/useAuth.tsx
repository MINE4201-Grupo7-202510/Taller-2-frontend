"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/lib/types"
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
          // Obtener el usuario de la API
          const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: storedUserId }),
          });

          if (!response.ok) {
            throw new Error('Error al recuperar sesión');
          }

          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error desconocido"))
        // Si hay error al recuperar el usuario, limpiamos localStorage
        localStorage.removeItem("userId")
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
      // Simular delay de red para mejorar UX
      await delay(300)

      console.log('Intentando login con ID:', userId);

      // Llamar a la API para autenticar al usuario
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error de respuesta:', response.status, data);
        throw new Error(data.error || `Error al iniciar sesión (${response.status})`);
      }

      console.log('Usuario autenticado:', data.user);

      // Guardar en localStorage
      localStorage.setItem("userId", data.user.user_id);
      setUser(data.user);
    } catch (err) {
      console.error('Error durante login:', err);
      setError(err instanceof Error ? err : new Error("Error desconocido"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const logout = () => {
    localStorage.removeItem("userId");
    setUser(null);
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