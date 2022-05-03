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
router.post('/searchgames', async (req, res) => {
    let search = req.body.gameSearchTerm;
    if (!search) {
        res.status(400).render('pages/catalog',{title:"Show Finder",gameSearchTerm:search,error:true,errormsg:"No searchterm inputted"});
        return;
    }
    else{
        search = search.trim();
        if(!search){
            res.status(400).render('pages/catalog',{title:"Show Finder",gameSearchTerm:search,error:true,errormsg:"No searchterm inputted"});
            return;
        }
    }
    
    games = await gameData.getAllGames(); //todo
    if(games.length == 0){
        res.status(400).render('pages/catalog',{title:"Show Finder",gameSearchTerm:search,error:true,errormsg:"No results"});
        return;
    }
    res.render('pages/catalog',{title:"Show Finder",gameSearchTerm:search});
});

module.exports = router;
