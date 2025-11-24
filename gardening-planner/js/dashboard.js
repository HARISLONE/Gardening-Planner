import { db, auth } from "./firebase-config.js";
import { initPlantLibrary } from "./plant-library.js";
import { initReminders } from "./reminders.js";
import { initLayoutPlanner } from "./layout-planner.js";
import { initWeather } from "./weather.js";
import { initCommunity } from "./community.js";
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// WEATHER API KEY
const WEATHER_API_KEY = "5f261810e5ebbaa2ca9f6f590eefe3b8"; // <-- replace with your own
const DEFAULT_CITY = "Delhi";

// --- WEATHER FETCH UTILITY
export async function fetchWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${WEATHER_API_KEY}&units=metric`
    );
    if (!res.ok) throw new Error("No weather found");
    const data = await res.json();
    return {
      city: data.name,
      temp: Math.round(data.main.temp) + "°C",
      desc: data.weather[0].main,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      wind: data.wind.speed,
    };
  } catch (err) {
    return {
      city: city,
      temp: "—",
      desc: "Weather",
      icon: null,
      humidity: "-",
      wind: "-",
    };
  }
}

// Sidebar nav elements
const navLinks = document.querySelectorAll(".sidebar-nav li");
const sidebarUsername = document.getElementById("sidebarUsername");
const welcome = document.getElementById("dashboardWelcome");

// User display (replace with real auth user if desired)
auth.onAuthStateChanged((user) => {
  if (user) {
    let userName = "";
    if (user.displayName && user.displayName.trim() !== "") {
      userName = user.displayName;
    } else if (user.email) {
      // Use everything before the @ in email as the name
      userName = user.email.split("@")[0];
    } else {
      userName = "Gardener";
    }
    userName = capitalizeFirstLetter(userName);
    sidebarUsername.textContent = userName + " 🌱";
    welcome.textContent = "Welcome, " + userName + "!";
  }
});

// Section references
const dashboardSection = document.getElementById("dashboardSection");
const plantLibrarySection = document.getElementById("plantLibrarySection");
const remindersSection = document.getElementById("remindersSection");
const layoutPlannerSection = document.getElementById("layoutPlannerSection");
const weatherSection = document.getElementById("weatherSection");
const journalSection = document.getElementById("journalSection");
const communitySection = document.getElementById("communitySection");
// ---- Helper: Hide all sections ----
function hideAllSections() {
  if (dashboardSection) dashboardSection.style.display = "none";
  if (plantLibrarySection) plantLibrarySection.style.display = "none";
  if (remindersSection) remindersSection.style.display = "none";
  if (layoutPlannerSection) layoutPlannerSection.style.display = "none";
  if (weatherSection) weatherSection.style.display = "none";
  if (journalSection) journalSection.style.display = "none";
  if (communitySection) communitySection.style.display = "none";
}

// ---- Update Dashboard Stats ----
async function updateDashboardWidgets() {
  const user = auth.currentUser;
  if (!user) {
    document.getElementById("widgetPlants").textContent = "0";
    document.getElementById("widgetReminders").textContent = "0";
    document.getElementById("widgetJournal").textContent = "0";
    document.getElementById("widgetWeatherTemp").textContent = "—";
    document.getElementById("widgetWeatherDesc").textContent = "Weather";
    document.getElementById("widgetWeatherCity").textContent = "";
    return;
  }

  // Plants
  try {
    const plantSnap = await getDocs(
      query(collection(db, "plants"), where("uid", "==", user.uid))
    );
    document.getElementById("widgetPlants").textContent = plantSnap.size;
  } catch (err) {
    document.getElementById("widgetPlants").textContent = "0";
  }

  // Reminders
  try {
    const reminderSnap = await getDocs(
      query(collection(db, "reminders"), where("uid", "==", user.uid))
    );
    document.getElementById("widgetReminders").textContent = reminderSnap.size;
  } catch (err) {
    document.getElementById("widgetReminders").textContent = "0";
  }

  // Journal logs
  try {
    const plantSnap = await getDocs(
      query(collection(db, "plants"), where("uid", "==", user.uid))
    );
    let totalLogs = 0;
    plantSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const journal = data.journal || [];
      totalLogs += journal.length;
    });
    document.getElementById("widgetJournal").textContent = totalLogs;
  } catch (err) {
    document.getElementById("widgetJournal").textContent = "0";
  }

  // --- DASHBOARD WEATHER WIDGET ---
  const city = localStorage.getItem("weather_city") || DEFAULT_CITY;
  fetchWeather(city).then((w) => {
    document.getElementById("widgetWeatherTemp").textContent = w.temp;
    document.getElementById("widgetWeatherDesc").textContent = w.desc;
    document.getElementById("widgetWeatherCity").textContent = w.city;
    const icon = document.getElementById("dashboardWeatherIcon");
    if (w.icon) {
      icon.src = `https://openweathermap.org/img/wn/${w.icon}@2x.png`;
      icon.style.display = "";
    } else {
      icon.style.display = "none";
    }
  });
}

// ---- Sidebar click handler ----
navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    hideAllSections();

    const section = link.getAttribute("data-section");
    if (section === "dashboard") {
      dashboardSection.style.display = "block";
      updateDashboardWidgets();
    } else if (section === "plants") {
      plantLibrarySection.style.display = "block";
      initPlantLibrary();
    } else if (section === "reminders") {
      remindersSection.style.display = "block";
      initReminders();
    } else if (section === "layout") {
      layoutPlannerSection.style.display = "block";
      initLayoutPlanner();
    } else if (section === "weather") {
      weatherSection.style.display = "block";
      initWeather();
    } else if (section === "journal") {
      journalSection.style.display = "block";
      initJournalTab();
    } else if (section === "community") {
      communitySection.style.display = "block";
      initCommunity();
    }
  });
});

// ---- Logout handler ----
document.getElementById("logoutBtn").addEventListener("click", function () {
  window.location.href = "index.html";
});

// ---- Show dashboard and update stats on initial load (after login) ----
auth.onAuthStateChanged((user) => {
  if (user) {
    document.querySelector(".sidebar-nav li[data-section='dashboard']").click();
    updateDashboardWidgets();
  }
});

export async function initJournalTab() {
  const journalTabContent = document.getElementById("journalTabContent");
  const user = auth.currentUser;
  if (!user) {
    journalTabContent.innerHTML =
      "<p>Please login to view journal entries.</p>";
    return;
  }
  journalTabContent.innerHTML =
    "<div style='text-align:center;'>Loading...</div>";

  // Fetch all user's plants
  const q = query(collection(db, "plants"), where("uid", "==", user.uid));
  const snap = await getDocs(q);

  // Gather all journal entries
  let allEntries = [];
  snap.forEach((docSnap) => {
    const data = docSnap.data();
    const journal = data.journal || [];
    for (const entry of journal) {
      allEntries.push({
        plantName: data.name || "Unknown Plant",
        ...entry,
      });
    }
  });

  if (allEntries.length === 0) {
    journalTabContent.innerHTML = "<p>No journal logs yet for any plant.</p>";
    return;
  }

  // Sort newest first
  allEntries.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  journalTabContent.innerHTML = allEntries
    .map(
      (entry) => `
      <div class="journal-entry-card">
        <div class="journal-plant"><b>${entry.plantName}</b></div>
        <div class="journal-date">${entry.date || ""}</div>
        <div class="journal-text">${entry.entry}</div>
        ${
          entry.photo
            ? `<img src="${entry.photo}" alt="" style="max-width:110px;max-height:80px;margin:6px 0;border-radius:8px;" />`
            : ""
        }
      </div>
    `
    )
    .join("");
}
