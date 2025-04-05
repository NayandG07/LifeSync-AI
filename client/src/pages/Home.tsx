import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import HealthMetrics from "@/components/dashboard/HealthMetrics";
import MoodTracker from "@/components/dashboard/MoodTracker";
import { MessageSquareText, Stethoscope, Sun, Moon, Cloud, LogIn, UserPlus, Bot, Activity, MessageSquare, Sparkles, Mail, Lock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useHealthStore } from '@/lib/healthData';

// Add CSS for blob animations
const animationKeyframes = `
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes shimmer {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.3;
  }
}

@keyframes spin-slow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rotate-y {
  0% {
    transform: rotateY(0deg) scale(1);
    filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.3));
  }
  50% {
    transform: rotateY(180deg) scale(1.05);
    filter: drop-shadow(0 0 15px rgba(79, 70, 229, 0.5));
  }
  100% {
    transform: rotateY(360deg) scale(1);
    filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.3));
  }
}

@keyframes pulse-border {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}

@keyframes rotate-reverse {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}

@keyframes button-glow {
  0% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(79, 70, 229, 0.7), 0 0 40px rgba(79, 70, 229, 0.4);
  }
  100% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.2);
  }
}

.animate-gradient-shift {
  animation: gradient-shift 15s ease infinite;
  background-size: 400% 400%;
}

.animate-shimmer {
  animation: shimmer 3s linear infinite;
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.animate-rotate-y {
  animation: rotate-y 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  transform-style: preserve-3d;
  backface-visibility: visible;
}

.animate-pulse-ring {
  animation: pulse-ring 3s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-pulse-border {
  animation: pulse-border 3s ease-in-out infinite;
}

.animate-rotate-reverse {
  animation: rotate-reverse 12s linear infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-3000 {
  animation-delay: 3s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.perspective-1000 {
  perspective: 1000px;
}

.animate-button-glow {
  animation: button-glow 2s infinite;
}
`;

export default function Home() {
  const [firstName, setFirstName] = useState<string>("");
  const navigate = useNavigate();
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening" | "night">("morning");
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const { loadHealthData } = useHealthStore();
  
  // Add login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Add the animation styles to the document
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = animationKeyframes;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay("morning");
    else if (hour >= 12 && hour < 17) setTimeOfDay("afternoon");
    else if (hour >= 17) setTimeOfDay("evening");
    else setTimeOfDay("night");

    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        if (profile && profile.name) {
          const firstWord = profile.name.split(' ')[0];
          setFirstName(firstWord);
        } else {
          setFirstName("");
        }
      } catch (error) {
        console.error("Error parsing user profile:", error);
        setFirstName("");
      }
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      // Only load health data when user is authenticated to prevent errors
      if (user) {
        // Load health data silently without showing error toasts
        loadHealthData().catch(err => {
          console.log("Health data loading in background");
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [loadHealthData]);

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case "morning": return <Sun className="h-8 w-8 text-amber-500 animate-spin-slow" />;
      case "afternoon": return <Sun className="h-8 w-8 text-orange-500 animate-spin-slow" />;
      case "evening": return <Cloud className="h-8 w-8 text-indigo-500 animate-pulse" />;
      case "night": return <Moon className="h-8 w-8 text-blue-500 animate-pulse" />;
    }
  };

  const getGreeting = () => {
    switch (timeOfDay) {
      case "morning": return "Good Morning";
      case "afternoon": return "Good Afternoon";
      case "evening": return "Good Evening";
      case "night": return "Good Evening";
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        {/* App Logo */}
        <div className="mb-10 relative mt-10">
          <div className="perspective-1000 flex items-center justify-center">
            {/* Outer border */}
            <div className="absolute w-20 h-20 rounded-full border-[2px] border-black dark:border-gray-400 border-dotted animate-pulse-border"></div>
            {/* Inner border with counter-rotation */}
            <div className="absolute w-16 h-16 rounded-full border-[1.5px] border-blue-800/50 dark:border-blue-500/50 border-dashed animate-rotate-reverse"></div>
            <div className="relative animate-rotate-y z-10">
              <Activity className="h-12 w-12 text-blue-800 dark:text-blue-600" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full opacity-30 blur-md"></div>
            </div>
            <div className="absolute w-14 h-14 bg-blue-500/10 rounded-full animate-pulse-ring"></div>
          </div>
        </div>

        {/* Welcome text */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center space-y-4 mb-10"
        >
          <div className="relative">
            <motion.h1 
              className="text-5xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.span
                className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% center", "100% center", "0% center"],
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              >
            Welcome to LifeSync
              </motion.span>
            </motion.h1>
            <motion.div 
              className="absolute -bottom-2 left-1/2 h-1 w-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
              initial={{ width: 0, x: "-50%" }}
              animate={{ width: "50%", x: "-50%" }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </div>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Your personal health and wellness companion
          </motion.p>
        </motion.div>

        {/* Card with sign in form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="max-w-md w-full"
        >
          <div className="relative">
            {/* Background decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-5 right-20 w-40 h-40 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            <div className="absolute -top-5 left-20 w-20 h-20 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-3000"></div>
            
            {/* Card content */}
            <motion.div 
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 backdrop-blur-lg backdrop-filter"
              whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6 relative">
                <motion.h2 
                  className="text-2xl font-semibold text-gray-800 dark:text-gray-100"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Get Started
                </motion.h2>
                <motion.p 
                  className="text-gray-600 dark:text-gray-300 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Access your personal wellness dashboard
                </motion.p>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="p-4 mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ repeat: 2, duration: 0.5 }}
                  >
                    <AlertCircle className="w-5 h-5" />
                  </motion.div>
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}
              
              <form onSubmit={handleEmailLogin} className="space-y-5">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">Email</Label>
                  <div className="relative group">
                    <motion.div 
                      className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-30 dark:group-hover:opacity-60 blur-sm"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.5 }}
                      transition={{ duration: 0.2 }}
                    />
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors duration-200" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 transition-all duration-300 rounded-md focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">Password</Label>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                      <Link 
                        to="/forgot-password" 
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </motion.div>
                  </div>
                  <div className="relative group">
                    <motion.div 
                      className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-30 dark:group-hover:opacity-60 blur-sm"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.5 }}
                      transition={{ duration: 0.2 }}
                    />
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors duration-200" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 transition-all duration-300 rounded-md focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="pt-2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div 
                    whileHover={{ 
                      scale: 1.03, 
                      boxShadow: "0 0 15px rgba(79, 70, 229, 0.5), 0 0 30px rgba(79, 70, 229, 0.3)" 
                    }} 
                    whileTap={{ 
                      scale: 0.97,
                      boxShadow: "0 0 25px rgba(79, 70, 229, 0.7), 0 0 50px rgba(79, 70, 229, 0.4)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="rounded-lg overflow-hidden"
        >
          <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-600 text-white relative overflow-hidden group py-6 border-none"
                      disabled={loading}
                    >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <div className="absolute inset-0 w-10 h-full bg-white/30 skew-x-[45deg] transform -translate-x-20 group-hover:translate-x-[500%] transition-transform duration-1000"></div>
                      
                      {/* Additional ripple effect */}
                      <div className="absolute inset-0 w-full h-full">
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full bg-white/30 group-active:w-[300%] group-active:h-[300%] transition-all duration-500"></span>
                      </div>
                      
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-base">Signing in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <LogIn className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                          <span className="text-base font-medium">Sign In</span>
                        </div>
                      )}
          </Button>
                  </motion.div>
                </motion.div>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.div 
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
                  }} 
                  whileTap={{ 
                    scale: 0.97,
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(59, 130, 246, 0.2)"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="rounded-lg overflow-hidden group/button"
                >
          <Button
                    type="button"
            variant="outline"
                    className="w-full py-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-all duration-300 relative overflow-hidden"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <div className="absolute inset-0 w-10 h-full bg-gradient-to-r from-blue-400/20 to-transparent skew-x-[45deg] transform -translate-x-20 group-hover/button:translate-x-[500%] transition-transform duration-700"></div>
                    <div className="absolute inset-0 border-0 group-hover/button:border-[3px] border-blue-500/0 group-hover/button:border-blue-500/20 rounded-lg transition-all duration-300"></div>
                    <div className="flex items-center justify-center relative z-10">
                      <motion.div 
                        className="relative" 
                        whileHover={{ rotate: 360 }} 
                        transition={{ duration: 0.7 }}
                      >
                        <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2 group-hover/button:scale-110 transition-transform duration-300" />
                      </motion.div>
                      <span className="text-base font-medium text-gray-700 dark:text-gray-200">Sign in with Google</span>
                    </div>
          </Button>
                </motion.div>
              </motion.div>

              <motion.div 
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <span className="text-gray-600 dark:text-gray-400 mr-2">Don't have an account?</span>
                <motion.div 
                  className="inline-block mt-1"
                  whileHover={{ 
                    scale: 1.05,
                    y: -2
                  }} 
                  whileTap={{ scale: 0.97 }}
                >
                  <Link 
                    to="/signup" 
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg font-medium inline-flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign up</span>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-8 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 -z-10"></div>
      
      {/* Animated floating particles */}
      <div className="fixed inset-0 -z-10">
        <motion.div 
          className="absolute top-20 left-[20%] w-20 h-20 bg-blue-400/20 rounded-full blur-3xl"
          animate={{ 
            y: [0, -40, 0], 
            x: [0, 30, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div 
          className="absolute top-[40%] right-[15%] w-32 h-32 bg-purple-400/20 rounded-full blur-3xl"
          animate={{ 
            y: [0, 50, 0], 
            x: [0, -30, 0],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-[20%] left-[30%] w-24 h-24 bg-indigo-400/20 rounded-full blur-3xl"
          animate={{ 
            y: [0, -30, 0], 
            x: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2] 
          }}
          transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", delay: 2 }}
        />
      </div>

      {/* Welcome Section */}
      <AnimatePresence mode="wait">
        {mounted && (
          <motion.div 
            className="flex flex-col gap-4 relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
              {getTimeIcon()}
              </motion.div>
              <motion.h1 
                className="text-4xl font-bold tracking-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.span
                  className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% center", "100% center", "0% center"],
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "mirror"
                  }}
              >
                {getGreeting()}{firstName ? `, ${firstName}` : ''}
                </motion.span>
              </motion.h1>
            </div>
            <motion.p 
              className="text-muted-foreground text-lg max-w-3xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Track your mood and monitor your health metrics with our AI-powered wellness companion
            </motion.p>

            {/* Decorative elements */}
            <motion.div 
              className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-500/10 dark:to-pink-500/10 rounded-full blur-3xl -z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-full blur-3xl -z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div 
        className="grid gap-8 lg:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
      >
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <HealthMetrics />
        </motion.div>
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
        <MoodTracker />
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ 
            scale: 1.03, 
            y: -8, 
            boxShadow: "0 25px 35px -5px rgba(59, 130, 246, 0.3), 0 10px 20px -5px rgba(99, 102, 241, 0.2)" 
          }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-3xl"
        >
          <Button 
            className="w-full h-32 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 shadow-xl group border-none p-0"
            onClick={() => navigate('/chat-enhanced')}
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.2)_0%,transparent_40%)]"></div>
            
            {/* Particle animations */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-white"
                  style={{ 
                    left: `${10 + i * 20}%`, 
                    top: `${20 + i * 10}%` 
                  }}
                  animate={{ 
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0] 
                  }}
                  transition={{ 
                    duration: 3, 
                    delay: i * 0.5, 
                    repeat: Infinity,
                    repeatType: "loop" 
                  }}
                />
              ))}
            </div>

            {/* Pulse effect on hover */}
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 z-0"
              animate={{ scale: [0, 2.5], opacity: [0, 0.2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Content */}
            <div className="flex items-center justify-center gap-5 z-10 relative px-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full transform scale-150"></div>
                <motion.div
                  animate={{ 
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.05, 1, 1.05, 1]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="relative z-10"
                >
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-inner">
                    <Bot className="w-10 h-10 text-white transition-transform group-hover:scale-110 group-hover:rotate-12" />
                  </div>
                </motion.div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white drop-shadow-md">Chat with AI Assistant</div>
                <div className="text-sm font-medium text-white/90 mt-1 flex items-center">
                  <span>Get personalized health insights</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
                    className="inline-block ml-2"
                  >→</motion.span>
                </div>
              </div>
            </div>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ 
            scale: 1.03, 
            y: -8, 
            boxShadow: "0 25px 35px -5px rgba(16, 185, 129, 0.3), 0 10px 20px -5px rgba(5, 150, 105, 0.2)" 
          }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-3xl"
        >
          <Button 
            className="w-full h-32 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700 shadow-xl group border-none p-0"
            onClick={() => navigate('/symptoms')}
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.2)_0%,transparent_40%)]"></div>
            
            {/* Particle animations */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-white"
                  style={{ 
                    right: `${10 + i * 20}%`, 
                    top: `${20 + i * 10}%` 
                  }}
                  animate={{ 
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0] 
                  }}
                  transition={{ 
                    duration: 3, 
                    delay: i * 0.5 + 0.5, 
                    repeat: Infinity,
                    repeatType: "loop" 
                  }}
                />
              ))}
            </div>

            {/* Pulse effect on hover */}
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 z-0"
              animate={{ scale: [0, 2.5], opacity: [0, 0.2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Content */}
            <div className="flex items-center justify-center gap-5 z-10 relative px-6">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full transform scale-150"></div>
                <motion.div
                  animate={{ 
                    rotate: [0, -5, 0, 5, 0],
                    scale: [1, 1.05, 1, 1.05, 1] 
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="relative z-10"
                >
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-inner">
                    <Activity className="w-10 h-10 text-white transition-transform group-hover:scale-110 group-hover:rotate-12" />
                  </div>
                </motion.div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white drop-shadow-md">Check Symptoms</div>
                <div className="text-sm font-medium text-white/90 mt-1 flex items-center">
                  <span>Analyze your health conditions</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
                    className="inline-block ml-2"
                  >→</motion.span>
                </div>
              </div>
            </div>
          </Button>
        </motion.div>
      </div>
    </div>
  );
} 