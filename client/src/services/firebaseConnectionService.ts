import { db, auth } from '@/lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { toast } from 'sonner';

// Cache of connection status to prevent multiple toasts
let lastConnectionStatus = {
  isConnected: true,
  lastChecked: 0,
};

/**
 * Checks if Firebase is accessible and connected
 * @param {boolean} showToasts - Whether to show toast notifications for connection status changes
 * @returns {Promise<boolean>} - Whether Firebase is connected
 */
export const checkFirebaseConnection = async (showToasts = true): Promise<boolean> => {
  try {
    // Don't check too frequently (at most once every 10 seconds)
    const now = Date.now();
    if (now - lastConnectionStatus.lastChecked < 10000) {
      return lastConnectionStatus.isConnected;
    }
    
    // Check if Firestore is accessible with a light query
    const testQuery = query(collection(db, 'connection_test'), limit(1));
    await getDocs(testQuery);
    
    // Update connection status
    if (!lastConnectionStatus.isConnected && showToasts) {
      toast.success('Connection to Firebase restored');
    }
    
    lastConnectionStatus = {
      isConnected: true,
      lastChecked: now,
    };
    
    return true;
  } catch (error) {
    console.error('Firebase connection check failed:', error);
    
    // Update connection status
    if (lastConnectionStatus.isConnected && showToasts) {
      toast.error('Unable to connect to Firebase. Some features may not work.', {
        description: 'This could be due to network issues or content blockers.',
        duration: 10000, // Longer duration for important errors
      });
    }
    
    lastConnectionStatus = {
      isConnected: false,
      lastChecked: Date.now(),
    };
    
    return false;
  }
};

/**
 * Checks if the user's auth token is still valid
 * @returns {Promise<boolean>} - Whether the token is valid
 */
export const checkAuthTokenValidity = async (): Promise<boolean> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;
    
    // This will force a token refresh if it's expired
    await currentUser.getIdToken(true);
    return true;
  } catch (error) {
    console.error('Auth token refresh failed:', error);
    
    if (error instanceof Error && 
        (error.message.includes('token') || error.message.includes('auth'))) {
      // Token-specific errors should trigger a redirect to login
      toast.error('Your session has expired. Please sign in again.', {
        duration: 5000,
      });
      
      // Force logout
      try {
        await auth.signOut();
      } catch (logoutError) {
        console.error('Error during forced logout:', logoutError);
      }
      
      // Redirect to home
      window.location.href = '/';
    }
    
    return false;
  }
};

/**
 * Creates a wrapped version of a Firebase operation with error handling
 * @param operation - The Firebase operation to perform
 * @param errorMessage - The error message to display
 * @param showToast - Whether to show a toast notification on error
 * @returns The result of the operation or null if it failed
 */
export const withFirebaseErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorMessage: string,
  showToast = true
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    
    // Only show toast if explicitly requested
    if (showToast) {
      toast.error(errorMessage);
    }
    
    return null;
  }
};

/**
 * Creates a version of a Firebase operation with timeout and error handling
 * @param operation - The Firebase operation to perform
 * @param errorMsg - The error message to display
 * @param timeoutMs - The timeout in milliseconds
 * @returns The result of the operation or null if it failed or timed out
 */
export const safeFirebaseOperation = <T>(
  operation: () => Promise<T>,
  errorMsg: string,
  timeoutMs = 10000
): Promise<T | null> => {
  return new Promise((resolve) => {
    let resolved = false;
    
    // Create a timeout promise
    const timeoutPromise = new Promise<"timeout">((r) => 
      setTimeout(() => {
        if (!resolved) r("timeout");
      }, timeoutMs)
    );
    
    // Race the operation against the timeout
    Promise.race([
      operation().then(result => {
        resolved = true;
        return result;
      }),
      timeoutPromise
    ])
    .then(result => {
      if (result === "timeout") {
        console.error(`Operation timed out: ${errorMsg}`);
        toast.error(`${errorMsg} - operation timed out`);
        resolve(null);
      } else {
        resolve(result as T);
      }
    })
    .catch(error => {
      console.error(`${errorMsg}:`, error);
      toast.error(errorMsg);
      resolve(null);
    });
  });
}; 