"use client"

import { useState, useEffect } from "react"
import { useRecommendations } from "@/lib/hooks/useRecommendations"
import { useBusiness } from "@/lib/hooks/useBusiness"
import { RecommendationCard } from "@/components/recommendation-card"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { ErrorState } from "@/components/error-state"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Recommendation } from "@/lib/types"

export default function DashboardPage() {
  const [cityFilter, setCityFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const { recommendations, isLoading, error, provideFeedback } = useRecommendations()
  const { cities, categories } = useBusiness()

  const [filteredRecommendations, setFilteredRecommendations] = useState<Recommendation[]>([])

  useEffect(() => {
    if (!recommendations) return

    let filtered = [...recommendations]

    if (cityFilter) {
      filtered = filtered.filter((rec) => rec.business.city === cityFilter)
    }

    if (categoryFilter) {
      filtered = filtered.filter((rec) => rec.business.categories.includes(categoryFilter))
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (rec) =>
          rec.business.name.toLowerCase().includes(term) ||
          rec.business.categories.some((cat) => cat.toLowerCase().includes(term)),
      )
    }

    setFilteredRecommendations(filtered)
  }, [recommendations, cityFilter, categoryFilter, searchTerm])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Tus Recomendaciones</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} type="recommendation" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorState message="No pudimos cargar tus recomendaciones. Por favor, intenta de nuevo más tarde." />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tus Recomendaciones</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="city-filter">Filtrar por ciudad</Label>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger id="city-filter">
              <SelectValue placeholder="Todas las ciudades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ciudades</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category-filter">Filtrar por categoría</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <Input
            id="search"
            placeholder="Buscar por nombre o categoría"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredRecommendations.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">No se encontraron recomendaciones</h3>
          <p className="text-muted-foreground mt-2">Prueba con otros filtros</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setCityFilter("")
              setCategoryFilter("")
              setSearchTerm("")
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onFeedback={(id, isUseful) => provideFeedback(id, isUseful)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
