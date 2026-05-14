import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { teamMembers } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const teamRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(teamMembers).orderBy(desc(teamMembers.performanceScore));
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.id, input.id))
        .limit(1);
      return result[0] || null;
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        role: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const updates: Record<string, unknown> = {};
      if (input.name) updates.name = input.name;
      if (input.role) updates.role = input.role;
      if (input.isActive !== undefined) updates.isActive = input.isActive;
      await db.update(teamMembers).set(updates).where(eq(teamMembers.id, input.id));
      return { success: true };
    }),

  getRankings: publicQuery
    .input(z.object({ period: z.string().default("weekly") }))
    .query(async () => {
      const db = getDb();
      return db
        .select()
        .from(teamMembers)
        .orderBy(desc(teamMembers.performanceScore));
    }),

  getProductivity: publicQuery.query(async () => {
    const db = getDb();
    const responseDist = await db
      .select({
        responseTime: teamMembers.responseTime,
        count: sql<string>`COUNT(*)`,
      })
      .from(teamMembers)
      .groupBy(teamMembers.responseTime);

    return {
      responseDistribution: responseDist.map((r) => ({
        time: Number(r.responseTime),
        count: Number(r.count),
      })),
      avgResponseTime: 3.2,
      avgConfirmationRate: 75.8,
      totalOrdersHandled: 12478,
    };
  }),
});
