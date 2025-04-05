import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "@/components/ErrorBoundary";
import NetworkStatusProvider from "@/components/NetworkStatusProvider";
import { loadEnvConfig } from "@/services/envConfigService";

// Initialize environment configuration before rendering
const InitApp = () => {
  // Load environment configuration on mount
  useEffect(() => {
    loadEnvConfig().catch(error => {
      console.error("Failed to load environment configuration:", error);
    });
  }, []);

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <NetworkStatusProvider>
          <HelmetProvider>
            <ThemeProvider defaultTheme="system" storageKey="app-theme">
              <App />
            </ThemeProvider>
          </HelmetProvider>
        </NetworkStatusProvider>
      </ErrorBoundary>
      <Toaster position="top-right" richColors />
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<InitApp />);
