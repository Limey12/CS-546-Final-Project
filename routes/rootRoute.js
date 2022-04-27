const express = require("express");
const router = express.Router();

//GET http://localhost:3000/
router.route("/").get(async (req, res) => {
    res.status(404).send("default");
});

module.exports = router;
