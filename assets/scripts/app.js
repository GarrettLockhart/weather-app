$(document).ready(function () {
  var apiKey = '2982e9f47454e5c045e02187e945c729';

  const buttonEl = $('#search-btn');
  var weatherForecastEl = $('#cards-display');
  var i = 0;
  var searchInputArray = [];

  // stores user input from the search bar, uses that to make a call to get the lat and lon coordinates
  $(buttonEl).click(function (evt) {
    evt.preventDefault();
    var searchInput = $(this).siblings('#search-bar-el').children().val();
    searchInputArray.push(searchInput);
    recentSearch();

    var apiCoordsUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&units=imperial&appid=${apiKey}`;

    fetch(apiCoordsUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            $('#hero-intro-title').removeClass('flex').addClass('hidden');

            $('#hero-city').text(data.name);
            geoCoords(data);
          });
        } else {
          var errorMsgEl = $('<span>');
          $(errorMsgEl).text('Not Found, Please try again');
          $('#recent-search').append(errorMsgEl);

          setTimeout(function (errorMsg) {
            $(errorMsgEl).text('');
          }, 5000);
        }
      })
      .catch(function (error) {
        console.log('Unable to connect to OpenWeather API');
      });
    $('#search-bar').val('');
  });

  // a function to take the lat and long coords from the first call above and use those to make a second call to a different endpoint
  function geoCoords(data) {
    latCoords = data.coord.lat;

    lonCoords = data.coord.lon;

    //  todo: Get this second call working properly

    var apiUrlOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${latCoords}&lon=${lonCoords}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`;

    // this call uses the lat and lon coordinates provided by the first call above
    fetch(apiUrlOneCall)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (dataWeather) {
            displayWeather(dataWeather);
            console.log(
              '🚀 ~ file: app.js ~ line 58 ~ dataWeather',
              dataWeather
            );
            // displayForecast(dataWeather);
            getForecast(dataWeather);
          });
        }
      })
      .catch(function (error) {
        console.log('Unable to connect to OpenWeather API');
      });

    return latCoords, lonCoords;
  }

  // Takes in the second fetch call and returns temp, wind, humidity, uvindex, and 5 day forecast
  function displayWeather(dataWeather) {
    var currentWeatherData = {
      degreeSym: '\u{000B0}',
      percentSym: '\u{00025}',
      temp: Math.floor(dataWeather.current.temp),
      wind: dataWeather.current.wind_speed,
      humidity: dataWeather.current.humidity,
      uvIndex: dataWeather.current.uvi,
      currentDate: moment.unix(dataWeather.current.dt).format('MMMM Do YYYY'),
    };

    // pulls from the currentWeatherData object and displays to page
    $('#hero-degrees').text(
      `${currentWeatherData.temp} ${currentWeatherData.degreeSym}`
    );
    $('#weather-details-degrees').text(
      `${currentWeatherData.temp} ${currentWeatherData.degreeSym}`
    );
    $('#weather-details-wind').text(`${currentWeatherData.wind} mph`);
    $('#weather-details-humidity').text(
      `${currentWeatherData.humidity} ${currentWeatherData.percentSym}`
    );
    $('#weather-details-uvindex').text(`${currentWeatherData.uvIndex}`);

    $('#hero-date').text(currentWeatherData.currentDate);
  }

  function getForecast(dataWeather) {
    console.log(
      '🚀 ~ file: app.js ~ line 104 ~ getForecast ~ dataWeather',
      dataWeather
    );
    for (var i = 1; i < 6; i++) {
      var unixTime = dataWeather.daily[i].dt;
      var date = moment.unix(unixTime).format('ddd');
      $('#Date' + i).html(date);

      var temp = Math.floor(dataWeather.daily[i].temp.day);
      $('#tempDay' + i).html(temp);

      var wind = Math.floor(dataWeather.daily[i].wind_speed);
      $('#windDay' + i).html(wind + ' mph');

      var humidity = dataWeather.daily[i].humidity;
      $('#humidityDay' + i).html(humidity + ' %');

      var uvi = dataWeather.daily[i].uvi;
      $('#uviDay' + i).html(uvi);
    }
  }

  // Call the data again if the user click on the recent searches buttons
  $('#recent-search').on('click', function (e) {
    e.preventDefault();
    let recentSearchBtn = $(e.target).text();

    var apiCoordsRecentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${recentSearchBtn}&units=imperial&appid=${apiKey}`;

    fetch(apiCoordsRecentUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            $('#hero-city').text(data.name);
            geoCoords(data);
          });
        }
      })
      .catch(function (error) {
        console.log('Unable to connect to OpenWeather API');
      });
  });

  // create a button for each search that is input
  function recentSearch() {
    if (i < searchInputArray.length) {
      var recentBtn = $('<button>');
      $(recentBtn).text(searchInputArray[i]).addClass('custom-recent-btn');
      $('#recent-search').append(recentBtn);
      i++;
    }
  }
});
