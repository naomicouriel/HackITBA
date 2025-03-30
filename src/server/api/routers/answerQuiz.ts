import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const answerQuizRouter = createTRPCRouter({
  completeQuiz: publicProcedure
  .input(
    z.object({
      studentId: z.number(),
      quizId: z.number(),
      answers: z.array(
        z.object({
          questionId: z.number(),
          // La respuesta es una de las 4 opciones
          response: z.enum(["A", "B", "C", "D"]),
        })
      ),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { studentId, quizId, answers } = input;

    // 1. Guardar todas las respuestas en la tabla StudentAnswer
    //    comparando con la clave correcta guardada en Question
    await Promise.all(
      answers.map(async (ans) => {
        const question = await ctx.prisma.question.findUnique({
          where: { id: ans.questionId },
        });
        if (!question) {
          throw new Error(`Pregunta no encontrada (ID: ${ans.questionId})`);
        }

        // Comparamos la respuesta con la clave correcta
        const isCorrect = question.correctAnswerKey === ans.response;

        // Creamos la respuesta en la tabla StudentAnswer
        await ctx.prisma.studentAnswer.create({
          data: {
            studentId: studentId,
            questionId: ans.questionId,
            response: ans.response,
            isCorrect,
          },
        });
      })
    );

    // 2. Actualizar el status del quiz en StudentQuiz a "completed"
    //    (ej. si antes estaba "pending")
    await ctx.prisma.studentQuiz.updateMany({
      where: {
        studentId,
        quizId,
        status: "pending",
      },
      data: {
        status: "completed",
      },
    });

    return { success: true };
  }),


  assignQuizToStudents: publicProcedure
    .input(z.object({ quizId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Buscar a todos los alumnos (usuarios con role "STUDENT")
      const students = await ctx.prisma.user.findMany({
        where: { role: "STUDENT" },
      });

      // Preparar los registros para asignar el quiz a cada alumno
      const assignments = students.map((student) => ({
        studentId: student.id,
        quizId: input.quizId,
        status: "pending",
      }));

      // Si tu versión de Prisma no soporta createMany, usamos Promise.all para crear cada registro individualmente.
      await Promise.all(
        assignments.map((assignment) =>
          ctx.prisma.studentQuiz.create({ data: assignment })
        )
      );

      return { success: true, count: assignments.length };
    }),
});
