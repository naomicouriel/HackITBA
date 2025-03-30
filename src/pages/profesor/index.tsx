import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import { Button } from "src/components/ui/button";
import { Card, CardContent } from "src/components/ui/card";
import { Check } from "lucide-react";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

const ProfessorPage: NextPage = () => {
  // Estados para el reproductor y control del tiempo del video
  const [player, setPlayer] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [showQuizButton, setShowQuizButton] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Estados para la generación y edición del quiz
  const [quizGenerated, setQuizGenerated] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    question: string;
    options: Record<string, string>;
    correctKey: string;
  }>({ question: "", options: {}, correctKey: "" });

  // Parámetros para la generación del quiz
  const [courseId] = useState<number>(1);
  const [desdeSegundo] = useState<number>(0);

  // Consulta para obtener los quizzes del curso mediante tRPC
  const { data: quizzes, refetch, isLoading } = api.createQuestions.getQuizzesByCourse.useQuery(
    { courseId },
    { enabled: !!courseId }
  );

  // Consulta para obtener los temas del curso usando getTopicsByCourse
  const { data: topics, isLoading: topicsLoading } = api.createTemas.getTopicsByCourse.useQuery({
    courseId,
  });

  // Mutación para crear (generar) las preguntas del quiz
  const createQuestions = api.createQuestions.createQuestions.useMutation({
    onSuccess: async () => {
      toast.success("Preguntas creadas");
      setQuizGenerated(true);
      await refetch();
    },
    onError: (error) => {
      console.error("Error creando preguntas:", error);
      toast.error("Error creando preguntas");
    },
  });

  // Mutación para actualizar una pregunta (edición)
  const updateQuestion = api.createQuestions.updateQuestion.useMutation({
    onSuccess: async () => {
      toast.success("Pregunta actualizada");
      setEditMode(null);
      await refetch();
    },
    onError: (error) => {
      console.error("Error actualizando pregunta:", error);
      toast.error("Error actualizando pregunta");
    },
  });

  // Mutación para eliminar una pregunta
  const deleteQuestion = api.createQuestions.deleteQuestion.useMutation({
    onSuccess: async () => {
      toast.success("Pregunta eliminada");
      await refetch();
    },
    onError: (error) => {
      console.error("Error eliminando pregunta:", error);
      toast.error("Error eliminando pregunta");
    },
  });

  // Nueva mutación para asignar el quiz a los estudiantes
  // Se asume que existe un endpoint en el router de quizzes llamado assignQuizToStudents
  const assignQuiz = api.answerQuiz.assignQuizToStudents.useMutation({
    onSuccess: () => {
      toast.success("Quiz asignado a los estudiantes");
    },
    onError: (error) => {
      console.error("Error asignando quiz:", error);
      toast.error("Error asignando quiz");
    },
  });

  // Función para generar el quiz usando currentTime como hastaSegundo
  const handleGenerateQuiz = async () => {
    try {
      await createQuestions.mutateAsync({
        course_id: courseId,
        desdeSegundo,
        hastaSegundo: Math.floor(currentTime),
        threshold: 50,
        numPreguntasPorTema: 3,
      });
    } catch (error) {
      console.error("Error generando quiz:", error);
    }
  };

  // Opciones del reproductor de YouTube (se adapta al contenedor)
  const videoOpts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0,
      controls: 1,
      origin: typeof window !== "undefined" ? window.location.origin : "",
    },
  };

  // onPlayerReady: guarda el reproductor y la duración total del video
  const onPlayerReady = (e: YouTubeEvent) => {
    setPlayer(e.target);
    const duration = e.target.getDuration();
    setVideoDuration(duration);
    console.log("Player listo:", e.target, "Duración:", duration);
  };

  // onPlayerStateChange: controla el avance del video
  const onPlayerStateChange: YouTubeProps["onStateChange"] = (e) => {
    const state = e.data;
    if (state === 1) {
      // Reproduciendo
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          const time = player.getCurrentTime();
          setCurrentTime(time);
          if (time >= 120) {
            setShowQuizButton(true);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }, 1000);
      }
    } else {
      // Pausado o detenido
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Filtrar quizzes con preguntas para la sección inferior
  const quizzesWithQuestions = quizzes?.filter((quiz) => quiz.questions?.length > 0) || [];

  // Aplanar todas las preguntas para mostrarlas en un grid
  const allQuestions = quizzesWithQuestions.flatMap((quiz) =>
    quiz.questions.map((q, idx) => ({
      id: `${quiz.id}-${q.id}`,
      question: q.question,
      options: JSON.parse(q.optionsJson),
      correctAnswerKey: q.correctAnswerKey,
      answer: q.answer, // se asume que existe este campo
      module: quiz.module,
      questionId: q.id,
    }))
  );

  // Distribución de temas proporcional (excepto últimos 5 minutos)
  const effectiveDuration = videoDuration > 300 ? videoDuration - 300 : videoDuration;
  const totalTopics = topics ? topics.length : 0;
  const topicsToShowCount =
    totalTopics > 0
      ? effectiveDuration === 0 || currentTime >= effectiveDuration
        ? totalTopics
        : Math.floor((currentTime / effectiveDuration) * totalTopics)
      : 0;
  const topicsToShow = topics ? topics.slice(0, topicsToShowCount) : [];

  // Etiquetas para opciones
  const optionLabels = ["A", "B", "C", "D", "E", "F"];

  // Función para manejar la eliminación de una pregunta
  const handleDelete = (questionId: number) => {
    deleteQuestion.mutate({ questionId });
  };

  // Calcular el último quiz generado (se asume que el último es el que se desea asignar)
  const latestQuiz = quizzes && quizzes.length > 0 ? quizzes[quizzes.length - 1] : null;

  // Función para asignar el quiz a los estudiantes
  const handleAssignQuiz = async () => {
    if (!latestQuiz) return;
    assignQuiz.mutate({ quizId: latestQuiz.id });
  };

  return (
    <>
      <Head>
        <title>Plataforma de Video - Profesor</title>
      </Head>

      {/* Encabezado */}
      <header className="bg-primary py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-foreground">Panel del Profesor</h1>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Fila superior: Video a la izquierda y columna de temas + botón a la derecha */}
          <div className="flex flex-col md:flex-row gap-8 items-start mt-4">
            {/* Columna izquierda: Video */}
            <div className="md:w-8/12">
              <h2 className="text-2xl font-bold">Video de la Clase</h2>
              <div className="relative h-[500px] rounded-lg overflow-hidden mt-2 shadow-lg">
                <YouTube
                  videoId="2ibqfxEAESo"
                  className="absolute top-0 left-0 w-full h-full"
                  opts={videoOpts}
                  onReady={onPlayerReady}
                  onStateChange={onPlayerStateChange}
                />
              </div>
              <p className="text-gray-600 text-center mt-2">
                {showQuizButton
                  ? `Ya pasaron 2 minutos. Tiempo actual: ${Math.floor(currentTime)} seg.`
                  : `Esperando a los 2 minutos de video... Tiempo actual: ${Math.floor(currentTime)} seg.`}
              </p>
            </div>

            {/* Columna derecha: Botón y listado de temas */}
            <div className="md:w-4/12 mt-10 flex flex-col gap-4">
              {showQuizButton && (
                <Button
                  size="lg"
                  className="w-full py-10 text-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold animate-pulse"
                  onClick={handleGenerateQuiz}
                  disabled={quizGenerated || createQuestions.isLoading}
                >
                  {createQuestions.isLoading ? "Generando quiz..." : "¡Es hora de Quiz!"}
                </Button>
              )}
              <div>
                <h2 className="text-2xl font-bold mb-2">Temas dados</h2>
                <div className="bg-white rounded-lg shadow p-4">
                  {topicsLoading ? (
                    <p className="text-gray-600">Cargando temas...</p>
                  ) : topics && topics.length > 0 ? (
                    topicsToShow.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {topicsToShow.map((topic: { id: number; name: string }) => (
                          <li key={topic.id}>{topic.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">Aún no se han revelado temas.</p>
                    )
                  ) : (
                    <p className="text-gray-600">No hay temas disponibles</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sección inferior: Preguntas del Quiz en grid */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Preguntas del Quiz</h2>
            {isLoading && <p className="text-center">Cargando quizzes...</p>}
            {quizGenerated && allQuestions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {allQuestions.map((q, index) => {
                  // Ordenamos las opciones por clave numérica y excluimos la justificación
                  const sortedOptions = Object.entries(q.options)
                    .filter(([key]) => key !== "justification")
                    .sort((a, b) => Number(a[0]) - Number(b[0]));
                  if (editMode === q.id) {
                    return (
                      <Card key={q.id} className="max-w-sm mx-auto shadow-lg">
                        <CardContent>
                          <input
                            value={editData.question}
                            onChange={(e) =>
                              setEditData({ ...editData, question: e.target.value })
                            }
                            className="w-full p-2 border rounded mb-2 text-black"
                          />
                          <ul className="space-y-1">
                            {sortedOptions.map(([key, text], idx) => (
                              <li key={key} className="flex items-center">
                                <span className="mr-2">{optionLabels[idx]}.</span>
                                <input
                                  value={text as string}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      options: { ...editData.options, [key]: e.target.value },
                                    })
                                  }
                                  className="flex-1 p-1 border rounded text-black"
                                />
                              </li>
                            ))}
                          </ul>
                          <label className="block text-gray-700 mt-2">
                            Selecciona la respuesta correcta:
                          </label>
                          <select
                            value={editData.correctKey}
                            onChange={(e) =>
                              setEditData({ ...editData, correctKey: e.target.value })
                            }
                            className="w-full p-2 border rounded mt-1"
                          >
                            {Object.entries(editData.options)
                              .filter(([key]) => key !== "justification")
                              .sort((a, b) => Number(a[0]) - Number(b[0]))
                              .map(([key, text], idx) => (
                                <option key={key} value={key}>
                                  {optionLabels[idx]}: {text}
                                </option>
                              ))}
                          </select>
                          <p className="italic text-gray-600 mt-2">Justificación:</p>
                          <input
                            value={editData.options.justification || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                options: { ...editData.options, justification: e.target.value },
                              })
                            }
                            className="w-full p-2 border rounded mb-2 text-black"
                            placeholder="Escribe la justificación"
                          />
                          <div className="flex gap-4 mt-4">
                            <Button
                              size="sm"
                              onClick={() =>
                                updateQuestion.mutate({
                                  questionId: q.questionId,
                                  questionText: editData.question,
                                  options: editData.options,
                                  correctKey: editData.correctKey,
                                })
                              }
                            >
                              Guardar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setEditMode(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  } else {
                    return (
                      <Card key={q.id} className="max-w-sm mx-auto shadow-lg">
                        <CardContent>
                          <p className="font-bold text-black mb-2">
                            {index + 1}. {q.question}
                          </p>
                          <ul className="space-y-1">
                            {sortedOptions.map(([key, text], idx) => {
                              const letter = optionLabels[idx];
                              const isCorrect = key === q.correctAnswerKey;
                              return (
                                <li
                                  key={key}
                                  className={`flex items-center ${
                                    isCorrect ? "text-green-600 font-medium" : "text-gray-700"
                                  }`}
                                >
                                  <span className="mr-2">{letter}.</span>
                                  <span>{text as string}</span>
                                  {isCorrect && <Check className="ml-2 h-4 w-4" />}
                                </li>
                              );
                            })}
                          </ul>
                          <p className="italic text-gray-600 mt-2">
                            Justificación: {q.answer || ""}
                          </p>
                          <div className="flex gap-4 mt-4">
                            <Button
                              size="sm"
                              onClick={() => {
                                setEditMode(q.id);
                                setEditData({
                                  question: q.question,
                                  options: q.options,
                                  correctKey: q.correctAnswerKey,
                                });
                              }}
                            >
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(q.questionId)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                })}
              </div>
            ) : (
              <Card className="border-dashed border-2 h-[200px] flex items-center justify-center">
                <CardContent className="text-center text-muted-foreground">
                  <p>
                    {quizGenerated
                      ? "No hay preguntas generadas para los temas."
                      : "Genera el quiz para ver las preguntas."}
                  </p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Botón para tomar el quiz (aparece solo si hay preguntas) */}
          {allQuestions.length > 0 && (
            <div className="mt-8 text-center">
              <Button
                onClick={handleAssignQuiz}
                className="rounded-full bg-yellow-500 px-10 py-3 font-semibold text-black hover:bg-yellow-600"
                disabled={assignQuiz.isLoading}
              >
                {assignQuiz.isLoading ? "Asignando quiz..." : "Tomar Quiz"}
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ProfessorPage;
