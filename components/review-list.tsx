// filepath: c:\Users\Elkur\OneDrive\Documentos\Programacion\Universidad\Sistemas_de_recomendacion\Taller2\Taller2_MINE4201_front\components\review-list.tsx
import type { Review } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingStars } from '@/components/rating-stars'; // Asume que tienes este componente
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Ejemplo usando Shadcn Avatar

interface ReviewListProps {
  reviews: Review[];
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-muted-foreground">Este negocio aún no tiene reseñas.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.review_id}>
          <CardHeader className="flex flex-row justify-between items-start space-x-4 pb-2">
             <div className="flex items-center space-x-3">
                <Avatar>
                    {/* Podrías tener una URL de avatar en yelp_user o usar iniciales */}
                    <AvatarFallback>{review.user.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-base font-medium">{review.user.name || 'Usuario Anónimo'}</CardTitle>
                    <p className="text-xs text-muted-foreground">{formatDate(review.date)}</p>
                </div>
             </div>
             {review.stars !== null && <RatingStars rating={review.stars} />}
          </CardHeader>
          <CardContent>
            <p className="text-sm">{review.text}</p>
            {/* Podrías añadir los contadores useful, funny, cool si quieres */}
            {/* <div className="flex space-x-4 text-xs text-muted-foreground mt-2">
                <span>👍 Útil: {review.useful ?? 0}</span>
                <span>😂 Divertido: {review.funny ?? 0}</span>
                <span>😎 Cool: {review.cool ?? 0}</span>
            </div> */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}