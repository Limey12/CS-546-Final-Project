const express = require("express");
const router = express.Router();
const { games } = require("../data");
const validate = require("../validation/validation");
const xss = require("xss");

//GET http://localhost:3000/gamecatalog
router.route("/").get(async (req, res) => {
  try {
    let id = xss(req.session.user?.id);
    let allGames = await games.getAllGames();
    if (allGames.length == 0) {
      res.render("pages/catalog", {
        games: allGames,
        errormsg: "No games in database",
        HTML_title: "Game Catalog",
        id: id,
      });
      return;
    }
    res.render("pages/catalog", {
      games: allGames,
      HTML_title: "Game Catalog",
      id: id,
    });
  } catch (e) {
    return res.status(500).render("pages/error", {
      id: xss(req?.session?.user?.id),
      HTML_title: "error",
      class: "error",
      status: 500,
      message: e,
    });
  }
});

//POST http://localhost:3000/gamecatalog
router.post("/", async (req, res) => {
  let search;
  try {
    search = xss(req.body.gameSearchTerm);
    search = await validate.checkString(search, "Search Term");
  } catch (e) {
    let id = xss(req.session.user?.id);
    return res.status(400).render("pages/catalog", {
      games: [],
      error: true,
      errormsg: "No searchterm inputted",
      HTML_title: "Game Catalog",
      id: id,
    });
  }
  try {
    let id = xss(req.session.user?.id);
    let gamelist = await games.getGameSearchTerm(search);
    if (gamelist.length == 0) {
      res
        //Technically not an error since that just means there are no users with that name
        .render("pages/catalog", {
          games: [],
          error: true,
          errormsg: "No results",
          HTML_title: "Game Catalog",
          id: id,
        });
      return;
    }
    res.render("pages/catalog", {
      games: gamelist,
      HTML_title: "Game Catalog",
      id: id,
    });
  } catch (e) {
    return res.status(500).render("pages/error", {
      id: xss(req?.session?.user?.id),
      HTML_title: "error",
      class: "error",
      status: 500,
      message: e,
    });
  }
});

//GET http://localhost:3000/gamecatalog/gameform
router.route("/gameform").get(async (req, res) => {
  try {
    let id = xss(req.session.user?.id);
    if (!id) {
      return res.redirect("/gamecatalog");
    }
    res.render("pages/gameform", { HTML_title: "Game Form", id: id });
  } catch (e) {
    return res.status(500).render("pages/error", {
      id: xss(req?.session?.user?.id),
      HTML_title: "error",
      class: "error",
      status: 500,
      message: e,
    });
  }
});

//POST called by AJAX request
//POST http://localhost:3000/gamecatalog/gameform
router.route("/gameform").post(async (req, res) => {
  let title, description, image;
  try {
    title = xss(req.body.title);
    title = await validate.checkString(title, "title");
    description = xss(req.body.description);
    description = await validate.checkString(description, "description");
    image = xss(req.body.image);
    if (image == "/public/images/no_image.jpeg") {
      image = null;
    } else {
      await validate.checkImage(image);
    }
  } catch (e) {
    res.status(400).json({ success: false, error: e });
    return;
  }

  try {
    let addedgame = await games.addGame(title, description, image);
    res.json({ success: true, addedgame: addedgame });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
    return;
  }
});

module.exports = router;
