const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;
const { ObjectId } = require("mongodb");

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
  return newGame;
};



module.exports = {
  addGame
};
