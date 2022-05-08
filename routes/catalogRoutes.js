const express = require("express");
const { ReturnDocument } = require("mongodb");
const router = express.Router();
const { games } = require("../data");
const validate = require("../validation/gameValidation");
const xss = require('xss');

//GET http://localhost:3000/gamecatalog
router.route("/").get(async (req, res) => {
  try {
    let id = xss(req.session.user?.id);
    let allGames = await games.getAllGames();
    if (!allGames) {
        throw "games not found"
    }
    if (allGames.length == 0) {
        res.render("pages/catalog", { games: allGames, errormsg: 'No games in database', HTML_title:"Game Catalog", id: id });
        return;
    }
    res.render("pages/catalog", { games: allGames, HTML_title:"Game Catalog", id: id });
  } catch (e) {
    let id = xss(req?.session?.user?.id);
    // res.status(500).render("pages/catalog", { error: true, errormsg: e, HTML_title:"Game Catalog", id: id });
    return res.status(500).render("pages/error", {
      id :xss(req?.session?.user?.id),
      HTML_title: "error",
      class: "error",
      status: 500,
      message: e
  });
  }
});

//POST
router.post("/", async (req, res) => {
  let search = xss(req.body.gameSearchTerm);
  search = search.trim();
  let id = xss(req.session.user?.id);
  if (!search) {
    res
      .status(400)
      .render("pages/catalog", {
        games: [],
        error: true,
        errormsg: "No searchterm inputted",
        HTML_title:"Game Catalog",
        id: id
      });
    return;
  }
  try {
    gamelist = await games.getGameSearchTerm(search);
    let id = xss(req.session.user?.id);
    if (gamelist.length == 0) {
      res
      //Technically not an error since that just means there are no users with that name
        .render("pages/catalog", {
          games: [],
          error: true,
          errormsg: "No results",
          HTML_title:"Game Catalog",
          id: id
        });
      return;
    }
    res.render("pages/catalog", { games: gamelist, HTML_title:"Game Catalog", id: id });
  } catch (e) {
    // res.status(500).render("pages/catalog", { error: true, errormsg: e, HTML_title:"Game Catalog", id: id });
    return res.status(500).render("pages/error", {
      id :xss(req?.session?.user?.id),
      HTML_title: "error",
      class: "error",
      status: 500,
      message: e
  });
  }
});

//GET http://localhost:3000/GameCatalog/gameform'
router.route("/gameform").get(async (req, res) => {
  try {
    let id = xss(req.session.user?.id);
    if(!id){
      res.redirect("/gamecatalog");
    }
    res.render("pages/gameform", {HTML_title:"Game Form", id: id});
  } catch (e) {
    let id = xss(req?.session?.user?.id);
    // res.status(500).render("pages/gameform",{HTML_title:"Game Form", id: id});
    return res.status(500).render("pages/error", {
      id :xss(req?.session?.user?.id),
      HTML_title: "error",
      class: "error",
      status: 500,
      message: e
  });
  }
});

//POST called by AJAX request
router.route("/gameform").post(async (req, res) => {
  let title = xss(req.body.title); 
  let description = xss(req.body.description);
  let image = xss(req.body.image);
  try {
    if(image == "/public/images/no_image.jpeg"){
      image = null;
    } else{
      await validate.checkImage(image);
    }
    
    await validate.checkTitle(title);
    await validate.checkDescription(description);
  } catch (e) {
    res.status(400).json({ success: false, error: e });
    return;
  }

  try {
    let addedgame = await games.addGame(title, description, image);
    res.json({ success: true, addedgame: addedgame }); //need xss
  } catch (e) {
    res.status(500).json({ success: false, error: e });
    return;
  }
});

module.exports = router;
