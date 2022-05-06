const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { games } = require("../data");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;

router.route("/").get(async (req, res) => {
    if(req.session.user){
        console.log("Logged in\n");
        console.log(req.session.user);
        //redirect user to own profile
        res.redirect("/Profile/" + req.session.user.id);
    }
    else{
        //redirect to login page if user is not logged in
        //might change to "search for profile" page
        res.redirect("/login");
    }
})

//GET http://localhost:3000/Profile/{id}
router.route("/:id").get(async (req, res) => {
    let id = req.params.id;
    if(!ObjectId.isValid(id)){
        res.status(400).send("Invalid ID");
        return;
    }
    let loggedIn = false;
    let sessionUser = req.session.user; 
    if(sessionUser){
        loggedIn = true;
    }
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    console.log(user);
    if(!user){
        res.status(404).json({ message: "User not found" });
    }
    let userdId = req?.session?.user?.id;
    res.render("pages/profile", {
        HTML_title: "Profile",
        id: userdId,
        username: user.username,
        bio: user.bio,
        reviews: user.reviews,
        comments: user.comments,
        friends: user.friends,
        favoriteGameId: user.favoriteGameId,
        leastFavoriteGameId: user.leastFavoriteGameId,
        // bool for if user owns the profile page
        pageOwned: loggedIn && id == sessionUser["id"],
    });
});

module.exports = router;
