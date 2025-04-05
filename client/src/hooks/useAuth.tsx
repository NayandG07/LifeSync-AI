import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, ensureUserExists } from '@/lib/firebase';
import { signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';

// Create auth context
const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
});

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    }, (error) => {
      console.error("Auth state change error:", error);
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Ensure user document exists in Firestore
      if (result.user) {
        await ensureUserExists(result.user.uid, {
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        });
      }
      
      setError(null);
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setError(null);
    } catch (error: any) {
      console.error("Sign-out error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithGoogle,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 