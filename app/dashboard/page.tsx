// filepath: app/dashboards/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRecommendations } from "@/lib/hooks/useRecommendations"
import { useBusiness } from "@/lib/hooks/useBusiness" // Fetches contexts now
import { RecommendationCard } from "@/components/recommendation-card"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { ErrorState } from "@/components/error-state"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { ApiRecommendation } from "@/lib/types" // Use the API type
import { useAuth } from "@/lib/hooks/useAuth" // To check if user is logged in

export default function DashboardPage() {
  const { user } = useAuth(); // Get user info

  // State for context filters - initialize with null or default values
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [dayPeriodFilter, setDayPeriodFilter] = useState<string | null>("evening"); // Default day period
  const [topN, setTopN] = useState(5); // Example: Allow changing top N
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch available contexts (cities, categories, day periods)
  const { cities, categories, dayPeriods, isLoading: isLoadingContexts, error: errorContexts } = useBusiness();

  // Fetch recommendations based on selected context
  const { recommendations, isLoading: isLoadingRecs, error: errorRecs, provideFeedback } = useRecommendations(
    cityFilter,
    categoryFilter,
    dayPeriodFilter,
    topN
  );

  const [filteredRecommendations, setFilteredRecommendations] = useState<ApiRecommendation[]>([]);

  // Set initial filters once contexts are loaded
  useEffect(() => {
    if (!isLoadingContexts && cities.length > 0 && !cityFilter) {
      setCityFilter(cities[0]); // Set default city
    }
    if (!isLoadingContexts && categories.length > 0 && !categoryFilter) {
      setCategoryFilter(categories[0]); // Set default category
    }
    // Default day period is already set
  }, [isLoadingContexts, cities, categories, cityFilter, categoryFilter]);


  // Apply local search term filtering AFTER recommendations are fetched
  useEffect(() => {
    if (!recommendations) {
      setFilteredRecommendations([]);
      return;
    }

    let filtered = [...recommendations];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (rec) =>
          rec.name.toLowerCase().includes(term) ||
          rec.categories.toLowerCase().includes(term) // Search in the categories string
      );
    }

    setFilteredRecommendations(filtered);
  }, [recommendations, searchTerm]); // Re-filter only when recs or search term change

  // Combine loading states
  const isLoading = isLoadingContexts || (isLoadingRecs && !!cityFilter && !!categoryFilter && !!dayPeriodFilter);
  // Combine errors
  const error = errorContexts || errorRecs;

  const handleClearFilters = () => {
      // Reset local search and potentially context filters if desired
      setSearchTerm("");
      // Optionally reset context filters to defaults or clear them
      // setCityFilter(cities.length > 0 ? cities[0] : null);
      // setCategoryFilter(categories.length > 0 ? categories[0] : null);
      // setDayPeriodFilter("evening");
  };

  // Show message if user is not logged in
   if (!user) {
       return <ErrorState message="Por favor, inicia sesión para ver tus recomendaciones." />;
   }

  // Show message if essential context is not yet selected
  const showSelectContextMessage = !cityFilter || !categoryFilter || !dayPeriodFilter;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tus Recomendaciones</h1>

      {/* Context Selection UI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-1">
          <Label htmlFor="city-filter">Ciudad</Label>
          <Select value={cityFilter ?? ""} onValueChange={setCityFilter} disabled={isLoadingContexts}>
            <SelectTrigger id="city-filter">
              <SelectValue placeholder="Selecciona ciudad..." />
            </SelectTrigger>
            <SelectContent>
              {isLoadingContexts ? <SelectItem value="loading" disabled>Cargando...</SelectItem> :
               cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="category-filter">Categoría</Label>
          <Select value={categoryFilter ?? ""} onValueChange={setCategoryFilter} disabled={isLoadingContexts}>
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="Selecciona categoría..." />
            </SelectTrigger>
            <SelectContent>
             {isLoadingContexts ? <SelectItem value="loading" disabled>Cargando...</SelectItem> :
              categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

         <div className="space-y-1">
          <Label htmlFor="day-period-filter">Periodo del Día</Label>
          <Select value={dayPeriodFilter ?? ""} onValueChange={setDayPeriodFilter} disabled={isLoadingContexts}>
            <SelectTrigger id="day-period-filter">
              <SelectValue placeholder="Selecciona periodo..." />
            </SelectTrigger>
            <SelectContent>
             {isLoadingContexts ? <SelectItem value="loading" disabled>Cargando...</SelectItem> :
              dayPeriods.map((period) => (
                <SelectItem key={period} value={period}>
                  {/* Capitalize first letter for display */}
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Optional: Top N Selector */}
        {/* <div className="space-y-1">
          <Label htmlFor="top-n">Top N</Label>
          <Input id="top-n" type="number" value={topN} onChange={(e) => setTopN(parseInt(e.target.value) || 5)} min="1" max="20" />
        </div> */}

        <div className="space-y-1">
          <Label htmlFor="search">Buscar en resultados</Label>
          <Input
            id="search"
            placeholder="Filtrar por nombre o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading || showSelectContextMessage}
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(topN)].map((_, i) => (
            <LoadingSkeleton key={i} type="recommendation" />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <ErrorState message={`Error: ${error.message}. Intenta de nuevo.`} />
      )}

      {/* No Context Selected State */}
      {!isLoading && !error && showSelectContextMessage && (
         <div className="text-center py-12">
            <h3 className="text-xl font-medium">Selecciona el contexto</h3>
            <p className="text-muted-foreground mt-2">Elige ciudad, categoría y periodo del día para obtener recomendaciones.</p>
        </div>
      )}

      {/* Results State */}
      {!isLoading && !error && !showSelectContextMessage && (
        <>
          {filteredRecommendations.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium">No se encontraron recomendaciones</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm ? "Prueba con otro término de búsqueda o limpia los filtros." : "No hay recomendaciones para este contexto o el usuario no tiene historial suficiente."}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleClearFilters}
              >
                Limpiar búsqueda
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecommendations.map((recommendation) => (
                <RecommendationCard
                  // Use business_id as key, assuming it's unique per request
                  key={recommendation.business_id}
                  recommendation={recommendation}
                  onFeedback={provideFeedback} // Pass the feedback handler
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}