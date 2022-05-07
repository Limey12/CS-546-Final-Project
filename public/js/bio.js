$(function ($) {
    var bioForm = $("#bio-form");
    var bioInput = $("#newBio");
    var error = $("error");
    bioForm.submit(function () {
      try {
        error.hide();
      }catch (e) {
        error.html(e);
        error.show();
        return false;
      }
    });
  })(window.jQuery);
  