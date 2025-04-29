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

interface ExplanationModalProps {
  explanation: {
    factors: Array<{
      name: string
      weight: number
      description: string
    }>
    text: string
  }
}

export function ExplanationModal({ explanation }: ExplanationModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <HelpCircle className="h-4 w-4 mr-1" />
          ¿Por qué?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Explicación de la Recomendación</DialogTitle>
          <DialogDescription>Entender por qué se te ha recomendado este negocio</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm">{explanation.text}</p>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Factores que influyeron:</h4>
            {explanation.factors.map((factor, index) => (
              <div key={index} className="bg-secondary/50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{factor.name}</span>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {(factor.weight * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
