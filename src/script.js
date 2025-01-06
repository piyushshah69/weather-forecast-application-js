// API URL & key for weatherapi.com
const API_KEY = "";
const API_URL = "";

// https://api.weatherapi.com/v1/forecast.json?q={City}&days={5}&key={API KEY}

// All form elements
const form = document.getElementById("form");
const cityName = document.getElementById("cityName");
const datalist = document.getElementById("history");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

// All elements of current weather display section
const currentDisplay = document.getElementById("currentDisplay");
const cityNameDisplay = document.getElementById("cityNameDisplay");
const currentDate = document.getElementById("currentDate");
const currentWeatherConditionImage = document.getElementById("currentWeatherConditionImage");
const currentWeatherCondition = document.getElementById("currentWeatherCondition");
const currentTemperature = document.getElementById("currentTemperature");
const currentFeelsLike = document.getElementById("currentFeelsLike");
const currentIsDay = document.getElementById("currentIsDay");
const currentHumidity = document.getElementById("currentHumidity");
const currentWind = document.getElementById("currentWind");
const currentWindGusts = document.getElementById("currentWindGusts");
const errorMessage = document.getElementById("errorMessage");

// 5 Day forecast display section elements
const forecastHeading = document.getElementById("forecastHeading");
const forecastContainer = document.getElementById("forecastContainer");

// Sets current search value to the last searched city
if (localStorage.getItem("history") != null) {
    const history = JSON.parse(localStorage.getItem("history"));
    cityName.value = history[0];
}else cityName.value = "Mumbai"

// Function gets data as arguement & displays the current weather data
const displayCurrent = (data) => {
    // Hiding and showing necessary elements
    currentDisplay.classList.remove("hidden");
    currentDisplay.classList.add("flex");
    errorMessage.classList.remove("block");
    errorMessage.classList.add("hidden");
    forecastHeading.classList.remove("hidden");

    // Extracting data points and storing in variables
    const date = data.current.last_updated;
    const conditionImage = data.current.condition.icon;
    const condition = data.current.condition.text;
    const temperature = data.current.temp_c;
    const feelsLike = data.current.feelslike_c;
    const isDay = data.current.is_day;
    const humidity = data.current.humidity;
    const wind = data.current.wind_kph;
    const windGusts = data.current.gust_kph;

    // Displaying data in elements using the data variables
    cityName.value = data.location.name;
    cityNameDisplay.innerHTML = data.location.name;
    currentDate.innerHTML = date;
    currentWeatherConditionImage.setAttribute("src", conditionImage);
    currentWeatherCondition.innerHTML = condition;
    currentTemperature.innerHTML = `${temperature}°`;
    currentFeelsLike.innerHTML = `${feelsLike}°`
    isDay == 1 ? currentIsDay.innerHTML = `Day` : currentIsDay.innerHTML = `Night`
    currentHumidity.innerHTML = `${humidity}%`
    currentWind.innerHTML = `${wind}`;
    currentWindGusts.innerHTML = `${windGusts}`;
}

// Function gets data as arguement and displays 5 days forecast
const displayForecast = (data) => {

    // Refreshing forecast container to add forecast for a new city
    forecastContainer.innerHTML = "";

    // Displaying 5 day forecast using Array.map method
    data.forecast.forecastday.map(forecast => {
        // Creating required HTML elements 
        const containter = document.createElement("div");
        const date = document.createElement("p");
        const condition = document.createElement("img");
        const temperature = document.createElement("p");
        const humidity = document.createElement("p");
        const wind = document.createElement("p");

        // Styling newely creating HTML elements using Tailwindcss
        containter.classList.add("flex", "flex-col", "items-center", "bg-gray-600", "text-white", "rounded-md", "p-4", "min-w-[250px]", "md:min-w-[200px]");
        condition.classList.add("w-[50%]")

        // Adding data in new HTML elements using 
        date.innerHTML = forecast.date;
        condition.src = forecast.day.condition.icon;
        temperature.innerHTML = `Temperature: ${forecast.day.avgtemp_c}°C`;
        humidity.innerHTML = `Humidity: ${forecast.day.avghumidity}%`;
        wind.innerHTML = `Wind: ${forecast.day.avgvis_km}K/H`;

        // Appending all elements in container
        containter.appendChild(date);
        containter.appendChild(condition);
        containter.appendChild(temperature);
        containter.appendChild(humidity);
        containter.appendChild(wind);

        // Appending the container in top level forecast container
        forecastContainer.append(containter);
    })
}

// Function stores and shows previously searched cities using localStorage
const addHistory = (data) => {
    // Max number of cities that we want to store in localStorage
    const maxNumberOfCityNames = 100;

    // Checks for history object in localStorage and creates one if not already present
    if (localStorage.getItem("history") == null) {
        const historyArr = [data.location.name];
        localStorage.setItem("history", JSON.stringify(historyArr));
    } else {
        // Storing history array in a variable after parsing
        const history = JSON.parse(localStorage.getItem("history"));
        // Refreshing/Reseting datalist element
        datalist.innerHTML = "";
        // Checks if city is not already present in storage
        if (history.indexOf(data.location.name) <= -1) {
            // Adds new city in array
            history.unshift(data.location.name);
            // If number of cities excceds the set amount it removes first city name
            if (history.length > maxNumberOfCityNames) {
                history.pop();
            }
        }
        else {
            // If city already present, extracts it and add it to the most recent
            const idx = history.indexOf(data.location.name);
            const city = history.splice(idx, 1);
            history.unshift(...city);
        }

        // Adds updated history to local storage
        localStorage.setItem("history", JSON.stringify(history));

        // Adds city names in options using Array.map method
        history.map(city => {
            const option = document.createElement("option");
            option.setAttribute("value", city);
            datalist.appendChild(option);
        })
    }
}

// Function takes city name as arguement and fetches data using API
const fetchData = async (cityOrCoords) => {
    try {
        const numberOfDays = 5;
        // Fetches data, stores in response and converts into json data
        const response = await fetch(`${API_URL}forecast.json?q=${cityOrCoords}&days=${numberOfDays}&key=${API_KEY}`);
        const data = await response.json();
        // console.log(data);
        // Calls all necessary functions if data is available
        if (data.current) {
            displayCurrent(data);
            displayForecast(data);
            addHistory(data);
        }
        // Throws error if it gets error in response
        if (data.error) throw new Error(data.error.code);
    } catch (error) {
        // Handles errors
        currentDisplay.classList.add("hidden");
        errorMessage.classList.remove("hidden");
        errorMessage.classList.add("block");
        forecastHeading.classList.add("hidden");
        // console.log(error);

        if (error.message == 1006) {
            errorMessage.innerHTML = "City Not Found!"
        } else {
            errorMessage.innerHTML = "Can't Serve Data!"
        }
    }
}

// Handles submit event of form
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (cityName.value.length < 1) return;
    fetchData(cityName.value);
})

// Handles current location button click 
locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            const coords = `${lat},${long}`
            fetchData(coords);
        });
    } else {
        alert("Geolocation is not supported by this browser, please try searching manually with city name.");
    }
})

// Starts program by calling fetchData function with city name as arguement
fetchData(cityName.value);