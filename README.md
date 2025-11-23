# StormTracker-WeatherAPI-Dashboard

Web Application for tracking and displaying weather data using api via openweathermap.org

🌩️ StormTracker — Weather API Dashboard

A modern, responsive weather application powered by the OpenWeather API

StormTracker is a fully interactive weather dashboard that allows users to search any city and instantly view current conditions along with a detailed 5-day forecast.
The app includes search history, dynamically rendered weather cards, API-driven data, and a clean, professional UI enhanced with subtle animations and a radar-style design.

🚀 Live Features

✔ City Search — look up any location using OpenWeather’s Geocoding API
✔ Current Weather Display — temperature, wind, humidity, and condition icon
✔ 5-Day Forecast — auto-generated from the 3-hour forecast endpoint
✔ Saved Search History — persists to localStorage
✔ Clickable History Buttons — instantly reload previous searches
✔ Responsive Design — mobile-friendly layout
✔ Custom UI Enhancements — lightning overlay, accent gradients, radar-inspired theme
✔ Icon Tinting Logic — dynamically recolors clear-sky icons (day/night)

🛠️ Technologies Used

HTML5

CSS3 (custom theming, gradients, animations)

JavaScript (Vanilla)

OpenWeather API

Geocoding API

5-Day / 3-Hour Forecast API

localStorage for search history persistence

🔧 How It Works

1. User searches a location

The app runs the Geocoding API to convert the city name → latitude/longitude.

2. Fetch weather data

Using the coordinates, a request is made to:
https://api.openweathermap.org/data/2.5/forecast

The response contains 40 data points (3-hour intervals for 5 days).

3. Process forecast data

The app groups entries by date and selects the closest value to 12:00 PM to represent each day.

4. Render to UI

Current conditions card

5 cards for the next 5 days

Weather icons pulled from OpenWeather

Custom tinted icon for clear-sky conditions (01d / 01n)

5. Update & save search history

Every valid search is saved to localStorage and displayed as clickable buttons.