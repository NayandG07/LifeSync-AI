import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, Suspense, lazy } from 'react';
import Navbar from '@/components/layout/Navbar';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import '@/styles/theme.css';
import '@/styles/responsive.css';
import { ThemeProvider } from "@/components/theme-provider"
import { getDoc, doc, enableIndexedDbPersistence } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { setTheme } from '@/lib/theme';
import ChatEnhanced from "@/pages/ChatEnhanced";
import { toast } from 'sonner';
import { checkFirebaseConnection } from '@/services/firebaseConnectionService';
import { useNetworkStatus } from '@/components/NetworkStatusProvider';

// Enable offline persistence for Firestore
// This helps the app work better with intermittent connectivity
try {
  enableIndexedDbPersistence(db)
    .then(() => console.log('Offline persistence enabled'))
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn('Offline persistence unavailable - multiple tabs open');
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all features required for persistence
        console.warn('Offline persistence not supported in this browser');
      } else {
        console.error('Error enabling offline persistence:', err);
      }
    });
} catch (error) {
  console.error('Error setting up offline persistence:', error);
}

// Lazy load components
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Home = lazy(() => import('@/pages/Home'));
const SignUp = lazy(() => import('@/pages/SignUp'));
const NotFound = lazy(() => import('@/pages/not-found'));
const ProfileRegistration = lazy(() => import('@/components/profile/ProfileRegistration'));
const Settings = lazy(() => import('@/pages/Settings'));
const Symptoms = lazy(() => import('@/pages/Symptoms'));

// Loading Fallback Component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/20 to-indigo-50/20 themed-container">
    <div className="space-y-4 text-center p-8 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200/50 shadow-xl">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="text-blue-600 font-medium">Loading...</p>
    </div>
  </div>
);

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50/20 to-orange-50/20 themed-container">
    <div className="max-w-md w-full space-y-4 text-center p-8 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200/50 shadow-xl">
      <div className="text-red-500 mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
      <p className="text-gray-600">We encountered an error while loading the application.</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
);

function App() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const { isOnline } = useNetworkStatus();

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/chat-enhanced', label: 'Chat' },
    { href: '/symptoms', label: 'Symptoms' },
    { href: '/settings', label: 'Settings' },
  ];

  // Check Firebase connection when network status changes
  useEffect(() => {
    if (isOnline) {
      checkFirebaseConnection()
        .then(isConnected => {
          setFirebaseReady(isConnected);
          if (!isConnected) {
            console.warn('Firebase connection check failed after network recovery');
          }
        })
        .catch(error => {
          console.error('Error checking Firebase connection:', error);
          setFirebaseReady(false);
        });
    } else {
      setFirebaseReady(false);
    }
  }, [isOnline]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // Load profile from Firestore instead of localStorage
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            localStorage.setItem('userProfile', JSON.stringify(userData.profile || {}));
          }
        } catch (error) {
          console.error("Error loading profile:", error);
          // Set an empty profile to prevent errors
          localStorage.setItem('userProfile', JSON.stringify({}));
        }
      }
      
      setLoading(false);
    }, (error) => {
      console.error("Auth state change error:", error);
      toast.error("Authentication error. Please reload the page.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Initialize theme
  useEffect(() => {
    // Always use light theme
    document.documentElement.classList.remove('dark-theme');
    document.documentElement.classList.add('light');
  }, []);

  const handleProfileModalClose = () => {
    setShowProfileModal(false);
    // Save modal state to prevent reopening
    localStorage.setItem('profileModalShown', 'true');
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="app-theme">
        <div className="min-h-screen bg-gray-50">
          <LoadingFallback />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <Router>
        <div className="min-h-screen bg-gray-50 themed-container">
          {!loading && (
            <Navbar 
              onProfileClick={() => setShowProfileModal(true)}
            />
          )}
          <main className="container py-4 md:py-6 px-4 md:px-8 lg:px-16 max-w-6xl mx-auto themed-content">
            <div className="space-y-4 md:space-y-6 mobile-stack">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route 
                    path="/signup" 
                    element={!user ? <SignUp /> : <Navigate to="/dashboard" />} 
                  />
                  <Route 
                    path="/dashboard" 
                    element={user ? <Dashboard /> : <Navigate to="/" />} 
                  />
                  <Route 
                    path="/chat-enhanced" 
                    element={user ? <ChatEnhanced /> : <Navigate to="/" />} 
                  />
                  <Route 
                    path="/chat" 
                    element={<Navigate to="/chat-enhanced" />} 
                  />
                  <Route 
                    path="/symptoms" 
                    element={user ? <Symptoms /> : <Navigate to="/" />} 
                  />
                  <Route 
                    path="/settings" 
                    element={user ? <Settings /> : <Navigate to="/" />} 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </main>
          {user && (
            <Suspense fallback={<LoadingFallback />}>
              <ProfileRegistration 
                isOpen={showProfileModal} 
                onClose={handleProfileModalClose} 
              />
            </Suspense>
          )}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;