import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (keeping for compatibility)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// WhatsApp Messages table
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  twilioMessageSid: text("twilio_message_sid"),
  from: text("from").notNull(),
  to: text("to").notNull(),
  body: text("body").notNull(),
  direction: text("direction").notNull(), // 'inbound' or 'outbound'
  status: text("status").notNull().default("received"), // 'received', 'sent', 'failed', 'pending'
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Bot Configuration table
export const botConfig = pgTable("bot_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  autoReplyEnabled: boolean("auto_reply_enabled").notNull().default(true),
  autoReplyMessage: text("auto_reply_message").notNull().default("Thanks for your message! We'll get back to you soon."),
  responseDelaySeconds: text("response_delay_seconds").notNull().default("0"),
});

export const insertBotConfigSchema = createInsertSchema(botConfig).omit({
  id: true,
});

export type InsertBotConfig = z.infer<typeof insertBotConfigSchema>;
export type BotConfig = typeof botConfig.$inferSelect;

// Stats type (computed, not stored)
export interface MessageStats {
  totalReceived24h: number;
  totalSent24h: number;
  totalReceived7d: number;
  totalSent7d: number;
}
