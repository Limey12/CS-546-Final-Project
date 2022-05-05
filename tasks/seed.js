const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const games = data.games;
const users = data.users;

async function main() {
  const db = await dbConnection.dbConnection();
  // await db.dropDatabase();
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
    console.log(Persona4);
    // console.log(await games.getGame(Minecraft._id.toString()));
    console.log(await games.getGameSearchTerm("Persona"));

    //seeding users database
    const u1 = await users.createUser("user01", "user01@email.com", "1234567890");
    const u2 = await users.createUser("user02", "user02@email.com", "1234567890");
    const u3 = await users.createUser("user03", "user03@email.com", "1234567890");
    const u4 = await users.createUser("user04", "user04@email.com", "1234567890");

    await users.addFriend(u1._id, u4._id);
    await users.addFriend(u1._id, u2._id);
    await users.addFriend(u3._id, u4._id);

  } catch (e) {
    console.log(e);
  }

  await dbConnection.closeConnection();
}

main();
