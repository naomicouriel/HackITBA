import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "~/server/db";

export const analysisRouter = createTRPCRouter({
  getLowScoreTopics: publicProcedure
    .input(
      z.object({
        studentId: z.number(),
        threshold: z.number(), // 0 a 100
      })
    )
    .query(async ({ input }) => {
      const { studentId, threshold } = input;

      // 1. Buscar tópicos con al menos 1 Resumen
      const topicsWithResumen = await prisma.topic.findMany({
        include: {
          // Incluir los resúmenes asociados (opcional si deseas datos de Resumen)
          resumen: true,
        },
      });

      // Array final de tópicos "bajos" con sus resúmenes
      const lowScoreTopics: Array<{
        topicId: number;
        name: string;
        score: number;
        resumenes: any[];
      }> = [];

      for (const topic of topicsWithResumen) {
        // 2. Buscar las preguntas asociadas a este topic
        //    (asumiendo question.topicId = topic.id en tu schema)
        const questions = await prisma.question.findMany({
          where: { topicId: topic.id },
          include: {
            responses: {
              where: { studentId }, // solo las respuestas de este alumno
            },
          },
        });

        const totalQuestions = questions.length;
        if (totalQuestions === 0) {
          // sin preguntas, no evaluamos
          continue;
        }

        // 3. Calcular cuántas acertó el alumno
        let correctAnswers = 0;
        for (const q of questions) {
          // si cada pregunta tiene 1 respuesta, bastaría la primera
          // en caso de múltiples, sumamos las correctas
          for (const ans of q.responses) {
            if (ans.isCorrect) correctAnswers++;
          }
        }

        console.log(
          `Topic: ${topic.name}, Total Questions: ${totalQuestions}, Correct Answers: ${correctAnswers}`
        );
        // 4. Calcular score
        const score = correctAnswers / totalQuestions;

        // 5. Comparar con threshold (0..100 => score < threshold/100)
        if (score < threshold / 100) {
          lowScoreTopics.push({
            topicId: topic.id,
            name: topic.name,
            score,
            resumenes: topic.resumen.map((r) => ({
              id: r.id,
              summary: r.summary,
              transcriptSegment: r.transcriptSegment,
              startTime: r.startTime,
              endTime: r.endTime,
              keyTerms: r.keyTerms, // guardado en string
              relatedTopics: r.relatedTopics,
              // ... lo que desees
            })),
          });
        }
      }

      //retorna 2 topics aleatorios
      // const randomTopics = lowScoreTopics.sort(() => 0.5 - Math.random()).slice(0, 2);
      // Si no hay suficientes tópicos, retorna todos los que encontró

      if (lowScoreTopics.length > 2) {
        return lowScoreTopics.sort(() => 0.5 - Math.random()).slice(0, 2);
      }

      return lowScoreTopics;
    }),

    getTwoTopicSummaries: publicProcedure.query(async () => {
      // 1. Buscar los 2 primeros topics por su ID ascendente (o cualquier criterio)
      const firstTwoTopics = await prisma.topic.findMany({
        orderBy: {
          id: "asc", // o "createdAt" si tuvieses ese campo
        },
        take: 2, // solo 2 tópicos
        include: {
          // 2. Incluir sus resúmenes
          resumen: true,
        },
      });
  
      // Retorna los 2 tópicos con sus resúmenes
      return firstTwoTopics;
    }),
});
