"use client"

import { useState } from "react"
import { useExperiments } from "@/lib/hooks/useExperiments"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { ErrorState } from "@/components/error-state"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

export default function ExperimentsPage() {
  const { metrics, isLoading, error } = useExperiments()
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("all")

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Experimentos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} type="chart" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !metrics) {
    return <ErrorState message="No pudimos cargar los datos de experimentos. Por favor, intenta de nuevo más tarde." />
  }

  const filteredMetrics =
    selectedAlgorithm === "all"
      ? metrics.algorithms
      : metrics.algorithms.filter((alg) => alg.name === selectedAlgorithm)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Experimentos</h1>

        <div className="w-full sm:w-64">
          <Label htmlFor="algorithm-filter">Filtrar por algoritmo</Label>
          <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
            <SelectTrigger id="algorithm-filter">
              <SelectValue placeholder="Todos los algoritmos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los algoritmos</SelectItem>
              {metrics.algorithms.map((alg) => (
                <SelectItem key={alg.name} value={alg.name}>
                  {alg.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Precisión (Precision)</CardTitle>
            <CardDescription>Comparación de precisión entre algoritmos</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip formatter={(value) => value.toFixed(3)} />
                <Legend />
                <Bar dataKey="precision" fill="#8884d8" name="Precisión" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exhaustividad (Recall)</CardTitle>
            <CardDescription>Comparación de exhaustividad entre algoritmos</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip formatter={(value) => value.toFixed(3)} />
                <Legend />
                <Bar dataKey="recall" fill="#82ca9d" name="Exhaustividad" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>F1-Score</CardTitle>
            <CardDescription>Medida de equilibrio entre precisión y exhaustividad</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip formatter={(value) => value.toFixed(3)} />
                <Legend />
                <Bar dataKey="f1Score" fill="#ffc658" name="F1-Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Cuadrático Medio (RMSE)</CardTitle>
            <CardDescription>Error en las predicciones de calificación</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => value.toFixed(3)} />
                <Legend />
                <Bar dataKey="rmse" fill="#ff8042" name="RMSE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="performance">Rendimiento por Época</TabsTrigger>
          <TabsTrigger value="distribution">Distribución de Recomendaciones</TabsTrigger>
        </TabsList>
        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolución del Rendimiento</CardTitle>
              <CardDescription>Métricas a lo largo de las épocas de entrenamiento</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.performanceOverTime} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="epoch" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="precision" stroke="#8884d8" name="Precisión" />
                  <Line type="monotone" dataKey="recall" stroke="#82ca9d" name="Exhaustividad" />
                  <Line type="monotone" dataKey="f1Score" stroke="#ffc658" name="F1-Score" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="distribution" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Categoría</CardTitle>
              <CardDescription>Distribución de recomendaciones por categoría de negocio</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="category"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {metrics.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
