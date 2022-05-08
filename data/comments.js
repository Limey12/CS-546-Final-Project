const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const gamesApi = require('./games');
let createComment = async function (userID, gameID, commentText) {
  if (arguments.length != 3) {
    throw "expects 3 args";
  }

  //todo more input validation
  const gameCollection = await games();
  const userCollection = await users();
  const newComment = {
    _id: new ObjectId(),
    userId: userID,
    commentText: commentText,
  };

  const game = await gameCollection.findOne({ _id: ObjectId(gameID) });
  await gameCollection.updateOne(
    { _id: ObjectId(gameID) },
    {
      $push: { comments: newComment },
    }
  );
  //new review is added to video game. Id must be added to user.
  await userCollection.updateOne(
    { _id: ObjectId(userID) },
    { $push: { comments: newComment._id.toString() } }
  );
  return newComment;
}

let getCommentFromUserAndGame = async function (gameID, userID) {
  //todo validate
  const gameCollection = await games();
  const game = await gamesApi.getGame(gameID);
  console.log(game)
  let rev = [];
  for (r of game.comments) {
    if (r.userId == userID) {
      rev.push(r);
    }
  }
  return rev;
}

module.exports = {
  createComment,
  getCommentFromUserAndGame
}