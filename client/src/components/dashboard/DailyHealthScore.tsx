import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  BadgeCheck, 
  Calendar, 
  Heart, 
  Moon, 
  Apple, 
  Lightbulb,
  TrendingUp,
  Clock 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreBreakdown {
  category: string;
  score: number;
  max: number;
  icon: any;
  color: string;
}

interface Recommendation {
  text: string;
  icon: any;
  color: string;
}

export default function DailyHealthScore() {
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [trend, setTrend] = useState<"improving" | "declining" | "stable">("stable");
  
  // Daily score breakdown
  const scoreBreakdown: ScoreBreakdown[] = [
    { 
      category: "Physical Activity", 
      score: 15, 
      max: 25, 
      icon: Activity,
      color: "text-blue-500" 
    },
    { 
      category: "Sleep Quality", 
      score: 12, 
      max: 25, 
      icon: Moon,
      color: "text-purple-500" 
    },
    { 
      category: "Nutrition", 
      score: 18, 
      max: 25, 
      icon: Apple,
      color: "text-green-500" 
    },
    { 
      category: "Mental Wellness", 
      score: 20, 
      max: 25, 
      icon: Lightbulb,
      color: "text-pink-500" 
    }
  ];
  
  // Today's recommendations
  const recommendations: Recommendation[] = [
    {
      text: "Take a 30-minute walk to improve your physical score",
      icon: Activity,
      color: "text-blue-500"
    },
    {
      text: "Try to get 7-8 hours of sleep tonight",
      icon: Moon,
      color: "text-purple-500"
    },
    {
      text: "Drink 500ml more water to meet your daily goal",
      icon: Apple,
      color: "text-green-500"
    }
  ];
  
  // Weekly progress data
  const weeklyProgress = [
    { day: "Mon", score: 60 },
    { day: "Tue", score: 45 },
    { day: "Wed", score: 75 },
    { day: "Thu", score: 48 },
    { day: "Fri", score: 90 },
    { day: "Sat", score: 65 },
    { day: "Sun", score: 45 }
  ];

  useEffect(() => {
    // Simulate loading and calculating score
    const timer = setTimeout(() => {
      setScore(65);
      setTrend("improving");
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Calculate total score from breakdown
  const totalScore = scoreBreakdown.reduce((acc, item) => acc + item.score, 0);
  const maxScore = scoreBreakdown.reduce((acc, item) => acc + item.max, 0);

  if (loading) {
    return (
      <Card className="p-6 h-full animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        <div className="flex gap-8">
          <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="space-y-4 flex-1">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-full">
      <div className="relative overflow-hidden">
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex items-center justify-between p-6 pb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Daily Health Score
              </h3>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0] 
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  repeatDelay: 5 
                }}
              >
                {trend === "improving" ? 
                  <BadgeCheck className="h-5 w-5 text-emerald-500" /> : 
                  trend === "declining" ? 
                  <TrendingUp className="h-5 w-5 text-rose-500 rotate-180" /> : 
                  <BadgeCheck className="h-5 w-5 text-blue-500" />}
              </motion.div>
            </div>
            
            <TabsList className="grid grid-cols-2 h-8">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="p-6 pt-2 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Today's Progress</span>
                </div>
                <div className={cn(
                  "text-sm font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1",
                  trend === "improving" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                  trend === "declining" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" :
                  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                )}>
                  {trend === "improving" ? 
                    <TrendingUp className="h-3.5 w-3.5" /> : 
                    trend === "declining" ? 
                    <TrendingUp className="h-3.5 w-3.5 rotate-180" /> : 
                    <Activity className="h-3.5 w-3.5" />}
                  <span>{trend === "improving" ? "Improving" : trend === "declining" ? "Declining" : "Stable"}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Circular progress */}
              <div className="relative">
                <svg className="w-28 h-28">
                  <circle
                    className="text-gray-200 dark:text-gray-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="56"
                    cy="56"
                  />
                  <motion.circle
                    className={cn(
                      trend === "improving" ? "text-emerald-500" : 
                      trend === "declining" ? "text-rose-500" : 
                      "text-blue-500"
                    )}
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="56"
                    cy="56"
                    initial={{ strokeDasharray: 283, strokeDashoffset: 283 }}
                    animate={{ 
                      strokeDashoffset: 283 - (283 * score / 100)
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    <span className={cn(
                      "text-3xl font-bold",
                      trend === "improving" ? "text-emerald-600 dark:text-emerald-400" : 
                      trend === "declining" ? "text-rose-600 dark:text-rose-400" : 
                      "text-blue-600 dark:text-blue-400"
                    )}>
                      {score}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">out of 100</span>
                  </motion.div>
                </div>
              </div>
              
              {/* Score breakdown */}
              <div className="flex-1 space-y-3">
                {scoreBreakdown.map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <item.icon className={cn("h-4 w-4", item.color)} />
                        <span className="text-sm font-medium">{item.category}</span>
                      </div>
                      <span className="text-sm font-medium">{item.score}/{item.max}</span>
                    </div>
                    <Progress 
                      value={(item.score / item.max) * 100} 
                      className={cn(
                        "h-2",
                        item.color.includes("blue") ? "bg-blue-100 dark:bg-blue-950" : 
                        item.color.includes("purple") ? "bg-purple-100 dark:bg-purple-950" :
                        item.color.includes("green") ? "bg-green-100 dark:bg-green-950" :
                        "bg-pink-100 dark:bg-pink-950"
                      )}
                      indicatorClassName={cn(
                        item.color.includes("blue") ? "bg-blue-500" : 
                        item.color.includes("purple") ? "bg-purple-500" :
                        item.color.includes("green") ? "bg-green-500" :
                        "bg-pink-500"
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Today's Recommendations */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-semibold flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-rose-500" />
                Today's Recommendations
              </h4>
              <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.7 }}
                    className="flex items-center gap-2"
                  >
                    <div className={cn(
                      "p-1.5 rounded-full",
                      rec.color.includes("blue") ? "bg-blue-100 dark:bg-blue-900/30" : 
                      rec.color.includes("purple") ? "bg-purple-100 dark:bg-purple-900/30" :
                      "bg-green-100 dark:bg-green-900/30"
                    )}>
                      <rec.icon className={cn("h-3.5 w-3.5", rec.color)} />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{rec.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="weekly" className="p-6 pt-2">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Weekly Progress</span>
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs">This Week</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <span className="text-xs">Last Week</span>
                </div>
              </div>
            </div>
            
            {/* Weekly progress chart */}
            <div className="flex items-end h-32 gap-1">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="relative flex-1 flex flex-col items-center group">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {day.score}
                  </div>
                  <div className="w-full flex gap-0.5">
                    <motion.div 
                      className={cn(
                        "rounded-t w-full bg-blue-500",
                        day.score >= 75 ? "bg-gradient-to-b from-blue-400 to-blue-600" : 
                        day.score >= 50 ? "bg-gradient-to-b from-purple-400 to-purple-600" : 
                        "bg-gradient-to-b from-gray-400 to-gray-600"
                      )}
                      initial={{ height: 0 }}
                      animate={{ height: `${day.score * 0.32}px` }}
                      transition={{ duration: 0.7, delay: index * 0.05 }}
                    ></motion.div>
                    <motion.div 
                      className="rounded-t w-1 bg-gray-300 dark:bg-gray-600"
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.score - 5) * 0.32}px` }}
                      transition={{ duration: 0.7, delay: index * 0.05 }}
                    ></motion.div>
                  </div>
                  <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">{day.day}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
} 