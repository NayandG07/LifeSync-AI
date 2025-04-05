import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Droplet, 
  Heart, 
  Activity, 
  Brain, 
  Sparkles, 
  Info,
  LineChart,
  Scale,
  Ruler,
  X,
  Thermometer,
  Flame,
  Moon
} from "lucide-react";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { ResponsiveCard } from "@/components/ui/responsive-card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const DashboardMobile = () => {
  // State hooks - always initialize with defaults to avoid conditionals
  const [userProfile, setUserProfile] = useState<any>(null);
  const [waterIntake, setWaterIntake] = useState({ total: 0, goal: 2000 });
  const [bmi, setBmi] = useState({ value: 0, status: 'Unknown' });
  const [heartRate, setHeartRate] = useState({ value: 72, status: 'Normal' });
  const [bloodPressure, setBloodPressure] = useState({ 
    systolic: 120, 
    diastolic: 80, 
    status: 'Normal' 
  });
  const [steps, setSteps] = useState(8439);
  const [stepsGoal, setStepsGoal] = useState(10000);
  const [mood, setMood] = useState("Neutral");
  const [sleepQuality, setSleepQuality] = useState({ hours: 7.5, quality: "Good" });
  const [bodyTemp, setBodyTemp] = useState({ value: 98.6, unit: "°F" });
  const [bloodGlucose, setBloodGlucose] = useState({ value: 96, unit: "mg/dL" });
  const [calories, setCalories] = useState({ burned: 0, goal: 2000 });
  
  // Modal states
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  
  // Navigation
  const navigate = useNavigate();

  // Handler functions - always using useCallback
  const handleMoodChange = useCallback((newMood: string) => {
    setMood(newMood);
  }, []);

  const handleNavigateToChat = useCallback(() => {
    navigate('/chat-enhanced');
  }, [navigate]);

  const openDetailDialog = useCallback((metricName: string) => {
    setActiveDialog(metricName);
  }, []);

  const closeDetailDialog = useCallback(() => {
    setActiveDialog(null);
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'normal':
      case 'healthy':
      case 'good':
        return "bg-green-500";
      case 'overweight':
      case 'elevated':
      case 'fair':
        return "bg-yellow-500";
      case 'underweight':
      case 'low':
      case 'poor':
        return "bg-blue-500";
      case 'obese':
      case 'high':
      case 'very poor':
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }, []);

  // Define the loadProfile function with useCallback outside of useEffect
  const loadProfile = useCallback(() => {
    const profileData = localStorage.getItem('userProfile');
    if (profileData) {
      try {
        const profile = JSON.parse(profileData);
        setUserProfile(profile);
        
        // Calculate BMI if profile has weight and height
        if (profile.weight && profile.height) {
          const heightInMeters = profile.height;
          const weight = profile.weight;
          if (heightInMeters && weight) {
            const bmiValue = weight / (heightInMeters * heightInMeters);
            
            // Determine BMI status
            let status = 'Unknown';
            if (bmiValue < 18.5) status = 'Underweight';
            else if (bmiValue >= 18.5 && bmiValue < 25) status = 'Healthy';
            else if (bmiValue >= 25 && bmiValue < 30) status = 'Overweight';
            else status = 'Obese';

            setBmi({
              value: parseFloat(bmiValue.toFixed(1)),
              status
            });
          }
        }
      } catch (error) {
        console.error("Error parsing user profile:", error);
      }
    }
  }, []);

  // Load user profile
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Render component - ensure consistent hook calls regardless of condition
  return (
    <div className="py-2">
      <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
        Health Dashboard
      </h1>
      
      {/* Daily Health Score */}
      <ResponsiveCard 
        className="mb-4"
        compact
        centerContent
      >
        <div className="flex flex-col items-center py-2">
          <h2 className="text-lg font-medium mb-1">Daily Health Score</h2>
          <p className="text-xs text-gray-500 mb-3">Today's Progress</p>
          
          <div className="bg-blue-500 text-white w-20 h-20 rounded-full flex items-center justify-center mb-2">
            <span className="text-3xl font-bold">78</span>
          </div>
          <Badge className="bg-green-500 text-white">Improving</Badge>
          
          <Button 
            variant="link" 
            size="sm" 
            className="mt-2 text-blue-600 dark:text-blue-400 flex items-center"
            type="button"
            onClick={() => openDetailDialog('healthScore')}
          >
            <span>Score Breakdown</span>
          </Button>
        </div>
      </ResponsiveCard>
      
      {/* Health Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Heart Rate */}
        <div 
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all"
          onClick={() => openDetailDialog('heartRate')}
        >
          <div className="flex flex-col items-center">
            <Heart className="text-red-500 mb-2 h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold text-lg">{heartRate.value}</div>
              <div className="text-sm text-blue-500">BPM</div>
            </div>
            <div className="mt-1 text-sm text-gray-500">Heart Rate</div>
          </div>
        </div>
        
        {/* Sleep Quality */}
        <div 
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all"
          onClick={() => openDetailDialog('sleep')}
        >
          <div className="flex flex-col items-center">
            <Moon className="text-purple-500 mb-2 h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold text-lg">{sleepQuality.hours}</div>
              <div className="text-sm text-blue-500">hrs</div>
            </div>
            <div className="mt-1 text-sm text-gray-500">Sleep Quality</div>
          </div>
        </div>
        
        {/* Steps */}
        <div 
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all"
          onClick={() => openDetailDialog('steps')}
        >
          <div className="flex flex-col items-center">
            <Activity className="text-green-500 mb-2 h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold text-lg">{steps.toLocaleString()}</div>
              <div className="text-sm text-blue-500">steps</div>
            </div>
            <div className="mt-1 text-sm text-gray-500">Steps</div>
          </div>
        </div>
        
        {/* Body Temperature */}
        <div 
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all"
          onClick={() => openDetailDialog('bodyTemp')}
        >
          <div className="flex flex-col items-center">
            <Thermometer className="text-red-500 mb-2 h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold text-lg">{bodyTemp.value}</div>
              <div className="text-sm text-blue-500">{bodyTemp.unit}</div>
            </div>
            <div className="mt-1 text-sm text-gray-500">Body Temperature</div>
          </div>
        </div>
        
        {/* Calories Burned */}
        <div 
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all"
          onClick={() => openDetailDialog('calories')}
        >
          <div className="flex flex-col items-center">
            <Flame className="text-orange-500 mb-2 h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold text-lg">{calories.burned}</div>
              <div className="text-sm text-blue-500">kcal</div>
            </div>
            <div className="mt-1 text-sm text-gray-500">Calories Burned</div>
          </div>
        </div>
        
        {/* Blood Glucose */}
        <div 
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all"
          onClick={() => openDetailDialog('bloodGlucose')}
        >
          <div className="flex flex-col items-center">
            <Activity className="text-purple-500 mb-2 h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold text-lg">{bloodGlucose.value}</div>
              <div className="text-sm text-blue-500">mg/dL</div>
            </div>
            <div className="mt-1 text-sm text-gray-500">Blood Glucose</div>
          </div>
        </div>
      </div>
      
      {/* Main Metrics - BMI and Blood Pressure */}
      <ResponsiveContainer gridCols={2} gridColsMobile={1} gap="sm" className="mb-4">
        {/* BMI Card */}
        <ResponsiveCard 
          className="h-full cursor-pointer" 
          onClick={() => openDetailDialog('bmi')}
        >
          <div className="flex items-center mb-2">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full mr-2">
              <Scale className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-medium">BMI</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 p-0" type="button">
                    <Info className="h-3.5 w-3.5 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Body Mass Index measures body fat based on height and weight.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-semibold">{bmi.value || "0.0"}</span>
            <Badge className={cn("text-white", getStatusColor(bmi.status || "Unknown"))}>
              {bmi.status || "Unknown"}
            </Badge>
          </div>
          
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-1.5">
            <div className="h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400" style={{ width: "78%" }}></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>&lt;18.5</span>
            <span>18.5-24.9</span>
            <span>25-29.9</span>
            <span>&gt;30</span>
          </div>
        </ResponsiveCard>
        
        {/* Blood Pressure Card */}
        <ResponsiveCard 
          className="h-full cursor-pointer"
          onClick={() => openDetailDialog('bloodPressure')}
        >
          <div className="flex items-center mb-2">
            <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full mr-2">
              <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-medium">Blood Pressure</h3>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-semibold">{bloodPressure.systolic}/{bloodPressure.diastolic}</span>
            <Badge className={cn("text-white", getStatusColor(bloodPressure.status))}>
              {bloodPressure.status}
            </Badge>
          </div>
          
          <div className="text-xs text-gray-500 flex flex-col space-y-1">
            <div className="flex items-center">
              <span className="w-20">Systolic:</span>
              <Progress value={60} className="h-1.5" />
              <span className="ml-1">{bloodPressure.systolic} mmHg</span>
            </div>
            <div className="flex items-center">
              <span className="w-20">Diastolic:</span>
              <Progress value={50} className="h-1.5" />
              <span className="ml-1">{bloodPressure.diastolic} mmHg</span>
            </div>
          </div>
        </ResponsiveCard>
      </ResponsiveContainer>
      
      {/* Water & Steps Tracking */}
      <ResponsiveContainer gridCols={2} gridColsMobile={1} gap="sm" className="mb-4">
        {/* Water Intake */}
        <ResponsiveCard 
          className="h-full cursor-pointer"
          onClick={() => openDetailDialog('waterIntake')}
        >
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full mr-2">
              <Droplet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-medium">Water Intake</h3>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative mb-2 h-24">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-semibold z-10">60%</span>
              </div>
              <svg className="w-24 h-24" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E6E6E6"
                  strokeWidth="2"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeDasharray="60, 100"
                />
              </svg>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium mb-1">{waterIntake.total} ml / {waterIntake.goal} ml</p>
              <Button size="sm" variant="outline" className="text-xs" type="button">
                Add Water
              </Button>
            </div>
          </div>
        </ResponsiveCard>
        
        {/* Steps */}
        <ResponsiveCard 
          className="h-full cursor-pointer"
          onClick={() => openDetailDialog('steps')}
        >
          <div className="flex items-center mb-3">
            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full mr-2">
              <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-medium">Daily Steps</h3>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-full mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{steps.toLocaleString()}</span>
                <span className="text-gray-500">Goal: {stepsGoal.toLocaleString()}</span>
              </div>
              <Progress value={(steps / stepsGoal) * 100} className="h-2" />
            </div>
            
            <div className="text-center mt-2">
              <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">
                {Math.round((steps / stepsGoal) * 100)}% of daily goal
              </p>
              <Badge className="bg-blue-500 text-white">
                {steps > 7500 ? "Active" : steps > 5000 ? "Moderate" : "Low Activity"}
              </Badge>
            </div>
          </div>
        </ResponsiveCard>
      </ResponsiveContainer>
      
      {/* Mood Tracking */}
      <ResponsiveCard className="mb-4">
        <div className="flex items-center mb-3">
          <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded-full mr-2">
            <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-medium">Mood Tracking</h3>
        </div>
        
        <div className="flex flex-row justify-center space-x-3 mb-2">
          {["Happy", "Neutral", "Sad", "Anxious", "Energetic"].map((moodOption) => (
            <button
              key={moodOption}
              onClick={() => handleMoodChange(moodOption)}
              type="button"
              className={cn(
                "p-2 rounded-full transition-all",
                mood === moodOption 
                  ? "bg-indigo-100 dark:bg-indigo-900/30 scale-110 ring-2 ring-indigo-300 dark:ring-indigo-700" 
                  : "hover:bg-indigo-50 dark:hover:bg-indigo-900/10"
              )}
            >
              <Sparkles 
                className={cn(
                  "h-6 w-6", 
                  mood === moodOption 
                    ? "text-indigo-600 dark:text-indigo-400" 
                    : "text-gray-400 dark:text-gray-600"
                )} 
              />
            </button>
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-sm font-medium">{mood}</p>
          <p className="text-xs text-gray-500 mt-1">Your mood affects your overall health score</p>
        </div>
      </ResponsiveCard>
      
      {/* Call to Action */}
      <div className="flex flex-col md:flex-row gap-2 mb-2">
        <Button 
          onClick={handleNavigateToChat}
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <LineChart className="h-4 w-4" />
          <span>Track New Symptom</span>
        </Button>
        
        <Button 
          variant="outline"
          type="button"
          className="w-full border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300"
        >
          View Health Report
        </Button>
      </div>
      
      {/* Detail Dialogs */}
      <Dialog open={activeDialog === 'heartRate'} onOpenChange={(open) => !open && closeDetailDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="text-red-500 h-5 w-5" />
              Heart Rate
            </DialogTitle>
            <DialogDescription>
              Your heart rate is {heartRate.status.toLowerCase()}. 
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex justify-center items-center">
              <div className="bg-red-50 dark:bg-red-500/10 rounded-full w-32 h-32 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 dark:text-red-400">{heartRate.value}</div>
                  <div className="text-sm text-gray-500">BPM</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Analysis</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your heart rate is within the recommended range. A normal resting heart rate for adults is between 60-100 beats per minute.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">AI Recommendation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Maintain your cardiovascular health by exercising regularly. Aim for at least 150 minutes of moderate activity each week.
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <Button type="button" variant="outline" onClick={closeDetailDialog}>
              Close
            </Button>
            <Button type="button">Track New Reading</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={activeDialog === 'sleep'} onOpenChange={(open) => !open && closeDetailDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Moon className="text-purple-500 h-5 w-5" />
              Sleep Quality
            </DialogTitle>
            <DialogDescription>
              Your sleep duration is within the recommended range, but quality could be improved.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex justify-center">
              <div className="bg-purple-50 dark:bg-purple-500/10 rounded-full w-32 h-32 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">{sleepQuality.hours}</div>
                  <div className="text-sm text-gray-500">hours</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Analysis</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your sleep duration is within the recommended range, but quality could be improved.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">AI Recommendation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Try maintaining a consistent sleep schedule and reducing screen time before bed.
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <Button type="button" variant="outline" onClick={closeDetailDialog}>
              Close
            </Button>
            <Button type="button">Track Sleep</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add similar dialogs for other metrics */}
      <Dialog open={activeDialog === 'steps'} onOpenChange={(open) => !open && closeDetailDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="text-green-500 h-5 w-5" />
              Daily Steps
            </DialogTitle>
            <DialogDescription>
              You've completed {Math.round((steps / stepsGoal) * 100)}% of your daily goal.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <Progress value={(steps / stepsGoal) * 100} className="h-2.5" />
            
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Current: {steps.toLocaleString()}</span>
              <span>Goal: {stepsGoal.toLocaleString()}</span>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Analysis</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your activity level is {steps > 7500 ? "good" : steps > 5000 ? "moderate" : "low"}. The WHO recommends at least 7,500 steps daily for better health.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">AI Recommendation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {steps < 7500 
                  ? "Try to increase your daily activity by taking the stairs or walking short distances instead of driving." 
                  : "Great job! Keep up your activity level for optimal health."}
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <Button type="button" variant="outline" onClick={closeDetailDialog}>
              Close
            </Button>
            <Button type="button">Update Steps</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={activeDialog === 'waterIntake'} onOpenChange={(open) => !open && closeDetailDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Droplet className="text-blue-500 h-5 w-5" />
              Water Intake
            </DialogTitle>
            <DialogDescription>
              You've consumed 60% of your daily water goal.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex justify-center">
              <div className="relative h-40 w-40">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E6E6E6"
                    strokeWidth="2"
                    strokeDasharray="100, 100"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray="60, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">60%</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center text-sm mb-2">
              <span className="font-medium">{waterIntake.total} ml</span> of {waterIntake.goal} ml goal
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Analysis</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You're making good progress on your water intake. Staying hydrated helps with energy levels and overall health.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">AI Recommendation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Try to drink water regularly throughout the day rather than large amounts at once for better hydration.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button type="button" variant="outline" onClick={closeDetailDialog}>
                Close
              </Button>
              <Button type="button">Add Water</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add similar dialogs for other metrics */}
    </div>
  );
};

export default DashboardMobile; 