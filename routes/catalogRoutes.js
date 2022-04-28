const express = require("express");
const router = express.Router();
const { gameApi,games } = require("../data");


//GET http://localhost:3000/GameCatalog
router.route("/").get(async (req, res) => {
    let allGames = await games.getAllGames();
    if(!allGames){
        throw "no games in database"
    }
    res.status(404).render("pages/catalog", {games:allGames});
});

module.exports = router;
