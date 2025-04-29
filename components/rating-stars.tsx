import { Star, StarHalf } from "lucide-react"

interface RatingStarsProps {
  rating: number
  max?: number
  size?: "sm" | "md" | "lg"
}

export function RatingStars({ rating, max = 5, size = "md" }: RatingStarsProps) {
  // Determinar el tamaño de las estrellas
  const starSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }[size]

  // Crear un array para representar las estrellas
  const stars = []

  // Calcular estrellas completas y medias
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  // Agregar estrellas completas
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full-${i}`} className={`${starSize} fill-primary text-primary`} />)
  }

  // Agregar media estrella si es necesario
  if (hasHalfStar && stars.length < max) {
    stars.push(<StarHalf key="half" className={`${starSize} fill-primary text-primary`} />)
  }

  // Agregar estrellas vacías
  for (let i = stars.length; i < max; i++) {
    stars.push(<Star key={`empty-${i}`} className={`${starSize} text-muted-foreground`} />)
  }

  return (
    <div className="flex items-center" aria-label={`Calificación: ${rating} de ${max} estrellas`}>
      {stars}
    </div>
  )
}
