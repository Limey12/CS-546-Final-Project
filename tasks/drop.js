const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const games = data.games;

async function main() {
  try {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();
  } catch (e) {
    console.log(e);
  }

  await dbConnection.closeConnection();
}

main();
