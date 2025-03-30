import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "~/utils/api";
import VideoClip from "~/components/VideoClip";

const Resumenes: NextPage = () => {
  const [data, setData] = useState<{ segments: any[]; topics: string[]; analysis: any } | null>(null);
  const [desdeSegmento, setDesdeSegmento] = useState<number | undefined>(undefined);
  const [hastaSegmento, setHastaSegmento] = useState<number | undefined>(undefined);

  const generateSummaryMutation = api.generateSummary.generateSummary.useMutation({
    onSuccess: (response) => setData(response),
  });

  const handleGenerateSummary = async () => {
    try {
      await generateSummaryMutation.mutateAsync({
        course_id: 1,
        desdeSegmento,
        hastaSegmento,
      });
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
        <div className="mb-8">
          <div className="mb-4">
            <label className="block text-gray-700">Desde Segmento:</label>
            <input
              type="number"
              value={desdeSegmento !== undefined ? desdeSegmento : ""}
              onChange={(e) =>
                setDesdeSegmento(e.target.value ? Number(e.target.value) : undefined)
              }
              className="mt-1 p-2 border rounded w-full"
              placeholder="Ingrese el valor desde"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Hasta Segmento:</label>
            <input
              type="number"
              value={hastaSegmento !== undefined ? hastaSegmento : ""}
              onChange={(e) =>
                setHastaSegmento(e.target.value ? Number(e.target.value) : undefined)
              }
              className="mt-1 p-2 border rounded w-full"
              placeholder="Ingrese el valor hasta"
            />
          </div>
          <button
            onClick={handleGenerateSummary}
            disabled={generateSummaryMutation.isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {generateSummaryMutation.isLoading ? "Generando resúmenes..." : "Generar Resúmenes"}
          </button>
        </div>

        {/* Listado de clips */}
        {data?.analysis?.topics && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Listado de Temas con Videos</h2>
            {data.analysis.topics.map((topic: any) => (
              <div key={topic.name}>
                <VideoClip
                  title={topic.name}
                  start={Number(topic.start_time)}
                  end={Number(topic.end_time)}
                />
                <div className="mt-2">
                  <p className="mb-2">{topic.summary}</p>
                  <ul className="list-disc list-inside">
                    {topic.related_topics.map((related: string, index: number) => (
                      <li key={index}>{related}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Resumenes;
