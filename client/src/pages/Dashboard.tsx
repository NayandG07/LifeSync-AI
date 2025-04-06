import { motion } from "framer-motion";
import { 
  Droplet, 
  Heart, 
  Activity, 
  Brain, 
  Sparkles, 
  Bot, 
  LineChart, 
  Zap, 
  Lightbulb, 
  Stethoscope, 
  Scale, 
  Ruler, 
  Beaker,
  Clock,
  Info,
  Plus,
  History,
  Badge,
  Pill,
  Check,
  CheckCheck,
  Pencil,
  Trash2,
  Bell,
  Calendar,
  AlertCircle,
  InfoIcon,
  ArrowRight,
  BarChart,
  CalendarClock,
  Utensils,
  Pizza,
  Dumbbell,
  BatteryCharging,
  Flame,
  Target,
  CalendarCheck,
  RotateCcw,
  ClipboardList,
  BellRing,
  FileBarChart,
  BellOff,
  FileText,
  Tag,
  Palette,
  Image,
  PlusCircle,
  FrownIcon,
  MehIcon,
  SmileIcon,
  BrainCircuit,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MedicationsModal from '@/components/medications/MedicationsModal';
import WaterIntakeModal from '@/components/water/WaterIntakeModal';
import { useState, useEffect, useCallback } from "react";
import { collection, query, where, orderBy, getDocs, Firestore, Timestamp, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { Auth } from "firebase/auth";
import { auth as firebaseAuth } from "@/lib/firebase";
import { db as firebaseDb } from "@/lib/firebase";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
// Import mobile dashboard
import DashboardMobile from "./DashboardMobile";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from 'uuid';

const auth = firebaseAuth as Auth;
const db = firebaseDb as Firestore;

// Add WHO guidelines data
const WHO_GUIDELINES = {
  heartRate: {
    title: "Heart Rate (WHO Guidelines)",
    normal: "60-100 BPM",
    description: "The World Health Organization recommends a normal resting heart rate of 60 to 100 beats per minute for adults.",
    ranges: [
      { label: "Too Low", range: "< 60 BPM", status: "Concern" },
      { label: "Normal", range: "60-100 BPM", status: "Healthy" },
      { label: "Elevated", range: "> 100 BPM", status: "Concern" }
    ]
  },
  bloodPressure: {
    title: "Blood Pressure (WHO Guidelines)",
    normal: "< 120/80 mmHg",
    description: "Blood pressure categories defined by systolic and diastolic measurements.",
    ranges: [
      { label: "Normal", range: "< 120/80 mmHg", status: "Optimal" },
      { label: "Elevated", range: "120-129/< 80 mmHg", status: "Monitor" },
      { label: "Stage 1", range: "130-139/80-89 mmHg", status: "High" },
      { label: "Stage 2", range: "≥ 140/≥ 90 mmHg", status: "Severe" }
    ]
  },
  bmi: {
    title: "BMI (WHO Guidelines)",
    normal: "18.5-24.9",
    description: "Body Mass Index categories for adults.",
    ranges: [
      { label: "Underweight", range: "< 18.5", status: "Below Normal" },
      { label: "Normal", range: "18.5-24.9", status: "Healthy" },
      { label: "Overweight", range: "25-29.9", status: "Above Normal" },
      { label: "Obese", range: "≥ 30", status: "High Risk" }
    ]
  },
  bloodSugar: {
    title: "Blood Sugar (WHO Guidelines)",
    description: "Blood glucose levels for diabetes diagnosis.",
    fasting: {
      normal: "70-100 mg/dL",
      ranges: [
        { label: "Normal", range: "70-100 mg/dL", status: "Healthy" },
        { label: "Prediabetes", range: "100-125 mg/dL", status: "Monitor" },
        { label: "Diabetes", range: "≥ 126 mg/dL", status: "High Risk" }
      ]
    },
    postPrandial: {
      normal: "< 140 mg/dL",
      ranges: [
        { label: "Normal", range: "< 140 mg/dL", status: "Healthy" },
        { label: "Prediabetes", range: "140-199 mg/dL", status: "Monitor" },
        { label: "Diabetes", range: "≥ 200 mg/dL", status: "High Risk" }
      ]
    }
  },
  steps: {
    title: "Daily Steps (WHO Guidelines)",
    normal: "8,000-10,000 steps",
    description: "The World Health Organization recommends daily physical activity through walking for better health.",
    ranges: [
      { label: "Sedentary", range: "< 5,000 steps", status: "Below Target" },
      { label: "Low Active", range: "5,000-7,499 steps", status: "Needs Improvement" },
      { label: "Somewhat Active", range: "7,500-9,999 steps", status: "Good" },
      { label: "Active", range: "≥ 10,000 steps", status: "Excellent" }
    ]
  },
  caloriesBurned: {
    title: "Calories Burned (WHO Guidelines)",
    normal: "2,000-2,500 kcal/day",
    description: "Daily caloric expenditure recommendations based on physical activity level.",
    ranges: [
      { label: "Light Activity", range: "1,500-2,000 kcal", status: "Minimal" },
      { label: "Moderate Activity", range: "2,000-2,500 kcal", status: "Target" },
      { label: "High Activity", range: "2,500-3,000 kcal", status: "Advanced" },
      { label: "Very High Activity", range: "> 3,000 kcal", status: "Athletic" }
    ]
  }
};

interface WaterLog {
  id: string;
  amount: number;
  timestamp: Timestamp;
  userId: string;
}

interface WaterIntake {
  total: number;
  logs: WaterLog[];
}

// Add Medication interfaces
interface Medication {
  id: string;
  name: string;
  dosage: string;
  unit: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  timeOfIntake: string;
  reminderType?: string;
  notes?: string;
  status: 'pending' | 'taken';
  lastTaken?: string;
  userId: string;
  doseRemaining: number;
  totalDoses: number;
  createdAt: Timestamp;
}

// Add Reminder interface after the Medication interface
interface Reminder {
  id: string;
  title: string;
  description?: string;
  time: string;
  day?: string;
  date?: string;
  isActive: boolean;
  type: 'medication' | 'report' | 'custom';
  medicationId?: string;
  color: 'yellow' | 'purple' | 'blue' | 'green' | 'red';
  icon: 'pill' | 'chart' | 'calendar' | 'bell' | 'drop' | 'heart';
  createdAt: Timestamp;
  userId: string;
}

// Restore a fixed version of safelyOpenModal function
const safelyOpenModal = (modalSetter: React.Dispatch<React.SetStateAction<boolean>>, value = true) => {
  try {
    modalSetter(value);
  } catch (error) {
    console.error("Error updating modal state:", error);
    // Avoid reload as it can be disruptive, just log the error
    toast.error("Something went wrong. Please try again.");
  }
};

// Add a performance helper for Firebase operations
const withErrorHandling = async (operation: () => Promise<any>, errorMessage: string, showToast = true) => {
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

// At the top of the file, add these helper functions
function safeFirebaseOperation(operation: () => Promise<any>, errorMsg: string): Promise<any> {
  return new Promise((resolve) => {
    Promise.race([
      operation(),
      new Promise(r => setTimeout(() => r("timeout"), 5000)) // 5 second timeout
    ])
    .then(result => {
      if (result === "timeout") {
        console.error(`Operation timed out: ${errorMsg}`);
        toast.error(`${errorMsg} - operation timed out`);
        resolve(null);
      } else {
        resolve(result);
      }
    })
    .catch(error => {
      console.error(`${errorMsg}:`, error);
      toast.error(errorMsg);
      resolve(null);
    });
  });
}

export default function Dashboard() {
  const [showMedicationsModal, setShowMedicationsModal] = useState<boolean>(false);
  const [showMedicationsHistory, setShowMedicationsHistory] = useState<boolean>(false);
  const [showWaterIntakeModal, setShowWaterIntakeModal] = useState<boolean>(false);
  const [showWaterIntakeHistory, setShowWaterIntakeHistory] = useState<boolean>(false);
  const [waterIntake, setWaterIntake] = useState<WaterIntake>({ total: 0, logs: [] });
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [showEditMedicationModal, setShowEditMedicationModal] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [bmi, setBmi] = useState({ value: 0, status: '' });
  const [steps, setSteps] = useState(8439);
  const [stepsGoal, setStepsGoal] = useState(10000);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [caloriesGoal, setCaloriesGoal] = useState(2000);
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [debouncedWidth, setDebouncedWidth] = useState(windowWidth);
  
  // Add state for reminders
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  const [showReminderModal, setShowReminderModal] = useState<boolean>(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Add state variable for initial load tracking - MUST be defined before any functions use it
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Define global error handling without any dependencies
  const showErrorToast = (message: string) => {
    // Only show toasts after initial load is complete
    if (initialLoadComplete) {
      toast.error(message);
    } else {
      console.error(message);
    }
  };

  // Calculate BMI based on weight and height
  const calculateBMI = useCallback((weight: number, height: number) => {
    if (!weight || !height) return { value: 0, status: 'Unknown' };
    
    // Height should be in meters for BMI calculation
    const heightInMeters = height;
    const bmiValue = weight / (heightInMeters * heightInMeters);
    
    // Determine BMI status
    let status = '';
    if (bmiValue < 18.5) status = 'Underweight';
    else if (bmiValue >= 18.5 && bmiValue < 25) status = 'Healthy';
    else if (bmiValue >= 25 && bmiValue < 30) status = 'Overweight';
    else status = 'Obese';

    setBmi({
      value: parseFloat(bmiValue.toFixed(1)),
      status
    });
    
    return { value: parseFloat(bmiValue.toFixed(1)), status };
  }, []);

  // Calculate steps goal based on weight (WHO guidelines)
  const calculateStepsGoal = useCallback((weight: number) => {
    // WHO recommends more steps for higher weight individuals
    // Base goal is 10,000 steps, adjusted by weight
    const baseGoal = 10000;
    if (weight > 90) return 12000;      // Higher weight needs more activity
    if (weight > 70) return 11000;      // Moderate adjustment
    return baseGoal;                     // Standard recommendation
  }, []);

  // Calculate calories burned based on steps and weight
  const calculateCaloriesBurned = useCallback((steps: number, weight: number) => {
    // Average stride length is 0.762 meters
    const distanceKm = (steps * 0.762) / 1000;
    // MET value for walking is approximately 3.5
    const met = 3.5;
    // Calories burned = MET × Weight (kg) × Time (hours)
    // Assuming average walking speed of 5 km/h
    const timeHours = distanceKm / 5;
    return Math.round(met * weight * timeHours * 3.5);
  }, []);

  // Calculate calories goal based on steps goal and weight
  const calculateCaloriesGoal = useCallback((stepsGoal: number, weight: number) => {
    return calculateCaloriesBurned(stepsGoal, weight);
  }, [calculateCaloriesBurned]);

  // Handle water intake update
  const handleWaterIntakeUpdate = useCallback(async (amount: number) => {
    console.log("Adding water intake:", amount);
    
    if (!auth.currentUser) {
      toast.error("Please log in to save your water intake");
      return;
    }
    
    const userId = auth.currentUser.uid;
    const newLog = {
      userId: userId,
      amount: amount,
      timestamp: Timestamp.now()
    };
    
    try {
      // Save to Firebase
      const docRef = await addDoc(collection(db, 'waterLogs'), newLog);
      
      // Update local state with the Firebase ID
      setWaterIntake(prev => ({
        ...prev,
        total: prev.total + amount,
        logs: [...prev.logs, {
          id: docRef.id,
          ...newLog
        }]
      }));
      
      toast.success(`${amount}ml of water logged successfully`);
    } catch (error) {
      console.error("Error saving water intake:", error);
      toast.error("Failed to save water intake. Please try again.");
    }
    
    setShowWaterIntakeModal(false);
  }, []);
  
  // Handle water history view
  const handleViewWaterHistory = useCallback(() => {
    setShowWaterIntakeHistory(true);
    toast.info("Opening water intake history...");
  }, []);
  
  // Load user profile without showing toast on initial load
  const loadUserProfile = useCallback(() => {
    const profileData = localStorage.getItem('userProfile');
    if (profileData) {
      const profile = JSON.parse(profileData);
      setUserProfile(profile);
      
      // Calculate BMI if weight and height are available
      if (profile.weight && profile.height) {
        calculateBMI(profile.weight, profile.height);
        
        // Update steps goal based on weight
        const newStepsGoal = calculateStepsGoal(profile.weight);
        setStepsGoal(newStepsGoal);
        
        // Update calories burned and goal based on current steps and weight
        const burned = calculateCaloriesBurned(steps, profile.weight);
        const caloriesGoal = calculateCaloriesGoal(newStepsGoal, profile.weight);
        setCaloriesBurned(burned);
        setCaloriesGoal(caloriesGoal);
      }
    } else {
      // No toast notification on initial load
      console.log("No user profile found in localStorage");
    }
  }, [calculateBMI, calculateStepsGoal, calculateCaloriesBurned, calculateCaloriesGoal, steps, navigate]);
  
  // Handle resize with useCallback to prevent recreation on each render
  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);
  
  // Add a resize listener to update window width state
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
  
  // Use a debounced version of windowWidth to avoid rapid rerenders
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedWidth(windowWidth);
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [windowWidth]);
  
  // Load medications function - no initialLoadComplete dependency
  const loadMedications = useCallback(async () => {
    console.log("Loading medications...");
    
    if (!auth.currentUser) return;
    
    const userId = auth.currentUser.uid;
    console.log("Fetching medications for user:", userId);
    
    try {
      // Create a reference to the medications collection
      const medicationsRef = collection(db, 'medications');
      
      // Simplify query to avoid requiring index
      const q = query(
        medicationsRef,
        where("userId", "==", userId)
      );
      
      console.log("Executing medications query...");
      const querySnapshot = await getDocs(q);
      
      const medications: Medication[] = [];
      
      querySnapshot.forEach((doc) => {
        medications.push({
          id: doc.id,
          ...doc.data()
        } as Medication);
      });
      
      // Sort medications manually after fetching
      medications.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
      
      setMedications(medications);
    } catch (error) {
      console.error("Error loading medications:", error);
      // Use the function that checks initialLoadComplete internally
      showErrorToast("Failed to load medications");
    }
  }, []); // No initialLoadComplete dependency
  
  // Load today's water logs - no initialLoadComplete dependency
  const loadTodayWaterLogs = useCallback(async () => {
    console.log("Loading today's water logs...");
    
    if (!auth.currentUser) return;
    
    const userId = auth.currentUser.uid;
    console.log("Fetching water logs for user:", userId);
    
    try {
      // Create a reference to the waterLogs collection
      const waterLogsRef = collection(db, 'waterLogs');
      
      // Simplify query to avoid requiring index
      const q = query(
        waterLogsRef,
        where("userId", "==", userId)
      );
      
      console.log("Executing water logs query...");
      const querySnapshot = await getDocs(q);
      
      let totalIntake = 0;
      const logs: WaterLog[] = [];
      
      querySnapshot.forEach((doc) => {
        const log = {
          id: doc.id,
          ...doc.data()
        } as WaterLog;
        
        // Only include today's logs
        const logDate = log.timestamp.toDate().toDateString();
        const today = new Date().toDateString();
        
        if (logDate === today) {
          totalIntake += log.amount;
          logs.push(log);
        }
      });
      
      // Sort logs manually after fetching
      logs.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
      
      setWaterIntake({
        total: totalIntake,
        logs
      });
    } catch (error) {
      console.error("Error loading water logs:", error);
      // Use the function that checks initialLoadComplete internally
      showErrorToast("Failed to load water intake data");
    }
  }, []); // No initialLoadComplete dependency
  
  // Define loadReminders without useEffect
  const loadReminders = async () => {
    try {
      if (!auth.currentUser) return;
      
      const remindersRef = collection(db, "reminders");
      const q = query(
        remindersRef,
        where("userId", "==", auth.currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const loadedReminders: Reminder[] = [];
      
      querySnapshot.forEach((doc) => {
        loadedReminders.push({
          id: doc.id,
          ...doc.data()
        } as Reminder);
      });
      
      // Sort reminders manually
      loadedReminders.sort((a, b) => 
        b.createdAt && a.createdAt 
          ? b.createdAt.seconds - a.createdAt.seconds 
          : 0
      );
      
      console.log("Loaded reminders:", loadedReminders);
      setReminders(loadedReminders);
    } catch (error) {
      console.error("Failed to load reminders:", error);
      // Don't show toast notification on initial load
      showErrorToast("Failed to load reminders");
    }
  };

  // One useEffect to rule them all - load everything once
  useEffect(() => {
    // Call the loading functions
    loadUserProfile();
    loadTodayWaterLogs();
    loadMedications();
    loadReminders();
    
    // Set up interval for fetching water intake
    const intervalId = setInterval(() => {
      loadTodayWaterLogs();
    }, 60000); // Every minute instead of every second
    
    // Mark initial load as complete AFTER loading data
    setTimeout(() => {
      setInitialLoadComplete(true);
      console.log("Initial load complete");
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array = run once on mount

  // Add a reminder to Firestore - properly defined as a separate function
  const addReminder = async (reminderData: Omit<Reminder, 'id' | 'userId' | 'createdAt'>) => {
    if (!auth.currentUser) {
      toast.error("Please log in to add a reminder");
      return null;
    }
    
    try {
      const newReminder = {
        ...reminderData,
        userId: auth.currentUser.uid,
        createdAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, "reminders"), newReminder);
      
      const createdReminder: Reminder = {
        id: docRef.id,
        ...newReminder,
        userId: auth.currentUser.uid,
        createdAt: Timestamp.now()
      };
      
      setReminders(prev => [...prev, createdReminder]);
      console.log("Reminder added:", createdReminder);
      
      // Show success toast - fix object structure
      toast.success("Reminder Added");
      
      return createdReminder;
    } catch (error) {
      console.error("Error adding reminder:", error);
      
      // Fix toast error call
      toast.error("Failed to Add Reminder");
      return null;
    }
  };

  // Update a reminder in the Firestore
  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    if (!auth.currentUser) {
      toast.error("Please log in to update reminders");
      return false;
    }
    
    try {
      const reminderRef = doc(db, 'reminders', id);
      await updateDoc(reminderRef, updates);
      
      setReminders(prev => 
        prev.map(reminder => {
          if (reminder.id === id) {
            return { ...reminder, ...updates };
          }
          return reminder;
        })
      );
      
      toast.success(`Reminder updated successfully`);
      return true;
    } catch (error) {
      console.error("Error updating reminder:", error);
      toast.error("Failed to update reminder. Please try again.");
      return false;
    }
  };

  // Delete a reminder from the Firestore
  const deleteReminder = async (id: string) => {
    if (!auth.currentUser) {
      toast.error("Please log in to delete reminders");
      return false;
    }
    
    try {
      await deleteDoc(doc(db, 'reminders', id));
      
      setReminders(prev => prev.filter(reminder => reminder.id !== id));
      toast.success("Reminder deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder. Please try again.");
      return false;
    }
  };

  // Snooze a reminder (update its time)
  const snoozeReminder = async (id: string) => {
    // Get the current reminder
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) {
      toast.error("Reminder not found");
      return false;
    }
    
    // Calculate new time (1 hour later)
    const oldTime = reminder.time;
    let [hours, minutes] = oldTime.split(':');
    let period = "AM";
    
    if (oldTime.includes("AM")) {
      period = "AM";
      hours = hours.replace("AM", "").trim();
    } else if (oldTime.includes("PM")) {
      period = "PM";
      hours = hours.replace("PM", "").trim();
    }
    
    let hoursNum = parseInt(hours);
    hoursNum = (hoursNum + 1) % 12;
    if (hoursNum === 0) hoursNum = 12;
    
    // If rolled past 11, switch AM/PM
    if (hours === "11") {
      period = period === "AM" ? "PM" : "AM";
    }
    
    const newTime = `${hoursNum}:${minutes} ${period}`;
    
    try {
      await updateReminder(id, { time: newTime });
      toast.success(`Reminder snoozed until ${newTime}`);
      return true;
    } catch (error) {
      console.error("Error snoozing reminder:", error);
      toast.error("Failed to snooze reminder. Please try again.");
      return false;
    }
  };

  // Toggle the reminder enabled state
  const toggleReminderEnabled = useCallback(() => {
    setReminderEnabled(prev => !prev);
    toast.success(reminderEnabled ? "Reminders disabled" : "Reminders enabled");
  }, [reminderEnabled]);

  // Handler for editing a reminder
  const handleEditReminder = (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      setSelectedReminder(reminder);
      setIsEditing(true);
      setShowReminderModal(true);
    }
  };

  // Handler for adding a new reminder
  const handleAddReminder = () => {
    setSelectedReminder(null);
    setIsEditing(false);
    setShowReminderModal(true);
  };

  // Handle saving reminder (add or update)
  const handleSaveReminder = async (reminderData: Omit<Reminder, 'id' | 'userId' | 'createdAt'> | Reminder) => {
    try {
      if (isEditing && selectedReminder) {
        // Update existing reminder
        const { id, userId, createdAt, ...updates } = reminderData as Reminder;
        await updateReminder(selectedReminder.id, updates);
      } else {
        // Add new reminder
        await addReminder(reminderData as Omit<Reminder, 'id' | 'userId' | 'createdAt'>);
      }
      
      setShowReminderModal(false);
      setSelectedReminder(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving reminder:", error);
      toast.error("Failed to save reminder");
    }
  };

  // Add these functions before the return statement and after the reminder functions

  // Handle medication add
  const handleMedicationAdd = useCallback(async (medication: Partial<Medication>) => {
    console.log("Adding medication:", medication);
    
    if (!auth.currentUser) {
      toast.error("Please log in to save your medication");
      return;
    }
    
    try {
      // Create a medication object without optional fields that might be undefined
      const baseObject = {
        name: medication.name || '',
        dosage: parseInt(medication.dosage || '0').toString(), // Convert to integer
        unit: medication.unit || 'mg',
        frequency: medication.frequency || 'Once daily',
        startDate: medication.startDate || new Date().toISOString().split('T')[0],
        timeOfIntake: medication.timeOfIntake || '8:00 AM',
        status: 'pending',
        userId: auth.currentUser.uid,
        doseRemaining: 30, // Default value
        totalDoses: 30, // Default value
        createdAt: Timestamp.now()
      };
      
      // Add optional fields only if they have values (to avoid undefined)
      const newMedication: Record<string, any> = { ...baseObject };
      
      // Only add endDate if it exists and isn't empty
      if (medication.endDate && medication.endDate.trim() !== '') {
        newMedication.endDate = medication.endDate;
      }
      
      // Only add notes if it exists and isn't empty
      if (medication.notes && medication.notes.trim() !== '') {
        newMedication.notes = medication.notes;
      }
      
      // For reminderType, either set to null or omit
      if (medication.reminderType) {
        newMedication.reminderType = medication.reminderType;
      } else {
        newMedication.reminderType = null; // Firebase accepts null but not undefined
      }
      
      console.log("Saving medication to Firebase:", newMedication);
      
      // Save to Firebase
      const docRef = await addDoc(collection(db, 'medications'), newMedication);
      
      // Update local state with the Firebase ID
      const savedMedication: Medication = {
        id: docRef.id,
        ...newMedication
      } as Medication;
      
      // Update medications state and close modal
      setMedications(prev => [savedMedication, ...prev]);
      setShowMedicationsModal(false);
      
      // Show success toast
      toast.success(`${savedMedication.name} added to your medications`);
    } catch (error) {
      console.error("Error saving medication:", error, medication);
      
      // More detailed error message
      if (error instanceof Error) {
        toast.error(`Failed to save medication: ${error.message}`);
      } else {
        toast.error("Failed to save medication. Please try again.");
      }
    }
  }, []);

  // Handle medication edit
  const handleMedicationEdit = useCallback((medicationId: string) => {
    console.log("Editing medication:", medicationId);
    
    // Find the medication to edit
    const medicationToEdit = medications.find(med => med.id === medicationId);
    
    if (medicationToEdit) {
      // Set the selected medication for editing
      setSelectedMedication(medicationToEdit);
      
      // Open the edit modal
      setShowEditMedicationModal(true);
    } else {
      toast.error(`Medication not found`);
    }
  }, [medications]);

  // Handle saving edited medication
  const handleSaveEditedMedication = useCallback(async (updatedMedication: Medication) => {
    if (!auth.currentUser) {
      toast.error("Please log in to update your medication");
      return;
    }
    
    try {
      // Get a reference to the document
      const medicationRef = doc(db, 'medications', updatedMedication.id);
      
      // Remove the id field as it's part of the document reference
      const { id, ...medicationData } = updatedMedication;
      
      // Update in Firebase
      await updateDoc(medicationRef, medicationData);
      
      // Update the medication in the local state
      setMedications(prev => 
        prev.map(med => 
          med.id === updatedMedication.id ? updatedMedication : med
        )
      );
      
      // Show success toast
      toast.success(`${updatedMedication.name} updated successfully`);
    } catch (error) {
      console.error("Error updating medication:", error);
      toast.error("Failed to update medication. Please try again.");
    }
    
    // Close the edit modal
    setShowEditMedicationModal(false);
    
    // Clear the selected medication
    setSelectedMedication(null);
  }, []);

  // Handle medication delete
  const handleMedicationDelete = useCallback(async (medicationId: string) => {
    if (!auth.currentUser) {
      toast.error("Please log in to delete your medication");
      return;
    }
    
    try {
      // Delete from Firebase
      const medicationRef = doc(db, 'medications', medicationId);
      await deleteDoc(medicationRef);
      
      // Remove from local state
      setMedications(prev => prev.filter(med => med.id !== medicationId));
      
      // Show success toast
      toast.success(`Medication deleted successfully`);
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast.error("Failed to delete medication. Please try again.");
    }
  }, []);

  // Handle marking medication as taken
  const handleMarkMedicationAsTaken = useCallback(async (medicationId: string) => {
    if (!auth.currentUser) {
      toast.error("Please log in to update your medication");
      return;
    }
    
    try {
      const now = new Date();
      const timeFormat = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Get a reference to the document
      const medicationRef = doc(db, 'medications', medicationId);
      
      // Find the current medication
      const medication = medications.find(med => med.id === medicationId);
      
      if (!medication) {
        toast.error("Medication not found");
        return;
      }
      
      // Update data for Firebase
      const updateData = {
        status: 'taken' as const,
        lastTaken: timeFormat,
        doseRemaining: medication.doseRemaining - 1
      };
      
      // Update in Firebase
      await updateDoc(medicationRef, updateData);
      
      // Update the medication in the local state
      setMedications(prev => 
        prev.map(med => {
          if (med.id === medicationId) {
            return {
              ...med,
              ...updateData
            };
          }
          return med;
        })
      );
      
      // Show success toast
      toast.success(`Medication marked as taken`);
    } catch (error) {
      console.error("Error updating medication status:", error);
      toast.error("Failed to mark medication as taken. Please try again.");
    }
  }, [medications]);

  // Handle medication history view
  const handleViewMedicationHistory = useCallback(() => {
    setShowMedicationsHistory(true);
    toast.info("Opening medication history...");
  }, []);

  return (
    <TooltipProvider>
    <div className="container mx-auto px-4 py-8">
        {/* Render debug buttons */}
        {/* {debugButtons} */}
        
        {/* Enhanced Title Section with lighter colors */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 rounded-2xl p-8 mb-8 shadow-xl border border-blue-200 dark:border-blue-800"
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.8),transparent_50%)]"></div>
          
          <div className="relative flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="p-3 bg-blue-500/10 dark:bg-white/10 rounded-xl backdrop-blur-sm">
                <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                Health Dashboard
                <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
        </h1>
              <p className="text-blue-700 dark:text-blue-300 text-lg">Your AI-Powered Health Companion</p>
            </div>
            <div className="absolute right-0 top-0 bottom-0 flex items-center">
              <LineChart className="w-24 h-24 text-blue-500/20 animate-pulse" />
            </div>
          </div>

          {/* AI Feature Badges */}
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
              <Brain className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">AI Analysis Active</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
              <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Smart Insights</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
              <Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Health Monitoring</span>
            </div>
          </div>

          {/* AI Health Tips */}
          <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Zap className="w-5 h-5" />
              <span className="font-medium">AI Health Tip:</span>
              <span className="text-sm">Regular exercise and proper hydration can improve your daily health score!</span>
            </div>
          </div>

          {/* Animated particles with adjusted colors */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-400/20 dark:bg-blue-400/40 rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${2 + Math.random() * 3}s infinite linear`
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Enhanced Health Score Section with more features */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 relative overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Score */}
            <div className="relative">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Daily Health Score</h3>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  Today's Progress
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400">
                    Improving
                  </span>
                </p>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-32 h-32 rounded-xl flex items-center justify-center text-4xl font-bold relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer"></div>
                <div className="text-center">
                  <span className="block">48</span>
                  <span className="text-sm font-normal opacity-90">out of 100</span>
                </div>
              </motion.div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Score Breakdown
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Physical Activity</span>
                    <span className="text-blue-600 dark:text-blue-400">15/25</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Sleep Quality</span>
                    <span className="text-purple-600 dark:text-purple-400">12/25</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '48%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Nutrition</span>
                    <span className="text-green-600 dark:text-green-400">18/25</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Mental Wellness</span>
                    <span className="text-pink-600 dark:text-pink-400">20/25</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-full bg-pink-500 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Today's Recommendations
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
                  <Activity className="w-4 h-4 text-blue-500 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">Take a 20-minute walk to improve your physical score</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-purple-100 dark:border-purple-800/30">
                  <Clock className="w-4 h-4 text-purple-500 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">Try to get 7-8 hours of sleep tonight</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-green-100 dark:border-green-800/30">
                  <Droplet className="w-4 h-4 text-green-500 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">Drink 500ml more water to meet your daily goal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Weekly Progress</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>This Week</span>
                <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full ml-2"></span>
                <span>Last Week</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{day}</div>
                  <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg relative">
                    <div 
                      className="absolute bottom-0 w-full bg-blue-500 rounded-b-lg transition-all"
                      style={{ 
                        height: `${[60, 45, 75, 48, 80, 65, 45][i]}%`,
                        opacity: i <= 3 ? 1 : 0.5 
                      }}
                    ></div>
                    <div 
                      className="absolute bottom-0 w-full bg-gray-300 dark:bg-gray-600 rounded-b-lg -z-10"
                      style={{ height: `${[50, 55, 65, 45, 70, 60, 50][i]}%` }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
                    {[60, 45, 75, 48, 80, 65, 45][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Metric Cards with AI Analysis and WHO Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Heart Rate Card with WHO Guidelines */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 relative overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* WHO Guidelines Overlay */}
            <div className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col justify-between pointer-events-none z-10">
              <div>
                <h5 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">WHO Heart Rate Guidelines</h5>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Maintaining a healthy heart rate is crucial for cardiovascular health:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      </span>
                      <span>Normal resting heart rate: 60-100 BPM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      </span>
                      <span>Athletes may have lower rates: 40-60 BPM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      </span>
                      <span>Monitor changes during exercise and rest</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-3 mt-4 border border-red-100 dark:border-red-800/50 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  <span className="font-medium">Health Tip:</span> Regular cardiovascular exercise can help maintain a healthy resting heart rate.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Heart Rate
              </h4>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800/50">
                <Brain className="w-3 h-3" />
                Live Monitoring
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-red-500 mb-1">72 BPM</p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600 dark:text-gray-400">Status: Normal</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-green-100 dark:border-green-800/30 text-green-800 dark:text-green-400">
                    WHO Recommended
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>0</span>
                  <span>60</span>
                  <span>100</span>
                  <span>140</span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 flex">
                    <div className="bg-red-200/50 dark:bg-red-900/30 flex-1" style={{ width: '42.8%' }}></div>
                    <div className="bg-green-200/50 dark:bg-green-900/30 flex-1" style={{ width: '28.6%' }}></div>
                    <div className="bg-red-200/50 dark:bg-red-900/30 flex-1" style={{ width: '28.6%' }}></div>
                  </div>
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-300"
                    style={{ width: '51.4%' }}
                  >
                    <div className="w-3 h-3 bg-white rounded-full absolute right-0 top-1/2 transform -translate-y-1/2"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-red-500">Too Low</span>
                  <span className="text-green-500">Normal Range</span>
                  <span className="text-red-500">Too High</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">WHO Range: 60-100 BPM</span>
                  <span className="text-red-600 dark:text-red-400">Peak: 125 BPM</span>
                </div>
              </div>

              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-xs text-red-600 dark:text-red-400">
                  <span className="font-medium">AI Analysis:</span> Your heart rate has been consistently within WHO recommended range.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Blood Pressure Card with WHO Guidelines */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 relative overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                Blood Pressure
              </h4>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50">
                <Brain className="w-3 h-3" />
                AI Monitored
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-indigo-500 mb-1">115/75</p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600 dark:text-gray-400">Status: Optimal</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-green-100 dark:border-green-800/30 text-green-800 dark:text-green-400">
                    WHO Optimal
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Systolic</div>
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '55%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>90</span>
                      <span>120</span>
                      <span>140+</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Diastolic</div>
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>60</span>
                      <span>80</span>
                      <span>90+</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Optimal: Under 120/80</span>
                  <span className="text-indigo-600 dark:text-indigo-400">Last: 118/78</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* BMI Card with WHO Guidelines */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden group hover:shadow-2xl transform-gpu transition-all duration-300 hover:scale-[1.02] cursor-pointer border-[3px] border-violet-200 dark:border-violet-800/50 hover:shadow-violet-100/50 dark:hover:shadow-violet-900/30"
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-violet-500/10 rounded-full blur-xl transform group-hover:scale-150 transition-all duration-500"></div>
            
            {/* WHO Guidelines Overlay */}
            <div className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col justify-between pointer-events-none z-10">
              <div>
                <h5 className="text-lg font-semibold text-violet-600 dark:text-violet-400 mb-2">WHO BMI Guidelines</h5>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Maintaining a healthy BMI is crucial for overall health:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                      </span>
                      <span>Normal BMI: 18.5-24.9</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                      </span>
                      <span>Overweight: 25-29.9</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                      </span>
                      <span>Obesity: ≥30</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-3 mt-4">
                <p className="text-sm text-violet-600 dark:text-violet-400">
                  <span className="font-medium">Health Tip:</span> Incorporating regular physical activity and a balanced diet can help maintain a healthy BMI.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Scale className="w-5 h-5 text-violet-500" />
                BMI
              </h4>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-xs font-medium text-violet-700 dark:text-violet-300">
                <Brain className="w-3 h-3" />
                AI Calculated
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-violet-500 mb-1">{bmi.value.toFixed(1)}</p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600 dark:text-gray-400">Status: {bmi.status}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    bmi.status === 'Healthy' ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400' :
                    bmi.status === 'Underweight' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400' :
                    bmi.status === 'Overweight' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400' :
                    'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400'
                  }`}>
                    {bmi.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>&lt;18.5</span>
                  <span>18.5-24.9</span>
                  <span>25-29.9</span>
                  <span>&gt;30</span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 flex">
                    <div className="bg-blue-200/50 dark:bg-blue-900/30" style={{ width: '20%' }}></div>
                    <div className="bg-green-200/50 dark:bg-green-900/30" style={{ width: '30%' }}></div>
                    <div className="bg-yellow-200/50 dark:bg-yellow-900/30" style={{ width: '25%' }}></div>
                    <div className="bg-red-200/50 dark:bg-red-900/30" style={{ width: '25%' }}></div>
                  </div>
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: '47%' }}
                  >
                    <div className="w-3 h-3 bg-white rounded-full absolute right-0 top-1/2 transform -translate-y-1/2 shadow-lg"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-blue-500">Underweight</span>
                  <span className="text-green-500">Healthy</span>
                  <span className="text-yellow-500">Overweight</span>
                  <span className="text-red-500">Obese</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/20">
                  <p className="text-xs text-violet-600 dark:text-violet-400">Height</p>
                  <p className="font-semibold text-violet-700 dark:text-violet-300">
                    {userProfile?.height.toFixed(2)} m
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/20">
                  <p className="text-xs text-violet-600 dark:text-violet-400">Weight</p>
                  <p className="font-semibold text-violet-700 dark:text-violet-300">
                    {userProfile?.weight} kg
                  </p>
                </div>
              </div>

              <div className="p-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                <p className="text-xs text-violet-600 dark:text-violet-400">
                  <span className="font-medium">AI Analysis:</span> {
                    bmi.status === 'Healthy' ? 'Your BMI indicates a healthy weight range.' :
                    bmi.status === 'Underweight' ? 'Consider consulting a nutritionist for healthy weight gain.' :
                    bmi.status === 'Overweight' ? 'Focus on balanced diet and regular exercise.' :
                    'Consider consulting a healthcare provider for weight management.'
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Steps Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden group hover:shadow-2xl transform-gpu transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 border-green-100 dark:border-green-900/30"
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 rounded-full blur-xl transform group-hover:scale-150 transition-all duration-500"></div>
            
            {/* WHO Guidelines Overlay */}
            <div className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col justify-between pointer-events-none z-10">
              <div>
                <h5 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">WHO Steps Guidelines</h5>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    The World Health Organization recommends:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      </span>
                      <span>Aim for 10,000 steps daily for optimal health benefits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      </span>
                      <span>Break long sitting periods with short walks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      </span>
                      <span>Incorporate walking meetings and active commuting</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 mt-4">
                <p className="text-sm text-green-600 dark:text-green-400">
                  <span className="font-medium">Quick Tip:</span> Walking 10 minutes every hour can help you reach your daily goal while improving focus and energy levels.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                Steps
              </h4>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-xs font-medium text-green-700 dark:text-green-300">
                <Brain className="w-3 h-3" />
                AI Tracked
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-green-500 mb-1">{steps.toLocaleString()}</p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600 dark:text-gray-400">Daily Goal: {stepsGoal.toLocaleString()}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400">
                    {steps >= stepsGoal ? 'Achieved' : 'On Track'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((steps / stepsGoal) * 100, 100)}%` }}
                  >
                    <div className="w-3 h-3 bg-white rounded-full absolute right-0 top-1/2 transform -translate-y-1/2 shadow-lg"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>0</span>
                  <span>{Math.round(stepsGoal / 2).toLocaleString()}</span>
                  <span>{stepsGoal.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-xs text-green-600 dark:text-green-400">
                  <span className="font-medium">AI Analysis:</span> Based on your weight of {userProfile?.weight}kg, your daily step goal is {stepsGoal.toLocaleString()} steps.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Calories Burned Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden group hover:shadow-2xl transform-gpu transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 border-orange-100 dark:border-orange-900/30"
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 rounded-full blur-xl transform group-hover:scale-150 transition-all duration-500"></div>
            
            {/* WHO Guidelines Overlay */}
            <div className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col justify-between pointer-events-none z-10">
              <div>
                <h5 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">WHO Calories Burned Guidelines</h5>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Maintaining a healthy calorie burn is crucial for overall health:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                      </span>
                      <span>Aim for 2,000 kcal daily for optimal health benefits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                      </span>
                      <span>Break long sedentary periods with short bursts of activity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                      </span>
                      <span>Incorporate active commuting and household chores</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 mt-4">
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  <span className="font-medium">Health Tip:</span> Regular physical activity can help maintain a healthy calorie burn.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                Calories Burned
              </h4>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-xs font-medium text-orange-700 dark:text-orange-300">
                <Brain className="w-3 h-3" />
                AI Tracked
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-orange-500 mb-1">{caloriesBurned.toLocaleString()}</p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600 dark:text-gray-400">Daily Goal: {caloriesGoal.toLocaleString()}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-800/30 dark:text-orange-400">
                    In Progress
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full transition-all duration-300"
                    style={{ width: '62.4%' }}
                  >
                    <div className="w-3 h-3 bg-white rounded-full absolute right-0 top-1/2 transform -translate-y-1/2 shadow-lg"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>0</span>
                  <span>1,000</span>
                  <span>2,000</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <p className="text-xs text-orange-600 dark:text-orange-400">Last Hour</p>
                  <p className="font-semibold text-orange-700 dark:text-orange-300">156 cal</p>
                </div>
                <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <p className="text-xs text-orange-600 dark:text-orange-400">Active Time</p>
                  <p className="font-semibold text-orange-700 dark:text-orange-300">3h 45m</p>
                </div>
              </div>

              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  <span className="font-medium">AI Analysis:</span> You're burning calories 15% faster than your hourly average.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Blood Glucose Card with WHO Guidelines */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden group hover:shadow-2xl transform-gpu transition-all duration-300 hover:scale-[1.02] cursor-pointer col-span-3 border-2 border-amber-100 dark:border-amber-900/30"
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl transform group-hover:scale-150 transition-all duration-500"></div>
            
            {/* WHO Guidelines Overlay */}
            <div className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col justify-between pointer-events-none z-10">
              <div>
                <h5 className="text-lg font-semibold text-amber-600 dark:text-amber-400 mb-2">WHO Blood Glucose Guidelines</h5>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Maintaining healthy blood glucose levels is crucial for overall health:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      </span>
                      <span>Normal fasting blood glucose: 70-100 mg/dL</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      </span>
                      <span>Normal post-prandial (2h after meal): &lt;140 mg/dL</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      </span>
                      <span>Monitor changes and maintain a healthy lifestyle</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 mt-4">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  <span className="font-medium">Health Tip:</span> Regular physical activity and a balanced diet can help maintain healthy blood glucose levels.
                </p>
              </div>
        </div>

            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Beaker className="w-5 h-5 text-amber-500" />
                Blood Glucose Levels
              </h4>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-xs font-medium text-amber-700 dark:text-amber-300">
                <Brain className="w-3 h-3" />
                AI Monitored
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-3xl font-bold text-amber-500">95 mg/dL</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Fasting Blood Glucose</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span className="text-xs text-gray-500">Last checked: 8h ago</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>70</span>
                    <span>100</span>
                    <span>125</span>
                    <span>126+</span>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 flex">
                      <div className="bg-green-200/50 dark:bg-green-900/30" style={{ width: '40%' }}></div>
                      <div className="bg-yellow-200/50 dark:bg-yellow-900/30" style={{ width: '30%' }}></div>
                      <div className="bg-red-200/50 dark:bg-red-900/30" style={{ width: '30%' }}></div>
                    </div>
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300"
                      style={{ width: '38%' }}
                    >
                      <div className="w-3 h-3 bg-white rounded-full absolute right-0 top-1/2 transform -translate-y-1/2 shadow-lg"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-green-500">Normal</span>
                    <span className="text-yellow-500">Prediabetes</span>
                    <span className="text-red-500">Diabetes</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-3xl font-bold text-amber-500">135 mg/dL</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Post-Prandial (PP)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span className="text-xs text-gray-500">Last checked: 2h ago</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>&lt;140</span>
                    <span>140-199</span>
                    <span>&gt;200</span>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 flex">
                      <div className="bg-green-200/50 dark:bg-green-900/30" style={{ width: '40%' }}></div>
                      <div className="bg-yellow-200/50 dark:bg-yellow-900/30" style={{ width: '30%' }}></div>
                      <div className="bg-red-200/50 dark:bg-red-900/30" style={{ width: '30%' }}></div>
                    </div>
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300"
                      style={{ width: '38%' }}
                    >
                      <div className="w-3 h-3 bg-white rounded-full absolute right-0 top-1/2 transform -translate-y-1/2 shadow-lg"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-green-500">Normal</span>
                    <span className="text-yellow-500">Prediabetes</span>
                    <span className="text-red-500">Diabetes</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg mt-4">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  <span className="font-medium">AI Analysis:</span> Your fasting blood glucose (95 mg/dL) and post-prandial levels (135 mg/dL) are within normal range.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ delay: 0.4 }}
            className="bg-white/95 dark:bg-gray-800/95 rounded-xl p-6 relative overflow-hidden flex flex-col h-full justify-between border border-purple-100/70 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-all duration-300 group/main"
          >
            {/* Background gradient for entire medication card */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/15 opacity-70 group-hover/main:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl transform scale-100 group-hover/main:scale-150 transition-all duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Medications
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track and manage your medications</p>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 bg-white/60 dark:bg-gray-800/60">
                  <Brain className="w-3 h-3" />
                  Smart Reminders
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl border border-purple-200/70 dark:border-purple-800/50 transition-all duration-300 hover:shadow-md group/card relative overflow-hidden bg-white/80 dark:bg-gray-800/80">
                  {/* Background gradient always visible, more opaque on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/15 opacity-70 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <p className="font-medium text-purple-700 dark:text-purple-300">Medication Status</p>
                    <div className="border border-purple-200 dark:border-purple-700 px-2 py-1 rounded-full text-xs flex items-center text-purple-700 dark:text-purple-300 bg-white/70 dark:bg-gray-800/70">
                      <Clock className="w-3 h-3 mr-1" />
                      Today
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {medications.filter(med => med.status === 'pending').length === 0 ? (
                      <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm border border-purple-200/70 dark:border-purple-900/30 flex items-center justify-between relative overflow-hidden group transition-all duration-300 hover:shadow-md">
                        {/* Hover animation elements - light gradient always visible */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 to-indigo-500/20 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl transform scale-100 group-hover:scale-150 transition-all duration-300"></div>
                        
                        {/* Content */}
                        <p className="text-gray-700 dark:text-gray-300 relative z-10">No medications recorded for today</p>
                        <Pill className="w-5 h-5 text-purple-500 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                    ) : (
                      // Get the next upcoming medication based on time of intake
                      (() => {
                        const now = new Date();
                        const currentTime = now.getHours() * 60 + now.getMinutes();
                        const today = now.toISOString().split('T')[0];
                        
                        // First try to find medications scheduled for today
                        const todayMeds = medications.filter(med => 
                          med.status === 'pending' && 
                          (med.startDate <= today && (!med.endDate || med.endDate >= today))
                        );
                        
                        if (todayMeds.length > 0) {
                          // Convert medication times to minutes since midnight for comparison
                          const medsWithTime = todayMeds.map(med => {
                            const [hours, minutes] = med.timeOfIntake.split(':').map(Number);
                            const timeInMinutes = hours * 60 + minutes;
                            return { ...med, timeInMinutes };
                          });
                          
                          // Find the next medication (closest time that's still in the future)
                          const futureMeds = medsWithTime.filter(med => med.timeInMinutes > currentTime)
                            .sort((a, b) => a.timeInMinutes - b.timeInMinutes);
                            
                          // If there are future meds today, show the next one
                          if (futureMeds.length > 0) {
                            const nextMed = futureMeds[0];
                            return (
                              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 border-l-purple-500 border border-purple-100 dark:border-purple-900/30">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{nextMed.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-gray-500 dark:text-gray-400">{nextMed.dosage} {nextMed.unit}</span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">·</span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">{nextMed.timeOfIntake}</span>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    className="bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900/70 dark:text-purple-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkMedicationAsTaken(nextMed.id);
                                    }}
                                  >
                                    <Check className="w-4 h-4 mr-1" />
                                    Take
                                  </Button>
                                </div>
                              </div>
                            );
                          }
                          
                          // If no future meds today, show the first one for today (might be overdue)
                          const firstTodayMed = medsWithTime.sort((a, b) => a.timeInMinutes - b.timeInMinutes)[0];
                          return (
                            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 border-l-amber-500 border border-purple-100 dark:border-purple-900/30">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">{firstTodayMed.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{firstTodayMed.dosage} {firstTodayMed.unit}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">·</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{firstTodayMed.timeOfIntake}</span>
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                      Overdue
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900/70 dark:text-purple-300"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkMedicationAsTaken(firstTodayMed.id);
                                  }}
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Take
                                </Button>
                              </div>
                            </div>
                          );
                        }
                        
                        // If no meds for today, show the next scheduled one from future dates
                        const futureDateMeds = medications.filter(med => 
                          med.status === 'pending' && med.startDate > today
                        ).sort((a, b) => a.startDate.localeCompare(b.startDate));
                        
                        if (futureDateMeds.length > 0) {
                          const nextMed = futureDateMeds[0];
                          return (
                            <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm border border-purple-200/70 dark:border-purple-900/30 relative overflow-hidden group/future transition-all duration-300 hover:shadow-md">
                              {/* Gradient effect */}
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 to-indigo-500/20 opacity-70 group-hover/future:opacity-100 transition-opacity duration-300"></div>
                              <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl transform scale-100 group-hover/future:scale-150 transition-all duration-300"></div>
                              
                              <div className="flex items-center justify-between relative z-10">
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">{nextMed.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{nextMed.dosage} {nextMed.unit}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">·</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Starts {new Date(nextMed.startDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <Pill className="w-5 h-5 text-purple-500 transition-transform duration-300 group-hover/future:scale-110" />
                              </div>
                            </div>
                          );
                        }
                        
                        // Fallback (should never happen if we have medications and this code runs)
                        return (
                          <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm border border-purple-200/70 dark:border-purple-900/30 flex items-center justify-between relative overflow-hidden group/fallback transition-all duration-300 hover:shadow-md">
                            {/* Gradient effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 to-indigo-500/20 opacity-70 group-hover/fallback:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl transform scale-100 group-hover/fallback:scale-150 transition-all duration-300"></div>
                            
                            <p className="text-gray-700 dark:text-gray-300 relative z-10">No pending medications found</p>
                            <Pill className="w-5 h-5 text-purple-500 relative z-10 transition-transform duration-300 group-hover/fallback:scale-110" />
                          </div>
                        );
                      })()
                    )}
                  </div>
              </div>

                <div className="flex items-center gap-2 p-3 bg-indigo-50/70 dark:bg-indigo-900/20 rounded-lg text-sm text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800 relative overflow-hidden group/ai transition-all duration-300 hover:shadow-md">
                  {/* Hover animation for AI section - light gradient always visible */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 to-purple-500/20 opacity-70 group-hover/ai:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-indigo-500/20 rounded-full blur-xl transform scale-100 group-hover/ai:scale-150 transition-all duration-300"></div>
                  
                  {/* Content */}
                  <Activity className="w-4 h-4 text-indigo-500 relative z-10 transition-transform duration-300 group-hover/ai:scale-110" />
                  <span className="relative z-10">AI will help track your medication schedule and send reminders</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-auto relative z-10">
              <Button 
                variant="default" 
                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 transform hover:-translate-y-1 relative overflow-hidden group"
                onClick={(e) => {
                  e.stopPropagation();
                  safelyOpenModal(setShowMedicationsModal);
                }}
              >
                <div className="absolute inset-0 bg-white/15 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Plus className="w-4 h-4 mr-2 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                <span className="relative z-10">Add Medication</span>
              </Button>
              <Button
                variant="outline"
                className="bg-white/80 dark:bg-gray-800/80 border-purple-200/70 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 active:scale-95 transform hover:-translate-y-1 hover:shadow-md relative overflow-hidden group"
                onClick={(e) => {
                  e.stopPropagation();
                  safelyOpenModal(setShowMedicationsHistory);
                }}
              >
                <div className="absolute inset-0 bg-purple-500/10 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                <History className="w-4 h-4 mr-2 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                <span className="relative z-10">Medication Tracker</span>
              </Button>
            </div>
          </motion.div>

          {/* WATER INTAKE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden group hover:shadow-2xl transform-gpu transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col h-full justify-between border-[3px] border-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-700/50 dark:to-cyan-700/50 hover:shadow-blue-100/50 dark:hover:shadow-blue-900/30"
          >
            <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 opacity-20 rounded-2xl blur-[2px] group-hover:opacity-30"></div>
            <div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl transform group-hover:scale-150 transition-opacity"></div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-500" />
                  Water Intake
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your daily hydration</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-medium text-blue-700 dark:text-blue-300">
                  <Brain className="w-3 h-3" />
                AI Monitoring
              </div>
            </div>

            <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800 shadow-inner">
              <div className="flex items-center justify-between">
                <div>
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{waterIntake.total} ml</p>
                      <p className="text-sm text-blue-500 dark:text-blue-400">of 2000 ml goal</p>
                </div>
                    <div className="w-20 h-20 relative">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      className="text-gray-200 dark:text-gray-700"
                          strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                          r="30"
                          cx="40"
                          cy="40"
                    />
                    <circle
                          className="text-blue-500 dark:text-blue-400"
                          strokeWidth="6"
                          strokeDasharray={188.5}
                          strokeDashoffset={188.5 * (1 - waterIntake.total / 2000)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                          r="30"
                          cx="40"
                          cy="40"
                    />
                  </svg>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <Droplet className="w-6 h-6 text-blue-500 mx-auto" />
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{Math.round((waterIntake.total / 2000) * 100)}%</span>
                      </div>
                </div>
              </div>

                  <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-800">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-blue-500 dark:text-blue-400">Morning</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{waterIntake.total > 0 ? Math.round(waterIntake.total * 0.3) : 0} ml</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-500 dark:text-blue-400">Afternoon</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{waterIntake.total > 0 ? Math.round(waterIntake.total * 0.4) : 0} ml</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-500 dark:text-blue-400">Evening</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{waterIntake.total > 0 ? Math.round(waterIntake.total * 0.3) : 0} ml</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center gap-2">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-full">
                    <Droplet className="w-4 h-4 text-blue-500" />
                  </div>
                <p className="text-sm text-blue-600 dark:text-blue-400">AI Recommendation: Drink water every 2 hours</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-auto relative z-10">
              <Button 
                variant="default" 
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 transform hover:-translate-y-1"
                onClick={(e) => {
                  e.stopPropagation();
                  safelyOpenModal(setShowWaterIntakeModal);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Log Intake
              </Button>
              <Button
                variant="outline"
                className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 active:scale-95 transform hover:-translate-y-1 hover:shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  safelyOpenModal(setShowWaterIntakeHistory);
                }}
              >
                <History className="w-4 h-4 mr-2" />
                View History
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Medications Modal with comprehensive form */}
        <Dialog open={showMedicationsModal} onOpenChange={setShowMedicationsModal}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto shadow-xl dark:shadow-purple-900/20 bg-white dark:bg-gray-800/95 backdrop-blur border border-purple-100 dark:border-purple-900">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
                  <Pill className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                Add Medication
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300">
                Track your medication schedule and reminders
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-4 p-5 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-100 dark:border-purple-800/50 shadow-sm">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5" />
                    Medication Details
                  </h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    
                    // Get start and end dates for validation
                    const startDate = formData.get('startDate') as string;
                    const endDate = formData.get('endDate') as string;
                    
                    // Validate end date is not earlier than start date
                    if (endDate && new Date(endDate) < new Date(startDate)) {
                      toast.error("End date cannot be earlier than start date");
                      return;
                    }
                    
                    const medicationData = {
                      name: formData.get('medicationName') as string,
                      dosage: formData.get('dosageAmount') as string,
                      unit: formData.get('dosageUnit') as string,
                      frequency: formData.get('frequency') as string,
                      startDate: startDate,
                      endDate: endDate || undefined,
                      timeOfIntake: formData.get('timeOfIntake') as string,
                      notes: formData.get('notes') as string || undefined,
                      doseRemaining: 30, // Default value
                      totalDoses: 30 // Default value
                    };
                    handleMedicationAdd(medicationData);
                  }} className="space-y-4">
                    {/* Medicine Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        Medication Name*
                      </label>
                      <Input 
                        name="medicationName"
                        placeholder="Enter medication name" 
                        className="w-full bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-shadow" 
                        required
                      />
                    </div>
                    
                    {/* Dosage */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        Dosage*
                      </label>
                      <div className="flex gap-2">
                        <Input 
                          name="dosageAmount"
                          placeholder="Amount" 
                          type="number" 
                          min="0"
                          step="1"
                          className="flex-1 bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-shadow" 
                          required
                        />
                        <select 
                          name="dosageUnit"
                          className="w-1/3 p-2 border border-purple-200 dark:border-purple-800 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                          <option>mg</option>
                          <option>ml</option>
                          <option>tablet(s)</option>
                          <option>capsule(s)</option>
                          <option>drop(s)</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Frequency */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                        Frequency*
                      </label>
                      <select 
                        name="frequency"
                        className="w-full p-2 border border-purple-200 dark:border-purple-800 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option>Once daily</option>
                        <option>Twice daily</option>
                        <option>Three times daily</option>
                        <option>Every other day</option>
                        <option>Weekly</option>
                        <option>As needed</option>
                        <option>Custom</option>
                      </select>
                    </div>
                    
                    {/* Start and End Date */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                          <Calendar className="w-4.5 h-4.5 text-purple-600 dark:text-purple-300" />
                          Start Date*
                        </label>
                        <Input 
                          name="startDate"
                          id="startDate"
                          type="date" 
                          className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-shadow" 
                          defaultValue={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                          <Calendar className="w-4.5 h-4.5 text-purple-600 dark:text-purple-300" />
                          End Date
                        </label>
                        <Input 
                          name="endDate"
                          id="endDate"
                          type="date" 
                          className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-shadow"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    
                    {/* Time of Intake */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <Clock className="w-4.5 h-4.5 text-purple-600 dark:text-purple-300" />
                        Time of Intake*
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          name="timeOfIntake" 
                          type="time" 
                          className="flex-1 bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-shadow" 
                          required
                        />
                        <Button 
                          type="button"
                          className="bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900/70 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                          onClick={() => {
                            const now = new Date();
                            const hours = now.getHours().toString().padStart(2, '0');
                            const minutes = now.getMinutes().toString().padStart(2, '0');
                            const timeInput = document.querySelector('input[name="timeOfIntake"]') as HTMLInputElement;
                            if (timeInput) timeInput.value = `${hours}:${minutes}`;
                          }}
                        >
                          <Clock className="w-4.5 h-4.5 mr-1" />
                          Now
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Set time for intake reminders</p>
                    </div>
                    
                    {/* Additional Notes */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                        Additional Notes
                      </label>
                      <textarea 
                        name="notes"
                        className="w-full p-3 border border-purple-200 dark:border-purple-800 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[80px]" 
                        placeholder="Optional notes about this medication"
                      ></textarea>
                    </div>
                    
                    {/* Medical Tips */}
                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
                        <InfoIcon className="w-4 h-4" />
                        Medication Tips
                      </h4>
                      <ul className="mt-2 space-y-1 text-xs text-blue-700 dark:text-blue-300 ml-6 list-disc">
                        <li>Take medications at the same time each day for best results</li>
                        <li>Store in a cool, dry place away from direct sunlight</li>
                        <li>Check with your doctor before stopping any prescription</li>
                      </ul>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Add Medication
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Enhanced Water Intake Modal with comprehensive logging options */}
        <Dialog open={showWaterIntakeModal} onOpenChange={setShowWaterIntakeModal}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto shadow-xl dark:shadow-blue-900/20 bg-white dark:bg-gray-800/95 backdrop-blur border border-blue-100 dark:border-blue-900">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                  <Droplet className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                Log Water Intake
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300">
                Track your daily hydration for better health
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Current Intake Display */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50 shadow-sm">
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Current intake</span>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Daily goal</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{waterIntake.total} ml</span>
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">2000 ml</span>
                </div>
                
                <div className="relative h-5 bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min((waterIntake.total / 2000) * 100, 100)}%` }}
                  />
                  
                  {/* Water wave animation effect */}
                  <div className="absolute inset-0 opacity-30 overflow-hidden" style={{ width: `${Math.min((waterIntake.total / 2000) * 100, 100)}%` }}>
                    <div className="absolute inset-0 bg-white dark:bg-blue-200 animate-wave"
                      style={{ 
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' class='shape-fill'%3E%3C/path%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' class='shape-fill'%3E%3C/path%3E%3C/svg%3E\")",
                        backgroundSize: '1200px 100%',
                        backgroundRepeat: 'repeat-x',
                        height: '200%',
                        top: '80%'
                      }} 
                    />
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-800 dark:text-white z-10 drop-shadow">
                      {Math.round((waterIntake.total / 2000) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Time of Intake */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Time of Intake
                </h3>
                <div className="flex gap-2">
                  <Input 
                    type="time" 
                    defaultValue={new Date().toTimeString().slice(0, 5)} 
                    className="flex-1 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800 focus:ring-blue-500 transition-shadow"
                  />
                  <Button 
                    variant="outline" 
                    className="flex-shrink-0 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                  >
                    Now
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Record when you had this water intake</p>
              </div>
              
              {/* Quick Add Presets */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-blue-500" />
                  <span>Quick Add</span>
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[100, 200, 250, 300, 500, 1000].map(amount => (
                    <Button 
                      key={amount}
                      variant="outline"
                      className="h-auto py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-all"
                      onClick={() => {
                        setWaterIntake(prev => ({
                          ...prev,
                          total: prev.total + amount,
                          logs: [...prev.logs, {
                            id: `temp-${Date.now()}`,
                            userId: auth.currentUser?.uid || "",
                            amount,
                            timestamp: Timestamp.now()
                          }]
                        }));
                        toast.success(`${amount}ml of water added!`);
                        setShowWaterIntakeModal(false);
                      }}
                    >
                      <Droplet className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{amount} ml</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Custom Amount */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                  <Droplet className="h-3.5 w-3.5 text-blue-500" />
                  Custom Amount
                </h3>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input 
                      type="number" 
                      placeholder="Enter amount" 
                      className="pr-10 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800 focus:ring-blue-500 transition-shadow"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">ml</span>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                    onClick={() => {
                      toast.success("Water intake logged!");
                      setShowWaterIntakeModal(false);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              </div>
              
              {/* Water Health Benefits */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm mb-2 flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-blue-500" />
                  Health Benefits
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  Staying properly hydrated helps maintain body temperature, lubricates joints, prevents infections, delivers nutrients to cells, and keeps organs functioning properly.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Enhanced Medication History Modal */}
        <Dialog 
          open={showMedicationsHistory} 
          onOpenChange={(open) => {
            safelyOpenModal(setShowMedicationsHistory, open);
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <div className="p-2 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30">
                  <Pill className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
                  Medication Tracker
                </span>
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300">
                Manage your medication schedule and history with smart tracking
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Daily Overview */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400">
                    Today's Overview
                  </h3>
                  <div className="text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white dark:bg-gray-800/80 p-3 rounded-lg shadow-sm border border-purple-100 dark:border-purple-800/50">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Medications</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{medications.length}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800/80 p-3 rounded-lg shadow-sm border border-green-100 dark:border-green-800/50">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Taken Today</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {medications.filter(med => med.status === 'taken').length}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800/80 p-3 rounded-lg shadow-sm border border-yellow-100 dark:border-yellow-800/50">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {medications.filter(med => med.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Upcoming Medications */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <CalendarClock className="w-5 h-5" />
                  Upcoming Medications
                </h3>
                <div className="space-y-3">
                  {medications.filter(med => med.status === 'pending').map(medication => (
                    <div 
                      key={medication.id} 
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100 text-lg flex items-center gap-2">
                            {medication.name}
                            {new Date().toISOString().split('T')[0] === medication.startDate && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 animate-pulse">
                                Due today
                              </span>
                            )}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              {medication.dosage} {medication.unit}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                              {medication.frequency}
                            </span>
                            {medication.reminderType && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                {medication.reminderType}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>Scheduled for {medication.timeOfIntake}</span>
                          </div>
                          {medication.notes && (
                            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md">
                              <span className="font-medium">Notes:</span> {medication.notes}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 px-2 py-1 rounded">
                            {medication.doseRemaining} of {medication.totalDoses} doses remaining
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all"
                          onClick={() => handleMarkMedicationAsTaken(medication.id)}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Mark as Taken
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 group"
                          onClick={() => handleMedicationEdit(medication.id)}
                        >
                          <Pencil className="w-4 h-4 text-gray-500 group-hover:text-purple-500 transition-colors" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 group"
                          onClick={() => handleMedicationDelete(medication.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-600 transition-colors" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {medications.filter(med => med.status === 'pending').length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarCheck className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 mb-2">No pending medications</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">You're all caught up with your medications</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                        onClick={() => {
                          safelyOpenModal(setShowMedicationsHistory, false);
                          safelyOpenModal(setShowMedicationsModal);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Medication
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Taken Today */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Check className="w-5 h-5" />
                  Taken Today
                </h3>
                <div className="space-y-3">
                  {medications.filter(med => med.status === 'taken').map(medication => (
                    <div key={medication.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 border-l-4 border-l-green-500 p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{medication.name}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              {medication.dosage} {medication.unit}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                              {medication.frequency}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-xs font-medium text-green-700 dark:text-green-300 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Taken
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Taken at {medication.lastTaken}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Next dose: Tomorrow at {medication.timeOfIntake}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {medication.doseRemaining} of {medication.totalDoses} doses remaining
                        </div>
                      </div>
                      {/* Add buttons to undo "taken" status and edit/delete */}
                      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-yellow-600 dark:text-yellow-400 text-xs flex items-center gap-1"
                          onClick={() => {
                            // Change back to pending status
                            setMedications(prev => 
                              prev.map(med => {
                                if (med.id === medication.id) {
                                  return {
                                    ...med,
                                    status: 'pending' as const,
                                    doseRemaining: med.doseRemaining + 1
                                  };
                                }
                                return med;
                              })
                            );
                            toast.info(`Marked ${medication.name} as not taken`);
                          }}
                        >
                          <RotateCcw className="w-3 h-3" />
                          Undo
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1"
                          onClick={() => handleMedicationEdit(medication.id)}
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1"
                          onClick={() => handleMedicationDelete(medication.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}

                  {medications.filter(med => med.status === 'taken').length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">No medications taken today</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Take your medications on time for better health</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Smart Reminders Section */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-purple-100 dark:border-purple-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                      <BellRing className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-300 dark:to-indigo-300">
                      Smart Reminders
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input type="checkbox" checked={true} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-indigo-600 group-hover:shadow-lg transition-all duration-300"></div>
                      <span className="ms-3 text-sm font-medium text-purple-800 dark:text-purple-300">Enabled</span>
                    </label>
                  </div>
                </div>
                
                <div className="p-3 mb-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-purple-100/80 dark:border-purple-800/80 shadow-sm">
                  <p className="text-sm text-purple-700 dark:text-purple-400 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    <span className="flex-1">AI will analyze your medication schedule and send smart reminders to ensure you never miss a dose.</span>
                  </p>
                </div>
                
                <div className="space-y-3">
                  {/* Vitamin D Reminder */}
                  <div className="group bg-white dark:bg-gray-800 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900/30 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full p-2 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-yellow-500">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Vitamin D Reminder</p>
                          <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-100/80 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full animate-pulse">
                            Today
                          </span>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3.5 h-3.5 mr-1.5" />
                          <p>9:00 AM (in 2 hours)</p>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <Pill className="w-3.5 h-3.5 mr-1.5" />
                          <p>1 tablet with food</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                        title="Edit Reminder"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        title="Snooze Reminder"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete Reminder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Weekly Medication Report */}
                  <div className="group bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-100 dark:border-purple-900/30 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full p-2 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 text-purple-500">
                        <FileBarChart className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Weekly Medication Report</p>
                          <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100/80 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
                            Sunday
                          </span>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          <p>Every Sunday at 9:00 AM</p>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                          <p>Summary of your medication adherence</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                        title="Edit Reminder"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        title="Snooze Reminder"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete Reminder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5 transform"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Custom Reminder
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Water Intake History Modal */}
        <Dialog 
          open={showWaterIntakeHistory} 
          onOpenChange={(open) => {
            safelyOpenModal(setShowWaterIntakeHistory, open);
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <div className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
                  <Droplet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                  Water Intake History
                </span>
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300">
                Track your hydration habits and stay healthy
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Daily Stats Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900/50 shadow-inner text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{waterIntake.total}</div>
                  <div className="text-sm text-blue-500 dark:text-blue-400">ml Today</div>
                  <div className="flex justify-center mt-1">
                    <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                      <span>{Math.round((waterIntake.total / 2000) * 100)}%</span>
                      <span>of goal</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-blue-100 dark:border-blue-900/50 text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {waterIntake.logs.length}
                  </div>
                  <div className="text-sm text-blue-500 dark:text-blue-400">Intakes</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Today</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-blue-100 dark:border-blue-900/50 text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">2000</div>
                  <div className="text-sm text-blue-500 dark:text-blue-400">ml Goal</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recommended</div>
                </div>
              </div>

              {/* Weekly Chart */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-100 dark:border-blue-800 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-700 dark:from-blue-400 dark:to-cyan-400">
                    Weekly Overview
                  </h3>
                  <div className="px-2 py-1 bg-white dark:bg-gray-800 rounded-md text-xs text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                    Last 7 Days
                  </div>
                </div>
                <div className="h-48 relative">
                  <div className="absolute inset-x-0 bottom-0 grid grid-cols-7 gap-2 h-40">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <div key={day} className="flex flex-col items-center">
                        <div 
                          className={`w-full bg-gradient-to-t from-blue-500 to-cyan-400 dark:from-blue-600 dark:to-cyan-500 rounded-t-lg transition-all duration-500 relative overflow-hidden`}
                          style={{ 
                            height: `${[65, 80, 45, 90, 70, 30, i === new Date().getDay() ? 100 * (waterIntake.total / 2000) : 50][i]}%`,
                            opacity: i <= new Date().getDay() ? 1 : 0.4
                          }}
                        >
                          {i === new Date().getDay() && (
                            <div className="absolute inset-0 animate-wave bg-opacity-30">
                              {/* Water wave animation */}
                            </div>
                          )}
                        </div>
                        <div className={`text-xs font-medium mt-2 ${i === new Date().getDay() ? 'text-blue-700 dark:text-blue-300 font-bold' : 'text-blue-600 dark:text-blue-400'}`}>
                          {day}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-xs text-blue-500 dark:text-blue-400">
                    <span>2000ml</span>
                    <span>1500ml</span>
                    <span>1000ml</span>
                    <span>500ml</span>
                    <span>0ml</span>
                  </div>
                </div>
              </div>

              {/* Today's Logs */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <ClipboardList className="w-5 h-5" />
                  Today's Intake
                </h3>
                <div className="space-y-3">
                  {waterIntake.logs.length > 0 ? (
                    waterIntake.logs.map((log, index) => (
                      <div 
                        key={log.id || index} 
                        className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-800 flex justify-between items-center hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center">
                            <Droplet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{log.amount} ml</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {log.timestamp instanceof Timestamp ? 
                                log.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                                'Time not available'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 dark:text-red-400 h-8 w-8 p-0"
                            onClick={() => {
                              // Function to delete water intake log
                              const updatedLogs = waterIntake.logs.filter(item => item.id !== log.id);
                              const updatedTotal = updatedLogs.reduce((sum, item) => sum + item.amount, 0);
                              setWaterIntake({
                                logs: updatedLogs,
                                total: updatedTotal
                              });
                              toast.success("Log entry removed");
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-800 text-center">
                      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Droplet className="w-8 h-8 text-blue-400 dark:text-blue-500" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 mb-2">No water intake logs for today</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Start tracking your hydration</p>
                      <Button 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white" 
                        size="sm"
                        onClick={() => {
                          safelyOpenModal(setShowWaterIntakeHistory, false);
                          safelyOpenModal(setShowWaterIntakeModal);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Log your first intake
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Hydration Insights */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Brain className="w-5 h-5" />
                  AI Hydration Insights
                </h3>
                <div className="space-y-3">
                  <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-lg border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full flex-shrink-0 mt-1">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {waterIntake.total >= 1500 ? 
                          "Great job staying hydrated today! You've reached 75% of your daily goal." : 
                          waterIntake.total >= 1000 ? 
                            "You're making good progress with your hydration. Try to drink more water in the afternoon." :
                            waterIntake.total > 0 ?
                              "You're not drinking enough water today. Aim for at least 2000ml daily for optimal health." :
                              "You haven't logged any water intake today. Remember to stay hydrated throughout the day!"
                        }
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                        Tip: Keep a water bottle nearby as a reminder to drink regularly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add the Edit Medication modal */}
        <Dialog open={showEditMedicationModal} onOpenChange={setShowEditMedicationModal}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800/95 backdrop-blur border border-gray-200 dark:border-gray-700">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <div className="p-2 rounded-full border border-purple-200 dark:border-purple-700">
                  <Pencil className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                Edit Medication
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300">
                Update your medication details
              </DialogDescription>
            </DialogHeader>
            
            {selectedMedication && (
              <div className="space-y-6 py-4">
                <div className="space-y-4 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5" />
                      Medication Details
                    </h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const updatedMedication: Medication = {
                        ...selectedMedication,
                        name: formData.get('medicationName') as string,
                        dosage: formData.get('dosageAmount') as string,
                        unit: formData.get('dosageUnit') as string,
                        frequency: formData.get('frequency') as string,
                        startDate: formData.get('startDate') as string,
                        endDate: formData.get('endDate') as string || undefined,
                        timeOfIntake: formData.get('timeOfIntake') as string,
                        notes: formData.get('notes') as string || undefined,
                        doseRemaining: parseInt(formData.get('doseRemaining') as string),
                        totalDoses: parseInt(formData.get('totalDoses') as string)
                      };
                      handleSaveEditedMedication(updatedMedication);
                    }} className="space-y-4">
                      {/* Medicine Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                          Medication Name*
                        </label>
                        <Input 
                          name="medicationName"
                          placeholder="Enter medication name" 
                          className="w-full bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-shadow" 
                          defaultValue={selectedMedication.name}
                          required
                        />
                      </div>
                      
                      {/* Dosage */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                          Dosage*
                        </label>
                        <div className="flex gap-2">
                          <Input 
                            name="dosageAmount"
                            placeholder="Amount" 
                            type="number" 
                            min="0"
                            step="1"
                            className="flex-1 bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-shadow" 
                            defaultValue={selectedMedication.dosage}
                            required
                          />
                          <select 
                            name="dosageUnit"
                            className="w-1/3 p-2 border border-purple-200 dark:border-purple-800 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            defaultValue={selectedMedication.unit}
                          >
                            <option>mg</option>
                            <option>ml</option>
                            <option>tablet(s)</option>
                            <option>capsule(s)</option>
                            <option>drop(s)</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Frequency */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                          Frequency*
                        </label>
                        <select 
                          name="frequency"
                          className="w-full p-2 border border-purple-200 dark:border-purple-800 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                          <option>Once daily</option>
                          <option>Twice daily</option>
                          <option>Three times daily</option>
                          <option>Every other day</option>
                          <option>Weekly</option>
                          <option>As needed</option>
                          <option>Custom</option>
                        </select>
                      </div>
                      
                      {/* Start and End Date */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                            <Calendar className="w-4.5 h-4.5 text-purple-600 dark:text-purple-300" />
                            Start Date*
                          </label>
                          <Input 
                            name="startDate"
                            id="startDate"
                            type="date" 
                            className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-shadow" 
                            defaultValue={selectedMedication.startDate}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                            <Calendar className="w-4.5 h-4.5 text-purple-600 dark:text-purple-300" />
                            End Date
                          </label>
                          <Input 
                            name="endDate"
                            id="endDate"
                            type="date" 
                            className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-shadow"
                            defaultValue={selectedMedication.endDate}
                          />
                        </div>
                      </div>
                      
                      {/* Time of Intake */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                          <Clock className="w-4.5 h-4.5 text-purple-600 dark:text-purple-300" />
                          Time of Intake*
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            name="timeOfIntake" 
                            type="time" 
                            className="flex-1 bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-shadow" 
                            defaultValue={selectedMedication.timeOfIntake}
                            required
                          />
                          <Button 
                            type="button"
                            className="bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900/70 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                            onClick={() => {
                              const now = new Date();
                              const hours = now.getHours().toString().padStart(2, '0');
                              const minutes = now.getMinutes().toString().padStart(2, '0');
                              const timeInput = document.querySelector('input[name="timeOfIntake"]') as HTMLInputElement;
                              if (timeInput) timeInput.value = `${hours}:${minutes}`;
                            }}
                          >
                            <Clock className="w-4.5 h-4.5 mr-1" />
                            Now
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Set time for intake reminders</p>
                      </div>
                      
                      {/* Total Doses */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Remaining Doses
                          </label>
                          <Input 
                            name="doseRemaining"
                            type="number" 
                            className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-shadow" 
                            defaultValue={selectedMedication.doseRemaining.toString()}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Total Doses
                          </label>
                          <Input 
                            name="totalDoses"
                            type="number" 
                            className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-shadow" 
                            defaultValue={selectedMedication.totalDoses.toString()}
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit"
                        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        Save Changes
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
