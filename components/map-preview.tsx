"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Card } from "@/components/ui/card"

interface MapPreviewProps {
  latitude: number
  longitude: number
  name: string
}

export function MapPreview({ latitude, longitude, name }: MapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Si ya existe una instancia del mapa, la eliminamos
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    // Crear una nueva instancia del mapa
    const map = L.map(mapRef.current).setView([latitude, longitude], 15)
    mapInstanceRef.current = map

    // Agregar capa de mapa base
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Agregar marcador
    L.marker([latitude, longitude]).addTo(map).bindPopup(name).openPopup()

    // Limpiar al desmontar
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude, name])

  return (
    <Card className="overflow-hidden">
      <div ref={mapRef} className="h-64 w-full" aria-label={`Mapa mostrando la ubicación de ${name}`} />
    </Card>
  )
}
