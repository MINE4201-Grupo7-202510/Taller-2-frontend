"use client"

import { useState, useEffect } from "react"
import type { ExperimentMetrics } from "@/lib/types"
import { mockExperimentMetrics } from "@/lib/mocks"
import { delay } from "@/lib/utils"

export function useExperiments() {
  const [metrics, setMetrics] = useState<ExperimentMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Simular delay de red
        await delay(2000)

        setMetrics(mockExperimentMetrics)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error desconocido"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  return {
    metrics,
    isLoading,
    error,
  }
}
