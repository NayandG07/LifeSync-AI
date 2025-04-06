import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  setPersistence, 
  browserLocalPersistence,
  Auth,
  signInWithPopup,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  Firestore,
  addDoc,
  getDocs,
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { Message } from './types';

const firebaseConfig = {
  apiKey: "AIzaSyBXdOPUnGHOw1ukqBBZZJ9mdJUV0juJJ6U",
  authDomain: "lifesync-app-b2558.firebaseapp.com",
  projectId: "lifesync-app-b2558",
  storageBucket: "lifesync-app-b2558.appspot.com",
  messagingSenderId: "647875324235",
  appId: "1:647875324235:web:7d8275db9b538da6ffe0ce",
  measurementId: "G-HL8KQL225T"
};

// Initialize Firebase only if it hasn't been initialized
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  // Initialize Firestore
  db = getFirestore(app);
  
  // Initialize Auth with persistence
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence).catch(console.error);

  // Initialize Storage
  storage = getStorage(app);

  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Collection References
export const usersCollection = collection(db, 'users');
export const healthMetricsCollection = collection(db, 'healthMetrics');
export const moodEntriesCollection = collection(db, 'moodEntries');
export const waterIntakeCollection = collection(db, 'waterIntake');
export const medicationsCollection = collection(db, 'medications');
export const chatMessagesCollection = collection(db, 'chatMessages');

// Helper Functions
export const getUserProfile = async (userId: string) => {
  const userDoc = await getDoc(doc(usersCollection, userId));
  return userDoc.data();
};

export const updateUserProfile = async (userId: string, data: any) => {
  await setDoc(doc(usersCollection, userId), data, { merge: true });
};

export const saveHealthMetrics = async (userId: string, metrics: any) => {
  const docRef = doc(healthMetricsCollection, userId);
  await setDoc(docRef, {
    ...metrics,
    timestamp: Timestamp.now(),
    userId
  }, { merge: true });
};

export const saveMoodEntry = async (userId: string, moodData: any) => {
  const docRef = doc(moodEntriesCollection);
  await setDoc(docRef, {
    ...moodData,
    timestamp: Timestamp.now(),
    userId
  });
};

// Helper to check if Firestore is available and working
const isFirestoreAvailable = async () => {
  try {
    // First check if we're online at all
    if (!navigator.onLine) {
      return false;
    }

    // Try to get a reference to Firestore
    if (!db) {
      return false;
    }

    // Try a lightweight operation - just get a reference without actually querying
    const testRef = collection(db, 'test_connection');
    return true;
  } catch (error) {
    console.error("Firestore availability check failed:", error);
    return false;
  }
};

// Sync locally stored moods with Firestore when connection is restored
export const syncSavedMoods = async (userId: string) => {
  try {
    // First check if we're online
    if (!navigator.onLine) {
      console.log('Device is offline, skipping mood sync');
      return { success: false, message: 'Device is offline' };
    }

    // Check Firestore availability
    const firestoreAvailable = await isFirestoreAvailable();
    if (!firestoreAvailable) {
      console.log('Firestore is not available, skipping mood sync');
      return { success: false, message: 'Firestore is not available' };
    }

    // Get locally stored moods
    const localData = localStorage.getItem(`mood_history_${userId}`);
    if (!localData) {
      return { success: true, message: 'No local data to sync' };
    }

    const localMoods = JSON.parse(localData);
    if (!Array.isArray(localMoods) || localMoods.length === 0) {
      return { success: true, message: 'No moods to sync' };
    }

    // Use a more reliable way to check existing moods
    let batch = writeBatch(db);
    let syncCount = 0;

    for (const mood of localMoods) {
      try {
        // Check if this mood already exists
        const moodQuery = query(
          moodEntriesCollection,
          where('id', '==', mood.id),
          where('userId', '==', userId),
          limit(1)
        );

        const existingMood = await getDocs(moodQuery);
        
        if (existingMood.empty) {
          // Only add moods that don't exist yet
          const moodRef = doc(moodEntriesCollection);
          batch.set(moodRef, {
            ...mood,
            userId,
            timestamp: typeof mood.timestamp === 'string' 
              ? Timestamp.fromDate(new Date(mood.timestamp)) 
              : Timestamp.fromDate(mood.timestamp)
          });
          syncCount++;
        }

        // Commit batch if we've accumulated enough operations
        if (syncCount > 0 && syncCount % 500 === 0) {
          await batch.commit();
          batch = writeBatch(db); // Start a new batch
        }
      } catch (error) {
        console.error('Error processing mood:', error);
        continue; // Skip this mood but continue with others
      }
    }

    // Commit any remaining operations
    if (syncCount % 500 !== 0 && syncCount > 0) {
      await batch.commit();
    }

    return {
      success: true,
      message: syncCount > 0 
        ? `Successfully synced ${syncCount} moods to Firestore`
        : 'All moods already synced'
    };
  } catch (error) {
    console.error('Error syncing moods:', error);
    return {
      success: false,
      message: 'Failed to sync mood data to Firestore',
      error
    };
  }
};

export const updateWaterIntake = async (userId: string, intakeData: any) => {
  const docRef = doc(waterIntakeCollection, userId);
  await setDoc(docRef, {
    ...intakeData,
    timestamp: Timestamp.now(),
    userId
  }, { merge: true });
};

export const updateMedications = async (userId: string, medicationData: any) => {
  const docRef = doc(medicationsCollection, userId);
  await setDoc(docRef, {
    ...medicationData,
    timestamp: Timestamp.now(),
    userId
  }, { merge: true });
};

// Function to save chat messages with built-in error handling
export const saveChatMessage = async (userId: string, message: Message): Promise<string> => {
  try {
    if (!await isFirestoreAvailable()) {
      // If Firestore is blocked or unavailable, store in localStorage as fallback
      const localMessages = JSON.parse(localStorage.getItem(`messages_${userId}`) || '[]');
      const messageWithId = { ...message, id: Date.now().toString() };
      localMessages.push(messageWithId);
      localStorage.setItem(`messages_${userId}`, JSON.stringify(localMessages));
      console.log("Message saved to localStorage due to Firestore unavailability");
      return messageWithId.id;
    }

    // If Firestore is available, save message normally
    const messagesRef = collection(db, 'users', userId, 'messages');
    const docRef = await addDoc(messagesRef, {
      text: message.text,
      sender: message.sender,
      timestamp: message.timestamp,
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error saving message:", error);
    
    // Fallback to localStorage if Firebase fails
    const localMessages = JSON.parse(localStorage.getItem(`messages_${userId}`) || '[]');
    const messageWithId = { ...message, id: Date.now().toString() };
    localMessages.push(messageWithId);
    localStorage.setItem(`messages_${userId}`, JSON.stringify(localMessages));
    
    return messageWithId.id;
  }
};

// Function to get messages with fallback
export const getMessages = async (userId: string): Promise<Message[]> => {
  try {
    if (!await isFirestoreAvailable()) {
      // If Firestore is blocked or unavailable, get from localStorage
      const localMessages = JSON.parse(localStorage.getItem(`messages_${userId}`) || '[]');
      return localMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }

    // Normal Firestore retrieval
    const messagesRef = collection(db, 'users', userId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      text: doc.data().text,
      sender: doc.data().sender,
      timestamp: doc.data().timestamp.toDate()
    }));
  } catch (error) {
    console.error("Error getting messages:", error);
    
    // Fallback to localStorage
    const localMessages = JSON.parse(localStorage.getItem(`messages_${userId}`) || '[]');
    return localMessages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  }
};

// Function to delete messages with fallback
export const deleteMessages = async (userId: string, messageId: string): Promise<void> => {
  try {
    if (!await isFirestoreAvailable()) {
      // If Firestore is blocked, delete from localStorage
      const localMessages = JSON.parse(localStorage.getItem(`messages_${userId}`) || '[]');
      const filteredMessages = localMessages.filter((msg: any) => msg.id !== messageId);
      localStorage.setItem(`messages_${userId}`, JSON.stringify(filteredMessages));
      return;
    }

    // Normal Firestore deletion
    const messageRef = doc(db, 'users', userId, 'messages', messageId);
    await deleteDoc(messageRef);
  } catch (error) {
    console.error("Error deleting message:", error);
    
    // Fallback to localStorage
    const localMessages = JSON.parse(localStorage.getItem(`messages_${userId}`) || '[]');
    const filteredMessages = localMessages.filter((msg: any) => msg.id !== messageId);
    localStorage.setItem(`messages_${userId}`, JSON.stringify(filteredMessages));
  }
};

// Function to delete all chat messages for a user
export const deleteAllMessages = async (userId: string): Promise<void> => {
  try {
    if (!await isFirestoreAvailable()) {
      // If Firestore is blocked, delete all from localStorage
      localStorage.setItem(`messages_${userId}`, '[]');
      return;
    }

    // Normal Firestore deletion - get all messages first
    const messagesRef = collection(db, 'users', userId, 'messages');
    const querySnapshot = await getDocs(messagesRef);
    
    // Delete each message document
    const deletionPromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletionPromises);
    
    console.log(`Deleted ${querySnapshot.docs.length} messages for user ${userId}`);
  } catch (error) {
    console.error("Error deleting all messages:", error);
    
    // Fallback to localStorage
    localStorage.setItem(`messages_${userId}`, '[]');
  }
};

// Helper to ensure user document exists with better error handling
export const ensureUserExists = async (userId: string, userData: any = {}) => {
  try {
    // First, check if Firestore is available
    if (!await isFirestoreAvailable()) {
      console.warn("Firestore unavailable, storing user data in localStorage");
      localStorage.setItem(`user_${userId}`, JSON.stringify({
        ...userData,
        userId,
        createdAt: new Date().toISOString()
      }));
      return true;
    }
    
    // If Firestore is available, proceed with normal flow
    const userRef = doc(usersCollection, userId);
    
    try {
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        await setDoc(userRef, {
          ...userData,
          userId,
          createdAt: Timestamp.now(),
        });
        console.log("User document created in Firestore");
      }
      
      // Initialize health metrics if they don't exist
      await ensureHealthMetricsExist(userId);
      
      // Initialize water logs if they don't exist
      await ensureWaterLogsExist(userId);
      
      return true;
    } catch (firestoreError) {
      console.error("Error with Firestore operations:", firestoreError);
      
      // Fall back to localStorage
      localStorage.setItem(`user_${userId}`, JSON.stringify({
        ...userData,
        userId,
        createdAt: new Date().toISOString()
      }));
      
      return true;
    }
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    
    // Even with complete error, still save to localStorage as ultimate fallback
    try {
      localStorage.setItem(`user_${userId}`, JSON.stringify({
        ...userData,
        userId,
        createdAt: new Date().toISOString()
      }));
    } catch (localStorageError) {
      console.error("Failed to save to localStorage:", localStorageError);
    }
    
    return false;
  }
};

// Helper to ensure water logs document exists
export const ensureWaterLogsExist = async (userId: string) => {
  try {
    // Use direct document reference instead of a query that requires an index
    const waterLogsRef = doc(db, 'water_logs', userId);
    const waterDoc = await getDoc(waterLogsRef);
    
    if (!waterDoc.exists()) {
      // Create water logs document with default values
      await setDoc(waterLogsRef, {
        userId,
        lastUpdated: Timestamp.now(),
        dailyGoal: 2000, // 2000ml (2L) default
        currentIntake: 0,
        history: []
      });
      console.log("Water logs document created");
    }
    return true;
  } catch (error) {
    console.error("Error ensuring water logs exist:", error);
    return false;
  }
};

// Helper to ensure health metrics document exists
export const ensureHealthMetricsExist = async (userId: string) => {
  try {
    // Use direct document reference instead of a query that requires an index
    const healthMetricsRef = doc(db, 'health_metrics', userId);
    const healthDoc = await getDoc(healthMetricsRef);
    
    if (!healthDoc.exists()) {
      // Create health metrics document with default values
      await setDoc(healthMetricsRef, {
        userId,
        lastUpdated: Timestamp.now(),
        metrics: {
          height: null,
          weight: null,
          bloodPressure: { systolic: null, diastolic: null },
          heartRate: null,
          sleepHours: null,
        }
      });
      console.log("Health metrics document created");
    }
    return true;
  } catch (error) {
    console.error("Error ensuring health metrics exist:", error);
    return false;
  }
};

export { app, auth, db, storage };