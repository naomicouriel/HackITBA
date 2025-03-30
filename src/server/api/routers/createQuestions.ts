import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

const API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";


const extractTextFromSegments = (
  segments: { text: string; start: number; end: number }[],
  desdeSegundo?: number,
  hastaSegundo?: number
) => {
  const filtrados = segments.filter((seg) => {
    const startOk = desdeSegundo !== undefined ? seg.start >= desdeSegundo : true;
    const endOk = hastaSegundo !== undefined ? seg.end <= hastaSegundo : true;
    return startOk && endOk;
  });

  const textoCompleto = filtrados.map((s) => s.text.trim()).join(" ");
  const textos = filtrados.map((s) => s.text.trim());

  return { textoCompleto, textos };
};


const identificarTemas = async (texto: string, segmentos: string[], temas: string[]) => {
  const temasTexto = temas.map((t, i) => `${i + 1}. ${t}`).join("\n");
  const prompt = `
Analiza el siguiente texto y determina qué temas de la lista están presentes en el texto.

Lista de temas:
${temasTexto}

Texto:
${texto}

Devuelve un JSON:
{
  "temas_presentes": [
    { "tema": "nombre del tema", "presente": true/false, "segmentos": [0, 1, 2] }
  ]
}`;

  const { data } = await axios.post(
    GROQ_URL,
    {
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const content = data.choices[0].message.content;
  let parsed;
  try {
    const match = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (match) {
      parsed = JSON.parse(match[1]);
    } else {
      const limpio = content.trim().replace(/^.*?({)/s, "$1").replace(/(})[^}]*$/s, "$1");
      parsed = JSON.parse(limpio);
    }
  } catch (error) {
    console.error("❌ Error parseando JSON de Groq:", error);
    console.log("🔍 Respuesta recibida:", content);
    throw new Error("Respuesta de Groq no es JSON válido.");
  }
  return parsed;
};

const generarPreguntas = async (texto: string, tema: string, cantidad: number) => {
  const prompt = `Basándote en el siguiente texto sobre el tema "${tema}", genera ${cantidad} preguntas de opción múltiple (4 opciones cada una).\n\nPregunta 1:...\nA. ...\n...\nRespuesta correcta: ...\n\nTexto:\n${texto}`;

  const { data } = await axios.post(
    GROQ_URL,
    {
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return data.choices[0].message.content;
};

const textoAPreguntasJson = (texto: string) => {
  const bloques = texto.split(/Pregunta \d+:/).map((b) => b.trim()).filter(Boolean);
  return bloques.map((bloque, i) => {
    const lineas = bloque.split("\n");
    const pregunta = lineas[0];
    const opciones: Record<string, string> = {};
    let correcta = "";

    for (const l of lineas) {
      if (l.startsWith("A. ")) opciones.A = l.slice(3).trim();
      if (l.startsWith("B. ")) opciones.B = l.slice(3).trim();
      if (l.startsWith("C. ")) opciones.C = l.slice(3).trim();
      if (l.startsWith("D. ")) opciones.D = l.slice(3).trim();
      const match = l.match(/Respuesta correcta: ([A-D])/);
      if (match) correcta = match[1] || "";
    }

    return {
      numero: i + 1,
      pregunta,
      opciones,
      respuesta_correcta: correcta,
    };
  });
};


export const createQuestionsRouter = createTRPCRouter({
  getSegmentsByCourse: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      return prisma.segment.findMany({
        where: { courseId: input.courseId },
        orderBy: { start: "asc" },
      });
    }),

    createQuestions: publicProcedure
    .input(
      z.object({
        course_id: z.number(),
        desdeSegundo: z.number().optional(),
        hastaSegundo: z.number().optional(),
        threshold: z.number().optional(),
        numPreguntasPorTema: z.number().default(3),
      })
    )
    .mutation(async ({ input }) => {
      const { course_id, desdeSegundo, hastaSegundo, threshold, numPreguntasPorTema } = input;
  
      // 1. Obtener segmentos y temas del curso
      const segmentosDB = await prisma.segment.findMany({
        where: { courseId: course_id },
        orderBy: { start: "asc" },
      });
  
      const temasDB = await prisma.topic.findMany({
        where: { courseId: course_id },
      });
  
      const temas = temasDB.map((t) => t.name);
      const { textoCompleto, textos: segmentos } = extractTextFromSegments(segmentosDB, desdeSegundo, hastaSegundo);
      const analisis = await identificarTemas(textoCompleto, segmentos, temas);

      const createdQuizzes = [];
  
      // 2. Por cada tema identificado como presente, generar preguntas y guardar en DB
      for (const temaInfo of analisis.temas_presentes) {
        if (!temaInfo.presente) continue;
  
        const textoTema = temaInfo.segmentos.map((i: number) => segmentos[i]).join(" ");
        const generado = await generarPreguntas(textoTema, temaInfo.tema, numPreguntasPorTema);
        const preguntasJson = textoAPreguntasJson(generado);
  
        const quiz = await prisma.quiz.create({
          data: {
            threshold: threshold ?? 50,
            module: temaInfo.tema,
            course: { connect: { id: course_id } },
          },
        });
  
        for (const pregunta of preguntasJson) {
          await prisma.question.create({
            data: {
              question: pregunta.pregunta ?? "",
              optionsJson: JSON.stringify(pregunta.opciones),
              correctAnswerKey: pregunta.respuesta_correcta,
              answer: pregunta.opciones[pregunta.respuesta_correcta as keyof typeof pregunta.opciones] || "",
              quiz: { connect: { id: quiz.id } },
            },
          });
        }
  
        createdQuizzes.push(quiz);
      }
  
      const quizzesWithQuestions = await prisma.quiz.findMany({
        where: {
          id: { in: createdQuizzes.map((q) => q.id) },
        },
        include: {
          questions: true,
        },
      });
  
      return {
        message: "✅ Preguntas y quizzes generados con éxito desde transcripción",
        quizzes: quizzesWithQuestions,
      };
    }),

    updateQuestion: publicProcedure
      .input(
        z.object({
          questionId: z.number(),
          questionText: z.string(),
          options: z.record(z.string()), // ej: { A: "...", B: "...", ... }
          correctKey: z.string(), // "A", "B", etc
        })
      )
      .mutation(async ({ input }) => {
        const updated = await prisma.question.update({
          where: { id: input.questionId },
          data: {
            question: input.questionText,
            optionsJson: JSON.stringify(input.options),
            correctAnswerKey: input.correctKey,
            answer: input.options[input.correctKey],
          },
        });

        return updated;
      }),

      getQuizzesByCourse: publicProcedure
        .input(z.object({ courseId: z.number() }))
        .query(async ({ input }) => {
          return await prisma.quiz.findMany({
            where: { courseId: input.courseId },
            include: { questions: true },
          });
        }),

        deleteQuestion: publicProcedure
          .input(z.object({ questionId: z.number() }))
          .mutation(async ({ input }) => {
            await prisma.studentAnswer.deleteMany({
              where: { questionId: input.questionId },
            });
      
            const deleted = await prisma.question.delete({
              where: { id: input.questionId },
            });
      
            return deleted;
          }),


          getPendingTest: publicProcedure
          .input(z.object({ studentId: z.number() }))
          .query(async ({ input, ctx }) => {
            const pendingTest = await ctx.prisma.studentQuiz.findFirst({
              where: {
                studentId: input.studentId,
                status: "pending",
              },
              include: {
                quiz: {
                  include: {
                    questions: true,
                  },
                },
              },
            });
            return pendingTest;
          }),
});
