import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { 
  Plus, 
  Clock, 
  Check, 
  Pill,
  AlertCircle 
} from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  Timestamp 
} from 'firebase/firestore';

interface Medication {
  id: string;
  name: string;
  frequency: string;
  taken: boolean;
  takenAt?: Timestamp;
}

interface MedicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (medication: Medication) => void;
}

const FREQUENCY_OPTIONS = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every morning',
  'Every night',
  'As needed'
];

export default function MedicationsModal({ isOpen, onClose, onUpdate }: MedicationsModalProps) {
  const [newMedName, setNewMedName] = useState('');
  const [newMedFreq, setNewMedFreq] = useState(FREQUENCY_OPTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addMedication = async () => {
    try {
      setLoading(true);
      if (!newMedName.trim()) {
        setError('Please enter a medication name');
        return;
      }

      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('Please sign in to add medications');
        return;
      }

      const medication = {
        userId,
        name: newMedName.trim(),
        frequency: newMedFreq,
        taken: false,
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'medications'), medication);
      
      // Call onUpdate if provided
      if (onUpdate) {
        onUpdate({
          id: docRef.id,
          name: newMedName.trim(),
          frequency: newMedFreq,
          taken: false
        });
      }

      setNewMedName('');
      onClose();
    } catch (err) {
      console.error('Failed to add medication:', err);
      setError('Failed to add medication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto shadow-xl dark:shadow-blue-900/20 bg-white dark:bg-gray-800/95 backdrop-blur border border-blue-100 dark:border-blue-900">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
              <Pill className="h-5 w-5 text-purple-600 dark:text-purple-300" />
            </div>
            Add Medication
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Add a new medication to your daily tracking routine
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2 shadow-sm animate-pulse">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-6 py-4">
          <div className="space-y-4 p-5 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-100 dark:border-purple-800/50 shadow-sm">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5" />
                Medication Details
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    Medication Name
                  </label>
                  <Input
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="Enter medication name"
                    className="w-full bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 focus:ring-purple-500 transition-shadow"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                    Frequency
                  </label>
                  <select 
                    value={newMedFreq}
                    onChange={(e) => setNewMedFreq(e.target.value)}
                    className="w-full p-2 border border-purple-200 dark:border-purple-800 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    {FREQUENCY_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={addMedication} 
            disabled={loading || !newMedName.trim()}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Medication
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 