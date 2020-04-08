// API Key
var authKey = "&appid=32e1c02add4067945d7c6604f73cc6cd"

// URL 
var queryURL = "api.openweathermap.org/data/2.5/weather?q="
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
    }

    
})