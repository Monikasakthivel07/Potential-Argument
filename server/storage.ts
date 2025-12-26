import { users, arguments_table, type User, type InsertUser, type Argument, type InsertArgument } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getArguments(): Promise<Argument[]>;
  getArgument(id: number): Promise<Argument | undefined>;
  createArgument(userId: number, argument: InsertArgument): Promise<Argument>;
  deleteArgument(id: number): Promise<void>;
  getArgumentsByArchetype(): Promise<{ archetype: string; count: number }[]>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getArguments(): Promise<Argument[]> {
    return await db.select().from(arguments_table).orderBy(arguments_table.createdAt);
  }

  async getArgument(id: number): Promise<Argument | undefined> {
    const [arg] = await db.select().from(arguments_table).where(eq(arguments_table.id, id));
    return arg;
  }

  async createArgument(userId: number, insertArgument: InsertArgument): Promise<Argument> {
    const [arg] = await db.insert(arguments_table).values({ ...insertArgument, userId }).returning();
    return arg;
  }

  async deleteArgument(id: number): Promise<void> {
    await db.delete(arguments_table).where(eq(arguments_table.id, id));
  }

  async getArgumentsByArchetype(): Promise<{ archetype: string; count: number }[]> {
    const result = await db
      .select({
        archetype: arguments_table.archetype,
        count: sql<number>`count(*)::int`
      })
      .from(arguments_table)
      .groupBy(arguments_table.archetype);
    return result;
  }
}

export const storage = new DatabaseStorage();
