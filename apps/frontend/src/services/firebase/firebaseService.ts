import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
  onAuthStateChanged,
  updateProfile,
  updatePassword as firebaseUpdatePassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { auth, db } from "./config";

// Auth service class
export class FirebaseAuthService {
  static async signInWithEmail(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  }

  static async signUpWithEmail(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }

    return userCredential.user;
  }

  static async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    console.log("signInWithGoogle: ", userCredential);

    return userCredential.user;
  }

  static async signOut(): Promise<void> {
    await signOut(auth);
    Cookies.remove("token");
  }

  static async updateUserProfile(
    displayName: string,
    photoURL?: string,
  ): Promise<void> {
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
      throw new Error("No authenticated user");
    }
    return auth.currentUser.getIdToken();
  }

  static async getIdTokenResult(): Promise<unknown> {
    if (!auth.currentUser) {
      throw new Error("No authenticated user");
    }
    return auth.currentUser.getIdTokenResult();
  }

  // Method to save token to cookie for backend API calls
  static saveTokenToCookie(token: string): void {
    Cookies.set("token", token, { expires: 1 }); // 1 day expiration
  }

  // Method to get token from cookie
  static getTokenFromCookie(): string | undefined {
    return Cookies.get("token");
  }

  // Method to remove token from cookie
  static removeTokenFromCookie(): void {
    Cookies.remove("token");
  }

  // Decode JWT token to get user info
  static decodeToken(token: string): unknown {
    try {
      return jwtDecode(token);
    } catch (e) {
      console.error("Error decoding token:", e);
      return null;
    }
  }

  // Check if token is expired
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode(token) as { exp?: number };
      const currentTime = Math.floor(Date.now() / 1000);
      return (decoded.exp ?? 0) < currentTime;
    } catch {
      return true;
    }
  }
}

// Firestore service for user profile data
export class FirestoreService {
  static async getUserProfile(uid: string): Promise<any> {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  }

  static async saveUserProfile(uid: string, data: any): Promise<void> {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, data, { merge: true });
  }
}
