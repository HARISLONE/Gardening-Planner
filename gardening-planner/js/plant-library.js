import { db, auth } from "./firebase-config.js";
import { openJournalModal } from "./plant-journal.js";

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

export function initPlantLibrary() {
  const section = document.getElementById("plantLibrarySection");
  section.style.display = "block";
  const plantList = document.getElementById("plantLibraryList");
  const addPlantBtn = document.getElementById("addPlantBtn");
  const plantModal = document.getElementById("plantModal");
  const closePlantModal = document.getElementById("closePlantModal");
  const plantForm = document.getElementById("plantForm");
  const plantModalTitle = document.getElementById("plantModalTitle");
  const plantModalMsg = document.getElementById("plantModalMsg");
  let editPlantId = null;

  // Health modal
  const healthModal = document.getElementById("plantHealthModal");
  const closeHealthModal = document.getElementById("closeHealthModal");
  const healthForm = document.getElementById("plantHealthForm");
  const healthModalMsg = document.getElementById("healthModalMsg");
  let healthPlantId = null;

  // Show plant modal
  addPlantBtn.onclick = () => {
    plantForm.reset();
    plantModalTitle.textContent = "Add Plant";
    editPlantId = null;
    plantModalMsg.textContent = "";
    plantModal.classList.add("active");
  };
  closePlantModal.onclick = () => plantModal.classList.remove("active");
  plantModal.onclick = (e) => {
    if (e.target === plantModal) plantModal.classList.remove("active");
  };

  // Show health modal
  closeHealthModal.onclick = () => healthModal.classList.remove("active");
  healthModal.onclick = (e) => {
    if (e.target === healthModal) healthModal.classList.remove("active");
  };

  // RENDER Plant Cards
  async function loadPlants() {
    const user = auth.currentUser;
    if (!user) {
      plantList.innerHTML = "<p>Please login to view your plants.</p>";
      return;
    }
    const q = query(collection(db, "plants"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    let cards = [];
    for (const docSnap of querySnapshot.docs.reverse()) {
      const data = docSnap.data();
      // health history
      const healthHistory = data.healthHistory || [];
      const latestHealth = healthHistory[healthHistory.length - 1];
      // health badge
      let badge = "";
      if (latestHealth) {
        let color = "#43b56a";
        if (latestHealth.status === "Diseased") color = "#e84545";
        else if (latestHealth.status === "Needs Attention") color = "#ffd900";
        else if (latestHealth.status === "Recovering") color = "#53b6e8";
        badge = `<span class="plant-health-badge" style="background:${color};">${latestHealth.status}</span>`;
      }
      // timeline
      let timeline = "";
      if (healthHistory.length) {
        timeline = `<div class="plant-health-timeline">
          ${healthHistory
            .slice(-3)
            .reverse()
            .map(
              (h) => `
            <div class="timeline-entry">
              <b>${h.status}</b> <span>${h.date || ""}</span>
              <div class="timeline-note">${h.note || ""}</div>
            </div>
          `
            )
            .join("")}
        </div>`;
      }

      // --- Plant Card with all actions ---
      cards.push(`
        <div class="plant-card">
          <div class="plant-img-wrap">
            <img src="${
              data.image ||
              "https://cdn-icons-png.flaticon.com/512/2909/2909767.png"
            }" alt="plant" class="plant-card-img" />
          </div>
          <div class="plant-card-details">
            <div class="plant-card-title-row">
              <h4 class="plant-card-name">${data.name}</h4>
              <div class="plant-card-actions">
                <button class="edit-btn" data-id="${
                  docSnap.id
                }" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn" data-id="${
                  docSnap.id
                }" title="Delete"><i class="fa-solid fa-trash"></i></button>
                <button class="health-btn" data-id="${
                  docSnap.id
                }" title="Update Health"><i class="fa-solid fa-stethoscope"></i></button>
                <button class="journal-btn" data-id="${
                  docSnap.id
                }" title="Journal"><i class="fa-solid fa-book"></i></button>
              </div>
            </div>
            <div class="plant-card-info">
              <span class="plant-species"><b>Species:</b> ${
                data.species || "-"
              }</span>
              <span class="plant-location"><b>Location:</b> ${
                data.location || "-"
              }</span>
            </div>
            <div class="plant-notes">${
              data.notes ? "Notes: " + data.notes : ""
            }</div>
            ${badge}
            ${timeline}
          </div>
        </div>
      `);
    }
    plantList.innerHTML =
      cards.join("") || "<p>No plants yet. Add your first!</p>";

    // Attach listeners
    plantList
      .querySelectorAll(".edit-btn")
      .forEach((btn) => (btn.onclick = () => editPlant(btn.dataset.id)));
    plantList
      .querySelectorAll(".delete-btn")
      .forEach((btn) => (btn.onclick = () => deletePlant(btn.dataset.id)));
    plantList
      .querySelectorAll(".health-btn")
      .forEach((btn) => (btn.onclick = () => openHealthModal(btn.dataset.id)));
    // Attach Journal Button Listener here if needed
    plantList
      .querySelectorAll(".journal-btn")
      .forEach((btn) => (btn.onclick = () => openJournalModal(btn.dataset.id)));
  }

  // Add/Update Plant
  plantForm.onsubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      plantModalMsg.textContent = "Please login.";
      return;
    }
    const data = {
      uid: user.uid,
      name: plantForm.plantName.value,
      species: plantForm.plantSpecies.value,
      location: plantForm.plantLocation.value,
      image: plantForm.plantImage.value,
      notes: plantForm.plantNotes.value,
      addedAt: new Date(),
    };
    try {
      if (editPlantId) {
        await updateDoc(doc(db, "plants", editPlantId), data);
        plantModalMsg.textContent = "Plant updated!";
      } else {
        await addDoc(collection(db, "plants"), data);
        plantModalMsg.textContent = "Plant added!";
      }
      setTimeout(() => {
        plantModal.classList.remove("active");
        loadPlants();
      }, 800);
    } catch (err) {
      plantModalMsg.textContent = "Error: " + err.message;
    }
  };

  // Edit Plant (for modal)
  async function editPlant(id) {
    const docSnap = await getDoc(doc(db, "plants", id));
    if (!docSnap.exists()) return;
    const data = docSnap.data();
    plantForm.plantName.value = data.name;
    plantForm.plantSpecies.value = data.species || "";
    plantForm.plantLocation.value = data.location || "";
    plantForm.plantImage.value = data.image || "";
    plantForm.plantNotes.value = data.notes || "";
    plantModalTitle.textContent = "Edit Plant";
    editPlantId = id;
    plantModalMsg.textContent = "";
    plantModal.classList.add("active");
  }

  // Delete Plant
  async function deletePlant(id) {
    if (confirm("Delete this plant?")) {
      await deleteDoc(doc(db, "plants", id));
      loadPlants();
    }
  }

  // --- HEALTH MODAL LOGIC ---
  async function openHealthModal(id) {
    healthForm.reset();
    healthModalMsg.textContent = "";
    healthPlantId = id;
    healthModal.classList.add("active");
  }

  healthForm.onsubmit = async (e) => {
    e.preventDefault();
    if (!healthPlantId) return;
    const docRef = doc(db, "plants", healthPlantId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return;
    const data = docSnap.data();
    const healthHistory = data.healthHistory || [];
    const now = new Date();
    healthHistory.push({
      status: healthForm.status.value,
      note: healthForm.note.value,
      photo: healthForm.photo.value,
      date: now.toLocaleDateString() + " " + now.toLocaleTimeString(),
    });
    await updateDoc(docRef, { healthHistory });
    healthModalMsg.textContent = "Health status updated!";
    setTimeout(() => {
      healthModal.classList.remove("active");
      loadPlants();
    }, 600);
  };

  // Initial Load
  auth.onAuthStateChanged((user) => {
    if (user) loadPlants();
  });
}
