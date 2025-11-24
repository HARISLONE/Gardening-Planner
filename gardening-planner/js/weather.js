// js/weather.js
const API_KEY = "5f261810e5ebbaa2ca9f6f590eefe3b8";

export function initWeather() {
  const section = document.getElementById("weatherSection");
  section.style.display = "block";

  const widget = document.getElementById("weatherWidget");
  const form = document.getElementById("weatherSearchForm");
  const input = document.getElementById("weatherCityInput");

  // Default city (can be changed)
  let city = "Delhi";

  // Helper to render the weather card
  function renderWeather(data) {
    if (!data) {
      widget.innerHTML = "<p>Weather info not available.</p>";
      return;
    }
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    const tempC = Math.round(data.main.temp - 273.15);
    const desc = data.weather[0].main;
    const humidity = data.main.humidity;
    const wind = data.wind.speed;

    // Fun weather message!
    let msg = "Great day for gardening!";
    if (desc.includes("Rain"))
      msg = "Rainy: Check drainage and avoid watering.";
    if (desc.includes("Clear")) msg = "Sunny: Water your plants early or late.";
    if (desc.includes("Cloud")) msg = "Cloudy: Good for transplanting.";
    if (tempC > 32) msg = "Very hot! Shade your delicate plants.";
    if (tempC < 10) msg = "Cold! Protect plants from frost.";

    widget.innerHTML = `
      <div class="weather-widget-card">
        <img src="${iconUrl}" alt="${desc}" class="weather-icon"/>
        <div class="weather-main">
          <h3>${data.name}, ${data.sys.country}</h3>
          <div class="weather-desc">${desc}</div>
          <div class="weather-temp">${tempC}&deg;C</div>
          <div class="weather-details">
            <span>Humidity: ${humidity}%</span>
            <span>Wind: ${wind} m/s</span>
          </div>
          <div class="weather-msg">${msg}</div>
        </div>
      </div>
    `;
  }

  // Fetch weather from API
  async function fetchWeather(cityName) {
    widget.innerHTML = "<p>Loading...</p>";
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        cityName
      )}&appid=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      renderWeather(data);
    } catch (err) {
      widget.innerHTML = `<p style="color:#e84545">Error: ${err.message}</p>`;
    }
  }

  // Initial load
  fetchWeather(city);

  // Search form handler
  form.onsubmit = (e) => {
    e.preventDefault();
    const c = input.value.trim();
    if (c) fetchWeather(c);
  };
}
