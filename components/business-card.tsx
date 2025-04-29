import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RatingStars } from "@/components/rating-stars"
import type { Business } from "@/lib/types"
import { MapPin, Clock, ExternalLink } from "lucide-react"

interface BusinessCardProps {
  business: Business
  detailed?: boolean
}

export function BusinessCard({ business, detailed = false }: BusinessCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{business.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {business.city}, {business.state}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <RatingStars rating={business.stars} />
            <span className="text-sm text-muted-foreground mt-1">{business.review_count} reseñas</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {business.categories.slice(0, detailed ? undefined : 3).map((category) => (
            <span key={category} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
              {category}
            </span>
          ))}
          {!detailed && business.categories.length > 3 && (
            <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
              +{business.categories.length - 3} más
            </span>
          )}
        </div>

        {business.hours && (
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Clock className="h-4 w-4 mr-1" />
            {business.is_open ? "Abierto" : "Cerrado"} •
            {business.hours.Monday &&
              ` Horario: ${business.hours.Monday.split("-")[0]} - ${business.hours.Monday.split("-")[1]}`}
          </div>
        )}

        {detailed && business.attributes && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {Object.entries(business.attributes).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="font-medium">{formatAttributeKey(key)}: </span>
                <span className="text-muted-foreground">{formatAttributeValue(value)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {!detailed && (
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={`/business/${business.business_id}`}>
              Ver Detalles <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

function formatAttributeKey(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function formatAttributeValue(value: any): string {
  if (typeof value === "boolean") {
    return value ? "Sí" : "No"
  }
  if (typeof value === "object" && value !== null) {
    return Object.entries(value)
      .map(([k, v]) => `${formatAttributeKey(k)}: ${formatAttributeValue(v)}`)
      .join(", ")
  }
  return String(value)
}
