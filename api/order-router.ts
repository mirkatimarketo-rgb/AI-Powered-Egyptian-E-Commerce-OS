import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, whatsappTemplates } from "@db/schema";
import { eq, desc, sql, and, like } from "drizzle-orm";

export const orderRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        status: z.string().optional(),
        governorate: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];
      if (input.status) conditions.push(eq(orders.status, input.status));
      if (input.governorate) conditions.push(eq(orders.governorate, input.governorate));
      if (input.search) {
        conditions.push(
          sql`${orders.orderNumber} LIKE ${`%${input.search}%`} OR ${orders.customerName} LIKE ${`%${input.search}%`}`
        );
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(orders)
        .where(where)
        .orderBy(desc(orders.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      const count = await db
        .select({ total: sql<string>`COUNT(*)` })
        .from(orders)
        .where(where);

      return { items, total: Number(count[0]?.total || 0) };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1);
      return result[0] || null;
    }),

  updateStatus: publicQuery
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(orders)
        .set({ status: input.status as "new" | "whatsapp_sent" | "responded" | "confirmed" | "voice_confirmed" | "shipped" | "delivered" | "returned" | "cancelled" })
        .where(eq(orders.id, input.id));
      return { success: true };
    }),

  getPipeline: publicQuery.query(async () => {
    const db = getDb();
    const stats = await db
      .select({
        status: orders.status,
        count: sql<string>`COUNT(*)`,
      })
      .from(orders)
      .groupBy(orders.status);

    const pipeline = [
      { stage: "new", label: "New", count: 0 },
      { stage: "whatsapp_sent", label: "WhatsApp Sent", count: 0 },
      { stage: "responded", label: "Responded", count: 0 },
      { stage: "confirmed", label: "Confirmed", count: 0 },
      { stage: "voice_confirmed", label: "Voice Confirmed", count: 0 },
      { stage: "shipped", label: "Shipped", count: 0 },
      { stage: "delivered", label: "Delivered", count: 0 },
    ];

    for (const stat of stats) {
      const p = pipeline.find((s) => s.stage === stat.status);
      if (p) p.count = Number(stat.count);
    }

    return pipeline;
  }),

  bulkAction: publicQuery
    .input(
      z.object({
        ids: z.array(z.number()),
        action: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      for (const id of input.ids) {
        await db
          .update(orders)
          .set({ status: input.action as "new" | "whatsapp_sent" | "responded" | "confirmed" | "voice_confirmed" | "shipped" | "delivered" | "returned" | "cancelled" })
          .where(eq(orders.id, id));
      }
      return { success: true };
    }),

  getStats: publicQuery.query(async () => {
    const db = getDb();
    const totalOrders = await db.select({ total: sql<string>`COUNT(*)` }).from(orders);
    const fakeOrders = await db
      .select({ total: sql<string>`SUM(CASE WHEN ${orders.isFake} = 1 THEN 1 ELSE 0 END)` })
      .from(orders);
    const avgRisk = await db
      .select({ avg: sql<string>`COALESCE(AVG(${orders.riskScore}), 0)` })
      .from(orders);

    return {
      totalOrders: Number(totalOrders[0]?.total || 0),
      fakeOrders: Number(fakeOrders[0]?.total || 0),
      avgRiskScore: Math.round(Number(avgRisk[0]?.avg || 0) * 10) / 10,
    };
  }),

  getTemplates: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(whatsappTemplates).where(eq(whatsappTemplates.isActive, true));
  }),
});
