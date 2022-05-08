const express = require("express");
const constructorMethod = require(".");
const router = express.Router();
const { games, users, comments, reviews, lists } = require("../data");
const reviewApi = reviews;
//GET http://localhost:3000/game/{id}
router.route("/:id").get(async (req, res) => {
    try {
        let argId = req?.params?.id;
        if (argId == undefined || typeof argId != 'string') {
            return res.status(400).send({ "error" : "Bad request. Must include id parameter"});
        }
        let game;
        try {
            game = await games.getGame(argId);
        } catch {
            return res.status(404).render("pages/error", {
                id :req?.session?.user?.id,
                HTML_title: "game not found",
                class: "error",
                status: 404,
                message: "game not found"
            });
        }
        let userId = req?.session?.user?.id;
        let reviews = game?.reviews;
        console.log(reviews)
        for (r of reviews) {
            r.reviewUsername = await users.IDtoUsername(r.userId);
        }
        let comments = game?.comments;
        console.log(comments)
        for (c of comments) {
            c.commentUsername = await users.IDtoUsername(c.userId);
        }
        let hobj = {
            id: userId,
            game_name: game?.title,
            image: await games.getImage(argId),
            alt: `${game?.title}`,
            description: game?.description ?? "No description available",
            f_rating: !isNaN(parseInt(await reviewApi.getAverageRatingAmongFriends(userId, argId)).toFixed(1)) || "None of your freinds have rated this game!",
            overall_rating: !isNaN(parseInt(game?.overallRating).toFixed(1)) || "No one has rated this game!",
            HTML_title: game?.title,
            reviews: reviews,
            comments: comments,
            lists: await lists.gameListsByUser(userId),
        };
        res.render("pages/game", hobj);
    } catch (e) {
        return res.status(500).render("pages/error", {
            id :req?.session?.user?.id,
            HTML_title: "error",
            class: "error",
            status: 500,
            message: e
        });
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


//POST http://localhost:3000/game/{id}
router.route("/:id").post(async (req, res) => {
    try {
        //todo validation
        let argId = req?.params?.id;
        if (argId == undefined || typeof argId != 'string') {
            //todo error page
        }
        let userId = req?.session?.user?.id;
        console.log(req.body)

        let user = await users.getUser(userId);
        if (req.body.comment) {
            let comment = req.body.comment;
            let addedcomment = await comments.createComment(userId, argId, comment);
            res.status(204).json({ success: true, addedcomment: addedcomment, user:user.username }); //need xss
        } else if (req.body.rating && req.body.review) {
            let rating = req.body.rating;
            let review = req.body.review;
            await reviews.createReview(userId, argId, review, rating);
            let addedreview = await reviews.createReview(userId, argId, review, rating);
            res.status(204).json({ success: true, addedreview: addedreview, user:user.username }); //need xss
        } else if (req.body['list-names']) {
            let listName = req.body['list-names'];
            await lists.addGameToList(userId, listName, argId)
            res.status(204).json({ success: true});
        } else {
            res.status(400).send({ error : "must supply comment, review+rating, or list-names"});
        }

        // return res.redirect("/game/" + argId);

    } catch (e) {
        console.log("post routecatch "+ e)
        return res.status(500).send( {'error' : e });
    }
});

module.exports = router;
