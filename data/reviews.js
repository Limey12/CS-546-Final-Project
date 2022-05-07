const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;
const users = mongoCollections.users;
const listsApi = require("./lists");
const gamesApi = require('./games');
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
    _id: new ObjectId(),
    userId: userID,
    reviewText: reviewText,
    rating: rating,
  };
  const game = await gameCollection.findOne({ _id: ObjectId(gameID) });
  await gameCollection.updateOne(
    { _id: ObjectId(gameID) },
    {
      $push: { reviews: newReview },
      $inc: { totalRatings: rating != null ? 1 : 0 },
      $set: {
        overallRating:
          (game.overallRating * game.totalRatings + rating) /
          (game.totalRatings + 1),
      },
    }
  );
  //new review is added to video game. Id must be added to user.
  await userCollection.updateOne(
    { _id: ObjectId(userID) },
    { $push: { reviews: newReview._id.toString() } }
  );

  //reviewing a game means you have played it. add game to played games list
  await listsApi.addGameToList(userID, "Played Games", gameID);
  return newReview;
};

let getGameFromReview = async function (reviewID) {
  //from a reviewID, return a gameID
  const gameCollection = await games();
  const game = await gameCollection.findOne({
    "reviews._id": ObjectId(reviewID),
  });
  if (game === null) throw "No review with that id.";
  return game._id;
};

let getReview = async function (reviewID) {
  //from a reviewID, return the rating
  const gameCollection = await games();
  const game = await gameCollection.findOne(
    { "reviews._id": ObjectId(reviewID) },
    { projection: { reviews: 1 } }
  );
  if (game === null) throw "No review with that id.";
  const gameId = game._id;
  const review = await gameCollection
    .aggregate([
      { $match: { _id: gameId } },
      { $unwind: "$reviews" },
      { $match: { "reviews._id": ObjectId(reviewID) } },
      { $replaceRoot: { newRoot: "$reviews" } },
    ])
    .toArray();
  if (review === null) throw "No review with that id.";
  return review[0];
};


let getRatingFromReview = async function (reviewID) {
  //from a reviewID, return the rating
  const gameCollection = await games();
  const game = await gameCollection.findOne(
    { "reviews._id": ObjectId(reviewID) },
    { projection: { reviews: 1 } }
  );
  if (game === null) throw "No review with that id.";
  const gameId = game._id;
  const review = await gameCollection
    .aggregate([
      { $match: { _id: gameId } },
      { $unwind: "$reviews" },
      { $match: { "reviews._id": ObjectId(reviewID) } },
      { $replaceRoot: { newRoot: "$reviews" } },
    ])
    .toArray();
  if (review === null) throw "No review with that id.";
  return review[0].rating;
};

let getReviewFromUserAndGame = async function (gameID, userID) {
  //todo validate
  const gameCollection = await games();
  const game = await gamesApi.getGame(gameID);
  console.log(game)
  let rev = [];
  for (r of game.reviews) {
    if (r.userId == userID) {
      rev.push(r);
    }
  }
  return rev;
}

let getAverageRatingAmongFriends = async function (userID, gameID) {
  if (arguments.length != 2) {
    throw "expects 2 args";
  }
  if (!userID) {
    return null;
  }

  const userCollection = await users();

  const user = await userCollection.findOne({ _id: ObjectId(userID) });
  console.log(user);
  const friendList = user.friends;
  if (friendList.length == 0) {
    return null;
  }
  let total = 0; //running total of the reviews
  let reviewCount = 0; //number of freinds that rated the game
  for (f of friendList) {
    //f is id of a friend
    let friend = await userCollection.findOne({ _id: ObjectId(f) });
    console.log(friend);
    const reviewList = friend.reviews;
    for (r of reviewList) {
      if (await getGameFromReview(r) == gameID && await getRatingFromReview(r) != null) {
        total += await getRatingFromReview(r);
        reviewCount++;
      }
    }


    // await reviews.getGameFromReview(reviewList[0]);
    //todo look in reviews subdocument of the particular game to see if the friend reviewed the game.

    console.log("frrr")
    console.log(friend);
  }
  if (reviewCount == 0) {
    return null;
  }
  return total / reviewCount;
};

module.exports = {
  createReview,
  getGameFromReview,
  getRatingFromReview,
  getReview,
  getReviewFromUserAndGame,
  getAverageRatingAmongFriends,
};
