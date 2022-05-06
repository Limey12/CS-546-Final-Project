const express = require("express");
const constructorMethod = require(".");
const router = express.Router();
const { games, users, comments } = require("../data");

//GET http://localhost:3000/game/{id}
router.route("/:id").get(async (req, res) => {
    try {
        let argId = req?.params?.id;
        if (argId == undefined || typeof argId != 'string') {
            //todo error page
        }
        let game;
        try {
            game = await games.getGame(argId);
        } catch {
            //todo error page
            return res.status(400).send("invalid game id");
        }
        let userId = req?.session?.user?.id;
        let reviews = game?.reviews;
        for (r of reviews) {
            r.reviewUsername = await users.IDtoUsername(r.userId);
        }
        let comments = game?.comments;
        for (c of comments) {
            c.commentUsername = await users.IDtoUsername(c.userId);
        }
        let hobj = {
            logged_in: userId != undefined,
            game_name: game?.title,
            image: await games.getImage(argId),
            alt: `${game?.title}`,
            description: game?.description ?? "No description available",
            f_rating: await games.getAverageRatingAmongFriends(userId, argId) ?? "None of your freinds have rated this game!", //todo should depend on if the user is logged in
            overall_rating: game?.overallRating ?? "No one has rated this game!",
            reviews: reviews,
            comments: comments, //todo
        };
        res.render("pages/game", hobj);
    } catch (e) {
        return res.status(400).send("routecatch "+e);
    }
});

//POST http://localhost:3000/game/{id}/fav
router.route("/:id/fav").post(async (req, res) => {
    try {
        //todo validation
        let argId = req?.params?.id;
        if (argId == undefined || typeof argId != 'string') {
            //todo error page
        }
        let userId = req?.session?.user?.id;
        await users.favorite(userId, argId);
    } catch (e) {
        console.log("post routecatch "+ e)
        return res.status(400).send("post routecatch "+e);
    }
});

//POST http://localhost:3000/game/{id}/lfav
router.route("/:id/lfav").post(async (req, res) => {
    try {
        //todo validation
        let argId = req?.params?.id;
        if (argId == undefined || typeof argId != 'string') {
            //todo error page
        }
        let userId = req?.session?.user?.id;
        await users.leastfavorite(userId, argId);
    } catch (e) {
        console.log("post routecatch "+ e)
        return res.status(400).send("post routecatch "+e);
    }
});

module.exports = router;
