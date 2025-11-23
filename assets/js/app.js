console.log('JS Connected');

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
})