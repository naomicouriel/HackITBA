import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "~/server/db";


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
      "start_time": "[marca de tiempo en formato HH:MM:SS del inicio de la explicación]",
      "end_time": "[marca de tiempo en formato HH:MM:SS del final de la explicación]",
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

  // Debug log the prompt length and content
  console.log('Prompt length:', prompt.length);
  console.log('Number of segments in transcript:', transcriptContent.split('\n\n').length);
  
  return prompt;
}

export const generateSummaryRouter = createTRPCRouter({
  generateSummary: publicProcedure
    .input(
      z.object({
        course_id: z.number()  // YouTube video ID
      })
    )
    .mutation(async ({ input }) => {
      const { course_id } = input;

      // 1. Obtener segmentos y temas del curso
      const segmentosDB = await prisma.segment.findMany({
        where: { courseId: course_id },
        orderBy: { start: "asc" },
      });
  
      const temasDB = await prisma.topic.findMany({
        where: { courseId: course_id },
      });
  
      const temas = temasDB.map((t) => t.name);
      
      const transcriptText = segmentosDB.map((s) => s.text).join("\n\n");

      const prompt = createPrompt(transcriptText, temas);
      
      return { segments: segmentosDB, topics: temas };

    })


    //   // Create the prompt for Groq

    //   try {
    //     // Debug log to verify API key and request
    //     console.log('Using API Key:', env.GROQ_API_KEY ? 'Key is present' : 'Key is missing');
    //     console.log('Making request to Groq API...');
        
    //     const requestBody = {
    //       model: "llama-3.3-70b-versatile",
    //       messages: [{ role: "user", content: prompt }],
    //       temperature: 0.3,
    //       max_tokens: 4000
    //     };
        
    //     // Make API call to Groq
    //     const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    //       method: 'POST',
    //       headers: {
    //         'Authorization': `Bearer ${env.GROQ_API_KEY}`,
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify(requestBody),
    //     });

    //     if (!response.ok) {
    //       const errorData = await response.json().catch(() => ({}));
    //       console.error('Groq API Response:', {
    //         status: response.status,
    //         statusText: response.statusText,
    //         headers: Object.fromEntries(response.headers.entries()),
    //         error: errorData
    //       });
    //       throw new Error(`Groq API error: ${response.statusText}. ${JSON.stringify(errorData)}`);
    //     }

    //     const data = await response.json();
    //     console.log('Groq API Response data:', data);

    //     try {
    //       // Clean up the response content by removing markdown formatting
    //       let content = data.choices[0].message.content.trim();
          
    //       // Extract just the JSON part from the response
    //       const jsonMatch = content.match(/\{[\s\S]*\}/);
    //       if (!jsonMatch) {
    //         console.error('No JSON object found in response');
    //         throw new Error('Invalid response format');
    //       }
    //       content = jsonMatch[0];
          
    //       console.log('Extracted JSON content:', content);  // Debug log
          
    //       const analysis: TranscriptAnalysis = JSON.parse(content);
          
    //       // Add YouTube URLs to each topic, skipping those without timestamps
    //       const topicsWithUrls = analysis.topics
    //         .filter(topic => topic.start_time && topic.end_time) // Only include topics with valid timestamps
    //         .map(topic => ({
    //           ...topic,
    //           youtubeUrl: `https://youtu.be/${course_id}?t=${Math.floor(parseTimeToSeconds(topic.start_time))}`
    //         }));

    //       return {
    //         message: "✅ Summary generated successfully",
    //         analysis: {
    //           ...analysis,
    //           topics: topicsWithUrls
    //         }
    //       };
    //     } catch (parseError) {
    //       console.error('Error parsing Groq response:', parseError);
    //       console.error('Raw response content:', data.choices?.[0]?.message?.content);
    //       throw new Error('Failed to parse Groq response');
    //     }
    //   } catch (error) {
    //     console.error('Error generating summary:', error);
    //     if (error instanceof Error) {
    //       throw new Error(`Failed to generate summary: ${error.message}`);
    //     }
    //     throw new Error('Failed to generate summary');
    //   }
    // }),
});
