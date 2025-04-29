import type React from "react"
import { render, screen } from "@testing-library/react"
import { BusinessCard } from "@/components/business-card"
import type { Business } from "@/lib/types"

// Mock de negocio para pruebas
const mockBusiness: Business = {
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
  hours: {
    Monday: "09:00-18:00",
  },
  photos: [],
}

// Mock de componentes que usa BusinessCard
jest.mock("@/components/rating-stars", () => ({
  RatingStars: ({ rating }: { rating: number }) => <div data-testid="rating-stars">{rating} stars</div>,
}))

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="link">
      {children}
    </a>
  ),
}))

describe("BusinessCard", () => {
  it("renders business information correctly", () => {
    render(<BusinessCard business={mockBusiness} />)

    // Verificar que se muestra la información básica del negocio
    expect(screen.getByText("Test Business")).toBeInTheDocument()
    expect(screen.getByText("Test City, TC")).toBeInTheDocument()
    expect(screen.getByTestId("rating-stars")).toBeInTheDocument()
    expect(screen.getByText("100 reseñas")).toBeInTheDocument()

    // Verificar que se muestran las categorías (limitadas a 3 en modo no detallado)
    expect(screen.getByText("Category 1")).toBeInTheDocument()
    expect(screen.getByText("Category 2")).toBeInTheDocument()
    expect(screen.getByText("Category 3")).toBeInTheDocument()
    expect(screen.getByText("+1 más")).toBeInTheDocument()

    // Verificar que se muestra el botón de ver detalles
    expect(screen.getByText("Ver Detalles")).toBeInTheDocument()
    expect(screen.getByTestId("link")).toHaveAttribute("href", "/business/test_business_001")
  })

  it("renders detailed view when detailed prop is true", () => {
    render(<BusinessCard business={mockBusiness} detailed={true} />)

    // En modo detallado, se deben mostrar todas las categorías
    expect(screen.getByText("Category 1")).toBeInTheDocument()
    expect(screen.getByText("Category 2")).toBeInTheDocument()
    expect(screen.getByText("Category 3")).toBeInTheDocument()
    expect(screen.getByText("Category 4")).toBeInTheDocument()

    // No debe mostrar el botón de ver detalles en modo detallado
    expect(screen.queryByText("Ver Detalles")).not.toBeInTheDocument()
  })
})
