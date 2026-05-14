import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  products,
  campaigns,
  orders,
  agentActivities,
  kpiMetrics,
  shippingProviders,
  recommendations,
} from "@db/schema";
import { eq, desc, sql, gte } from "drizzle-orm";

export const dashboardRouter = createRouter({
  getKPIs: publicQuery.query(async () => {
    const db = getDb();
    const totalRevenue = await db
      .select({ total: sql<string>`COALESCE(SUM(${orders.totalAmount}), 0)` })
      .from(orders)
      .where(eq(orders.status, "delivered"));

    const orderStats = await db
      .select({
        total: sql<string>`COUNT(*)`,
        confirmed: sql<string>`SUM(CASE WHEN ${orders.status} IN ('confirmed', 'voice_confirmed', 'shipped', 'delivered') THEN 1 ELSE 0 END)`,
        delivered: sql<string>`SUM(CASE WHEN ${orders.status} = 'delivered' THEN 1 ELSE 0 END)`,
        cancelled: sql<string>`SUM(CASE WHEN ${orders.status} = 'cancelled' THEN 1 ELSE 0 END)`,
      })
      .from(orders);

    const campaignStats = await db
      .select({
        active: sql<string>`SUM(CASE WHEN ${campaigns.status} = 'active' THEN 1 ELSE 0 END)`,
        total: sql<string>`COUNT(*)`,
      })
      .from(campaigns);

    const totalOrders = Number(orderStats[0]?.total || 0);
    const confirmedOrders = Number(orderStats[0]?.confirmed || 0);
    const deliveredOrders = Number(orderStats[0]?.delivered || 0);

    return {
      revenue: Number(totalRevenue[0]?.total || 0),
      confirmationRate: totalOrders > 0 ? Math.round((confirmedOrders / totalOrders) * 1000) / 10 : 0,
      deliveryRate: totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 1000) / 10 : 0,
      totalOrders,
      activeCampaigns: Number(campaignStats[0]?.active || 0),
      totalCampaigns: Number(campaignStats[0]?.total || 0),
    };
  }),

  getRevenueChart: publicQuery
    .input(z.object({ days: z.number().default(30) }))
    .query(async ({ input }) => {
      const db = getDb();
      const metrics = await db
        .select({
          date: kpiMetrics.date,
          value: kpiMetrics.metricValue,
        })
        .from(kpiMetrics)
        .where(eq(kpiMetrics.metricName, "revenue"))
        .orderBy(kpiMetrics.date)
        .limit(input.days);

      return metrics.map((m) => ({
        date: m.date,
        revenue: Number(m.value),
      }));
    }),

  getGovernorateBreakdown: publicQuery.query(async () => {
    const db = getDb();
    const stats = await db
      .select({
        governorate: orders.governorate,
        total: sql<string>`COUNT(*)`,
        delivered: sql<string>`SUM(CASE WHEN ${orders.status} = 'delivered' THEN 1 ELSE 0 END)`,
      })
      .from(orders)
      .groupBy(orders.governorate)
      .orderBy(desc(sql`COUNT(*)`));

    return stats.map((s) => ({
      governorate: s.governorate,
      total: Number(s.total),
      deliveryRate: Number(s.total) > 0
        ? Math.round((Number(s.delivered) / Number(s.total)) * 1000) / 10
        : 0,
    }));
  }),

  getActivityFeed: publicQuery
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(agentActivities)
        .orderBy(desc(agentActivities.createdAt))
        .limit(input.limit);
    }),

  getAlerts: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(recommendations)
      .where(eq(recommendations.status, "pending"))
      .orderBy(desc(recommendations.confidence))
      .limit(10);
  }),

  getAgentStatus: publicQuery.query(async () => {
    return [
      { name: "CEO Agent", status: "operational", color: "#22D3EE" },
      { name: "Product Hunter", status: "operational", color: "#10B981" },
      { name: "Creative Director", status: "processing", color: "#8B5CF6" },
      { name: "Landing Page", status: "operational", color: "#F59E0B" },
      { name: "Confirmation", status: "operational", color: "#3B82F6" },
      { name: "Shipping", status: "processing", color: "#F97316" },
      { name: "Finance", status: "operational", color: "#EF4444" },
      { name: "HR & Team", status: "operational", color: "#6366F1" },
    ];
  }),
});
