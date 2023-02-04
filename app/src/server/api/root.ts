import { createTRPCRouter } from "./trpc";
import { savesRouter } from "./routers/saves";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  saves: savesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
