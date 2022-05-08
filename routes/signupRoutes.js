const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const xss = require("xss");
const validate = require("../validation/validation");

//GET http://localhost:3000/signup
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

//POST http://localhost:3000/signup
router.post("/", async (req, res) => {
  let signupData, username, password, email;
  try {
    signupData = req.body;
    username = xss(signupData.username);
    password = xss(signupData.password);
    email = xss(signupData.email);
    username = await validate.checkUsername(username);
    password = await validate.checkPassword(password);
    email = await validate.checkEmail(email);
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
  try {
    let result = await userData.createUser(username, email, password);
    if (result) {
      res.redirect("/");
    } else {
      throw "Error: Internal Server Error";
    }
  } catch (e) {
    let id = xss(req?.session?.user?.id);
    return res.status(500).render("pages/form", {
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
