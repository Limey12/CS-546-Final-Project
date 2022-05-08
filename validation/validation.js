const axios = require("axios");
const { ObjectId } = require("mongodb");

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

const checkImage = async function checkImage(url) {
  try {
    let req = await axios.head(url);
    if (req.status != 200 || !req.headers["content-type"].includes("image"))
      throw "Error: Not an image link";
  } catch (e) {
    throw "Error: Not an image link";
  }
};

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
  checkImage,
  // TO DELETE
  checkDescription,
  checkTitle,
  // END
};
