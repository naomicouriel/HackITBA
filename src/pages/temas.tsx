import type { NextPage } from "next"
import Head from "next/head"
import { useState } from "react"
import { api } from "~/utils/api"

const Temas: NextPage = () => {
  const [temaActual, setTemaActual] = useState("");
  const [temas, setTemas] = useState<string[]>([]);
  const [courseId, setCourseId] = useState<number>(1);

  const createTopic = api.createTemas.createTemas.useMutation({
    onSuccess: () => {
      alert("Temas guardados ✅");
      setTemas([]);
      refetch(); // Refetch los temas del curso
    },
    onError: (error) => {
      alert("Error al guardar temas ❌");
      console.error(error);
    }
  });

  const { data: temasExistentes, refetch } = api.createTemas.getTopicsByCourse.useQuery(
    { courseId },
    { enabled: !!courseId }
  );

  const handleAgregarTema = () => {
    if (temaActual.trim() !== "") {
      setTemas((prev) => [...prev, temaActual.trim()]);
      setTemaActual("");
    }
  };

  const handleGuardarTodos = async () => {
    for (const nombre of temas) {
      await createTopic.mutateAsync({ name: nombre, courseId });
    }
  };

  return (
    <>
      <Head>
        <title>Temas - Hackathon</title>
      </Head>
      <div className="max-w-xl mx-auto mt-10 p-4 bg-white rounded shadow">
        <h1 className="text-2xl font-bold">Temas</h1>
        <p className="text-gray-500 mb-4">Agregá temas para un curso específico.</p>

        <div className="mb-4">
          <label className="block font-semibold mb-1">ID del curso:</label>
          <input
            type="number"
            value={courseId}
            onChange={(e) => setCourseId(parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={temaActual}
            onChange={(e) => setTemaActual(e.target.value)}
            placeholder="Escribí un tema"
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <button
            onClick={handleAgregarTema}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Agregar tema
          </button>
        </div>

        {temas.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Temas a guardar:</h2>
            <ul className="list-disc list-inside">
              {temas.map((tema, idx) => (
                <li key={idx}>{tema}</li>
              ))}
            </ul>
            <button
              onClick={handleGuardarTodos}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
            >
              Guardar todos los temas
            </button>
          </div>
        )}

        <hr className="my-6" />

        <div>
          <h2 className="text-xl font-semibold mb-2">Temas ya existentes del curso</h2>
          {temasExistentes?.length ? (
            <ul className="list-disc list-inside">
              {temasExistentes.map((t) => (
                <li key={t.id}>{t.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No hay temas aún.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Temas;
