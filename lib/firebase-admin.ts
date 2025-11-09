import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

type ServiceAccountEnv = {
  projectId?: string | null;
  clientEmail?: string | null;
  privateKey?: string | null;
};

function coerceServiceAccountFromEnv(): ServiceAccountEnv | null {
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (rawServiceAccount) {
    try {
      const parsed = JSON.parse(rawServiceAccount);

      return {
        projectId: parsed.project_id || parsed.projectId || null,
        clientEmail: parsed.client_email || parsed.clientEmail || null,
        privateKey: (parsed.private_key || parsed.privateKey || null)?.replace(/\\n/g, '\n'),
      };
    } catch (error) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON.', error);
    }
  }

  return {
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || null,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || null,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || null,
  };
}

function buildCredential() {
  const serviceAccount = coerceServiceAccountFromEnv();

  if (
    serviceAccount &&
    typeof serviceAccount.projectId === 'string' &&
    serviceAccount.projectId &&
    typeof serviceAccount.clientEmail === 'string' &&
    serviceAccount.clientEmail &&
    typeof serviceAccount.privateKey === 'string' &&
    serviceAccount.privateKey
  ) {
    return cert({
      projectId: serviceAccount.projectId,
      clientEmail: serviceAccount.clientEmail,
      privateKey: serviceAccount.privateKey,
    });
  }

  console.warn('Falling back to application default credentials for Firebase Admin.');
  try {
    return applicationDefault();
  } catch (error) {
    console.error('Firebase Admin credentials are not configured.');
    throw error;
  }
}

const credential = buildCredential();

// Initialize Firebase Admin
const app = getApps().length === 0 ? initializeApp({ credential }) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };