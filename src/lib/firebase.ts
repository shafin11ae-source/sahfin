import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  orderBy,
  getDocFromServer,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { InquiryData, Project } from '../types';
import firebaseConfigData from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfigData) : getApp();

// Initialize Firestore with configured database ID
export const db = firebaseConfigData.firestoreDatabaseId
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// Verify connection on boot as mandated by Firebase specification
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Firestore connected successfully');
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is offline or database initializing.');
    }
  }
}
testConnection();

// --- Inquiry Database Operations ---
const INQUIRIES_COLLECTION = 'inquiries';

export async function saveInquiryToFirestore(inquiry: InquiryData): Promise<void> {
  const docId = inquiry.id || `DF-${Date.now()}`;
  const docRef = doc(db, INQUIRIES_COLLECTION, docId);
  await setDoc(docRef, {
    ...inquiry,
    id: docId,
    createdAt: inquiry.createdAt || new Date().toISOString(),
    status: inquiry.status || 'new',
  });
}

export async function fetchInquiriesFromFirestore(): Promise<InquiryData[]> {
  try {
    const q = query(collection(db, INQUIRIES_COLLECTION));
    const snapshot = await getDocs(q);
    const list: InquiryData[] = [];
    snapshot.forEach(docSnap => {
      list.push(docSnap.data() as InquiryData);
    });
    // Sort descending by date
    return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } catch (err) {
    console.warn('[Firebase] Could not fetch inquiries from Firestore, checking fallback:', err);
    return [];
  }
}

export async function updateInquiryStatusInFirestore(id: string, status: 'new' | 'reviewed' | 'archived'): Promise<void> {
  const docRef = doc(db, INQUIRIES_COLLECTION, id);
  await setDoc(docRef, { status }, { merge: true });
}

export async function deleteInquiryFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, INQUIRIES_COLLECTION, id);
  await deleteDoc(docRef);
}

// --- Portfolio Projects Database Operations ---
const PROJECTS_COLLECTION = 'projects';

export async function fetchProjectsFromFirestore(): Promise<Project[]> {
  try {
    const colRef = collection(db, PROJECTS_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return [];
    const list: Project[] = [];
    snapshot.forEach(docSnap => {
      list.push(docSnap.data() as Project);
    });
    return list;
  } catch (err) {
    console.warn('[Firebase] Could not fetch projects from Firestore:', err);
    return [];
  }
}

export async function saveProjectToFirestore(project: Project): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, project.id);
  await setDoc(docRef, project, { merge: true });
}

export async function deleteProjectFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  await deleteDoc(docRef);
}

export async function seedInitialProjectsToFirestore(projects: Project[]): Promise<void> {
  try {
    const existing = await fetchProjectsFromFirestore();
    if (existing.length === 0) {
      console.log('[Firebase] Seeding initial portfolio catalog into Firestore database...');
      for (const p of projects) {
        await saveProjectToFirestore(p);
      }
    }
  } catch (err) {
    console.warn('[Firebase] Project seeding note:', err);
  }
}
