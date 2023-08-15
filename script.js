var apiKey = config.secretKey;
console.log(apiKey);

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
  
    const currentCity = currentWeather.name;
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
            <div class="col-md-2">
            <div class="card">
                <div class="card-body">
                <h5>${forecastDate}</h5>
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