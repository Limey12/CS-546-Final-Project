const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const games = data.games;

async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();
    await dbConnection.closeConnection();
}

main();