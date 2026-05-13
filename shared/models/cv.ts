import { pgTable, varchar, jsonb, timestamp, integer, text } from "drizzle-orm/pg-core";

export const cvs = pgTable("cvs", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: varchar("name").notNull(),
  cvData: jsonb("cv_data").notNull(),
  template: varchar("template").notNull().default("modern"),
  theme: jsonb("theme").notNull(),
  atsScore: integer("ats_score").default(95),
  lastModified: timestamp("last_modified").defaultNow(),
});

export type CV = typeof cvs.$inferSelect;
export type InsertCV = typeof cvs.$inferInsert;

export const paymentRequests = pgTable("payment_requests", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  plan: varchar("plan").notNull().default("pro"),
  amount: integer("amount").notNull().default(3),
  receiptImage: text("receipt_image"),
  status: varchar("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  notes: text("notes"),
});

export type PaymentRequest = typeof paymentRequests.$inferSelect;
export type InsertPaymentRequest = typeof paymentRequests.$inferInsert;
