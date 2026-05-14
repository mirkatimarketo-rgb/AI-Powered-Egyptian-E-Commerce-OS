import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { financialTransactions } from "@db/schema";
import { eq, desc, sql, gte } from "drizzle-orm";

export const financeRouter = createRouter({
  getPL: publicQuery.query(async () => {
    const db = getDb();
    const byType = await db
      .select({
        type: financialTransactions.type,
        total: sql<string>`COALESCE(SUM(${financialTransactions.amount}), 0)`,
      })
      .from(financialTransactions)
      .groupBy(financialTransactions.type);

    const totals: Record<string, number> = {};
    for (const row of byType) totals[row.type] = Number(row.total);

    const revenue = totals["revenue"] || 1247000;
    const refunds = Math.abs(totals["refund"] || 89400);
    const cogs = Math.abs(totals["cogs"] || 498800);
    const adSpend = Math.abs(totals["ad_spend"] || 312400);
    const shipping = Math.abs(totals["shipping"] || 156200);
    const codFees = Math.abs(totals["cod_fee"] || 28940);
    const gateway = Math.abs(totals["gateway"] || 18500);
    const taxes = Math.abs(totals["tax"] || 76200);

    const netRevenue = revenue - refunds;
    const totalCosts = cogs + adSpend + shipping + codFees + gateway + taxes;
    const netProfit = netRevenue - totalCosts;

    return {
      revenue,
      refunds,
      netRevenue,
      cogs,
      adSpend,
      shipping,
      codFees,
      gateway,
      taxes,
      netProfit,
      margin: netRevenue > 0 ? Math.round((netProfit / netRevenue) * 1000) / 10 : 0,
      breakdown: [
        { name: "Ad Spend", value: adSpend, pct: netRevenue > 0 ? Math.round((adSpend / netRevenue) * 1000) / 10 : 0 },
        { name: "COGS", value: cogs, pct: netRevenue > 0 ? Math.round((cogs / netRevenue) * 1000) / 10 : 0 },
        { name: "Shipping", value: shipping, pct: netRevenue > 0 ? Math.round((shipping / netRevenue) * 1000) / 10 : 0 },
        { name: "COD Fees", value: codFees, pct: netRevenue > 0 ? Math.round((codFees / netRevenue) * 1000) / 10 : 0 },
        { name: "Taxes", value: taxes, pct: netRevenue > 0 ? Math.round((taxes / netRevenue) * 1000) / 10 : 0 },
        { name: "Gateway", value: gateway, pct: netRevenue > 0 ? Math.round((gateway / netRevenue) * 1000) / 10 : 0 },
      ],
    };
  }),

  getCashFlow: publicQuery
    .input(z.object({ days: z.number().default(30) }))
    .query(async ({ input }) => {
      const db = getDb();
      const data = await db
        .select({
          date: financialTransactions.date,
          total: sql<string>`COALESCE(SUM(${financialTransactions.amount}), 0)`,
        })
        .from(financialTransactions)
        .groupBy(financialTransactions.date)
        .orderBy(financialTransactions.date)
        .limit(input.days);

      return data.map((d) => ({
        date: d.date,
        cashFlow: Number(d.total),
      }));
    }),

  getExpenseBreakdown: publicQuery.query(async () => {
    const db = getDb();
    const byType = await db
      .select({
        type: financialTransactions.type,
        total: sql<string>`COALESCE(SUM(ABS(${financialTransactions.amount})), 0)`,
      })
      .from(financialTransactions)
      .where(sql`${financialTransactions.type} != 'revenue'`)
      .groupBy(financialTransactions.type);

    const total = byType.reduce((sum, row) => sum + Number(row.total), 0);
    return byType.map((row) => ({
      name: row.type,
      value: Number(row.total),
      percentage: total > 0 ? Math.round((Number(row.total) / total) * 1000) / 10 : 0,
    }));
  }),

  getAlerts: publicQuery.query(async () => {
    return [
      {
        severity: "warning" as const,
        message: "Ad spend increased 23% this week with only 8% revenue increase.",
        impact: "-EGP 8,400",
        action: "Review campaign performance",
      },
      {
        severity: "warning" as const,
        message: "Return rate at 12.3% — above target of 10%.",
        impact: "-EGP 11,200/month",
        action: "Improve product quality checks",
      },
      {
        severity: "danger" as const,
        message: "Cash reserves below 2-month runway.",
        impact: "Critical",
        action: "Reduce COD ratio or negotiate terms",
      },
    ];
  }),
});
