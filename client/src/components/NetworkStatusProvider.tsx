import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface NetworkStatusContextType {
  isOnline: boolean;
  wasOffline: boolean;
  checkConnection: () => Promise<boolean>;
}

const NetworkStatusContext = createContext<NetworkStatusContextType>({
  isOnline: true,
  wasOffline: false,
  checkConnection: async () => true,
});

export const useNetworkStatus = () => useContext(NetworkStatusContext);

interface NetworkStatusProviderProps {
  children: ReactNode;
}

export function NetworkStatusProvider({ children }: NetworkStatusProviderProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  
  const checkConnection = async (): Promise<boolean> => {
    try {
      // Try to fetch a small resource to check actual connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('/env-config.js', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache',
      });
      
      clearTimeout(timeoutId);
      const online = response.ok;
      setIsOnline(online);
      return online;
    } catch (error) {
      console.error('Connection check failed:', error);
      setIsOnline(false);
      return false;
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // If we were previously offline, we want to know about it
      // This helps with showing reconnection notifications
      if (!isOnline) {
        setWasOffline(true);
        // Reset the wasOffline state after 5 seconds
        setTimeout(() => setWasOffline(false), 5000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial connection check
    checkConnection();
    
    // Set up periodic connection checks
    const intervalId = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [isOnline]);

  return (
    <NetworkStatusContext.Provider value={{ isOnline, wasOffline, checkConnection }}>
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-4 py-2 rounded-lg shadow-lg flex items-center">
          <WifiOff className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">You're offline. Some features may not work.</span>
        </div>
      )}
      
      {isOnline && wasOffline && (
        <div className="fixed bottom-4 left-4 z-50 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-lg shadow-lg flex items-center">
          <Wifi className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">You're back online!</span>
        </div>
      )}
      
      {children}
    </NetworkStatusContext.Provider>
  );
}

export default NetworkStatusProvider; 