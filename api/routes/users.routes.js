module.exports = app => {
  const users = require("../controllers/users.controllers.js");
  const auth = require("../controllers/auth.controllers.js");
  const authMiddleware = require('../middlewares/auth.middleware.js');

  var router = require("express").Router();

  // Create a new User
  router.post("/register", auth.register);

  // Authenticate a User
  router.post("/authentificate", auth.authentificate);

  // Refresh a User's Token
  router.post("/refreshToken", auth.refreshToken);

  // Create a new User
  router.post("/", users.create);

  // Get UserId for the current user
  router.get("/me", authMiddleware, users.getUserId);

  // Retrieve all Users
  router.get("/", users.findAll);

  // Retrieve all published Users
  router.get("/published", users.findAllPublished);

  // Retrieve a single Users with id
  router.get("/:id", users.findOne);

  // Update a Users with id
  router.put("/:id", users.update);

  // Delete a Users with id
  router.delete("/:id", users.delete);

  // Create a new Users
  router.delete("/", users.deleteAll);

  app.use("/api/users", router);

};
