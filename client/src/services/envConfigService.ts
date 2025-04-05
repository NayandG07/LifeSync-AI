import { toast } from 'sonner';

// Default configuration to fallback to if env-config.js fails to load
const defaultConfig = {
  NEXT_PUBLIC_HUGGINGFACE_API_KEY: "",
  // Add other default configuration keys as needed
};

// Global state to store the loaded configuration
let loadedConfig: Record<string, string> = { ...defaultConfig };
let isConfigLoaded = false;

/**
 * Loads the environment configuration from env-config.js
 * Falls back to default values if the file can't be loaded
 */
export const loadEnvConfig = async (): Promise<Record<string, string>> => {
  // If config is already loaded, return it immediately
  if (isConfigLoaded) {
    return loadedConfig;
  }

  try {
    // Check if window.ENV already exists (script might have loaded normally)
    if (window.ENV) {
      loadedConfig = { ...defaultConfig, ...window.ENV };
      isConfigLoaded = true;
      return loadedConfig;
    }

    // Attempt to fetch the config file directly
    const response = await fetch('/env-config.js');
    
    if (!response.ok) {
      throw new Error(`Failed to load env-config.js: ${response.status} ${response.statusText}`);
    }
    
    const configText = await response.text();
    
    // Extract configuration using regex
    // This is safer than eval and works even if the script has extra code
    const configRegex = /window\.ENV\s*=\s*({[\s\S]*?});/;
    const match = configRegex.exec(configText);
    
    if (match && match[1]) {
      // Parse the extracted JSON
      try {
        const extractedConfig = JSON.parse(match[1].replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":'));
        loadedConfig = { ...defaultConfig, ...extractedConfig };
      } catch (parseError) {
        console.error('Error parsing env-config.js content:', parseError);
        // Fallback to default config
        console.warn('Using default configuration values');
      }
    } else {
      // Fallback to an alternative approach - dynamically load the script
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `/env-config.js?cache=${Date.now()}`; // Cache busting
        script.onload = () => {
          if (window.ENV) {
            loadedConfig = { ...defaultConfig, ...window.ENV };
            resolve();
          } else {
            reject(new Error('env-config.js loaded but window.ENV is not defined'));
          }
        };
        script.onerror = (error) => reject(error);
        document.head.appendChild(script);
      });
    }
  } catch (error) {
    console.error('Error loading environment configuration:', error);
    
    // Create and inject a fallback env-config.js if it failed to load
    const fallbackScript = document.createElement('script');
    fallbackScript.textContent = `window.ENV = ${JSON.stringify(defaultConfig)};`;
    document.head.appendChild(fallbackScript);
    
    // Show a warning toast (only once)
    toast.warning('Using default configuration', {
      description: 'Could not load environment configuration. Some features may be limited.',
      id: 'env-config-warning', // Use an ID to prevent duplicate toasts
    });
    
    // Use default config
    loadedConfig = { ...defaultConfig };
  }
  
  isConfigLoaded = true;
  return loadedConfig;
};

/**
 * Gets a specific configuration value
 * @param key - The configuration key to get
 * @param defaultValue - The default value if the key doesn't exist
 */
export const getEnvConfig = <T>(key: string, defaultValue: T): T => {
  if (!isConfigLoaded) {
    console.warn(`Environment config accessed before loading: ${key}`);
    // Return default value if config isn't loaded yet
    return defaultValue;
  }
  
  return (loadedConfig[key] as unknown as T) || defaultValue;
};

// Add the types for window.ENV
declare global {
  interface Window {
    ENV?: Record<string, string>;
  }
} 