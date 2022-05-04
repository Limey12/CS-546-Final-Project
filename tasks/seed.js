const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const games = data.games;

async function main() {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();
  //Add Games
  try {
    const Minecraft = await games.addGame(
      "Minecraft",
      "Block Game Big Man Steve"
    );
    const Pokemon = await games.addGame(
      "Pokemon",
      "Catch them All"
    );
    const RiskofRain2 = await games.addGame(
      "Risk of Rain 2",
      "Rougelike 3d shooter"
    );
    const Persona5 = await games.addGame(
      "Persona 5",
      "aaaaa"
    );
    const LeagueofLegends = await games.addGame(
      "League of Legends",
      "Cringe"
    );
    const Persona4 = await games.addGame(
      "Persona 4",
      "aaaaaa2"
    );
    //Update Game
    const Minecraft2 = await games.updateGame(
      Minecraft._id.toString(),
      "Minecraft 2",
      "Bigger Game"
    );
    // console.log(await games.getGame(Minecraft._id.toString()));
    console.log(await games.getGameSearchTerm("Persona"));
  } catch (e) {
    console.log(e);
  }

  await dbConnection.closeConnection();
}

main();
