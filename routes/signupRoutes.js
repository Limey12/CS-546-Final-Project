const express = require("express");
const router = express.Router();
const validator = require("email-validator");
const data = require("../data");
const userData = data.users;
const xss = require('xss');

router.get("/", async (req, res) => {
  if (xss(req.session.user)) {
    res.redirect("/");
  } else {
    let id = xss(req?.session?.user?.id);
    res.render("pages/form", {
      HTML_title: "Signup",
      id: id,
      act: "/signup",
      formId: "signup-form",
      login: false,
      error: false,
      errorMsg: "",
    });
  }
});

router.post("/", async (req, res) => {
  let signupData = req.body;
  let signupUserName= xss(signupData.username);
  let signupPassword= xss(signupData.password);
  let signupEmail= xss(signupData.email);
  try {
    if (!signupUserName || !signupEmail || !signupPassword)
      throw "Must provide username, email, and password.";
    if (typeof signupUserName !== "string")
      throw "Username must be a string.";
      signupUserName = signupUserName.toLowerCase();
    if (!/^[a-z0-9]+$/i.test(signupUserName))
      throw "Username must be alphanumeric.";
    if (signupUserName.length < 4)
      throw "Username must be at least 4 characters long.";
    if (typeof signupEmail !== "string") throw "Email must be a string.";
    signupEmail = signupEmail.toLowerCase();
    if (!validator.validate(signupEmail)) throw "Email must be valid.";
    if (typeof signupPassword !== "string")
      throw "Password must be a string.";
    if (/\s/.test(signupPassword))
      throw "Password must not contain any spaces.";
    if (signupPassword.length < 6)
      throw "Username must be at least 6 characters long.";
    let result = await userData.createUser(
      signupUserName,
      signupEmail,
      signupPassword
    );
    if (result) {
      res.redirect("/");
    } else {
      let id = xss(req?.session?.user?.id);
      return res.status(500).render("pages/form", {
        HTML_title: "Signup",
        id: id,
        act: "/signup",
        formId: "signup-form",
        login: false,
        error: true,
        errorMsg: "Internal Server Error",
      });
    }
  } catch (e) {
    let id = xss(req?.session?.user?.id);
    return res.status(400).render("pages/form", {
      HTML_title: "Signup",
      id: id,
      act: "/signup",
      formId: "signup-form",
      login: false,
      error: true,
      errorMsg: e,
    });
  }
});

module.exports = router;
