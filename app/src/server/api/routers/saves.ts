import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const savesRouter = createTRPCRouter({
  store: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        entries: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.save.create({
        data: {
          date: input.date,
          entries: input.entries,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.save.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
