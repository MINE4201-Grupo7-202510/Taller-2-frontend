// filepath: lib/hooks/useRecommendations.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import type { ApiRecommendation } from "@/lib/types" // Use ApiRecommendation

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Define default values for the request
const DEFAULT_TOP_N = 5
const DEFAULT_W_KNN = 0.3
const DEFAULT_W_SVD = 0.5
const DEFAULT_W_CONTEXT = 0.2

// Define the request body type based on the backend model
interface ApiRecommendationRequest {
    user_id: string;
    context_city: string;
    context_day_period: string;
    context_category: string;
    top_n?: number;
    w_knn?: number;
    w_svd?: number;
    w_context?: number;
}

export function useRecommendations(
    // Accept context parameters
    city: string | null,
    category: string | null,
    dayPeriod: string | null,
    topN: number = DEFAULT_TOP_N
) {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<ApiRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(false) // Start false, true during fetch
  const [error, setError] = useState<Error | null>(null)

  const fetchRecommendations = useCallback(async () => {
    if (!user || !city || !category || !dayPeriod) {
      // Don't fetch if essential context is missing
      setRecommendations([])
      setIsLoading(false)
      setError(null) // Clear previous errors if context becomes invalid
      return
    }

    setIsLoading(true)
    setError(null)

    if (!API_URL) {
      setError(new Error("API URL not configured."))
      setIsLoading(false)
      return
    }

    const requestBody: ApiRecommendationRequest = {
      user_id: user.user_id,
      context_city: city,
      context_day_period: dayPeriod,
      context_category: category,
      top_n: topN,
      w_knn: DEFAULT_W_KNN, // Use defaults or allow customization
      w_svd: DEFAULT_W_SVD,
      w_context: DEFAULT_W_CONTEXT,
    }

    try {
      console.log("Fetching recommendations with body:", requestBody); // Log request
      const response = await fetch(`${API_URL}/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }))
        console.error("API Error Response:", errorData);
        throw new Error(`Failed to fetch recommendations: ${errorData.detail || response.statusText}`)
      }

      const data = await response.json()
      console.log("Received recommendations:", data); // Log response

      // Ensure the response has the 'recommendations' field
      if (data && Array.isArray(data.recommendations)) {
         // Add a temporary client-side feedback state if needed
         const recommendationsWithFeedback = data.recommendations.map((rec: ApiRecommendation) => ({
            ...rec,
            userFeedback: null // Initialize feedback state
         }));
         setRecommendations(recommendationsWithFeedback);
      } else {
         console.warn("Unexpected API response structure:", data);
         setRecommendations([]); // Set empty if structure is wrong
      }

    } catch (err) {
      console.error("Error fetching recommendations:", err)
      setError(err instanceof Error ? err : new Error("Failed to load recommendations"))
      setRecommendations([]) // Clear recommendations on error
    } finally {
      setIsLoading(false)
    }
  }, [user, city, category, dayPeriod, topN]) // Dependencies for useCallback

  useEffect(() => {
    // Fetch when component mounts or dependencies change
    fetchRecommendations()
  }, [fetchRecommendations]) // fetchRecommendations is the dependency

  const provideFeedback = async (business_id: string, isUseful: boolean) => {
    // Keep feedback client-side for now, as there's no backend endpoint
    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.business_id === business_id ? { ...rec, userFeedback: isUseful } : rec
      )
    )
    console.log(`Feedback provided (client-side): ${business_id}, ${isUseful ? "Útil" : "No Útil"}`)
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 300));
    return true; // Assume success
  }

  return {
    recommendations,
    isLoading,
    error,
    provideFeedback,
    refetch: fetchRecommendations // Expose refetch function if needed externally
  }
}