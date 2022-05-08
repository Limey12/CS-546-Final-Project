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
const middle = require("../middleware");
const constructorMethod = (app) => {
  //middleware that keeps you logged in as "admin1" (no special privalages at the moment) based on how the server was started
  if (process.argv.includes("admin")) {
    app.use(middle.admin);
  }
  
  app.use("/", rootRoute);
  app.use("/login", loginRoutes);
  app.use("/signup", signupRoutes);
  app.use("/logout", logoutRoutes);
  app.use("/game", gameRoutes);
  app.use("/gamecatalog", catalogRoutes);
  app.use("/Profile", profileRoutes);
  app.use("/Reviews", reviewRoutes);
  app.use("/users", userRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
