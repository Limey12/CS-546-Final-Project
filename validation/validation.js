const axios = require("axios");
const { ObjectId } = require("mongodb");
const validator = require("email-validator");

const checkId = async function checkId(id, varName) {
  if (!id) throw `Error: You must provide ${varName}`;
  if (typeof id !== "string") throw `Error: ${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
};

const checkString = async function checkString(strVal, varName) {
  if (!strVal) throw `Error: You must provide ${varName}`;
  if (typeof strVal !== "string") throw `Error: ${varName} must be a string`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  return strVal;
};

const checkBool = async function checkBool(bool, varName) {
  if (!bool) throw `Error: You must provide ${varName}`;
  if (typeof id !== "boolean") throw `Error: ${varName} must be a boolean`;
  return bool;
}

const checkImage = async function checkImage(url) {
  try {
    let req = await axios.head(url);
    if (req.status != 200 || !req.headers["content-type"].includes("image"))
      throw "Error: Not an image link";
  } catch (e) {
    throw "Error: Not an image link";
  }
};

const checkUsername = async function checkUsername(username) {
  if (!username)
    throw "Error: You must provide username";
  if (typeof username !== "string") throw "Error: Username must be a string";
  username = username.toLowerCase();
  if (!/^[a-z0-9]+$/i.test(username)) throw "Error: Username must be alphanumeric";
  if (username.length < 4) throw "Error: Username must be at least 4 characters long";
  return username;
}

const checkEmail = async function checkEmail(email) {
  if (!email)
    throw "Error: You must provide email";
  if (typeof email !== "string") throw "Error: Email must be a string";
  if (!validator.validate(email)) throw "Error: Email must be valid";
  return email;
}

const checkPassword = async function checkPassword(password) {
  if (!password)
    throw "Error: You must provide email";
  if (typeof password !== "string") throw "Error: Password must be a string";
  if (/\s/.test(password)) throw "Error: Password must not contain any spaces";
  if (password.length < 6) throw "Error: Password must be at least 6 characters long";
  return password;
}

// TO DELETE

const checkTitle = async function checkTitle(title) {
  if (!title) {
    throw "Title not provided";
  }

  if (typeof title !== "string") {
    throw "Description not string";
  }

  title = title.trim();

  if (title.length <= 0) {
    throw "Description Cannot be an empty string";
  }
};

const checkDescription = async function checkDescription(description) {
  if (!description) {
    throw "Description not provided";
  }

  if (typeof description !== "string") {
    throw "Description not string";
  }

  description = description.trim();

  if (description.length <= 0) {
    throw "Description cannot be an empty string";
  }
};

// END

module.exports = {
  checkId,
  checkString,
  checkBool,
  checkImage,
  checkUsername,
  checkEmail,
  checkPassword,
  // TO DELETE
  checkDescription,
  checkTitle,
  // END
};
