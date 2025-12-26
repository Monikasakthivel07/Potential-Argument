import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, hashPassword } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  setupAuth(app);

  // Seed Admin User
  if (await storage.getUserByUsername("admin") === undefined) {
    const hashedPassword = await hashPassword("admin123");
    await storage.createUser({ username: "admin", password: hashedPassword });
  }

  app.get(api.arguments.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const args = await storage.getArguments();
    res.json(args);
  });

  app.post(api.arguments.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.arguments.create.input.parse(req.body);
      const arg = await storage.createArgument(req.user!.id, input);
      res.status(201).json(arg);
    } catch (e) {
      if (e instanceof z.ZodError) {
        res.status(400).json({ message: e.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.delete(api.arguments.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const id = parseInt(req.params.id);
    await storage.deleteArgument(id);
    res.sendStatus(204);
  });

  app.get(api.reports.archetypes.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const report = await storage.getArgumentsByArchetype();
    res.json(report);
  });

  return httpServer;
}
