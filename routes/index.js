//I pledge my honor that I have abided by the Stevens Honor System

const gameRoutes = require("./gameRoutes");
const rootRoute = require("./rootRoute");

const constructorMethod = (app) => {
    app.use("/", rootRoute);
    app.use("/game", gameRoutes);
    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

module.exports = constructorMethod;
