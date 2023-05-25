module.exports = app => {
  const users = require("../controllers/users.controllers.js");
  const auth = require("../controllers/auth.controllers.js");
  const trans = require("../controllers/translation.controller.js");
  const authMiddleware = require('../middlewares/auth.middleware.js');

  var router = require("express").Router();

  // Create a new User
  router.post("/", users.create);

  // Authenticate a User
  router.post("/authenticate", auth.authentificate);

  // Save translations
  router.post('/:userId/translations', trans.saveTranslation);

  // Get translations
  router.get("/:id/translations", trans.getTranslations);

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

  // Get UserId for the current user
  router.get("/me/getUserId", authMiddleware, users.getUserId);

  // Delete Translation
  router.delete("/:userId/translations/:translationId", trans.deleteTranslation);

  app.use("/api/users", router);
};
