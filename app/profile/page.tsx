"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { ErrorState } from "@/components/error-state"
import { formatDate } from "@/lib/utils"

export default function ProfilePage() {
  const { user, isLoading, error, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="profile" />
      </div>
    )
  }

  if (error || !user) {
    return <ErrorState message="No pudimos cargar tu perfil. Por favor, intenta de nuevo más tarde." />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Perfil de Usuario</h1>
        <Button variant="outline" onClick={logout}>
          Cerrar Sesión
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>Miembro desde {formatDate(user.yelping_since)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Estadísticas</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reseñas:</span>
                  <span>{user.review_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Calificación promedio:</span>
                  <span>{user.average_stars.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fans:</span>
                  <span>{user.fans}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Interacciones</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Útil:</span>
                  <span>{user.useful}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Divertido:</span>
                  <span>{user.funny}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cool:</span>
                  <span>{user.cool}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="friends">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="friends">Amigos</TabsTrigger>
          <TabsTrigger value="elite">Años Elite</TabsTrigger>
        </TabsList>
        <TabsContent value="friends" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {user.friends.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {user.friends.map((friendId) => (
                    <div key={friendId} className="border rounded-lg p-3">
                      <div className="font-medium">Usuario {friendId.substring(0, 8)}...</div>
                      <div className="text-sm text-muted-foreground">ID: {friendId}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No tienes amigos en la plataforma</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="elite" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {user.elite.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.elite.map((year) => (
                    <div key={year} className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {year}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No has sido miembro elite</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
