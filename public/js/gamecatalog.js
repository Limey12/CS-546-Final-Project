$(function ($) {
  var gameList = $("#gameList");
  var form = $("#gamesearch");
  var searchTermInput = $("#search_term");
  var searcherror = $("#searcherror");
  var backLink = $("#backLink");

  var requestConfig = {
    method: 'GET',
    url: '/api/games'
  };

  $.ajax(requestConfig).then(function (responseMessage) {
    var allGames = responseMessage;
    for (i of allGames) {
        const li = `<li> <a class = "gameLink"> ${i.title} </a>  </li>`;
        gameList.append(li);
    }
    gameList.show();
  });
  

  
})(window.jQuery);
