$(function ($) {
  var loginForm = $("#login-form");
  var signupForm = $("#signup-form");
  var usernameInput = $("#username");
  var passwordInput = $("#password");
  var emailInput = $("#email");
  var error = $("#error");

  loginForm.submit(function () {
    try {
      var username = usernameInput.val(),
        password = passwordInput.val(); // Need this
      if (!username) throw "Username needs to be inputted";
      if (typeof username !== "string") throw "Username needs to be a string";
      username = username.trim();
      if (username.length < 4) throw "Username must be at least 4 characters long";
      if (!/^[a-z0-9]+$/i.test(username)) throw "Username must be alphanumeric.";
      error.hide();
      return true;
    } catch (e) {
      error.html(e);
      error.show();
      return false;
    }
  });
})(window.jQuery);
