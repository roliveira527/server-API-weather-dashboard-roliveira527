var apiKey = "1bbcd8f8e2b52ff1b096e1dbb91ffa84";

// References to HTML elements
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const historyList = document.querySelector("#history");
const todaySection = document.querySelector("#today");
const forecastSection = document.querySelector("#forecast");

// Event listener for form submission
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const cityName = searchInput.value.trim();

  if (cityName !== "") {
    fetchWeather(cityName);
  }

  searchInput.value = "";
});

// Fetch weather data from API
function fetchWeather(cityName) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Process and display weather data
      displayWeather(data);
      // Save the city name to search history
      saveToHistory(cityName);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

// Display weather data on the dashboard
function displayWeather(weatherData) {
  // Process and display current conditions
  const currentWeather = weatherData.list[0];

  const currentCity = weatherData.city.name; // Corrected reference
  const currentDate = dayjs.unix(currentWeather.dt).format("YYYY-MM-DD");
  const currentIcon = currentWeather.weather[0].icon;
  const currentTemp = (currentWeather.main.temp - 273.15).toFixed(1); // Convert to Celsius
  const currentHumidity = currentWeather.main.humidity;
  const currentWindSpeed = currentWeather.wind.speed;

  todaySection.innerHTML = `
    <h2>${currentCity} (${currentDate}) <img src="https://openweathermap.org/img/w/${currentIcon}.png" alt="${currentWeather.weather[0].description}" /></h2>
    <p>Temperature: ${currentTemp} °C</p>
    <p>Humidity: ${currentHumidity}%</p>
    <p>Wind Speed: ${currentWindSpeed} m/s</p>
  `;

  // Process and display forecast data for next 5 days
  const forecastWeather = weatherData.list.slice(1, 6);

  forecastSection.innerHTML = forecastWeather
    .map((forecast) => {
      const forecastDate = dayjs.unix(forecast.dt).format("YYYY-MM-DD");
      const forecastIcon = forecast.weather[0].icon;
      const forecastTemp = (forecast.main.temp - 273.15).toFixed(1); // Convert to Celsius
      const forecastHumidity = forecast.main.humidity;

      return `
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5>${currentCity} (${forecastDate})</h5>
              <img src="https://openweathermap.org/img/w/${forecastIcon}.png" alt="${forecast.weather[0].description}" />
              <p>Temp: ${forecastTemp} °C</p>
              <p>Humidity: ${forecastHumidity}%</p>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

// Save city to search history in localStorage
function saveToHistory(cityName) {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  // Add cityName to history if not already present
  if (!history.includes(cityName)) {
    history.push(cityName);
    localStorage.setItem("history", JSON.stringify(history));

    // Update history list in UI
    updateHistoryList();
  }
}

// Load search history from localStorage
function loadHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  history.forEach((cityName) => {
    const historyItem = document.createElement("button");
    historyItem.textContent = cityName;
    historyItem.classList.add("list-group-item", "list-group-item-action");
    historyItem.setAttribute("data-city", cityName);
    historyList.appendChild(historyItem);
  });
}

// Update history list in UI
function updateHistoryList() {
  historyList.innerHTML = "";
  loadHistory();
}

// Event listener for clicking on a city in search history
historyList.addEventListener("click", function (event) {
  if (event.target.matches("button")) {
    const cityName = event.target.dataset.city;
    fetchWeather(cityName);
  }
});

// Initial setup when the page loads
function init() {
  loadHistory();
}

init();
