(function ($) {
  window.onload = function () {
    var fav = $("#fav_btn");
    var lfav = $("#least_fav_btn");

    var requestConfig = {
      method: "POST",
      url: window.location.pathname + "/fav",
    };
    fav.submit(function (e) {
      e.preventDefault();
      $.ajax(requestConfig);
    });
  };
})(window.jQuery);
