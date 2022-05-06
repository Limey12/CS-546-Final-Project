(function ($) {
  var gameList = $("#gameList");
  var form = $("#gamesearch");
  var searchTermInput = $("#gameSearchTerm");
  var error = $("#searcherror");
  var backLink = $("#backLink");


  form.submit(function(){
    try {
      var searchTerm = searchTermInput.val();
      if(!searchTerm){
        throw "Search term needs to be inputted";
      }
      if(typeof searchTerm !== "string"){
        throw "Search term needs to be a string";
      }
      searchTerm = searchTerm.trim();
      if(searchTerm.length == 0){
        throw "Search term needs to be a non empty string";
      }
      error.hide();
      return true;
    } catch(e){
      error.html(e);
      error.show();
      return false;
    }
});
  // form.on('submit', async function (event,flag) {
  //   event.preventDefault();

  //   if(!flag){
  //     flag=false
  //   }
    
  //   try {
  //     var searchTerm = searchTermInput.val();
  //     if(!searchTerm){
  //       throw "Search term needs to be inputted";
  //       // error.html("Search term needs to be inputted");
  //       // error.show();
  //     }
  //     if(typeof searchTerm !== "string"){
  //       throw "Search term needs to be a string";
  //       // error.html("Search term needs to be inputted");
  //       // error.show();
  //     }
  //     searchTerm = searchTerm.trim();
  //     if(searchTerm.length == 0){
  //       throw "Search term needs to be a non empty string";
  //       // error.html("Search term needs to be inputted");
  //       // error.show();

        
  //     }
  //     error.hide();
  //     $(this).submit();
  //   } catch(e){
  //     console.log(e);
  //     error.html(e);
  //     error.show();
  //   }
    
  // });
})(window.jQuery);
