// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCoGOUtHX-V6kWoE8OikSAgYVT2jetGoQM",
  authDomain: "gardening-planner-b0dbc.firebaseapp.com",
  databaseURL:
    "https://gardening-planner-b0dbc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gardening-planner-b0dbc",
  storageBucket: "gardening-planner-b0dbc.appspot.com",
  messagingSenderId: "649471465225",
  appId: "1:649471465225:web:b51ce2cde2f6bb9e54a5d8",
  measurementId: "G-73M84V7JCX",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
