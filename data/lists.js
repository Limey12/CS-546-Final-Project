const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const validate = require("../validation/validation");

let createList = async function (userId, listName, public) {
  if (arguments.length !== 3) {
    throw "Error: 3 arguments expected";
  }
  userId = await validate.checkId(userId, "UserId");
  listName = await validate.checkString(listName, "List Name");
  public = await validate.checkBool(public, "Public");
  //make sure user AND game exist
  //along with normal stuff
  const userCollection = await users();
  const newList = {
    _id: new ObjectId(),
    public: public,
    listName: listName,
    games: [],
  };

  const updateInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $push: { lists: newList } }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Error: Update failed";
  return newList;
};

let addGameToList = async function (userId, listName, gameId) {
  if (arguments.length !== 3) {
    throw "Error: 3 arguments expected";
  }
  userId = await validate.checkId(userId, "UserId");
  listName = await validate.checkString(listName, "List Name");
  gameId = await validate.checkId(gameId, "GameId");
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(userId) });
  if (user === null) {
    throw "Error: User not found";
  }

  for (l of user.lists) {
    if (l.listName == listName) {
      if (!l.games.includes(gameId)) l.games.push(gameId);
    }
  }
  await userCollection.replaceOne({ _id: ObjectId(userId) }, user);
};

let removeGameFromList = async function (userId, listName, gameId) {
  if (arguments.length !== 3) {
    throw "Error: 3 arguments expected";
  }
  userId = await validate.checkId(userId, "UserId");
  listName = await validate.checkString(listName, "List Name");
  gameId = await validate.checkId(gameId, "GameId");
  const userCollection = await users();
  const user = await userCollection.findOne(
    { "lists.listName": listName },
    { "lists.$": 1, _id: ObjectId(userId) }
  );
  if (user === null) {
    throw "Error: User not found";
  }

  for (l of user.lists) {
    if (l.listName == listName) {
      // l.games.splice(l.games.indexOf(gameId), 1);
    }
  }
  const removeInfo = await userCollection.replaceOne(
    { _id: ObjectId(userId) },
    user
  );
  if (!removeInfo.matchedCount && !removeInfo.modifiedCount)
    throw "Error: Remove failed";
};

let gameListsByUser = async function (userId) {
  if (arguments.length !== 1) {
    throw "Error: 1 argument expected";
  }
  userId = await validate.checkId(userId, "UserId");
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(userId) });
  if (user === null) {
    throw "Error: User not found";
  }
  return user?.lists;
};

module.exports = {
  createList,
  addGameToList,
  removeGameFromList,
  gameListsByUser,
};
