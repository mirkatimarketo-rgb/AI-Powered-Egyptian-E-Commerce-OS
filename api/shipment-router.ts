import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { shipments, shippingProviders } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const shipmentRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        providerId: z.number().optional(),
        status: z.string().optional(),
        governorate: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];
      if (input.providerId) conditions.push(eq(shipments.providerId, input.providerId));
      if (input.status) conditions.push(eq(shipments.status, input.status));
      if (input.governorate) conditions.push(eq(shipments.governorate, input.governorate));

      const items = await db
        .select()
        .from(shipments)
        .limit(input.limit)
        .offset(input.offset)
        .orderBy(desc(shipments.createdAt));

      const count = await db.select({ total: sql<string>`COUNT(*)` }).from(shipments);
      return { items, total: Number(count[0]?.total || 0) };
    }),

  getProviderStats: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(shippingProviders).where(eq(shippingProviders.isActive, true));
  }),

  getGovernorateStats: publicQuery.query(async () => {
    const db = getDb();
    const stats = await db
      .select({
        governorate: shipments.governorate,
        total: sql<string>`COUNT(*)`,
        delivered: sql<string>`SUM(CASE WHEN ${shipments.status} = 'delivered' THEN 1 ELSE 0 END)`,
        returned: sql<string>`SUM(CASE WHEN ${shipments.isReturned} = 1 THEN 1 ELSE 0 END)`,
        avgTime: sql<string>`COALESCE(AVG(${shipments.deliveryTime}), 0)`,
      })
      .from(shipments)
      .groupBy(shipments.governorate)
      .orderBy(desc(sql`COUNT(*)`));

    return stats.map((s) => ({
      governorate: s.governorate,
      total: Number(s.total),
      deliveryRate: Number(s.total) > 0 ? Math.round((Number(s.delivered) / Number(s.total)) * 1000) / 10 : 0,
      returnRate: Number(s.total) > 0 ? Math.round((Number(s.returned) / Number(s.total)) * 1000) / 10 : 0,
      avgTime: Math.round(Number(s.avgTime) * 10) / 10,
    }));
  }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        status: z.string().optional(),
        deliveryDate: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const updates: Record<string, unknown> = {};
      if (input.status) updates.status = input.status;
      if (input.deliveryDate) updates.deliveryDate = input.deliveryDate;
      await db.update(shipments).set(updates).where(eq(shipments.id, input.id));
      return { success: true };
    }),

  getReturnRisk: publicQuery.query(async () => {
    const db = getDb();
    const stats = await db
      .select({
        governorate: shipments.governorate,
        total: sql<string>`COUNT(*)`,
        returned: sql<string>`SUM(CASE WHEN ${shipments.isReturned} = 1 THEN 1 ELSE 0 END)`,
      })
      .from(shipments)
      .groupBy(shipments.governorate);

    return stats.map((s) => ({
      governorate: s.governorate || "Unknown",
      risk: Number(s.total) > 0 ? Math.round((Number(s.returned) / Number(s.total)) * 100) : 0,
      total: Number(s.total),
    }));
  }),
});
