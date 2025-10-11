import { initializeApp, getApp, getApps, FirebaseOptions } from "firebase/app";

// Your web app's Firebase configuration
// This is a public configuration and is safe to be in the source code
export const firebaseConfig: FirebaseOptions = {
  "projectId": "studio-3466326108-83cc8",
  "appId": "1:336307476837:web:af1ba678790bbd52eb298c",
  "apiKey": "AIzaSyA_qm_99FT-q68EgDzVVywh5bCXJHQNG7o",
  "authDomain": "studio-3466326108-83cc8.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "336307476837",
  "storageBucket": "studio-3466326108-83cc8.appspot.com"
};

// Initialize Firebase
export function initializeFirebase() {
  if (typeof window !== "undefined") {
    // Client-side initialization
    return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  } else {
    // Server-side initialization
    return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
}
