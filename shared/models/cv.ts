import { pgTable, varchar, jsonb, timestamp, integer } from "drizzle-orm/pg-core";

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
