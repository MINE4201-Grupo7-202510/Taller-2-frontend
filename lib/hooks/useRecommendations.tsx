"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import type { Recommendation } from "@/lib/types"
import { mockRecommendations } from "@/lib/mocks"
import { delay } from "@/lib/utils"

export function useRecommendations() {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setRecommendations([])
      setIsLoading(false)
      return
    }

    const fetchRecommendations = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Simular delay de red
        await delay(1500)

        // Filtrar recomendaciones por userId
        const userRecommendations = mockRecommendations.filter((r) => r.id.startsWith(user.user_id.substring(0, 8)))

        if (userRecommendations.length === 0) {
          // Si no hay recomendaciones específicas, usar las primeras 3
          setRecommendations(mockRecommendations.slice(0, 3))
        } else {
          setRecommendations(userRecommendations)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error desconocido"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [user])

  const provideFeedback = async (id: string, isUseful: boolean) => {
    try {
      // Simular delay de red
      await delay(500)

      // Actualizar el estado local
      setRecommendations((prev) => prev.map((rec) => (rec.id === id ? { ...rec, userFeedback: isUseful } : rec)))

      // En un caso real, aquí se enviaría la información al backend
      console.log(`Feedback enviado: ${id}, ${isUseful ? "Útil" : "No Útil"}`)

      return true
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error al enviar feedback"))
      return false
    }
  }

  return {
    recommendations,
    isLoading,
    error,
    provideFeedback,
  }
}
