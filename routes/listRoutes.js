const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const data = require("../data");
const users = data.users;
const lists = data.lists;
const games = data.games;
const mongoCollections = require("../config/mongoCollections");
const constructorMethod = require(".");
const { reviews, comments } = require("../data");

router.route("/").get(async (req, res) => {
    if(req.session.user){
        //redirect user to own profile
        res.redirect("/lists/" + req.session.user.id);
    }
    else{
        //redirect to login page if user is not logged in
        res.redirect("/login");
    }
});

router.route("/:id").get(async (req, res) => {
    try {
        console.log("route")
        let id = req?.params?.id;

        if(!ObjectId.isValid(id)){
            return res.status(404).render("pages/error", {
                id :req?.session?.user?.id,
                HTML_title: "user not found",
                class: "error",
                status: 404,
                message: "user not found"
            });
        }
        //todo more error checking
        var userLists = await lists.gameListsByUser(id);
        //now we replace each game id with the real game data.
        if (!userLists) {
            return res.status(404).render("pages/error", {
                id :req?.session?.user?.id,
                HTML_title: "user not found",
                class: "error",
                status: 404,
                message: "user not found"
            });
        }
        for (l of userLists) {
            //l is a "list"
            //meaning l.games is an array of games in the list
            console.log("hi")
            console.log( l)
            for (gi in l.games) {
                let newg = await games.getGame(l.games[gi]);
                let revs = await reviews.getReviewFromUserAndGame(l.games[gi], id);
                let coms = await comments.getCommentFromUserAndGame(l.games[gi], id)
                //todo same for comments as revs
                newg.urevs = revs;
                newg.ucoms = coms;
                console.log(newg)
                l.games[gi] = newg;
            }
        }
        console.log(userLists)
        console.log(userLists[0].games)
        res.render("pages/lists", {
            id :req?.session?.user?.id,
            HTML_title: "Lists",
            lists: userLists
        })

    } catch (e) {
        console.log(e)
        return res.status(500).render("pages/error", {
            id :req?.session?.user?.id,
            HTML_title: "Internal Server Error",
            class: "error",
            status: 500,
            message: "Internal Server Error"
        });
    }
    
});

module.exports = router;