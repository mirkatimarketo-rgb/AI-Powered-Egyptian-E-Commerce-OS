import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { agentActivities } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const agentRouter = createRouter({
  getActivities: publicQuery
    .input(
      z.object({
        agent: z.string().optional(),
        type: z.string().optional(),
        limit: z.number().default(50),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      let query = db
        .select()
        .from(agentActivities)
        .orderBy(desc(agentActivities.createdAt))
        .limit(input.limit);
      return query;
    }),

  getStatus: publicQuery.query(async () => {
    return [
      { name: "CEO Agent", status: "operational", color: "#22D3EE", lastActive: "2s ago" },
      { name: "Product Hunter", status: "operational", color: "#10B981", lastActive: "5s ago" },
      { name: "Creative Director", status: "processing", color: "#8B5CF6", lastActive: "now" },
      { name: "Landing Page", status: "operational", color: "#F59E0B", lastActive: "1m ago" },
      { name: "Confirmation", status: "operational", color: "#3B82F6", lastActive: "10s ago" },
      { name: "Shipping", status: "processing", color: "#F97316", lastActive: "now" },
      { name: "Finance", status: "operational", color: "#EF4444", lastActive: "30s ago" },
      { name: "HR & Team", status: "operational", color: "#6366F1", lastActive: "1m ago" },
    ];
  }),

  logActivity: publicQuery
    .input(
      z.object({
        agentName: z.string(),
        action: z.string(),
        type: z.enum(["recommendation", "alert", "analysis", "automation"]),
        confidence: z.number().optional(),
        impact: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(agentActivities).values({
        agentName: input.agentName,
        action: input.action,
        type: input.type,
        confidence: input.confidence,
        impact: input.impact,
      });
      return { success: true };
    }),
});
