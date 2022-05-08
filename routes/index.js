//I pledge my honor that I have abided by the Stevens Honor System

const gameRoutes = require("./gameRoutes");
const loginRoutes = require("./loginRoutes");
const signupRoutes = require("./signupRoutes");
const logoutRoutes = require("./logoutRoutes");
const rootRoute = require("./rootRoute");
const catalogRoutes = require("./catalogRoutes");
const profileRoutes = require("./profileRoutes");
const reviewRoutes = require("./reviewRoutes");
const userRoutes = require("./userRoutes");
const listRoutes = require("./listRoutes");

const constructorMethod = (app) => {
  app.use("/", rootRoute);
  app.use("/login", loginRoutes);
  app.use("/signup", signupRoutes);
  app.use("/logout", logoutRoutes);
  app.use("/game", gameRoutes);
  app.use("/gamecatalog", catalogRoutes);
  app.use("/Profile", profileRoutes);
  app.use("/Reviews", reviewRoutes);
  app.use("/users", userRoutes);
  app.use("/lists", listRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
