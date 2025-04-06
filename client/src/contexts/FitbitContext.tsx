import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface FitbitData {
  steps: number;
  heartRate: number;
  sleep: {
    duration: number;
    quality: 'poor' | 'fair' | 'good';
  };
  calories: number;
  weight: number;
  lastSync: string | null;
}

interface FitbitContextType {
  isConnected: boolean;
  loading: boolean;
  fitbitData: FitbitData | null;
  lastSync: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  syncData: () => Promise<void>;
}

const FitbitContext = createContext<FitbitContextType | undefined>(undefined);

// Mock data for demonstration
const mockFitbitData: FitbitData = {
  steps: 8432,
  heartRate: 72,
  sleep: {
    duration: 7.5,
    quality: 'good'
  },
  calories: 1850,
  weight: 70.5,
  lastSync: new Date().toISOString()
};

export function FitbitProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fitbitData, setFitbitData] = useState<FitbitData | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);

  // Check connection status on mount
  useEffect(() => {
    const fitbitStatus = localStorage.getItem('fitbit_connected');
    const lastSyncTime = localStorage.getItem('fitbit_last_sync');
    const savedData = localStorage.getItem('fitbit_data');

    if (fitbitStatus === 'true') {
      setIsConnected(true);
      setLastSync(lastSyncTime);
      if (savedData) {
        setFitbitData(JSON.parse(savedData));
      }
    }
  }, []);

  // Auto sync every 30 minutes if connected
  useEffect(() => {
    let syncInterval: NodeJS.Timeout;
    
    if (isConnected) {
      syncInterval = setInterval(() => {
        syncData();
      }, 30 * 60 * 1000); // 30 minutes
    }

    return () => {
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, [isConnected]);

  const connect = async () => {
    setLoading(true);
    try {
      // Simulating OAuth flow delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, this would be the Fitbit OAuth flow
      setIsConnected(true);
      const currentTime = new Date().toISOString();
      setLastSync(currentTime);
      setFitbitData(mockFitbitData);
      
      // Save connection status and data
      localStorage.setItem('fitbit_connected', 'true');
      localStorage.setItem('fitbit_last_sync', currentTime);
      localStorage.setItem('fitbit_data', JSON.stringify(mockFitbitData));
      
      toast.success('Successfully connected to Fitbit!');
    } catch (error) {
      toast.error('Failed to connect to Fitbit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(false);
      setLastSync(null);
      setFitbitData(null);
      
      // Clear connection status and data
      localStorage.removeItem('fitbit_connected');
      localStorage.removeItem('fitbit_last_sync');
      localStorage.removeItem('fitbit_data');
      
      toast.success('Successfully disconnected from Fitbit');
    } catch (error) {
      toast.error('Failed to disconnect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const syncData = async () => {
    if (!isConnected) return;

    setLoading(true);
    try {
      // In real implementation, this would fetch new data from Fitbit API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update mock data with some variations
      const newData: FitbitData = {
        ...mockFitbitData,
        steps: Math.floor(Math.random() * 2000) + 7000,
        heartRate: Math.floor(Math.random() * 20) + 60,
        calories: Math.floor(Math.random() * 500) + 1500,
        lastSync: new Date().toISOString()
      };

      setFitbitData(newData);
      setLastSync(newData.lastSync);
      
      // Save updated data
      localStorage.setItem('fitbit_data', JSON.stringify(newData));
      localStorage.setItem('fitbit_last_sync', newData.lastSync);
      
      toast.success('Successfully synced Fitbit data');
    } catch (error) {
      toast.error('Failed to sync data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isConnected,
    loading,
    fitbitData,
    lastSync,
    connect,
    disconnect,
    syncData
  };

  return (
    <FitbitContext.Provider value={value}>
      {children}
    </FitbitContext.Provider>
  );
}

export function useFitbit() {
  const context = useContext(FitbitContext);
  if (context === undefined) {
    throw new Error('useFitbit must be used within a FitbitProvider');
  }
  return context;
} 