// filepath: components/explanation-modal.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HelpCircle } from "lucide-react"
import type { RecommendationExplanation } from "@/lib/types" // Import the API explanation type

interface ExplanationModalProps {
  explanation: RecommendationExplanation; // Use the API explanation type
}

export function ExplanationModal({ explanation }: ExplanationModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Extract potential explanation parts
  const { SVD, KNN, Contextual, weights } = explanation;

  // Check if there's any explanation content to show
  const hasExplanationContent = SVD || KNN || Contextual || weights;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* Disable button if no explanation content */}
        <Button variant="ghost" size="sm" disabled={!hasExplanationContent}>
          <HelpCircle className="h-4 w-4 mr-1" />
          ¿Por qué?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Explicación de la Recomendación</DialogTitle>
          <DialogDescription>
            Detalles sobre cómo se calculó esta recomendación.
          </DialogDescription>
        </DialogHeader>
        {hasExplanationContent ? (
          <div className="space-y-4 py-2">
            {/* Display individual score explanations */}
            {SVD && (
              <div className="bg-secondary/50 p-3 rounded-md">
                <p className="text-sm font-medium">Predicción SVD:</p>
                <p className="text-sm text-muted-foreground mt-1">{SVD}</p>
              </div>
            )}
            {KNN && (
              <div className="bg-secondary/50 p-3 rounded-md">
                <p className="text-sm font-medium">Predicción KNN:</p>
                <p className="text-sm text-muted-foreground mt-1">{KNN}</p>
              </div>
            )}
            {Contextual && (
              <div className="bg-secondary/50 p-3 rounded-md">
                <p className="text-sm font-medium">Puntuación Contextual:</p>
                <p className="text-sm text-muted-foreground mt-1">{Contextual}</p>
              </div>
            )}

            {/* Display weights if available */}
            {weights && (
              <div>
                <h4 className="text-sm font-medium mb-2">Pesos Aplicados:</h4>
                <div className="flex justify-around text-center text-xs bg-muted p-2 rounded-md">
                  <div>
                    <span className="font-semibold">SVD</span><br/>
                    <span>{(weights.w_svd * 100).toFixed(0)}%</span>
                  </div>
                   <div>
                    <span className="font-semibold">KNN</span><br/>
                    <span>{(weights.w_knn * 100).toFixed(0)}%</span>
                  </div>
                   <div>
                    <span className="font-semibold">Contexto</span><br/>
                    <span>{(weights.w_context * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4">
            No hay detalles de explicación disponibles para esta recomendación.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}