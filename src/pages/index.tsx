import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const [editMode, setEditMode] = useState<number | null>(null);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [desdeSegundo, setDesdeSegundo] = useState<number>(0);
  const [hastaSegundo, setHastaSegundo] = useState<number>(60);

  const deleteQuestion = api.createQuestions.deleteQuestion.useMutation({
    onSuccess: async () => {
      alert("Pregunta eliminada ✅");
      await refetch();
    },
  });

  const [editData, setEditData] = useState<{
    question: string;
    options: Record<string, string>;
    correctKey: string;
  }>({ question: "", options: {}, correctKey: "" });

  const {
    data: quizzes,
    refetch,
    isLoading,
  } = api.createQuestions.getQuizzesByCourse.useQuery(
    { courseId: courseId ?? 0 },
    { enabled: !!courseId }
  );

  const updateQuestion = api.createQuestions.updateQuestion.useMutation({
    onSuccess: async () => {
      alert("Pregunta actualizada ✅");
      setEditMode(null);
      await refetch();
    },
  });

  const createQuestions = api.createQuestions.createQuestions.useMutation({
    onSuccess: async () => {
      alert("Preguntas creadas ✅");
      await refetch();
    },
    onError: (error) => {
      console.error("Error creando preguntas:", error);
    },
  });

  const handleCreateQuestions = async () => {
    if (!courseId) return;
    try {
      await createQuestions.mutateAsync({
        course_id: courseId,
        desdeSegundo,
        hastaSegundo,
        threshold: 50,
        numPreguntasPorTema: 3,
      });
    } catch (error) {
      console.error("Error creando preguntas:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Quiz Creator</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white px-4 pt-10">
        <div className="container flex flex-col items-center gap-6 py-4">
          <div className="flex flex-col items-center">
            <label htmlFor="courseId">ID del curso:</label>
            <input
              type="number"
              id="courseId"
              className="text-black p-1 rounded"
              value={courseId ?? ""}
              onChange={(e) => setCourseId(Number(e.target.value))}
              placeholder="Ej: 1"
            />
            <label className="mt-2">Desde segundo:</label>
            <input
              type="number"
              className="text-black p-1 rounded"
              value={desdeSegundo}
              onChange={(e) => setDesdeSegundo(Number(e.target.value))}
            />
            <label className="mt-2">Hasta segundo:</label>
            <input
              type="number"
              className="text-black p-1 rounded"
              value={hastaSegundo}
              onChange={(e) => setHastaSegundo(Number(e.target.value))}
            />
          </div>

          <button
            className="rounded-full bg-white px-10 py-3 font-semibold text-black hover:bg-gray-200 disabled:opacity-50"
            onClick={handleCreateQuestions}
            disabled={!courseId}
          >
            Crear Preguntas
          </button>

          {isLoading && <p>Cargando quizzes...</p>}

          {quizzes && (
            <div className="mt-8 w-full max-w-3xl space-y-6">
              <h2 className="text-3xl font-bold">Temas y Quizzes</h2>
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="rounded-lg border border-white/20 bg-white/10 p-4"
                >
                  <h3 className="text-xl font-semibold mb-2">Tema: {quiz.module}</h3>
                  <p className="mb-4 text-sm text-white/80">ID del Quiz: {quiz.id}</p>
                  <div className="space-y-3">
                    {quiz.questions.map((q, index) => {
                      const opciones: Record<string, string> = JSON.parse(q.optionsJson);
                      const isEditing = editMode === q.id;

                      return (
                        <div key={q.id} className="rounded bg-white/10 p-3">
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                value={editData.question}
                                onChange={(e) =>
                                  setEditData({ ...editData, question: e.target.value })
                                }
                                className="w-full rounded p-2 text-black"
                              />
                              {Object.entries(editData.options).map(([letra, texto]) => (
                                <div key={letra} className="flex items-center gap-2">
                                  <span>{letra}:</span>
                                  <input
                                    value={texto}
                                    onChange={(e) =>
                                      setEditData({
                                        ...editData,
                                        options: {
                                          ...editData.options,
                                          [letra]: e.target.value,
                                        },
                                      })
                                    }
                                    className="flex-1 rounded p-1 text-black"
                                  />
                                </div>
                              ))}
                              <div>
                                <label>Respuesta correcta: </label>
                                <select
                                  value={editData.correctKey}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      correctKey: e.target.value,
                                    })
                                  }
                                  className="rounded p-1 text-black"
                                >
                                  {Object.keys(editData.options).map((key) => (
                                    <option key={key}>{key}</option>
                                  ))}
                                </select>
                              </div>
                              <button
                                onClick={() =>
                                  updateQuestion.mutate({
                                    questionId: q.id,
                                    questionText: editData.question,
                                    options: editData.options,
                                    correctKey: editData.correctKey,
                                  })
                                }
                                className="mt-2 rounded bg-green-500 px-3 py-1 font-bold text-white"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={() => setEditMode(null)}
                                className="ml-2 rounded bg-gray-400 px-3 py-1 font-bold text-white"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <>
                              <p className="font-medium">
                                {index + 1}. {q.question}
                              </p>
                              <ul className="ml-4 list-disc">
                                {Object.entries(opciones).map(([letra, texto]) => (
                                  <li key={letra}>
                                    <strong>{letra}:</strong> {texto}
                                  </li>
                                ))}
                              </ul>
                              <p className="mt-1 text-sm text-green-300">
                                Respuesta correcta: <strong>{q.correctAnswerKey}: {opciones[q.correctAnswerKey]}</strong>
                              </p>
                              <button
                                className="mt-2 text-sm underline"
                                onClick={() => {
                                  setEditMode(q.id);
                                  setEditData({
                                    question: q.question,
                                    options: opciones,
                                    correctKey: q.correctAnswerKey,
                                  });
                                }}
                              >
                                Editar
                              </button>
                              <button
                                className="ml-4 text-sm text-red-400 underline"
                                onClick={() => {
                                  if (confirm("¿Seguro que querés eliminar esta pregunta?")) {
                                    deleteQuestion.mutate({ questionId: q.id });
                                  }
                                }}
                              >
                                Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
