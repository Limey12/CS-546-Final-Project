const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");
const session = require("express-session");

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "AuthCookie",
    secret: "game time",
    resave: false,
    saveUninitialized: true,
  })
);

const hmissing = function(context, options) {
  console.error("Template defines {{" + context.name + "}}, but not provided in context");
  return "{{" + context.name + "}}";
}

var hbs = exphbs.create({
  helpers: {
    helperMissing: hmissing
  },
  defaultLayout: "main"
})

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
