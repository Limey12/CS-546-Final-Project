const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");

const reviews = require("./reviews");

//Add a Game
//Takes in a title and description
//image is optional but should be null if it is not inputted
//reviews/comments/rating will be intitialized to default

const addGame = async function addGame(title, description, image) {
  if (arguments.length != 3) {
    throw "should have 3 arguments";
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

  if (!image) {
    image = "/public/images/no_image.jpeg";
  }

  const gameCollection = await games();
  let newGame = {
    title: title,
    description: description,
    image: image,
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
    throw "should take no arguments";
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
    throw "should have 1 argument";
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
    throw "should take 1 argument";
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
const updateGame = async function updateGame(id, title, description, image) {
  if (arguments.length < 2) {
    throw "should take at least 2 arguments";
  }
  if (arguments.length > 4) {
    throw "should take at less than 4 arguments";
  }
  if (!id && !title && !description && !image) {
    throw "field not provided";
  }
  if (
    (typeof id !== "string" && id) ||
    (typeof description !== "string" && description) ||
    (typeof title !== "string" && title) ||
    (typeof image !== "string" && image)
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
  if(!image){
    image = "/public/images/no_image.jpeg";
  }
  image.trim();
  if (title.length == 0 || description.length == 0 || image.length == 0) {
    throw "empty string";
  }
  const gameCollection = await games();
  const game = await gameCollection.findOne({ _id: ObjectId(id) });
  if (game == null) {
    throw "game does not exist";
  }
  if (game.title == title && game.description == description && game.image == image) {
    throw "No fields will change";
  }

  //these ifs are for if you are not updating certain fields you pass those in as null
  //and they are set to the original
  if(title == null){
    title = game.title;
  }
  if(description == null){
    description = game.description;
  }
  if(image == null){
    image = game.image;
  }
  const updatedGame = {
    title: title,
    description: description,
    image: image
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

let getGameSearchTerm = async function getGameSearchTerm(term) {
  if (arguments.length !== 1) {
    throw "should have 1 argument";
  }
  if (!term) {
    throw "Should provide search term";
  }
  if (typeof term !== "string") {
    throw "term must be a string";
  }
  term = term.trim();
  if (term.length === 0) {
    throw "term cannot be an empty string or just spaces";
  }
  const gameCollection = await games();
  const gameList = await gameCollection
    .find({ title: { $regex: term, $options: "i" } })
    .toArray();
  for (i of gameList) {
    i["_id"] = i["_id"].toString();
  }
  return gameList;
};

let getAverageRatingAmongFriends = async function (userID, gameID) {
  //todo validation
  //steps:
  // get list of friend ids (easy)
  // get rating for each freind
  // average ratings

  if (arguments.length != 2) {
    throw "expects 2 args";
  }
  if (!userID) {
    return "N/A";
  }

  const gameCollection = await games();
  const userCollection = await users();

  const user = await userCollection.findOne({ _id: ObjectId(userID) });
  console.log(user);
  const friendList = user.friends;
  if (friendList.length == 0) {
    return "N/A";
  }
  let total = 0; //running total of the reviews
  let reviewCount = 0; //number of freinds that rated the game
  for (f of friendList) {
    //f is id of a friend
    let friend = await userCollection.findOne({ _id: ObjectId(f) });
    console.log(friend);
    const reviewList = friend.reviews;
    await reviews.getGameFromReview(reviewList[0]);
    //todo look in reviews subdocument of the particular game to see if the friend reviewed the game.
    console.log("frrr")
    console.log(friend);
  }
  return total / friendList.legnth;
};

let getImage = async function (gameID) {
  if (!gameID) throw "gameID must be provided";
  const gameCollection = await games();
  const game = await gameCollection.findOne({ _id: ObjectId(gameID) });
  if (!game?.image) {
    return "/public/images/no_image.jpeg";
  }
  return game.image;
};

module.exports = {
  addGame,
  getAllGames,
  getGame,
  removeGame,
  updateGame,
  getAverageRatingAmongFriends,
  getImage,
  getGameSearchTerm,
};
