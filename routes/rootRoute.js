const express = require("express");
const router = express.Router();
const { games, users } = require("../data");

//GET http://localhost:3000/
router.route("/").get(async (req, res) => {
  let id = req.session.user?.id;;
  let recs = [];
  if(req.session.user) {
    recs = await users.getRecommendations(req.session.user.username);
  }
  res.render("pages/home", {
    HTML_title: "Game Ranker",
    id: id,
    recs: recs
  });
});

module.exports = router;
