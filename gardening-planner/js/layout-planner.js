// layout-planner.js
import { db, auth } from "./firebase-config.js";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const rowsInput = document.getElementById("layoutRows");
const colsInput = document.getElementById("layoutCols");
const updateBtn = document.getElementById("updateLayoutGrid");
const clearBtn = document.getElementById("clearLayoutGrid");
const saveBtn = document.getElementById("saveLayoutGrid");
const loadBtn = document.getElementById("loadLayoutGrid");
const exportBtn = document.getElementById("exportLayoutGrid");
const importBtn = document.getElementById("importLayoutGrid");
const plantListDiv = document.getElementById("plantListForLayout");
const gridDiv = document.getElementById("gardenGrid");

let state = {
  rows: parseInt(rowsInput.value) || 4,
  cols: parseInt(colsInput.value) || 6,
  grid: [],
  myPlants: [],
  selectedPlant: null,
};

// ---- UTILITIES ----

// Flatten grid (Firestore does not support nested arrays)
function flattenGrid(grid) {
  const flat = {};
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c]) flat[`${r},${c}`] = grid[r][c];
    }
  }
  return flat;
}

// Unflatten grid
function unflattenGrid(flat, rows, cols) {
  let grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  for (const key in flat) {
    const [r, c] = key.split(",").map(Number);
    if (r < rows && c < cols) grid[r][c] = flat[key];
  }
  return grid;
}

// ---- RENDER PLANT SIDEBAR ----
function renderPlantSidebar() {
  plantListDiv.innerHTML =
    state.myPlants
      .map(
        (plant) => `
      <div class="plant-layout-item${
        state.selectedPlant && state.selectedPlant.id === plant.id
          ? " selected"
          : ""
      }"
        data-id="${plant.id}" draggable="true">
        <img class="plant-layout-img" src="${plant.image}" alt="${
          plant.name
        }" />
        <span>${plant.name}</span>
      </div>`
      )
      .join("") || "<div>No plants yet. Add some in 'My Plants'!</div>";

  // Plant selection
  plantListDiv.querySelectorAll(".plant-layout-item").forEach((item) => {
    item.onclick = () => {
      if (state.selectedPlant && state.selectedPlant.id === item.dataset.id) {
        state.selectedPlant = null;
      } else {
        state.selectedPlant = state.myPlants.find(
          (p) => p.id === item.dataset.id
        );
      }
      renderPlantSidebar();
    };
    item.ondragstart = (e) => {
      e.dataTransfer.setData("plant-index", item.dataset.id);
    };
  });
}

// ---- RENDER GRID ----
function renderGrid() {
  gridDiv.innerHTML = "";
  gridDiv.style.gridTemplateRows = `repeat(${state.rows}, 1fr)`;
  gridDiv.style.gridTemplateColumns = `repeat(${state.cols}, 1fr)`;

  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const cell = document.createElement("div");
      cell.className = "garden-cell";
      cell.dataset.row = r;
      cell.dataset.col = c;

      if (state.grid[r][c]) {
        const p = state.grid[r][c];
        cell.innerHTML = `
          <img src="${p.image}" alt="${p.name}" draggable="true" />
          <span class="cell-plant-name">${p.name}</span>
          <button class="remove-plant-btn" title="Remove">&times;</button>
        `;
      }

      // Cell click to place
      cell.onclick = (e) => {
        if (e.target.classList.contains("remove-plant-btn")) return;
        if (!state.selectedPlant) return;
        state.grid[r][c] = { ...state.selectedPlant };
        renderGrid();
      };

      // Remove plant
      cell.querySelector(".remove-plant-btn")?.addEventListener("click", () => {
        state.grid[r][c] = null;
        renderGrid();
      });

      // Drag plant from cell
      cell.ondragstart = (e) => {
        if (!state.grid[r][c]) return;
        e.dataTransfer.setData("cell", JSON.stringify({ r, c }));
      };
      cell.draggable = !!state.grid[r][c];

      // Drag-over and drop for sidebar plants
      cell.ondragover = (e) => e.preventDefault();
      cell.ondrop = (e) => {
        // Drop from sidebar
        const plantId = e.dataTransfer.getData("plant-index");
        if (plantId) {
          const p = state.myPlants.find((p) => p.id === plantId);
          if (p) {
            state.grid[r][c] = { ...p };
            renderGrid();
          }
          return;
        }
        // Drag within grid (swap)
        const from = JSON.parse(e.dataTransfer.getData("cell") || "{}");
        if (typeof from.r === "number" && typeof from.c === "number") {
          [state.grid[r][c], state.grid[from.r][from.c]] = [
            state.grid[from.r][from.c],
            state.grid[r][c],
          ];
          renderGrid();
        }
      };

      gridDiv.appendChild(cell);
    }
  }
}

// ---- LOAD USER PLANTS FROM FIRESTORE ----
async function loadMyPlants() {
  const user = auth.currentUser;
  if (!user) {
    plantListDiv.innerHTML = "<p>Please login to see your plants.</p>";
    return;
  }
  const q = query(collection(db, "plants"), where("uid", "==", user.uid));
  const snap = await getDocs(q);
  state.myPlants = [];
  snap.forEach((doc) => {
    state.myPlants.push({
      id: doc.id,
      name: doc.data().name,
      image:
        doc.data().image ||
        "https://cdn-icons-png.flaticon.com/512/2909/2909767.png",
    });
  });
  renderPlantSidebar();
}

// ---- UPDATE GRID SIZE ----
function updateGridConfig() {
  state.rows = Math.max(2, Math.min(10, +rowsInput.value));
  state.cols = Math.max(2, Math.min(10, +colsInput.value));
  // Resize grid (keep existing plants)
  let newGrid = Array.from({ length: state.rows }, (_, r) =>
    Array.from({ length: state.cols }, (_, c) =>
      state.grid[r] && state.grid[r][c] ? state.grid[r][c] : null
    )
  );
  state.grid = newGrid;
  renderGrid();
}

// ---- CLEAR ----
function clearGrid() {
  if (confirm("Clear your entire garden layout?")) {
    state.grid = Array.from({ length: state.rows }, () =>
      Array(state.cols).fill(null)
    );
    renderGrid();
  }
}

// ---- SAVE to Firestore ----
async function saveToFirestore() {
  const user = auth.currentUser;
  if (!user) return alert("Please log in to save your layout.");
  try {
    const layoutObj = {
      rows: state.rows,
      cols: state.cols,
      grid: flattenGrid(state.grid),
    };
    await setDoc(doc(db, "garden_layouts", user.uid), layoutObj);
    alert("Layout saved to cloud!");
  } catch (err) {
    alert("Failed to save layout: " + err.message);
  }
}

// ---- LOAD from Firestore ----
async function loadFromFirestore() {
  const user = auth.currentUser;
  if (!user) return alert("Please log in to load your layout.");
  try {
    const snap = await getDoc(doc(db, "garden_layouts", user.uid));
    if (!snap.exists()) return alert("No layout found.");
    const data = snap.data();
    state.rows = data.rows;
    state.cols = data.cols;
    rowsInput.value = state.rows;
    colsInput.value = state.cols;
    state.grid = unflattenGrid(data.grid, data.rows, data.cols);
    renderGrid();
    alert("Loaded!");
  } catch (err) {
    alert("Failed to load: " + err.message);
  }
}

// ---- EXPORT JSON ----
function exportLayout() {
  let exportObj = {
    rows: state.rows,
    cols: state.cols,
    grid: flattenGrid(state.grid),
  };
  let blob = new Blob([JSON.stringify(exportObj, null, 2)], {
    type: "application/json",
  });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "garden-layout.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ---- IMPORT JSON ----
function importLayout() {
  let inp = document.createElement("input");
  inp.type = "file";
  inp.accept = ".json,application/json";
  inp.onchange = (e) => {
    let file = inp.files[0];
    let reader = new FileReader();
    reader.onload = (e2) => {
      try {
        let d = JSON.parse(reader.result);
        state.rows = d.rows;
        state.cols = d.cols;
        rowsInput.value = d.rows;
        colsInput.value = d.cols;
        state.grid = unflattenGrid(d.grid, d.rows, d.cols);
        renderGrid();
        alert("Layout imported!");
      } catch (err) {
        alert("Invalid layout file.");
      }
    };
    reader.readAsText(file);
  };
  inp.click();
}

// ---- INIT ----
export async function initLayoutPlanner() {
  // Show section and sidebar
  document.getElementById("layoutPlannerSection").style.display = "block";
  await loadMyPlants();

  // Initial grid setup
  state.rows = parseInt(rowsInput.value) || 4;
  state.cols = parseInt(colsInput.value) || 6;
  state.grid = Array.from({ length: state.rows }, () =>
    Array(state.cols).fill(null)
  );
  renderGrid();

  // Events
  updateBtn.onclick = updateGridConfig;
  clearBtn.onclick = clearGrid;
  saveBtn.onclick = saveToFirestore;
  loadBtn.onclick = loadFromFirestore;
  exportBtn.onclick = exportLayout;
  importBtn.onclick = importLayout;
}
