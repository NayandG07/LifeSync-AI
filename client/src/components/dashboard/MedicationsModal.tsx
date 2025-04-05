import React, { useState } from 'react';
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
import { Plus, Pill, Clock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface MedicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (med: any, taken: boolean) => void;
  medications: {
    date: string;
    taken: any[];
    scheduled: any[];
  };
}

interface Medication {
  id: number;
  name: string;
  frequency: string;
}

const MedicationsModal = ({ isOpen, onClose, onUpdate }: MedicationsModalProps) => {
  const [newMed, setNewMed] = useState<Omit<Medication, 'id'>>({
    name: '',
    frequency: ''
  });

  const addMedication = () => {
    if (newMed.name && newMed.frequency) {
      const medication = {
        ...newMed,
        id: Date.now(),
      };
      onUpdate(medication, false);
      setNewMed({ name: '', frequency: '' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800/95 mt-8 max-h-[80vh] overflow-y-auto shadow-xl dark:shadow-indigo-900/20 backdrop-blur border border-indigo-100 dark:border-indigo-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2.5 text-indigo-700 dark:text-indigo-300">
            <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
              <Pill className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
            </div>
            Manage Medications
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Keep track of your medications and dosage schedule
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 space-y-8">
          {/* Add New Medication Form */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800 shadow-sm">
            <h3 className="font-semibold mb-5 text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Plus className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              Add New Medication
            </h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                  <Pill className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                  Medication Name
                </Label>
                <Input
                  id="name"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  placeholder="Enter medication name"
                  className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency" className="text-sm font-medium flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                  <Clock className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                  Frequency
                </Label>
                <Input
                  id="frequency"
                  value={newMed.frequency}
                  onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                  placeholder="e.g., Once daily"
                  className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                />
              </div>
              <Button 
                onClick={addMedication}
                disabled={!newMed.name || !newMed.frequency}
                className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </div>
          </div>
          
          {/* Medication Management Tips */}
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg">
            <h4 className="font-medium text-indigo-800 dark:text-indigo-200 text-sm mb-2 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4" />
              Medication Tips
            </h4>
            <ul className="space-y-1.5 pl-5 list-disc text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              <li>Take medications at the same time each day</li>
              <li>Store medications in their original containers</li>
              <li>Keep track of side effects and discuss with your doctor</li>
              <li>Set reminders to avoid missing doses</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationsModal; 