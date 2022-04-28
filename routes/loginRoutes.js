const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;

router.get("/", async (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("pages/form", {
      HTML_title: "Login",
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
  try {
    if (!signupData.username || !signupData.password)
      throw "Must provide username and password.";
    if (typeof signupData.username !== "string")
      throw "Username must be a string.";
    signupData.username = signupData.username.toLowerCase();
    if (!/^[a-z0-9]+$/i.test(signupData.username))
      throw "Username must be alphanumeric.";
    if (signupData.username.length < 4)
      throw "Username must be at least 4 characters long.";
    if (typeof signupData.password !== "string")
      throw "Password must be a string.";
    if (/\s/.test(signupData.password))
      throw "Password must not contain any spaces.";
    if (signupData.password.length < 6)
      throw "Username must be at least 6 characters long.";
    let result = await userData.checkUser(
      signupData.username,
      signupData.password
    );
    req.session.user = { username: signupData.username };
    res.redirect("/");
  } catch (e) {
    return res.status(400).render("pages/form", {
      HTML_title: "Login",
      act: "/login",
      formId: "login-form",
      login: true,
      error: true,
      errorMsg: e,
    });
  }
});

module.exports = router;
