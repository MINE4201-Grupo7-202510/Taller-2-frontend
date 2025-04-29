"use client"

import { useState, useEffect } from "react"
import type { Business } from "@/lib/types"
import { mockBusinesses } from "@/lib/mocks"
import { delay } from "@/lib/utils"

export function useBusiness(businessId?: string) {
  const [business, setBusiness] = useState<Business | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Obtener ciudades y categorías únicas de los negocios
  const cities = Array.from(new Set(mockBusinesses.map((b) => b.city)))
  const categories = Array.from(new Set(mockBusinesses.flatMap((b) => b.categories)))

  useEffect(() => {
    if (!businessId) {
      setIsLoading(false)
      return
    }

    const fetchBusiness = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Simular delay de red
        await delay(1000)

        // Buscar el negocio en los mocks
        const foundBusiness = mockBusinesses.find((b) => b.business_id === businessId)

        if (!foundBusiness) {
          throw new Error("Negocio no encontrado")
        }

        setBusiness(foundBusiness)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error desconocido"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchBusiness()
  }, [businessId])

  return {
    business,
    isLoading,
    error,
    cities,
    categories,
  }
}
