$(document).ready(function () {
  const buttonEl = $('#search-btn');

  // function getApi(apiUrl) {
  //   // var apiUrl =
  //   //   'https://api.openweathermap.org/data/2.5/onecall?q=herriman&exclude=hourly,daily&units=imperial&appid=2982e9f47454e5c045e02187e945c729';

  //   var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&units=imperial&exclude-hourly,daily&appid=2982e9f47454e5c045e02187e945c729`;

  //   fetch(apiUrl)
  //     .then(function (response) {
  //       console.log(response);
  //       return response.json();
  //     })
  //     .then(function (data) {
  //       console.log(data);
  //     });
  // }

  $(buttonEl).on('click', function (e) {
    e.preventDefault();
    var searchInput = $(this).siblings().find('#search-bar').val();

    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&units=imperial&exclude-hourly,daily&appid=2982e9f47454e5c045e02187e945c729`;

    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            displayWeather(data, searchInput);
          });
        } else {
          var errorMsg = $('<span>Not found, Please try again</span>');
          $('#recent-search').append(errorMsg);
        }
      })
      .catch(function (error) {
        console.log('Unable to connect to OpenWeather API');
      });
  });

  function displayWeather(data, searchInput) {
    var temp = Math.floor(data.main.temp);
    $('#hero-degrees').text(temp);
    $('#weather-details-degrees').text(data.main.temp);
    $('#weather-details-wind').text(data.wind.speed + ' ' + 'mph');
    // $('#weather-details-humidity').text(data.main.humidity);
    var liEl = $('<li>');
    $(liEl).text(searchInput);
    $('#recent-search').append(liEl);
  }
});
