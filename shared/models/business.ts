import { pgTable, varchar, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const templateConfig = pgTable("template_config", {
  templateId: varchar("template_id").primaryKey(),
  isFree: boolean("is_free").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type TemplateConfig = typeof templateConfig.$inferSelect;

export const businessContacts = pgTable("business_contacts", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id"),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  company: varchar("company").notNull(),
  teamSize: varchar("team_size"),
  message: text("message"),
  receiptImage: text("receipt_image"),
  plan: varchar("plan").default("business"),
  amount: integer("amount").default(15),
  status: varchar("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type BusinessContact = typeof businessContacts.$inferSelect;
