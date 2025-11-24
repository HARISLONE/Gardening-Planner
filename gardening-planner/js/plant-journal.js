// js/plant-journal.js
import { db } from "./firebase-config.js";
import {
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Export this as a true module function!
export function openJournalModal(plantId) {
  // Make sure all DOM elements exist
  const journalModal = document.getElementById("plantJournalModal");
  const closeJournalModal = document.getElementById("closeJournalModal");
  const journalForm = document.getElementById("journalForm");
  const journalTimeline = document.getElementById("journalTimeline");
  const journalModalMsg = document.getElementById("journalModalMsg");

  if (
    !journalModal ||
    !closeJournalModal ||
    !journalForm ||
    !journalTimeline ||
    !journalModalMsg
  ) {
    alert("Some required elements for the journal modal are missing!");
    return;
  }

  let currentJournalPlantId = plantId;

  // Reset and show modal
  journalForm.reset();
  journalModalMsg.textContent = "";
  journalModal.classList.add("active");
  loadJournalEntries(currentJournalPlantId);

  // Only add event listeners ONCE!
  if (!journalModal._listenersAttached) {
    closeJournalModal.onclick = () => journalModal.classList.remove("active");
    journalModal.onclick = (e) => {
      if (e.target === journalModal) journalModal.classList.remove("active");
    };
    journalForm.onsubmit = async (e) => {
      e.preventDefault();
      if (!currentJournalPlantId) return;
      journalModalMsg.textContent = "Saving...";
      try {
        const plantRef = doc(db, "plants", currentJournalPlantId);
        const plantDoc = await getDoc(plantRef);
        if (!plantDoc.exists()) throw new Error("Plant not found");
        const data = plantDoc.data();
        const journal = data.journal || [];
        const now = new Date();
        journal.push({
          entry: journalForm.entry.value,
          photo: journalForm.photo.value,
          date: now.toLocaleDateString() + " " + now.toLocaleTimeString(),
        });
        await updateDoc(plantRef, { journal });
        journalModalMsg.textContent = "Log added!";
        loadJournalEntries(currentJournalPlantId);
        journalForm.reset();
        setTimeout(() => (journalModalMsg.textContent = ""), 1000);
      } catch (err) {
        journalModalMsg.textContent = "Error: " + err.message;
      }
    };
    journalModal._listenersAttached = true;
  }

  // Loader and render logic
  async function loadJournalEntries(plantId) {
    journalTimeline.innerHTML =
      "<div style='text-align:center;'>Loading...</div>";
    try {
      const plantDoc = await getDoc(doc(db, "plants", plantId));
      if (!plantDoc.exists()) {
        journalTimeline.innerHTML = "<p>No journal found.</p>";
        return;
      }
      const data = plantDoc.data();
      const journal = data.journal || [];
      if (!journal.length) {
        journalTimeline.innerHTML =
          "<p>No logs yet. Add your first log below!</p>";
        return;
      }
      // Show newest first
      journalTimeline.innerHTML = journal
        .slice(-10)
        .reverse()
        .map(
          (entry) => `
            <div class="journal-entry">
              <div><b>${entry.date || ""}</b></div>
              <div>${entry.entry}</div>
              ${
                entry.photo
                  ? `<img src="${entry.photo}" style="max-width:90px;max-height:70px;margin:5px 0;border-radius:9px;" />`
                  : ""
              }
            </div>
          `
        )
        .join("");
    } catch (err) {
      journalTimeline.innerHTML = "<p>Error loading journal.</p>";
    }
  }
}
