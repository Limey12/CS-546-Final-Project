const express = require("express");
const router = express.Router();

//GET http://localhost:3000/game/{id}
router.route("/:id").get(async (req, res) => {
    //todo: look up game in database
    let game = {}; //game object from database
    let hobj = {
        game_name: "test",
        image: "",
        alt: "",
        description: "",
        f_rating: "",
        overall_rating: "",
        reviews: {},
    };
    res.render("pages/game");
});

module.exports = router;
