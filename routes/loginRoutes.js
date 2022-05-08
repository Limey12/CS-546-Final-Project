const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const xss = require('xss');

router.get("/", async (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    let id = xss(req?.session?.user?.id);
    res.render("pages/form", {
      HTML_title: "Login",
      id: id,
      act: "/login",
      formId: "login-form",
      login: true,
      error: false,
      errorMsg: "",
    });
  }
});

router.post("/", async (req, res) => {
  let signupData = req.body;
  let signupUserName= xss(signupData.username);
  let signupPassword= xss(signupData.password);
  try {
    if (!signupUserName || !signupPassword)
      throw "Must provide username and password.";
    if (typeof signupUserName !== "string")
      throw "Username must be a string.";
      signupUserName = signupUserName.toLowerCase();
    if (!/^[a-z0-9]+$/i.test(signupUserName))
      throw "Username must be alphanumeric.";
    if (signupUserName.length < 4)
      throw "Username must be at least 4 characters long.";
    if (typeof signupPassword !== "string")
      throw "Password must be a string.";
    if (/\s/.test(signupPassword))
      throw "Password must not contain any spaces.";
    if (signupPassword.length < 6)
      throw "Password must be at least 6 characters long.";
    let result = await userData.checkUser(
      signupUserName,
      signupPassword
    );
    //checkUser throws if user is not logging in correctly
    //if we are here, the user input the correct credentials
    req.session.user = { username: signupUserName, id: await userData.usernameToID(signupUserName)};
    res.redirect("/");
  } catch (e) {
    let id = xss(req?.session?.user?.id);
    return res.status(400).render("pages/form", {
      HTML_title: "Login",
      id: id,
      act: "/login",
      formId: "login-form",
      login: true,
      error: true,
      errorMsg: e,
    });
  }
});

module.exports = router;
