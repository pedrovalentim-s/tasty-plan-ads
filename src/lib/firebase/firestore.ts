import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from './config';
import type { Plan } from '../definitions';

export const STRATEGIES_COLLECTION = 'strategies';

export interface StrategyRecord {
  id: string;
  clientName: string;
  planData: Plan;
  createdAt: string;
  updatedAt: string;
}

export async function createStrategy(planData: Plan): Promise<string> {
  const newId = planData.id || crypto.randomUUID();
  const docRef = doc(db, STRATEGIES_COLLECTION, newId);
  const now = new Date().toISOString();
  
  planData.id = newId;
  const record: StrategyRecord = {
    id: newId,
    clientName: planData.summary.clientName || 'Novo Cliente',
    planData: planData,
    createdAt: now,
    updatedAt: now,
  };
  
  await setDoc(docRef, record);
  return newId;
}

export async function updateStrategy(id: string, planData: Plan): Promise<void> {
  const docRef = doc(db, STRATEGIES_COLLECTION, id);
  const now = new Date().toISOString();
  await setDoc(docRef, {
    clientName: planData.summary.clientName || 'Cliente sem nome',
    planData: planData,
    updatedAt: now,
  }, { merge: true });
}

export async function getStrategy(id: string): Promise<StrategyRecord | null> {
  const docRef = doc(db, STRATEGIES_COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshot.data() as StrategyRecord;
  }
  return null;
}

export async function getStrategies(): Promise<StrategyRecord[]> {
  const collRef = collection(db, STRATEGIES_COLLECTION);
  const q = query(collRef, orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as StrategyRecord);
}

export async function deleteStrategy(id: string): Promise<void> {
  const docRef = doc(db, STRATEGIES_COLLECTION, id);
  await deleteDoc(docRef);
}
