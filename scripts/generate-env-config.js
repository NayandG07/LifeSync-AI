// This script generates the env-config.js file from environment variables
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Get the HuggingFace API key from environment variables
const huggingFaceApiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || '';

// Log API key status for debugging (without revealing the actual key)
if (!huggingFaceApiKey) {
  console.warn("Warning: NEXT_PUBLIC_HUGGINGFACE_API_KEY is not set in .env file");
} else {
  console.log("HuggingFace API key found. Key starts with:", huggingFaceApiKey.substring(0, 5) + "...");
}

// Create the env-config.js content with added error handling
const envConfigContent = `// This file is generated automatically by scripts/generate-env-config.js
try {
  window.ENV = {
    NEXT_PUBLIC_HUGGINGFACE_API_KEY: "${huggingFaceApiKey}",
  };
  console.log("Environment configuration loaded successfully");
} catch (error) {
  console.error("Error initializing environment configuration:", error);
  // Initialize with empty values as fallback
  window.ENV = window.ENV || { NEXT_PUBLIC_HUGGINGFACE_API_KEY: "" };
}
`;

// Create the fallback config in case the main one fails to load
const fallbackEnvConfigContent = `// This is a fallback environment configuration file
// It provides default values for environment variables when the main config cannot be loaded
window.ENV = {
  NEXT_PUBLIC_HUGGINGFACE_API_KEY: "",
};
console.warn("Using fallback environment configuration - some features may be limited");
`;

// Ensure the client/public directory exists
const publicDir = path.resolve(__dirname, '../client/public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

try {
  // Write the env-config.js file
  const envConfigPath = path.resolve(publicDir, 'env-config.js');
  fs.writeFileSync(envConfigPath, envConfigContent);
  console.log(`Generated env-config.js at ${envConfigPath}`);

  // Write the fallback-env-config.js file
  const fallbackEnvConfigPath = path.resolve(publicDir, 'fallback-env-config.js');
  fs.writeFileSync(fallbackEnvConfigPath, fallbackEnvConfigContent);
  console.log(`Generated fallback-env-config.js at ${fallbackEnvConfigPath}`);

  // Also copy both files to the dist/public directory if it exists (for production builds)
  const distPublicDir = path.resolve(__dirname, '../dist/public');
  if (fs.existsSync(distPublicDir)) {
    const distEnvConfigPath = path.resolve(distPublicDir, 'env-config.js');
    fs.writeFileSync(distEnvConfigPath, envConfigContent);
    console.log(`Copied env-config.js to ${distEnvConfigPath}`);

    const distFallbackEnvConfigPath = path.resolve(distPublicDir, 'fallback-env-config.js');
    fs.writeFileSync(distFallbackEnvConfigPath, fallbackEnvConfigContent);
    console.log(`Copied fallback-env-config.js to ${distFallbackEnvConfigPath}`);
  }
} catch (error) {
  console.error("Error generating environment configuration files:", error);
  process.exit(1);
} 