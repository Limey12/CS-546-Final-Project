const express = require("express");
const router = express.Router();
const { games, users } = require("../data");

//GET http://localhost:3000/
router.route("/").get(async (req, res) => {
  try{
    let id = req.session.user?.id;
    let recs = [];
    if(req.session.user) {
      recs = await users.getRecommendations(req.session.user.username);
    }
    res.render("pages/home", {
      HTML_title: "Game Ranker",
      id: id,
      recs: recs
    });
  } catch(e){
    return res.status(500).render("pages/error", {
      id :req?.session?.user?.id,
      HTML_title: "Error",
      class: "error",
      status: 500,
      message: e
  });
  }
  
});

module.exports = router;
