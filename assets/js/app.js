console.log('JS Connected');
// API key
const API_KEY = "12bbb864e1faecf33a4bc60505780bcf";

// Grab DOM Elements
const searchForm = document.getElementById("search-form");
const locationEl = document.getElementById("location-input");
const historyEl = document.getElementById("history");
const currentWeather = document.getElementById("current-weather");
const forecastEl = document.getElementById("forecast");

// eventlistener and prevent default
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const location = locationEl.ariaValueMax.trim();
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

// fetch and render everything to the DOM