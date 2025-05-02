"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestDbPage() {
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [testUserId, setTestUserId] = useState('')
  const [userResult, setUserResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkDbStatus()
  }, [])

  const checkDbStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/db-check')
      const data = await response.json()
      setDbStatus(data)
      
      // Si hay usuarios de muestra, usar el primero como prueba
      if (data.sampleUsers && data.sampleUsers.length > 0) {
        setTestUserId(data.sampleUsers[0])
      }
    } catch (err) {
      console.error('Error al verificar la base de datos:', err)
      setError('Error al conectar con la base de datos')
    } finally {
      setIsLoading(false)
    }
  }

  const testUserAuth = async () => {
    if (!testUserId) return
    
    setIsLoading(true)
    setError(null)
    setUserResult(null)
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: testUserId }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Error al buscar usuario')
        return
      }
      
      setUserResult(data.user)
    } catch (err) {
      console.error('Error al probar autenticación:', err)
      setError('Error al probar autenticación')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Prueba de Conexión a Base de Datos</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estado de la Base de Datos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <p>Cargando...</p>}
            {dbStatus && (
              <div className="space-y-2">
                <p>Conexión: {dbStatus.dbConnected ? '✅ Conectado' : '❌ Desconectado'}</p>
                <p>Número de usuarios: {dbStatus.userCount}</p>
                <p>IDs de muestra: </p>
                <ul className="list-disc pl-5">
                  {dbStatus.sampleUsers?.map((id: string) => (
                    <li key={id}>{id}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Probar Autenticación de Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input 
                value={testUserId} 
                onChange={(e) => setTestUserId(e.target.value)}
                placeholder="ID de usuario"
              />
              <Button onClick={testUserAuth} disabled={isLoading}>
                Probar
              </Button>
            </div>
            
            {error && (
              <div className="p-3 bg-red-100 text-red-800 rounded mb-4">
                {error}
              </div>
            )}
            
            {userResult && (
              <div className="p-3 bg-green-100 text-green-800 rounded">
                <h3 className="font-bold">Usuario encontrado:</h3>
                <pre className="mt-2 overflow-auto text-sm bg-gray-100 p-2 rounded">
                  {JSON.stringify(userResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}