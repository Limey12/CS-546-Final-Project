const express = require("express");
const router = express.Router();
const { games, users, comments, reviews, lists } = require("../data");
const reviewApi = reviews;
const xss = require("xss");
const validate = require("../validation/validation");

//GET http://localhost:3000/game/{id}
router.route("/:id").get(async (req, res) => {
  let argId, game;
  try {
    argId = xss(req?.params?.id);
    argId = await validate.checkId(argId);
  } catch (e) {
    return res.status(404).render("pages/error", {
      id: xss(req?.session?.user?.id),
      HTML_title: "game not found",
      class: "error",
      status: 404,
      message: "game not found",
    });
  }
  try {
    game = await games.getGame(argId);
  } catch {
    return res.status(404).render("pages/error", {
      id: xss(req?.session?.user?.id),
      HTML_title: "game not found",
      class: "error",
      status: 404,
      message: "game not found",
    });
  }
  try {
    let userId = xss(req?.session?.user?.id);
    let gameLists;
    if (userId) {
      gameLists = await lists.gameListsByUser(userId);
    } else {
      gameLists = [];
    }
    let reviews = game?.reviews;
    for (r of reviews) {
      r.reviewUsername = await users.IDtoUsername(r.userId);
    }
    let comments = game?.comments;
    for (c of comments) {
      c.commentUsername = await users.IDtoUsername(c.userId);
    }
    let f_rating = await reviewApi.getAverageRatingAmongFriends(userId, argId);
    if (isNaN(f_rating) || f_rating == null || f_rating == undefined) {
      f_rating = "None of your freinds have rated this game!";
    } else {
      f_rating = Number(f_rating).toFixed(1);
    }

    let overall_rating = game?.overallRating;
    if (
      isNaN(overall_rating) ||
      overall_rating == null ||
      overall_rating == undefined
    ) {
      overall_rating = "No one has rated this game!";
    } else {
      overall_rating = Number(overall_rating).toFixed(1);
    }
    let hobj = {
      id: userId,
      game_name: game?.title,
      image: await games.getImage(argId),
      alt: `${game?.title}`,
      description: game?.description ?? "No description available",
      f_rating: f_rating,
      overall_rating: overall_rating,
      HTML_title: game?.title,
      reviews: reviews,
      comments: comments,
      lists: gameLists,
    };
    res.render("pages/game", hobj);
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

//POST http://localhost:3000/game/{id}/fav
router.route("/:id/fav").post(async (req, res) => {
  try {
    let argId = xss(req?.params?.id);
    await validate.checkId(argId);
    let userId = xss(req?.session?.user?.id);
    await users.favorite(userId, argId);
  } catch (e) {
    console.log("post routecatch " + e);
    return res.status(400).send("post routecatch " + e);
  }
});

//POST http://localhost:3000/game/{id}/lfav
router.route("/:id/lfav").post(async (req, res) => {
  try {
    let argId = xss(req?.params?.id);
    await validate.checkId(argId);
    let userId = xss(req?.session?.user?.id);
    await users.leastfavorite(userId, argId);
  } catch (e) {
    console.log("post routecatch " + e);
    return res.status(400).send("post routecatch " + e);
  }
});

//POST http://localhost:3000/game/{id}
router.route("/:id").post(async (req, res) => {
  let argId, userId, comment, rating, review, listName;
  try {
    argId = xss(req?.params?.id);
    argId = await validate.checkId(argId);
    userId = xss(req?.session?.user?.id);
    if (xss(req.body.comment)) {
      comment = xss(req.body.comment);
      comment = await validate.checkString(comment, "Comment");
    } else if (xss(req.body.rating) && xss(req.body.review)) {
      rating = xss(req.body.rating);
      rating = await validate.checkNum(rating, "Rating");
      review = xss(req.body.review);
      review = await validate.checkString(review, "Review");
    } else if (xss(req.body["list-names"])) {
      listName = xss(req.body["list-names"]);
      listName = await validate.checkString(listName, "List Name");
    } else {
      throw "Must supply comment, review + rating, or list-names";
    }
  } catch (e) {
    console.log("post routecatch " + e);
    return res.status(400).send({ error: e });
  }
  try {
    let user = await users.getUser(userId);
    if (xss(req.body.comment)) {
      let addedcomment = await comments.createComment(userId, argId, comment);
      res.json({
        success: true,
        addedcomment: addedcomment,
        user: user.username,
      });
    } else if (xss(req.body.rating) && xss(req.body.review)) {
      let addedreview = await reviews.createReview(
        userId,
        argId,
        review,
        rating
      );
      res.json({
        success: true,
        addedreview: addedreview,
        user: user.username,
      });
    } else if (xss(req.body["list-names"])) {
      await lists.addGameToList(userId, listName, argId);
      res.status(204).json({ success: true });
    } else {
      throw "Must supply comment, review + rating, or list-names";
    }
  } catch (e) {
    console.log("post routecatch " + e);
    return res.status(500).send({ error: e });
  }
});

module.exports = router;
