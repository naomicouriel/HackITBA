
import Link from "next/link"
import { NextPage } from "next"
import { Button } from "src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card"
import { Progress } from "src/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs"
import { BarChart, PieChart, Users } from "lucide-react"
import { ChartWrapper } from "src/components/chart-wrapper"
import { BarChart as Chart1 } from "src/components/charts/bar-chart"
import { LineChart as Chart2 } from "src/components/charts/line-chart"
import { PieChart as Chart3 } from "src/components/charts/pie-chart"

const ProfessorDashboardPage: NextPage = () => {
  const studentData = [
    { id: 1, name: "Ana García", score: 85, needsHelp: ["Tema 2", "Tema 5"] },
    { id: 2, name: "Carlos López", score: 92, needsHelp: [] },
    { id: 3, name: "María Rodríguez", score: 68, needsHelp: ["Tema 1", "Tema 3", "Tema 4"] },
    { id: 4, name: "Juan Pérez", score: 75, needsHelp: ["Tema 2"] },
    { id: 5, name: "Sofia Martínez", score: 88, needsHelp: ["Tema 5"] },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-foreground">Dashboard del Profesor</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Participación Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">+2% desde la última clase</p>
              <Progress value={98} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Promedio de Calificación</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">81.6</div>
              <p className="text-xs text-muted-foreground">+5.2 desde la última clase</p>
              <Progress value={81.6} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Temas Problemáticos</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 temas</div>
              <p className="text-xs text-muted-foreground">Tema 2, Tema 3, Tema 5</p>
              <Progress value={60} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="charts" className="mb-8">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
            <TabsTrigger value="students">Estudiantes</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Rendimiento por Tema</CardTitle>
                  <p className="text-sm text-muted-foreground">Promedio de rendimiento por tema del curso</p>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartWrapper
                    content={Chart1}
                    props={{
                      data: [
                        { name: "Introducción IA", value: 85 },
                        { name: "Algoritmos ML", value: 68 },
                        { name: "Procesamiento", value: 54 },
                        { name: "Redes Neuronales", value: 78 },
                        { name: "Implementación", value: 62 },
                        { name: "Evaluación", value: 73 },
                      ],
                      yAxisLabel: "Rendimiento (%)",
                      xAxisLabel: "Temas",
                      color: "hsl(221, 83%, 53%)"
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Respuestas</CardTitle>
                  <p className="text-sm text-muted-foreground">Última evaluación</p>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartWrapper
                    content={Chart3}
                    props={{
                      data: [
                        { name: "Correctas", value: 65, color: "hsl(142, 76%, 36%)" },
                        { name: "Parciales", value: 20, color: "hsl(221, 83%, 53%)" },
                        { name: "Incorrectas", value: 15, color: "hsl(346, 87%, 43%)" }
                      ]
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Progreso de la Clase</CardTitle>
                  <p className="text-sm text-muted-foreground">Evolución del rendimiento en las últimas 8 semanas</p>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartWrapper
                    content={Chart2}
                    props={{
                      data: [
                        { name: "Semana 1", value: 65 },
                        { name: "Semana 2", value: 68 },
                        { name: "Semana 3", value: 75 },
                        { name: "Semana 4", value: 72 },
                        { name: "Semana 5", value: 78 },
                        { name: "Semana 6", value: 82 },
                        { name: "Semana 7", value: 80 },
                        { name: "Semana 8", value: 85 }
                      ],
                      yAxisLabel: "Rendimiento Promedio (%)",
                      xAxisLabel: "Semanas",
                      color: "hsl(250, 83%, 53%)"
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Áreas de Mejora</CardTitle>
                  <p className="text-sm text-muted-foreground">Temas que requieren atención</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Algoritmos de Aprendizaje</span>
                        <span className="text-sm font-medium">68%</span>
                      </div>
                      <Progress value={68} className="bg-muted" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Procesamiento de Datos</span>
                        <span className="text-sm font-medium">54%</span>
                      </div>
                      <Progress value={54} className="bg-muted" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Implementación Práctica</span>
                        <span className="text-sm font-medium">62%</span>
                      </div>
                      <Progress value={62} className="bg-muted" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Atención vs Tema</CardTitle>
                  <p className="text-sm text-muted-foreground">Nivel de atención detectado durante las explicaciones</p>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartWrapper
                    content={Chart1}
                    props={{
                      data: [
                        { name: "Intro IA", value: 92 },
                        { name: "Algoritmos", value: 75 },
                        { name: "Procesamiento", value: 68 },
                        { name: "Redes Neur.", value: 88 },
                        { name: "Implement.", value: 71 },
                        { name: "Evaluación", value: 85 }
                      ],
                      yAxisLabel: "Nivel de Atención (%)",
                      xAxisLabel: "Temas",
                      color: "hsl(221, 83%, 53%)"
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feedback Estudiantes</CardTitle>
                  <p className="text-sm text-muted-foreground">Sentimiento general por clase</p>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartWrapper
                    content={Chart3}
                    props={{
                      data: [
                        { name: "Muy Satisfecho", value: 45, color: "hsl(142, 76%, 36%)" },
                        { name: "Satisfecho", value: 30, color: "hsl(221, 83%, 53%)" },
                        { name: "Neutral", value: 15, color: "hsl(250, 83%, 53%)" },
                        { name: "Insatisfecho", value: 10, color: "hsl(346, 87%, 43%)" }
                      ]
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento de Estudiantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentData.map((student) => (
                    <Card key={student.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{student.name}</h3>
                          <div className="text-sm text-muted-foreground">
                            {student.needsHelp.length > 0 ? (
                              <span>Necesita ayuda en: {student.needsHelp.join(", ")}</span>
                            ) : (
                              <span className="text-primary">Buen rendimiento en todos los temas</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`text-lg font-bold ${student.score >= 80 ? "text-primary" : student.score >= 70 ? "text-secondary" : "text-secondary/70"}`}
                          >
                            {student.score}%
                          </div>
                          <Button variant="outline" size="sm">
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default ProfessorDashboardPage;
