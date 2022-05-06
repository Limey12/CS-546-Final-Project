const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  req.session.destroy();
  let id = req?.session?.user?.id;
  res.render("pages/logout", {
    HTML_title: "Logout",
    id: id
  });
});

module.exports = router;
