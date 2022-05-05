const express = require("express");
const { ReturnDocument } = require("mongodb");
const router = express.Router();
const { games } = require("../data");


//GET http://localhost:3000/GameCatalog
router.route("/").get(async (req, res) => {
    try{
        //for testing
        //let loggedIn = (req.session.user) ? true : false;
        let allGames = await games.getAllGames();
        if(!allGames){
            throw "No games in database"
        }
        if(allGames.length == 0){
            throw "No games in database"
        }
        if(req.session.user){
            login = true;
        }
        res.render("pages/catalog", {games:allGames, login: true}); //set login true testign
    } catch(e){
        res.status(500).render("pages/catalog", {error:true,errormsg:e});
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
    try{
        gamelist = await games.getGameSearchTerm(search);
        if(gamelist.length == 0){
            res.status(404).render('pages/catalog',{games:[],error:true,errormsg:"No results"});
            return;
        }
        res.render('pages/catalog',{games:gamelist});
    } catch(e){
        res.status(500).render("pages/catalog", {error:true,errormsg:e});
    }
    
});

//GET http://localhost:3000/GameCatalog/gameform'
router.route("/gameform").get(async (req, res) => {
    try{
        let loggedIn = (req.session.user) ? true : false;
        res.render('pages/gameform');
    }catch(e){
        res.status(500).render('pages/gameform');
    }
});


//POST called by AJAX request
router.route("/gameform").post(async (req, res) => {
    let title = req.body.title;//need xss
    let description = req.body.description;//need xss
    try{
        if (!title || !description) {
            throw "field not provided";
          }
        
          if (typeof title !== "string" || typeof description !== "string") {
            throw "not string";
          }
        
          title = title.trim();
          description = description.trim();
        
          if (title.length <= 0 || description.length <= 0) {
            throw "Cannot be an empty string";
          }
    } catch(e){
        res.status(404).json({success:false,error: e})
        return;
    }
    
    try{
        let addedgame = await games.addGame(title,description);
        res.json({success:true,addedgame: addedgame}); //need xss
    } catch(e){
        res.status(500).json({success:false,error:e})
        return;
    }
    
});

module.exports = router;
