import { sql } from 'drizzle-orm';
import { pgTable, text, serial, integer, boolean, timestamp, varchar, index, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Business/merchant accounts
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  password: text("password").notNull(),
  smsFromName: varchar("sms_from_name", { length: 11 }), // HelloSMS sender name limit
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer data collected through NFC interactions
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  consentGiven: boolean("consent_given").notNull().default(false),
  consentDate: timestamp("consent_date"),
  source: text("source"), // NFC card ID or source
  status: text("status").notNull().default("active"), // active, inactive
  lastContact: timestamp("last_contact"),
  tags: text("tags").array(), // customer tags/segments
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Campaign management
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businesses.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // sms, email, whatsapp
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").notNull().default("draft"), // draft, scheduled, sent, completed
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  targetAudience: text("target_audience").array(), // customer tags to target
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Campaign delivery tracking
export const campaignDeliveries = pgTable("campaign_deliveries", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  status: text("status").notNull(), // sent, delivered, failed, opened, clicked
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  errorMessage: text("error_message"),
});

// Relations
export const businessesRelations = relations(businesses, ({ many }) => ({
  customers: many(customers),
  campaigns: many(campaigns),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  business: one(businesses, {
    fields: [customers.businessId],
    references: [businesses.id],
  }),
  campaignDeliveries: many(campaignDeliveries),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  business: one(businesses, {
    fields: [campaigns.businessId],
    references: [businesses.id],
  }),
  deliveries: many(campaignDeliveries),
}));

export const campaignDeliveriesRelations = relations(campaignDeliveries, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignDeliveries.campaignId],
    references: [campaigns.id],
  }),
  customer: one(customers, {
    fields: [campaignDeliveries.customerId],
    references: [customers.id],
  }),
}));

// Schemas for validation
export const insertBusinessSchema = createInsertSchema(businesses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type Business = typeof businesses.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type CampaignDelivery = typeof campaignDeliveries.$inferSelect;

// Legacy user table for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
