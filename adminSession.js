const dbConnection = require("./config/mongoConnection");
const data = require("./data");
const games = data.games;
const users = data.users;
const reviews = data.reviews;

module.exports = async function adminSess() {
  const db = await dbConnection.dbConnection();
  try {
    await users.createUser("admin", "admin@admin.com", "admin_");
  } catch (e) {
    console.log(e)
  }
}