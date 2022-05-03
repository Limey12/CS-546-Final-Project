const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;
const { ObjectId } = require("mongodb");

//Add a Game
//Takes in a title and description
//reviews/comments/rating will be intitialized to default

const addGame = async function addGame(title, description) {
  if (arguments.length !== 2) {
    throw "should have 2 arguments";
  }

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

  const gameCollection = await games();
  let newGame = {
    title: title,
    description: description,
    reviews: [],
    comments: [],
    overallRating: 0,
  };
  const insertInfo = await gameCollection.insertOne(newGame);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw "Could not add game";
  }
  newGame["_id"] = newGame["_id"].toString();
  return newGame;
};

//Get all games in the database
const getAllGames = async function getAll() {
  if (arguments.length !== 0) {
    ("should take no arguments");
  }
  const gameCollection = await games();
  const gameList = await gameCollection.find({}).toArray();
  if (!gameList) throw "Could not get all games";
  for (let i of gameList) {
    i["_id"] = i["_id"].toString();
  }
  return gameList;
};

//Get a game based on the id
const getGame = async function getGame(id) {
  if (arguments.length !== 1) {
    ("should have 1 argument");
  }
  if (!id) {
    throw "You must provide an id to search for";
  }
  if (typeof id !== "string") {
    throw "Id must be a string";
  }
  if (id.trim().length === 0) {
    throw "Id cannot be an empty string or just spaces";
  }
  id = id.trim();
  if (!ObjectId.isValid(id)) {
    throw "invalid object ID";
  }
  const gameCollection = await games();
  const game = await gameCollection.findOne({ _id: ObjectId(id) });
  game["_id"] = game["_id"].toString();
  return game;
};

//removes a game from the database based on the id
const removeGame = async function removeGame(id) {
  if (arguments.length !== 1) {
    ("should take 1 argument");
  }
  if (!id) {
    throw "You must provide an id to search for";
  }
  if (typeof id !== "string") {
    throw "Id must be a string";
  }
  if (id.trim().length === 0) {
    throw "Id cannot be an empty string or just spaces";
  }
  id = id.trim();
  if (!ObjectId.isValid(id)) {
    throw "invalid object ID";
  }
  const gameCollection = await games();
  const game = await gameCollection.findOne({ _id: ObjectId(id) });
  if (game === null) {
    throw `Could not delete games with id of ${id}`;
  }
  const deletionInfo = await gameCollection.deleteOne({ _id: ObjectId(id) });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete games with id of ${id}`;
  }
  return game;
};

//updates game
const updateGame = async function updateGame(id, title, description) {
  if (arguments.length !== 3) {
    ("should take 3 arguments");
  }
  if (!id || !title || !description) {
    throw "field not provided";
  }
  if (
    typeof id !== "string" ||
    typeof title !== "string" ||
    typeof description !== "string"
  ) {
    throw "not correct type";
  }
  if (id.trim().length === 0) {
    throw "Id cannot be an empty string or just spaces";
  }
  id = id.trim();
  if (!ObjectId.isValid(id)) {
    throw "invalid object ID";
  }
  title.trim();
  description.trim();
  if (title.length == 0 || description.length == 0) {
    throw "empty string";
  }
  const gameCollection = await games();
  const game = await gameCollection.findOne({ _id: ObjectId(id) });
  if (game == null) {
    throw "game does not exist";
  }
  if (game.title == title && game.description == description) {
    throw "No fields will change";
  }
  const updatedGame = {
    title: title,
    description: description,
  };

  const updatedInfo = await gameCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: updatedGame }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update game successfully";
  }

  return await this.getGame(id);
};

let getAverageRatingAmongFriends = function () {
  //todo
};

let getImageFromGameId = function () {
  //todo
};

module.exports = {
  addGame,
  getAllGames,
  getGame,
  removeGame,
  updateGame,
};
