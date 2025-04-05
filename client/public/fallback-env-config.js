// This is a fallback environment configuration file that is used when the main env-config.js cannot be loaded
// It provides default values for environment variables, which may limit some functionality
window.ENV = {
  NEXT_PUBLIC_HUGGINGFACE_API_KEY: "", // Default empty API key
};

console.warn("Using fallback environment configuration - some features may not be available"); 