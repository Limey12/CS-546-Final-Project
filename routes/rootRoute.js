const express = require("express");
const router = express.Router();

//GET http://localhost:3000/
router.route("/").get(async (req, res) => {
  res.render("pages/home", {
    HTML_title: "Home",
  });
});

module.exports = router;
