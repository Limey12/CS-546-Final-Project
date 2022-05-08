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
  const user = await userCollection.findOne(
     { _id : ObjectId(userID) }
  );
 
  for (l of user.lists) {
    if (l.listName == listName) {
      if (!l.games.includes(gameID)) l.games.push(gameID);
    }
  }
  await userCollection.replaceOne(
    { _id: ObjectId(userID) }, user
  );
}

let removeGameFromList = async function (userID, listName, gameID) {
  if (arguments.length != 3) {
    throw "expects 3 args";
  }
  const userCollection = await users();
  const user = await userCollection.findOne(
    {"lists.listName": listName} ,
    {"lists.$": 1, _id : ObjectId(userID) }
  );

  for (l of user.lists) {
    if (l.listName == listName) {
      // l.games.splice(l.games.indexOf(gameID), 1);
    }
  }
  await userCollection.replaceOne(
    { _id: ObjectId(userID) }, user
  );
}

let gameListsByUser = async function (userID) {
  if (arguments.length != 1) {
    throw "expects 1 args";
  }
  if(!ObjectId.isValid(userID)){
    throw "userID must be valid ID";
  }
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(userID)});
  console.log(user)
  return user?.lists;
}

module.exports = {
    createList,
    addGameToList,
    removeGameFromList,
    gameListsByUser,
}