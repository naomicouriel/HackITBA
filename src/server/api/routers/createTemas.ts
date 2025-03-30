import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTemasRouter = createTRPCRouter({
    createTemas: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        courseId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { name, courseId } = input;

      // Verificamos que el curso exista (opcional pero recomendable)
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        throw new Error("Curso no encontrado");
      }

      const nuevoTema = await prisma.topic.create({
        data: {
          name,
          course: {
            connect: { id: courseId },
          },
        },
      });

      return nuevoTema;
    }),

    getTopicsByCourse: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
        return await prisma.topic.findMany({
        where: { courseId: input.courseId },
        });
    }),
});
