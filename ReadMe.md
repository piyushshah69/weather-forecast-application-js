# Weather Forecast Application
[Watch live](https://weather-forecast-javascript.netlify.app/)

This app shows weather data including current weather and forecasts for any location in a visually apealing UI.

## Description

In this weather forecast application there are two options to search for weather data, first is the input box for searching city name and second is using current location button which finds out your current location and fetches data for you. The data will be displayed in two sections one for current weather and one for forecast which shows various information about the weather condition eg. (Temperature, Wind speed, Humidity, Condition).

## Getting Started

### Dependencies

* Npm
* Tailwindcss
* Weatherapi KEY

### Installing

* Clone or Download the project files
* Store API key and URL in variables which can be found in ./src/script.js Line: 2
* You can get API key by logging into [Weather API](https://www.weatherapi.com) and this API URL can be used if working - "https://api.weatherapi.com/v1/"

### Executing program

* Install dependencies
* Run Tailwind watch command(Only for modification in styles, not required otherwise)

```
npm install
npx tailwindcss -i ./src/css/input.css -o ./src/css/output.css --watch 
```

## Help

Twilwind configuration problem can occur..
``` 
Twilwind configuration for help
content: ["./index.html"]
``` 

## Authors

Contributors names and contact info

ex. Piyush Shah  
ex. Piyushshah159@gmail.com