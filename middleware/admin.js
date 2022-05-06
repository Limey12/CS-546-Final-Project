const data = require("../data");
const userData = data.users;

const admin = async function(req, res, next) {
  let id = 1;
  try {
    id = await userData.usernameToID("admin");
  } catch (e) {
     console.log(e)
  }

  req.session.user = { username: "admin", id: id};
  next();
}

module.exports = admin;