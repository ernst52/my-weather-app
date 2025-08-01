const apiKey = '69df9ace38872fda3c377894709c9738';

const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const weatherInfoContainer = document.querySelector('#weather-info-container');

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const cityName = cityInput.value.trim();

    if (cityName) {
        getWeather(cityName);
    } else {
        alert('Please input city name');
    }
});

async function getWeather(city) {
    weatherInfoContainer.classList.remove('show');
    weatherInfoContainer.innerHTML = `<p>Fetching data...</p>`;
    void weatherInfoContainer.offsetWidth; // force reflow to re-trigger animation

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=en`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('City not found or API error');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`;
        weatherInfoContainer.classList.add('show');
    }
}

function displayWeather(data) {
    const { name, main, weather } = data;
    const { temp, humidity } = main;
    const { description, icon } = weather[0];

    const weatherHtml = `
        <h2 class="text-2xl font-bold">${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p class="temp">${temp.toFixed(1)}°C</p>
        <p>${description}</p>
        <p>Humidity: ${humidity}%</p>
    `;
    
    weatherInfoContainer.innerHTML = weatherHtml;

    
    const container = document.querySelector('.app-container');
    container.classList.remove('cold', 'mild', 'hot');

    // Set background based on temp
    if (temp < 10) {
        container.classList.add('cold');
    } else if (temp >= 10 && temp <= 25) {
        container.classList.add('mild');
    } else {
        container.classList.add('hot');
    }

    // Trigger reflow to restart animation
    setTimeout(() => {
        weatherInfoContainer.classList.add('show');
    }, 10);
}
