const express = require("express");
const router = express.Router();
const { games, users } = require("../data");
const xss = require('xss');

//GET http://localhost:3000/
router.route("/").get(async (req, res) => {
  try{
    let id = xss(req.session.user?.id);
    let recs = [];
    if(xss(req.session.user)) {
      recs = await users.getRecommendations(xss(req.session.user.username));
    }
    res.render("pages/home", {
      HTML_title: "Game Ranker",
      id: id,
      recs: recs
    });
  } catch(e){
    return res.status(500).render("pages/error", {
      id : xss(req?.session?.user?.id),
      HTML_title: "Error",
      class: "error",
      status: 500,
      message: e
  });
  }
  
});

module.exports = router;
