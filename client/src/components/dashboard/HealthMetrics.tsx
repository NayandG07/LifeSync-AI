import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain, Activity, Heart, Zap, Sparkles, Bot, Thermometer, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { useHealthStore } from "@/lib/healthData";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface HealthInsight {
  metric: string;
  value: string;
  trend: "up" | "down" | "neutral";
  analysis: string;
  recommendation: string;
  progress?: number; // Progress value between 0-100 for the bar
}

export default function HealthMetrics() {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [openMetricModal, setOpenMetricModal] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<HealthInsight | null>(null);

  // Get health data from global store
  const { 
    heartRate, 
    sleepHours, 
    steps, 
    bodyTemperature, 
    caloriesBurned, 
    bloodGlucose,
    isLoading, 
    loadHealthData 
  } = useHealthStore();

  useEffect(() => {
    // Load user profile from localStorage
    const profileData = localStorage.getItem('userProfile');
    if (profileData) {
      setUserProfile(JSON.parse(profileData));
    } else if (auth.currentUser && !localStorage.getItem('profileNotificationShown')) {
      // Only show notification once and mark it as shown
      localStorage.setItem('profileNotificationShown', 'true');
      toast.info(
        "Please update your profile for accurate health metrics",
        {
          duration: 5000,
          action: {
            label: "Update Profile",
            onClick: () => document.getElementById("profile-trigger")?.click()
          }
        }
      );
    }

    // Load health data from the store
    loadHealthData().then(() => {
      setLoading(false);
    });
  }, [loadHealthData]);

  useEffect(() => {
    if (!isLoading) {
      // Calculate progress values
      const heartRateProgress = Math.min(100, Math.max(0, (heartRate - 40) / (100 - 40) * 100));
      const sleepProgress = Math.min(100, Math.max(0, sleepHours / 9 * 100));
      const stepsProgress = Math.min(100, Math.max(0, steps / 10000 * 100));
      const caloriesProgress = Math.min(100, Math.max(0, caloriesBurned / 3000 * 100));
      const tempProgress = Math.min(100, Math.max(0, (bodyTemperature - 97) / (99 - 97) * 100));
      
      setInsights([
        {
          metric: "Heart Rate",
          value: `${heartRate} BPM`,
          trend: heartRate > 80 ? "up" : heartRate < 60 ? "down" : "neutral",
          analysis: "Your heart rate shows a healthy pattern with optimal recovery periods.",
          recommendation: "Consider incorporating more low-intensity activities for better heart rate variability.",
          progress: heartRateProgress
        },
        {
          metric: "Sleep Quality",
          value: `${sleepHours} hrs`,
          trend: sleepHours > 8 ? "up" : sleepHours < 7 ? "down" : "neutral",
          analysis: "Your sleep duration is within the recommended range, but quality could be improved.",
          recommendation: "Try maintaining a consistent sleep schedule and reducing screen time before bed.",
          progress: sleepProgress
        },
        {
          metric: "Steps",
          value: `${steps.toLocaleString()} steps`,
          trend: steps > 8000 ? "up" : steps < 5000 ? "down" : "neutral",
          analysis: "You've maintained an active lifestyle this week with consistent exercise.",
          recommendation: "Great progress! Mix in some strength training to complement your cardio routine.",
          progress: stepsProgress
        },
        {
          metric: "Body Temperature",
          value: `${bodyTemperature}°F`,
          trend: "neutral",
          analysis: "Your body temperature is within the normal range according to WHO guidelines (97°F - 99°F). Regular monitoring helps detect potential health issues early.",
          recommendation: "WHO recommends monitoring temperature during illness or intense physical activity. Stay hydrated and maintain a balanced diet for optimal temperature regulation.",
          progress: tempProgress
        },
        {
          metric: "Calories Burned",
          value: `${caloriesBurned.toLocaleString()} kcal`,
          trend: caloriesBurned > 2000 ? "up" : caloriesBurned < 1500 ? "down" : "neutral",
          analysis: "You're consistently meeting your daily caloric expenditure goals through a mix of activities.",
          recommendation: "Consider adding strength training to boost your basal metabolic rate.",
          progress: caloriesProgress
        },
        {
          metric: "Blood Glucose",
          value: `${bloodGlucose} mg/dL`,
          trend: "neutral",
          analysis: "Your blood glucose levels are within the normal range (70-140 mg/dL). Maintaining stable blood sugar is crucial for overall health.",
          recommendation: "Continue monitoring your levels and maintain a balanced diet with regular meal times.",
          progress: 70  // 70% of normal range
        }
      ]);
    }
  }, [heartRate, sleepHours, steps, bodyTemperature, caloriesBurned, bloodGlucose, isLoading]);

  const handleMetricClick = (metric: string) => {
    const insight = insights.find(i => i.metric === metric);
    if (insight) {
      setCurrentInsight(insight);
    setSelectedMetric(metric);
      setOpenMetricModal(true);
    }
  };

  if (loading || isLoading) {
    return (
      <Card className="p-6 space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse">
              <div className="h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6 transition-all duration-300 relative overflow-hidden backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] bg-white/80 dark:bg-gray-800/80 h-full flex flex-col">
        {/* Glassmorphism background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-pink-100/30 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.2),transparent_50%)]" />
        
        {/* Animated grain texture */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] animate-[grain_8s_steps(10)_infinite]" />
        </div>
        
        {/* Header with title */}
        <div className="relative flex items-center justify-between z-10 mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Health Metrics
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 dark:bg-blue-900/50 border border-blue-200/50 dark:border-blue-800/50">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Updated</span>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
        
        <div className="relative z-10 flex-grow flex flex-col">
          {/* Health Overview Section - Top card */}
          <div className="mb-6 p-5 bg-white/70 dark:bg-gray-800/60 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400">
                Health Overview
                <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
              </h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-800/50">
            <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Powered</span>
          </div>
        </div>

            {/* Overview summary */}
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <p>
                Your health metrics are within recommended ranges. Click on each metric card below 
                for detailed insights and recommendations tailored to your profile.
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-blue-600 dark:text-blue-400">
                <Bot className="w-4 h-4" />
                <p>All metrics are updated in real-time based on your latest activity data.</p>
              </div>
            </div>
          </div>

          {/* Health Metrics Grid - Directly in main content */}
          <div className="grid grid-cols-2 gap-4 mb-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.metric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleMetricClick(insight.metric)}
                className="group cursor-pointer rounded-xl p-4 relative 
                          bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900
                          backdrop-blur-sm shadow-md hover:shadow-lg
                          border border-gray-200/50 dark:border-gray-700/50 
                          hover:border-blue-500/50 dark:hover:border-blue-400/50 
                          transition-all duration-300"
              >
                {/* Default View */}
                <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                      <div className={cn(
                        "p-2 rounded-lg shadow-md",
                        insight.metric === "Heart Rate" ? "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40" :
                        insight.metric === "Sleep Quality" ? "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40" :
                        insight.metric === "Steps" ? "bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40" :
                        insight.metric === "Body Temperature" ? "bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40" :
                        insight.metric === "Calories Burned" ? "bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40" :
                        "bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40"
                      )}>
                      {insight.metric === "Heart Rate" ? <Heart className="w-5 h-5 text-red-600 dark:text-red-400" /> :
                       insight.metric === "Sleep Quality" ? <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" /> :
                       insight.metric === "Steps" ? <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> :
                        insight.metric === "Body Temperature" ? <Thermometer className="w-5 h-5 text-orange-600 dark:text-orange-400" /> :
                        insight.metric === "Calories Burned" ? <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400" /> :
                       insight.metric === "Blood Glucose" ? <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> :
                       <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{insight.metric}</h3>
                  </div>
                    <div className="flex flex-col items-end">
                  <span className={cn(
                        "text-base font-bold",
                    insight.trend === "up" ? "text-emerald-600 dark:text-emerald-400" :
                    insight.trend === "down" ? "text-rose-600 dark:text-rose-400" :
                    "text-blue-600 dark:text-blue-400"
                  )}>
                        {insight.value.split(' ')[0]}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {insight.value.split(' ')[1] || ''}
                  </span>
                    </div>
                </div>

                  {/* Progress bar with animated fill and limited decimals */}
                  <div className="mt-auto">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex justify-between">
                      <span>Progress</span>
                      <span>{insight.progress ? insight.progress.toFixed(2) : 0}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${insight.progress || 0}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                    className={cn(
                          "h-full rounded-full shadow-lg",
                          insight.trend === "up" ? "bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-300" :
                          insight.trend === "down" ? "bg-gradient-to-r from-rose-400 to-rose-600 dark:from-rose-500 dark:to-rose-300" :
                          "bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-300"
                    )}
                  />
                </div>

                    {/* View details button/hint */}
                    <div className="text-xs text-center text-blue-600 dark:text-blue-400 opacity-70 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1">
                      <span>View details</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                        </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </Card>

      {/* Metric Detail Modal */}
      <Dialog open={openMetricModal} onOpenChange={setOpenMetricModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentInsight?.metric === "Heart Rate" ? <Heart className="w-5 h-5 text-red-600 dark:text-red-400" /> :
              currentInsight?.metric === "Sleep Quality" ? <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" /> :
              currentInsight?.metric === "Steps" ? <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> :
              currentInsight?.metric === "Body Temperature" ? <Thermometer className="w-5 h-5 text-red-600 dark:text-red-400" /> :
              currentInsight?.metric === "Calories Burned" ? <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" /> :
              currentInsight?.metric === "Blood Glucose" ? <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> :
              <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
              {currentInsight?.metric}
            </DialogTitle>
            <DialogDescription>
              Current value: <span className="font-medium">{currentInsight?.value}</span>
            </DialogDescription>
          </DialogHeader>
          
          {currentInsight && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Analysis</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentInsight.analysis}
                  </p>
              </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Recommendation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentInsight.recommendation}
                    </p>
                  </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Progress</h4>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        currentInsight.trend === "up" ? "bg-emerald-500 dark:bg-emerald-400" :
                        currentInsight.trend === "down" ? "bg-rose-500 dark:bg-rose-400" :
                        "bg-blue-500 dark:bg-blue-400"
                      )}
                      style={{ width: `${currentInsight.progress || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setOpenMetricModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}