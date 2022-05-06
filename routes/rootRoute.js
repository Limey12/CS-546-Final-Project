const express = require("express");
const router = express.Router();

//GET http://localhost:3000/
router.route("/").get(async (req, res) => {
  let loggedIn = (req.session.user) ? true : false;
  let id = 0;
  if(loggedIn) {
    id = req.session.user.id;
  }
  res.render("pages/home", {
    HTML_title: "Game Ranker",
    loggedIn: loggedIn,
    id: id
  });
});

module.exports = router;
