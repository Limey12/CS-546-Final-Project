const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;
const users = mongoCollections.users;
const listsApi = require("./lists");
const gamesApi = require("./games");
const { ObjectId } = require("mongodb");
const validate = require("../validation/validation");

let createReview = async function (userId, gameId, reviewText, rating) {
  if (arguments.length !== 4) {
    throw "Error: 4 arguments expected";
  }
  userId = await validate.checkId(userId, "UserId");
  gameId = await validate.checkId(gameId, "GameId");
  reviewText = await validate.checkString(reviewText, "Review Text");
  rating = Number(rating);
  const gameCollection = await games();
  const userCollection = await users();
  const newReview = {
    _id: new ObjectId(),
    userId: userId,
    reviewText: reviewText,
    rating: rating,
  };
  const game = await gameCollection.findOne({ _id: ObjectId(gameId) });
  if (game === null) {
    throw "Error: Game not found";
  }
  const gameUpdateInfo = await gameCollection.updateOne(
    { _id: ObjectId(gameId) },
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
  if (!gameUpdateInfo.matchedCount && !gameUpdateInfo.modifiedCount)
    throw "Error: Update failed";
  //new review is added to video game. Id must be added to user.
  const userUpdateInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $push: { reviews: newReview._id.toString() } }
  );
  if (!userUpdateInfo.matchedCount && !userUpdateInfo.modifiedCount)
    throw "Error: Update failed";

  //reviewing a game means you have played it. add game to played games list
  await listsApi.addGameToList(userId, "Played Games", gameId);
  return newReview;
};

let getGameFromReview = async function (reviewId) {
  //from a reviewId, return a gameId
  if (arguments.length !== 1) {
    throw "Error: 1 argument expected";
  }
  reviewId = await validate.checkId(reviewId, "ReviewId");
  const gameCollection = await games();
  const game = await gameCollection.findOne({
    "reviews._id": ObjectId(reviewId),
  });
  if (game === null) throw "Error: Review not found";
  return game._id;
};

let getReview = async function (reviewId) {
  //from a reviewId, return the rating
  if (arguments.length !== 1) {
    throw "Error: 1 argument expected";
  }
  reviewId = await validate.checkId(reviewId, "ReviewId");
  const gameCollection = await games();
  const game = await gameCollection.findOne(
    { "reviews._id": ObjectId(reviewId) },
    { projection: { reviews: 1 } }
  );
  if (game === null) throw "Error: Review not found";
  const gameId = game._id;
  const review = await gameCollection
    .aggregate([
      { $match: { _id: gameId } },
      { $unwind: "$reviews" },
      { $match: { "reviews._id": ObjectId(reviewId) } },
      { $replaceRoot: { newRoot: "$reviews" } },
    ])
    .toArray();
  if (review === null) throw "Error: Review not found";
  return review[0];
};

let getRatingFromReview = async function (reviewId) {
  //from a reviewId, return the rating
  if (arguments.length !== 1) {
    throw "Error: 1 argument expected";
  }
  reviewId = await validate.checkId(reviewId, "ReviewId");
  const gameCollection = await games();
  const game = await gameCollection.findOne(
    { "reviews._id": ObjectId(reviewId) },
    { projection: { reviews: 1 } }
  );
  if (game === null) throw "Error: Review not found";
  const gameId = game._id;
  const review = await gameCollection
    .aggregate([
      { $match: { _id: gameId } },
      { $unwind: "$reviews" },
      { $match: { "reviews._id": ObjectId(reviewId) } },
      { $replaceRoot: { newRoot: "$reviews" } },
    ])
    .toArray();
  if (review === null) throw "Error: Review not found";
  return review[0].rating;
};

let getReviewFromUserAndGame = async function (gameId, userId) {
  if (arguments.length !== 2) {
    throw "Error: 2 arguments expected";
  }
  gameId = await validate.checkId(gameId, "GameId");
  userId = await validate.checkId(userId, "UserId");
  const game = await gamesApi.getGame(gameId);
  let rev = [];
  for (r of game.reviews) {
    if (r.userId == userId) {
      rev.push(r);
    }
  }
  return rev;
};

let getAverageRatingAmongFriends = async function (userId, gameId) {
  if (arguments.length !== 2) {
    throw "Error: 2 arguments expected";
  }
  if (!userId) {
    return null;
  }
  gameId = await validate.checkId(gameId, "GameId");
  userId = await validate.checkId(userId, "UserId");

  const userCollection = await users();

  const user = await userCollection.findOne({ _id: ObjectId(userId) });
  if (user === null) throw "Error: User not found";
  const friendList = user.friends;
  if (friendList.length == 0) {
    return null;
  }
  let total = 0; //running total of the reviews
  let reviewCount = 0; //number of freinds that rated the game
  for (f of friendList) {
    //f is id of a friend
    let friend = await userCollection.findOne({ _id: ObjectId(f) });
    if (!friend) {
      continue;
    }
    const reviewList = friend.reviews;
    for (r of reviewList) {
      if (
        (await getGameFromReview(r)) == gameId &&
        (await getRatingFromReview(r)) != null
      ) {
        total += await getRatingFromReview(r);
        reviewCount++;
      }
    }

    // await reviews.getGameFromReview(reviewList[0]);
    //todo look in reviews subdocument of the particular game to see if the friend reviewed the game.

    console.log("frrr");
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
