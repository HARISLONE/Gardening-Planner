// js/auth.js
import { auth } from "../firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Sign up user
export function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Login user
export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Logout user
export function logoutUser() {
  return signOut(auth);
}

// Observe auth state
export function observeAuthState(callback) {
  onAuthStateChanged(auth, callback);
}
