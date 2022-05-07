$(function ($) {
  var bioForm = $("#bio-form");
  var bioInput = $("#newBio");
  var error = $("error");
  bioForm.submit(function () {
    try {
      var bio = bioInput.val();
      if (!bio) throw "Must provide bio";
      if (typeof bio !== "string") throw "Bio must be a string";
      bio = bio.trim();
      if (bio.length == 0) throw "Bio must be a non empty string";
      error.hide();
    } catch (e) {
      error.html(e);
      error.show();
      return false;
    }
  });
})(window.jQuery);
