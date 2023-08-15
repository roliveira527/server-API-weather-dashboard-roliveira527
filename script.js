// API key from OpenWeatherMap
const apiKey = "1bbcd8f8e2b52ff1b096e1dbb91ffa84";

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