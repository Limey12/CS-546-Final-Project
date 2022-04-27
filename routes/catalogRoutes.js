const express = require("express");
const router = express.Router();

//GET http://localhost:3000/GameCatalog
router.route("/").get(async (req, res) => {
    res.status(404).render("pages/catalog");
});

module.exports = router;
