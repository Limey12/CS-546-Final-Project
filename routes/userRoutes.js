const express = require("express");
const { ReturnDocument } = require("mongodb");
const router = express.Router();
const { users } = require("../data");

//GET http://localhost:3000/users
router.route("/").get(async (req, res) => {
    try {
      let id = req.session.user?.id;
      res.render("pages/users", { HTML_title:"Users", id: id });
    } catch (e) {
      let id = req?.session?.user?.id;
      // res.status(500).render("pages/catalog", { error: true, errormsg: e, HTML_title:"Game Catalog", id: id });
      return res.status(500).render("pages/error", {
        id :req?.session?.user?.id,
        HTML_title: "error",
        class: "error",
        status: 500,
        message: e
    });
    }
  });

//POST
router.post("/", async (req, res) => {
  let search = req.body.userSearchTerm;
  search = search.trim();
  let id = req.session.user?.id;
  if (!search) {
    res
      .status(400)
      .render("pages/users", {
        users: [],
        error: true,
        errormsg: "No searchterm inputted",
        HTML_title:"Users",
        id: id
      });
    return;
  }
  try {
    userlist = await users.getUserSearchTerm(search);
    let id = req.session.user?.id;
    if (userlist.length == 0) {
      //Technically not an error since that just means there are no users with that name
      res
        .render("pages/users", {
          users: [],
          error: true,
          errormsg: "No results",
          id: id,
          HTML_title:"Users",
        });
      return;
    }
    res.render("pages/users", { users: userlist, HTML_title:"Users", id: id });
  } catch (e) {
    // res.status(500).render("pages/catalog", { error: true, errormsg: e, HTML_title:"Game Catalog", id: id });
    return res.status(500).render("pages/error", {
      id :req?.session?.user?.id,
      HTML_title: "error",
      class: "error",
      status: 500,
      message: e
  });
  }
});
  module.exports = router;