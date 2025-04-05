import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertMoodSchema, insertSymptomSchema, insertHealthMetricSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Mood tracking endpoints
  app.post("/api/moods", async (req, res) => {
    const mood = insertMoodSchema.parse(req.body);
    const result = await storage.createMood(mood);
    res.json(result);
  });

  app.get("/api/moods/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const moods = await storage.getMoodsByUserId(userId);
    res.json(moods);
  });

  // Symptom tracking endpoints
  app.post("/api/symptoms", async (req, res) => {
    const symptom = insertSymptomSchema.parse(req.body);
    const result = await storage.createSymptom(symptom);
    res.json(result);
  });

  app.get("/api/symptoms/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const symptoms = await storage.getSymptomsByUserId(userId);
    res.json(symptoms);
  });

  // Health metrics endpoints
  app.post("/api/metrics", async (req, res) => {
    const metric = insertHealthMetricSchema.parse(req.body);
    const result = await storage.createHealthMetric(metric);
    res.json(result);
  });

  app.get("/api/metrics/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const metrics = await storage.getHealthMetricsByUserId(userId);
    res.json(metrics);
  });

  return httpServer;
}
