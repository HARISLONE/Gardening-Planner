// js/register-modal.js
import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

// Success state function
function showSuccess(msg = "Registration successful! Redirecting...") {
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

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    showSuccess("Registration successful! Redirecting...");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1400);
  } catch (err) {
    registerMessage.style.color = "red";
    registerMessage.innerText = err.message.replace("Firebase:", "");
  }
});
