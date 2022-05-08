const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const xss = require("xss");
const validate = require("../validation/validation");

//GET http://localhost:3000/login
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

//POST http://localhost:3000/login
router.post("/", async (req, res) => {
  try {
    let loginData = req.body;
    let username = xss(loginData.username);
    let password = xss(loginData.password);
    username = await validate.checkUsername(username);
    password = await validate.checkPassword(password);
    let result = await userData.checkUser(username, password);
    //checkUser throws if user is not logging in correctly
    //if we are here, the user input the correct credentials
    req.session.user = {
      username: username,
      id: await userData.usernameToID(username),
    };
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
