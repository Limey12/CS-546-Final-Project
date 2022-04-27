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
  } catch (e) {
    console.log(e);
  }

  await dbConnection.closeConnection();
}

main();
