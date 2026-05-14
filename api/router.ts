import { authRouter } from "./auth-router";
import { dashboardRouter } from "./dashboard-router";
import { ceoRouter } from "./ceo-router";
import { productRouter } from "./product-router";
import { creativeRouter } from "./creative-router";
import { landingPageRouter } from "./landing-page-router";
import { orderRouter } from "./order-router";
import { shipmentRouter } from "./shipment-router";
import { financeRouter } from "./finance-router";
import { teamRouter } from "./team-router";
import { agentRouter } from "./agent-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  dashboard: dashboardRouter,
  ceo: ceoRouter,
  product: productRouter,
  creative: creativeRouter,
  landingPage: landingPageRouter,
  order: orderRouter,
  shipment: shipmentRouter,
  finance: financeRouter,
  team: teamRouter,
  agent: agentRouter,
});

export type AppRouter = typeof appRouter;
