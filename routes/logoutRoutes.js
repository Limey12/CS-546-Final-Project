const express = require("express");
const router = express.Router();
const xss = require("xss");

//GET http://localhost:3000/logout
router.get("/", async (req, res) => {
  req.session.destroy();
  let id = xss(req?.session?.user?.id);
  res.render("pages/logout", {
    HTML_title: "Logout",
    id: id,
  });
});

module.exports = router;
