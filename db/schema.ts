import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  decimal,
  boolean,
  date,
  bigint,
  json,
} from "drizzle-orm/mysql-core";

// Users (OAuth auth)
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

// Products (Product Hunter Agent)
export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  sourceUrl: varchar("sourceUrl", { length: 500 }),
  sourcePrice: decimal("sourcePrice", { precision: 10, scale: 2 }),
  suggestedPrice: decimal("suggestedPrice", { precision: 10, scale: 2 }),
  category: varchar("category", { length: 100 }),
  imageUrl: varchar("imageUrl", { length: 500 }),
  saturationScore: int("saturationScore").default(0),
  competitionScore: int("competitionScore").default(0),
  demandScore: int("demandScore").default(0),
  marketFitScore: int("marketFitScore").default(0),
  marginMultiplier: decimal("marginMultiplier", { precision: 3, scale: 1 }),
  status: mysqlEnum("status", ["testing", "scaling", "winning", "dead"]).default("testing"),
  roas: decimal("roas", { precision: 4, scale: 2 }).default("0"),
  unitsSold: int("unitsSold").default(0),
  revenue: decimal("revenue", { precision: 12, scale: 2 }).default("0"),
  profit: decimal("profit", { precision: 12, scale: 2 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

// Campaigns (CEO + Creative Agent)
export const campaigns = mysqlTable("campaigns", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  productId: bigint("productId", { mode: "number", unsigned: true }),
  objective: mysqlEnum("objective", ["awareness", "conversion", "retargeting"]).default("conversion"),
  platform: varchar("platform", { length: 50 }),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  spent: decimal("spent", { precision: 12, scale: 2 }).default("0"),
  roas: decimal("roas", { precision: 4, scale: 2 }).default("0"),
  cpa: decimal("cpa", { precision: 8, scale: 2 }).default("0"),
  impressions: int("impressions").default(0),
  clicks: int("clicks").default(0),
  conversions: int("conversions").default(0),
  status: mysqlEnum("status", ["active", "paused", "stopped"]).default("active"),
  startDate: date("startDate"),
  endDate: date("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Orders (Confirmation Agent)
export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  customerName: varchar("customerName", { length: 255 }),
  customerPhone: varchar("customerPhone", { length: 20 }),
  governorate: varchar("governorate", { length: 50 }),
  city: varchar("city", { length: 100 }),
  address: text("address"),
  productId: bigint("productId", { mode: "number", unsigned: true }),
  quantity: int("quantity").default(1),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }),
  status: mysqlEnum("status", [
    "new", "whatsapp_sent", "responded", "confirmed", "voice_confirmed",
    "shipped", "delivered", "returned", "cancelled"
  ]).default("new"),
  confirmationMethod: mysqlEnum("confirmationMethod", ["whatsapp", "voice", "manual"]),
  riskScore: int("riskScore").default(0),
  isFake: boolean("isFake").default(false),
  deliveryProbability: int("deliveryProbability").default(0),
  shippingProviderId: bigint("shippingProviderId", { mode: "number", unsigned: true }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

// Shipping Providers (Shipping Intelligence)
export const shippingProviders = mysqlTable("shipping_providers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  logoUrl: varchar("logoUrl", { length: 500 }),
  deliveryRate: decimal("deliveryRate", { precision: 5, scale: 2 }),
  avgDeliveryTime: decimal("avgDeliveryTime", { precision: 4, scale: 1 }),
  returnRate: decimal("returnRate", { precision: 5, scale: 2 }),
  costPerShipment: decimal("costPerShipment", { precision: 8, scale: 2 }),
  activeShipments: int("activeShipments").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Shipments (Shipping Intelligence)
export const shipments = mysqlTable("shipments", {
  id: serial("id").primaryKey(),
  orderId: bigint("orderId", { mode: "number", unsigned: true }),
  providerId: bigint("providerId", { mode: "number", unsigned: true }),
  trackingNumber: varchar("trackingNumber", { length: 100 }),
  status: mysqlEnum("status", [
    "pending", "picked_up", "in_transit", "out_for_delivery",
    "delivered", "returned", "failed"
  ]).default("pending"),
  governorate: varchar("governorate", { length: 50 }),
  pickupDate: date("pickupDate"),
  deliveryDate: date("deliveryDate"),
  deliveryTime: int("deliveryTime"),
  isReturned: boolean("isReturned").default(false),
  returnReason: varchar("returnReason", { length: 255 }),
  cost: decimal("cost", { precision: 8, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Financial Transactions (Finance Agent)
export const financialTransactions = mysqlTable("financial_transactions", {
  id: serial("id").primaryKey(),
  type: mysqlEnum("type", [
    "revenue", "refund", "cogs", "ad_spend", "shipping",
    "cod_fee", "gateway", "tax", "other"
  ]).notNull(),
  category: varchar("category", { length: 50 }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  orderId: bigint("orderId", { mode: "number", unsigned: true }),
  campaignId: bigint("campaignId", { mode: "number", unsigned: true }),
  date: date("date").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Team Members (HR Agent)
export const teamMembers = mysqlTable("team_members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  role: mysqlEnum("role", ["moderator", "confirmation_agent", "team_lead", "manager"]).default("moderator"),
  avatarUrl: varchar("avatarUrl", { length: 500 }),
  isActive: boolean("isActive").default(true),
  performanceScore: int("performanceScore").default(0),
  responseTime: decimal("responseTime", { precision: 4, scale: 1 }),
  confirmationRate: decimal("confirmationRate", { precision: 5, scale: 2 }),
  ordersHandled: int("ordersHandled").default(0),
  customerRating: decimal("customerRating", { precision: 3, scale: 2 }),
  weeklyOrders: int("weeklyOrders").default(0),
  trend: decimal("trend", { precision: 5, scale: 2 }).default("0"),
  status: mysqlEnum("status", ["online", "away", "offline"]).default("offline"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Agent Activities (Central Dashboard)
export const agentActivities = mysqlTable("agent_activities", {
  id: serial("id").primaryKey(),
  agentName: varchar("agentName", { length: 50 }).notNull(),
  action: text("action").notNull(),
  type: mysqlEnum("type", ["recommendation", "alert", "analysis", "automation"]).default("analysis"),
  confidence: int("confidence"),
  impact: varchar("impact", { length: 100 }),
  status: mysqlEnum("status", ["pending", "accepted", "rejected", "completed"]).default("pending"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// KPI Metrics (CEO Agent + Dashboard)
export const kpiMetrics = mysqlTable("kpi_metrics", {
  id: serial("id").primaryKey(),
  metricName: varchar("metricName", { length: 50 }).notNull(),
  metricValue: decimal("metricValue", { precision: 12, scale: 2 }).notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Creatives (Creative Director Agent)
export const creatives = mysqlTable("creatives", {
  id: serial("id").primaryKey(),
  productId: bigint("productId", { mode: "number", unsigned: true }),
  campaignId: bigint("campaignId", { mode: "number", unsigned: true }),
  type: mysqlEnum("type", ["ad_creative", "ad_copy", "ugc_script", "hook"]).notNull(),
  title: varchar("title", { length: 255 }),
  content: json("content"),
  language: mysqlEnum("language", ["arabic", "english", "mixed"]).default("arabic"),
  tone: mysqlEnum("tone", ["urgent", "lifestyle", "problem_solution", "social_proof", "fomo"]).default("urgent"),
  platform: mysqlEnum("platform", ["facebook", "instagram", "tiktok", "universal"]).default("universal"),
  predictedCtr: decimal("predictedCtr", { precision: 4, scale: 2 }),
  engagementScore: int("engagementScore"),
  isSaved: boolean("isSaved").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Landing Pages (Landing Page Agent)
export const landingPages = mysqlTable("landing_pages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  productId: bigint("productId", { mode: "number", unsigned: true }),
  template: varchar("template", { length: 50 }),
  sections: json("sections"),
  conversionRate: decimal("conversionRate", { precision: 4, scale: 2 }),
  isActive: boolean("isActive").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Recommendations (CEO + All Agents)
export const recommendations = mysqlTable("recommendations", {
  id: serial("id").primaryKey(),
  agentName: varchar("agentName", { length: 50 }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  confidence: int("confidence").default(0),
  impact: varchar("impact", { length: 100 }),
  status: mysqlEnum("status", ["pending", "accepted", "rejected", "implemented"]).default("pending"),
  category: varchar("category", { length: 50 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// WhatsApp Templates (Confirmation Agent)
export const whatsappTemplates = mysqlTable("whatsapp_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: mysqlEnum("type", ["confirmation", "follow_up", "reminder", "cancellation"]).default("confirmation"),
  content: text("content").notNull(),
  language: mysqlEnum("language", ["arabic", "english"]).default("arabic"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type ShippingProvider = typeof shippingProviders.$inferSelect;
export type Shipment = typeof shipments.$inferSelect;
export type FinancialTransaction = typeof financialTransactions.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type AgentActivity = typeof agentActivities.$inferSelect;
export type KpiMetric = typeof kpiMetrics.$inferSelect;
export type Creative = typeof creatives.$inferSelect;
export type LandingPage = typeof landingPages.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;
export type WhatsappTemplate = typeof whatsappTemplates.$inferSelect;
