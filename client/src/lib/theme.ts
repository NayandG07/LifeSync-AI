import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const moodThemes = {
  happy: {
    primary: "hsl(47, 95%, 55%)", // Warm yellow
    background: "hsl(48, 100%, 97%)",
    accent: "hsl(32, 95%, 60%)",
    secondary: "hsl(25, 95%, 65%)",
    muted: "hsl(45, 20%, 90%)",
    border: "hsl(45, 10%, 85%)",
    text: {
      primary: "hsl(45, 20%, 20%)",
      secondary: "hsl(45, 10%, 40%)",
    }
  },
  sad: {
    primary: "hsl(201, 85%, 45%)", // Calming blue
    background: "hsl(200, 60%, 98%)",
    accent: "hsl(199, 85%, 35%)",
    secondary: "hsl(195, 85%, 40%)",
    muted: "hsl(200, 20%, 90%)",
    border: "hsl(200, 10%, 85%)",
    text: {
      primary: "hsl(200, 20%, 20%)",
      secondary: "hsl(200, 10%, 40%)",
    }
  },
  anxious: {
    primary: "hsl(154, 75%, 38%)", // Soothing green
    background: "hsl(150, 55%, 97%)",
    accent: "hsl(152, 75%, 28%)",
    secondary: "hsl(148, 75%, 33%)",
    muted: "hsl(150, 20%, 90%)",
    border: "hsl(150, 10%, 85%)",
    text: {
      primary: "hsl(150, 20%, 20%)",
      secondary: "hsl(150, 10%, 40%)",
    }
  },
  neutral: {
    primary: "hsl(264, 90%, 55%)", // More vibrant purple
    background: "hsl(260, 40%, 98%)",
    accent: "hsl(262, 85%, 45%)",
    secondary: "hsl(258, 85%, 50%)",
    muted: "hsl(260, 20%, 90%)",
    border: "hsl(260, 10%, 85%)",
    text: {
      primary: "hsl(260, 20%, 20%)",
      secondary: "hsl(260, 10%, 40%)",
    }
  },
  energetic: {
    primary: "hsl(350, 85%, 60%)", // Vibrant coral
    background: "hsl(350, 30%, 97%)",
    accent: "hsl(350, 85%, 50%)",
    secondary: "hsl(345, 85%, 55%)",
    muted: "hsl(350, 20%, 90%)",
    border: "hsl(350, 10%, 85%)",
    text: {
      primary: "hsl(350, 20%, 20%)",
      secondary: "hsl(350, 10%, 40%)",
    }
  }
};

export type MoodType = keyof typeof moodThemes;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setTheme(mood: MoodType) {
  const theme = moodThemes[mood];
  const root = document.documentElement.style;

  // Set CSS variables
  root.setProperty("--primary", theme.primary);
  root.setProperty("--background", theme.background);
  root.setProperty("--accent", theme.accent);
  root.setProperty("--secondary", theme.secondary);
  root.setProperty("--muted", theme.muted);
  root.setProperty("--border", theme.border);
  root.setProperty("--text-primary", theme.text.primary);
  root.setProperty("--text-secondary", theme.text.secondary);

  // Add smooth transition
  root.setProperty("transition", "background-color 0.3s ease, color 0.3s ease");
}