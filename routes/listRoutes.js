const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { games } = require("../data");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;

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
})

module.exports = router;