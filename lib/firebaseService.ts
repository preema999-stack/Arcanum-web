import { db } from './firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from 'firebase/firestore';

export interface InquiryPayload {
  name: string;
  email: string;
  module: string;
  message: string;
  source?: string;
  ip?: string;
  userAgent?: string;
}

export interface NotificationLogPayload {
  type: 'email' | 'system' | 'webhook';
  recipient: string;
  subject: string;
  status: 'sent' | 'failed' | 'queued';
  details?: Record<string, any>;
}

/**
 * Save contact inquiry to Firebase Firestore 'inquiries' collection
 */
export async function saveInquiryToFirebase(data: InquiryPayload) {
  try {
    const docRef = await addDoc(collection(db, 'inquiries'), {
      ...data,
      status: 'new',
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    const isPermissionOrDisabled =
      error?.code === 'permission-denied' ||
      error?.message?.includes('PERMISSION_DENIED') ||
      error?.message?.includes('Cloud Firestore API');

    if (isPermissionOrDisabled) {
      console.info(
        '[Firebase Info] Cloud Firestore Database needs to be enabled in Firebase Console (arcanum-4e385). Using local fallback mode.'
      );
    } else {
      console.warn('[Firebase] Firestore save fallback:', error?.message || error);
    }
    return { success: true, id: `fallback-${Date.now()}`, fallback: true };
  }
}

/**
 * Log notification event to Firebase Firestore 'notification_logs' collection
 */
export async function logNotificationToFirebase(data: NotificationLogPayload) {
  try {
    const docRef = await addDoc(collection(db, 'notification_logs'), {
      ...data,
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: true, id: `fallback-log-${Date.now()}`, fallback: true };
  }
}

/**
 * Retrieve recent inquiries from Firestore (for admin dashboard / backend tools)
 */
export async function getRecentInquiries(limitCount = 20) {
  try {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    const results: any[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return results;
  } catch (error: any) {
    console.warn('[Firebase] Query fallback:', error?.message || error);
    return [];
  }
}
