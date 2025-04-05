import { z } from "zod";

// User schema
export const userSchema = z.object({
  id: z.string(),
  firebaseId: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
});

export const insertUserSchema = userSchema.omit({ id: true, createdAt: true });

// Mood schema
export const moodSchema = z.object({
  id: z.string(),
  userId: z.string(),
  mood: z.string(),
  intensity: z.number().int().min(1).max(10),
  note: z.string().optional(),
  timestamp: z.date(),
});

export const insertMoodSchema = moodSchema.omit({ id: true, timestamp: true });

// Symptom schema
export const symptomSchema = z.object({
  id: z.string(),
  userId: z.string(),
  symptoms: z.array(z.string()),
  analysis: z.record(z.string(), z.any()).optional(),
  timestamp: z.date(),
});

export const insertSymptomSchema = symptomSchema.omit({ id: true, timestamp: true });

// Health Metric schema
export const healthMetricSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.string(),
  value: z.number().int(),
  timestamp: z.date(),
});

export const insertHealthMetricSchema = healthMetricSchema.omit({ id: true, timestamp: true });

// Export types
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Mood = z.infer<typeof moodSchema>;
export type InsertMood = z.infer<typeof insertMoodSchema>;
export type Symptom = z.infer<typeof symptomSchema>;
export type InsertSymptom = z.infer<typeof insertSymptomSchema>;
export type HealthMetric = z.infer<typeof healthMetricSchema>;
export type InsertHealthMetric = z.infer<typeof insertHealthMetricSchema>;