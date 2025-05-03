// filepath: components/recommendation-card.tsx
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RatingStars } from "@/components/rating-stars"
import { FeedbackButtons } from "@/components/feedback-buttons"
import { ExplanationModal } from "@/components/explanation-modal"
import type { ApiRecommendation } from "@/lib/types" // Import the API type
import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge" // Use Badge for consistency

interface RecommendationCardProps {
  recommendation: ApiRecommendation; // Use the API type
  onFeedback: (businessId: string, isUseful: boolean) => void; // Use businessId
}

export function RecommendationCard({ recommendation, onFeedback }: RecommendationCardProps) {
  // Destructure fields from ApiRecommendation
  const {
    business_id,
    name,
    address,
    categories, // This is a comma-separated string
    overall_stars,
    final_score,
    explanation,
    userFeedback // Keep client-side feedback state
  } = recommendation;

  // Split categories string into an array
  const categoryList = categories?.split(',').map(cat => cat.trim()) || [];

  return (
    <Card className="flex flex-col h-full"> {/* Ensure cards have consistent height */}
      <CardHeader>
        <div className="flex justify-between items-start gap-2"> {/* Add gap */}
          <div className="flex-1"> {/* Allow text to wrap */}
            <CardTitle className="text-lg">{name}</CardTitle> {/* Slightly larger title */}
            <CardDescription className="flex items-center mt-1 text-sm">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              {/* Use address directly, might need parsing if you want city/state */}
              {address}
            </CardDescription>
          </div>
          {/* Pass overall_stars to RatingStars */}
          <RatingStars rating={overall_stars} />
        </div>
      </CardHeader>
      <CardContent className="flex-grow"> {/* Allow content to grow */}
        <div className="flex flex-wrap gap-1 mb-4">
          {/* Use Badge component for categories */}
          {categoryList.slice(0, 3).map((category) => (
             <Badge key={category} variant="secondary">{category}</Badge>
          ))}
          {categoryList.length > 3 && (
             <Badge variant="outline">+{categoryList.length - 3} más</Badge>
          )}
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="text-sm">
            <span className="font-medium">Puntuación: </span>
            {/* Display final_score */}
            <span className="text-muted-foreground">{final_score.toFixed(2)}</span>
          </div>
          {/* Pass the API explanation structure */}
          <ExplanationModal explanation={explanation} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-4"> {/* Add padding top */}
         {/* Pass business_id to FeedbackButtons */}
        {/* <FeedbackButtons id={business_id} onFeedback={onFeedback} currentFeedback={userFeedback} /> */}
        <Button asChild className="w-full">
          {/* Link using business_id */}
          <Link href={`/business/${business_id}`}>Ver Negocio</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}