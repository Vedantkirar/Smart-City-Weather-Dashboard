const apiKey = '2698641d969f5d462c44f17920877eef'; // Replace with your actual key
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');

// Event Listener for Search Button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        alert("Please enter a city name.");
    }
});

async function fetchWeatherData(city) {
    try {
        // 1. Show Loading State
        document.getElementById('city-name').innerText = "Searching...";
        document.getElementById('description').innerText = "Fetching real-time data...";
    

        // 2. API URL for Current Weather
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        
        const response = await fetch(weatherUrl);
        
        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        updateCurrentWeatherUI(data);

        // Add this inside the 'try' block of fetchWeatherData(city)
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
const forecastRes = await fetch(forecastUrl);
const forecastData = await forecastRes.json();
displayForecast(forecastData);

    } catch (error) {
        document.getElementById('city-name').innerText = "Error ❌";
        document.getElementById('description').innerText = error.message;
    }
}

function updateCurrentWeatherUI(data) {
    const { name, main, weather, wind } = data;
    const condition = weather[0].main; // e.g., "Clear", "Rain", "Clouds"

    // Update Text Content
    document.getElementById('city-name').innerText = name;
    document.getElementById('temperature').innerText = `${Math.round(main.temp)}°C`;
    document.getElementById('description').innerText = weather[0].description;
    
    // Update Icon
    const iconCode = weather[0].icon;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // 3. Dynamic UI Logic (Theme Switcher)
    updateTheme(condition);
    
    // 4. Smart Advice Logic
    provideAdvice(condition, main.temp);
}

function updateTheme(condition) {
    const body = document.body;
    body.className = ''; // Reset
    
    const lowerCondition = condition.toLowerCase();

    // Log the condition to the console so you can see exactly what the API says
    console.log("Current Weather Condition:", lowerCondition);

    if (lowerCondition.includes("clear")) {
        body.classList.add('sunny-theme');
    } 
    // This catches 'rain', 'drizzle', and 'thunderstorm'
    else if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle") || lowerCondition.includes("thunderstorm")) {
        body.classList.add('rainy-theme');
    } 
    else if (lowerCondition.includes("cloud")) {
        body.classList.add('cloudy-theme');
    } 
    else if (lowerCondition.includes("mist") || lowerCondition.includes("haze") || lowerCondition.includes("fog")) {
        body.classList.add('windy-theme');
    } 
    else {
        body.classList.add('default-theme');
    }
}

function provideAdvice(condition, temp) {
    let advice = "";
    if (condition === "Rain") {
        advice = "It's raining! Grab an umbrella and wear waterproof shoes. ☔";
    } else if (temp > 28) {
        advice = "It's hot outside! Wear light cotton clothes and stay hydrated. ☀️";
    } else if (temp < 15) {
        advice = "It's a bit chilly. A light jacket or sweater would be perfect. 🧥";
    } else {
        advice = "The weather is pleasant! A comfortable T-shirt and jeans will do. 😊";
    }
    document.getElementById('clothing-advice').innerText = advice;
}

function displayForecast(data) {
    const container = document.getElementById('forecast-container');
    container.innerHTML = ''; // Clear previous results

    // Filter to get 1 forecast per day (the API gives every 3 hours)
    const dailyForecasts = data.list.filter((item, index) => index % 8 === 0);

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(day.main.temp);
        const icon = day.weather[0].icon;

        container.innerHTML += `
            <div class="forecast-card">
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="icon">
                <p><strong>${temp}°C</strong></p>
            </div>
        `;
    });
}