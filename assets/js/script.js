$(document).ready(function () {
    var local_storage = localStorage.getItem("search") || [];
    if (local_storage.length) {
        console.log(local_storage);
        local_storage = local_storage.split(",");
        console.log(typeof local_storage);
        for (var i = 0; i < local_storage.length; i++) {
            var listCities = $("<button>").text(local_storage[i]).addClass("city-btn").attr("value", local_storage[i]);
            $("#storedCities").append(listCities);
        }
    }
    //setting date
    var currentDay = moment().format("LL");

    // default load for Atlanda
    runWeather();
    runWeatherFiveDay();

    var storage = [];

    // search button click
    $("#search-btn").on("click", function (event) {
        event.preventDefault();
        localStorage.clear();

        var locationSearched = $("#location-search").val().trim();
        runWeather(locationSearched);
        // $("#location-search").empty();
        var listCities = $("<button>").text(locationSearched).addClass("city-btn").attr("value", locationSearched);
        $("#storedCities").append(listCities);
        console.log(storage);

        storage.push(locationSearched);
        localStorage.setItem("search", storage);

    });
    $(document).on("click", ".city-btn", function () {
        runWeather($(this).text());
        runWeatherFiveDay($(this).text());
    });

    $("#clear-btn").on("click", function () {
        storage = [];
        localStorage.clear();
        $("#storedCities").empty();

        console.log(window.localStorage);
    });
    // main current weather card
    function runWeather(locationSearched = "Atlanta") {
        //api request from https://openweathermap.org/api
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/weather?q=${locationSearched}&appid=a9fa8e4a5cdb9ab82f25d7a62cad4dc7&units=imperial`,
            type: "GET",
        }).then(function (response) {
            $("#current-cond").empty();
            $("#current-city").empty();
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

            $.ajax({
                url: `http://api.openweathermap.org/data/2.5/uvi?appid=c2fe04dee27b4f7a9328f2a4cade163a&lat=${latitude}&lon=${longitude}`,
                type: "GET",
            }).then(function (response) {
                var bgColor;
                if (response.value >= 0) {
                    bgColor = "PaleGreen";
                }
                if (response.value >= 3) {
                    bgColor = "yellow";
                }
                if (response.value >= 6) {
                    bgColor = "orange";
                }
                if (response.value >= 8) {
                    bgColor = "LightCoral";
                }
                if (response.value >= 11) {
                    bgColor = "Plum";
                }
                var uvIndexTitle = $("<p>")
                    .attr("id", "weather-description")
                    .text("UV Index: ")
                    .appendTo($(".card-body"));
                $("<span>")
                    .css("background-color", bgColor)
                    .text(response.value)
                    .addClass("uv")
                    .appendTo(uvIndexTitle);

                runWeatherFiveDay(locationSearched);
            });

        });

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
