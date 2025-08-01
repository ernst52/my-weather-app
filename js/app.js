const apiKey = '69df9ace38872fda3c377894709c9738';

const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const weatherInfoContainer = document.querySelector('#weather-info-container');
const container = document.querySelector('.app-container');

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
    localStorage.setItem('lastCity', city);

    weatherInfoContainer.classList.remove('show');
    weatherInfoContainer.innerHTML = `<p>Fetching data...</p>`;

    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=en`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=en`;

    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        if (!currentRes.ok || !forecastRes.ok) throw new Error('City not found or API error');

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        displayWeather(currentData, forecastData.list);
    } catch (error) {
        weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`;
        weatherInfoContainer.classList.add('show');
    }
}

function displayWeather(current, forecastList) {
    const { name, main, weather } = current;
    const { temp, humidity } = main;
    const { description, icon } = weather[0];

    // clear bg classes
    container.classList.remove('cold', 'mild', 'hot');

    // set bg color based on temp
    if (temp < 10) container.classList.add('cold');
    else if (temp <= 25) container.classList.add('mild');
    else container.classList.add('hot');

    // basic current weather
    let html = `
        <h2>${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p class="temp">${temp.toFixed(1)}°C</p>
        <p>${description}</p>
        <p>Humidity: ${humidity}%</p>
        <h3>5-Day Forecast</h3>
        <div class="forecast-container">
    `;

    // get one forecast per day (12:00)
    const daily = forecastList.filter(f => f.dt_txt.includes("12:00:00"));
    daily.forEach(f => {
        const date = new Date(f.dt_txt);
        const iconUrl = `https://openweathermap.org/img/wn/${f.weather[0].icon}.png`;
        html += `
            <div class="forecast-item">
                <p>${date.toLocaleDateString(undefined, { weekday: 'short' })}</p>
                <img src="${iconUrl}" alt="${f.weather[0].description}">
                <p>${f.main.temp.toFixed(0)}°C</p>
            </div>
        `;
    });

    html += `</div>`;
    weatherInfoContainer.innerHTML = html;

    setTimeout(() => {
        weatherInfoContainer.classList.add('show');
    }, 10);
}

// auto-load last city
window.addEventListener('DOMContentLoaded', () => {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        cityInput.value = lastCity;
        getWeather(lastCity);
    }
});
