(function ($) {
    var gameList =  $('#gameList');
    var form = $('#gamesearch');
    var searchTermInput = $('#search_term');
    var searcherror = $('#searcherror');
    var backLink = $('#backLink');


    //Get all of the Games to appear in the list 
    // var requestConfig = {
    //     method: 'GET',
    //     url: 'http://api.tvmaze.com/shows'
    //   };

    //   $.ajax(requestConfig).then(function (response) {
    //     var List = $(response);
    //     for(i of List){
    //         const li = `<li> <a class = "showlink" href = "${i._links.self.href}"> ${i.name} </a>  </li>`;
    //         showList.append(li);
    //     }
        
    //     gameList.show();
    //     backLink.hide();
    //   });




})(window.jQuery);