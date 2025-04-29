"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"

interface FeedbackButtonsProps {
  id: string
  onFeedback: (id: string, isUseful: boolean) => void
  currentFeedback?: boolean | null
}

export function FeedbackButtons({ id, onFeedback, currentFeedback }: FeedbackButtonsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFeedback = async (isUseful: boolean) => {
    setIsSubmitting(true)
    try {
      await onFeedback(id, isUseful)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex gap-2 w-full">
      <Button
        variant={currentFeedback === true ? "default" : "outline"}
        className="flex-1"
        onClick={() => handleFeedback(true)}
        disabled={isSubmitting}
        aria-pressed={currentFeedback === true}
      >
        <ThumbsUp className="h-4 w-4 mr-2" />
        Útil
      </Button>
      <Button
        variant={currentFeedback === false ? "default" : "outline"}
        className="flex-1"
        onClick={() => handleFeedback(false)}
        disabled={isSubmitting}
        aria-pressed={currentFeedback === false}
      >
        <ThumbsDown className="h-4 w-4 mr-2" />
        No Útil
      </Button>
    </div>
  )
}
