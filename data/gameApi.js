const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;
const { ObjectId } = require("mongodb");

let getAverageRatingAmongFriends = function () {
    //todo
};

let getGameFromId = function () {
    //todo
};

let getImageFromGameId = function () {
    //todo
};

module.exports = {
    getAverageRatingAmongFriends,
    getGameFromId,
    getImageFromGameId,
};
