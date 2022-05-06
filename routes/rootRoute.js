const express = require("express");
const router = express.Router();
const { games, users } = require("../data");

//GET http://localhost:3000/
router.route("/").get(async (req, res) => {
  let loggedIn = (req.session.user) ? true : false;
  let id = 0;
  let recs = [];
  if(loggedIn) {
    id = req.session.user.id;
    recs = await users.getRecommendations(req.session.user.username);
  }
  res.render("pages/home", {
    HTML_title: "Game Ranker",
    loggedIn: loggedIn,
    id: id,
    recs: recs
  });
});

module.exports = router;
