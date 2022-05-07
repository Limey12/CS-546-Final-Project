(async function ($) {
    var form = $("#usersearch");
    var searchTermInput = $("#userSearchTerm");
    var error = $("#searcherror");
    var dataerror = $("#dataerror");
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
        dataerror.hide();
        error.html(e);
        error.show();
        return false;
      }
  });
  })(window.jQuery);
  