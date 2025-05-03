// filepath: lib/hooks/useBusiness.tsx
"use client"

import { useState, useEffect } from "react"
import type { ApiContexts } from "@/lib/types" // Use the new type

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useBusiness() {
  const [cities, setCities] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [dayPeriods, setDayPeriods] = useState<string[]>(['morning', 'afternoon', 'evening', 'night']) // Default or fetch
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchContexts = async () => {
      setIsLoading(true)
      setError(null)
      if (!API_URL) {
        setError(new Error("API URL not configured."))
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_URL}/available-contexts`)
        if (!response.ok) {
          throw new Error(`Failed to fetch contexts: ${response.statusText}`)
        }
        const data: ApiContexts = await response.json()

        // Sort alphabetically for better UX in dropdowns
        setCities(data.cities.sort() || [])
        setCategories(data.categories.sort() || [])
        // If your API returns day_periods, use data.day_periods
        // setDayPeriods(data.day_periods.sort() || [])

      } catch (err) {
        console.error("Error fetching contexts:", err)
        setError(err instanceof Error ? err : new Error("Failed to load context data"))
        // Provide default values or keep empty on error?
        setCities([])
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchContexts()
  }, [])

  // Removed the single business fetching logic as it's not used in the dashboard
  // and the backend endpoint wasn't specified for it.

  return {
    cities,
    categories,
    dayPeriods, // Return day periods as well
    isLoading,
    error,
  }
}