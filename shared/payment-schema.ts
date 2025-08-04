import { pgTable, varchar, decimal, boolean, timestamp, integer, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Payment plans for Swedish market
export const paymentPlans = pgTable("payment_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(), // "Bas", "Pro", "Enterprise"
  nameEn: varchar("name_en").notNull(), // "Basic", "Pro", "Enterprise"
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  priceMonthly: decimal("price_monthly", { precision: 10, scale: 2 }).notNull(),
  priceCurrency: varchar("price_currency").notNull().default("SEK"),
  maxCustomers: integer("max_customers"), // null = unlimited
  maxCampaigns: integer("max_campaigns"), // null = unlimited
  maxSmsPerMonth: integer("max_sms_per_month"), // null = unlimited
  maxEmailsPerMonth: integer("max_emails_per_month"), // null = unlimited
  features: text("features").notNull(), // JSON array of features
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business subscriptions
export const businessSubscriptions = pgTable("business_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: integer("business_id").notNull(),
  planId: varchar("plan_id").references(() => paymentPlans.id),
  status: varchar("status").notNull().default("active"), // active, cancelled, suspended, past_due
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"), // null for ongoing subscriptions
  trialEndDate: timestamp("trial_end_date"), // 14-day free trial
  lastPaymentAt: timestamp("last_payment_at"),
  nextPaymentAt: timestamp("next_payment_at"),
  paymentMethod: varchar("payment_method"), // klarna, swish, card, bank_transfer
  
  // Usage tracking
  currentPeriodCustomers: integer("current_period_customers").default(0),
  currentPeriodCampaigns: integer("current_period_campaigns").default(0),
  currentPeriodSms: integer("current_period_sms").default(0),
  currentPeriodEmails: integer("current_period_emails").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment transactions
export const paymentTransactions = pgTable("payment_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: integer("business_id").notNull(),
  subscriptionId: varchar("subscription_id").references(() => businessSubscriptions.id),
  
  // Transaction details
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").notNull().default("SEK"),
  status: varchar("status").notNull(), // pending, completed, failed, refunded, cancelled
  paymentMethod: varchar("payment_method").notNull(), // klarna, swish, card, bank_transfer
  
  // External provider data
  providerTransactionId: varchar("provider_transaction_id"), // Klarna order ID, Swish ID, etc.
  providerResponse: text("provider_response"), // JSON response from payment provider
  
  // Billing details
  description: varchar("description").notNull(),
  invoiceNumber: varchar("invoice_number"),
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  
  // Refund information
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  refundReason: varchar("refund_reason"),
  refundedAt: timestamp("refunded_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Klarna-specific data
export const klarnaOrders = pgTable("klarna_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").references(() => paymentTransactions.id),
  klarnaOrderId: varchar("klarna_order_id").unique().notNull(),
  
  // Customer information
  customerEmail: varchar("customer_email").notNull(),
  customerPhone: varchar("customer_phone"),
  
  // Billing address
  billingFirstName: varchar("billing_first_name"),
  billingLastName: varchar("billing_last_name"),
  billingAddress: varchar("billing_address"),
  billingCity: varchar("billing_city"),
  billingPostalCode: varchar("billing_postal_code"),
  billingCountry: varchar("billing_country").default("SE"),
  
  // Order details
  orderLines: text("order_lines").notNull(), // JSON array of order items
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull(),
  
  // Klarna session data
  sessionId: varchar("session_id"),
  clientToken: varchar("client_token"),
  expiresAt: timestamp("expires_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Swish payments
export const swishPayments = pgTable("swish_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").references(() => paymentTransactions.id),
  swishPaymentId: varchar("swish_payment_id").unique().notNull(),
  
  // Payment request details
  payeePaymentReference: varchar("payee_payment_reference").notNull(),
  callbackUrl: varchar("callback_url"),
  payerAlias: varchar("payer_alias"), // Customer's phone number
  payeeAlias: varchar("payee_alias").notNull(), // Business Swish number
  
  // Payment details
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").notNull().default("SEK"),
  message: varchar("message"), // Optional message to customer
  
  // QR Code for mobile payments
  qrCode: text("qr_code"), // Base64 encoded QR code
  
  // Status tracking
  status: varchar("status").notNull(), // CREATED, PAID, DECLINED, ERROR, CANCELLED
  errorCode: varchar("error_code"),
  errorMessage: varchar("error_message"),
  
  // Timestamps
  requestedAt: timestamp("requested_at").defaultNow(),
  paidAt: timestamp("paid_at"),
  expiresAt: timestamp("expires_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Swedish company information for invoicing
export const businessInvoiceInfo = pgTable("business_invoice_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: integer("business_id").unique().notNull(),
  
  // Swedish company details
  organizationNumber: varchar("organization_number"), // Swedish org number (10 digits)
  vatNumber: varchar("vat_number"), // SE + org number + 01
  companyName: varchar("company_name").notNull(),
  
  // Invoice address
  invoiceAddress: varchar("invoice_address").notNull(),
  invoiceCity: varchar("invoice_city").notNull(),
  invoicePostalCode: varchar("invoice_postal_code").notNull(),
  invoiceCountry: varchar("invoice_country").notNull().default("SE"),
  
  // Contact details
  invoiceEmail: varchar("invoice_email").notNull(),
  invoicePhone: varchar("invoice_phone"),
  contactPerson: varchar("contact_person"),
  
  // Preferences
  invoiceLanguage: varchar("invoice_language").notNull().default("sv"), // sv or en
  paymentTerms: integer("payment_terms").default(30), // days
  preferredPaymentMethod: varchar("preferred_payment_method"), // klarna, swish, bank_transfer
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema types
export type PaymentPlan = typeof paymentPlans.$inferSelect;
export type InsertPaymentPlan = typeof paymentPlans.$inferInsert;
export type BusinessSubscription = typeof businessSubscriptions.$inferSelect;
export type InsertBusinessSubscription = typeof businessSubscriptions.$inferInsert;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = typeof paymentTransactions.$inferInsert;
export type KlarnaOrder = typeof klarnaOrders.$inferSelect;
export type InsertKlarnaOrder = typeof klarnaOrders.$inferInsert;
export type SwishPayment = typeof swishPayments.$inferSelect;
export type InsertSwishPayment = typeof swishPayments.$inferInsert;
export type BusinessInvoiceInfo = typeof businessInvoiceInfo.$inferSelect;
export type InsertBusinessInvoiceInfo = typeof businessInvoiceInfo.$inferInsert;

// Zod schemas for validation
export const createPaymentPlanSchema = createInsertSchema(paymentPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createSubscriptionSchema = createInsertSchema(businessSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createTransactionSchema = createInsertSchema(paymentTransactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const businessInvoiceInfoSchema = createInsertSchema(businessInvoiceInfo).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Validation types
export type CreatePaymentPlanInput = z.infer<typeof createPaymentPlanSchema>;
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type BusinessInvoiceInfoInput = z.infer<typeof businessInvoiceInfoSchema>;

// Swedish-specific validation schemas
export const swedishOrgNumberSchema = z.string()
  .regex(/^\d{10}$/, "Organisationsnummer måste innehålla 10 siffror")
  .refine((val) => {
    // Luhn algorithm validation for Swedish org numbers
    const digits = val.split('').map(Number);
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let digit = digits[i];
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === digits[9];
  }, "Ogiltigt organisationsnummer");

export const swedishPostalCodeSchema = z.string()
  .regex(/^\d{3}\s?\d{2}$/, "Postnummer måste vara i format 123 45");

export const swishPhoneNumberSchema = z.string()
  .regex(/^(\+46|0)7\d{8}$/, "Swish-nummer måste vara ett giltigt svenskt mobilnummer");

// Payment method selection schema
export const paymentMethodSchema = z.enum(["klarna", "swish", "card", "bank_transfer"]);

// Pricing tiers for Swedish market
export const swedishPricingTiers = {
  starter: {
    name: "Startpaket",
    nameEn: "Starter",
    priceMonthly: "299",
    features: [
      "Upp till 100 kunder",
      "10 kampanjer per månad", 
      "500 SMS per månad",
      "Obegränsat e-post",
      "NFC-taggar (5 st)",
      "Grundläggande support"
    ]
  },
  professional: {
    name: "Professionell",
    nameEn: "Professional", 
    priceMonthly: "699",
    features: [
      "Upp till 1000 kunder",
      "Obegränsade kampanjer",
      "2000 SMS per månad", 
      "Obegränsat e-post",
      "NFC-taggar (25 st)",
      "AI-kampanjassistent",
      "Prioritetssupport",
      "Anpassade formulär"
    ]
  },
  enterprise: {
    name: "Företag",
    nameEn: "Enterprise",
    priceMonthly: "1499", 
    features: [
      "Obegränsade kunder",
      "Obegränsade kampanjer",
      "10000 SMS per månad",
      "Obegränsat e-post", 
      "NFC-taggar (100 st)",
      "AI-kampanjassistent",
      "24/7 support",
      "Anpassad integration",
      "Dedikerad kontakt",
      "Månadsrapporter"
    ]
  }
} as const;