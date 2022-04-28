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
    //Update Game
    const Minecraft2 = await games.updateGame(
      Minecraft._id.toString(),
      "Minecraft 2",
      "Bigger Game"
    );
    console.log(await games.getGame(Minecraft._id.toString(),));
  } catch (e) {
    console.log(e);
  }

  await dbConnection.closeConnection();
}

main();
