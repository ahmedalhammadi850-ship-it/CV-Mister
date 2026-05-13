import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const businessContacts = pgTable("business_contacts", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id"),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  company: varchar("company").notNull(),
  teamSize: varchar("team_size"),
  message: text("message"),
  status: varchar("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type BusinessContact = typeof businessContacts.$inferSelect;
