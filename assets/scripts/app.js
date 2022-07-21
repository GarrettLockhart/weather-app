$(document).ready(function () {
  const buttonEl = $('#search-btn');

  var searchInputArray = [];

  $(buttonEl).on('click', function (e) {
    e.preventDefault();
    var searchInput = $(this).siblings('#search-bar-el').children().val();
    searchInputArray.push(searchInput);

    $('#hero-intro-title').removeClass('flex').addClass('hidden');
    $('#cards-display').removeClass('hidden').addClass('flex');

    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&units=imperial&appid=2982e9f47454e5c045e02187e945c729`;

    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            displayWeather(data, searchInput);
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
  });

  function displayWeather(data, searchInput) {
    var degree = '\u{000B0}';
    var percent = '\u{00025}';
    var temp = Math.floor(data.main.temp);
    var wind = data.wind.speed;
    var humidity = data.main.humidity;
    // ! var UVIndex = data.hourly.uvi;
    $('#hero-degrees').text(`${temp} ${degree}`);
    $('#weather-details-degrees').text(`${temp} ${degree}`);
    $('#weather-details-wind').text(wind + ' ' + 'mph');
    $('#weather-details-humidity').text(`${humidity} ${percent}`);
    // ! $('#weather-details-uvindex').text(`${UVIndex}`);

    $('#hero-city').text(data.name);

    var date = moment().format('MMMM Do YYYY');
    $('#hero-date').text(date);

    var liEl = $('<li>');
    $(liEl).text(searchInput);
    $(liEl).addClass('mb-3');
    $('#recent-search').append(liEl);
  }
});
