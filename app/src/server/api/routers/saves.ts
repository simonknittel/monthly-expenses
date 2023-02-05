import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const savesRouter = createTRPCRouter({
  store: publicProcedure
    .input(
      z.object({
        username: z.string(),
        date: z.date(),
        entries: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.save.create({
        data: {
          username: input.username,
          date: input.date,
          entries: input.entries,
        },
      });
    }),
  get: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.save.findMany({
        where: {
          username: input.username,
        },
      });
    }),
});
