import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
        Sistema de Recomendación Híbrido
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mb-8">
        Bienvenido a nuestra aplicación académica basada en el Yelp Dataset. Este sistema utiliza técnicas avanzadas de
        filtrado colaborativo y basado en contenido para ofrecer recomendaciones personalizadas de negocios.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/login">Ingresar</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/experiments">Ver Experimentos</Link>
        </Button>
      </div>
    </div>
  )
}
