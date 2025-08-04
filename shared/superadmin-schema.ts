import { pgTable, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Super Admin table for platform management
export const superAdmins = pgTable("super_admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  role: varchar("role").notNull().default("super_admin"), // super_admin, admin, moderator
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin actions log for audit trail
export const adminActionLogs = pgTable("admin_action_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").references(() => superAdmins.id),
  action: varchar("action").notNull(), // login, create_business, suspend_business, view_data, etc.
  targetType: varchar("target_type"), // business, campaign, customer, etc.
  targetId: varchar("target_id"),
  details: varchar("details"), // JSON string with additional context
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Business management table for super admin oversight
export const businessOversight = pgTable("business_oversight", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: integer("business_id").notNull(),
  status: varchar("status").notNull().default("active"), // active, suspended, under_review, terminated
  suspensionReason: varchar("suspension_reason"),
  notes: varchar("notes"), // Admin notes
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by").references(() => superAdmins.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Platform statistics for admin dashboard
export const platformStats = pgTable("platform_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: varchar("date").notNull(), // YYYY-MM-DD format
  totalBusinesses: integer("total_businesses").default(0),
  activeBusinesses: integer("active_businesses").default(0),
  totalCustomers: integer("total_customers").default(0),
  totalCampaigns: integer("total_campaigns").default(0),
  smsMessagesSent: integer("sms_messages_sent").default(0),
  emailsSent: integer("emails_sent").default(0),
  nfcScans: integer("nfc_scans").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema types
export type SuperAdmin = typeof superAdmins.$inferSelect;
export type InsertSuperAdmin = typeof superAdmins.$inferInsert;
export type AdminActionLog = typeof adminActionLogs.$inferSelect;
export type InsertAdminActionLog = typeof adminActionLogs.$inferInsert;
export type BusinessOversight = typeof businessOversight.$inferSelect;
export type InsertBusinessOversight = typeof businessOversight.$inferInsert;
export type PlatformStats = typeof platformStats.$inferSelect;
export type InsertPlatformStats = typeof platformStats.$inferInsert;

// Zod schemas for validation
export const insertSuperAdminSchema = createInsertSchema(superAdmins).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdminActionLogSchema = createInsertSchema(adminActionLogs).omit({
  id: true,
  createdAt: true,
});

export const insertBusinessOversightSchema = createInsertSchema(businessOversight).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlatformStatsSchema = createInsertSchema(platformStats).omit({
  id: true,
  createdAt: true,
});

// Validation types
export type InsertSuperAdminInput = z.infer<typeof insertSuperAdminSchema>;
export type InsertAdminActionLogInput = z.infer<typeof insertAdminActionLogSchema>;
export type InsertBusinessOversightInput = z.infer<typeof insertBusinessOversightSchema>;
export type InsertPlatformStatsInput = z.infer<typeof insertPlatformStatsSchema>;

// Super admin login schema
export const superAdminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SuperAdminLoginInput = z.infer<typeof superAdminLoginSchema>;

// Super admin registration schema (for initial setup)
export const superAdminRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  setupKey: z.string().min(1, "Setup key is required"), // Secret key for initial setup
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SuperAdminRegistrationInput = z.infer<typeof superAdminRegistrationSchema>;