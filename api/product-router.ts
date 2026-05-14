import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products } from "@db/schema";
import { eq, desc, sql, like, and } from "drizzle-orm";

export const productRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        search: z.string().optional(),
        category: z.string().optional(),
        status: z.string().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];
      if (input.search) conditions.push(like(products.name, `%${input.search}%`));
      if (input.category) conditions.push(eq(products.category, input.category));
      if (input.status) conditions.push(eq(products.status, input.status));

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(products)
        .where(where)
        .orderBy(desc(products.roas))
        .limit(input.limit)
        .offset(input.offset);

      const count = await db
        .select({ total: sql<string>`COUNT(*)` })
        .from(products)
        .where(where);

      return { items, total: Number(count[0]?.total || 0) };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id))
        .limit(1);
      return result[0] || null;
    }),

  create: publicQuery
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        sourcePrice: z.string().optional(),
        suggestedPrice: z.string().optional(),
        category: z.string().optional(),
        marginMultiplier: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(products).values({
        name: input.name,
        description: input.description,
        sourcePrice: input.sourcePrice,
        suggestedPrice: input.suggestedPrice,
        category: input.category,
        marginMultiplier: input.marginMultiplier,
      });
      return { id: Number(result[0].insertId) };
    }),

  analyze: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const saturationScore = Math.floor(Math.random() * 10) + 1;
      const competitionScore = Math.floor(Math.random() * 10) + 1;
      const demandScore = Math.floor(Math.random() * 10) + 1;
      const marketFitScore = Math.floor(Math.random() * 40) + 60;

      await db
        .update(products)
        .set({
          saturationScore,
          competitionScore,
          demandScore,
          marketFitScore,
        })
        .where(eq(products.id, input.id));

      return {
        saturationScore,
        competitionScore,
        demandScore,
        marketFitScore,
        verdict:
          marketFitScore > 80
            ? "HIGH POTENTIAL"
            : marketFitScore > 60
            ? "MODERATE POTENTIAL"
            : "LOW POTENTIAL",
      };
    }),

  getWinningProducts: publicQuery
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(products)
        .where(eq(products.status, "winning"))
        .orderBy(desc(products.roas))
        .limit(input.limit);
    }),

  getCategories: publicQuery.query(async () => {
    const db = getDb();
    const result = await db
      .selectDistinct({ category: products.category })
      .from(products)
      .where(sql`${products.category} IS NOT NULL`);
    return result.map((r) => r.category).filter(Boolean);
  }),
});
