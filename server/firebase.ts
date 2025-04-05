import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV !== 'production';

// Initialize Firebase with real or mock implementation
let firestoreDb;
let FirebaseFirestore: any = {};

// Setup mock implementations for development without Firebase credentials
if (isDevelopment && (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL)) {
  console.warn('⚠️ Firebase credentials missing. Using mock Firebase implementation for development.');
  
  // Mock Firestore functionality
  const mockCollection = (name: string) => {
    return {
      doc: (id: string) => ({
        get: async () => ({ exists: false, data: () => null }),
        set: async (data: any) => console.log(`Mock set ${name}/${id}:`, data),
        update: async (data: any) => console.log(`Mock update ${name}/${id}:`, data),
        delete: async () => console.log(`Mock delete ${name}/${id}`),
      }),
      add: async (data: any) => {
        const id = `mock-${Date.now()}`;
        console.log(`Mock add ${name}/${id}:`, data);
        return { id };
      },
      where: () => ({ get: async () => ({ empty: true, docs: [] }) }),
    };
  };
  
  // Create mock db
  firestoreDb = { collection: mockCollection };
  
  // Mock timestamp functionality
  FirebaseFirestore.Timestamp = {
    fromDate: (date: Date) => ({ toDate: () => date }),
    now: () => ({ toDate: () => new Date() }),
  };
} else {
  // Use actual Firebase if credentials are available
  try {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
      throw new Error(
        "Firebase configuration is missing. Please set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL environment variables.",
      );
    }

    // Initialize Firebase Admin
    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });

    // Get Firestore instance
    firestoreDb = getFirestore(app);
    FirebaseFirestore = require('firebase-admin/firestore');
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    throw error;
  }
}

// Export the db instance (real or mock)
export const db = firestoreDb;

// Collection references
export const usersCollection = db.collection('users');
export const moodsCollection = db.collection('moods');
export const symptomsCollection = db.collection('symptoms');
export const healthMetricsCollection = db.collection('healthMetrics');

// Helper function to convert Firestore timestamp to Date
export const timestampToDate = (timestamp: any): Date => {
  return timestamp.toDate ? timestamp.toDate() : new Date();
};

// Helper function to convert Date to Firestore timestamp
export const dateToTimestamp = (date: Date): any => {
  return FirebaseFirestore.Timestamp ? FirebaseFirestore.Timestamp.fromDate(date) : { toDate: () => date };
}; 