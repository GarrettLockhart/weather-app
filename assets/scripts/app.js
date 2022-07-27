$(document).ready(function () {
  var API_KEY = '2982e9f47454e5c045e02187e945c729';

  const buttonEl = $('#search-btn');

  // this is used in the recentSearch function
  var i = 0;
  // used to display the recent search buttons
  var searchInputArray = [];

  // stores user input from the search bar, and pushes searchInput to an array, uses searchInput to make a call to get the lat and lon coordinates
  $(buttonEl).click(function (evt) {
    evt.preventDefault();
    var searchInput = $(this).siblings('#search-bar-el').children().val();
    searchInputArray.push(searchInput);
    recentSearch();

    var apiCoordsUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&units=imperial&appid=${API_KEY}`;

    fetch(apiCoordsUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            $('#hero-intro-title').removeClass('flex').addClass('hidden');
            $('#cards-display').removeClass('hidden').addClass('flex');
            $('#hero-city').text(data.name);
            geoCoords(data);
          });
        } else {
          var errorMsgEl = $('<span>');
          $(errorMsgEl).text('Not Found, Please try again');
          $('#recent-search').append(errorMsgEl);
          // if error, removed displayed error after 5 seconds
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

  // take the lat and lon coords from the first call above and use those to make a second call to a different endpoint
  // This endpoint contains all the necessary data, but needs the lat and lon coordinates
  function geoCoords(data) {
    latCoords = data.coord.lat;

    lonCoords = data.coord.lon;

    //  todo: Get this second call working properly

    var apiUrlOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${latCoords}&lon=${lonCoords}&exclude=minutely,hourly,alerts&units=imperial&appid=${API_KEY}`;

    // this call uses the lat and lon coordinates provided by the first call above
    fetch(apiUrlOneCall)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (dataWeather) {
            displayWeather(dataWeather);
            getForecast(dataWeather);
          });
        }
      })
      .catch(function (error) {
        console.log('Unable to connect to OpenWeather API');
      });

    return latCoords, lonCoords;
  }

  // Takes in the second fetch call and sets the text in the DOM, gets temp, wind, humidity, uvindex
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

  // Loop to grab the data for the next five days and update the DOM on each pass of the loop
  function getForecast(dataWeather) {
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

  // Fetch the api again, if the user clicks on the recent searches btn, puts the city as the buttons text
  $('#recent-search').on('click', function (e) {
    e.preventDefault();
    let recentSearchBtn = $(e.target).text();

    var apiCoordsRecentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${recentSearchBtn}&units=imperial&appid=${API_KEY}`;

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
