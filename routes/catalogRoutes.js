const express = require("express");
const router = express.Router();
const { games } = require("../data");


//GET http://localhost:3000/GameCatalog
router.route("/").get(async (req, res) => {
    try{
        let allGames = await games.getAllGames();
        if(!allGames){
            throw "No games in database"
        }
        if(allGames.length == 0){
            throw "No games in database"
        }
        res.status(400).render("pages/catalog", {games:allGames});
    } catch(e){
        res.status(400).render("pages/catalog", {error:true,errormsg:e});
    }
    
});

//POST 
router.post('/', async (req, res) => {
    let search = req.body.gameSearchTerm;
    search = search.trim();
    if (!search) {
        res.status(404).render('pages/catalog',{games:[],error:true,errormsg:"No searchterm inputted"});
        return;
    }
    gamelist = await games.getGameSearchTerm(search);
    if(gamelist.length == 0){
        res.status(404).render('pages/catalog',{games:[],error:true,errormsg:"No results"});
        return;
    }
    res.render('pages/catalog',{games:gamelist});
});

module.exports = router;
