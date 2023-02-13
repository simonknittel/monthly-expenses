import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const savesRouter = createTRPCRouter({
  create: protectedProcedure
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
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        date: z.date(),
        entries: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.save.update({
        where: {
          id: input.id,
        },
        data: {
          date: input.date,
          entries: input.entries,
        },
      });
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.save.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  get: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.save.findFirst({
        where: {
          AND: [
            {
              id: input.id,
            },
            {
              userId: ctx.session.user.id,
            },
          ],
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.save.deleteMany({
        where: {
          AND: [
            {
              id: input.id,
            },
            {
              userId: ctx.session.user.id,
            },
          ],
        },
      });
    }),
});
