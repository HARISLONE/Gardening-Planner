// js/landing-modal.js

// Wait for DOM to load before running code!
document.addEventListener("DOMContentLoaded", function () {
  const modalBg = document.getElementById("authModal");
  const openAuthModalBtn = document.getElementById("openAuthModal");
  const closeAuthModalBtn = document.getElementById("closeAuthModal");
  const startFreeBtn = document.getElementById("startFreeBtn");
  const signUpFreeBtn = document.getElementById("signUpFreeBtn");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  function openModal(showRegisterForm = false) {
    modalBg.style.display = "flex";
    if (showRegisterForm) {
      loginForm.style.display = "none";
      registerForm.style.display = "block";
    } else {
      loginForm.style.display = "block";
      registerForm.style.display = "none";
    }
    // Attach modal "Register"/"Login" link handlers every time modal opens!
    attachSwitchLinks();
  }

  function closeModal() {
    modalBg.style.display = "none";
  }

  // Attach main modal openers
  if (openAuthModalBtn) openAuthModalBtn.onclick = () => openModal(false);
  if (startFreeBtn) startFreeBtn.onclick = () => openModal(true);
  if (signUpFreeBtn) signUpFreeBtn.onclick = () => openModal(true);

  // Attach modal closer (the cross button)
  if (closeAuthModalBtn) closeAuthModalBtn.onclick = closeModal;

  // Allow closing by clicking background
  modalBg.onclick = (e) => {
    if (e.target === modalBg) closeModal();
  };

  // This function attaches "Register" / "Login" toggling inside the modal
  function attachSwitchLinks() {
    // These get created fresh every time
    const showRegister = document.getElementById("showRegister");
    const showLogin = document.getElementById("showLogin");

    if (showRegister) {
      showRegister.onclick = (e) => {
        e.preventDefault();
        openModal(true); // Show Register form
      };
    }
    if (showLogin) {
      showLogin.onclick = (e) => {
        e.preventDefault();
        openModal(false); // Show Login form
      };
    }
  }
});
