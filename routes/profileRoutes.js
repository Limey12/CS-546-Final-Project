const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { games, users } = require("../data");
const xss = require("xss");
const validate = require("../validation/validation");

//GET http://localhost:3000/profile
router.route("/").get(async (req, res) => {
  try {
    if (xss(req.session.user)) {
      //redirect user to own profile
      res.redirect("/profile/" + xss(req.session.user.id));
    } else {
      //redirect to login page if user is not logged in
      //might change to "search for profile" page
      res.redirect("/login");
    }
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

//GET http://localhost:3000/profile/{id}
router.route("/:id").get(async (req, res) => {
  let id, user;
  try {
    id = xss(req.params.id);
    id = await validate.checkId(id, "Id");
  } catch (e) {
    return res.status(400).render("pages/error", {
      id: xss(req?.session?.user?.id),
      HTML_title: "error",
      class: "error",
      status: 400,
      message: e,
    });
  }
  try {
    user = await users.getUser(id);
    if (!user) {
      throw "Error: User not found";
    }
  } catch (e) {
    return res.status(404).render("pages/error", {
      id: xss(req?.session?.user?.id),
      HTML_title: "error",
      class: "error",
      status: 404,
      message: e,
    });
  }
  try {
    let loggedIn = false;
    let userId = xss(req?.session?.user?.id);
    if (userId) {
      loggedIn = true;
    }
    let username = user.username;
    let bio = user.bio;
    let favoriteGameId = user.favoriteGameId;
    let favoriteGameName = null;
    if (favoriteGameId) {
      let favoriteGame = await games.getGame(favoriteGameId);
      favoriteGameName = favoriteGame.title;
    }
    let leastFavoriteGameId = user.leastFavoriteGameId;
    let leastFavoriteGameName = null;
    if (leastFavoriteGameId) {
      let leastFavoriteGame = await games.getGame(leastFavoriteGameId);
      leastFavoriteGameName = leastFavoriteGame.title;
    }
    let pageOwned = loggedIn && id === userId;

    let friendsList = [];
    let friended = false;
    for (let x = 0; x < user.friends.length; x++) {
      let friend = await users.getUser(user.friends[x]);
      if (friend._id.toString() == userId) {
        friended = true;
      }
      friendsList.push({ username: friend.username, id: friend._id });
    }
        res.render("pages/profile", {
            HTML_title: "Profile",
            id: userId,
            username: username,
            bio: bio,
            friends: friendsList,
            favoriteGameName: favoriteGameName,
            favoriteGameId: favoriteGameId,
            leastFavoriteGameName: leastFavoriteGameName,
            leastFavoriteGameId: leastFavoriteGameId,
            pageOwned: pageOwned,
            pageId: id,
            friended: friended
        });
    } catch (e) {
        return res.status(500).render("pages/error", {
            id :xss(req?.session?.user?.id),
            HTML_title: "error",
            class: "error",
            status: 500,
            message: e
        });
    }
});

//POST http://localhost:3000/profile/add/{id}
router.route("/add/:id").post(async (req, res) => {
  let id, user, loggedIn, userId;
  try {
    id = xss(req.params.id);
    id = await validate.checkId(id, "Id");
  } catch (e) {
    return res.status(400).render("pages/error", {
      id: xss(req?.session?.user?.id),
      HTML_title: "error",
      class: "error",
      status: 400,
      message: e,
    });
  }
  try {
    user = await users.getUser(id);
    if (!user) {
      throw "Error: User not found";
    }
    loggedIn = false;
    userId = xss(req?.session?.user?.id);
    if (userId) {
      loggedIn = true;
    }
    if (!loggedIn) {
      throw "Error: Not logged in";
    }
  } catch (e) {
    return res.status(404).render("pages/error", {
      id: xss(req?.session?.user?.id),
      HTML_title: "error",
      class: "error",
      status: 404,
      message: e,
    });
  }
  try {
    users.addFriend(userId, id);
    res.redirect("back");
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

//GET http://localhost:3000/profile/update/bio
router.route("/update/bio").get(async (req, res) => {
  if (xss(req?.session?.user)) {
    res.render("pages/bio", {
      HTML_title: "Update Bio",
      id: xss(req?.session?.user?.id),
      error: false,
      errorMsg: "",
    });
  } else {
    res.redirect("/");
  }
});

//POST http://localhost:3000/profile/update/bio
router.route("/update/bio").post(async (req, res) => {
  let bio;
  try {
    let updateData = req.body;
    bio = xss(updateData.newBio);
    bio = await validate.checkString(bio, "Bio");
  } catch (e) {
    return res.status(400).render("pages/bio", {
      HTML_title: "Update Bio",
      id: xss(req?.session?.user?.id),
      error: true,
      errorMsg: e,
    });
  }
  try {
    if (!xss(req?.session?.user)) {
      return res.redirect("/");
    }
    users.updateBio(xss(req?.session?.user?.id), bio);
    res.redirect("/profile");
  } catch (e) {
    return res.status(500).render("pages/bio", {
      HTML_title: "Update Bio",
      id: xss(req?.session?.user?.id),
      error: true,
      errorMsg: e,
    });
  }
});

module.exports = router;
