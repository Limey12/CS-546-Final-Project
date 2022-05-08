const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");

const validate = require("../validation/validation");

const goodRank = 3;

//Add a Game
//Takes in a title and description
//image is optional but should be null if it is not inputted
//reviews/comments/rating will be intitialized to default

const addGame = async function addGame(title, description, image) {
  if (arguments.length < 2) {
    throw "Error: At least 2 arguments expected";
  }
  if (arguments.length > 3) {
    throw "Error: At most 3 arguments expected";
  }

  title = await validate.checkString(title, "Title");
  description = await validate.checkString(description, "Description");
  if (!image) {
    image = null;
  } else {
    await validate.checkImage(image);
  }

  const gameCollection = await games();
  let newGame = {
    title: title,
    description: description,
    image: image,
    reviews: [],
    comments: [],
    overallRating: null,
    totalRatings: 0,
  };
  const insertInfo = await gameCollection.insertOne(newGame);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw "Error: Could not add game";
  }
  newGame["_id"] = newGame["_id"].toString();
  return newGame;
};

//Get all games in the database
const getAllGames = async function getAll() {
  if (arguments.length !== 0) {
    throw "Error: 0 arguments expected";
  }
  const gameCollection = await games();
  const gameList = await gameCollection.find({}).toArray();
  for (let i of gameList) {
    i["_id"] = i["_id"].toString();
  }
  return gameList;
};

//Get a game based on the id
const getGame = async function getGame(id) {
  if (arguments.length !== 1) {
    throw "Error: 1 argument expected";
  }
  id = await validate.checkId(id, "Id");
  const gameCollection = await games();
  const game = await gameCollection.findOne({ _id: ObjectId(id) });
  if (game === null) {
    throw "Error: Game not found";
  }
  game["_id"] = game["_id"].toString();
  return game;
};

//removes a game from the database based on the id
const removeGame = async function removeGame(id) {
  if (arguments.length !== 1) {
    throw "Error: 1 argument expected";
  }
  id = await validate.checkId(id, "Id");
  const gameCollection = await games();
  const game = await gameCollection.findOne({ _id: ObjectId(id) });
  if (game === null) {
    throw "Error: Game not found";
  }
  const deletionInfo = await gameCollection.deleteOne({ _id: ObjectId(id) });

  if (deletionInfo.deletedCount === 0) {
    throw `Error: Could not delete game with id of ${id}`;
  }
  return game;
};

let getGameSearchTerm = async function getGameSearchTerm(term) {
  if (arguments.length !== 1) {
    throw "Error: 1 argument expected";
  }
  term = await validate.checkString(term, "Title");
  const gameCollection = await games();
  const gameList = await gameCollection
    .find({ title: { $regex: term, $options: "i" } })
    .toArray();
  if (gameList === null) {
    throw "Error: Game not found";
  }
  for (i of gameList) {
    i["_id"] = i["_id"].toString();
  }
  return gameList;
};

let getImage = async function (id) {
  if (arguments.length !== 1) {
    throw "Error: 1 argument expected";
  }
  id = await validate.checkId(id, "Id");
  const gameCollection = await games();
  const game = await gameCollection.findOne({ _id: ObjectId(id) });
  if (game === null) {
    throw "Error: Game not found";
  }
  if (!game?.image) {
    return "/public/images/no_image.jpeg";
  }
  return game.image;
};

const getRecommendations = async function getRecommendations(id) {
  if (arguments.length !== 1) {
    throw "Error: 1 argument expected";
  }
  id = await validate.checkId(id, "Id");
  const gameCollection = await games();
  const userCollection = await users();
  const game = await gameCollection.findOne({ _id: ObjectId(id) });
  const reviews = game.reviews;
  let gameList = [];
  for (r of reviews) {
    if (r.rating >= goodRank) {
      let user = await userCollection.findOne({ _id: ObjectId(r.userId) });
      if (!user) {
        continue;
      }
      if (user?.favoriteGameId) {
        gameList.push(await getGame(user.favoriteGameId));
      }
    }
  }
  gameList = gameList.filter((value, index) => {
    const _value = JSON.stringify(value);
    return (
      index ===
      gameList.findIndex((obj) => {
        return JSON.stringify(obj) === _value;
      })
    );
  });
  return gameList;
};

module.exports = {
  addGame,
  getAllGames,
  getGame,
  removeGame,
  getImage,
  getGameSearchTerm,
  getRecommendations,
};
