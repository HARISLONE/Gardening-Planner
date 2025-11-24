// DOM Elements
const addPlantForm = document.getElementById("addPlantForm");
const plantNameInput = document.getElementById("plantName");
const wateringDateInput = document.getElementById("wateringDate");
const plantsList = document.getElementById("plants");

// LocalStorage key
const STORAGE_KEY = "gardeningPlannerPlants";

// Load plants from LocalStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedPlants = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  savedPlants.forEach(renderPlant);
});

// Handle plant form submission
addPlantForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const plantName = plantNameInput.value.trim();
  const wateringDate = wateringDateInput.value;

  if (!plantName || !wateringDate) return;

  const plant = { id: Date.now(), plantName, wateringDate };

  renderPlant(plant);
  savePlantToStorage(plant);
  addPlantForm.reset();
});

// Render a single plant
function renderPlant(plant) {
  const li = document.createElement("li");
  li.textContent = `${plant.plantName} - Next Watering: ${plant.wateringDate}`;
  plantsList.appendChild(li);
}

// Save plant to LocalStorage
function savePlantToStorage(plant) {
  const plants = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  plants.push(plant);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
}
