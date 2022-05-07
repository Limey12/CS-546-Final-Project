const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");

let createList = async function (userID, listName, public) {
  if (arguments.length != 3) {
    throw "expects 3 args";
  }
  //todo more input validation
  //make sure user AND game exist
  //along with normal stuff
  const userCollection = await users();
  const newList = {
    _id: new ObjectId(),
    public: public,
    listName: listName,
    games: []
  };
  
  await userCollection.updateOne(
    { _id: ObjectId(userID) },
    { $push: { lists: newList } }
  );
  return newList;
};

let addGameToList = async function (userID, listName, gameID) {
  if (arguments.length != 3) {
      throw "expects 3 args";
  }
  const userCollection = await users();
  await userCollection.updateOne(
    { _id : ObjectId(userID), 'lists.listName' : listName },
    { $push : { 'games' : gameID} }
  );
}

module.exports = {
    createList,
    addGameToList,
}