const express = require("express");
const router = express.Router();
const { games } = require("../data");

//GET http://localhost:3000/game/{id}
router.route("/:id").get(async (req, res) => {
    let argId = req.params.id; //todo check validity
    let game = games.getGame(argId);
    let userId = undefined; //todo get user id from session
    let hobj = {
        game_name: game?.title,
        image: games.getImage(argId), //todo not implemented
        alt: `${game?.title}`,
        description: game?.description,
        f_rating: games.getAverageRatingAmongFriends(argId, userId), //todo not implemented. also should depend on if the user is logged in
        overall_rating: game?.avg_rating,
        reviews: game?.reviews, //todo apply function to grab usernames from ids
    };
    res.render("pages/game");
});

module.exports = router;
