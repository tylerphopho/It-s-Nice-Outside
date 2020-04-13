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
        var queryURL = queryBase + city + "&units=imperial" + authKey;

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


    function renderWeather(response, fromStorage) {
        $("#main-card").empty()

        if(!fromStorage) {
            renderCitiesList(response)
        }

        // Creates the city name.
        var cityTitle = $("<h3>")
        cityTitle.addClass("card-title")
        cityTitle.text(`${response.name} (${moment().formast("L")})`)
        $("#main-card").append(cityTitle)

        // Creates a text tag to display temperature.
        var temperature = response.main.temp
        var currentTemp = $("<p>");
        currentTemp.addClass("temperature");
        var t = temperature.toString()
        var temp = t.slice(0,4)
        currentTemp.html(`Temperature: ${temp} &#176; F`);
        cityTitle.append(currentTemp)
        console.log(temp)

        // Creates a text tag to display the humidity.
        var currentHumidity = $("<p>");
        currentHumidity.addClass("humidity");
        currentHumidity.html(`Humidity: ${response.main.humidity} %`);
        currentTemp.append(currentHumidity)
        console.log(response.main.humidity)

        // Creates a text tag to display the wind speed.
        var windSpeed = $("<p>")
        windSpeed.addClass("wind-speed");
        windSpeed.html(`Wind Speed: ${response.wind.speed} MPH`);
        currentHumidity.append(windSpeed)
        console.log(response.wind.speed)

        var queryURLuv = `api.openweathermap.org/data/2.5/uvi/forecast?${authKey}&lat=${response.coord.lat}&lon=${response.coord.lon}&cnt=1`
        $.ajax({
            url: queryURLuv,
            method: "GET"
        }).then(function(resp){
            var uvIndex = $("<p>");
            uvIndex.addClass("uv-index");
            uvIndex.text("UV Index: " + resp[0].value)
            windSpeed.append(uvIndex);
        });
    }

    function renderCitiesList(response) {
        var listSection = $(".list-group");
        $("#search-form").append(listSection);

        var listItems = $("<li>");
        listItems.addClass("list-group-item");
        listItems.text(response.name)

        listSection.prepend(listItems);
    }

    listSection.click(function(e){
        e.preventDefault();
        console.log("click")

        elData = $(e.target).text();
        city.val('')

        currentWeather(elData, true)
        futureWeather(elData)
    });


function futureWeather(city) {
    var dayCount = "&cnt=40"

    var queryUrlForecast = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + dayCount + authKey;
    $.ajax({
        url: queryUrlForecast,
        method: "GET"
    }).then(function(data){
        console.log(data)

        searchedForecasts.forecasts.push(data)
        sessionStorage.setItem("lastForecast", JSON.stringify(searchedForecasts));

        renderForecast(data)
    });
}

function renderForecast(data) {
    // Empties current cards on page
    $(".card-deck").empty()
    
    // Loops through 5 day forecast
    for(var i = 0; i < data.list.length; i+= 8) {
        console.log(data.list[i].main.temp)

        // Creates cards for the 5 day forecast
        var card = $("<div>");
        card.addClass("card");
        $(".card-deck").append(card)
        var cardBody = $("<div>");
        cardBody.addClass("card-body days");
        card.append(cardBody);

        // Creates <p> tag to display the date
        var forecastDate = $("<p>");
        forecastDate.addClass("forecast-date")
        forecastDate.html(`${moment(data.list[i].dt_txt).format("L")}`);
        cardBody.append(forecastDate)

        var forecastTemperature = $("<p>");
        forecastTemperature.addClass("forecast-temp")
        forecastTemperature.html(`Temp: ${data.list[i].main.temp} &#176;F`);
        forecastDate.append(forecastTemperature)

        var forecastHumidiity = $("<p>")
        forecastHumidiity.html(`Humidity: ${data.list[i].main.humidity} %`);
        forecastTemperature.append(forecastHumidiity);

        var forecastIcon = $(`<img src="http://openweather.org/img/w/${data.list[i].weather[0].icon}.png" alt="icon">`);
        forecastTemperature.append(forecastIcon)
        }
    }

    $("#searchButton").on("click", function(e){
        e.preventDefault()
        var city = $("#search-city").val().trim()

        currentWeather(city);
        futureWeather(city);
    });
});