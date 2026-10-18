import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firestore is only used by the Expo signup form. The config comes from
// VITE_FIREBASE_* env vars (.env locally, repository variables in CI); when
// they are absent the app must still build and run, so `db` is null and the
// form reports that signups are unavailable instead of crashing the site.
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const configured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
const app = configured ? (getApps()[0] || initializeApp(firebaseConfig)) : null;
export const db = app ? getFirestore(app) : null;
