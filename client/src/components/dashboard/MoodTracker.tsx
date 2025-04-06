import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { setTheme, type MoodType } from "@/lib/theme";
import { Sun, Cloud, CloudRain, Smile, Zap, Frown, Meh, Heart, PartyPopper, Brain, Sparkles, Waves } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { gemma } from "@/lib/gemma";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { saveMoodEntry, syncSavedMoods } from "@/lib/firebase";
import { toast } from "sonner";

// Mood data interface
interface MoodData {
  id: string;
  mood: string;
  intensity: number;
  note: string;
  timestamp: Date;
  userId?: string;
}

// Mood analysis interface
interface MoodAnalysis {
  message: string;
  suggestion: string;
  patterns: string;
  insights: string;
  activities: string[];
  musicMood: string;
  wellnessScore: number;
}

const moodConfig = {
  happy: { 
    icon: Sun, 
    label: "Happy", 
    color: "text-yellow-500",
    gradient: "from-yellow-400 to-orange-500",
    message: "Your joy brightens everyone's day! Keep smiling! 🌟",
    suggestion: "Why not share your happiness by doing something nice for someone?",
    aiAnalysis: {
      patterns: "Your mood patterns show consistent positivity, especially in the mornings.",
      insights: "Happy moods often correlate with your physical activity levels.",
      activities: ["Call a friend", "Start a creative project", "Plan a fun weekend activity"],
      musicMood: "Upbeat and energetic music recommended",
      wellnessScore: 95
    }
  },
  sad: { 
    icon: CloudRain, 
    label: "Sad", 
    color: "text-blue-500",
    gradient: "from-blue-400 to-indigo-500",
    message: "It's okay to feel down. Tomorrow brings new possibilities! 🌧️",
    suggestion: "Consider talking to a friend or doing something you enjoy.",
    aiAnalysis: {
      patterns: "Your sad moods tend to be temporary and often improve with social interaction.",
      insights: "There's a correlation between these moments and your sleep patterns.",
      activities: ["Gentle walking", "Journaling", "Mindful breathing exercises"],
      musicMood: "Calming and soothing melodies recommended",
      wellnessScore: 75
    }
  },
  anxious: { 
    icon: Cloud, 
    label: "Anxious", 
    color: "text-green-500",
    gradient: "from-green-400 to-emerald-500",
    message: "Take deep breaths. You've got this! 🍃",
    suggestion: "Try some mindful breathing exercises or a short walk.",
    aiAnalysis: {
      patterns: "Anxiety peaks tend to occur during high-activity periods.",
      insights: "Regular exercise has shown to help reduce your anxiety levels.",
      activities: ["5-minute meditation", "Progressive muscle relaxation", "Nature walk"],
      musicMood: "Ambient and peaceful tracks recommended",
      wellnessScore: 80
    }
  },
  neutral: { 
    icon: Smile, 
    label: "Neutral", 
    color: "text-purple-500",
    gradient: "from-purple-400 to-pink-500",
    message: "Finding balance in the everyday moments. ⚖️",
    suggestion: "Maybe try something new today to spark some excitement?",
    aiAnalysis: {
      patterns: "Your neutral moods often transition to positive with engagement in activities.",
      insights: "These moments are great opportunities for trying new things.",
      activities: ["Try a new hobby", "Learn something new", "Explore your local area"],
      musicMood: "Balanced mix of upbeat and calm music recommended",
      wellnessScore: 85
    }
  },
  calm: {
    icon: Waves,
    label: "Calm",
    color: "text-cyan-500",
    gradient: "from-cyan-400 to-teal-500",
    message: "Embrace this peaceful state of mind. 🌊",
    suggestion: "Perfect time for mindfulness or creative activities.",
    aiAnalysis: {
      patterns: "Calm states often follow successful stress management.",
      insights: "These moments are ideal for deep focus and reflection.",
      activities: ["Deep breathing", "Light yoga", "Reading"],
      musicMood: "Soft ambient or nature sounds recommended",
      wellnessScore: 92
    }
  },
  energetic: { 
    icon: Zap, 
    label: "Energetic", 
    color: "text-red-500",
    gradient: "from-red-400 to-rose-500",
    message: "Your energy is contagious! Channel it wisely! ⚡",
    suggestion: "Great time for exercise or tackling that project you've been planning!",
    aiAnalysis: {
      patterns: "Peak energy levels align well with your productivity phases.",
      insights: "Physical activity during these times shows excellent results.",
      activities: ["High-intensity workout", "Tackle challenging tasks", "Creative projects"],
      musicMood: "High-energy and motivating tracks recommended",
      wellnessScore: 90
    }
  }
} as const;

export default function MoodTracker() {
  const [user] = useAuthState(auth);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState([5]);
  const [note, setNote] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState<{message: string, suggestion: string} | null>(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [aiInsightStage, setAiInsightStage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedMoods, setSavedMoods] = useState<MoodData[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load saved moods from localStorage
  useEffect(() => {
    if (user) {
      try {
        const savedData = localStorage.getItem(`mood_history_${user.uid}`);
        if (savedData) {
          // Convert string dates back to Date objects
          const moods: MoodData[] = JSON.parse(savedData).map((mood: any) => ({
            ...mood,
            timestamp: new Date(mood.timestamp)
          }));
          setSavedMoods(moods);
        }
        
        // Attempt to sync local moods with Firestore
        syncMoodsWithFirestore();
      } catch (error) {
        console.error("Error loading saved moods:", error);
      }
    }
  }, [user]);
  
  // Function to sync locally stored moods with Firestore
  const syncMoodsWithFirestore = async () => {
    if (!user) return;
    
    try {
      setIsSyncing(true);
      const result = await syncSavedMoods(user.uid);
      
      if (result.success) {
        if (result.message !== 'No local data to sync' && 
            result.message !== 'No moods to sync' && 
            result.message !== 'All moods already synced') {
          toast.success(result.message);
        }
      } else {
        console.warn("Failed to sync moods:", result.message);
      }
    } catch (error) {
      console.error("Error syncing moods:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Analyze mood using Symptom API instead of simulation
  const analyzeMoodWithAPI = async (mood: string) => {
    setAiThinking(true);
    setAiResponse(null);
    setShowDetailedAnalysis(false);
    setAiInsightStage(0);
    
    try {
      // Simulate progressive stages for UI feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      setAiInsightStage(1); // Pattern Analysis
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setAiInsightStage(2); // Mood Correlation
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setAiInsightStage(3); // Activity Suggestions
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setAiInsightStage(4); // Final Analysis
      
      // Historical mood data context
      const moodHistory = savedMoods.map(m => m.mood).slice(0, 5).join(", ");
      const promptSymptoms = [`Current mood: ${mood}`, `Mood intensity: ${intensity[0]}/10`];
      
      if (note) {
        promptSymptoms.push(`Note: ${note}`);
      }
      
      if (moodHistory) {
        promptSymptoms.push(`Recent mood history: ${moodHistory}`);
      }
      
      // Use the symptom API to analyze the mood
      const result = await gemma.analyzeSymptoms(
        promptSymptoms,
        ["mental"],
        "current",
        intensity[0] / 2 // Convert 1-10 scale to 1-5 scale
      );
      
      // Extract relevant info from the result
      let analysis: MoodAnalysis = {
        message: moodConfig[mood as keyof typeof moodConfig].message,
        suggestion: moodConfig[mood as keyof typeof moodConfig].suggestion,
        patterns: result?.conditions?.[0]?.description || moodConfig[mood as keyof typeof moodConfig].aiAnalysis.patterns,
        insights: result?.conditions?.[1]?.description || moodConfig[mood as keyof typeof moodConfig].aiAnalysis.insights,
        activities: result?.remedies?.map((r: any) => r.description) || moodConfig[mood as keyof typeof moodConfig].aiAnalysis.activities,
        musicMood: moodConfig[mood as keyof typeof moodConfig].aiAnalysis.musicMood,
        wellnessScore: result?.conditions?.[0]?.confidence || moodConfig[mood as keyof typeof moodConfig].aiAnalysis.wellnessScore
      };
      
      setAiResponse({
        message: analysis.message,
        suggestion: analysis.suggestion
      });
      
      // Store the analysis in localStorage for this mood
      if (user) {
        localStorage.setItem(`mood_analysis_${user.uid}_${mood}`, JSON.stringify(analysis));
      }
      
      setAiThinking(false);
      setShowDetailedAnalysis(true);
    } catch (error) {
      console.error("Error analyzing mood with API:", error);
      
      // Fallback to configured responses
      const moodInfo = moodConfig[mood as keyof typeof moodConfig];
      setAiResponse({
        message: moodInfo.message,
        suggestion: moodInfo.suggestion
      });
      
      setAiThinking(false);
      setShowDetailedAnalysis(true);
      
      // Show error toast
      toast.error("Could not connect to AI service, using fallback analysis");
    }
  };

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    setShowConfetti(true);
    setTheme(mood as MoodType);
    await analyzeMoodWithAPI(mood);

    // Reset confetti after animation
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleSaveMood = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    
    try {
      const moodData: MoodData = {
        id: Date.now().toString(),
        mood: selectedMood,
        intensity: intensity[0],
        note: note,
        timestamp: new Date()
      };
      
      // Save to localStorage
      if (user) {
        moodData.userId = user.uid;
        
        // Load existing data
        const savedData = localStorage.getItem(`mood_history_${user.uid}`);
        let history: MoodData[] = savedData ? JSON.parse(savedData) : [];
        
        // Add new mood data
        history = [moodData, ...history];
        
        // Save back to localStorage
        localStorage.setItem(`mood_history_${user.uid}`, JSON.stringify(history));
        
        // Update state
        setSavedMoods(history);
        
        // Save to Firestore if available
        try {
          await saveMoodEntry(user.uid, moodData);
          console.log("Mood saved to Firestore successfully");
        } catch (firestoreError) {
          console.error("Error saving to Firestore, using localStorage only:", firestoreError);
          toast.warning("Saved locally. Will sync when connection is restored");
        }
      }
      
      // Reset mood and other states
      setSelectedMood(null);
      setIntensity([5]);
      setNote("");
      setShowConfetti(true);
      setTheme("neutral" as MoodType);
      setAiResponse(null);
      setShowDetailedAnalysis(false);
      setAiInsightStage(0);
      
      toast.success("Mood saved successfully!");
    } catch (error) {
      console.error("Error saving mood:", error);
      toast.error("Failed to save mood data");
    } finally {
      setIsSubmitting(false);
    }

    // Reset confetti after animation
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      <Card className="p-6 transition-all duration-300 relative overflow-hidden backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] bg-white/80 dark:bg-gray-800/80 h-full flex flex-col">
        {/* Glassmorphism background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-pink-100/30 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.2),transparent_50%)]" />
        
        {/* Animated grain texture */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] animate-[grain_8s_steps(10)_infinite]" />
        </div>

        {/* Confetti Effect */}
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-lg"
                initial={{
                  top: "50%",
                  left: "50%",
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  top: Math.random() * 100 + "%",
                  left: Math.random() * 100 + "%",
                  scale: Math.random() * 2,
                  opacity: 0
                }}
                transition={{
                  duration: 1 + Math.random() * 2,
                  ease: "easeOut",
                  delay: Math.random() * 0.2
                }}
              />
            ))}
          </motion.div>
        )}

        <div className="relative flex-grow flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              How are you feeling?
              <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            </h2>
            {selectedMood && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 dark:bg-blue-900/50 border border-blue-200/50 dark:border-blue-800/50">
                <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Analysis Active</span>
              </div>
            )}
          </div>
          
          {/* Mood Selection Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {Object.entries(moodConfig).map(([mood, config]) => {
              const Icon = config.icon;
              return (
                <Button
                  key={mood}
                  variant="outline"
                  className={cn(
                    "h-24 flex flex-col items-center justify-center gap-2 group relative overflow-hidden",
                    selectedMood === mood && "ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400",
                    "hover:bg-gradient-to-br hover:from-white/50 hover:to-white/10 dark:hover:from-gray-800/50 dark:hover:to-gray-800/10"
                  )}
                  onClick={() => handleMoodSelect(mood)}
                >
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity",
                    `bg-gradient-to-br ${config.gradient}`
                  )} />
                  <Icon className={cn("w-8 h-8", config.color)} />
                  <span className="text-sm font-medium">{config.label}</span>
                  </Button>
              );
            })}
          </div>

          {/* AI Analysis Section - Moved here */}
          <AnimatePresence mode="wait">
            {aiThinking && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-6 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50 shadow-lg backdrop-blur-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Brain className="w-6 h-6 text-blue-500" />
                    </motion.div>
                    <span className="text-blue-600 dark:text-blue-400 font-medium text-lg">
                      AI is analyzing your mood...
                    </span>
                  </div>

                  {/* Progressive Analysis Stages */}
                  <div className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: aiInsightStage >= 1 ? 1 : 0, x: aiInsightStage >= 1 ? 0 : -20 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Analyzing mood patterns...</span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: aiInsightStage >= 2 ? 1 : 0, x: aiInsightStage >= 2 ? 0 : -20 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Correlating with health metrics...</span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: aiInsightStage >= 3 ? 1 : 0, x: aiInsightStage >= 3 ? 0 : -20 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Generating personalized suggestions...</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {showDetailedAnalysis && selectedMood && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 space-y-4"
              >
                {/* AI Analysis Card */}
                <div className="p-6 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50 shadow-lg backdrop-blur-sm">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Brain className="w-6 h-6 text-blue-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          AI Mood Analysis
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          Wellness Score:
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {(() => {
                            // Get analysis data from localStorage if available
                            if (user && selectedMood) {
                              try {
                                const analysisData = localStorage.getItem(`mood_analysis_${user.uid}_${selectedMood}`);
                                if (analysisData) {
                                  const analysis = JSON.parse(analysisData);
                                  return analysis.wellnessScore;
                                }
                              } catch (e) {
                                console.error("Error loading analysis data:", e);
                              }
                            }
                            // Fallback to hardcoded data
                            return moodConfig[selectedMood as keyof typeof moodConfig].aiAnalysis.wellnessScore;
                          })()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Pattern Analysis</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {(() => {
                            // Get analysis data from localStorage if available
                            if (user && selectedMood) {
                              try {
                                const analysisData = localStorage.getItem(`mood_analysis_${user.uid}_${selectedMood}`);
                                if (analysisData) {
                                  const analysis = JSON.parse(analysisData);
                                  return analysis.patterns;
                                }
                              } catch (e) {
                                console.error("Error loading analysis data:", e);
                              }
                            }
                            // Fallback to hardcoded data
                            return moodConfig[selectedMood as keyof typeof moodConfig].aiAnalysis.patterns;
                          })()}
                        </p>
                      </div>

                      <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Key Insights</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {(() => {
                            // Get analysis data from localStorage if available
                            if (user && selectedMood) {
                              try {
                                const analysisData = localStorage.getItem(`mood_analysis_${user.uid}_${selectedMood}`);
                                if (analysisData) {
                                  const analysis = JSON.parse(analysisData);
                                  return analysis.insights;
                                }
                              } catch (e) {
                                console.error("Error loading analysis data:", e);
                              }
                            }
                            // Fallback to hardcoded data
                            return moodConfig[selectedMood as keyof typeof moodConfig].aiAnalysis.insights;
                          })()}
                        </p>
                      </div>
                    </div>

                    {/* Add recommended activities based on mood analysis */}
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Recommended Activities</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {(() => {
                          // Get analysis data from localStorage if available
                          if (user && selectedMood) {
                            try {
                              const analysisData = localStorage.getItem(`mood_analysis_${user.uid}_${selectedMood}`);
                              if (analysisData) {
                                const analysis = JSON.parse(analysisData);
                                return analysis.activities.map((activity: string, i: number) => (
                                  <li key={i} className="text-sm text-gray-600 dark:text-gray-300">{activity}</li>
                                ));
                              }
                            } catch (e) {
                              console.error("Error loading analysis data:", e);
                            }
                          }
                          // Fallback to hardcoded data
                          return moodConfig[selectedMood as keyof typeof moodConfig].aiAnalysis.activities.map((activity, i) => (
                            <li key={i} className="text-sm text-gray-600 dark:text-gray-300">{activity}</li>
                          ));
                        })()}
                      </ul>
                    </div>
                    
                    <div className="text-center pt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Analysis powered by AI based on your mood data</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mood Intensity Slider - Enhanced UI with new design */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">How intense is this feeling?</span>
                <div className="relative w-5 h-5 group">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
                    <path d="M12 16v-4" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 8h.01" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <div className="absolute -top-1 left-6 w-60 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-xs z-50 border border-gray-200 dark:border-gray-700">
                    Intensity reflects how strongly you feel this emotion, from very mild (1) to extremely intense (10).
                  </div>
                </div>
              </label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold border border-blue-500/30 shadow-inner shadow-white/30 dark:shadow-white/10">
                  {intensity[0]}/10
                </span>
              </div>
            </div>

            <div className="relative pt-10 pb-12 px-1">
              {/* Intensity label */}
              <div className="absolute -top-2 left-0 right-0 flex justify-between text-xs font-medium">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center shadow-inner">
                    <span className="text-[10px] text-blue-700 dark:text-blue-300 font-bold">Mild</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 flex items-center justify-center shadow-inner">
                    <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold">Med</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800 flex items-center justify-center shadow-inner">
                    <span className="text-[10px] text-pink-700 dark:text-pink-300 font-bold">High</span>
                  </div>
                </div>
              </div>
              
              {/* Glow effect for slider track */}
              <div className="absolute left-0 right-0 top-1/2 h-3 -translate-y-1/2 rounded-full opacity-50 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 animate-pulse-slow"></div>
              </div>
              
              {/* Slider main track */}
              <div className="absolute left-0 right-0 top-1/2 h-4 -translate-y-1/2 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-pink-900/40 rounded-full shadow-inner"></div>
              
              {/* Active filled track - fixed to not extend beyond thumb */}
              <div 
                className="absolute left-0 top-1/2 h-4 -translate-y-1/2 rounded-full transition-all duration-200 overflow-hidden"
                style={{ 
                  width: `calc(${(intensity[0] / 10) * 100}% - 8px)`, 
                }}
              >
                {/* Main gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600"></div>
                
                {/* Glossy highlight effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent h-1/2"></div>
              </div>

              {/* Numbered markers - show every second marker for cleaner look */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 text-xs">
                {[1, 3, 5, 7, 9].map(num => (
                  <div key={num} className="flex flex-col items-center">
                    <div className={cn(
                      "h-2 w-0.5 mb-1",
                      intensity[0] >= num ? "bg-white dark:bg-gray-300" : "bg-gray-300 dark:bg-gray-600",
                    )}></div>
                    <span className={cn(
                      "text-[10px] select-none", 
                      intensity[0] === num ? "text-blue-600 dark:text-blue-300 font-medium" : "text-gray-500 dark:text-gray-400"
                    )}>
                      {num}
                    </span>
                  </div>
                ))}
              </div>

              {/* Slider component with enhanced styling */}
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={10}
                min={1}
                step={1}
                className={cn(
                  "relative z-10",
                  "[&_[role=slider]]:h-8",
                  "[&_[role=slider]]:w-8",
                  "[&_[role=slider]]:bg-gradient-to-br",
                  "[&_[role=slider]]:from-white",
                  "[&_[role=slider]]:to-gray-100",
                  "[&_[role=slider]]:dark:from-gray-700",
                  "[&_[role=slider]]:dark:to-gray-800",
                  "[&_[role=slider]]:border-2",
                  "[&_[role=slider]]:border-blue-500",
                  "[&_[role=slider]]:dark:border-blue-400",
                  "[&_[role=slider]]:shadow-lg",
                  "[&_[role=slider]]:shadow-blue-500/20",
                  "[&_[role=slider]]:dark:shadow-blue-500/10",
                  "[&_[role=slider]]:transition-all",
                  "[&_[role=slider]]:duration-200",
                  "[&_[role=slider]]:hover:scale-110",
                  "[&_[role=slider]]:focus:scale-110",
                  "[&_[role=slider]]:focus:border-purple-500",
                  "[&_[role=slider]]:dark:focus:border-purple-400",
                  "[&_[role=slider]]:after:content-['']",
                  "[&_[role=slider]]:after:absolute",
                  "[&_[role=slider]]:after:inset-0",
                  "[&_[role=slider]]:after:m-auto",
                  "[&_[role=slider]]:after:w-3",
                  "[&_[role=slider]]:after:h-3",
                  "[&_[role=slider]]:after:rounded-full",
                  "[&_[role=slider]]:after:bg-gradient-to-r",
                  "[&_[role=slider]]:after:from-blue-500",
                  "[&_[role=slider]]:after:to-purple-500",
                  "[&_[role=slider]]:after:dark:from-blue-400",
                  "[&_[role=slider]]:after:dark:to-purple-400",
                  "[&_[role=slider]]:after:shadow-inner",
                  "[&_[role=slider]]:overflow-visible",
                  "[&_[role=slider]]:z-20"
                )}
              />
              
              {/* Current intensity scale description */}
              <div className="absolute -bottom-8 left-0 right-0 text-center">
                <span className={cn(
                  "text-xs font-medium px-3 py-1 rounded-full",
                  intensity[0] <= 3 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" :
                  intensity[0] <= 6 ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300" :
                  "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300"
                )}>
                  {intensity[0] <= 2 ? "Very Slight" :
                   intensity[0] <= 4 ? "Mild" :
                   intensity[0] <= 6 ? "Moderate" :
                   intensity[0] <= 8 ? "Strong" : "Extreme"}
                </span>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-4 mb-24 flex-grow">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Add a note about your mood (optional)
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
              placeholder="How are you feeling today? What's on your mind?"
              className="min-h-[120px] resize-none h-full max-h-[200px]"
              />
            </div>

          {/* Save Button - Adjusted position */}
          <div className="absolute bottom-8 left-8 right-8">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-medium py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300" 
              size="lg"
              onClick={handleSaveMood}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
              ) : null}
              Save Mood
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}