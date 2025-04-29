"use client"

import type React from "react"

import { render, screen, fireEvent } from "@testing-library/react"
import { RecommendationCard } from "@/components/recommendation-card"
import type { Recommendation } from "@/lib/types"

// Mock de recomendación para pruebas
const mockRecommendation: Recommendation = {
  id: "test_rec_001",
  business: {
    business_id: "test_business_001",
    name: "Test Business",
    address: "Test Address 123",
    city: "Test City",
    state: "TC",
    postal_code: "12345",
    latitude: 40.1234,
    longitude: -3.1234,
    stars: 4.5,
    review_count: 100,
    is_open: 1,
    categories: ["Category 1", "Category 2", "Category 3", "Category 4"],
    photos: [],
  },
  score: 0.85,
  explanation: {
    factors: [
      {
        name: "Factor 1",
        weight: 0.6,
        description: "Description 1",
      },
      {
        name: "Factor 2",
        weight: 0.4,
        description: "Description 2",
      },
    ],
    text: "Test explanation text",
  },
  userFeedback: null,
}

// Mock de componentes que usa RecommendationCard
jest.mock("@/components/rating-stars", () => ({
  RatingStars: ({ rating }: { rating: number }) => <div data-testid="rating-stars">{rating} stars</div>,
}))

jest.mock("@/components/feedback-buttons", () => ({
  FeedbackButtons: ({
    id,
    onFeedback,
    currentFeedback,
  }: { id: string; onFeedback: Function; currentFeedback: boolean | null }) => (
    <div data-testid="feedback-buttons">
      <button onClick={() => onFeedback(id, true)}>Útil</button>
      <button onClick={() => onFeedback(id, false)}>No Útil</button>
      <span>Current: {currentFeedback === null ? "null" : currentFeedback.toString()}</span>
    </div>
  ),
}))

jest.mock("@/components/explanation-modal", () => ({
  ExplanationModal: ({ explanation }: { explanation: any }) => (
    <button data-testid="explanation-modal">¿Por qué?</button>
  ),
}))

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="link">
      {children}
    </a>
  ),
}))

describe("RecommendationCard", () => {
  it("renders recommendation information correctly", () => {
    render(<RecommendationCard recommendation={mockRecommendation} onFeedback={jest.fn()} />)

    // Verificar que se muestra la información básica de la recomendación
    expect(screen.getByText("Test Business")).toBeInTheDocument()
    expect(screen.getByText("Test City, TC")).toBeInTheDocument()
    expect(screen.getByTestId("rating-stars")).toBeInTheDocument()

    // Verificar que se muestra la puntuación
    expect(screen.getByText("Puntuación:")).toBeInTheDocument()
    expect(screen.getByText("0.85")).toBeInTheDocument()

    // Verificar que se muestran las categorías (limitadas a 3)
    expect(screen.getByText("Category 1")).toBeInTheDocument()
    expect(screen.getByText("Category 2")).toBeInTheDocument()
    expect(screen.getByText("Category 3")).toBeInTheDocument()
    expect(screen.getByText("+1 más")).toBeInTheDocument()

    // Verificar que se muestra el modal de explicación
    expect(screen.getByTestId("explanation-modal")).toBeInTheDocument()

    // Verificar que se muestran los botones de feedback
    expect(screen.getByTestId("feedback-buttons")).toBeInTheDocument()

    // Verificar que se muestra el enlace al negocio
    expect(screen.getByText("Ver Negocio")).toBeInTheDocument()
    expect(screen.getByTestId("link")).toHaveAttribute("href", "/business/test_business_001")
  })

  it("calls onFeedback when feedback buttons are clicked", () => {
    const mockOnFeedback = jest.fn()
    render(<RecommendationCard recommendation={mockRecommendation} onFeedback={mockOnFeedback} />)

    // Hacer clic en el botón "Útil"
    fireEvent.click(screen.getByText("Útil"))
    expect(mockOnFeedback).toHaveBeenCalledWith("test_rec_001", true)

    // Hacer clic en el botón "No Útil"
    fireEvent.click(screen.getByText("No Útil"))
    expect(mockOnFeedback).toHaveBeenCalledWith("test_rec_001", false)
  })
})
