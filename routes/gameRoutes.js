const express = require("express");
const constructorMethod = require(".");
const router = express.Router();
const { games, users } = require("../data");

//GET http://localhost:3000/game/{id}
router.route("/:id").get(async (req, res) => {
    try {
        let argId = req?.params?.id;
        if (argId == undefined || typeof argId != 'string') {
            //todo error page
        }
        let game = await games.getGame(argId);
        let userId = req?.session?.user?.id;
        // console.log("before hobj")
        let hobj = {
            game_name: game?.title,
            image: await games.getImage(argId),
            alt: `${game?.title}`,
            description: game?.description ?? "No description available",
            f_rating: await games.getAverageRatingAmongFriends(userId, argId) ?? "N/A", //todo not implemented. also should depend on if the user is logged in
            overall_rating: game?.avg_rating ?? "N/A",
            reviews: game?.reviews, //todo apply function to grab usernames from ids
        };
        res.render("pages/game", hobj);
    } catch (e) {
        return res.status(400).send("routecatch "+e);
    }
});

module.exports = router;
