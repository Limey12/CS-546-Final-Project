const express = require("express");
const router = express.Router();
const xss = require("xss");

//GET http://localhost:3000/logout
router.get("/", async (req, res) => {
  try {
    req.session.destroy();
    let id = xss(req?.session?.user?.id);
    res.render("pages/logout", {
      HTML_title: "Logout",
      id: id,
    });
  } catch (e) {
    return res.status(500).render("pages/form", {
      HTML_title: "Login",
      id: xss(req?.session?.user?.id),
      act: "/login",
      formId: "login-form",
      login: true,
      error: true,
      errorMsg: e,
    });
  }
});

module.exports = router;
