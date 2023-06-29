window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('city-form');
    form.addEventListener('submit', fetchWeather);
  
    async function fetchWeather(event) {
      event.preventDefault();
  
      const cityInput = document.getElementById('city-input');
      const city = cityInput.value.trim();
  
      if (city === '') {
        displayErrorMessage('Please enter a city name');
        return;
      }
  
      const apiKey = '2435645530336268f604e801523b62c4';
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  
      try {
        const response = await fetch(weatherUrl);
        const data = await response.json();
  
        if (response.ok) {
          displayWeather(data);
          const forecastData = await fetchForecast(city, apiKey);
          displayChart(forecastData);
        } else {
          displayErrorMessage(data.message);
        }
      } catch (error) {
        displayErrorMessage('An error occurred while fetching weather data');
      }
    }
  
    async function fetchForecast(city, apiKey) {
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
  
      try {
        const response = await fetch(forecastUrl);
        const data = await response.json();
  
        if (response.ok) {
          return data.list.map(item => ({
            date: item.dt_txt,
            temperature: item.main.temp,
            humidity: item.main.humidity,
            condition: item.weather[0].description
          }));
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        throw new Error('An error occurred while fetching forecast data');
      }
    }
  
    function displayWeather(data) {
      document.getElementById('city').textContent = data.name;
      document.getElementById('condition').textContent = data.weather[0].description;
      document.getElementById('temperature').textContent = Math.round(data.main.temp - 273.15);
      document.getElementById('humidity').textContent = data.main.humidity;
      document.getElementById('wind-speed').textContent = data.wind.speed;
      document.getElementById('date-time').textContent = new Date(data.dt * 1000).toLocaleString();
    }
  
    function displayChart(forecastData) {
      const dates = forecastData.map(day => day.date);
      const temperatures = forecastData.map(day => day.temperature);
      const humidities = forecastData.map(day => day.humidity);
      const conditions = forecastData.map(day => day.condition);
  
      const ctx = document.getElementById('chart').getContext('2d');
  
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Temperature',
              data: temperatures,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderWidth: 1
            },
            {
              label: 'Humidity',
              data: humidities,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  
    function displayErrorMessage(message) {
      document.getElementById('error-message').textContent = message;
    }
  });
  