import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { landingPages } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const landingPageRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(landingPages).orderBy(desc(landingPages.createdAt));
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(landingPages)
        .where(eq(landingPages.id, input.id))
        .limit(1);
      return result[0] || null;
    }),

  create: publicQuery
    .input(
      z.object({
        name: z.string(),
        productId: z.number(),
        template: z.string().default("problem_solution"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const sections = JSON.stringify({
        hero: { headline: "Your Product Headline", subhead: "Compelling subheadline here", cta: "Shop Now" },
        problem: { title: "The Problem", points: ["Pain point 1", "Pain point 2"] },
        solution: { title: "The Solution", features: ["Feature 1", "Feature 2", "Feature 3"] },
        socialProof: { testimonials: 0, rating: "0/5" },
        offer: { price: 0, originalPrice: 0, bonus: "" },
        scarcity: { stock: 50, timer: true },
        faq: [{ q: "Question 1?", a: "Answer 1" }],
      });

      const result = await db.insert(landingPages).values({
        name: input.name,
        productId: input.productId,
        template: input.template,
        sections,
      });
      return { id: Number(result[0].insertId) };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        sections: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(landingPages)
        .set({ sections: input.sections })
        .where(eq(landingPages.id, input.id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(landingPages).where(eq(landingPages.id, input.id));
      return { success: true };
    }),
});
