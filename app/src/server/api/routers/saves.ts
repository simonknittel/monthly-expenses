import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const savesRouter = createTRPCRouter({
  store: publicProcedure
    .input(z.object({ id: z.string(), date: z.date(), entries: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.saves.create({
        data: {
          id: input.id,
          date: input.date,
          entries: input.entries,
        },
      });
    }),
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.saves.findMany({
        where: {
          id: input.id,
        },
      });
    }),
});
