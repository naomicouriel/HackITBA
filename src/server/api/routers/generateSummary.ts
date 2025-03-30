import axios from "axios";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "~/server/db";


const API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";



// Helper function to create the prompt for the Groq API
function createPrompt(transcriptContent: string, topics: string[]): string {
  const prompt = `Por favor, analiza este archivo de transcripción y extrae información sobre TODOS los siguientes temas que están PRESENTES en la transcripción. Es OBLIGATORIO buscar y analizar cada uno de estos temas:

${topics.map((topic, index) => `${index + 1}. ${topic}`).join('\n')}

Para cada uno de estos temas, debes:

1. Identificar el segmento COMPLETO donde se explica el tema, desde el inicio de su introducción hasta el final de su explicación completa
2. Extraer el segmento completo de la transcripción para ese tema, incluyendo toda la discusión relacionada
3. Generar un resumen conciso pero completo (4-5 oraciones) en español
4. Formatear todo en un JSON estructurado con el siguiente esquema:

{
  "topics": [
    {
      "name": "[DEBE ser EXACTAMENTE uno de los siguientes temas, sin modificar: ${topics.join(", ")}]",
      "start_time": "[marca de tiempo del inicio de la explicación como esta en la transcripción]",
      "end_time": "[marca de tiempo del final de la explicación como esta en la transcripción]",
      "transcript_segment": "[texto completo que cubre toda la explicación del tema]",
      "summary": "[resumen conciso de los puntos clave en español]",
      "key_terms": ["[término1]", "[término2]"],
      "related_topics": ["[tema relacionado1]", "[tema relacionado2]"]
    }
  ],
  "metadata": {
    "transcript_title": "Curso básico de finanzas y economía",
    "transcript_duration": "[duración total]",
    "analysis_date": "[fecha actual]"
  }
}

INSTRUCCIONES IMPORTANTES:
1. DEBES analizar TODOS los temas de la lista proporcionada
2. El campo "name" DEBE ser EXACTAMENTE uno de los siguientes (copiar y pegar el nombre exacto): ${topics.join(", ")}
3. Para cada tema:
   - Busca su explicación completa en la transcripción
   - Asegúrate de capturar TODO el segmento donde se explica, desde su introducción hasta su conclusión
   - Las marcas de tiempo deben cubrir la explicación completa, no solo menciones breves
4. Si un tema se menciona en varios lugares:
   - Usa el segmento donde se explica más a fondo
   - Incluye referencias cruzadas en related_topics si es relevante
5. TODOS los resúmenes deben estar en español

Contenido de la transcripción:
${transcriptContent}`;
  
  return prompt;
}

export const generateSummaryRouter = createTRPCRouter({
  generateSummary: publicProcedure
    .input(
      z.object({
        course_id: z.number(),
        desdeSegmento: z.number().optional(),
        hastaSegmento: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { course_id, desdeSegmento, hastaSegmento } = input;

      // 1. Obtener segmentos y temas del curso
      const segmentosDB = await prisma.segment.findMany({
        where: { courseId: course_id },
        orderBy: { start: "asc" },
      });

      const temasDB = await prisma.topic.findMany({
        where: { courseId: course_id },
      });

      const temas = temasDB.map((t) => t.name);

      // 2. Filtrar los segmentos según los inputs (si se proporcionan)
      let filteredSegments = segmentosDB;
      if (desdeSegmento !== undefined && hastaSegmento !== undefined) {
        filteredSegments = segmentosDB.filter(
          (segment) => segment.start >= desdeSegmento && segment.end <= hastaSegmento
        );
      }

      // Convertir los segmentos filtrados a string
      const transcriptText = JSON.stringify(filteredSegments, null, 2);

      // Crear el prompt
      const prompt = createPrompt(transcriptText, temas);

      // Llamada a la API (Groq u otra)
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
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("No JSON object found in response");
        throw new Error("Invalid response format");
      }

      const respuesta = jsonMatch[0];
      const analysis = JSON.parse(respuesta);

      // 3. Guardar cada "topic" en la tabla Resumen
      if (analysis?.topics?.length) {
        for (const genTopic of analysis.topics) {
          // Buscar el topic en la DB por nombre
          const dbTopic = await prisma.topic.findFirst({
            where: {
              courseId: course_id,
              name: genTopic.name,
            },
          });

          if (!dbTopic) {
            // Podrías omitir o crear el topic si no existe
            console.warn(`Topic ${genTopic.name} no se encontró en DB. Saltando...`);
            continue;
          }

          // Insertar un registro en Resumen
          await prisma.resumen.create({
            data: {
              topicId: dbTopic.id,
              summary: genTopic.summary,
              transcriptSegment: genTopic.transcript_segment,
              startTime: genTopic.start_time ? parseFloat(genTopic.start_time) : 0,
              endTime: genTopic.end_time ? parseFloat(genTopic.end_time) : 0,
              keyTerms: genTopic.key_terms
                ? JSON.stringify(genTopic.key_terms) // si viene un array
                : undefined,
              relatedTopics: genTopic.related_topics
                ? JSON.stringify(genTopic.related_topics)
                : undefined,
            },
          });
        }
      }

      // Retornar la info necesaria
      return {
        segments: segmentosDB,
        topics: temas,
        analysis,
      };
    }),
});
