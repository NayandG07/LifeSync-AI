import { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Droplet,
  AlertCircle,
  Minus,
  InfoIcon,
  Settings,
  Trash2,
  CornerDownLeft,
  Calculator,
  CheckCircle
} from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  Timestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

interface WaterLog {
  id: string;
  amount: number;
  timestamp: Timestamp;
}

interface WaterIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (amount: number) => void;
  currentIntake?: number;
  intakeLogs?: WaterLog[];
  weight?: number;
}

const PRESET_AMOUNTS = [
  { label: '100 mL', value: 100 },
  { label: '200 mL', value: 200 },
  { label: '250 mL', value: 250 },
  { label: '300 mL', value: 300 },
  { label: '500 mL', value: 500 },
  { label: '1000 mL', value: 1000 }
];

const DECREASE_AMOUNTS = [
  { label: '100 mL', value: -100 },
  { label: '200 mL', value: -200 },
  { label: '300 mL', value: -300 },
  { label: '500 mL', value: -500 }
];

export default function WaterIntakeModal({ 
  isOpen, 
  onClose, 
  onUpdate = () => {},
  currentIntake = 0,
  intakeLogs = [],
  weight = 70 
}: WaterIntakeModalProps) {
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('add');
  const [showSettings, setShowSettings] = useState(false);
  const [customGoal, setCustomGoal] = useState('');
  const [waterGoal, setWaterGoal] = useState(2000);
  const [useCustomGoal, setUseCustomGoal] = useState(false);

  // Calculate recommended daily intake based on WHO guidelines (30-40ml per kg)
  const minRecommendedIntake = Math.round(weight * 30);
  const maxRecommendedIntake = Math.round(weight * 40);
  const recommendedIntake = Math.round((minRecommendedIntake + maxRecommendedIntake) / 2);
  
  // Load user's water goal setting from localStorage
  useEffect(() => {
    const savedGoal = localStorage.getItem('waterGoal');
    const savedUseCustom = localStorage.getItem('useCustomWaterGoal');
    
    if (savedGoal) {
      setWaterGoal(parseInt(savedGoal));
      setCustomGoal(savedGoal);
    } else {
      // If no saved goal, use WHO recommendation
      setWaterGoal(recommendedIntake);
      setCustomGoal(recommendedIntake.toString());
    }
    
    if (savedUseCustom) {
      setUseCustomGoal(savedUseCustom === 'true');
    }
  }, [recommendedIntake]);
  
  // Calculate percentage of goal reached
  const goalToUse = useCustomGoal ? waterGoal : recommendedIntake;
  const progressPercentage = Math.min((currentIntake / goalToUse) * 100, 100);

  const handleWaterIntake = async (amount: number) => {
    try {
      setLoading(true);
      
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('Please sign in to log water intake');
        return;
      }

      // Don't allow negative total water intake
      if (currentIntake + amount < 0) {
        amount = -currentIntake; // Adjust to make total exactly zero
      }

      const newLog = {
        userId,
        amount,
        timestamp: Timestamp.now()
      };
    
      // Save to Firestore
      await addDoc(collection(db, 'waterLogs'), newLog);
      
      // Update the parent component with the amount
      onUpdate(amount);
    
      // Clear custom amount if any
      setCustomAmount('');

      // Show message for decrease vs. increase
      if (amount < 0) {
        setError(`Successfully decreased water intake by ${Math.abs(amount)} ml`);
        // Clear error message after 3 seconds
        setTimeout(() => setError(''), 3000);
      }
      
    } catch (err) {
      console.error('Failed to log water intake:', err);
      setError('Failed to log water intake');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomAmountSubmit = () => {
    const amount = parseInt(customAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (activeTab === 'decrease') {
      handleWaterIntake(-amount);
    } else {
      handleWaterIntake(amount);
    }
  };

  const handleSaveGoal = () => {
    const goal = parseInt(customGoal);
    if (isNaN(goal) || goal <= 0) {
      setError('Please enter a valid goal amount');
      return;
    }
    
    setWaterGoal(goal);
    localStorage.setItem('waterGoal', goal.toString());
    localStorage.setItem('useCustomWaterGoal', useCustomGoal.toString());
    setShowSettings(false);
    setError('');
  };

  const useRecommendedGoal = () => {
    setWaterGoal(recommendedIntake);
    setCustomGoal(recommendedIntake.toString());
    setUseCustomGoal(false);
    localStorage.setItem('waterGoal', recommendedIntake.toString());
    localStorage.setItem('useCustomWaterGoal', 'false');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto shadow-xl dark:shadow-blue-900/20 bg-white dark:bg-gray-800/95 backdrop-blur border border-blue-100 dark:border-blue-900">
        <DialogHeader className="space-y-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                <Droplet className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              Log Water Intake
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="h-9 w-9 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Track your daily hydration for better health
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-3 ${error.includes('decreased') ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'} rounded-lg flex items-center gap-2 shadow-sm`}
          >
            {error.includes('decreased') ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        <div className="space-y-6 py-4">
          {/* Water Goal Settings */}
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Water Goal Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={useCustomGoal}
                      onCheckedChange={setUseCustomGoal}
                      id="custom-goal"
                    />
                    <Label htmlFor="custom-goal" className="text-sm text-gray-700 dark:text-gray-300">
                      Use custom water goal
                    </Label>
                  </div>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-blue-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>WHO recommends {minRecommendedIntake}-{maxRecommendedIntake} ml daily for your weight ({weight} kg)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      placeholder="Enter custom goal"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      className="pr-10 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800 focus:ring-blue-500 transition-shadow"
                      disabled={!useCustomGoal}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">ml</span>
                  </div>
                  <Button
                    onClick={handleSaveGoal}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save
                  </Button>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">WHO Recommendation:</span>
                  </div>
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {minRecommendedIntake}-{maxRecommendedIntake} ml
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  onClick={useRecommendedGoal}
                  className="w-full border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                >
                  Use Recommended ({recommendedIntake} ml)
                </Button>
              </div>
            </motion.div>
          )}

          {/* Current Intake Display */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50 shadow-sm">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Current intake</span>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Daily goal</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{currentIntake} ml</span>
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {useCustomGoal ? waterGoal : recommendedIntake} ml
              </span>
            </div>
            
            <div className="relative h-5 bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
              
              {/* Water wave animation effect */}
              <div className="absolute inset-0 opacity-30 overflow-hidden" style={{ width: `${progressPercentage}%` }}>
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
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Add/Decrease Tabs */}
          <Tabs defaultValue="add" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="add" className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-800 dark:data-[state=active]:text-blue-200">
                <Plus className="w-4 h-4 mr-2" />
                Add Water
              </TabsTrigger>
              <TabsTrigger value="decrease" className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-800 dark:data-[state=active]:text-blue-200">
                <Minus className="w-4 h-4 mr-2" />
                Decrease Water
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="add" className="space-y-4 mt-0">
              {/* Quick Add Buttons */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-blue-500" />
                  <span>Quick Add</span>
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {PRESET_AMOUNTS.map((preset) => (
                    <Button
                      key={preset.value}
                      variant="outline"
                      className="h-auto py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-all"
                      onClick={() => handleWaterIntake(preset.value)}
                      disabled={loading}
                    >
                      <Droplet className="w-4 h-4" />
                      <span className="font-medium">{preset.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Custom Amount */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Custom Amount</h3>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="pr-10 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800 focus:ring-blue-500 transition-shadow"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">ml</span>
                  </div>
                  <Button 
                    onClick={handleCustomAmountSubmit}
                    disabled={!customAmount || loading}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="decrease" className="space-y-4 mt-0">
              {/* Quick Decrease Buttons */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <Minus className="w-4 h-4 text-blue-500" />
                  <span>Quick Decrease</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {DECREASE_AMOUNTS.map((preset) => (
                    <Button
                      key={preset.value}
                      variant="outline"
                      className="h-auto py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all"
                      onClick={() => handleWaterIntake(preset.value)}
                      disabled={loading || Math.abs(preset.value) > currentIntake}
                    >
                      <Minus className="w-4 h-4" />
                      <span className="font-medium">{preset.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Custom Decrease Amount */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Custom Amount</h3>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      placeholder="Enter amount to decrease"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="pr-10 bg-white dark:bg-gray-800 border-red-200 dark:border-red-800/50 focus:ring-red-500 transition-shadow"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">ml</span>
                  </div>
                  <Button 
                    onClick={handleCustomAmountSubmit}
                    disabled={!customAmount || loading || parseInt(customAmount) > currentIntake}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Minus className="w-4 h-4" />
                        Decrease
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Water Health Benefits */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm mb-2 flex items-center gap-2">
              <InfoIcon className="w-4 h-4" />
              Health Benefits
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Staying properly hydrated helps maintain body temperature, lubricates joints, prevents infections, delivers nutrients to cells, and keeps organs functioning properly.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 