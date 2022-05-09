//I pledge my honor that I have abided by the Stevens Honor System

const gameRoutes = require("./gameRoutes");
const loginRoutes = require("./loginRoutes");
const signupRoutes = require("./signupRoutes");
const logoutRoutes = require("./logoutRoutes");
const rootRoute = require("./rootRoute");
const catalogRoutes = require("./catalogRoutes");
const profileRoutes = require("./profileRoutes");
const userRoutes = require("./userRoutes");
const listRoutes = require("./listRoutes");
const xss = require("xss");

const constructorMethod = (app) => {
  app.use("/", rootRoute);
  app.use("/login", loginRoutes);
  app.use("/signup", signupRoutes);
  app.use("/logout", logoutRoutes);
  app.use("/game", gameRoutes);
  app.use("/gamecatalog", catalogRoutes);
  app.use("/Profile", profileRoutes);
  app.use("/users", userRoutes);
  app.use("/lists", listRoutes);
  app.use("*", (req, res) => {
    return res.status(404).render("pages/error", {
      id: xss(req?.session?.user?.id),
      HTML_title: "error",
      class: "error",
      status: 404,
      message: "page not found",
    });
  });
};

module.exports = constructorMethod;
