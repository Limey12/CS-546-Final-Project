const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const data = require("../data");
const lists = data.lists;
const games = data.games;
const { reviews, comments } = require("../data");
const xss = require("xss");
const validate = require("../validation/validation");

//GET http://localhost:3000/lists
router.route("/").get(async (req, res) => {
  if (xss(req.session.user)) {
    //redirect user to own profile
    res.redirect("/lists/" + xss(req.session.user.id));
  } else {
    //redirect to login page if user is not logged in
    res.redirect("/login");
  }
});

//GET http://localhost:3000/lists/{id}
router.route("/:id").get(async (req, res) => {
  let id;
  var userLists;
  try {
    id = xss(req?.params?.id);
    id = await validate.checkId(id, "Id");
    userLists = await lists.gameListsByUser(id);
    userLists = await validate.checkArray(userLists, "User Lists");
  } catch (e) {
    return res.status(404).render("pages/error", {
      id: xss(req?.session?.user?.id),
      HTML_title: "user not found",
      class: "error",
      status: 404,
      message: "user not found",
    });
  }
  try {
    //now we replace each game id with the real game data.
    for (l of userLists) {
      //l is a "list"
      //meaning l.games is an array of games in the list
      for (gi in l.games) {
        let newg = await games.getGame(l.games[gi]);
        let revs = await reviews.getReviewFromUserAndGame(l.games[gi], id);
        let coms = await comments.getCommentFromUserAndGame(l.games[gi], id);
        newg.urevs = revs;
        newg.ucoms = coms;
        l.games[gi] = newg;
      }
    }
    res.render("pages/lists", {
      id: xss(req?.session?.user?.id),
      HTML_title: "Lists",
      lists: userLists,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).render("pages/error", {
      id: xss(req?.session?.user?.id),
      HTML_title: "Internal Server Error",
      class: "error",
      status: 500,
      message: "Internal Server Error",
    });
  }
});

//POST http://localhost:3000/lists/{id}
router.route("/:id").post(async (req, res) => {
  let id, newListName;
  try {
  } catch (e) {
    id = xss(req?.params?.id);
    id = await validate.checkId(id, "Id");
    newListName = xss(req?.body?.newListTerm);
    newListName = await validate.checkString(newListName, "List Name");
  }
  try {
    await lists.createList(id, newListName, true);
    return res.redirect("/lists/" + id);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ InternalError: e });
  }
});

module.exports = router;
