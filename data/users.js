const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const bcrypt = require("bcrypt");
const validator = require("email-validator");
const { ObjectId } = require("mongodb");

const saltRounds = 8;

const createUser = async function createUser(username, email, password) {
  if (!username || !email || !password)
    throw "All fields need to have valid values.";
  if (typeof username !== "string") throw "Username must be a string.";
  username = username.toLowerCase();
  if (!/^[a-z0-9]+$/i.test(username)) throw "Username must be alphanumeric.";
  if (username.length < 4) throw "Username must be at least 4 characters long.";
  if (typeof email !== "string") throw "Email must be a string.";
  if (!validator.validate(email)) throw "Email must be valid.";
  if (typeof password !== "string") throw "Password must be a string.";
  if (/\s/.test(password)) throw "Password must not contain any spaces.";
  if (password.length < 6) throw "Password must be at least 6 characters long.";
  const hash = await bcrypt.hash(password, saltRounds);
  const userCollection = await users();
  const user1 = await userCollection.findOne({ username: username });
  if (user1) throw "User with that username already exists.";
  const user2 = await userCollection.findOne({ email: email });
  if (user2) throw "User with that email already exists.";
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
    throw "Could not add user.";
  newUser._id = newUser._id.toString();
  return newUser;
};

const checkUser = async function checkUser(username, password) {
  if (!username || !password) throw "All fields need to have valid values.";
  if (typeof username !== "string") throw "Username must be a string.";
  username = username.trim();
  username = username.toLowerCase();
  if (!/^[a-z0-9]+$/i.test(username)) throw "Username must be alphanumeric.";
  if (username.length < 4) throw "Username must be at least 4 characters long.";
  if (typeof password !== "string") throw "Password must be a string.";
  if (/\s/.test(password)) throw "Password must not contain any spaces.";
  if (password.length < 6) throw "Username must be at least 6 characters long.";
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
  try {
    const userCollection = await users();
    await userCollection.updateOne({_id : ObjectId(uID1)}, {$push: {friends : uID2}});
    await userCollection.updateOne({_id : ObjectId(uID2)}, {$push: {friends : uID1}});
  } catch (e) {
    console.log(e);
  }
  return;
}

const usernameToID = async function usernameToID(username) {
  if (!username) {
    throw "username must be provided";
  }
  if (typeof username !== "string") throw "Username must be a string.";
  username = username.trim().toLowerCase();
  const userCollection = await users();
  const user = await userCollection.findOne({ username: username });
  if (!user?._id) {
    throw "no user with that name"
  }
  return user._id.toString();
}

const IDtoUsername = async function(uID) {
  if (!uID) {
    throw "uID must be provided";
  }
  if (typeof uID !== "string") throw "uID must be a string.";
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(uID) });
  if (!user?._id) {
    throw "no user with that id"
  }
  return user.username;
}

const favorite = async function(uID, gameID) {
  const userCollection = await users();
  await userCollection.updateOne(
    { _id: ObjectId(uID) },
    { $set: {favoriteGameId : gameID} }
  );
}

const leastfavorite = async function(uID, gameID) {
  const userCollection = await users();
  await userCollection.updateOne(
    { _id: ObjectId(uID) },
    { $set: {leastFavoriteGameId : gameID} }
  );
}

module.exports = {
  createUser,
  checkUser,
  usernameToID,
  addFriend,
  IDtoUsername,
  favorite,
  leastfavorite,
};
