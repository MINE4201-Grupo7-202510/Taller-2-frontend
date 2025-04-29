import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RatingStars } from "@/components/rating-stars"
import { FeedbackButtons } from "@/components/feedback-buttons"
import { ExplanationModal } from "@/components/explanation-modal"
import type { Recommendation } from "@/lib/types"
import { MapPin } from "lucide-react"

interface RecommendationCardProps {
  recommendation: Recommendation
  onFeedback: (id: string, isUseful: boolean) => void
}

export function RecommendationCard({ recommendation, onFeedback }: RecommendationCardProps) {
  const { id, business, score, explanation, userFeedback } = recommendation

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{business.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {business.city}, {business.state}
            </CardDescription>
          </div>
          <RatingStars rating={business.stars} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {business.categories.slice(0, 3).map((category) => (
            <span key={category} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
              {category}
            </span>
          ))}
          {business.categories.length > 3 && (
            <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
              +{business.categories.length - 3} más
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="font-medium">Puntuación: </span>
            <span className="text-muted-foreground">{score.toFixed(2)}</span>
          </div>
          <ExplanationModal explanation={explanation} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <FeedbackButtons id={id} onFeedback={onFeedback} currentFeedback={userFeedback} />
        <Button asChild className="w-full">
          <Link href={`/business/${business.business_id}`}>Ver Negocio</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
