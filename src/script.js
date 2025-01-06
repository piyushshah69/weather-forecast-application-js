const API_KEY = "";
const API_URL = "";

// https://api.weatherapi.com/v1/forecast.json?q={City}&days={5}&key={API KEY}

const form = document.getElementById("form");
const cityName = document.getElementById("cityName");
const datalist = document.getElementById("history");
const searchBtn = document.getElementById("searchBtn")

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

const forecastHeading = document.getElementById("forecastHeading");
const forecastContainer = document.getElementById("forecastContainer");

const displayCurrent = (data) => {
    currentDisplay.classList.remove("hidden");
    errorMessage.classList.remove("block");
    errorMessage.classList.add("hidden");
    forecastHeading.classList.remove("hidden");

    const date = data.current.last_updated;
    const conditionImage = data.current.condition.icon;
    const condition = data.current.condition.text;
    const temperature = data.current.temp_c;
    const feelsLike = data.current.feelslike_c;
    const isDay = data.current.is_day;
    const humidity = data.current.humidity;
    const wind = data.current.wind_kph;
    const windGusts = data.current.gust_kph;

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

const displayForecast = (data) => {

    forecastContainer.innerHTML = "";

    data.forecast.forecastday.map(forecast => {
        const containter = document.createElement("div");
        const date = document.createElement("p");
        const condition = document.createElement("img");
        const temperature = document.createElement("p");
        const humidity = document.createElement("p");
        const wind = document.createElement("p");

        containter.classList.add("flex", "flex-col", "items-center", "bg-gray-700", "text-white", "rounded-md", "p-4", "min-w-[250px]", "md:min-w-[200px]");
        condition.classList.add("w-[50%]")
        
        date.innerHTML = forecast.date;
        condition.src = forecast.day.condition.icon;
        temperature.innerHTML = `Temperature: ${forecast.day.avgtemp_c}°C`;
        humidity.innerHTML = `Humidity: ${forecast.day.avghumidity}%`;
        wind.innerHTML = `Wind: ${forecast.day.avgvis_km}K/H`;

        containter.appendChild(date);
        containter.appendChild(condition);
        containter.appendChild(temperature);
        containter.appendChild(humidity);
        containter.appendChild(wind);

        forecastContainer.append(containter);
    })
}

const addHistory = (data) => {
    const maxNumberOfCityNames = 100;

    if (localStorage.getItem("history") == null) {
        const historyArr = [data.location.name];
        localStorage.setItem("history", JSON.stringify(historyArr));
    } else {
        const history = JSON.parse(localStorage.getItem("history"));
        datalist.innerHTML = "";
        if (history.indexOf(data.location.name) <= -1) {
            history.unshift(data.location.name);
            if (history.length > maxNumberOfCityNames) {
                history.pop();
            }
            localStorage.setItem("history", JSON.stringify(history));
        }
        else {
            const idx = history.indexOf(data.location.name);
            const city = history.splice(idx, 1);
            history.unshift(city);
        }
        history.map(city => {
            const option = document.createElement("option");
            option.setAttribute("value", city);
            datalist.appendChild(option);
        })
    }
}

const fetchData = async (city) => {
    try {
        const response = await fetch(`${API_URL}forecast.json?q=${city}&days=5&key=${API_KEY}`);
        const data = await response.json();
        console.log(data);
        if (data.current) {
            displayCurrent(data);
            displayForecast(data);
            addHistory(data);
        }
        if (data.error) throw new Error(data.error.code);
    } catch (error) {
        console.log(error);
        currentDisplay.classList.add("hidden");
        errorMessage.classList.remove("hidden");
        errorMessage.classList.add("block");
        forecastHeading.classList.add("hidden");

        if (error.message == 1006) {
            errorMessage.innerHTML = "City Not Found!"
        } else {
            errorMessage.innerHTML = "Can't Serve Data!"
        }
    }
}


form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (cityName.value.length < 1) return;
    fetchData(cityName.value);
})

fetchData(cityName.value);
