$(document).ready(function () {
  var apiUrl = '';

  function getApi(apiUrl) {
    fetch(apiUrl).then(function (response) {
      console.log(response);
      if (response.status === 200) {
        responseText.textContent = response.status;
      }
      return response.json();
    });
  }

  const buttonEl = $('#search-btn');
  $(buttonEl).on('click', function (e) {
    e.preventDefault();
    var searchInput = $(this).siblings().find('#search-bar').val();
    console.log(searchInput);
  });
});
