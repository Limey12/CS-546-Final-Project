//I pledge my honor that I have abided by the Stevens Honor System

const routes = require("./routesFile"); // tmp

const constructorMethod = (app) => {
    app.use("/", routes);
    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

module.exports = constructorMethod;
