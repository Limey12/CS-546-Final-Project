const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const games = data.games;
const users = data.users;
const reviews = data.reviews;
const comments = data.comments;
const lists = data.lists;

async function main() {
  
  const db = await dbConnection.dbConnection();
  if (process.argv.includes("drop")) {
    await db.dropDatabase();
  } 
  //Add Games
  try {
    console.log("creating games")
    const Minecraft = await games.addGame(
      "Minecraft",
      "Minecraft is a 3-D computer game where players can build anything. The game which has been described as like an 'online Lego' involves building blocks and creating structures across different environments and terrains. Set in a virtual world the game involves resource gathering, crafting items, building, and combat.",
      "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png"
    );
    const Pokemon = await games.addGame(
      "Pokemon",
      "Pokémon Red and Blue Versions, commonly shortened as Pokémon Red and Blue, are the first two international Pokémon releases. In Japan, the original pair were Pocket Monsters Red and Green, which were then followed by the enhanced version, Pocket Monsters Blue. Pokémon Yellow, which was based upon the anime series, would later be released internationally.",
      "https://static.wikia.nocookie.net/pokemon/images/e/e2/Pokemon_Red.jpg"
    );
    const RiskofRain2 = await games.addGame(
      "Risk of Rain 2",
      "Rougelike 3d shooter",
      "https://assets.nintendo.com/image/upload/c_fill,f_auto,q_auto,w_1200/v1/ncom/en_US/games/switch/r/risk-of-rain-2-switch/hero"
      
    );
    const Persona5 = await games.addGame(
      "Persona 5",
      "Persona 5 is a game about the internal and external conflicts of a group of troubled high school students – the protagonist and a collection of compatriots he meets in the game's story – who live dual lives as Phantom Thieves.",
      "https://image.api.playstation.com/vulcan/img/cfn/11307XlqDFlHmHWGjBPndSappCDTnE9OmnP2P-dSzcvLX9i0pvH_okJOl6dP1AnZefxthD-2k3RrsdzYU_BqUy9K5_sv-Tnx.png"
    );
    const LeagueofLegends = await games.addGame(
      "League of Legends",
      "League of Legends is a team-based strategy game where two teams of five powerful champions face off to destroy the other's base. Choose from over 140 champions to make epic plays, secure kills, and take down towers as you battle your way to victory.",
      "https://www.gamingscan.com/wp-content/uploads/2020/10/League-Of-Legends-System-Requirements.jpg"
    );
    const Persona4 = await games.addGame(
      "Persona 4",
      "Persona 4 follows a group of high school students dealing with a mysterious TV channel dedicated to distorting and exaggerating the truth of who they are and their identities. A string of bizarre murders related to the TV channel begins shaking their once peaceful town.",
      "https://upload.wikimedia.org/wikipedia/en/1/10/Shin_Megami_Tensei_Persona_4.jpg"
    );
    //Update Game
    // const Minecraft2 = await games.updateGame(
    //   Minecraft._id.toString(),
    //   "Minecraft 2",
    //   "Bigger Game",
    //   null
    // );
    console.log("logging persona4")
    console.log(Persona4);
    // console.log(await games.getGame(Minecraft._id.toString()));
    console.log(await games.getGameSearchTerm("Persona"));

    //seeding users database
    console.log("creating users")
    const u1 = await users.createUser("user01", "user01@email.com", "1234567890");
    const u2 = await users.createUser("user02", "user02@email.com", "1234567890");
    const u3 = await users.createUser("user03", "user03@email.com", "1234567890");
    const u4 = await users.createUser("user04", "user04@email.com", "1234567890");
    const u5 = await users.createUser("qwerty", "qwerty@email.com", "qwerty");
    const u6 = await users.createUser("qwerty2", "qwerty2@email.com", "qwerty2");
    await users.addFriend(u1._id, u4._id);
    await users.addFriend(u1._id, u2._id);
    await users.addFriend(u3._id, u4._id);
    
    //creating reviews
    console.log("creating reviews")
    const r1 = await reviews.createReview(u4._id, Persona4._id, "pretty good", 3);
    const r2 = await reviews.createReview(u2._id, Persona4._id, "is persona = bad", 1);
    const r3 = await reviews.createReview(u1._id, Persona4._id, "good!", 4);
    const r3_ = await reviews.createReview(u1._id, Persona4._id, "good! again", 4);
    const r4 = await reviews.createReview(u1._id, Persona5._id, "good!!!", 5);
    const r5 = await reviews.createReview(u3._id, Persona5._id, "good", 4);
    const r6 = await reviews.createReview(u4._id, Persona5._id, "pretty good also", 3);
    const r7 = await reviews.createReview(u5._id, Persona5._id, "fancy", 3);
    const r8 = await reviews.createReview(u6._id, Persona5._id, "it is like pokemon", 4);

    console.log(r1)

    console.log(await reviews.getReviewFromUserAndGame(Persona4._id, u1._id));

    //favorite games
    await users.favorite(u1._id, Persona5._id);
    await users.favorite(u3._id, RiskofRain2._id);
    await users.favorite(u4._id, Persona4._id);
    await users.favorite(u5._id, LeagueofLegends._id);
    await users.favorite(u6._id, Pokemon._id);

    //creating comments
    const c1 = await comments.createComment(u2._id, Persona4._id, "u2 comment on persona 4");
    const c2 = await comments.createComment(u3._id, Minecraft._id, "u3 comment on minecraft");
    const c3 = await comments.createComment(u1._id, Persona4._id, "u1 comment on persona 4");
    const c4 = await comments.createComment(u1._id, Persona5._id, "u1 comment on persona 5");
    

    //lists
    const l1 = await lists.createList(u1._id, "test1", true);
    const l1_ = await lists.createList(u1._id, "test1_", true);
    const l2 = await lists.createList(u2._id, "test2", true);
    const l3 = await lists.createList(u3._id, "test3", true);

    await lists.addGameToList(u1._id, "test1", LeagueofLegends._id);
    await lists.addGameToList(u1._id, "test1", Pokemon._id);
    await lists.addGameToList(u1._id, "test1", Persona4._id);


  } catch (e) {
    console.log(e);
  }

  await dbConnection.closeConnection();
}

main();
