import { db, auth } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  orderBy,
  query,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

export function initCommunity() {
  const section = document.getElementById("communitySection");
  section.style.display = "block";

  const form = document.getElementById("communityForm");
  const textarea = form.querySelector("textarea[name='message']");
  const messagesDiv = document.getElementById("communityMessages");

  // Load and render community messages
  async function loadMessages() {
    messagesDiv.innerHTML = "<div style='text-align:center;'>Loading...</div>";
    const q = query(collection(db, "community"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    messagesDiv.innerHTML =
      [...snap.docs]
        .map((doc) => {
          const d = doc.data();
          return `
          <div class="community-msg">
            <b>${d.username || "Anonymous"}</b>
            <span class="community-date">${
              d.createdAt?.toDate().toLocaleString() || ""
            }</span>
            <div class="community-text">${d.message}</div>
          </div>
        `;
        })
        .join("") || "<p>No messages yet. Be the first to post!</p>";
  }

  // Post new message
  form.onsubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!textarea.value.trim()) return;
    await addDoc(collection(db, "community"), {
      message: textarea.value,
      createdAt: serverTimestamp(),
      uid: user ? user.uid : null,
      username:
        user && user.displayName
          ? user.displayName
          : user && user.email
          ? user.email.split("@")[0]
          : "Guest",
    });
    textarea.value = "";
    loadMessages();
  };

  // Initial load
  loadMessages();
}
