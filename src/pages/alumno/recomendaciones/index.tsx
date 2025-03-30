"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { BookOpen, ExternalLink, Play, Video } from "lucide-react";
import { api } from "src/utils/api";

export default function RecomendacionesPage() {
  // Query para obtener los 2 tópicos recomendados
  const {
    data: recommendedTopics,
    isLoading,
    isError,
  } = api.analysisResults.getTwoTopicSummaries.useQuery();

  // Estado para saber qué tópico está seleccionado en el sidebar
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

  // Buscar el tópico seleccionado
  const selectedTopic = recommendedTopics?.find((t) => t.id === selectedTopicId);

  // Handler al hacer clic en un tópico del sidebar
  function handleSelectTopic(topicId: number) {
    setSelectedTopicId(topicId);
  }

  // Función para armar la URL de YouTube con start_time
  function getYouTubeUrl(startTime: number) {
    // Por ejemplo, un URL base:
    return `https://www.youtube.com/watch?v=2ibqfxEAESo&t=${Math.floor(startTime)}s`;
  }

  // Lista "hardcodeada" de contenido relacionado
  const relatedContents = [
    {
      title: "Guía completa de repaso",
      description: "Documento PDF con ejercicios avanzados sobre este tema.",
      link: "#",
    },
    {
      title: "Ejemplos prácticos",
      description: "Colección de casos de estudio para reforzar la teoría.",
      link: "#",
    },
    {
      title: "Podcast del curso",
      description: "Discusión con expertos en la materia.",
      link: "#",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Encabezado */}
      <header className="bg-primary py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-foreground">Recomendaciones Personalizadas</h1>
        </div>
      </header>

      {/* Contenido principal con sidebar y sección derecha */}
      <main className="flex-1 container mx-auto px-4 py-8">
      <CardDescription className="text-2xl font-extrabold my-4 mb-8 text-center">
          <span className="bg-gradient-to-r from-slate-600 to-slate-800 text-white px-3 py-1 rounded shadow-lg">
            Basado en tus resultados,
          </span>{" "}
          te recomendamos reforzar estos temas
        </CardDescription>
        <div className="flex gap-8">
          {/* SIDEBAR: 2 Tópicos recomendados */}
          <aside className="w-64 bg-gray-50 p-4 rounded border">
            <h2 className="text-lg font-bold mb-4">Temas a mejorar</h2>

            {isLoading && <p className="text-sm text-gray-500">Cargando temas...</p>}
            {isError && <p className="text-sm text-red-500">Ocurrió un error al obtener los temas</p>}

            {recommendedTopics && recommendedTopics.length > 0 && (
              <div className="space-y-3">
                {recommendedTopics.map((topic) => {
                  // Tomamos solo el primer resumen si existe
                  const firstRes = topic.resumen[0];
                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleSelectTopic(topic.id)}
                      className={`block w-full p-2 rounded bg-white shadow text-left
                        ${selectedTopicId === topic.id ? "border border-blue-200" : ""}
                      `}
                    >
                      <p className="font-semibold text-gray-800">{topic.name}</p>
                      {firstRes ? (
                        <p className="mt-1 text-gray-600 text-sm">
                          {firstRes.summary.slice(0, 50)}...
                        </p>
                      ) : (
                        <p className="mt-1 text-gray-500 text-sm">Sin resúmenes</p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {recommendedTopics && recommendedTopics.length === 0 && (
              <p className="text-sm text-gray-600">No hay tópicos recomendados</p>
            )}
          </aside>

          {/* SECCIÓN DERECHA: mostrar el contenido del tópico seleccionado */}
          <div className="flex-1">
            {/* Si no hay un tópico seleccionado, placeholder */}
            {!selectedTopic && (
              <div className="text-gray-600">
                Selecciona uno de los tópicos recomendados a la izquierda para ver su detalle.
              </div>
            )}
            

            {/* Si sí hay tópico seleccionado, mostramos su contenido */}
            {selectedTopic && (
              <Card className="border-primary/20 shadow-lg">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                    <Video className="h-5 w-5" />
                    {selectedTopic.name}
                  </CardTitle>
                  {/* Aumentar el tamaño de letra */}
                  
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  {selectedTopic.resumen.length > 0 ? (
                    // Solo mostramos el primer resumen
                    (() => {
                      const r = selectedTopic.resumen[0];
                      if (!r) {
                        return <p className="text-sm text-gray-600">No hay resúmenes disponibles</p>;
                      }
                      // YouTube URL con start_time
                      const youtubeUrl = getYouTubeUrl(r.startTime);
                      return (
                        <div key={r.id} className="p-3 border rounded space-y-3">
                          <h3 className="font-medium text-md mb-1">
                            Resumen #{r.id}
                          </h3>
                          <p className="text-sm text-muted-foreground">{r.summary}</p>
                          <p className="text-xs text-gray-500">
                            Segmento: {r.transcriptSegment.slice(0, 80)}...
                          </p>

                          {/* Botón que manda al tiempo start_time */}
                          <div>
                            <Button variant="outline" className="mt-2 flex items-center gap-2" asChild>
                              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                                <Play className="h-4 w-4" /> Momento donde se dijo (tiempo {Math.floor(r.startTime)}s)
                              </a>
                            </Button>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <p className="text-sm text-gray-600">No hay resúmenes en este tópico</p>
                  )}

                  {/* Listado "hardcodeado" de contenido relacionado */}
                  <div className="mt-4">
                    <h4 className="text-md font-semibold mb-2">Contenido relacionado</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <ExternalLink className="h-4 w-4 mt-1 flex-shrink-0" />
                        <div>
                          <a href="#" className="text-primary hover:underline font-medium">
                            Guía completa de repaso
                          </a>
                          <p className="text-sm text-muted-foreground">
                            Documento PDF con ejercicios avanzados sobre este tema.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <BookOpen className="h-4 w-4 mt-1 flex-shrink-0" />
                        <div>
                          <a href="#" className="text-primary hover:underline font-medium">
                            Ejemplos prácticos
                          </a>
                          <p className="text-sm text-muted-foreground">
                            Colección de casos de estudio para reforzar la teoría.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Video className="h-4 w-4 mt-1 flex-shrink-0" />
                        <div>
                          <a href="#" className="text-primary hover:underline font-medium">
                            Podcast del curso
                          </a>
                          <p className="text-sm text-muted-foreground">
                            Discusión con expertos en la materia.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
