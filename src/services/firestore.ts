import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { HealthDataSubmission, SystemNotification } from '../types';
import { INITIAL_SUBMISSIONS, SYSTEM_NOTIFICATIONS } from '../data/mockData';

// Reusable app singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore targeting the designated database in asia-southeast1
export const db: Firestore = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);

/**
 * Validates connection to Firestore at application boot
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline or network constrained. Checking configuration.');
    }
    return false;
  }
}

/**
 * Seeds initial mock data to Firestore if collection has zero documents
 */
export async function seedInitialFirestoreData(): Promise<void> {
  try {
    const submissionsSnap = await getDocs(collection(db, 'submissions'));
    if (submissionsSnap.empty) {
      console.log('Seeding initial submissions into Firestore...');
      for (const sub of INITIAL_SUBMISSIONS) {
        await setDoc(doc(db, 'submissions', sub.id), sub);
      }
    }

    const notifSnap = await getDocs(collection(db, 'notifications'));
    if (notifSnap.empty) {
      console.log('Seeding initial notifications into Firestore...');
      for (const notif of SYSTEM_NOTIFICATIONS) {
        await setDoc(doc(db, 'notifications', notif.id), notif);
      }
    }
  } catch (err) {
    console.warn('Notice: Firestore seeding skipped or using local cache:', err);
  }
}

/**
 * Subscribes to real-time updates for healthcare submissions
 */
export function subscribeToSubmissions(
  onUpdate: (submissions: HealthDataSubmission[]) => void
): () => void {
  try {
    const submissionsCol = collection(db, 'submissions');
    return onSnapshot(
      submissionsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: HealthDataSubmission[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as HealthDataSubmission);
          });
          onUpdate(list);
        }
      },
      (err) => {
        console.warn('Real-time submissions listener fallback:', err);
      }
    );
  } catch (e) {
    console.warn('Snapshot listener could not be established:', e);
    return () => {};
  }
}

/**
 * Adds or updates a submission document in Firestore
 */
export async function persistSubmission(submission: HealthDataSubmission): Promise<void> {
  try {
    await setDoc(doc(db, 'submissions', submission.id), submission);
  } catch (error) {
    console.error('Failed to persist submission to Firestore:', error);
    throw error;
  }
}

/**
 * Updates submission verification status in Firestore
 */
export async function updateSubmissionReview(
  submissionId: string,
  status: HealthDataSubmission['status'],
  reviewedBy: string
): Promise<void> {
  try {
    const ref = doc(db, 'submissions', submissionId);
    await updateDoc(ref, {
      status,
      reviewedBy,
    });
  } catch (error) {
    console.error('Failed to update submission status in Firestore:', error);
    throw error;
  }
}
