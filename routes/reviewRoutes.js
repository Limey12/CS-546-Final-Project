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
        res.redirect("/Reviews/" + req.session.user.id);
    }
    else{
        //redirect to login page if user is not logged in
        //might change to "search for profile" page
        res.redirect("/login");
    }
})

//GET http://localhost:3000/Reviews/{id}
router.route("/:id").get(async (req, res) => {
    let id = req.params.id;
    if(!ObjectId.isValid(id)){
        res.status(400).send("Invalid ID");
        return;
    }
    let loggedIn = false;
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    //console.log(user);
    if(!user){
        res.status(404).json({ message: "User not found" });
    }
    let userdId = req?.session?.user?.id;
    res.render("pages/reviews", {
        HTML_title: "Reviews",
        id: userdId,
        username: user.username,
        reviews: user.reviews,
    });
});

module.exports = router;
