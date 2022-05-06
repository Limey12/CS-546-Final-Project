const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");

let createReview = async function (userID, gameID, reviewText, rating) {
  if (arguments.length != 4) {
    throw "expects 4 args";
  }
  //todo more input validation
  //make sure user AND game exist
  //along with normal stuff
  const gameCollection = await games();
  const userCollection = await users();
  const newReview = {
    _id : new ObjectId(),
    userId: userID,
    reviewText: reviewText,
    rating: rating
  };
  await gameCollection.updateOne({_id : ObjectId(gameID)}, {$push : {reviews : newReview}});
  //new review is added to video game. Id must be added to user.
  await userCollection.updateOne({_id : ObjectId(userID)}, {$push : {reviews : newReview._id.toString()}});
  return newReview;
};

let getGameFromReview = async function (reviewID) {
  //from a reviewID, return a gameID
  const gameCollection = await games();
  const game = await gameCollection.findOne(
    {"reviews._id": ObjectId(reviewID)}
  );
  if(game === null) throw 'No review with that id.';
  return game._id;
};

let getRatingFromReview = async function (reviewID) {
  //from a reviewID, return the rating
  const gameCollection = await games();
  const game = await gameCollection.findOne(
    {"reviews._id": ObjectId(reviewID)},
    {projection: {reviews: 1}}
  );
  if(game === null) throw 'No review with that id.';
  const gameId = game._id;
  const review = await gameCollection.aggregate([
    {"$match": {"_id": gameId}},
    {"$unwind": "$reviews"},
    {"$match": {"reviews._id": ObjectId(reviewID)}},
    {"$replaceRoot": {"newRoot": "$reviews"}}
  ]).toArray();
  if(review === null) throw 'No review with that id.';
  return review[0].rating;
};

module.exports = {
  createReview,
  getGameFromReview,
  getRatingFromReview,
};
