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
        return res.status(404).render("pages/error", {
            id :req?.session?.user?.id,
            HTML_title: "user not found",
            class: "error",
            status: 404,
            message: "user not found"
        });
    }
    let loggedIn = false;
    let sessionUser = req.session.user; 
    if(sessionUser){
        loggedIn = true;
    }
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    //console.log(user);
    if(!user){
        res.status(404).json({ message: "User not found" });
    }
    let userdId = req?.session?.user?.id;
    let username = user.username;
    let bio = user.bio;
    let friends = user.friends; // fix
    let favoriteGameId = user.favoriteGameId;
    let favoriteGameName = null;
    let favoriteGameImage = null;
    if(favoriteGameId){
        let favoriteGame = await games.getGame(favoriteGameId);
        favoriteGameName = favoriteGame.title;
    }
    let leastFavoriteGameId = user.leastFavoriteGameId;
    let leastFavoriteGameName = null;
    let leastFavoriteGameImage = null;
    if(leastFavoriteGameId){
        let leastFavoriteGame = await games.getGame(leastFavoriteGameId);
        leastFavoriteGameName = leastFavoriteGame.title;
    }
    let pageOwned = loggedIn && (id === userdId);

    res.render("pages/profile", {
        HTML_title: "Profile",
        id: id,
        username: username,
        bio: bio,
        friends: friends,
        favoriteGameName: favoriteGameName,
        leastFavoriteGameName: leastFavoriteGameName,
        pageOwned: pageOwned,
    });
});

module.exports = router;
