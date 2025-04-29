"use client"

import { useState, useEffect } from "react"
import { useBusiness } from "@/lib/hooks/useBusiness"
import { useReviews } from "@/lib/hooks/useReviews"
import { BusinessCard } from "@/components/business-card"
import { RatingStars } from "@/components/rating-stars"
import { MapPreview } from "@/components/map-preview"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { ErrorState } from "@/components/error-state"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import type { Review } from "@/lib/types"
import Image from "next/image"

export default function BusinessPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { business, isLoading: businessLoading, error: businessError } = useBusiness(id)
  const { reviews, isLoading: reviewsLoading, error: reviewsError } = useReviews(id)

  const [currentPage, setCurrentPage] = useState(1)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const reviewsPerPage = 3

  const [paginatedReviews, setPaginatedReviews] = useState<Review[]>([])
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!reviews) return

    const start = (currentPage - 1) * reviewsPerPage
    const end = start + reviewsPerPage
    setPaginatedReviews(reviews.slice(start, end))
    setTotalPages(Math.ceil(reviews.length / reviewsPerPage))
  }, [reviews, currentPage])

  const nextPhoto = () => {
    if (!business) return
    setCurrentPhotoIndex((prev) => (prev + 1) % business.photos.length)
  }

  const prevPhoto = () => {
    if (!business) return
    setCurrentPhotoIndex((prev) => (prev - 1 + business.photos.length) % business.photos.length)
  }

  if (businessLoading || reviewsLoading) {
    return (
      <div className="space-y-8">
        <LoadingSkeleton type="business" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <LoadingSkeleton type="map" />
          <div className="space-y-4">
            <LoadingSkeleton type="text" count={3} />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Reseñas</h2>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <LoadingSkeleton key={i} type="review" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (businessError || reviewsError || !business) {
    return <ErrorState message="No pudimos cargar la información del negocio. Por favor, intenta de nuevo más tarde." />
  }

  return (
    <div className="space-y-8">
      <BusinessCard business={business} detailed />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-video rounded-lg overflow-hidden">
          {business.photos.length > 0 ? (
            <>
              <Image
                src={business.photos[currentPhotoIndex].url || "/placeholder.svg"}
                alt={business.photos[currentPhotoIndex].caption || business.name}
                fill
                className="object-cover"
              />
              {business.photos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
                    onClick={prevPhoto}
                    aria-label="Foto anterior"
                  >
                    &lt;
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
                    onClick={nextPhoto}
                    aria-label="Siguiente foto"
                  >
                    &gt;
                  </Button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {business.photos.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${index === currentPhotoIndex ? "bg-white" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                {business.photos[currentPhotoIndex].caption || `Foto de ${business.name}`}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-muted">No hay fotos disponibles</div>
          )}
        </div>

        <div>
          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="hours">Horarios</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="space-y-4 mt-4">
              <div>
                <h3 className="font-medium">Dirección</h3>
                <p className="text-muted-foreground">{business.address}</p>
                <p className="text-muted-foreground">
                  {business.city}, {business.state} {business.postal_code}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Categorías</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {business.categories.map((category) => (
                    <span
                      key={category}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium">Calificación</h3>
                <div className="flex items-center gap-2">
                  <RatingStars rating={business.stars} />
                  <span className="text-muted-foreground">({business.review_count} reseñas)</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="hours" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {business.hours ? (
                    <div className="space-y-2">
                      {Object.entries(business.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="font-medium">{getDayName(day)}</span>
                          <span>{hours}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hay información de horarios disponible</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <h3 className="font-medium mb-4">Ubicación</h3>
            <MapPreview latitude={business.latitude} longitude={business.longitude} name={business.name} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Reseñas</h2>

        {paginatedReviews.length > 0 ? (
          <>
            <div className="space-y-6">
              {paginatedReviews.map((review) => (
                <div key={review.review_id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{review.user.name}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(review.date)}</div>
                    </div>
                    <RatingStars rating={review.stars} />
                  </div>
                  <Separator className="my-3" />
                  <p className="text-sm">{review.text}</p>
                  <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                    <span>Útil: {review.useful}</span>
                    <span>Divertido: {review.funny}</span>
                    <span>Cool: {review.cool}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay reseñas disponibles para este negocio</p>
          </div>
        )}
      </div>
    </div>
  )
}

function getDayName(day: string): string {
  const days: Record<string, string> = {
    Monday: "Lunes",
    Tuesday: "Martes",
    Wednesday: "Miércoles",
    Thursday: "Jueves",
    Friday: "Viernes",
    Saturday: "Sábado",
    Sunday: "Domingo",
  }
  return days[day] || day
}
