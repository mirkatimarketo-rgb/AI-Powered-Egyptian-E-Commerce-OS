import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { creatives } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const creativeRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        productId: z.number().optional(),
        type: z.string().optional(),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      let query = db.select().from(creatives);
      if (input.productId) query = query.where(eq(creatives.productId, input.productId)) as typeof query;
      if (input.type) query = query.where(eq(creatives.type, input.type as "ad_creative" | "ad_copy" | "ugc_script" | "hook")) as typeof query;
      return query.orderBy(desc(creatives.createdAt)).limit(input.limit);
    }),

  generate: publicQuery
    .input(
      z.object({
        productId: z.number(),
        type: z.enum(["ad_creative", "ad_copy", "ugc_script", "hook"]),
        objective: z.enum(["awareness", "conversion", "retargeting"]).default("conversion"),
        tone: z.enum(["urgent", "lifestyle", "problem_solution", "social_proof", "fomo"]).default("problem_solution"),
        language: z.enum(["arabic", "english", "mixed"]).default("arabic"),
        platform: z.enum(["facebook", "instagram", "tiktok", "universal"]).default("universal"),
        title: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const contentMap: Record<string, string> = {
        ad_copy: JSON.stringify({
          headline: input.language === "arabic" ? "عرض حصري — لا تفوت الفرصة!" : "Exclusive Offer — Limited Time!",
          body: input.language === "arabic" ? "اكتشف المنتج الأكثر مبيعاً هذا الموسم" : "Discover our best-selling product this season",
          cta: "Shop Now",
        }),
        ad_creative: JSON.stringify({
          concept: "Problem-Solution layout",
          visual: "Before/After comparison",
          headline: "Transform Your Experience Today",
          cta: "Get Yours Now",
        }),
        ugc_script: JSON.stringify({
          hook: "Show the problem in 3 seconds",
          script: "I was struggling with this every day until I found this product. Now everything is different.",
          broll: "Product usage, before/after",
        }),
        hook: JSON.stringify({
          hooks: [
            "Stop wasting money on...",
            "This changed my life in 30 seconds",
            "Nobody talks about this hack...",
          ],
        }),
      };

      const result = await db.insert(creatives).values({
        productId: input.productId,
        type: input.type,
        title: input.title,
        content: contentMap[input.type] || JSON.stringify({}),
        language: input.language,
        tone: input.tone,
        platform: input.platform,
        predictedCtr: String((Math.random() * 3 + 1).toFixed(1)),
        engagementScore: Math.floor(Math.random() * 30) + 70,
      });

      return { id: Number(result[0].insertId) };
    }),

  save: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(creatives)
        .set({ isSaved: true })
        .where(eq(creatives.id, input.id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(creatives).where(eq(creatives.id, input.id));
      return { success: true };
    }),
});
