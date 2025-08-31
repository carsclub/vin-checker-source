import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const vinChecks = pgTable("vin_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vin: varchar("vin", { length: 17 }).notNull().unique(),
  vinValid: boolean("vin_valid"),
  wmi: varchar("wmi"),
  origin: varchar("origin"),
  squishVin: varchar("squish_vin"),
  checkDigit: varchar("check_digit"),
  checksum: boolean("checksum"),
  type: varchar("type"),
  make: varchar("make"),
  model: varchar("model"),
  trim: varchar("trim"),
  style: varchar("style"),
  year: integer("year"),
  manufacturer: varchar("manufacturer"),
  engine: text("engine"),
  transmission: text("transmission"),
  fuel_type: varchar("fuel_type"),
  body_style: varchar("body_style"),
  country: varchar("country"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVinCheckSchema = createInsertSchema(vinChecks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// VIN Search tracking table with user email
export const vinSearches = pgTable("vin_searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vin: varchar("vin", { length: 17 }).notNull(),
  userEmail: varchar("user_email"), // Make nullable for backward compatibility
  userIp: varchar("user_ip"),
  userAgent: varchar("user_agent"),
  searchedAt: timestamp("searched_at").defaultNow().notNull(),
  emailSent: boolean("email_sent").default(false),
  emailSentAt: timestamp("email_sent_at"),
});

export const insertVinSearchSchema = createInsertSchema(vinSearches).omit({
  id: true,
  searchedAt: true,
  emailSent: true,
  emailSentAt: true,
});

// Car History Check tables
export const carHistoryReports = pgTable("car_history_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vin: varchar("vin", { length: 17 }).notNull(),
  saleIndex: varchar("sale_index"),
  price: varchar("price"),
  saleStatus: varchar("sale_status"),
  vname: varchar("vname"),
  lotNumber: varchar("lot_number"),
  hasKeys: varchar("has_keys"),
  runsDrives: varchar("runs_drives"),
  engineStarts: varchar("engine_starts"),
  titleType: varchar("title_type"),
  titleDescription: varchar("title_description"),
  primaryDamage: varchar("primary_damage"),
  secondaryDamage: varchar("secondary_damage"),
  odometer: varchar("odometer"),
  estimatedRepairCost: varchar("estimated_repair_cost"),
  avgEstimatedRetailValue: varchar("avg_estimated_retail_value"),
  damageRatio: varchar("damage_ratio"),
  estimatedWinningBid: varchar("estimated_winning_bid"),
  bodyStyle: varchar("body_style"),
  color: varchar("color"),
  engineType: varchar("engine_type"),
  fuelType: varchar("fuel_type"),
  cylinders: varchar("cylinders"),
  transmission: varchar("transmission"),
  drive: varchar("drive"),
  sellerType: varchar("seller_type"),
  auctionDate: varchar("auction_date"),
  auctionType: varchar("auction_type"),
  location: varchar("location"),
  buyerCountry: varchar("buyer_country"),
  listingHistory: jsonb("listing_history"),
  year: varchar("year"),
  make: varchar("make"),
  model: varchar("model"),
  images: jsonb("images"),
  marketValue: jsonb("market_value"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCarHistoryReportSchema = createInsertSchema(carHistoryReports);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVinCheck = z.infer<typeof insertVinCheckSchema>;
export type VinCheck = typeof vinChecks.$inferSelect;
export type InsertVinSearch = z.infer<typeof insertVinSearchSchema>;
export type VinSearch = typeof vinSearches.$inferSelect;
// Payment tracking table - connects users, VINs, and payments
export const paymentRecords = pgTable("payment_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stripePaymentIntentId: varchar("stripe_payment_intent_id").notNull().unique(),
  vin: varchar("vin", { length: 17 }).notNull(),
  userEmail: varchar("user_email").notNull(),
  userIp: varchar("user_ip"),
  userAgent: varchar("user_agent"),
  paymentStatus: varchar("payment_status").notNull().default('pending'), // pending, succeeded, failed, cancelled
  amountPaid: integer("amount_paid"), // Amount in cents (e.g., 1699 = $16.99)
  currency: varchar("currency").default('usd'),
  reportDelivered: boolean("report_delivered").default(false),
  reportDeliveredAt: timestamp("report_delivered_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPaymentRecordSchema = createInsertSchema(paymentRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCarHistoryReport = z.infer<typeof insertCarHistoryReportSchema>;
export type CarHistoryReport = typeof carHistoryReports.$inferSelect;
export type InsertPaymentRecord = z.infer<typeof insertPaymentRecordSchema>;
export type PaymentRecord = typeof paymentRecords.$inferSelect;
