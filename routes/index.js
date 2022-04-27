//I pledge my honor that I have abided by the Stevens Honor System

const rootRoute = require("./rootRoute"); // tmp
const catalogRoutes = require("./catalogRoutes");

const constructorMethod = (app) => {
    app.use("/", rootRoute);
    app.use("/GameCatalog", catalogRoutes);
    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

module.exports = constructorMethod;
