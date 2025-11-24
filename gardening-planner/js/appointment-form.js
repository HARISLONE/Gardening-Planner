import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("appointmentForm");
  if (!form) return; // Prevent error if form doesn't exist on the page
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("appointmentName").value.trim();
    const phone = document.getElementById("appointmentPhone").value.trim();
    const email = document.getElementById("appointmentEmail").value.trim();
    const message = document.getElementById("appointmentMessage").value.trim();

    try {
      await addDoc(collection(db, "appointments"), {
        name,
        phone,
        email,
        message,
        createdAt: serverTimestamp(),
      });
      alert("Thank you! Your appointment request has been submitted.");
      form.reset();
    } catch (err) {
      alert("Error submitting your request. Please try again.");
      console.error(err);
    }
  });
});
