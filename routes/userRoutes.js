const express = require("express");
const router = express.Router();
const { users } = require("../data");
const xss = require("xss");
const validate = require("../validation/validation");

//GET http://localhost:3000/users
router.route("/").get(async (req, res) => {
  try {
    let id = xss(req.session.user?.id);
    res.render("pages/users", { HTML_title: "Users", id: id });
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

//POST http://localhost:3000/users
router.post("/", async (req, res) => {
  let search;
  try {
    search = xss(req.body.userSearchTerm);
    search = await validate.checkString(search, "Search Term");
  } catch (e) {
    let id = xss(req.session.user?.id);
    res.status(400).render("pages/users", {
      users: [],
      error: true,
      errormsg: "No searchterm inputted",
      HTML_title: "Users",
      id: id,
    });
    return;
  }
  try {
    let id = xss(req.session.user?.id);
    let userlist = await users.getUserSearchTerm(search);
    if (userlist.length == 0) {
      //Technically not an error since that just means there are no users with that name
      res.render("pages/users", {
        users: [],
        error: true,
        errormsg: "No results",
        id: id,
        HTML_title: "Users",
      });
      return;
    }
    res.render("pages/users", { users: userlist, HTML_title: "Users", id: id });
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
module.exports = router;
