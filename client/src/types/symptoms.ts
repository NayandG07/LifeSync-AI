// Symptom check related type definitions

// Condition severity levels
export type SeverityLevel = "mild" | "moderate" | "severe" | "emergency";

// Medical condition identified from symptoms
export interface Condition {
  name: string;
  confidence: number;
  description: string;
  severity: SeverityLevel;
}

// Remedy types
export type RemedyType = "home" | "otc" | "professional";

// Remedy suggestion
export interface Remedy {
  type: RemedyType;
  title: string;
  description: string;
}

// Complete symptom check result
export interface SymptomCheckResult {
  id?: string;
  userId?: string;
  symptoms: string[];
  bodyAreas: string[];
  severity: number;
  conditions: Condition[];
  remedies: Remedy[];
  timestamp: Date;
} 