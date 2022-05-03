const express = require("express");
const router = express.Router();
const { games } = require("../data");

//GET http://localhost:3000/Profile/{id}
router.route("/:id").get(async (req, res) => {
    let profileId = req.params.id;
    // Todo:
    // 1. Check if profileId is valid
    // 2. Get info from profileId
    //  - Get user's name
    //  - Get user's friends
    //  - Get user's games
    //  - Get user's reviews
    // 3. Render profile page
    res.render("pages/profile");
});

module.exports = router;
