const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const bcrypt = require("bcrypt");
const reviewData = require("./reviews");
const gameData = require("./games");
const listData = require("./lists");
const { ObjectId } = require("mongodb");
const validate = require("../validation/validation");

const saltRounds = 8;
const numRecs = 2;

//https://advancedweb.hu/asynchronous-array-functions-in-javascript/
const asyncFilter = async (arr, predicate) => {
	const results = await Promise.all(arr.map(predicate));
	return arr.filter((_v, index) => results[index]);
}
const asyncSome =
	async (arr, predicate) => (await asyncFilter(arr, predicate)).length > 0;

const createUser = async function createUser(username, email, password) {
  if (arguments.length !== 3) {
    throw "Error: 3 arguments expected";
  }
  username = await validate.checkUsername(username);
  email = await validate.checkEmail(email);
  password = await validate.checkPassword(password);
  const hash = await bcrypt.hash(password, saltRounds);
  const userCollection = await users();
  const user1 = await userCollection.findOne({ username: username });
  if (user1) throw "Error: User with that username already exists.";
  const user2 = await userCollection.findOne({ email: email });
  if (user2) throw "Error: User with that email already exists.";
  let newUser = {
    username: username,
    bio: "",
    email: email,
    password: hash,
    favoriteGameId: "",
    leastFavoriteGameId: "",
    reviews: [],
    comments: [],
    friends: [],
  };
  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Error: Could not add user";
  newUser._id = newUser._id.toString();
  await listData.createList(newUser._id, "Played Games", true);
  return newUser;
};

const checkUser = async function checkUser(username, password) {
  if (arguments.length !== 2) {
    throw "Error: 2 arguments expected";
  }
  username = await validate.checkUsername(username);
  password = await validate.checkPassword(password);
  const userCollection = await users();
  const user = await userCollection.findOne({ username: username });
  if (!user) throw "Either the username or password is invalid";
  let comp = false;
  try {
    comp = await bcrypt.compare(password, user.password);
  } catch {
    //no op
  }
  if (comp) {
    return { authenticated: true };
  } else {
    throw "Either the username or password is invalid";
  }
};

const addFriend = async function addFriend(uID1, uID2) {
  //adds uID1 to uID2's freind list and vice versa
  if (arguments.length !== 2) {
    throw "Error: 2 arguments expected";
  }
  uID1 = await validate.checkId(uID1, "UserId1");
  uID2 = await validate.checkId(uID2, "UserId2");
  try {
    const userCollection = await users();
    const userUpdateInfo1 = await userCollection.updateOne({_id : ObjectId(uID1)}, {$push: {friends : uID2}});
    const userUpdateInfo2 = await userCollection.updateOne({_id : ObjectId(uID2)}, {$push: {friends : uID1}});
    if ((!userUpdateInfo1.matchedCount && !userUpdateInfo1.modifiedCount) || (!userUpdateInfo2.matchedCount && !userUpdateInfo2.modifiedCount))
      throw "Error: Update failed";
  } catch (e) {
    console.log(e);
  }
  return;
}

const usernameToID = async function usernameToID(username) {
  if (arguments.length !== 1) {
    throw "Error: 1 argument expected";
  }
  username = await validate.checkUsername(username);
  const userCollection = await users();
  const user = await userCollection.findOne({ username: username });
  if (!user?._id) {
    throw "Error: User not found";
  }
  return user._id.toString();
}

const getRecommendations = async function getRecommendations(username) {
  if (arguments.length !== 1) {
    throw "Error: 1 argument expected";
  }
  username = await validate.checkUsername(username);
  const userCollection = await users();
  const user = await userCollection.findOne({ username: username });
  if (!user) throw "Error: User not found";
  let fav = user.favoriteGameId;
  const reviews = user.reviews;
  if(!fav && reviews.length == 0) {
    let games = await gameData.getAllGames();
    games = games.sort(function(){return .5 - Math.random()});
    return games.slice(0, numRecs);
  }
  else if(!fav) {
    let max = 0;
    for(let i = 0; i < reviews.length; i++) {
      if(await reviewData.getRatingFromReview(reviews[i]) > max) {
        max = await reviewData.getRatingFromReview(reviews[i]);
        fav = (await reviewData.getGameFromReview(reviews[i])).toString();
      }
    }
  }
  let games = await gameData.getRecommendations(fav);
  games = await asyncFilter(games, async game => {
    return !await asyncSome(reviews, async r => (await reviewData.getGameFromReview(r)).toString() === game._id);
  });
  games = games.sort(function(){return .5 - Math.random()});
  if(games.length < numRecs) {
    let tmp = await gameData.getAllGames()
    tmp = tmp.sort(function(){return .5 - Math.random()});
    tmp = tmp.filter(g1 => {
      return !games.some(g2 => (g1._id === g2._id));
    });
    games = games.concat(tmp);
  }
  return games.slice(0, numRecs);
}

const IDtoUsername = async function(userId) {
  if (arguments.length !== 1) {
    throw "Error: 1 argument expected";
  }
  userId = await validate.checkId(userId, "UserId");
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!user?._id) {
    throw "Error: User not found";
  }
  return user.username;
}

const favorite = async function(userId, gameId) {
  if (arguments.length !== 2) {
    throw "Error: 2 arguments expected";
  }
  userId = await validate.checkId(userId, "UserId");
  gameId = await validate.checkId(gameId, "GameId");
  const userCollection = await users();
  const updateInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: {favoriteGameId : gameId} }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Error: Update failed";
}

const leastfavorite = async function(userId, gameId) {
  if (arguments.length !== 2) {
    throw "Error: 2 arguments expected";
  }
  userId = await validate.checkId(userId, "UserId");
  gameId = await validate.checkId(gameId, "GameId");
  const userCollection = await users();
  const updateInfo = await userCollection.updateOne(
    { _id: ObjectId(uID) },
    { $set: {leastFavoriteGameId : gameID} }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Error: Update failed";
}

const updateBio = async function(userId, bio) {
  if (arguments.length !== 2) {
    throw "Error: 2 arguments expected";
  }
  userId = await validate.checkId(userId, "UserId");
  bio = await validate.checkString(bio, "Bio");
  const userCollection = await users();
  const updateInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: {bio : bio} }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Error: Update failed";
}

const getUser = async function getUser(id) {
  if (arguments.length !== 1) {
    throw "Error: 1 argument expected";
  }
  id = await validate.checkId(id, "Id");
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(id) });
  if (!user?._id) {
    throw "Error: User not found";
  }
  return user;
}

//Get Users Stuff

let getUserSearchTerm = async function getUserSearchTerm(term) {
  if (arguments.length !== 1) {
    throw "Error: 1 argument expected";
  }
  term = await validate.checkString(term, "Term");
  const userCollection = await users();
  const userlist = await userCollection
    .find({ username: { $regex: term, $options: "i" } })
    .toArray();
  for (i of userlist) {
    i["_id"] = i["_id"].toString();
  }
  return userlist;
};

module.exports = {
  createUser,
  checkUser,
  usernameToID,
  addFriend,
  getRecommendations,
  IDtoUsername,
  favorite,
  leastfavorite,
  updateBio,
  getUserSearchTerm,
  getUser,
};
