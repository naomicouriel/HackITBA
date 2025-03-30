import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "~/utils/api";

const Resumenes: NextPage = () => {
  // Estado para almacenar el tema seleccionado y la data retornada
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [data, setData] = useState<{ segments: any[]; topics: string[] } | null>(null);

  // Llamada a la mutación del endpoint generateSummary
  const generateSummaryMutation = api.generateSummary.generateSummary.useMutation({
    onSuccess: (response) => {
      // Al obtener la respuesta, guardamos los segmentos y temas
      setData(response);
    },
  });

  const handleGenerateSummary = async () => {
    try {
      const result = await generateSummaryMutation.mutateAsync({
        course_id: 1,
      });
      console.log(result);
    } catch (error) {
      console.error("Error generando resumen:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Resúmenes - Hackathon</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Resúmenes</h1>
        <p className="text-gray-600 mb-8">
          Aquí podrás ver los resúmenes generados para el curso.
        </p>

        <div className="mb-8">
          <button
            onClick={handleGenerateSummary}
            disabled={generateSummaryMutation.isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {generateSummaryMutation.isLoading ? "Generando resúmenes..." : "Generar Resúmenes"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Panel de Temas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Temas Disponibles</h2>
            {data?.topics ? (
              <div className="space-y-2">
                {data.topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full text-left px-4 py-2 rounded ${
                      selectedTopic === topic
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay temas disponibles. Genera los resúmenes.</p>
            )}
          </div>

          {/* Panel de Segmentos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Segmentos del Curso</h2>
            {data?.segments ? (
              <ul className="space-y-4">
                {data.segments.map((segment, index) => (
                  <li key={index} className="p-4 border rounded">
                    <p>
                      <strong>Inicio:</strong> {segment.start}
                    </p>
                    <p>
                      <strong>Fin:</strong> {segment.end}
                    </p>
                    <p>
                      <strong>Texto:</strong> {segment.text}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No se han cargado segmentos. Genera los resúmenes para verlos.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Resumenes;
