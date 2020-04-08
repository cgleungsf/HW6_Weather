let storage = JSON.parse(localStorage.getItem("search"))
$(document).ready(function () {
    //setting date
    var currentDay = moment().format("LL");

    // default load for Atlanda
    runWeather();
    runWeatherFiveDay();

    // search button click
    $("#search-btn").on("click", function (event) {
        event.preventDefault();
        var locationSearched = $("#location-search").val().trim();
        runWeather(locationSearched);

        var listCities = $("<button>").text(locationSearched).attr("id", "city-btn").attr("value", locationSearched);
        var storage = $("#storedCities").append(listCities);
        localStorage.setItem("search", JSON.stringify(storage));
        console.log(storage);

    });
    $("#city-btn").on("click", function () {
        var storedCity = $(this).data('value');
        console.log(storedCity);
        event.preventDefault();
        runWeather(locationSearched);


    });
    // main current weather card
    function runWeather(locationSearched = "Atlanta") {
        //api request from https://openweathermap.org/api
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/weather?q=${locationSearched}&appid=a9fa8e4a5cdb9ab82f25d7a62cad4dc7&units=imperial`,
            type: "GET",
        }).then(function (response) {
            $("#current-cond").empty();
            var headerInfo = $("#current-city");
            var currentConditions = $("#current-cond");

            var cityName = $("<div>")
                .attr("id", "card-header")
                .text(response.name + ": ");
            var dateTime = $("<span>").text(currentDay);

            cityName.append(dateTime);
            headerInfo.append(cityName);

            var weatherIcon = $("<img>")
                .attr("id", "weather-icon-large")
                .attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
            var windSpeed = $("<p>")
                .attr("id", "weather-description")
                .text("Wind Speed: " + response.wind.speed + "MPH");
            var humidity = $("<p>")
                .attr("id", "weather-description")
                .text("Humidity: " + response.main.humidity + "%");
            var temperature = $("<p>")
                .attr("id", "weather-description")
                .text("Temperature: " + response.main.temp + "°F");
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;
            // append HTML elements

            currentConditions.append(
                weatherIcon,
                temperature,
                humidity,
                windSpeed
            );
        });

        var latitude = 33.7490;
        var longitude = -84.3880;

        $.ajax({
            url: `http://api.openweathermap.org/data/2.5/uvi?appid=c2fe04dee27b4f7a9328f2a4cade163a&lat=${latitude}&lon=${longitude}`,
            type: "GET",
        }).then(function (response) {
            var uvIndex = $("<p>")
                .attr("id", "weather-description")
                .text("UV Index: " + response.value);
                .attr("value", response.value);
            var currentConditions = $("#current-cond");
            console.log(attribute.getAttribute(response.value));

            // if (uvIndex.response.value >= 11) {
            //     uvIndex.attr("status","extremely-high")
            // }
            // if (uvIndex.response.value >= 8|| uvIndex.response.value <= 10) {
            //     uvIndex.attr("status","very-high")
            // }
            // if (uvIndex.response.value >= 6|| uvIndex.response.value <= 7) {
            //     uvIndex.attr("status","high")
            // }
            // if (uvIndex.response.value >= 3|| uvIndex.response.value <= 5) {
            //     uvIndex.attr("status","medium")
            // }
            // if (uvIndex.response.value <= 2) {
            //     uvIndex.attr("status","low")
            // }
            // else{
            //     uvIndex.attr("status","na")

            // }
            // console.log(uvIndex.response.value);
            currentConditions.append(uvIndex);

        });
        runWeatherFiveDay(locationSearched);
    }

    // 5 day forecast
    function runWeatherFiveDay(locationSearched = "Atlanta") {
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/forecast?q=${locationSearched}&appid=a9fa8e4a5cdb9ab82f25d7a62cad4dc7&units=imperial`,
            type: "GET",
        }).then(function (response) {
            $("#five-day").empty();
            // for loop to cycle through 5 day forecast api response and pull same time forecast (18:00:00) for each day
            for (var i = 0; i < response.list.length; i++) {
                if (response.list[i].dt_txt.indexOf("18:00:00") !== -1) {
                    // create HTML elements
                    var fiveDayForecastCard = $("<div>").addClass("card");
                    var formattedDate = moment(response.list[i].dt_txt).format("l");
                    var fiveDayDate = $("<span>").text(formattedDate).addClass("card-subheader");
                    var fiveDayIcon = $("<img>").attr("id", "weather-icon-small").attr(
                        "src",
                        "https://openweathermap.org/img/w/" +
                        response.list[i].weather[0].icon +
                        ".png"
                    );
                    var fiveDayTemp = $("<p>")
                        .attr("id", "weather-description")
                        .text("Temp: " + response.list[i].main.temp + " °F");
                    var fiveDayHumidity = $("<p>")
                        .attr("id", "weather-description")
                        .text("Humidity: " + response.list[i].main.humidity + "%");
                    fiveDayForecastCard.append(
                        fiveDayDate,
                        fiveDayIcon,
                        fiveDayTemp,
                        fiveDayHumidity
                    );
                    $("#five-day").append(fiveDayForecastCard);
                }
            }
        });
    }


});
