$(document).ready(function () {
  var apiKey = '2982e9f47454e5c045e02187e945c729';

  const buttonEl = $('#search-btn');
  var i = 0;
  var searchInputArray = [];

  $(buttonEl).on('click', searchInputFunc);
  // stores use input from the search bar, uses that to make a call to get the lat and lon coordinates
  function searchInputFunc(evt) {
    evt.preventDefault();
    var searchInput = $(this).siblings('#search-bar-el').children().val();
    searchInputArray.push(searchInput);
    recentSearch();

    var apiCoordsUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&units=imperial&appid=${apiKey}`;

    fetch(apiCoordsUrl)
      .then(function (response) {
        console.log('🚀 ~ file: app.js ~ line 15 ~ response', response);
        if (response.ok) {
          response.json().then(function (data) {
            console.log('🚀 ~ file: app.js ~ line 20 ~ data', data);
            $('#hero-intro-title').removeClass('flex').addClass('hidden');
            $('#cards-display').removeClass('hidden').addClass('flex');
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
  }

  // a function to take the lat and long coords from the first call above and use those to make a second call to a different endpoint
  function geoCoords(data) {
    latCoords = data.coord.lat;

    lonCoords = data.coord.lon;

    //  todo: Get this second call working properly

    var apiUrlOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${latCoords}&lon=${lonCoords}&units=imperial&appid=${apiKey}`;

    // this call uses the lat and lon coordinates provided by the first call above
    fetch(apiUrlOneCall)
      .then(function (response) {
        console.log('🚀 ~ file: app.js ~ line 15 ~ response', response);
        if (response.ok) {
          response.json().then(function (dataWeather) {
            console.log(
              '🚀 ~ file: app.js ~ line 61 ~ dataWeather',
              dataWeather
            );
            displayWeather(dataWeather);
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

    return latCoords, lonCoords;
  }

  // Takes in the second fetch call and returns temp, wind, humidity, uvindex, and 5 day forecast
  function displayWeather(dataWeather, searchInput) {
    var weatherDetailsData = {
      degreeSym: '\u{000B0}',
      percentSym: '\u{00025}',
      temp: Math.floor(dataWeather.current.temp),
      wind: dataWeather.current.wind_speed,
      humidity: dataWeather.current.humidity,
      uvIndex: dataWeather.current.uvi,
      currentDate: moment.unix(dataWeather.current.dt).format('MMMM Do YYYY'),
    };

    // pulls from the weatherDetailsData object and displays to page
    $('#hero-degrees').text(
      `${weatherDetailsData.temp} ${weatherDetailsData.degreeSym}`
    );
    $('#weather-details-degrees').text(
      `${weatherDetailsData.temp} ${weatherDetailsData.degreeSym}`
    );
    $('#weather-details-wind').text(`${weatherDetailsData.wind} mph`);
    $('#weather-details-humidity').text(
      `${weatherDetailsData.humidity} ${weatherDetailsData.percentSym}`
    );
    $('#weather-details-uvindex').text(`${weatherDetailsData.uvIndex}`);

    $('#hero-date').text(weatherDetailsData.currentDate);
  }

  // create a button for each search that is input

  function recentSearch() {
    if (i < searchInputArray.length) {
      var recentBtn = $('<button>');
      $(recentBtn).text(searchInputArray[i]).addClass('custom-recent-btn');
      $(recentBtn).attr('onclick', 'searchInputFunc()');
      $('#recent-search').append(recentBtn);
      i++;
    }
  }
});
