const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const User = require("./user.model.js")(mongoose);
const Translation = require("./translation.model.js")(mongoose);

module.exports = {
  mongoose,
  User, 
  Translation
};

