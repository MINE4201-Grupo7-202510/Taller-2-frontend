"use client"

import { useState, useEffect } from "react"
import type { Review } from "@/lib/types"
import { mockReviews } from "@/lib/mocks"
import { delay } from "@/lib/utils"

export function useReviews(businessId: string) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Simular delay de red
        await delay(1200)

        // Filtrar reseñas por businessId
        const businessReviews = mockReviews.filter((r) => r.business_id === businessId)

        setReviews(businessReviews)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error desconocido"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [businessId])

  return {
    reviews,
    isLoading,
    error,
  }
}
