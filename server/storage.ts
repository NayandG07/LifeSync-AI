import type { User, InsertUser, Mood, InsertMood, Symptom, InsertSymptom, HealthMetric, InsertHealthMetric } from "@shared/schema";
import { 
  usersCollection,
  moodsCollection,
  symptomsCollection,
  healthMetricsCollection,
  timestampToDate,
  dateToTimestamp
} from "./firebase";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByFirebaseId(firebaseId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Mood methods
  createMood(mood: InsertMood): Promise<Mood>;
  getMoodsByUserId(userId: string): Promise<Mood[]>;

  // Symptom methods
  createSymptom(symptom: InsertSymptom): Promise<Symptom>;
  getSymptomsByUserId(userId: string): Promise<Symptom[]>;

  // Health metric methods
  createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;
  getHealthMetricsByUserId(userId: string): Promise<HealthMetric[]>;
}

export class FirestoreStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const doc = await usersCollection.doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data() } as User;
  }

  async getUserByFirebaseId(firebaseId: string): Promise<User | undefined> {
    const snapshot = await usersCollection.where('firebaseId', '==', firebaseId).get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const docRef = await usersCollection.add({
      ...insertUser,
      createdAt: dateToTimestamp(new Date())
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as User;
  }

  async createMood(mood: InsertMood): Promise<Mood> {
    const docRef = await moodsCollection.add({
      ...mood,
      timestamp: dateToTimestamp(new Date())
    });
    const doc = await docRef.get();
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: timestampToDate(data?.timestamp)
    } as Mood;
  }

  async getMoodsByUserId(userId: string): Promise<Mood[]> {
    const snapshot = await moodsCollection
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: timestampToDate(data.timestamp)
      } as Mood;
    });
  }

  async createSymptom(symptom: InsertSymptom): Promise<Symptom> {
    const docRef = await symptomsCollection.add({
      ...symptom,
      timestamp: dateToTimestamp(new Date())
    });
    const doc = await docRef.get();
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: timestampToDate(data?.timestamp)
    } as Symptom;
  }

  async getSymptomsByUserId(userId: string): Promise<Symptom[]> {
    const snapshot = await symptomsCollection
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: timestampToDate(data.timestamp)
      } as Symptom;
    });
  }

  async createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric> {
    const docRef = await healthMetricsCollection.add({
      ...metric,
      timestamp: dateToTimestamp(new Date())
    });
    const doc = await docRef.get();
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: timestampToDate(data?.timestamp)
    } as HealthMetric;
  }

  async getHealthMetricsByUserId(userId: string): Promise<HealthMetric[]> {
    const snapshot = await healthMetricsCollection
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: timestampToDate(data.timestamp)
      } as HealthMetric;
    });
  }
}

export const storage = new FirestoreStorage();