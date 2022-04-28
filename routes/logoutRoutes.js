const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  req.session.destroy();
  res.render("pages/logout", {
    HTML_title: "Logout",
  });
});

module.exports = router;
