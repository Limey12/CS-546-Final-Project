const express = require("express");
const router = express.Router();
const { gameApi } = require("../data");

//GET http://localhost:3000/game/{id}
router.route("/:id").get(async (req, res) => {
    let argId = req.params.id; //todo check validity
    let game = gameApi.getGameFromId(argId);
    let userId = undefined; //todo get user id from session
    let hobj = {
        game_name: game?.title,
        image: gameApi.getImageFromGameId(argId), //todo not implemented
        alt: `${game?.title}`,
        description: game?.description,
        f_rating: gameApi.getAverageRatingAmongFriends(argId, userId), //todo not implemented. also should depend on if the user is logged in
        overall_rating: game?.avg_rating,
        reviews: game?.reviews, //todo apply function to grab usernames from ids
    };
    res.render("pages/game");
});

module.exports = router;
