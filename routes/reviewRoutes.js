const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { games, reviews, users } = require("../data");
const xss = require('xss');

router.route("/").get(async (req, res) => {
    if(xss(req.session.user)){
        console.log("Logged in\n");
        console.log(xss(req.session.user));
        //redirect user to own profile
        res.redirect("/Reviews/" + xss(req.session.user.id));
    }
    else{
        //redirect to login page if user is not logged in
        //might change to "search for profile" page
        res.redirect("/login");
    }
})

//GET http://localhost:3000/Reviews/{id}
router.route("/:id").get(async (req, res) => {
    let id = xss(req.params.id);
    if(!ObjectId.isValid(id)){
        res.status(400).send("Invalid ID");
        return;
    }
    let loggedIn = false;
    let user = await users.getUser(id);
    if(!user){
        res.status(404).json({ message: "User not found" });
    }
    let userId = xss(req?.session?.user?.id);
    let reviewList = [];
    if(!user.reviews){
        res.status(404).json({ message: "User has no reviews" });
    }else{
        for(let x = 0; x < user.reviews.length; x++){
            let reviewTemp = await reviews.getReview(user.reviews[x]);
            //console.log(reviewTemp);
            let reviewContent = reviewTemp.reviewText;
            let reviewGameId = await reviews.getGameFromReview(reviewTemp._id.toString());
            let reviewGame = await games.getGame(reviewGameId.toString());
            let rating = reviewTemp.rating;
            let review = {game: reviewGame.title, review: reviewContent, rating: rating};
            reviewList.push(review);
        }
    }
    res.render("pages/reviews", {
        HTML_title: "Reviews",
        id: id,
        username: user.username,
        reviews: reviewList,
    });
});

module.exports = router;
