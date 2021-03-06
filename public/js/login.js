(async function ($) {
  var loginForm = $("#login-form");
  var signupForm = $("#signup-form");
  var usernameInput = $("#username");
  var passwordInput = $("#password");
  var emailInput = $("#email");
  var error = $("#error");

  loginForm.submit(function () {
    try {
      var username = usernameInput.val(),
        password = passwordInput.val();
      if (!username || !password) throw "Must provide username and password.";
      if (typeof username !== "string") throw "Username must be a string";
      username = username.toLowerCase();
      if (!/^[a-z0-9]+$/i.test(username))
        throw "Username must be alphanumeric.";
      if (username.length < 4)
        throw "Username must be at least 4 characters long";
      if (typeof password !== "string") throw "Password must be a string";
      if (/\s/.test(password)) throw "Password must not contain any spaces.";
      if (password.length < 6)
        throw "Password must be at least 6 characters long.";
      error.hide();
      return true;
    } catch (e) {
      error.html(e);
      error.show();
      return false;
    }
  });

  signupForm.submit(function () {
    try {
      var username = usernameInput.val(),
        email = emailInput.val(),
        password = passwordInput.val();
      if (!username || !email || !password)
        throw "Must provide username, email, and password.";
      if (typeof username !== "string") throw "Username must be a string";
      username = username.toLowerCase();
      if (!/^[a-z0-9]+$/i.test(username))
        throw "Username must be alphanumeric.";
      if (username.length < 4)
        throw "Username must be at least 4 characters long";
      if (typeof email !== "string") throw "Email must be a string.";
      email = email.trim();
      if (email.length == 0) throw "Email must be a non empty string";
      if (typeof password !== "string") throw "Password must be a string";
      if (/\s/.test(password)) throw "Password must not contain any spaces.";
      if (password.length < 6)
        throw "Password must be at least 6 characters long.";
      error.hide();
      return true;
    } catch (e) {
      error.html(e);
      error.show();
      return false;
    }
  });
})(window.jQuery);
