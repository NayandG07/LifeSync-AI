import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { collection, query, where, orderBy, limit, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface HealthMetricsState {
  heartRate: number;
  sleepHours: number;
  steps: number;
  bodyTemperature: number;
  caloriesBurned: number;
  bloodGlucose: number;
  lastUpdated: Date | null;
  isLoading: boolean;
  
  // Actions
  loadHealthData: () => Promise<void>;
  updateMetric: (metric: string, value: number) => Promise<void>;
  syncWithFirestore: () => Promise<void>;
}

export const useHealthStore = create<HealthMetricsState>()(
  persist(
    (set, get) => ({
      heartRate: 72,
      sleepHours: 7.5,
      steps: 8439,
      bodyTemperature: 98.6,
      caloriesBurned: 1250,
      bloodGlucose: 98,
      lastUpdated: null,
      isLoading: true,
      
      loadHealthData: async () => {
        set({ isLoading: true });
        
        try {
          // First try to load from Firestore if user is authenticated
          if (auth.currentUser) {
            try {
              const userId = auth.currentUser.uid;
              const metricsRef = collection(db, 'healthMetrics');
              
              // Try a simpler query first that doesn't require a composite index
              let q = query(
                metricsRef,
                where('userId', '==', userId),
                limit(10)
              );
              
              try {
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                  // Sort results manually if we have documents
                  const sortedDocs = querySnapshot.docs.sort(
                    (a, b) => b.data().timestamp?.toDate() - a.data().timestamp?.toDate()
                  );
                  
                  if (sortedDocs.length > 0) {
                    const data = sortedDocs[0].data();
                    
                    set({
                      heartRate: data.heartRate || 72,
                      sleepHours: data.sleepHours || 7.5,
                      steps: data.steps || 8439,
                      bodyTemperature: data.bodyTemp || 98.6,
                      caloriesBurned: data.caloriesBurned || 1250,
                      bloodGlucose: data.bloodGlucose || 98,
                      lastUpdated: data.timestamp?.toDate() || new Date(),
                      isLoading: false
                    });
                    return;
                  }
                }
              } catch (queryError) {
                console.log("Simplified query failed, using defaults:", queryError);
              }
            } catch (error) {
              console.error("Error loading health metrics from Firestore:", error);
              // Continue with defaults
            }
          }
          
          // If we're here, either the user is not authenticated or we couldn't load from Firestore
          // No need to set default values here as they're already in the initial state
        } catch (error) {
          console.error("Unexpected error in loadHealthData:", error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateMetric: async (metric: string, value: number) => {
        switch (metric) {
          case 'heartRate':
            set({ heartRate: value });
            break;
          case 'sleepHours':
            set({ sleepHours: value });
            break;
          case 'steps':
            set({ steps: value });
            break;
          case 'bodyTemperature':
            set({ bodyTemperature: value });
            break;
          case 'caloriesBurned':
            set({ caloriesBurned: value });
            break;
          case 'bloodGlucose':
            set({ bloodGlucose: value });
            break;
          default:
            console.warn(`Unknown metric: ${metric}`);
            return;
        }
        
        set({ lastUpdated: new Date() });
        
        // If user is authenticated, sync with Firestore
        if (auth.currentUser) {
          await get().syncWithFirestore();
        }
      },
      
      syncWithFirestore: async () => {
        if (!auth.currentUser) return;
        
        try {
          const userId = auth.currentUser.uid;
          
          // Get current state
          const { 
            heartRate, 
            sleepHours, 
            steps, 
            bodyTemperature, 
            caloriesBurned,
            bloodGlucose,
            lastUpdated 
          } = get();
          
          // Add a new document to the collection
          await addDoc(collection(db, 'healthMetrics'), {
            userId,
            heartRate,
            sleepHours,
            bodyTemp: bodyTemperature,
            steps,
            caloriesBurned,
            bloodGlucose,
            timestamp: Timestamp.fromDate(lastUpdated || new Date())
          });
          
        } catch (error) {
          console.error("Error syncing health metrics with Firestore:", error);
        }
      }
    }),
    {
      name: 'health-data-storage', // name of the item in localStorage
      // Only store the metrics, not the functions
      partialize: (state) => ({
        heartRate: state.heartRate,
        sleepHours: state.sleepHours,
        steps: state.steps,
        bodyTemperature: state.bodyTemperature,
        caloriesBurned: state.caloriesBurned, 
        bloodGlucose: state.bloodGlucose,
        lastUpdated: state.lastUpdated
      }),
    }
  )
); 