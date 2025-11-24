import { db, auth } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

export function initReminders() {
  const remindersList = document.getElementById("remindersList");
  const addReminderBtn = document.getElementById("addReminderBtn");
  const reminderModal = document.getElementById("reminderModal");
  const closeReminderModal = document.getElementById("closeReminderModal");
  const reminderForm = document.getElementById("reminderForm");
  const reminderModalTitle = document.getElementById("reminderModalTitle");
  const reminderModalMsg = document.getElementById("reminderModalMsg");
  let editReminderId = null;

  addReminderBtn.onclick = () => {
    reminderForm.reset();
    reminderModalTitle.textContent = "Add Reminder";
    editReminderId = null;
    reminderModalMsg.textContent = "";
    reminderModal.classList.add("active");
  };
  closeReminderModal.onclick = () => {
    reminderModal.classList.remove("active");
  };
  reminderModal.onclick = (e) => {
    if (e.target === reminderModal) reminderModal.classList.remove("active");
  };

  async function loadReminders() {
    const user = auth.currentUser;
    if (!user) {
      remindersList.innerHTML = "<p>Please login to view your reminders.</p>";
      return;
    }
    const q = query(collection(db, "reminders"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    let html = "";
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      html += `
        <div class="reminder-card">
          <div class="reminder-card-info">
            <span class="reminder-type">${data.type}</span>
            <span class="reminder-date">${new Date(
              data.date
            ).toLocaleDateString()}</span>
            <div class="reminder-notes">${data.notes || ""}</div>
          </div>
          <div class="reminder-card-actions">
            <button class="edit-reminder-btn" data-id="${
              docSnap.id
            }" title="Edit"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-reminder-btn" data-id="${
              docSnap.id
            }" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `;
    });
    remindersList.innerHTML =
      html || "<p>No reminders yet. Add your first!</p>";

    // Event handlers for edit/delete
    remindersList.querySelectorAll(".edit-reminder-btn").forEach((btn) => {
      btn.onclick = () => editReminder(btn.dataset.id);
    });
    remindersList.querySelectorAll(".delete-reminder-btn").forEach((btn) => {
      btn.onclick = () => deleteReminder(btn.dataset.id);
    });
  }

  // Add/Update Reminder
  reminderForm.onsubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      reminderModalMsg.textContent = "Please login.";
      return;
    }
    const data = {
      uid: user.uid,
      type: reminderForm.reminderType.value,
      date: reminderForm.reminderDate.value,
      notes: reminderForm.reminderNotes.value,
      addedAt: new Date(),
    };
    try {
      if (editReminderId) {
        await updateDoc(doc(db, "reminders", editReminderId), data);
        reminderModalMsg.textContent = "Reminder updated!";
      } else {
        await addDoc(collection(db, "reminders"), data);
        reminderModalMsg.textContent = "Reminder added!";
      }
      setTimeout(() => {
        reminderModal.classList.remove("active");
        loadReminders();
      }, 800);
    } catch (err) {
      reminderModalMsg.textContent = "Error: " + err.message;
    }
  };

  // Edit Reminder
  async function editReminder(id) {
    const docSnap = await getDoc(doc(db, "reminders", id));
    if (!docSnap.exists()) return;
    const data = docSnap.data();
    reminderForm.reminderType.value = data.type || "Water";
    reminderForm.reminderDate.value = data.date
      ? data.date.substring(0, 10)
      : "";
    reminderForm.reminderNotes.value = data.notes || "";
    reminderModalTitle.textContent = "Edit Reminder";
    editReminderId = id;
    reminderModalMsg.textContent = "";
    reminderModal.classList.add("active");
  }

  // Delete Reminder
  async function deleteReminder(id) {
    if (confirm("Delete this reminder?")) {
      await deleteDoc(doc(db, "reminders", id));
      loadReminders();
    }
  }

  // Initial load
  auth.onAuthStateChanged((user) => {
    if (user) loadReminders();
  });
}
