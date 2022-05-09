const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const axios = require("axios");
const games = data.games;
const users = data.users;
const reviews = data.reviews;
const comments = data.comments;
const lists = data.lists;
const GAMES_TO_QUERY = 100;
async function main() {
  
  const db = await dbConnection.dbConnection();
  if (process.argv.includes("drop")) {
    await db.dropDatabase();
  } 
  //Add Games
  try {
    let steam = await axios.get("https://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json");
    steam = steam.data.applist.apps;
    steam = steam.slice(0, GAMES_TO_QUERY);

    for (s of steam) {
      //s is a steam game
      if (s.name && s.appid) {
        //try to get more info on s
        let game = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${s.appid}`);
        game = game.data[s.appid];
        console.log(game);
        if (game.success) {
          //add game to database
          let name = game.data.name;
          let des = game.data.short_description;
          let img = game.data.header_image;
          if (name && des && img) {
            await games.addGame(
              game.data.name,
              game.data.short_description,
              game.data.header_image
            );
          }
        }
      } 
    }
  } catch (e) {
    console.log(e);
  }

  await dbConnection.closeConnection();
}

main();