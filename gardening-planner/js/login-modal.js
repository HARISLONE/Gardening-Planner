// js/login-modal.js
import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

// Success state function
function showSuccess(msg = "Login successful! Redirecting...") {
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginForm").style.display = "none";
  const modalSuccess = document.getElementById("modalSuccess");
  modalSuccess.innerHTML = `
    <span class="success-icon">
      <svg width="23" height="23" fill="none" viewBox="0 0 23 23">
        <circle cx="11.5" cy="11.5" r="11.5" fill="#47c87c"/>
        <path d="M7 12.5l3 2.2 5-5.2" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </span>
    ${msg}
  `;
  modalSuccess.style.display = "flex";
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    showSuccess("Login successful! Redirecting...");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1200);
  } catch (err) {
    loginMessage.style.color = "red";
    loginMessage.innerText = err.message.replace("Firebase:", "");
  }
});
