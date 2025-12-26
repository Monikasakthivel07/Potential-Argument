import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const archetypes = ["Technical", "Business", "Research", "Educational"] as const;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const arguments_table = pgTable("arguments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  archetype: text("archetype", { enum: archetypes }).notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertArgumentSchema = createInsertSchema(arguments_table).pick({
  title: true,
  description: true,
  archetype: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Argument = typeof arguments_table.$inferSelect;
export type InsertArgument = z.infer<typeof insertArgumentSchema>;
