import { 
  db as firebaseDb,
  usersCollection,
  moodsCollection,
  symptomsCollection,
  healthMetricsCollection,
  timestampToDate,
  dateToTimestamp
} from './firebase';
import type { User, InsertUser, Mood, InsertMood, Symptom, InsertSymptom, HealthMetric, InsertHealthMetric } from '@shared/schema';

// Export the Firestore instance
export const db = firebaseDb;

// Users
export async function createUser(user: InsertUser): Promise<User> {
  const docRef = await usersCollection.add({
    ...user,
    createdAt: dateToTimestamp(new Date())
  });
  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() } as User;
}

export async function getUserByFirebaseId(firebaseId: string): Promise<User | null> {
  const snapshot = await usersCollection.where('firebaseId', '==', firebaseId).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as User;
}

// Moods
export async function createMood(mood: InsertMood): Promise<Mood> {
  const docRef = await moodsCollection.add({
    ...mood,
    timestamp: dateToTimestamp(new Date())
  });
  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() } as Mood;
}

export async function getMoodsByUserId(userId: string): Promise<Mood[]> {
  const snapshot = await moodsCollection
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Mood);
}

// Symptoms
export async function createSymptom(symptom: InsertSymptom): Promise<Symptom> {
  const docRef = await symptomsCollection.add({
    ...symptom,
    timestamp: dateToTimestamp(new Date())
  });
  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() } as Symptom;
}

export async function getSymptomsByUserId(userId: string): Promise<Symptom[]> {
  const snapshot = await symptomsCollection
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Symptom);
}

// Health Metrics
export async function createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric> {
  const docRef = await healthMetricsCollection.add({
    ...metric,
    timestamp: dateToTimestamp(new Date())
  });
  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() } as HealthMetric;
}

export async function getHealthMetricsByUserId(userId: string): Promise<HealthMetric[]> {
  const snapshot = await healthMetricsCollection
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as HealthMetric);
}
