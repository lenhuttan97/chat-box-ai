import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  type User,
  onAuthStateChanged,
  updateProfile,
  updatePassword as firebaseUpdatePassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

// Firebase configuration - should be in .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth service class
export class FirebaseAuthService {
  static async signInWithEmail(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  static async signUpWithEmail(email: string, password: string, displayName?: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    return userCredential.user;
  }

  static async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  }

  static async signOut(): Promise<void> {
    await signOut(auth);
    Cookies.remove('token');
  }

  static async updateUserProfile(displayName: string, photoURL?: string): Promise<void> {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName, photoURL });
    }
  }

  static async updatePassword(newPassword: string): Promise<void> {
    if (auth.currentUser) {
      await firebaseUpdatePassword(auth.currentUser, newPassword);
    }
  }

  static async sendPasswordResetEmail(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  static async getIdToken(): Promise<string> {
    if (!auth.currentUser) {
      throw new Error('No authenticated user');
    }
    return auth.currentUser.getIdToken();
  }

  static async getIdTokenResult(): Promise<any> {
    if (!auth.currentUser) {
      throw new Error('No authenticated user');
    }
    return auth.currentUser.getIdTokenResult();
  }

  // Method to save token to cookie for backend API calls
  static saveTokenToCookie(token: string): void {
    Cookies.set('token', token, { expires: 1 }); // 1 day expiration
  }

  // Method to get token from cookie
  static getTokenFromCookie(): string | undefined {
    return Cookies.get('token');
  }

  // Method to remove token from cookie
  static removeTokenFromCookie(): void {
    Cookies.remove('token');
  }

  // Decode JWT token to get user info
  static decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Check if token is expired
  static isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}

// Firestore service for user profile data
export class FirestoreService {
  static async getUserProfile(uid: string): Promise<any> {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  }

  static async saveUserProfile(uid: string, data: any): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, data, { merge: true });
  }
}