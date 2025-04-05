import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplet, Plus, Minus, Info, TrendingUp, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { format } from 'date-fns';

interface WaterIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (amount: number, log: any) => void;
  currentIntake: number;
  intakeLogs: any[];
  userWeight?: number;
}

const WaterIntakeModal = ({ isOpen, onClose, onUpdate, currentIntake, intakeLogs, userWeight }: WaterIntakeModalProps) => {
  const [customAmount, setCustomAmount] = useState<string>('');
  
  // Calculate recommended daily intake based on weight (30ml per kg of body weight)
  const calculateDailyGoal = () => {
    if (userWeight) {
      return Math.round(userWeight * 30); // WHO recommendation: 30ml per kg of body weight
    }
    return 2000; // Default recommendation if weight is not available
  };
  
  const dailyGoal = calculateDailyGoal();
  const quickAddOptions = [100, 200, 300, 500, 1000];
  const progressPercentage = Math.min((currentIntake / dailyGoal) * 100, 100);

  // Function to get custom class based on progress percentage
  const getProgressColorClass = () => {
    if (progressPercentage < 30) return 'from-red-500 to-red-600';
    if (progressPercentage < 60) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-600';
  };

  const handleQuickAdd = (amount: number, isAdd: boolean) => {
    if (isAdd) {
      const log = {
        time: new Date().toISOString(),
        amount: amount,
        type: 'add'
      };
      onUpdate(amount, log);
    } else {
      if (currentIntake >= amount) {
        const log = {
          time: new Date().toISOString(),
          amount: -amount,
          type: 'subtract'
        };
        onUpdate(-amount, log);
      }
    }
    setCustomAmount('');
  };

  const handleCustomAmountSubmit = (type: 'add' | 'subtract') => {
    const amount = parseInt(customAmount);
    if (!isNaN(amount) && amount > 0) {
      if (type === 'subtract' && amount > currentIntake) {
        return; // Can't subtract more than current intake
      }
      handleQuickAdd(amount, type === 'add');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-800/95 shadow-xl dark:shadow-blue-900/20 backdrop-blur border border-blue-100 dark:border-blue-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2.5 text-blue-700 dark:text-blue-300">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
              <Droplet className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            Water Intake Tracker
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Monitor your daily hydration for optimal health and wellness
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-8 py-6">
          {/* Current Intake Display - Enhanced Design */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl border border-blue-100 dark:border-blue-800 shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2 gap-4 p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-1.5">
                    <Droplet className="h-4 w-4" />
                    Daily Hydration
                  </h3>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                    {Math.round(progressPercentage)}% Complete
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="relative h-28 w-28 flex items-center justify-center">
                    {/* Circular progress indicator */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="40" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="8"
                        className="text-blue-100 dark:text-blue-800" 
                      />
                      <circle 
                        cx="50" cy="50" r="40" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * progressPercentage / 100)} 
                        strokeLinecap="round"
                        className={`text-${progressPercentage < 30 ? 'red' : progressPercentage < 60 ? 'yellow' : 'green'}-500 dark:text-${progressPercentage < 30 ? 'red' : progressPercentage < 60 ? 'yellow' : 'green'}-400 transform -rotate-90 origin-center transition-all duration-700 ease-out`}
                      />
                    </svg>
                    <div className="relative text-center">
                      <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{currentIntake}</div>
                      <div className="text-xs font-medium text-blue-600 dark:text-blue-400">ml</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Daily Goal</div>
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{dailyGoal} ml</div>
                    </div>
                    {userWeight && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                        Based on your weight ({userWeight}kg)
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Linear progress bar */}
                <div className="space-y-1.5">
                  <div className="h-2.5 bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden border border-blue-200 dark:border-blue-800">
                    <div 
                      className={`h-full bg-gradient-to-r ${getProgressColorClass()} rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col h-full">
                <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Today's Trend
                </h3>
                <div className="flex-1 min-h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={intakeLogs.reduce((acc: any[], log: any) => {
                        // Skip if there's a matching add/remove pair
                        const matchingOpposite = intakeLogs.find(
                          (l: any) => 
                            Math.abs(l.amount) === Math.abs(log.amount) && 
                            l.type !== log.type &&
                            Math.abs(new Date(l.time).getTime() - new Date(log.time).getTime()) < 60000
                        );
                        if (matchingOpposite && log.type === 'add') return acc;
                        
                        // Calculate cumulative intake
                        const lastTotal = acc.length > 0 ? acc[acc.length - 1].total : 0;
                        let newTotal = lastTotal;
                        
                        if (log.type === 'reset') {
                          newTotal = 0;
                        } else {
                          newTotal = lastTotal + log.amount;
                        }
                        
                        return [...acc, {
                          time: log.time,
                          total: newTotal,
                          amount: log.amount,
                          type: log.type
                        }];
                      }, []).filter((_, index, array) => index === 0 || index === array.length - 1 || index % 3 === 0)} 
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 10, fill: "#6B7280" }}
                        tickFormatter={(time) => format(new Date(time), 'HH:mm')}
                        stroke="#6B7280"
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: "#6B7280" }}
                        tickFormatter={(value) => `${value}ml`}
                        stroke="#6B7280"
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value} ml`, 'Total']}
                        labelFormatter={(time) => format(new Date(time), 'h:mm a')}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.375rem',
                          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                        activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Add/Remove Section - Enhanced UI */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-500" />
                Quick Add/Remove
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {quickAddOptions.map((amount) => (
                  <div key={amount} className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleQuickAdd(amount, true)}
                      className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/30 dark:to-blue-900/40 dark:hover:from-blue-900/40 dark:hover:to-blue-900/50 border-blue-200 dark:border-blue-700 text-gray-800 dark:text-gray-100 shadow-sm hover:shadow transition-all"
                    >
                      <Plus className="h-4 w-4 mr-1 text-green-500" />
                      {amount >= 1000 ? `${amount/1000}L` : `${amount}ml`}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleQuickAdd(amount, false)}
                      className="flex-1 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 dark:from-red-900/30 dark:to-red-900/40 dark:hover:from-red-900/40 dark:hover:to-red-900/50 border-red-200 dark:border-red-700 text-gray-800 dark:text-gray-100 shadow-sm hover:shadow transition-all"
                      disabled={currentIntake < amount}
                    >
                      <Minus className="h-4 w-4 mr-1 text-red-500" />
                      {amount >= 1000 ? `${amount/1000}L` : `${amount}ml`}
                    </Button>
                  </div>
                ))}
              </div>

              {/* Custom Input - Enhanced Design */}
              <div className="space-y-2 mt-5">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                  <Droplet className="h-3.5 w-3.5 text-blue-500" />
                  Custom Amount
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="pr-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-blue-200 dark:border-blue-800 focus:ring-blue-400 focus:border-blue-400 shadow-sm"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">ml</span>
                  </div>
                  <Button 
                    onClick={() => handleCustomAmountSubmit('add')}
                    disabled={!customAmount}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => handleCustomAmountSubmit('subtract')}
                    disabled={!customAmount || parseInt(customAmount) > currentIntake}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow transition-all"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                Hydration Guide
              </h3>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 shadow-sm">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm mb-2 flex items-center gap-1.5">
                  WHO Recommendation
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                  The World Health Organization recommends drinking 30ml of water per kilogram of body weight daily.
                  {userWeight ? (
                    <span className="block mt-1 text-blue-700 dark:text-blue-300 font-medium">
                      For your weight of {userWeight}kg, aim for {dailyGoal}ml daily.
                    </span>
                  ) : (
                    " Add your weight in Personal Details for a tailored recommendation."
                  )}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 shadow-sm">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm mb-2 flex items-center gap-1.5">
                  Hydration Benefits
                </h4>
                <ul className="space-y-1 pl-5 text-xs list-disc text-gray-700 dark:text-gray-200">
                  <li>Regulates body temperature</li>
                  <li>Maintains blood pressure</li>
                  <li>Lubricates joints and tissues</li>
                  <li>Helps deliver nutrients to cells</li>
                  <li>Supports cognitive function</li>
                </ul>
              </div>
              
              {/* Reset Button - Better Styling */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const resetLog = {
                      time: new Date().toISOString(),
                      amount: -currentIntake,
                      type: 'reset'
                    };
                    onUpdate(-currentIntake, resetLog);
                  }}
                  className="w-full text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 space-x-1.5"
                >
                  <span>Reset Today's Intake</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Today's Intake History Chart - Enhanced */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-blue-500" />
              Detailed History
            </h3>
            <div className="h-[200px] w-full bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={intakeLogs.reduce((acc: any[], log: any) => {
                    // Skip if there's a matching add/remove pair
                    const matchingOpposite = intakeLogs.find(
                      (l: any) => 
                        Math.abs(l.amount) === Math.abs(log.amount) && 
                        l.type !== log.type &&
                        Math.abs(new Date(l.time).getTime() - new Date(log.time).getTime()) < 60000 // Within 1 minute
                    );
                    if (matchingOpposite && log.type === 'add') return acc;

                    // Calculate cumulative intake
                    const lastTotal = acc.length > 0 ? acc[acc.length - 1].total : 0;
                    let newTotal = lastTotal;

                    // Handle reset
                    if (log.type === 'reset') {
                      newTotal = 0;
                    } else {
                      newTotal = lastTotal + log.amount;
                    }

                    return [...acc, {
                      time: log.time,
                      total: newTotal,
                      amount: log.amount,
                      type: log.type
                    }];
                  }, [])
                  } 
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    tickFormatter={(time) => format(new Date(time), 'HH:mm')}
                    stroke="#6B7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: "#6B7280" }} 
                    stroke="#6B7280"
                    tickFormatter={(value) => `${value}ml`}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      if (name === 'total') return [`${value} ml`, 'Total Intake'];
                      return [`${value} ml`, name === 'amount' ? 'Amount' : name];
                    }}
                    labelFormatter={(time) => format(new Date(time), 'h:mm a')}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.375rem',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    name="total"
                    stroke="#3b82f6" 
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WaterIntakeModal;