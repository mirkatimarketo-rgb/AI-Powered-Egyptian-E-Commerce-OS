import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { kpiMetrics, recommendations, campaigns, orders } from "@db/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";

export const ceoRouter = createRouter({
  getKPIs: publicQuery.query(async () => {
    const db = getDb();

    const campaignStats = await db
      .select({
        totalRoas: sql<string>`COALESCE(SUM(${campaigns.roas} * ${campaigns.spent}) / NULLIF(SUM(${campaigns.spent}), 0), 0)`,
        totalCpa: sql<string>`COALESCE(AVG(${campaigns.cpa}), 0)`,
        totalBudget: sql<string>`COALESCE(SUM(${campaigns.budget}), 0)`,
        totalSpent: sql<string>`COALESCE(SUM(${campaigns.spent}), 0)`,
      })
      .from(campaigns)
      .where(eq(campaigns.status, "active"));

    const orderStats = await db
      .select({
        total: sql<string>`COUNT(*)`,
        confirmed: sql<string>`SUM(CASE WHEN ${orders.status} IN ('confirmed','voice_confirmed','shipped','delivered') THEN 1 ELSE 0 END)`,
        delivered: sql<string>`SUM(CASE WHEN ${orders.status} = 'delivered' THEN 1 ELSE 0 END)`,
      })
      .from(orders);

    const totalOrders = Number(orderStats[0]?.total || 1);

    return {
      roas: Math.round(Number(campaignStats[0]?.totalRoas || 0) * 100) / 100,
      cpa: Math.round(Number(campaignStats[0]?.totalCpa || 0) * 100) / 100,
      confirmationRate: Math.round((Number(orderStats[0]?.confirmed || 0) / totalOrders) * 1000) / 10,
      deliveryRate: Math.round((Number(orderStats[0]?.delivered || 0) / totalOrders) * 1000) / 10,
      profitMargin: 18.5,
      cashFlow: 42000,
      totalBudget: Number(campaignStats[0]?.totalBudget || 0),
      totalSpent: Number(campaignStats[0]?.totalSpent || 0),
    };
  }),

  getROASChart: publicQuery
    .input(z.object({ days: z.number().default(30) }))
    .query(async ({ input }) => {
      const db = getDb();
      const roasData = await db
        .select({ date: kpiMetrics.date, value: kpiMetrics.metricValue })
        .from(kpiMetrics)
        .where(eq(kpiMetrics.metricName, "roas"))
        .orderBy(kpiMetrics.date)
        .limit(input.days);

      const cpaData = await db
        .select({ date: kpiMetrics.date, value: kpiMetrics.metricValue })
        .from(kpiMetrics)
        .where(eq(kpiMetrics.metricName, "cpa"))
        .orderBy(kpiMetrics.date)
        .limit(input.days);

      return roasData.map((r, i) => ({
        date: r.date,
        roas: Number(r.value),
        cpa: Number(cpaData[i]?.value || 0),
      }));
    }),

  getProfitabilityWaterfall: publicQuery.query(async () => {
    const db = getDb();
    const revenue = await db
      .select({ total: sql<string>`COALESCE(SUM(${orders.totalAmount}), 0)` })
      .from(orders)
      .where(eq(orders.status, "delivered"));

    const rev = Number(revenue[0]?.total || 847320);

    return [
      { name: "Gross Revenue", value: rev, type: "positive" },
      { name: "Ad Spend", value: -312400, type: "negative" },
      { name: "COGS", value: -249400, type: "negative" },
      { name: "Shipping", value: -156200, type: "negative" },
      { name: "Returns", value: -89400, type: "negative" },
      { name: "COD Fees", value: -28940, type: "negative" },
      { name: "Taxes", value: -76200, type: "negative" },
      { name: "Gateway", value: -18500, type: "negative" },
      { name: "Net Profit", value: rev - 312400 - 249400 - 156200 - 89400 - 28940 - 76200 - 18500, type: "total" },
    ];
  }),

  getRecommendations: publicQuery
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(recommendations)
        .orderBy(desc(recommendations.confidence))
        .limit(input.limit);
    }),

  updateRecommendation: publicQuery
    .input(z.object({ id: z.number(), status: z.enum(["accepted", "rejected", "implemented"]) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(recommendations)
        .set({ status: input.status })
        .where(eq(recommendations.id, input.id));
      return { success: true };
    }),

  getHealthScore: publicQuery.query(async () => {
    return {
      overall: 82,
      revenue: 90,
      operations: 78,
      marketing: 85,
      finance: 72,
      team: 88,
    };
  }),
});
