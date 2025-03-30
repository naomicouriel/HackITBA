import { useState } from "react";
import Link from "next/link";
import { Button } from "src/components/ui/button";
import { Card, CardContent } from "src/components/ui/card";
import { RadioGroup, RadioGroupItem } from "src/components/ui/radio-group";
import { Label } from "src/components/ui/label";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { api } from "~/utils/api";

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

export default function EstudiantePage() {
  const studentId = 2; 
  // 1. Obtener quiz pendiente
  const { data: pendingTest, isLoading } = api.createQuestions.getPendingTest.useQuery({ studentId });

  // 2. Extraemos preguntas y quizId
  const questions = pendingTest?.quiz?.questions || [];
  const quizId = pendingTest?.quiz?.id;

  // Estados locales
  const [selectedAnswers, setSelectedAnswers] = useState<(number | undefined)[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  // Mutación para "completar quiz"
  const completeQuiz = api.answerQuiz.completeQuiz.useMutation({
    onSuccess: () => {
      console.log("Quiz completado y guardado en DB");
    },
    onError: (err) => {
      console.error("Error completando quiz:", err);
    },
  });

  // Manejo selección de respuesta en la pregunta actual
  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = Number.parseInt(value);
    setSelectedAnswers(newAnswers);
  };

  const isAnswerCorrect = (questionIndex: number) => {
    const chosenIndex = selectedAnswers[questionIndex];
    const correctKey = questions[questionIndex]?.correctAnswerKey;
    if (chosenIndex === undefined || !correctKey) return false;
    return OPTION_LABELS[chosenIndex] === correctKey;
  };

  const calculateScore = () => {
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      if (isAnswerCorrect(i)) correct++;
    }
    return Math.round((correct / questions.length) * 100);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Finalizamos
      setShowFeedback(true);

      // Mandar respuestas al backend
      if (quizId) {
        const answersToSend = questions.map((q, idx) => {
          const chosenIndex = selectedAnswers[idx] ?? 0; 
          const letter = OPTION_LABELS[chosenIndex];
          return {
            questionId: q.id,
            response: letter as "A" | "B" | "C" | "D",
          };
        });
        completeQuiz.mutate({
          studentId,
          quizId,
          answers: answersToSend,
        });
      }
    }
  };

  
    // Mutación para llamar al endpoint generateSummary.generateSummary
    const generateSummaryMutation = api.generateSummary.generateSummary.useMutation({
      onSuccess: (res) => {
        console.log("Recibido en Recomendaciones:", res);
      },
      onError: (err) => {
        console.error("Error al obtener las recomendaciones:", err);
      },
    });
  
    // Handler para invocar la mutación manualmente
    const handleGetRecommendations = () => {
      // Enviamos un payload mínimo
      generateSummaryMutation.mutate({
        course_id: 1,
        desdeSegmento: 0,
        hastaSegmento: 100,
      });
    };

  if (isLoading) return <div className="flex items-center justify-center h-screen">Cargando test...</div>;

  // Si NO hay test pendiente:
  if (!pendingTest || !pendingTest.quiz) {
    return (
      <div className="flex min-h-screen flex-col">
      <header className="bg-primary py-4">
              <div className="container mx-auto px-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary-foreground">Recomendaciones Personalizadas</h1>
              </div>
            </header>

      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {/* Título del curso si existe; si no, muestra "Título del Curso" por defecto */}
        <h2 className="text-xl font-bold mb-2">
          Panel del Estudiante
        </h2>
        <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/2ibqfxEAESo"
            title="Video de la clase"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="text-sm text-gray-600 mb-6">*No tienes test pendientes</p>
      </div>
      <div className="flex justify-center mb-6">
        <Link href="/alumno/recomendaciones">
          <Button
            variant="outline"
            className="text-primary-foreground bg-blue-400 hover:bg-primary-foreground hover:text-primary"
            onClick={handleGetRecommendations}
          >Ver Recomendaciones Personalizadas</Button>
        </Link>
      </div>
      </div>
    );
  }

  // De lo contrario, mostramos la distribución de video + quiz
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-foreground">Panel del Estudiante</h1>
          <Link href="/">
            <Button
              variant="outline"
              className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Inicio
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Columna del video */}
          <div>
            <h2 className="text-xl font-bold mb-4">Video de la Clase</h2>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/2ibqfxEAESo"
                title="Video de la clase"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Columna del Quiz */}
          <div>
            <h2 className="text-xl font-bold mb-4">Quiz</h2>
            {!showFeedback ? (
              <Card className="shadow-md">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">
                      Pregunta {currentQuestion + 1} de {questions.length}
                    </span>
                    <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Completado
                    </span>
                  </div>

                  <h3 className="text-lg font-medium mb-4">
                    {questions[currentQuestion]?.question}
                  </h3>

                  <RadioGroup
                    value={selectedAnswers[currentQuestion]?.toString()}
                    onValueChange={handleAnswerSelect}
                    className="space-y-3"
                  >
                    {(() => {
                      const rawData = JSON.parse(questions[currentQuestion]?.optionsJson ?? "[]");
                      const options = Array.isArray(rawData) ? rawData : Object.values(rawData);

                      return options.map((option: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                        >
                          <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                          <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ));
                    })()}
                  </RadioGroup>

                  <Button
                    className="w-full mt-6"
                    onClick={handleNextQuestion}
                    disabled={selectedAnswers[currentQuestion] === undefined}
                  >
                    {currentQuestion < questions.length - 1 ? (
                      <>
                        Siguiente Pregunta <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>Finalizar Quiz</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-md">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold mb-2">Tu puntuación: {calculateScore()}%</div>
                    <p className="text-muted-foreground">
                      Has respondido correctamente{" "}
                      {questions.reduce((acc, _, idx) => (isAnswerCorrect(idx) ? acc + 1 : acc), 0)}{" "}
                      de {questions.length} preguntas
                    </p>
                  </div>
                  <div className="space-y-4 mb-6">
                    {questions.map((q, idx) => {
                      const chosenIndex = selectedAnswers[idx];
                      const chosenLetter =
                        chosenIndex !== undefined ? OPTION_LABELS[chosenIndex] : "Sin respuesta";
                      const correctLetter = q.correctAnswerKey; // 'A','B','C','D'
                      const isCorrect = chosenLetter === correctLetter;

                      return (
                        <div key={idx} className="border rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            {isCorrect ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            )}
                            <div>
                              <p className="font-medium">{q.question}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Tu respuesta:{" "}
                                <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                  {(() => {
                                    const opts = JSON.parse(q.optionsJson ?? "[]");
                                    const allOpts = Array.isArray(opts) ? opts : Object.values(opts);
                                    return chosenIndex !== undefined
                                      ? allOpts[chosenIndex]
                                      : "Sin respuesta";
                                  })()}
                                </span>
                              </p>
                              {!isCorrect && (
                                <p className="text-sm text-green-600 mt-1">
                                  Respuesta correcta:{" "}
                                  {(() => {
                                    const opts = JSON.parse(q.optionsJson ?? "[]");
                                    const allOpts = Array.isArray(opts) ? opts : Object.values(opts);
                                    // Buscamos el índice en OPTION_LABELS
                                    const correctIdx = OPTION_LABELS.indexOf(correctLetter);
                                    return correctIdx >= 0 && correctIdx < allOpts.length
                                      ? allOpts[correctIdx]
                                      : "Desconocida";
                                  })()}
                                </p>
                              )}
                              <p className="italic text-gray-600 mt-1">Justificación: {q.answer}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-center mb-6">
                    <Link href="/alumno/recomendaciones">
                      <Button
                        variant="outline"
                        className="text-primary-foreground bg-blue-400 hover:bg-primary-foreground hover:text-primary"
                        onClick={handleGetRecommendations}
                      >Ver Recomendaciones Personalizadas</Button>
                    </Link>
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
