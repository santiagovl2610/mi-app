import { type User, type InsertUser, type Message, type InsertMessage, type BotConfig, type InsertBotConfig, type MessageStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Message methods
  getMessages(limit?: number): Promise<Message[]>;
  getMessage(id: string): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessageStats(): Promise<MessageStats>;
  
  // Bot config methods
  getBotConfig(): Promise<BotConfig>;
  updateBotConfig(config: Partial<InsertBotConfig>): Promise<BotConfig>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private messages: Map<string, Message>;
  private config: BotConfig;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.config = {
      id: randomUUID(),
      autoReplyEnabled: true,
      autoReplyMessage: "Thanks for your message! We'll get back to you soon.",
      responseDelaySeconds: "0"
    };
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Message methods
  async getMessages(limit: number = 100): Promise<Message[]> {
    const allMessages = Array.from(this.messages.values());
    return allMessages
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessageStats(): Promise<MessageStats> {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const allMessages = Array.from(this.messages.values());
    
    const received24h = allMessages.filter(m => 
      m.direction === 'inbound' && new Date(m.timestamp) >= oneDayAgo
    ).length;
    
    const sent24h = allMessages.filter(m => 
      m.direction === 'outbound' && new Date(m.timestamp) >= oneDayAgo
    ).length;
    
    const received7d = allMessages.filter(m => 
      m.direction === 'inbound' && new Date(m.timestamp) >= sevenDaysAgo
    ).length;
    
    const sent7d = allMessages.filter(m => 
      m.direction === 'outbound' && new Date(m.timestamp) >= sevenDaysAgo
    ).length;
    
    return {
      totalReceived24h: received24h,
      totalSent24h: sent24h,
      totalReceived7d: received7d,
      totalSent7d: sent7d
    };
  }

  // Bot config methods
  async getBotConfig(): Promise<BotConfig> {
    return this.config;
  }

  async updateBotConfig(updates: Partial<InsertBotConfig>): Promise<BotConfig> {
    this.config = { ...this.config, ...updates };
    return this.config;
  }
}

export const storage = new MemStorage();
