const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const gamesApi = require("./games");
const validate = require("../validation/validation");
let createComment = async function (userId, gameId, commentText) {
  if (arguments.length !== 3) {
    throw "Error: 3 arguments expected";
  }
  userId = await validate.checkId(userId, "UserId");
  gameId = await validate.checkId(gameId, "GameId");
  commentText = await validate.checkString(commentText, "Comment Text");

  const gameCollection = await games();
  const userCollection = await users();
  const newComment = {
    _id: new ObjectId(),
    userId: userId,
    commentText: commentText,
  };

  const gameUpdateInfo = await gameCollection.updateOne(
    { _id: ObjectId(gameId) },
    {
      $push: { comments: newComment },
    }
  );
  if (!gameUpdateInfo.matchedCount && !gameUpdateInfo.modifiedCount)
    throw "Update failed";

  //new review is added to video game. Id must be added to user.
  const userUpdateInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $push: { comments: newComment._id.toString() } }
  );
  if (!userUpdateInfo.matchedCount && !userUpdateInfo.modifiedCount)
    throw "Update failed";
  return newComment;
};

let getCommentFromUserAndGame = async function (gameId, userId) {
  if (arguments.length !== 2) {
    throw "Error: 2 arguments expected";
  }
  userId = await validate.checkId(userId, "UserId");
  gameId = await validate.checkId(gameId, "GameId");
  const game = await gamesApi.getGame(gameId);
  let rev = [];
  for (r of game.comments) {
    if (r.userId == userId) {
      rev.push(r);
    }
  }
  return rev;
};

module.exports = {
  createComment,
  getCommentFromUserAndGame,
};
