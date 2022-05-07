(function ($) {
  window.onload = function () {
    var fav = $("#fav_btn");
    var lfav = $("#least_fav_btn");
    //todo for both functions add to list using ajax.
    //clear fields.
    //do more client side error checking
    fav.submit(function (e) {
      e.preventDefault();
      $.ajax({
        method: "POST",
        url: window.location.pathname + "/fav",
      });
    });

    lfav.submit(function (e) {
      e.preventDefault();
      $.ajax({
        method: "POST",
        url: window.location.pathname + "/lfav",
      });
    });
  };
})(window.jQuery);
