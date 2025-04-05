import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { 
  Heart, 
  Activity, 
  Brain,
  Dumbbell,
  Thermometer,
  Pill,
  Droplet,
  Sparkles,
  Scale,
  Footprints
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import WaterIntakeModal from './WaterIntakeModal';
import MedicationsModal from './MedicationsModal';
import { UserProfile } from '../profile/ProfileRegistration';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  auth, 
  getUserProfile, 
  saveHealthMetrics, 
  updateWaterIntake, 
  updateMedications,
  waterIntakeCollection,
  medicationsCollection 
} from '@/lib/firebase';
import { onSnapshot, doc } from 'firebase/firestore';

interface HealthMetric {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  color: string;
  description: string;
}

interface Medication {
  id: number;
  name: string;
  frequency: string;
  lastTaken?: string;
}

interface MedicationState {
  date: string;
  taken: Medication[];
  scheduled: Medication[];
}

const ExtendedHealthMetrics = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [showMedModal, setShowMedModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [waterIntake, setWaterIntake] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return { date: today, intake: 0, logs: [] };
  });
  const [medications, setMedications] = useState<MedicationState>(() => {
    const today = new Date().toISOString().split('T')[0];
    return { date: today, taken: [], scheduled: [] };
  });

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Load user profile
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setUserProfile(profile as UserProfile);
        }

        // Subscribe to water intake updates
        const unsubscribeWater = onSnapshot(
          doc(waterIntakeCollection, user.uid),
          (doc) => {
            if (doc.exists()) {
              setWaterIntake(doc.data());
            }
          }
        );

        // Subscribe to medications updates
        const unsubscribeMeds = onSnapshot(
          doc(medicationsCollection, user.uid),
          (doc) => {
            if (doc.exists()) {
              setMedications(doc.data());
            }
          }
        );

        return () => {
          unsubscribeWater();
          unsubscribeMeds();
        };
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setLoading(true);
      
      try {
        const metricsData = [
          {
            icon: Heart,
            label: "Heart Rate",
            value: "72 bpm",
            change: "+2 from last week",
            trend: "up",
            color: "rose",
            description: getHeartRateDescription(72)
          },
          {
            icon: Scale,
            label: "Blood Pressure",
            value: "120/80",
            change: "Optimal range",
            trend: "neutral",
            color: "emerald",
            description: getBloodPressureDescription(120, 80)
          },
          {
            icon: Footprints,
            label: "Steps",
            value: "8,500",
            change: "+1,500 today",
            trend: "up",
            color: "blue",
            description: getStepsDescription(8500)
          },
          {
            icon: Activity,
            label: "Calories Burned",
            value: "850 kcal",
            change: "+150 from goal",
            trend: "up",
            color: "orange",
            description: getCaloriesDescription(850)
          },
          {
            icon: Brain,
            label: "Blood Glucose",
            value: "95 mg/dL",
            change: "Fasting",
            trend: "neutral",
            color: "purple",
            description: getGlucoseStatus(95, 0)
          },
          {
            icon: Scale,
            label: "BMI",
            value: calculateBMI()?.value || "N/A",
            change: calculateBMI()?.category?.label || "Update profile",
            trend: "neutral",
            color: "indigo",
            description: getBMIDescription(calculateBMI()?.category?.label || '')
          }
        ];

        await saveHealthMetrics(user.uid, metricsData);
        setMetrics(metricsData);
      } catch (error) {
        console.error('Error loading health metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userProfile]);

  const handleWaterIntakeUpdate = async (newIntake: number, log: any) => {
    const user = auth.currentUser;
    if (!user) return;

    const updatedIntake = {
      ...waterIntake,
      intake: waterIntake.intake + newIntake,
      logs: [...waterIntake.logs, log]
    };

    await updateWaterIntake(user.uid, updatedIntake);
  };

  const handleMedicationUpdate = async (med: Medication, taken: boolean) => {
    const user = auth.currentUser;
    if (!user) return;

    let updatedMedications;
    if (taken) {
      updatedMedications = {
        ...medications,
        taken: [...medications.taken, med],
        scheduled: medications.scheduled.map(m => 
          m.id === med.id ? { ...m, lastTaken: new Date().toISOString() } : m
        )
      };
    } else {
      updatedMedications = {
        ...medications,
        scheduled: [...medications.scheduled, { ...med, id: Date.now() }]
      };
    }

    await updateMedications(user.uid, updatedMedications);
  };

  const calculateBMI = () => {
    if (!userProfile?.height || !userProfile?.weight) return null;
    const bmi = userProfile.weight / (userProfile.height * userProfile.height);
    return {
      value: bmi.toFixed(1),
      category: getBMICategory(bmi)
    };
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-yellow-600' };
    if (bmi < 25) return { label: 'Normal weight', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-orange-600' };
    return { label: 'Obese', color: 'text-red-600' };
  };

  const getBMIDescription = (category: string) => {
    switch (category) {
      case 'Underweight':
        return 'BMI less than 18.5 indicates you may be underweight. Consider consulting a healthcare provider.';
      case 'Normal weight':
        return 'BMI between 18.5 and 24.9 indicates a healthy weight range.';
      case 'Overweight':
        return 'BMI between 25 and 29.9 suggests excess weight. Consider lifestyle adjustments for better health.';
      case 'Obese':
        return 'BMI of 30 or higher indicates obesity. Please consult a healthcare provider for guidance.';
      default:
        return '';
    }
  };

  const getStepsDescription = (steps: number) => {
    if (steps >= 10000) return `Excellent! You've reached the WHO recommended daily step goal.`;
    if (steps >= 7500) return `Very good progress! Getting close to the recommended 10,000 daily steps.`;
    if (steps >= 5000) return `Good start! Try to increase your steps to reach the recommended 10,000 daily steps.`;
    return `Consider taking more walks to reach the WHO recommended 10,000 daily steps.`;
  };

  const getHeartRateDescription = (bpm: number) => {
    if (bpm < 60) return `Your heart rate is below normal range. Consider consulting a healthcare provider.`;
    if (bpm <= 100) return `Your heart rate is within the normal resting range (60-100 BPM).`;
    return `Your heart rate is above normal range. Consider consulting a healthcare provider.`;
  };

  const getBloodPressureDescription = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return `Optimal blood pressure range according to WHO guidelines.`;
    if (systolic < 130 && diastolic < 85) return `Normal blood pressure, but monitor regularly.`;
    if (systolic < 140 && diastolic < 90) return `High-normal range. Consider lifestyle adjustments.`;
    return `Blood pressure is elevated. Please consult a healthcare provider.`;
  };

  const getCaloriesDescription = (calories: number) => {
    if (calories >= 1000) return `Excellent! You've reached your daily active calorie burn goal.`;
    if (calories >= 750) return `Great progress towards your daily calorie burn goal!`;
    if (calories >= 500) return `Good progress! Keep moving to reach your daily goal.`;
    return `Try to increase your physical activity to burn more calories.`;
  };

  const getGlucoseStatus = (fasting: number, postPrandial: number) => {
    if (fasting >= 100 || postPrandial >= 140) return 'High Range';
    if (fasting < 70 || postPrandial < 70) return 'Low Range';
    return 'Normal Range';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse">
              <div className="h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <motion.h2 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Health Overview
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
          </motion.h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowWaterModal(true)}
              className="relative overflow-hidden group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <motion.div
                className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <Droplet className="w-4 h-4" />
              Log Water Intake
            </Button>
            <Button
              onClick={() => setShowMedModal(true)}
              className="relative overflow-hidden group flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <motion.div
                className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <Pill className="w-4 h-4" />
              Manage Medications
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300",
                  `before:absolute before:inset-0 before:bg-gradient-to-br before:from-${metric.color}-500/10 before:to-${metric.color}-500/5 before:opacity-0 before:transition-opacity`,
                  `hover:before:opacity-100 dark:before:from-${metric.color}-400/20 dark:before:to-${metric.color}-400/10`
                )}
              >
                {/* 3D Card Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 rounded-xl transform group-hover:scale-105 transition-transform duration-300"></div>
                
                {/* Floating Orb */}
                <div className={`absolute -top-4 -right-4 w-24 h-24 bg-${metric.color}-500/20 rounded-full blur-xl transform group-hover:scale-150 transition-transform duration-500`}></div>
                
                {/* Hover Description */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 rounded-xl p-4">
                  <p className="text-white text-center text-sm">{metric.description}</p>
                </div>
                
                <div className="relative">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/30`}>
                      <Icon className={`w-6 h-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                    </div>
                    <h3 className="text-lg font-medium">{metric.label}</h3>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-2xl font-semibold">{metric.value}</p>
                    <p className={`text-sm ${
                      metric.trend === "up" ? "text-emerald-600 dark:text-emerald-400" :
                      metric.trend === "down" ? "text-rose-600 dark:text-rose-400" :
                      "text-gray-600 dark:text-gray-400"
                    }`}>
                      {metric.change}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modals */}
        <WaterIntakeModal
          isOpen={showWaterModal}
          onClose={() => setShowWaterModal(false)}
          onUpdate={handleWaterIntakeUpdate}
          currentIntake={waterIntake.intake}
          intakeLogs={waterIntake.logs}
          userWeight={userProfile?.weight}
        />
        
        <MedicationsModal
          isOpen={showMedModal}
          onClose={() => setShowMedModal(false)}
          onUpdate={handleMedicationUpdate}
          medications={medications}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ExtendedHealthMetrics; 