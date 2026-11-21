
const API_KEY = d54d79344ca0fb2f758eeaceaabeab74;

const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const weatherResult = document.getElementById("weatherResult");

weatherForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        showMessage("Please enter a city name.", true);
        return;
    }

    if (API_KEY === "YOUR_API_KEY_HERE") {
        showMessage("Please configure your OpenWeatherMap API key first.", true);
        return;
    }

    searchBtn.disabled = true;
    searchBtn.textContent = "Loading...";
    weatherResult.classList.add("hidden");
    showMessage("Fetching weather information...", false);

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to fetch weather.");
        }

        document.getElementById("cityName").textContent =
            `${data.name}, ${data.sys.country}`;

        document.getElementById("temperature").textContent =
            `${Math.round(data.main.temp)}°C`;

        document.getElementById("weatherDescription").textContent =
            data.weather[0].description;

        document.getElementById("humidity").textContent =
            `${data.main.humidity}%`;

        document.getElementById("windSpeed").textContent =
            `${data.wind.speed} m/s`;

        const iconCode = data.weather[0].icon;

        document.getElementById("weatherIcon").src =
            `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        document.getElementById("weatherIcon").alt =
            data.weather[0].description;

        weatherResult.classList.remove("hidden");
        showMessage("Weather updated successfully!", false);

    } catch (error) {
        showMessage(
            error.message === "city not found"
                ? "City not found. Please check the spelling."
                : error.message,
            true
        );
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
    }
});

function showMessage(text, isError) {
    message.textContent = text;
    message.classList.toggle("error", isError);
}
