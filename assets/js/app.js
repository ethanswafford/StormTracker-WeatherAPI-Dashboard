console.log('JS Connected');
// API key
const API_KEY = "12bbb864e1faecf33a4bc60505780bcf";

// Grab DOM Elements
const searchForm = document.getElementById("search-form");
const locationEl = document.getElementById("location-input");
const historyContainer = document.getElementById("history");
const currentWeatherEl = document.getElementById("current-weather");
const forecastContainer = document.getElementById("forecast");

// eventlistener and prevent default
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const location = locationEl.value.trim();
    if (!location) return;
    fetchAndRenderWeather(location);
    addLocationToHistory(location);
    locationEl.value = "";
});

// history event
historyEl.addEventListener("click", (event) => {
    if (event.target.matches(".history-btn")) {
        const location = event.target.dataset.city;
        fetchAndRenderWeather(location);
    }
});

// convert location to lat/lon via geocoding api
async function getCoordinates(location) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    location
    )}&limit=1&appid=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Geocoding request failed");
    }

    const data = await response.json();
    if (data.length === 0) {
        throw new Error("No location found for that city");
    }

    const {
        lat,
        lon,
        name
    } = data[0];
    return {
        lat,
        lon,
        name
    };
}

// lat/lon for 3 hour and 5 day forecast
async function getForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Forecast request failed");
    }

    const data = await response.json();
    return data;
}

// fetch and get ready to render everything to the DOM
async function fetchAndRenderWeather(location) {
    try {
        const {
            lat,
            lon,
            name
        } = await getCoordinates(location);
        const forecastData = await getForecast(lat, lon);

        // forecastData.list is every 3 hours for 5 days
        const {
            current,
            daily
        } = processForecastData(forecastData);

        renderCurrentWeather(name, current);
        renderForecast(daily);
    } catch (error) {
        console.log(error);
        alert(error.message);
    }
}

// Data Processing
function processForecastData(forecastData) {
    const list = forecastData.list;

    // Current conditions (first item)
    const current = list[0];

    // Build a map of date -> list of entries for that date
    const byDate = {};
    list.forEach((item) => {
        const [date, time] = item.dt_txt.split(" ");
        console.log("Time: ", time);
        if (!byDate[date]) byDate[date] = [];
        byDate[date].push(item);
    });

    // the next 5 days
    const dates = Object.keys(byDate);

    const nextFiveDates = dates.slice(0, 5);

    const daily = nextFiveDates.map((date) => {
        const entries = byDate[date];

        // Try to find the entry closest to 12:00:00
        let target = entries.find((entry) => entry.dt_txt.includes("12:00:00"));
        if (!target) {
            // fallback: just pick the middle one or first
            target = entries[Math.floor(entries.length / 2)] || entries[0];
        }

        return target;
    });

    return {
        current,
        daily
    };
}

// render data to current weather card
function renderCurrentWeather(cityName, current) {
    const date = new Date(current.dt_txt);
    const iconCode = current.weather[0].icon;
    const description = current.weather[0].description;

    currentWeatherEl.innerHTML = `
    <h2>
      ${cityName} (${date.toLocaleDateString()})
      <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${description}" />
    </h2>
    <p><strong>Temperature:</strong> ${current.main.temp.toFixed(0)} °F</p>
    <p><strong>Wind:</strong> ${current.wind.speed.toFixed(1)} MPH</p>
    <p><strong>Humidity:</strong> ${current.main.humidity}%</p>
  `;
}

// 5 day forecast cards
function renderForecast(daily) {
    forecastContainer.innerHTML = ""; // clear old cards

    daily.forEach((entry) => {
        const date = new Date(entry.dt_txt);
        const iconCode = entry.weather[0].icon;
        const description = entry.weather[0].description;

        const card = document.createElement("div");
        card.classList.add("card", "forecast-card");
        card.innerHTML = `
      <h3>${date.toLocaleDateString()}</h3>
      <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${description}" />
      <p><strong>Temp:</strong> ${entry.main.temp.toFixed(0)} °F</p>
      <p><strong>Wind:</strong> ${entry.wind.speed.toFixed(1)} MPH</p>
      <p><strong>Humidity:</strong> ${entry.main.humidity}%</p>
    `;

        forecastContainer.appendChild(card);
    });
}

// localstorage for history
const STORAGE_KEY = "weatherSearchHistory";

function loadHistory() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function saveHistory(history) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function addLocationToHistory(location) {
    let history = loadHistory();
    const normalized = location.toLowerCase();
    if (history.some((c) => c.toLowerCase() === normalized)) return;

    // add to front
    history.unshift(location);
    history = history.slice(0, 8);

    saveHistory(history);
    renderHistory();
}

// render history
function renderHistory() {
    const history = loadHistory();
    historyContainer.innerHTML = "";

    history.forEach((location) => {
        const btn = document.createElement("button");
        btn.classList.add("history-btn");
        btn.textContent = location;
        btn.dataset.city = location;
        historyContainer.appendChild(btn);
    });
}

// initialize page on load
renderHistory();

// auto load last search even if refresh
const initialHistory = loadHistory();
if (initialHistory.length > 0) {
    fetchAndRenderWeather(initialHistory[0]);
}