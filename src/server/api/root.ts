import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { createQuestionsRouter } from "./routers/createQuestions";
import { generateSummaryRouter } from "./routers/generateSummary";
import { createTranscriptionsRouter } from "./routers/createTranscriptions";
import { createTemasRouter } from "./routers/createTemas";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  createQuestions: createQuestionsRouter,
  generateSummary: generateSummaryRouter,
  createTranscriptions: createTranscriptionsRouter,
  createTemas: createTemasRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
