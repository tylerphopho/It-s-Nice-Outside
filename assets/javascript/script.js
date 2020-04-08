// API Key
var authKey = "&appid=32e1c02add4067945d7c6604f73cc6cd"

// URL 
var queryBase = "api.openweathermap.org/data/2.5/weather?q="
var listSection = $(".list-group")
var city = $("#search-city")

var searchedCities = {
    cities: []
};

var searchedForecasts = {
    forecasts: []
};

$(document).ready(function(){
    var currentDate = moment().format("L")

    function getSession(){
        let cities = sessionStorage.getItem("lastOverview")
        let forecast = sessionStorage.getItem("lastForecast")
        console.log(cities)

        if(cities) {
            cities = JSON.parse(cities);
            searchedCities = cities
            if(cities.cities.length > 0) {
                renderWeather(cities.cities[0], true)
                cities.cities.forEach(function(index){
                    renderCitiesList(index)
                })
            }
        }

        if(forecast) {
            forecast = JSON.parse(forecast);
            searchedForecasts = forecast;
            console.log(cities, forecast)
            if(forecast.forecasts.length > 0) {
                renderForecast(forecast.forecasts[0])
            }
        }
    }

    getSession()

    function currentWeather(city, fromStorage) {
        var queryURL = queryUrlBase + city + "&units=imperial" + authKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            searchedCities.cities.push(response)
            sessionStorage.setItem("lastOverview", JSON.stringify(searchedCities));
            console.log(searchedCities)

            renderWeather(response, fromStorage)
        });
    }

})