import { auth } from './config';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from "firebase/auth";

// This function now returns a boolean indicating if the user was new
const registerUserInDb = async (uid: string, email: string | null, displayName: string | null): Promise<boolean> => {
  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, email, displayName }),
    });
    // A 201 status means a new user was created.
    return response.status === 201;
  } catch (error) {
    console.error("Failed to register user in DB", error);
    return false;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    const user = result.user;
    // We check if the user was newly created in our database
    const isNewUser = await registerUserInDb(user.uid, user.email, user.displayName);
    return { user, isNewUser };
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    await updateProfile(user, { displayName });
    // A user signing up with email is always a new user
    await registerUserInDb(user.uid, user.email, displayName);
    return { user, isNewUser: true };
  } catch (error) {
    console.error("Error signing up with email", error);
    throw error;
  }
};

export const signInWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOut = () => {
  return firebaseSignOut(auth);
};
