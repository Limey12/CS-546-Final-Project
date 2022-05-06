const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const games = data.games;
const users = data.users;
const reviews = data.reviews;
const comments = data.comments;

async function main() {
  
  const db = await dbConnection.dbConnection();
  if (process.argv.includes("drop")) {
    await db.dropDatabase();
  } 
  //Add Games
  try {
    const Minecraft = await games.addGame(
      "Minecraft",
      "Block Game Big Man Steve",
      "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png"
    );
    const Pokemon = await games.addGame(
      "Pokemon",
      "Catch them All",
      "https://m.media-amazon.com/images/M/MV5BNDcwZDc2NTEtMzU0Ni00YTQyLWIyYTQtNTI3YjM0MzhmMmI4XkEyXkFqcGdeQXVyNTgyNTA4MjM@._V1_.jpg"
    );
    const RiskofRain2 = await games.addGame(
      "Risk of Rain 2",
      "Rougelike 3d shooter",
      null
    );
    const Persona5 = await games.addGame(
      "Persona 5",
      "Joker RPG",
      "https://image.api.playstation.com/vulcan/img/cfn/11307XlqDFlHmHWGjBPndSappCDTnE9OmnP2P-dSzcvLX9i0pvH_okJOl6dP1AnZefxthD-2k3RrsdzYU_BqUy9K5_sv-Tnx.png"
    );
    const LeagueofLegends = await games.addGame(
      "League of Legends",
      "Cringe",
      null
    );
    const Persona4 = await games.addGame(
      "Persona 4",
      "aaaaaa2",
      null
    );
    //Update Game
    // const Minecraft2 = await games.updateGame(
    //   Minecraft._id.toString(),
    //   "Minecraft 2",
    //   "Bigger Game",
    //   null
    // );
    console.log(Persona4);
    // console.log(await games.getGame(Minecraft._id.toString()));
    console.log(await games.getGameSearchTerm("Persona"));

    //seeding users database
    const u1 = await users.createUser("user01", "user01@email.com", "1234567890");
    const u2 = await users.createUser("user02", "user02@email.com", "1234567890");
    const u3 = await users.createUser("user03", "user03@email.com", "1234567890");
    const u4 = await users.createUser("user04", "user04@email.com", "1234567890");
    const u5 = await users.createUser("qwerty", "qwerty@email.com", "qwerty");
    await users.addFriend(u1._id, u4._id);
    await users.addFriend(u1._id, u2._id);
    await users.addFriend(u3._id, u4._id);
    
    //creating reviews
    const r1 = await reviews.createReview(u4._id, Persona4._id, "pretty good", 3);
    const r2 = await reviews.createReview(u2._id, Persona4._id, "is persona = bad", 1);
    console.log(r1)

    //creating comments
    const c1 = await comments.createComment(u2._id, Persona4._id, "u2 comment on persona 4");
    const c2 = await comments.createComment(u3._id, Minecraft._id, "u3 comment on minecraft");
    

  } catch (e) {
    console.log(e);
  }

  await dbConnection.closeConnection();
}

main();
